import { NextRequest } from "next/server";
import { login } from "@/lib/controllers/authController";
import { routeHandler } from "@/lib/routeHandler";

export const POST = routeHandler((req: NextRequest) => login(req));