"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { LoginCredentials } from "@/types";
import { useEffect } from "react";
import toast from "react-hot-toast";

// ── Google Icon ───────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
    <path d="M47.532 24.552c0-1.636-.132-3.234-.388-4.788H24.48v9.065h12.984c-.56 3.018-2.26 5.574-4.812 7.29v6.054h7.788c4.556-4.196 7.092-10.372 7.092-17.62z" fill="#4285F4" />
    <path d="M24.48 48c6.516 0 11.988-2.16 15.984-5.828l-7.788-6.054c-2.16 1.452-4.92 2.304-8.196 2.304-6.3 0-11.636-4.254-13.548-9.972H2.892v6.252C6.876 42.612 15.108 48 24.48 48z" fill="#34A853" />
    <path d="M10.932 28.45A14.42 14.42 0 0 1 10.2 24c0-1.548.264-3.048.732-4.45v-6.252H2.892A23.93 23.93 0 0 0 .48 24c0 3.864.924 7.524 2.412 10.702l8.04-6.252z" fill="#FBBC05" />
    <path d="M24.48 9.578c3.552 0 6.744 1.224 9.252 3.624l6.936-6.936C36.468 2.376 30.996 0 24.48 0 15.108 0 6.876 5.388 2.892 13.298l8.04 6.252z" fill="#EA4335" />
  </svg>
);

const LoginForm = () => {
  const { login, loading } = useAuth();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  // Show error toast if redirected back from Google with an error
  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "google_cancelled") {
      toast("Google sign-in was cancelled", { icon: "ℹ️" });
    } else if (error === "google_failed") {
      toast.error("Google sign-in failed. Please try again.");
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(formData);
  };

  const inputStyle = {
    background: "var(--color-bg)",
    border: "1px solid var(--color-border)",
    color: "var(--color-text)",
    fontSize: "0.875rem",
    padding: "0.875rem 1rem",
    borderRadius: "0.75rem",
    width: "100%",
    outline: "none",
    transition: "border-color 0.15s",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--color-bg)", padding: "1rem" }}
    >
      {/* Ambient glow */}
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "var(--color-primary)", opacity: 0.06 }}
      />

      <div className="relative w-full z-10" style={{ maxWidth: "420px" }}>

        {/* Brand */}
        <div className="text-center" style={{ marginBottom: "2.5rem" }}>
          <div
            className="inline-flex items-center justify-center rounded-2xl text-2xl font-black"
            style={{
              background: "var(--color-primary)",
              color: "#000",
              width: "64px",
              height: "64px",
              marginBottom: "1.25rem",
            }}
          >
            日
          </div>
          <h1
            className="font-black tracking-widest uppercase"
            style={{ color: "var(--color-text)", fontSize: "1.1rem", marginBottom: "0.5rem" }}
          >
            Nihongo Tracker
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "0.875rem" }}>
            Your JLPT grind starts here
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl"
          style={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
            padding: "2.5rem",
          }}
        >
          <h2
            className="font-black tracking-wide uppercase"
            style={{ color: "var(--color-text)", fontSize: "1.125rem", marginBottom: "0.25rem" }}
          >
            Sign In
          </h2>
          <p style={{ color: "var(--color-muted)", fontSize: "0.875rem", marginBottom: "2rem" }}>
            Continue your streak — don&apos;t break it
          </p>

          {/* Google SSO */}
          <a
            href="/api/auth/google"
            className="w-full rounded-xl font-bold transition-all active:scale-[0.98]"
            style={{
              background: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
              fontSize: "0.875rem",
              padding: "0.875rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              textDecoration: "none",
            }}
          >
            <GoogleIcon />
            Continue with Google
          </a>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
            <span style={{ color: "var(--color-muted)", fontSize: "0.75rem", fontWeight: 700 }}>
              OR
            </span>
            <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label
                className="font-black uppercase tracking-widest"
                style={{ color: "var(--color-muted)", fontSize: "0.625rem" }}
              >
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label
                className="font-black uppercase tracking-widest"
                style={{ color: "var(--color-muted)", fontSize: "0.625rem" }}
              >
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl font-black tracking-widest uppercase transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "var(--color-primary)",
                color: "#000",
                fontSize: "0.75rem",
                padding: "0.875rem",
                marginTop: "0.5rem",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Loading..." : "Sign In →"}
            </button>
          </form>
        </div>

        <p
          className="text-center font-medium"
          style={{ color: "var(--color-muted)", fontSize: "0.875rem", marginTop: "1.5rem" }}
        >
          No account?{" "}
          <Link
            href="/register"
            className="font-bold hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            Create one — it&apos;s free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;