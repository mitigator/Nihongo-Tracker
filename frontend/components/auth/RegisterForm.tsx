"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { RegisterCredentials } from "@/types";

// ── Google Icon ───────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
    <path d="M47.532 24.552c0-1.636-.132-3.234-.388-4.788H24.48v9.065h12.984c-.56 3.018-2.26 5.574-4.812 7.29v6.054h7.788c4.556-4.196 7.092-10.372 7.092-17.62z" fill="#4285F4" />
    <path d="M24.48 48c6.516 0 11.988-2.16 15.984-5.828l-7.788-6.054c-2.16 1.452-4.92 2.304-8.196 2.304-6.3 0-11.636-4.254-13.548-9.972H2.892v6.252C6.876 42.612 15.108 48 24.48 48z" fill="#34A853" />
    <path d="M10.932 28.45A14.42 14.42 0 0 1 10.2 24c0-1.548.264-3.048.732-4.45v-6.252H2.892A23.93 23.93 0 0 0 .48 24c0 3.864.924 7.524 2.412 10.702l8.04-6.252z" fill="#FBBC05" />
    <path d="M24.48 9.578c3.552 0 6.744 1.224 9.252 3.624l6.936-6.936C36.468 2.376 30.996 0 24.48 0 15.108 0 6.876 5.388 2.892 13.298l8.04 6.252c1.912-5.718 7.248-9.972 13.548-9.972z" fill="#EA4335" />
  </svg>
);

// ── Spinner ───────────────────────────────────────────────────────────────────
const Spinner = () => (
  <svg
    className="animate-spin"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    style={{ display: "inline-block" }}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

type Step = "form" | "otp";

const RegisterForm = () => {
  const { requestOtp, verifyOtpAndRegister, resendOtp, loading } = useAuth();

  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<RegisterCredentials>({
    name: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // Focus first OTP box when step changes
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await requestOtp(formData);
    if (success) {
      setStep("otp");
      setResendCooldown(60);
    }
  };

  // ── OTP digit input handlers ──────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = [...otp];
    text.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    const lastFilled = Math.min(text.length, 5);
    otpRefs.current[lastFilled]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return;
    setOtpLoading(true);
    await verifyOtpAndRegister(formData.email, code);
    setOtpLoading(false);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    await resendOtp(formData);
    setOtp(["", "", "", "", "", ""]);
    setResendCooldown(60);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
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
            {step === "form" ? "Level up your Japanese every day" : "Check your inbox"}
          </p>
        </div>

        {/* ── STEP 1: Registration form ── */}
        {step === "form" && (
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

            {/* Google SSO */}
            <a
              href="/api/auth/google"
              className="w-full rounded-xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
                fontSize: "0.875rem",
                padding: "0.875rem",
                marginBottom: "1.5rem",
                display: "flex",
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

            <form onSubmit={handleSubmitForm} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
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
                    style={inputStyle}
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? <><Spinner /> Sending code...</> : "Send Verification Code →"}
              </button>
            </form>
          </div>
        )}

        {/* ── STEP 2: OTP verification ── */}
        {step === "otp" && (
          <div
            className="rounded-2xl"
            style={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              padding: "2.5rem",
            }}
          >
            {/* Back button */}
            <button
              onClick={() => { setStep("form"); setOtp(["", "", "", "", "", ""]); }}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-muted)",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
                padding: 0,
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              ← Back
            </button>

            <h2
              className="font-black tracking-wide uppercase"
              style={{ color: "var(--color-text)", fontSize: "1.125rem", marginBottom: "0.25rem" }}
            >
              Verify Email
            </h2>
            <p style={{ color: "var(--color-muted)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
              We sent a 6-digit code to
            </p>
            <p
              className="font-bold"
              style={{ color: "var(--color-text)", fontSize: "0.875rem", marginBottom: "2rem" }}
            >
              {formData.email}
            </p>

            <form onSubmit={handleVerifyOtp}>
              {/* OTP digit boxes */}
              <div
                style={{
                  display: "flex",
                  gap: "0.625rem",
                  justifyContent: "center",
                  marginBottom: "1.75rem",
                }}
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    style={{
                      width: "48px",
                      height: "56px",
                      textAlign: "center",
                      fontSize: "1.5rem",
                      fontWeight: 900,
                      background: "var(--color-bg)",
                      border: `2px solid ${digit ? "var(--color-primary)" : "var(--color-border)"}`,
                      borderRadius: "0.75rem",
                      color: "var(--color-text)",
                      outline: "none",
                      transition: "border-color 0.15s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                    onBlur={(e) => (e.target.style.borderColor = digit ? "var(--color-primary)" : "var(--color-border)")}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={otpLoading || otp.join("").length < 6}
                className="w-full rounded-xl font-black tracking-widest uppercase transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "var(--color-primary)",
                  color: "#000",
                  fontSize: "0.75rem",
                  padding: "0.875rem",
                  border: "none",
                  cursor: otpLoading || otp.join("").length < 6 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  width: "100%",
                }}
              >
                {otpLoading ? <><Spinner /> Verifying...</> : "Verify & Create Account →"}
              </button>
            </form>

            {/* Resend */}
            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              {resendCooldown > 0 ? (
                <p style={{ color: "var(--color-muted)", fontSize: "0.8125rem" }}>
                  Resend code in{" "}
                  <span style={{ color: "var(--color-text)", fontWeight: 700 }}>
                    {resendCooldown}s
                  </span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-primary)",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Resend code
                </button>
              )}
            </div>
          </div>
        )}

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