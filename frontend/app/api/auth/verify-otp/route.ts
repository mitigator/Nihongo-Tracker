import { NextRequest } from "next/server";
import { verifyOtp } from "@/lib/controllers/authController";
import { routeHandler } from "@/lib/routeHandler";

export const POST = routeHandler((req: NextRequest) => verifyOtp(req));