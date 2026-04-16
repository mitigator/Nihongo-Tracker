import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getCurrentGoal } from "@/lib/controllers/goalController";
import { routeHandler } from "@/lib/routeHandler";

// GET /api/goals/current
export const GET = routeHandler(async (req: NextRequest) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return getCurrentGoal(req, auth.user);
});