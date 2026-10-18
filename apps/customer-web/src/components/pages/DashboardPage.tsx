"use client";

import { ArrowRight } from "lucide-react";
import { useCustomer } from "@/mock/CustomerContext";
import { CustomerAvatar } from "@/components/common/CustomerAvatar";

export const DashboardPage = () => {
  const { user, wallet, activities, setActiveNav, setShowOnboarding } =
    useCustomer();
  const firstName = user.name?.split(" ")[0] || "there";

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-10">
      <section className="relative overflow-hidden rounded-[28px] bg-[#071a3d] px-7 py-8 text-white sm:px-10 sm:py-10">
        <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[#00c2c7]/18 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <CustomerAvatar
                avatarId={user.avatarId}
                className="h-12 w-12 ring-2 ring-white/20"
                label={`${user.name} avatar`}
              />
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#78e9e5]">
                Customer workspace
              </p>
            </div>
            <h1 className="mt-6 max-w-2xl font-serif text-4xl font-semibold tracking-[-.04em] sm:text-5xl">
              Good to see you, {firstName}.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              Review your account readiness, wallet position and latest activity
              from one clear workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowOnboarding(true)}
              className="rounded-xl bg-white px-4 py-3 text-xs font-bold text-[#001f5b] hover:bg-slate-100"
            >
              Continue setup
            </button>
            <button
              onClick={() => setActiveNav("profile-kyc")}
              className="rounded-xl border border-white/25 px-4 py-3 text-xs font-bold text-white hover:bg-white/10"
            >
              Manage profile
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,35,66,.04)]">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-[.12em] text-slate-500">
              Available balance
            </p>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
              LIVE API
            </span>
          </div>
          <p className="mt-8 text-3xl font-bold tracking-[-.04em] text-[#102544]">
            {wallet.balance.toLocaleString()}{" "}
            <small className="text-sm font-semibold text-slate-400">
              {wallet.currency}
            </small>
          </p>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Balances appear as soon as your wallet is activated.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,35,66,.04)]">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-[.12em] text-slate-500">
              Identity status
            </p>
            <span
              className={`rounded-full px-2 py-1 text-[10px] font-bold ${user.kycStatus === "Verified" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
            >
              {user.kycStatus}
            </span>
          </div>
          <p className="mt-8 text-2xl font-bold tracking-[-.03em] text-[#102544]">
            {user.kycStatus === "Verified"
              ? "Account verified"
              : "Action required"}
          </p>
          <button
            onClick={() => setActiveNav("profile-kyc")}
            className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#007f84]"
          >
            Review requirements <ArrowRight size={14} />
          </button>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,35,66,.04)]">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-[.12em] text-slate-500">
              Recent activity
            </p>
            <span className="text-[10px] font-bold text-slate-400">
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

      <section className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
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
              className="text-xs font-bold text-[#007f84]"
            >
              View statements
            </button>
          </div>
          <div className="grid min-h-48 place-items-center text-center">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Your activity timeline is clear.
              </p>
              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">
                When you begin moving money, each transfer and status change
                will appear here.
              </p>
            </div>
          </div>
        </article>
        <article className="rounded-2xl bg-[#edf8f7] p-6 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[.12em] text-[#008f94]">
            Next best action
          </p>
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-[-.03em] text-[#102544]">
            Complete your customer profile.
          </h2>
          <p className="mt-4 text-xs leading-6 text-slate-600">
            Keep your name, contact details and selected avatar current before
            starting verification.
          </p>
          <button
            onClick={() => setActiveNav("profile-kyc")}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#001f5b] px-4 py-3 text-xs font-bold text-white"
          >
            Open profile <ArrowRight size={14} />
          </button>
        </article>
      </section>
    </div>
  );
};
