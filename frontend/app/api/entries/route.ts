import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getEntries, createEntry } from "@/lib/controllers/entryController";
import { routeHandler } from "@/lib/routeHandler";

// GET /api/entries?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
export const GET = routeHandler(async (req: NextRequest) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return getEntries(req, auth.user);
});

// POST /api/entries
export const POST = routeHandler(async (req: NextRequest) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return createEntry(req, auth.user);
});