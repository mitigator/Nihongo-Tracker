import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getPlans, createPlan } from "@/lib/controllers/planController";
import { routeHandler } from "@/lib/routeHandler";

// GET /api/plans
export const GET = routeHandler(async (req: NextRequest) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return getPlans(req, auth.user);
});

// POST /api/plans
export const POST = routeHandler(async (req: NextRequest) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return createPlan(req, auth.user);
});