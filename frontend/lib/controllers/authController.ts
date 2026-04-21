import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import OtpToken from "../models/OtpToken"; 
import { sendOtpEmail } from "../email";

// ─────────────────────────────────────────────
// Helper — sign JWT and set httpOnly cookie
// ─────────────────────────────────────────────
export function generateToken(res: NextResponse, userId: string): string {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return token;
}

// ─────────────────────────────────────────────
// @desc    Send OTP to email before registration
// @route   POST /api/auth/send-otp
// ─────────────────────────────────────────────
export async function sendOtp(req: NextRequest): Promise<NextResponse> {
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
      { message: "An account with this email already exists" },
      { status: 400 }
    );
  }

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Hash the password before storing in OtpToken
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Delete any existing OTP for this email and create a fresh one
  await OtpToken.deleteMany({ email });
  await OtpToken.create({
    email,
    otp,
    name,
    password: hashedPassword,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });

  await sendOtpEmail(email, otp, name);

  return NextResponse.json(
    { message: "OTP sent to your email" },
    { status: 200 }
  );
}

// ─────────────────────────────────────────────
// @desc    Verify OTP and create account
// @route   POST /api/auth/verify-otp
// ─────────────────────────────────────────────
export async function verifyOtp(req: NextRequest): Promise<NextResponse> {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return NextResponse.json(
      { message: "Email and OTP are required" },
      { status: 400 }
    );
  }

  await connectDB();

  const record = await OtpToken.findOne({ email });

  if (!record) {
    return NextResponse.json(
      { message: "OTP expired or not found. Please request a new one." },
      { status: 400 }
    );
  }

  if (record.otp !== otp) {
    return NextResponse.json(
      { message: "Invalid OTP. Please try again." },
      { status: 400 }
    );
  }

  if (record.expiresAt < new Date()) {
    await OtpToken.deleteOne({ email });
    return NextResponse.json(
      { message: "OTP has expired. Please request a new one." },
      { status: 400 }
    );
  }

  // Create the user — password is already hashed in the OtpToken record
  const user = await User.create({
    name: record.name,
    email: record.email,
    password: record.password,
  });

  // Clean up the OTP record
  await OtpToken.deleteOne({ email });

  const res = NextResponse.json(
    { _id: user._id, name: user.name, email: user.email },
    { status: 201 }
  );

  // Manually set token — skip pre-save hook re-hashing since password is already hashed
  const token = jwt.sign({ id: String(user._id) }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

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

  // Google-only accounts have no password
  if (!user.password) {
    return NextResponse.json(
      { message: "This account uses Google Sign-In. Please continue with Google." },
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
  const userId = (req as any)._userId;
  const user = await User.findById(userId).select("-password");
  return NextResponse.json(user, { status: 200 });
}

// ─────────────────────────────────────────────
// @desc    Redirect to Google OAuth
// @route   GET /api/auth/google
// ─────────────────────────────────────────────
export function googleRedirect(): NextResponse {
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}

// ─────────────────────────────────────────────
// @desc    Handle Google OAuth callback
// @route   GET /api/auth/google/callback
// ─────────────────────────────────────────────
export async function googleCallback(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?error=google_cancelled`
    );
  }

  try {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      throw new Error("No access token returned from Google");
    }

    // Get user info from Google
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userInfoRes.json();
    const { id: googleId, email, name } = googleUser;

    if (!email) {
      throw new Error("No email returned from Google");
    }

    await connectDB();

    // Find existing user or create new one
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // If user exists via email but not yet linked to Google, link it
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Brand new user via Google
      user = await User.create({ name, email, googleId });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const res = NextResponse.redirect(`${appUrl}/dashboard`);

    generateToken(res, String(user._id));
    return res;
  } catch (error) {
    console.error("[Google OAuth Error]", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?error=google_failed`
    );
  }
}