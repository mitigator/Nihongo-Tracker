import { NextRequest } from "next/server";
import { sendOtp } from "@/lib/controllers/authController";
import { routeHandler } from "@/lib/routeHandler";

export const POST = routeHandler((req: NextRequest) => sendOtp(req));