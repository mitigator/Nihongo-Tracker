import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

interface JwtPayload {
  id: string;
}

/**
 * Reads JWT from httpOnly cookie first, falls back to Authorization header.
 * Returns the full user document (password excluded) or null.
 */
export async function getAuthUser(req: NextRequest) {
  try {
    let token = req.cookies.get("token")?.value;

    // ← ADD THESE
    console.log("[auth] cookies:", req.cookies.getAll());
    console.log("[auth] token from cookie:", token);

    if (!token) {
      const authHeader = req.headers.get("authorization");
      console.log("[auth] auth header:", authHeader); // ← ADD
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      console.log("[auth] no token found → returning null"); // ← ADD
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    console.log("[auth] decoded id:", decoded.id); // ← ADD

    await connectDB();
    const user = await User.findById(decoded.id).select("-password");
    console.log("[auth] user found:", user?._id ?? "null"); // ← ADD
    return user ?? null;
  } catch (error) {
    console.log("[auth] error:", error); // ← ADD
    return null;
  }
}

/**
 * Convenience wrapper — use inside route handlers to guard a route.
 * Returns { user } on success, or a 401 NextResponse to return immediately.
 *
 * Usage:
 *   const auth = await requireAuth(req);
 *   if (auth instanceof NextResponse) return auth;
 *   const { user } = auth;
 */
export async function requireAuth(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json(
      { message: "Not authorized, no token" },
      { status: 401 }
    );
  }
  return { user };
}

/**
 * Sets the JWT as an httpOnly cookie on a response — mirrors what
 * your Express auth controller does when issuing tokens.
 */
export function setAuthCookie(res: NextResponse, token: string) {
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
  return res;
}

/**
 * Clears the auth cookie — call this in your logout route.
 */
export function clearAuthCookie(res: NextResponse) {
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return res;
}

