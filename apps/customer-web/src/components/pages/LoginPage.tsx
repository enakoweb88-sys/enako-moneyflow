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

export const LoginPage: React.FC = () => {
  const { setActiveNav } = useCustomer();

  const [email, setEmail] = useState("s.fosso@enako-group.cm");
  const [password, setPassword] = useState("••••••••••••");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Route to MFA verification step per requirement 3.4
    toast.success(
      "Credentials verified. Please enter your MFA authentication code.",
    );
    setActiveNav("mfa");
  };

  return (
    <div className="py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              Customer Sign In
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Access your multi-currency wallet and manage international
              remittances
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-2">
            <form
              onSubmit={handleLogin}
              className="space-y-4 text-xs font-sans"
            >
              <div>
                <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs font-sans"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-slate-700 font-semibold uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      toast.info(
                        "Password recovery link sent to your registered email.",
                      )
                    }
                    className="text-emerald-700 hover:text-emerald-900 font-medium cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div className="pt-2">
                <Button
                  variant="default"
                  size="default"
                  type="submit"
                  className="w-full font-semibold"
                >
                  Log in
                </Button>
              </div>

              <div className="text-center pt-2 border-t border-slate-100">
                <span className="text-slate-500">Don’t have an account? </span>
                <button
                  type="button"
                  onClick={() => setActiveNav("register")}
                  className="text-emerald-700 hover:text-emerald-900 font-semibold underline cursor-pointer"
                >
                  Create one
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
