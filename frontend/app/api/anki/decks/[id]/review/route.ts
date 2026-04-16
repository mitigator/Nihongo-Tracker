import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDeckReview, submitDeckReview } from "@/lib/controllers/ankiController";
import { routeHandler } from "@/lib/routeHandler";

// GET /api/anki/decks/[id]/review
export const GET = routeHandler(async (req: NextRequest, ctx) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;
  return getDeckReview(req, auth.user, id);
});

// POST /api/anki/decks/[id]/review
export const POST = routeHandler(async (req: NextRequest, ctx) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;
  return submitDeckReview(req, auth.user, id);
});
