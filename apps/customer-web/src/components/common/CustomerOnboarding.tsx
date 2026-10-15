"use client";

import React, { useState } from "react";
import { ArrowRight, ShieldCheck, UserRound, Wallet } from "lucide-react";
import { useCustomer } from "@/mock/CustomerContext";

export const CustomerOnboarding: React.FC = () => {
  const {
    showOnboarding,
    setShowOnboarding,
    setActiveNav,
    user,
    completeOnboarding,
  } = useCustomer();
  const [step, setStep] = useState(1);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState("");

  if (!showOnboarding) return null;

  const finish = async () => {
    setError("");
    setFinishing(true);
    try {
      await completeOnboarding();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "We could not finish account setup.",
      );
    } finally {
      setFinishing(false);
    }
  };

  const content = [
    {
      icon: UserRound,
      title: `Welcome${user.name ? `, ${user.name}` : ""}`,
      text: "Your MoneyFlow account starts with your own details only. No sample balances, transactions, or beneficiaries are shown.",
      action: "Continue",
    },
    {
      icon: ShieldCheck,
      title: "Verify your identity",
      text: "Complete your personal profile and KYC verification before financial services are enabled.",
      action: "Open profile",
      route: "profile-kyc",
    },
    {
      icon: ShieldCheck,
      title: "Protect your account",
      text: "Set up your preferred security controls. Live MFA management will be available through the authentication service.",
      action: "Open security",
      route: "security",
    },
    {
      icon: Wallet,
      title: "Your wallet is ready for setup",
      text: "Balances and transactions will appear only when they are returned by the live MoneyFlow API.",
      action: "Go to dashboard",
    },
  ][step - 1];
  const Icon = content.icon;

  const next = async () => {
    if (content.route) setActiveNav(content.route);
    if (step === 4) await finish();
    else setStep((current) => current + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <section className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-[#001f5b] via-[#00c2c7] to-[#D4AF37]" />
        <div className="p-7 sm:p-9">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Getting started</span>
            <span>{step} / 4</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-[#001f5b] transition-all"
              style={{ width: `${step * 25}%` }}
            />
          </div>
          <div className="mt-8 w-12 h-12 rounded-2xl bg-[#001f5b] text-[#00c2c7] flex items-center justify-center">
            <Icon className="w-6 h-6" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-slate-950">
            {content.title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {content.text}
          </p>
          {error ? (
            <p className="mt-3 text-sm font-medium text-rose-700">{error}</p>
          ) : null}
          <div className="mt-9 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setShowOnboarding(false)}
              className="text-sm font-semibold text-slate-500 hover:text-slate-900"
            >
              Skip for now
            </button>
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-2 rounded-xl bg-[#001f5b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#001744]"
            >
              {finishing ? "Saving your account…" : content.action}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
