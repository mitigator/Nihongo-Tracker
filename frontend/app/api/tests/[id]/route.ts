import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { deleteTest } from "@/lib/controllers/mockTestController";
import { routeHandler } from "@/lib/routeHandler";

type Params = { params: { id: string } };

// DELETE /api/tests/:id
export const DELETE = routeHandler(async (req: NextRequest, { params }: Params) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return deleteTest(auth.user, params.id);
});