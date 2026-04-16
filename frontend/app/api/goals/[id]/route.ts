import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { deleteGoal } from "@/lib/controllers/goalController";
import { routeHandler } from "@/lib/routeHandler";

type Params = { params: { id: string } };

// DELETE /api/goals/:id
export const DELETE = routeHandler(async (req: NextRequest, { params }: Params) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return deleteGoal(auth.user, params.id);
});