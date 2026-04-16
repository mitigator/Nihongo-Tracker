import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { updateEntry, deleteEntry } from "@/lib/controllers/entryController";
import { routeHandler } from "@/lib/routeHandler";

type Params = { params: { id: string } };

// PUT /api/entries/:id
export const PUT = routeHandler(async (req: NextRequest, { params }: Params) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return updateEntry(req, auth.user, params.id);
});

// DELETE /api/entries/:id
export const DELETE = routeHandler(async (req: NextRequest, { params }: Params) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return deleteEntry(auth.user, params.id);
});