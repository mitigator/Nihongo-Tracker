import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getWeeklyChart } from "@/lib/controllers/progressController";
import { routeHandler } from "@/lib/routeHandler";

// GET /api/progress/weekly
export const GET = routeHandler(async (req: NextRequest) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return getWeeklyChart(req, auth.user);
});