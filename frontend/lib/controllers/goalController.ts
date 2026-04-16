import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import WeeklyGoal from "@/lib/models/WeeklyGoal";
import DailyEntry from "@/lib/models/DailyEntry";
import { getCurrentWeekStart, getWeekStart, getWeekEnd } from "@/lib/utils/weekUtils";
import { IUser } from "@/lib/models/User";
import { Types } from "mongoose";

// ─────────────────────────────────────────────
// Helper — aggregate DailyEntry totals for a given week
// ─────────────────────────────────────────────
async function getWeekActuals(userId: Types.ObjectId, weekStartDate: string) {
  const weekEndDate = getWeekEnd(weekStartDate);

  const [result] = await DailyEntry.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: weekStartDate, $lte: weekEndDate },
      },
    },
    {
      $group: {
        _id: null,
        vocabActual: { $sum: "$vocabCount" },
        listeningActual: { $sum: "$listeningMinutes" },
        grammarActual: { $sum: "$grammarCount" },
      },
    },
  ]);

  return {
    vocabActual: result?.vocabActual ?? 0,
    listeningActual: result?.listeningActual ?? 0,
    grammarActual: result?.grammarActual ?? 0,
  };
}

// ─────────────────────────────────────────────
// Helper — consistent response shape with % progress
// ─────────────────────────────────────────────
function buildGoalResponse(
  goal: any,
  actuals: { vocabActual: number; listeningActual: number; grammarActual: number }
) {
  const pct = (actual: number, target: number) =>
    target > 0 ? Math.min(Math.round((actual / target) * 100), 100) : 0;

  return {
    _id: goal._id,
    weekStartDate: goal.weekStartDate,
    weekEndDate: getWeekEnd(goal.weekStartDate),
    targets: {
      vocab: goal.vocabTarget,
      kanji: goal.kanjiTarget,
      grammar: goal.grammarTarget,
      listening: goal.listeningTarget,
    },
    actuals: {
      vocab: actuals.vocabActual,
      grammar: actuals.grammarActual,
      listening: actuals.listeningActual,
    },
    progress: {
      vocab: pct(actuals.vocabActual, goal.vocabTarget),
      grammar: pct(actuals.grammarActual, goal.grammarTarget),
      listening: pct(actuals.listeningActual, goal.listeningTarget),
    },
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
  };
}

// ─────────────────────────────────────────────
// @desc    Get all weekly goals for the user
// @route   GET /api/goals
// ─────────────────────────────────────────────
export async function getGoals(
  _req: NextRequest,
  user: IUser
): Promise<NextResponse> {
  await connectDB();

  const goals = await WeeklyGoal.find({ user: user._id }).sort({
    weekStartDate: -1,
  });

  const goalsWithProgress = await Promise.all(
    goals.map(async (goal) => {
      const actuals = await getWeekActuals(user._id as Types.ObjectId, goal.weekStartDate);
      return buildGoalResponse(goal, actuals);
    })
  );

  return NextResponse.json({ count: goals.length, goals: goalsWithProgress });
}

// ─────────────────────────────────────────────
// @desc    Get current week's goal + live progress
// @route   GET /api/goals/current
// ─────────────────────────────────────────────
export async function getCurrentGoal(
  _req: NextRequest,
  user: IUser
): Promise<NextResponse> {
  await connectDB();

  const weekStartDate = getCurrentWeekStart();
  const goal = await WeeklyGoal.findOne({ user: user._id, weekStartDate });

  if (!goal) {
    return NextResponse.json(
      { message: "No goal set for the current week.", weekStartDate },
      { status: 404 }
    );
  }

  const actuals = await getWeekActuals(user._id as Types.ObjectId, weekStartDate);
  return NextResponse.json(buildGoalResponse(goal, actuals));
}

// ─────────────────────────────────────────────
// @desc    Create or update a weekly goal (upsert)
// @route   POST /api/goals
// ─────────────────────────────────────────────
export async function upsertGoal(
  req: NextRequest,
  user: IUser
): Promise<NextResponse> {
  await connectDB();

  const body = await req.json();
  const { weekStartDate: rawDate, vocabTarget, kanjiTarget, grammarTarget, listeningTarget } = body;

  const weekStartDate = rawDate ? getWeekStart(rawDate) : getCurrentWeekStart();

  try {
    const goal = await WeeklyGoal.findOneAndUpdate(
      { user: user._id, weekStartDate },
      {
        $set: {
          vocabTarget: vocabTarget ?? 0,
          kanjiTarget: kanjiTarget ?? 0,
          grammarTarget: grammarTarget ?? 0,
          listeningTarget: listeningTarget ?? 0,
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    const actuals = await getWeekActuals(user._id as Types.ObjectId, weekStartDate);
    return NextResponse.json(buildGoalResponse(goal, actuals), { status: 201 });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json({ message: messages.join(", ") }, { status: 400 });
    }
    throw error;
  }
}

// ─────────────────────────────────────────────
// @desc    Delete a weekly goal by ID
// @route   DELETE /api/goals/:id
// ─────────────────────────────────────────────
export async function deleteGoal(
  user: IUser,
  id: string
): Promise<NextResponse> {
  await connectDB();

  const goal = await WeeklyGoal.findById(id);

  if (!goal) {
    return NextResponse.json({ message: "Goal not found" }, { status: 404 });
  }

  if (goal.user.toString() !== user._id.toString()) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  await goal.deleteOne();
  return NextResponse.json({ message: "Goal deleted", id });
}