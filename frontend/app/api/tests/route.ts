import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getTests, createTest } from "@/lib/controllers/mockTestController";
import { routeHandler } from "@/lib/routeHandler";

// GET /api/tests
export const GET = routeHandler(async (req: NextRequest) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return getTests(req, auth.user);
});

// POST /api/tests
export const POST = routeHandler(async (req: NextRequest) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return createTest(req, auth.user);
});