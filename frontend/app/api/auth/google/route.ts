import { googleRedirect } from "@/lib/controllers/authController";
import { routeHandler } from "@/lib/routeHandler";

export const GET = routeHandler(async () => googleRedirect());