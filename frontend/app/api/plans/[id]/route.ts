import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getPlanById, updatePlan, deletePlan } from "@/lib/controllers/planController";
import { routeHandler } from "@/lib/routeHandler";

type Params = { params: { id: string } };

// GET /api/plans/:id
export const GET = routeHandler(async (req: NextRequest, { params }: Params) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return getPlanById(auth.user, params.id);
});

// PUT /api/plans/:id
export const PUT = routeHandler(async (req: NextRequest, { params }: Params) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return updatePlan(req, auth.user, params.id);
});

// DELETE /api/plans/:id
export const DELETE = routeHandler(async (req: NextRequest, { params }: Params) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return deletePlan(auth.user, params.id);
});