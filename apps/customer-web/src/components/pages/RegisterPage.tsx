"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomer } from "@/mock/CustomerContext";
import { toast } from "sonner";
import { UserPlus, ShieldCheck, ArrowRight } from "lucide-react";

export const RegisterPage: React.FC = () => {
  const { setActiveNav, setRegistrationDetails, signUp } = useCustomer();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Calculate Password Strength
  const getPasswordStrength = (pwd: string) => {
    if (!pwd)
      return {
        score: 0,
        label: "None",
        color: "bg-slate-200",
        textCol: "text-slate-400",
      };
    if (pwd.length < 6)
      return {
        score: 25,
        label: "Weak",
        color: "bg-rose-500",
        textCol: "text-rose-600",
      };
    if (pwd.length < 10)
      return {
        score: 65,
        label: "Good",
        color: "bg-amber-500",
        textCol: "text-amber-700",
      };
    return {
      score: 100,
      label: "Strong",
      color: "bg-[#00c2c7]",
      textCol: "text-[#00898d]",
    };
  };

  const strength = getPasswordStrength(password);
  const isValid =
    fullName.trim().length > 2 &&
    email.includes("@") &&
    phone.trim().length > 6 &&
    password.length >= 6 &&
    password === confirmPassword;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setRegistrationDetails({
      name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
    setSubmitting(true);
    try {
      const signedIn = await signUp(email.trim(), password);
      if (signedIn)
        toast.success("Account created. Continue with customer onboarding.");
      else {
        toast.success(
          "Check your email to confirm your account, then sign in.",
        );
        setActiveNav("login");
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
    <div className="py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-lg border-slate-200 rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#001f5b] via-[#00c2c7] to-[#D4AF37]" />
          <CardHeader className="text-center pb-4 pt-6 bg-slate-50/50 border-b border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-[#001f5b] text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
              <UserPlus className="w-6 h-6 text-[#00c2c7]" />
            </div>
            <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900">
              Create an E-NAKO Account
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Start sending cross-border remittances with guaranteed conversion
              parity
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <form
              onSubmit={handleRegister}
              className="space-y-4 text-xs font-sans"
            >
              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                  Full Legal Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter your full legal name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs font-sans border-slate-300 rounded-xl h-10"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                  Corporate / Personal Email
                </label>
                <Input
                  type="email"
                  placeholder="e.g. s.fosso@enako-group.cm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs font-sans border-slate-300 rounded-xl h-10"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                  Phone Number (CEMAC / International)
                </label>
                <Input
                  type="tel"
                  placeholder="e.g. +237 677 89 23 82"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs font-mono border-slate-300 rounded-xl h-10"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs border-slate-300 rounded-xl h-10"
                />

                {/* Password Strength Bar & Label */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${strength.score}%` }}
                        className={`h-full ${strength.color} transition-all duration-300`}
                      />
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Security rating:</span>
                      <span className={`font-semibold ${strength.textCol}`}>
                        {strength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-xs border-slate-300 rounded-xl h-10"
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-rose-600 text-xs mt-1">
                    Passwords do not match.
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  variant="default"
                  size="default"
                  type="submit"
                  disabled={!isValid || submitting}
                  className="w-full font-bold bg-[#001f5b] hover:bg-[#00153f] text-white rounded-xl h-11 shadow-xs"
                >
                  {submitting ? "Creating account…" : "Create account"}{" "}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="text-center pt-3 border-t border-slate-100">
                <span className="text-slate-500">Already registered? </span>
                <button
                  type="button"
                  onClick={() => setActiveNav("login")}
                  className="text-[#001f5b] hover:text-[#00c2c7] font-bold underline cursor-pointer transition-colors"
                >
                  Sign in
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
