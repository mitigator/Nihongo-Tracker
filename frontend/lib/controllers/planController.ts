import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import StudyPlan from "@/lib/models/StudyPlan";
import { IUser } from "@/lib/models/User";

// ─────────────────────────────────────────────
// Helper — detect which week of the plan is current (1-based)
// ─────────────────────────────────────────────
function detectCurrentWeek(startDate: string, endDate: string): number | null {
  const todayStr = new Date().toISOString().slice(0, 10);
  if (todayStr < startDate || todayStr > endDate) return null;

  const start = new Date(startDate + "T00:00:00Z");
  const today = new Date(todayStr + "T00:00:00Z");
  const diffDays = Math.floor(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.floor(diffDays / 7) + 1;
}

// ─────────────────────────────────────────────
// @desc    Get all study plans for the user
// @route   GET /api/plans
// ─────────────────────────────────────────────
export async function getPlans(
  _req: NextRequest,
  user: IUser
): Promise<NextResponse> {
  await connectDB();

  const plans = await StudyPlan.find({ user: user._id }).sort({ createdAt: -1 });

  const plansWithMeta = plans.map((plan) => ({
    ...plan.toObject(),
    currentWeek: detectCurrentWeek(plan.startDate, plan.endDate),
  }));

  return NextResponse.json({ count: plans.length, plans: plansWithMeta });
}

// ─────────────────────────────────────────────
// @desc    Get a single plan by ID
// @route   GET /api/plans/:id
// ─────────────────────────────────────────────
export async function getPlanById(
  user: IUser,
  id: string
): Promise<NextResponse> {
  await connectDB();

  const plan = await StudyPlan.findById(id);

  if (!plan) {
    return NextResponse.json({ message: "Plan not found" }, { status: 404 });
  }

  if (plan.user.toString() !== user._id.toString()) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  return NextResponse.json({
    ...plan.toObject(),
    currentWeek: detectCurrentWeek(plan.startDate, plan.endDate),
  });
}

// ─────────────────────────────────────────────
// @desc    Create a new study plan
// @route   POST /api/plans
// ─────────────────────────────────────────────
export async function createPlan(
  req: NextRequest,
  user: IUser
): Promise<NextResponse> {
  await connectDB();

  const body = await req.json();
  const { title, level, startDate, endDate, weeklyTargets } = body;

  if (!title || !startDate || !endDate) {
    return NextResponse.json(
      { message: "title, startDate and endDate are required" },
      { status: 400 }
    );
  }

  try {
    const plan = await StudyPlan.create({
      user: user._id,
      title,
      level: level ?? "custom",
      startDate,
      endDate,
      weeklyTargets: weeklyTargets ?? [],
    });

    return NextResponse.json(
      {
        ...plan.toObject(),
        currentWeek: detectCurrentWeek(plan.startDate, plan.endDate),
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ValidationError" || error.message?.includes("endDate")) {
      const message = error.message?.includes("endDate")
        ? error.message
        : Object.values(error.errors)
            .map((e: any) => e.message)
            .join(", ");
      return NextResponse.json({ message }, { status: 400 });
    }
    throw error;
  }
}

// ─────────────────────────────────────────────
// @desc    Update a plan
// @route   PUT /api/plans/:id
// ─────────────────────────────────────────────
export async function updatePlan(
  req: NextRequest,
  user: IUser,
  id: string
): Promise<NextResponse> {
  await connectDB();

  const plan = await StudyPlan.findById(id);

  if (!plan) {
    return NextResponse.json({ message: "Plan not found" }, { status: 404 });
  }

  if (plan.user.toString() !== user._id.toString()) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();
  const { title, level, startDate, endDate, weeklyTargets } = body;

  if (title !== undefined) plan.title = title;
  if (level !== undefined) plan.level = level;
  if (startDate !== undefined) plan.startDate = startDate;
  if (endDate !== undefined) plan.endDate = endDate;
  if (weeklyTargets !== undefined) plan.weeklyTargets = weeklyTargets;

  try {
    const updated = await plan.save();
    return NextResponse.json({
      ...updated.toObject(),
      currentWeek: detectCurrentWeek(updated.startDate, updated.endDate),
    });
  } catch (error: any) {
    if (error.name === "ValidationError" || error.message?.includes("endDate")) {
      const message = error.message?.includes("endDate")
        ? error.message
        : Object.values(error.errors)
            .map((e: any) => e.message)
            .join(", ");
      return NextResponse.json({ message }, { status: 400 });
    }
    throw error;
  }
}

// ─────────────────────────────────────────────
// @desc    Delete a plan
// @route   DELETE /api/plans/:id
// ─────────────────────────────────────────────
export async function deletePlan(
  user: IUser,
  id: string
): Promise<NextResponse> {
  await connectDB();

  const plan = await StudyPlan.findById(id);

  if (!plan) {
    return NextResponse.json({ message: "Plan not found" }, { status: 404 });
  }

  if (plan.user.toString() !== user._id.toString()) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  await plan.deleteOne();
  return NextResponse.json({ message: "Plan deleted", id });
}