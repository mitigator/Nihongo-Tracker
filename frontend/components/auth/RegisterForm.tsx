"use client";

import { useState } from "react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { RegisterCredentials } from "@/types";

const RegisterForm = () => {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState<RegisterCredentials>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await register(formData);
  };

  const fields = [
    { label: "Full Name", name: "name", type: "text", placeholder: "Yamada Taro" },
    { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
    { label: "Password", name: "password", type: "password", placeholder: "Min. 6 characters" },
  ];

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
            Level up your Japanese every day
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
            Create Account
          </h2>
          <p style={{ color: "var(--color-muted)", fontSize: "0.875rem", marginBottom: "2rem" }}>
            Start your journey today
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {fields.map((field) => (
              <div key={field.name} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label
                  className="font-black uppercase tracking-widest"
                  style={{ color: "var(--color-muted)", fontSize: "0.625rem" }}
                >
                  {field.label}
                </label>
                <input
                  name={field.name}
                  type={field.type}
                  required
                  minLength={field.name === "password" ? 6 : undefined}
                  value={formData[field.name as keyof RegisterCredentials]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl outline-none transition-all"
                  style={{
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                    fontSize: "0.875rem",
                    padding: "0.875rem 1rem",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                />
              </div>
            ))}

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
              }}
            >
              {loading ? "Loading..." : "Start Journey →"}
            </button>
          </form>
        </div>

        <p
          className="text-center font-medium"
          style={{ color: "var(--color-muted)", fontSize: "0.875rem", marginTop: "1.5rem" }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;