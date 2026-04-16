import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getSummary } from "@/lib/controllers/progressController";
import { routeHandler } from "@/lib/routeHandler";

// GET /api/progress/summary
export const GET = routeHandler(async (req: NextRequest) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return getSummary(req, auth.user);
});