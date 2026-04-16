import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDeck, updateDeck, deleteDeck } from "@/lib/controllers/ankiController";
import { routeHandler } from "@/lib/routeHandler";

// GET /api/anki/decks/[id]
export const GET = routeHandler(async (req: NextRequest, ctx) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;
  return getDeck(req, auth.user, id);
});

// PATCH /api/anki/decks/[id]
export const PATCH = routeHandler(async (req: NextRequest, ctx) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;
  return updateDeck(req, auth.user, id);
});

// DELETE /api/anki/decks/[id]
export const DELETE = routeHandler(async (req: NextRequest, ctx) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;
  return deleteDeck(req, auth.user, id);
});
