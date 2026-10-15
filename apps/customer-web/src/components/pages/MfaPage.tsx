"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCustomer } from "@/mock/CustomerContext";
import { toast } from "sonner";
import { ShieldCheck, KeyRound, ArrowRight } from "lucide-react";

export const MfaPage: React.FC = () => {
  const { setIsLoggedIn, setActiveNav, setShowOnboarding } = useCustomer();

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [secondsLeft, setSecondsLeft] = useState(45);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleDigitChange = (index: number, val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleanVal;
    setDigits(newDigits);

    // Auto-focus next input
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isComplete = digits.every((d) => d.length === 1);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;
    setIsLoggedIn(true);
    setActiveNav("dashboard");
    setShowOnboarding(true);
    toast.success("MFA verification successful. Welcome back!");
  };

  const handleResend = () => {
    setSecondsLeft(45);
    toast.success("A new 6-digit authentication code was dispatched via SMS.");
  };

  return (
    <div className="py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-lg border-slate-200 rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#001f5b] via-[#00c2c7] to-[#D4AF37]" />
          <CardHeader className="text-center pb-4 pt-6 bg-slate-50/50 border-b border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-[#001f5b] text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
              <KeyRound className="w-6 h-6 text-[#00c2c7]" />
            </div>
            <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900">
              Two-Factor Authentication
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Enter the 6-digit security code dispatched to your verified
              telephone (+237 6••••••82)
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleVerify} className="space-y-6">
              {/* Six Individual Digit Input Boxes */}
              <div className="flex justify-between items-center gap-2">
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001f5b] focus:border-[#001f5b] text-slate-900 bg-white shadow-xs transition-all"
                  />
                ))}
              </div>

              {/* Countdown / Resend Row */}
              <div className="text-center text-xs font-sans">
                {secondsLeft > 0 ? (
                  <span className="text-slate-500 font-mono">
                    Resend code in 00:
                    {secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-[#001f5b] hover:text-[#00c2c7] font-bold underline cursor-pointer transition-colors"
                  >
                    Resend code
                  </button>
                )}
              </div>

              {/* Verify Button */}
              <div>
                <Button
                  variant="default"
                  size="default"
                  type="submit"
                  disabled={!isComplete}
                  className="w-full font-bold bg-[#001f5b] hover:bg-[#00153f] text-white rounded-xl h-11 shadow-xs"
                >
                  Verify Authorization Code{" "}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="text-center pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveNav("login")}
                  className="text-slate-500 hover:text-slate-800 text-xs font-medium cursor-pointer"
                >
                  Return to sign in
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
