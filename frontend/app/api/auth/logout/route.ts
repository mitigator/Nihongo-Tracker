import { logout } from "@/lib/controllers/authController";
import { routeHandler } from "@/lib/routeHandler";

export const POST = routeHandler(() => logout());