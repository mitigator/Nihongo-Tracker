import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getAnkiAnalytics } from "@/lib/controllers/ankiController";
import { routeHandler } from "@/lib/routeHandler";

// GET /api/anki/analytics
export const GET = routeHandler(async (req: NextRequest) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return getAnkiAnalytics(req, auth.user);
});
