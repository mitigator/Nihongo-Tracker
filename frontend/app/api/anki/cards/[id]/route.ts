import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { updateCard, deleteCard } from "@/lib/controllers/ankiController";
import { routeHandler } from "@/lib/routeHandler";

// PATCH /api/anki/cards/[id]
export const PATCH = routeHandler(async (req: NextRequest, ctx) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;
  return updateCard(req, auth.user, id);
});

// DELETE /api/anki/cards/[id]
export const DELETE = routeHandler(async (req: NextRequest, ctx) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;
  return deleteCard(req, auth.user, id);
});
