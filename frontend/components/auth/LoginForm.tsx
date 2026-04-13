"use client";

import { useState } from "react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { LoginCredentials } from "@/types";

const LoginForm = () => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(formData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Ambient glow */}
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.07] pointer-events-none"
        style={{ background: "var(--color-primary)" }}
      />

      <div className="relative w-full max-w-md z-10">

        {/* Brand */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 text-3xl font-black"
            style={{
              background: "var(--color-primary)",
              color: "#000",
              fontFamily: "var(--font-orbitron)",
            }}
          >
            日
          </div>
          <h1
            className="text-2xl font-black tracking-wider"
            style={{
              color: "var(--color-text)",
              fontFamily: "var(--font-orbitron)",
            }}
          >
            NIHONGO TRACKER
          </h1>
          <p
            className="text-base mt-1 font-medium"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-rajdhani)" }}
          >
            Your JLPT grind starts here
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h2
            className="text-xl font-bold tracking-wide mb-1"
            style={{
              color: "var(--color-text)",
              fontFamily: "var(--font-orbitron)",
            }}
          >
            SIGN IN
          </h2>
          <p
            className="text-base font-medium mb-6"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-rajdhani)" }}
          >
            Continue your streak — don&apos;t break it
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-orbitron)" }}
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
                className="w-full px-4 py-3 rounded-xl text-base font-medium outline-none transition-all"
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                  fontFamily: "var(--font-rajdhani)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-orbitron)" }}
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
                className="w-full px-4 py-3 rounded-xl text-base font-medium outline-none transition-all"
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                  fontFamily: "var(--font-rajdhani)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-black tracking-widest uppercase transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{
                background: "var(--color-primary)",
                color: "#000",
                fontFamily: "var(--font-orbitron)",
                fontSize: "13px",
              }}
            >
              {loading ? "LOADING..." : "SIGN IN →"}
            </button>
          </form>
        </div>

        <p
          className="text-center text-base font-medium mt-5"
          style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-rajdhani)" }}
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