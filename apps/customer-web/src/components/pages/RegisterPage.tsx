"use client";

import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/AuthShell";
import { useCustomer } from "@/mock/CustomerContext";

export const RegisterPage = () => {
  const { setActiveNav, setRegistrationDetails, signUp } = useCustomer();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const passwordScore = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
  const isValid =
    fullName.trim().length >= 3 &&
    email.includes("@") &&
    phone.trim().length >= 7 &&
    passwordScore >= 3 &&
    password === confirmPassword;

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid) return;
    const profile = { fullName: fullName.trim(), phone: phone.trim() };
    setRegistrationDetails({
      name: profile.fullName,
      email: email.trim(),
      phone: profile.phone,
    });
    setSubmitting(true);
    try {
      const signedIn = await signUp(email.trim(), password, profile);
      if (signedIn) toast.success("Your MoneyFlow account is ready.");
      else {
        toast.success("Check your inbox to confirm your email address.");
        setActiveNav("confirm-email");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create your account.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Open your MoneyFlow account"
      title="Start moving money smarter"
      description="Create your secure profile and prepare your business for seamless regional settlements."
    >
      <form onSubmit={handleRegister} className="auth-form auth-form-register">
        <div className="auth-field-grid">
          <label className="auth-field">
            <span>Full legal name</span>
            <div className="auth-input-wrap">
              <UserRound size={18} />
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                required
              />
            </div>
          </label>
          <label className="auth-field">
            <span>Phone number</span>
            <div className="auth-input-wrap">
              <Phone size={18} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+237 6XX XXX XXX"
                autoComplete="tel"
                required
              />
            </div>
          </label>
        </div>

        <label className="auth-field">
          <span>Email address</span>
          <div className="auth-input-wrap">
            <Mail size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              required
            />
          </div>
        </label>

        <label className="auth-field">
          <span>Password</span>
          <div className="auth-input-wrap">
            <LockKeyhole size={18} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
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
          <span
            className="auth-strength"
            aria-label={`Password strength ${passwordScore} of 4`}
          >
            {[1, 2, 3, 4].map((level) => (
              <i
                key={level}
                className={level <= passwordScore ? "is-active" : ""}
              />
            ))}
          </span>
          <small>Use 8+ characters with uppercase, number and symbol.</small>
        </label>

        <label className="auth-field">
          <span>Confirm password</span>
          <div
            className={`auth-input-wrap ${confirmPassword && password !== confirmPassword ? "is-error" : ""}`}
          >
            <LockKeyhole size={18} />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              autoComplete="new-password"
              required
            />
          </div>
          {confirmPassword && password !== confirmPassword && (
            <small className="auth-error">Passwords do not match.</small>
          )}
        </label>

        <button
          className="auth-submit"
          type="submit"
          disabled={!isValid || submitting}
        >
          {submitting ? "Creating your account…" : "Create secure account"}
          {!submitting && <ArrowRight size={18} />}
        </button>
        <p className="auth-switch">
          Already registered?{" "}
          <button type="button" onClick={() => setActiveNav("login")}>
            Sign in
          </button>
        </p>
      </form>
    </AuthShell>
  );
};
