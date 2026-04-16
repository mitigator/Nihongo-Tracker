import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getMonthlyChart } from "@/lib/controllers/progressController";
import { routeHandler } from "@/lib/routeHandler";

// GET /api/progress/monthly
export const GET = routeHandler(async (req: NextRequest) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return getMonthlyChart(req, auth.user);
});