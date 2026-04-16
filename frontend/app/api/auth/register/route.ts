import { NextRequest } from "next/server";
import { register } from "@/lib/controllers/authController";
import { routeHandler } from "@/lib/routeHandler";

export const POST = routeHandler((req: NextRequest) => register(req));