"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useCustomer } from "@/mock/CustomerContext";
import { IllustrationReel } from "@/components/common/IllustrationReel";

const steps = [
  {
    eyebrow: "Welcome to MoneyFlow",
    title: "Let’s prepare your account for real transactions.",
    description:
      "We’ll guide you through the essential account details, identity checks and security settings needed before you move funds. Your dashboard contains only information connected to your account—never sample customer data.",
    details: [
      "Review the name and phone number used at registration",
      "Choose the avatar that represents you",
      "Create your secure MoneyFlow customer profile",
    ],
    action: "Set up my profile",
    frame: 0,
    animated: false,
    route: "profile-kyc",
  },
  {
    eyebrow: "Identity verification",
    title: "Verify who you are and unlock account services.",
    description:
      "MoneyFlow uses identity verification to protect customers and meet regional financial requirements. Add accurate identity details and supporting documents so our compliance team can review your account.",
    details: [
      "Use a valid government-issued identity document",
      "Make sure names match your registered profile",
      "Track verification status from your dashboard",
    ],
    action: "Review verification",
    frame: 1,
    animated: true,
    route: "profile-kyc",
  },
  {
    eyebrow: "Account protection",
    title: "Add another layer of security before money moves.",
    description:
      "Protect sign-ins and sensitive actions with strong credentials and multi-factor authentication. Security controls help prevent unauthorized changes and payment instructions.",
    details: [
      "Review active sign-in sessions",
      "Enable multi-factor authentication when available",
      "Keep recovery information current",
    ],
    action: "Review security",
    frame: 2,
    animated: false,
    route: "security",
  },
  {
    eyebrow: "You’re ready",
    title: "Your workspace is prepared for the next step.",
    description:
      "Once verification and service activation are complete, wallet balances, settlements and transfer activity will appear here directly from the secure MoneyFlow API.",
    details: [
      "No demo balances or transactions",
      "Clear status for every account requirement",
      "A single workspace for regional money movement",
    ],
    action: "Open my dashboard",
    frame: 3,
    animated: false,
  },
];

export const CustomerOnboarding = () => {
  const {
    showOnboarding,
    setShowOnboarding,
    setActiveNav,
    completeOnboarding,
  } = useCustomer();
  const [step, setStep] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState("");
  if (!showOnboarding) return null;
  const current = steps[step];

  const next = async () => {
    setError("");
    if (step < steps.length - 1) {
      if (current.route) setActiveNav(current.route);
      setStep((value) => value + 1);
      return;
    }
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

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#06132b]/78 p-4 backdrop-blur-md">
      <section className="grid max-h-[92dvh] w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-[0_32px_100px_rgba(0,10,35,.4)] lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative flex min-h-[300px] flex-col overflow-hidden bg-[#fff9f6] p-7 lg:min-h-[700px] lg:p-10">
          <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(#f2c7c2_1px,transparent_1px)] [background-size:22px_22px]" />
          <IllustrationReel
            source="/moneyflow-verification-reel.png"
            animated={current.animated}
            frame={current.frame}
            label={`${current.eyebrow} illustration`}
            className="relative m-auto h-[260px] w-full max-w-[430px] lg:h-[470px]"
          />
          <div className="relative mt-auto border-t border-[#efdad5] pt-6 text-[#102544]">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#d45f62]">
              Step {step + 1} of {steps.length}
            </p>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
              {current.animated
                ? "Watch the verification flow—from document to approval."
                : "One clear action at a time, with no hidden requirements."}
            </p>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-col overflow-y-auto p-7 sm:p-10 lg:p-14">
          <button
            type="button"
            onClick={() => setShowOnboarding(false)}
            className="absolute right-6 top-6 rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
            aria-label="Close setup guide"
          >
            <X size={17} />
          </button>
          <div className="mb-10 flex gap-2 pr-12">
            {steps.map((_, index) => (
              <span
                key={index}
                className={`h-1 flex-1 rounded-full ${index <= step ? "bg-[#008f94]" : "bg-slate-200"}`}
              />
            ))}
          </div>
          <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-[#008f94]">
            {current.eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.05] tracking-[-.04em] text-[#0b1f41] sm:text-5xl">
            {current.title}
          </h1>
          <p className="mt-6 text-[15px] leading-7 text-slate-600">
            {current.description}
          </p>
          <div className="mt-8 border-y border-slate-200 py-2">
            {current.details.map((detail, index) => (
              <div
                key={detail}
                className="grid grid-cols-[28px_1fr] gap-3 border-b border-slate-100 py-4 last:border-0"
              >
                <span className="text-xs font-bold text-[#008f94]">
                  0{index + 1}
                </span>
                <p className="text-sm font-medium leading-5 text-slate-700">
                  {detail}
                </p>
              </div>
            ))}
          </div>
          {error && (
            <p className="mt-4 text-sm font-semibold text-rose-700">{error}</p>
          )}
          <div className="mt-auto flex items-center justify-between gap-4 pt-10">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((value) => value - 1)}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 disabled:invisible"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              type="button"
              onClick={next}
              disabled={finishing}
              className="inline-flex items-center gap-3 rounded-xl bg-[#001f5b] px-5 py-3 text-sm font-bold text-white hover:bg-[#003078] disabled:opacity-60"
            >
              {finishing ? "Preparing dashboard…" : current.action}
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
