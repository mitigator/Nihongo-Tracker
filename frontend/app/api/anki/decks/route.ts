import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDecks, createDeck } from "@/lib/controllers/ankiController";
import { routeHandler } from "@/lib/routeHandler";

// GET /api/anki/decks
export const GET = routeHandler(async (req: NextRequest) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return getDecks(req, auth.user);
});

// POST /api/anki/decks
export const POST = routeHandler(async (req: NextRequest) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return createDeck(req, auth.user);
});
