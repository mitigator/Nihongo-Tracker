import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AnkiDeck, { IAnkiDeck, JLPTLevel, JLPT_LEVELS, DECK_COLORS } from "@/lib/models/AnkiDeck";
import AnkiCard, { IAnkiCard, CardType, CARD_TYPES, SRSRating } from "@/lib/models/AnkiCard";
import AnkiDeckProgress from "@/lib/models/AnkiDeckProgress";
import { IUser } from "@/lib/models/User";
import { Types } from "mongoose";
import {
  applyRating,
  filterDueCards,
  splitNewAndReview,
  getCardState,
  CardState,
} from "@/lib/utils/srsUtils";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Normalise a Date to midnight UTC for daily bucketing. */
function toMidnightUTC(d: Date = new Date()): Date {
  const out = new Date(d);
  out.setUTCHours(0, 0, 0, 0);
  return out;
}

/**
 * Infer a JLPT level from a deck name, e.g. "N5 vocab" → "N5".
 * Returns null when no level is detected.
 */
function inferJLPTFromName(name: string): JLPTLevel | null {
  const match = name.toUpperCase().match(/\b(N[12345])\b/);
  if (match && JLPT_LEVELS.includes(match[1] as JLPTLevel)) {
    return match[1] as JLPTLevel;
  }
  return null;
}

/**
 * Find the deck to auto-assign a card to based on its jlptLevel.
 * Falls back to the user's "Unsorted" deck (creates it if missing).
 */
async function resolveAutoAssignDeck(
  userId: Types.ObjectId,
  jlptLevel: JLPTLevel | null
): Promise<Types.ObjectId> {
  if (jlptLevel) {
    const deck = await AnkiDeck.findOne({ user: userId, jlptLevel });
    if (deck) return deck._id as Types.ObjectId;
  }

  // Fall back to Unsorted deck — create if it doesn't exist yet.
  const unsorted = await AnkiDeck.findOneAndUpdate(
    { user: userId, name: "Unsorted" },
    {
      $setOnInsert: {
        user: userId,
        name: "Unsorted",
        description: "Cards without a specific deck",
        jlptLevel: null,
        color: DECK_COLORS[0],
        dailyReviewTarget: 10,
        newCardsPerDay: 5,
        cardCount: 0,
      },
    },
    { upsert: true, new: true }
  );
  return unsorted._id as Types.ObjectId;
}

/** Increment or decrement a deck's denormalized cardCount safely. */
async function adjustCardCount(deckId: Types.ObjectId, delta: 1 | -1) {
  await AnkiDeck.findByIdAndUpdate(deckId, { $inc: { cardCount: delta } });
}

/** Upsert today's progress doc and apply rating increment. */
async function logReviewProgress(
  userId: Types.ObjectId,
  deckId: Types.ObjectId,
  rating: SRSRating,
  isNewCard: boolean
) {
  const today = toMidnightUTC();
  const ratingField = `${rating}Count` as
    | "againCount"
    | "hardCount"
    | "goodCount"
    | "easyCount";

  await AnkiDeckProgress.findOneAndUpdate(
    { user: userId, deck: deckId, date: today },
    {
      $inc: {
        reviewedCount: 1,
        newCardsStudied: isNewCard ? 1 : 0,
        [ratingField]: 1,
      },
    },
    { upsert: true }
  );
}

// ─────────────────────────────────────────────
// DECK — GET ALL
// @route   GET /api/anki/decks
// ─────────────────────────────────────────────
export async function getDecks(
  _req: NextRequest,
  user: IUser
): Promise<NextResponse> {
  await connectDB();

  const today = toMidnightUTC();
  const decks = await AnkiDeck.find({ user: user._id }).sort({ createdAt: 1 });

  // Attach today's progress and due count for each deck.
  const decksWithMeta = await Promise.all(
    decks.map(async (deck) => {
      const deckId = deck._id as Types.ObjectId;

      const [progress, dueCount] = await Promise.all([
        AnkiDeckProgress.findOne({
          user: user._id,
          deck: deckId,
          date: today,
        }),
        AnkiCard.countDocuments({
          user: user._id,
          deck: deckId,
          dueDate: { $lte: new Date() },
        }),
      ]);

      return {
        _id: deck._id,
        name: deck.name,
        description: deck.description,
        jlptLevel: deck.jlptLevel,
        color: deck.color,
        dailyReviewTarget: deck.dailyReviewTarget,
        newCardsPerDay: deck.newCardsPerDay,
        cardCount: deck.cardCount,
        dueCount,
        todayProgress: {
          reviewedCount: progress?.reviewedCount ?? 0,
          newCardsStudied: progress?.newCardsStudied ?? 0,
          againCount: progress?.againCount ?? 0,
          hardCount: progress?.hardCount ?? 0,
          goodCount: progress?.goodCount ?? 0,
          easyCount: progress?.easyCount ?? 0,
        },
        createdAt: deck.createdAt,
        updatedAt: deck.updatedAt,
      };
    })
  );

  return NextResponse.json({ count: decks.length, decks: decksWithMeta });
}

// ─────────────────────────────────────────────
// DECK — CREATE
// @route   POST /api/anki/decks
// ─────────────────────────────────────────────
export async function createDeck(
  req: NextRequest,
  user: IUser
): Promise<NextResponse> {
  await connectDB();

  const body = await req.json();
  const { name, description, jlptLevel, color, dailyReviewTarget, newCardsPerDay } =
    body;

  if (!name?.trim()) {
    return NextResponse.json(
      { message: "Deck name is required" },
      { status: 400 }
    );
  }

  // Auto-infer JLPT level from name if not explicitly set.
  const resolvedLevel: JLPTLevel | null =
    jlptLevel ?? inferJLPTFromName(name);

  try {
    const deck = await AnkiDeck.create({
      user: user._id,
      name: name.trim(),
      description: description?.trim() ?? "",
      jlptLevel: resolvedLevel,
      color: color ?? DECK_COLORS[0],
      dailyReviewTarget: dailyReviewTarget ?? 10,
      newCardsPerDay: newCardsPerDay ?? 5,
      cardCount: 0,
    });

    return NextResponse.json(deck, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { message: `A deck named "${name}" already exists` },
        { status: 409 }
      );
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json({ message: messages.join(", ") }, { status: 400 });
    }
    throw error;
  }
}

// ─────────────────────────────────────────────
// DECK — GET ONE
// @route   GET /api/anki/decks/[id]
// ─────────────────────────────────────────────
export async function getDeck(
  _req: NextRequest,
  user: IUser,
  id: string
): Promise<NextResponse> {
  await connectDB();

  const deck = await AnkiDeck.findById(id);
  if (!deck) {
    return NextResponse.json({ message: "Deck not found" }, { status: 404 });
  }
  if (deck.user.toString() !== user._id.toString()) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  const cards = await AnkiCard.find({ user: user._id, deck: id }).sort({
    createdAt: -1,
  });

  return NextResponse.json({ deck, cards });
}

// ─────────────────────────────────────────────
// DECK — UPDATE
// @route   PATCH /api/anki/decks/[id]
// ─────────────────────────────────────────────
export async function updateDeck(
  req: NextRequest,
  user: IUser,
  id: string
): Promise<NextResponse> {
  await connectDB();

  const deck = await AnkiDeck.findById(id);
  if (!deck) {
    return NextResponse.json({ message: "Deck not found" }, { status: 404 });
  }
  if (deck.user.toString() !== user._id.toString()) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();
  const allowed: (keyof IAnkiDeck)[] = [
    "name",
    "description",
    "jlptLevel",
    "color",
    "dailyReviewTarget",
    "newCardsPerDay",
  ];

  for (const key of allowed) {
    if (body[key] !== undefined) {
      (deck as any)[key] = body[key];
    }
  }

  try {
    await deck.save();
    return NextResponse.json(deck);
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { message: `A deck named "${body.name}" already exists` },
        { status: 409 }
      );
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json({ message: messages.join(", ") }, { status: 400 });
    }
    throw error;
  }
}

// ─────────────────────────────────────────────
// DECK — DELETE
// @route   DELETE /api/anki/decks/[id]
// ─────────────────────────────────────────────
export async function deleteDeck(
  req: NextRequest,
  user: IUser,
  id: string
): Promise<NextResponse> {
  await connectDB();

  const deck = await AnkiDeck.findById(id);
  if (!deck) {
    return NextResponse.json({ message: "Deck not found" }, { status: 404 });
  }
  if (deck.user.toString() !== user._id.toString()) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  const { action } = await req.json().catch(() => ({ action: "delete" }));

  if (action === "move") {
    // Move all cards in this deck to Unsorted before deleting.
    const unsortedId = await resolveAutoAssignDeck(
      user._id as Types.ObjectId,
      null
    );
    const moved = await AnkiCard.updateMany(
      { user: user._id, deck: id },
      { $set: { deck: unsortedId, manuallyAssigned: true } }
    );
    await adjustCardCount(unsortedId, moved.modifiedCount as any);
  } else {
    // Hard delete all cards in this deck.
    await AnkiCard.deleteMany({ user: user._id, deck: id });
  }

  await AnkiDeckProgress.deleteMany({ user: user._id, deck: id });
  await deck.deleteOne();

  return NextResponse.json({ message: "Deck deleted", id });
}

// ─────────────────────────────────────────────
// DECK REVIEW — GET DUE CARDS
// @route   GET /api/anki/decks/[id]/review
// ─────────────────────────────────────────────
export async function getDeckReview(
  _req: NextRequest,
  user: IUser,
  deckId: string
): Promise<NextResponse> {
  await connectDB();

  const deck = await AnkiDeck.findById(deckId);
  if (!deck) {
    return NextResponse.json({ message: "Deck not found" }, { status: 404 });
  }
  if (deck.user.toString() !== user._id.toString()) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  const today = toMidnightUTC();

  // How many new cards has the user already studied today for this deck?
  const todayProgress = await AnkiDeckProgress.findOne({
    user: user._id,
    deck: deckId,
    date: today,
  });
  const newCardsStudiedToday = todayProgress?.newCardsStudied ?? 0;
  const newCardSlots = Math.max(
    0,
    deck.newCardsPerDay - newCardsStudiedToday
  );

  const allDue = await AnkiCard.find({
    user: user._id,
    deck: deckId,
    dueDate: { $lte: new Date() },
  }).sort({ dueDate: 1 });

  const { newCards, reviewCards } = splitNewAndReview(allDue);

  // Cap new cards by the daily new-card limit.
  const cappedNew = newCards.slice(0, newCardSlots);
  const dueCards = [...reviewCards, ...cappedNew];

  return NextResponse.json({
    deckId,
    dueCount: dueCards.length,
    reviewedToday: todayProgress?.reviewedCount ?? 0,
    dailyReviewTarget: deck.dailyReviewTarget,
    cards: dueCards,
  });
}

// ─────────────────────────────────────────────
// DECK REVIEW — SUBMIT RATING
// @route   POST /api/anki/decks/[id]/review
// ─────────────────────────────────────────────
export async function submitDeckReview(
  req: NextRequest,
  user: IUser,
  deckId: string
): Promise<NextResponse> {
  await connectDB();

  const body = await req.json();
  const { cardId, rating } = body as { cardId: string; rating: SRSRating };

  const validRatings: SRSRating[] = ["again", "hard", "good", "easy"];
  if (!cardId || !validRatings.includes(rating)) {
    return NextResponse.json(
      { message: "cardId and a valid rating (again|hard|good|easy) are required" },
      { status: 400 }
    );
  }

  const card = await AnkiCard.findById(cardId);
  if (!card) {
    return NextResponse.json({ message: "Card not found" }, { status: 404 });
  }
  if (card.user.toString() !== user._id.toString()) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  const isNewCard = card.repetitions === 0;

  // Apply SM-2 algorithm.
  const result = applyRating(
    {
      interval: card.interval,
      easeFactor: card.easeFactor,
      repetitions: card.repetitions,
      dueDate: card.dueDate,
    },
    rating
  );

  card.interval = result.interval;
  card.easeFactor = result.easeFactor;
  card.repetitions = result.repetitions;
  card.dueDate = result.dueDate;
  await card.save();

  // Log progress for analytics.
  await logReviewProgress(
    user._id as Types.ObjectId,
    card.deck as Types.ObjectId,
    rating,
    isNewCard
  );

  return NextResponse.json({
    cardId,
    rating,
    nextReviewLabel: result.nextReviewLabel,
    dueDate: result.dueDate,
    interval: result.interval,
  });
}

// ─────────────────────────────────────────────
// CARDS — GET ALL (filterable by deckId)
// @route   GET /api/anki/cards
// ─────────────────────────────────────────────
export async function getCards(
  req: NextRequest,
  user: IUser
): Promise<NextResponse> {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const deckId = searchParams.get("deckId");
  const type = searchParams.get("type") as CardType | null;
  const jlptLevel = searchParams.get("jlptLevel") as JLPTLevel | null;

  const query: Record<string, any> = { user: user._id };
  if (deckId) query.deck = deckId;
  if (type && CARD_TYPES.includes(type)) query.type = type;
  if (jlptLevel && JLPT_LEVELS.includes(jlptLevel)) query.jlptLevel = jlptLevel;

  const cards = await AnkiCard.find(query)
    .populate("deck", "name color jlptLevel")
    .sort({ createdAt: -1 });

  return NextResponse.json({ count: cards.length, cards });
}

// ─────────────────────────────────────────────
// CARDS — CREATE
// @route   POST /api/anki/cards
// ─────────────────────────────────────────────
export async function createCard(
  req: NextRequest,
  user: IUser
): Promise<NextResponse> {
  await connectDB();

  const body = await req.json();
  const { front, back, type, jlptLevel, deckId, sourceEntryId } = body;

  if (!front?.trim() || !back?.trim()) {
    return NextResponse.json(
      { message: "front and back are required" },
      { status: 400 }
    );
  }
  if (!type || !CARD_TYPES.includes(type)) {
    return NextResponse.json(
      { message: `type must be one of: ${CARD_TYPES.join(", ")}` },
      { status: 400 }
    );
  }

  // Resolve which deck this card belongs to.
  let resolvedDeckId: Types.ObjectId;
  let manuallyAssigned = false;

  if (deckId) {
    // Caller explicitly chose a deck — mark as manually assigned.
    const deck = await AnkiDeck.findById(deckId);
    if (!deck || deck.user.toString() !== user._id.toString()) {
      return NextResponse.json({ message: "Deck not found" }, { status: 404 });
    }
    resolvedDeckId = deck._id as Types.ObjectId;
    manuallyAssigned = true;
  } else {
    // Auto-assign based on jlptLevel or fall back to Unsorted.
    resolvedDeckId = await resolveAutoAssignDeck(
      user._id as Types.ObjectId,
      jlptLevel ?? null
    );
  }

  try {
    const card = await AnkiCard.create({
      user: user._id,
      deck: resolvedDeckId,
      front: front.trim(),
      back: back.trim(),
      type,
      jlptLevel: jlptLevel ?? null,
      manuallyAssigned,
      sourceEntry: sourceEntryId ?? null,
    });

    await adjustCardCount(resolvedDeckId, 1);

    return NextResponse.json(card, { status: 201 });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json({ message: messages.join(", ") }, { status: 400 });
    }
    throw error;
  }
}

// ─────────────────────────────────────────────
// CARDS — UPDATE (edit or move deck)
// @route   PATCH /api/anki/cards/[id]
// ─────────────────────────────────────────────
export async function updateCard(
  req: NextRequest,
  user: IUser,
  id: string
): Promise<NextResponse> {
  await connectDB();

  const card = await AnkiCard.findById(id);
  if (!card) {
    return NextResponse.json({ message: "Card not found" }, { status: 404 });
  }
  if (card.user.toString() !== user._id.toString()) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();
  const { front, back, type, jlptLevel, deckId } = body;

  if (front !== undefined) card.front = front.trim();
  if (back !== undefined) card.back = back.trim();
  if (type !== undefined && CARD_TYPES.includes(type)) card.type = type;
  if (jlptLevel !== undefined) card.jlptLevel = jlptLevel;

  // Moving to a different deck.
  if (deckId !== undefined && deckId !== card.deck.toString()) {
    const newDeck = await AnkiDeck.findById(deckId);
    if (!newDeck || newDeck.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        { message: "Target deck not found" },
        { status: 404 }
      );
    }
    const oldDeckId = card.deck as Types.ObjectId;
    card.deck = newDeck._id as any;
    card.manuallyAssigned = true; // lock — never auto-reassign again

    await adjustCardCount(oldDeckId, -1);
    await adjustCardCount(newDeck._id as Types.ObjectId, 1);
  }

  try {
    await card.save();
    return NextResponse.json(card);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json({ message: messages.join(", ") }, { status: 400 });
    }
    throw error;
  }
}

// ─────────────────────────────────────────────
// CARDS — DELETE
// @route   DELETE /api/anki/cards/[id]
// ─────────────────────────────────────────────
export async function deleteCard(
  _req: NextRequest,
  user: IUser,
  id: string
): Promise<NextResponse> {
  await connectDB();

  const card = await AnkiCard.findById(id);
  if (!card) {
    return NextResponse.json({ message: "Card not found" }, { status: 404 });
  }
  if (card.user.toString() !== user._id.toString()) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  await adjustCardCount(card.deck as Types.ObjectId, -1);
  await card.deleteOne();

  return NextResponse.json({ message: "Card deleted", id });
}

// ─────────────────────────────────────────────
// ANALYTICS — GET ANKI STATS
// @route   GET /api/anki/analytics
// ─────────────────────────────────────────────
export async function getAnkiAnalytics(
  _req: NextRequest,
  user: IUser
): Promise<NextResponse> {
  await connectDB();

  const now = new Date();
  const userId = user._id as Types.ObjectId;

  // Last 7 days of progress across all decks.
  const sevenDaysAgo = toMidnightUTC(
    new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
  );

  const [last7, last30Raw, allCards, decks] = await Promise.all([
    // Daily totals for bar chart.
    AnkiDeckProgress.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: "$date",
          reviewed: { $sum: "$reviewedCount" },
          newCards: { $sum: "$newCardsStudied" },
          good: { $sum: "$goodCount" },
          easy: { $sum: "$easyCount" },
          total: {
            $sum: {
              $add: [
                "$againCount",
                "$hardCount",
                "$goodCount",
                "$easyCount",
              ],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    // Last 30 days for retention line chart.
    AnkiDeckProgress.aggregate([
      {
        $match: {
          user: userId,
          date: {
            $gte: toMidnightUTC(
              new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000)
            ),
          },
        },
      },
      {
        $group: {
          _id: "$date",
          good: { $sum: "$goodCount" },
          easy: { $sum: "$easyCount" },
          total: {
            $sum: {
              $add: [
                "$againCount",
                "$hardCount",
                "$goodCount",
                "$easyCount",
              ],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    // All cards for deck health.
    AnkiCard.find({ user: userId }).select(
      "deck repetitions interval dueDate"
    ),

    // All decks for labels.
    AnkiDeck.find({ user: userId }).select("name color"),
  ]);

  // Shape last7 data.
  const last7Days = last7.map((d) => ({
    date: d._id,
    reviewed: d.reviewed,
    newCards: d.newCards,
    retentionRate:
      d.total > 0 ? Math.round(((d.good + d.easy) / d.total) * 100) : null,
  }));

  // Shape last30 data.
  const last30Days = last30Raw.map((d) => ({
    date: d._id,
    retentionRate:
      d.total > 0 ? Math.round(((d.good + d.easy) / d.total) * 100) : null,
  }));

  // Deck health — group cards by state per deck.
  const deckMap = Object.fromEntries(
    decks.map((d) => [
      d._id.toString(),
      { name: d.name, color: d.color, new: 0, learning: 0, review: 0, overdue: 0 },
    ])
  );

  for (const card of allCards) {
    const key = (card.deck as Types.ObjectId).toString();
    if (!deckMap[key]) continue;
    const state: CardState = getCardState(card, now);
    deckMap[key][state]++;
  }

  const deckHealth = Object.values(deckMap);

  // Per-deck today's progress.
  const today = toMidnightUTC();
  const todayProgress = await AnkiDeckProgress.find({
    user: userId,
    date: today,
  }).populate("deck", "name color dailyReviewTarget");

  const perDeckProgress = await Promise.all(
    decks.map(async (deck) => {
      const prog = todayProgress.find(
        (p) => p.deck._id.toString() === deck._id.toString()
      );
      const deckDoc = await AnkiDeck.findById(deck._id).select(
        "dailyReviewTarget"
      );
      return {
        deckId: deck._id,
        deckName: deck.name,
        color: deck.color,
        reviewedToday: prog?.reviewedCount ?? 0,
        dailyReviewTarget: deckDoc?.dailyReviewTarget ?? 10,
      };
    })
  );

  return NextResponse.json({
    last7Days,
    last30Days,
    deckHealth,
    perDeckProgress,
  });
}

// ─────────────────────────────────────────────
// AUTO-IMPORT — called from entryController (Phase 9)
// ─────────────────────────────────────────────

/**
 * Given a list of vocab words from a DailyEntry, create Anki cards for any
 * that don't already exist. Cards are auto-assigned to the correct deck.
 * Safe to call multiple times — skips duplicates by checking card front.
 */
export async function autoImportVocabCards(
  userId: Types.ObjectId,
  words: string[],
  jlptLevel: JLPTLevel | null,
  sourceEntryId: Types.ObjectId
): Promise<void> {
  await connectDB();

  const deckId = await resolveAutoAssignDeck(userId, jlptLevel);

  for (const word of words) {
    const front = word.trim();
    if (!front) continue;

    const exists = await AnkiCard.findOne({ user: userId, front });
    if (exists) continue;

    await AnkiCard.create({
      user: userId,
      deck: deckId,
      front,
      back: "",   // User fills in the back later via CardManager
      type: "vocab",
      jlptLevel,
      manuallyAssigned: false,
      sourceEntry: sourceEntryId,
    });

    await adjustCardCount(deckId, 1);
  }
}