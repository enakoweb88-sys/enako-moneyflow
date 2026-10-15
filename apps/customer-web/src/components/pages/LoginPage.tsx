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
import { ShieldCheck, Lock, Mail, ArrowRight } from "lucide-react";

export const LoginPage: React.FC = () => {
  const { setActiveNav, signIn } = useCustomer();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    try {
      await signIn(email, password);
      toast.success("Signed in successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-lg border-slate-200 rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#001f5b] via-[#00c2c7] to-[#D4AF37]" />
          <CardHeader className="text-center pb-4 pt-6 bg-slate-50/50 border-b border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-[#001f5b] text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#00c2c7]" />
            </div>
            <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900">
              Customer Sign In
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Access your institutional multi-currency wallet and manage
              international remittances
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <form
              onSubmit={handleLogin}
              className="space-y-4 text-xs font-sans"
            >
              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs font-sans border-slate-300 rounded-xl h-11"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-slate-700 font-bold uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      toast.info(
                        "Password recovery link sent to your registered email.",
                      )
                    }
                    className="text-[#001f5b] hover:text-[#00c2c7] font-semibold cursor-pointer transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs border-slate-300 rounded-xl h-11"
                />
              </div>

              <div className="pt-2">
                <Button
                  variant="default"
                  size="default"
                  type="submit"
                  className="w-full font-bold bg-[#001f5b] hover:bg-[#00153f] text-white rounded-xl h-11 shadow-xs"
                >
                  {submitting ? "Signing in…" : "Sign in"}{" "}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="text-center pt-3 border-t border-slate-100">
                <span className="text-slate-500">Don’t have an account? </span>
                <button
                  type="button"
                  onClick={() => setActiveNav("register")}
                  className="text-[#001f5b] hover:text-[#00c2c7] font-bold underline cursor-pointer transition-colors"
                >
                  Register organization
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
