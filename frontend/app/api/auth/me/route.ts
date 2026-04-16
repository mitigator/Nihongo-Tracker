import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { routeHandler } from "@/lib/routeHandler";

export const GET = routeHandler(async (req: NextRequest) => {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const user = await User.findById(auth.user._id).select("-password");
  return NextResponse.json(user, { status: 200 });
});