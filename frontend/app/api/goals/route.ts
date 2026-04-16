import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getGoals, upsertGoal } from "@/lib/controllers/goalController";
import { routeHandler } from "@/lib/routeHandler";

// GET /api/goals
export const GET = routeHandler(async (req: NextRequest) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return getGoals(req, auth.user);
});

// POST /api/goals
export const POST = routeHandler(async (req: NextRequest) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return upsertGoal(req, auth.user);
});