import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MockTest from "@/lib/models/MockTest";
import { IUser } from "@/lib/models/User";

// ─────────────────────────────────────────────
// @desc    Get all mock tests for the user
// @route   GET /api/tests
// ─────────────────────────────────────────────
export async function getTests(
  _req: NextRequest,
  user: IUser
): Promise<NextResponse> {
  await connectDB();

  const tests = await MockTest.find({ user: user._id }).sort({ date: -1 });

  const total = tests.length;
  const passed = tests.filter((t) => t.passed).length;
  const avgScore =
    total > 0
      ? Math.round(tests.reduce((s, t) => s + t.totalScore, 0) / total)
      : 0;
  const bestScore = total > 0 ? Math.max(...tests.map((t) => t.totalScore)) : 0;

  return NextResponse.json({
    count: total,
    passed,
    failed: total - passed,
    avgScore,
    bestScore,
    tests,
  });
}

// ─────────────────────────────────────────────
// @desc    Create a new mock test result
// @route   POST /api/tests
// ─────────────────────────────────────────────
export async function createTest(
  req: NextRequest,
  user: IUser
): Promise<NextResponse> {
  await connectDB();

  const body = await req.json();
  const {
    date,
    totalScore,
    vocabScore,
    grammarScore,
    readingScore,
    listeningScore,
    passThreshold,
    notes,
  } = body;

  if (!date) {
    return NextResponse.json(
      { message: "date is required (YYYY-MM-DD)" },
      { status: 400 }
    );
  }
  if (totalScore === undefined || totalScore === null) {
    return NextResponse.json(
      { message: "totalScore is required" },
      { status: 400 }
    );
  }

  try {
    const test = await MockTest.create({
      user: user._id,
      date,
      totalScore,
      vocabScore: vocabScore ?? 0,
      grammarScore: grammarScore ?? 0,
      readingScore: readingScore ?? 0,
      listeningScore: listeningScore ?? 0,
      passThreshold: passThreshold ?? 80,
      notes: notes ?? "",
    });
    return NextResponse.json(test, { status: 201 });
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
// @desc    Delete a mock test by ID
// @route   DELETE /api/tests/:id
// ─────────────────────────────────────────────
export async function deleteTest(
  user: IUser,
  id: string
): Promise<NextResponse> {
  await connectDB();

  const test = await MockTest.findById(id);

  if (!test) {
    return NextResponse.json({ message: "Test not found" }, { status: 404 });
  }

  if (test.user.toString() !== user._id.toString()) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  await test.deleteOne();
  return NextResponse.json({ message: "Test deleted", id });
}