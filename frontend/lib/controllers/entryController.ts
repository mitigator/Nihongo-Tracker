import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import DailyEntry from "@/lib/models/DailyEntry";
import { calculateStreaks } from "@/lib/utils/streakUtils";
import { IUser } from "@/lib/models/User";

// ─────────────────────────────────────────────
// @desc    Get entries for the authenticated user
//          Optional query params: startDate, endDate (YYYY-MM-DD)
// @route   GET /api/entries
// ─────────────────────────────────────────────
export async function getEntries(
  req: NextRequest,
  user: IUser
): Promise<NextResponse> {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const filter: Record<string, any> = { user: user._id };

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = startDate;
    if (endDate) filter.date.$lte = endDate;
  }

  const entries = await DailyEntry.find(filter).sort({ date: -1 });

  const allDates = entries.map((e) => e.date);
  const { currentStreak, longestStreak } = calculateStreaks(allDates);

  return NextResponse.json({
    count: entries.length,
    currentStreak,
    longestStreak,
    entries,
  });
}

// ─────────────────────────────────────────────
// @desc    Create a new daily entry (one per day per user)
// @route   POST /api/entries
// ─────────────────────────────────────────────
export async function createEntry(
  req: NextRequest,
  user: IUser
): Promise<NextResponse> {
  await connectDB();

  const body = await req.json();
  const { date, vocabCount, listeningMinutes, grammarCount, notes } = body;

  if (!date) {
    return NextResponse.json(
      { message: "date is required (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  const existing = await DailyEntry.findOne({ user: user._id, date });
  if (existing) {
    return NextResponse.json(
      {
        message: "An entry for this date already exists. Use PUT to update it.",
        entryId: existing._id,
      },
      { status: 409 }
    );
  }

  try {
    const entry = await DailyEntry.create({
      user: user._id,
      date,
      vocabCount: vocabCount ?? 0,
      listeningMinutes: listeningMinutes ?? 0,
      grammarCount: grammarCount ?? 0,
      notes: notes ?? "",
    });
    return NextResponse.json(entry, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "An entry for this date already exists." },
        { status: 409 }
      );
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { message: messages.join(", ") },
        { status: 400 }
      );
    }
    throw error;
  }
}

// ─────────────────────────────────────────────
// @desc    Update an existing entry by ID
// @route   PUT /api/entries/:id
// ─────────────────────────────────────────────
export async function updateEntry(
  req: NextRequest,
  user: IUser,
  id: string
): Promise<NextResponse> {
  await connectDB();

  const entry = await DailyEntry.findById(id);

  if (!entry) {
    return NextResponse.json({ message: "Entry not found" }, { status: 404 });
  }

  if (entry.user.toString() !== user._id.toString()) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();
  const { vocabCount, listeningMinutes, grammarCount, notes } = body;

  if (vocabCount !== undefined) entry.vocabCount = vocabCount;
  if (listeningMinutes !== undefined) entry.listeningMinutes = listeningMinutes;
  if (grammarCount !== undefined) entry.grammarCount = grammarCount;
  if (notes !== undefined) entry.notes = notes;

  try {
    const updated = await entry.save();
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { message: messages.join(", ") },
        { status: 400 }
      );
    }
    throw error;
  }
}

// ─────────────────────────────────────────────
// @desc    Delete an entry by ID
// @route   DELETE /api/entries/:id
// ─────────────────────────────────────────────
export async function deleteEntry(
  user: IUser,
  id: string
): Promise<NextResponse> {
  await connectDB();

  const entry = await DailyEntry.findById(id);

  if (!entry) {
    return NextResponse.json({ message: "Entry not found" }, { status: 404 });
  }

  if (entry.user.toString() !== user._id.toString()) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  await entry.deleteOne();
  return NextResponse.json({ message: "Entry deleted", id });
}