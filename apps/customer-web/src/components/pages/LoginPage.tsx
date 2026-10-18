"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/AuthShell";
import { useCustomer } from "@/mock/CustomerContext";
import { requestPasswordReset } from "@/lib/supabaseAuth";

export const LoginPage = () => {
  const { setActiveNav, signIn } = useCustomer();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password) return;
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      toast.success("Welcome back to MoneyFlow.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async () => {
    if (!email.trim()) {
      toast.info("Enter your email address first.");
      return;
    }
    setResetting(true);
    try {
      await requestPasswordReset(email.trim());
      toast.success("Password recovery instructions have been sent.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to send recovery email.",
      );
    } finally {
      setResetting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Secure customer access"
      title="Welcome back"
      description="Sign in to manage your transfers, settlement activity and regional wallet."
    >
      <form onSubmit={handleLogin} className="auth-form">
        <label className="auth-field">
          <span>Email address</span>
          <div className="auth-input-wrap">
            <Mail size={18} />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              required
            />
          </div>
        </label>

        <label className="auth-field">
          <span className="auth-label-row">
            <span>Password</span>
            <button type="button" onClick={handleReset} disabled={resetting}>
              {resetting ? "Sending…" : "Forgot password?"}
            </button>
          </span>
          <div className="auth-input-wrap">
            <LockKeyhole size={18} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        <button className="auth-submit" type="submit" disabled={submitting}>
          {submitting ? "Signing you in…" : "Sign in securely"}
          {!submitting && <ArrowRight size={18} />}
        </button>

        <p className="auth-switch">
          New to MoneyFlow?{" "}
          <button type="button" onClick={() => setActiveNav("register")}>
            Create an account
          </button>
        </p>
      </form>
    </AuthShell>
  );
};
