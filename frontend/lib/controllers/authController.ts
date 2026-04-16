import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

// ─────────────────────────────────────────────
// Helper — sign JWT and set httpOnly cookie on response
// ─────────────────────────────────────────────
export function generateToken(res: NextResponse, userId: string): string {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: "/",
  });

  return token;
}

// ─────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/register
// ─────────────────────────────────────────────
export async function register(req: NextRequest): Promise<NextResponse> {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  await connectDB();

  const userExists = await User.findOne({ email });
  if (userExists) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const user = await User.create({ name, email, password });

  const res = NextResponse.json(
    { _id: user._id, name: user.name, email: user.email },
    { status: 201 }
  );
  generateToken(res, String(user._id));
  return res;
}

// ─────────────────────────────────────────────
// @desc    Login user
// @route   POST /api/auth/login
// ─────────────────────────────────────────────
export async function login(req: NextRequest): Promise<NextResponse> {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

  const res = NextResponse.json(
    { _id: user._id, name: user.name, email: user.email },
    { status: 200 }
  );
  generateToken(res, String(user._id));
  return res;
}

// ─────────────────────────────────────────────
// @desc    Logout — clears cookie
// @route   POST /api/auth/logout
// ─────────────────────────────────────────────
export function logout(): NextResponse {
  const res = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );
  res.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return res;
}

// ─────────────────────────────────────────────
// @desc    Get logged-in user profile
// @route   GET /api/auth/me
// ─────────────────────────────────────────────
export async function getMe(req: NextRequest): Promise<NextResponse> {
  await connectDB();
  // user is attached by requireAuth in the route handler
  const userId = (req as any)._userId;
  const user = await User.findById(userId).select("-password");
  return NextResponse.json(user, { status: 200 });
}