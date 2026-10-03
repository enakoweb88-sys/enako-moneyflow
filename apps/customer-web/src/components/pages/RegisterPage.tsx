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

export const RegisterPage: React.FC = () => {
  const { setActiveNav } = useCustomer();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      color: "bg-emerald-600",
      textCol: "text-emerald-700",
    };
  };

  const strength = getPasswordStrength(password);
  const isValid =
    fullName.trim().length > 2 &&
    email.includes("@") &&
    phone.trim().length > 6 &&
    password.length >= 6 &&
    password === confirmPassword;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    toast.success("Registration successful. Please verify with MFA code.");
    setActiveNav("mfa");
  };

  return (
    <div className="py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              Create an E-NAKO Account
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Start sending cross-border remittances with guaranteed conversion
              parity
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-2">
            <form
              onSubmit={handleRegister}
              className="space-y-4 text-xs font-sans"
            >
              <div>
                <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                  Full Legal Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Samuel Eto’o Fosso"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="e.g. s.fosso@enako-group.cm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="e.g. +237 677 89 23 82"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs"
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
                <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-xs"
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
                  disabled={!isValid}
                  className="w-full font-semibold"
                >
                  Create account
                </Button>
              </div>

              <div className="text-center pt-2 border-t border-slate-100">
                <span className="text-slate-500">
                  Already have an account?{" "}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveNav("login")}
                  className="text-emerald-700 hover:text-emerald-900 font-semibold underline cursor-pointer"
                >
                  Log in
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
