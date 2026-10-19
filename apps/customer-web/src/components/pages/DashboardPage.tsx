"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { useCustomer } from "@/mock/CustomerContext";

export const DashboardPage = () => {
  const { user, wallet, activities, setActiveNav, openOnboarding } =
    useCustomer();
  const firstName = user.name?.split(" ")[0] || "there";
  const [storyFrame, setStoryFrame] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setStoryFrame((current) => (current + 1) % 6),
      10000,
    );
    return () => window.clearInterval(timer);
  }, []);

  const readiness = useMemo(
    () => [
      { label: "Email confirmed", complete: true, route: "profile-kyc" },
      {
        label: "Profile details",
        complete: Boolean(user.name && user.name !== user.email),
        route: "profile-kyc",
      },
      { label: "Phone verification", complete: false, route: "profile-kyc" },
      {
        label: "Identity verification",
        complete: user.kycStatus === "Verified",
        route: "profile-kyc",
      },
      { label: "Two-step security", complete: false, route: "security" },
    ],
    [user.email, user.kycStatus, user.name],
  );
  const readinessPercent = Math.max(
    20,
    Math.round(
      (readiness.filter((requirement) => requirement.complete).length /
        readiness.length) *
        100,
    ),
  );

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-10">
      <section className="relative grid min-h-[350px] overflow-hidden rounded-[28px] border border-[#eadfd8] bg-[#fffaf5] text-[#272321] shadow-[0_18px_60px_rgba(82,49,38,.08)] lg:grid-cols-[1.15fr_.85fr]">
        <div className="relative z-10 flex flex-col justify-center px-7 py-9 sm:px-10 lg:px-12">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#b55358]">
            MoneyFlow today
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.06] tracking-[-.045em] sm:text-5xl">
            Welcome back, {firstName}. Your next move is ready.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-[#6f625d]">
            Save, withdraw and move money with protection working quietly in the
            background.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => openOnboarding("dashboard")}
              className="rounded-xl bg-[#d76164] px-4 py-3 text-xs font-bold text-white hover:bg-[#c45256]"
            >
              Continue setup
            </button>
            <button
              onClick={() => setActiveNav("profile-kyc")}
              className="rounded-xl border border-[#d9c8bf] bg-white/65 px-4 py-3 text-xs font-bold text-[#493d38] hover:bg-white"
            >
              Manage profile
            </button>
          </div>
        </div>
        <div className="relative min-h-[300px] overflow-hidden bg-[#f9eee7] p-7 lg:min-h-full lg:p-10">
          <Image
            key={storyFrame}
            src={`/robot-story/frame-${storyFrame + 1}.png`}
            alt="MoneyFlow robot saving and protecting a customer's money"
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="robot-story-frame object-contain p-6 sm:p-8"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,35,66,.04)]">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-[.12em] text-slate-500">
              Available balance
            </p>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
              LIVE API
            </span>
          </div>
          <p className="money-number mt-8 text-4xl font-bold tracking-[-.04em] text-[#102544]">
            {wallet.balance.toLocaleString()} {wallet.currency}
          </p>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Balances appear as soon as your wallet is activated.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,35,66,.04)]">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-[.12em] text-slate-500">
              Recent activity
            </p>
            <span className="money-number text-[10px] font-bold text-slate-400">
              {activities.length} ITEMS
            </span>
          </div>
          <p className="mt-8 text-2xl font-bold tracking-[-.03em] text-[#102544]">
            {activities.length ? "Activity available" : "Nothing yet"}
          </p>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Completed transfers and settlements will be listed here.
          </p>
        </article>
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.12em] text-[#008f94]">
              Account readiness
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-.03em] text-[#102544]">
              Secure your account, one step at a time.
            </h2>
          </div>
          <p className="money-number text-4xl font-bold text-[#102544]">
            {readinessPercent}%
          </p>
        </div>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#008f94] to-[#00c2c7] transition-[width] duration-700"
            style={{ width: `${readinessPercent}%` }}
          />
        </div>
        <div className="mt-7 grid gap-x-8 md:grid-cols-2">
          {readiness.map((requirement) => (
            <button
              key={requirement.label}
              onClick={() => setActiveNav(requirement.route)}
              className="group flex items-center justify-between border-b border-slate-100 py-4 text-left"
            >
              <span className="flex items-center gap-3 text-sm font-semibold text-[#243957]">
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full ${requirement.complete ? "bg-emerald-100 text-emerald-700" : "border border-slate-300 text-transparent"}`}
                >
                  <Check size={13} />
                </span>
                {requirement.label}
              </span>
              <span className="text-xs font-bold text-[#008f94] group-hover:underline">
                {requirement.complete ? "Complete" : "Set up"}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
        <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.12em] text-slate-400">
              Timeline
            </p>
            <h2 className="mt-2 text-xl font-bold text-[#102544]">
              Latest account activity
            </h2>
          </div>
          <button
            onClick={() => setActiveNav("wallet")}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#007f84]"
          >
            View statements <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid min-h-44 place-items-center text-center">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Your activity timeline is clear.
            </p>
            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">
              When you begin moving money, each transfer and status change will
              appear here.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
