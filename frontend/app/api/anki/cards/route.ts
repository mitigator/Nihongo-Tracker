import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getCards, createCard } from "@/lib/controllers/ankiController";
import { routeHandler } from "@/lib/routeHandler";

// GET /api/anki/cards
export const GET = routeHandler(async (req: NextRequest) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return getCards(req, auth.user);
});

// POST /api/anki/cards
export const POST = routeHandler(async (req: NextRequest) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return createCard(req, auth.user);
});
