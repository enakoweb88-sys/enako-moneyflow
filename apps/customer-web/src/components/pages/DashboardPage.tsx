"use client";

import React from "react";
import { ArrowRight, ShieldCheck, Wallet } from "lucide-react";
import { useCustomer } from "@/mock/CustomerContext";
import { Button } from "@/components/ui/button";

export const DashboardPage: React.FC = () => {
  const { user, wallet, activities, setActiveNav, setShowOnboarding } =
    useCustomer();
  const hasProfile = Boolean(user.email);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-[#00102f] via-[#001f5b] to-[#008f94] p-7 sm:p-9 text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8ae9ec]">
          MoneyFlow customer portal
        </p>
        <h1 className="mt-3 text-3xl font-bold">
          {hasProfile
            ? `Welcome, ${user.name}`
            : "Set up your MoneyFlow account"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
          Your dashboard only shows information connected to your account.
          Sample people, balances, transactions, and activity have been removed.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button
            onClick={() => setShowOnboarding(true)}
            className="bg-white text-[#001f5b] hover:bg-slate-100"
          >
            Complete account setup <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveNav("profile-kyc")}
            className="border-white/50 bg-transparent text-white hover:bg-white/10"
          >
            Open profile & KYC
          </Button>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-slate-100 p-2 text-[#001f5b]">
              <Wallet className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-bold text-slate-900">Wallet</h2>
              <p className="text-xs text-slate-500">
                Live balance from the secure API
              </p>
            </div>
          </div>
          <p className="mt-6 text-3xl font-bold text-slate-950">
            {wallet.balance.toLocaleString()} {wallet.currency}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            No live wallet records have been returned yet.
          </p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-slate-100 p-2 text-[#001f5b]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-bold text-slate-900">Account status</h2>
              <p className="text-xs text-slate-500">
                Identity and security readiness
              </p>
            </div>
          </div>
          <p className="mt-6 text-lg font-semibold text-slate-950">
            {user.kycStatus}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Complete KYC before services such as transfers and withdrawals can
            be enabled.
          </p>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-bold text-slate-900">Recent activity</h2>
        {activities.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No live activity is available for this account yet.
          </p>
        ) : null}
      </section>
    </div>
  );
};
