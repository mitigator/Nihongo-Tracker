import { NextRequest } from "next/server";
import { googleCallback } from "@/lib/controllers/authController";
import { routeHandler } from "@/lib/routeHandler";

export const GET = routeHandler((req: NextRequest) => googleCallback(req));