"use client";

import React from "react";
import { BarChart3, WalletCards } from "lucide-react";
import { useCustomer } from "@/mock/CustomerContext";

export const CustomerAnalyticsPage: React.FC = () => {
  const { setActiveNav } = useCustomer();
  return (
    <section className="mx-auto max-w-6xl pb-12">
      <header className="border-b border-slate-200 pb-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#008f94]">
          Your account
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          Activity & analytics
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Understand your own transaction activity, wallet movement and payment
          trends.
        </p>
      </header>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.45fr_1fr]">
        <div className="border border-slate-200 bg-white p-7 shadow-sm">
          <BarChart3 className="h-7 w-7 text-[#001f5b]" />
          <h2 className="mt-4 text-lg font-bold text-slate-950">
            No analytics available yet
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Charts will appear only after your completed MoneyFlow transactions
            are returned by the live API. We do not show sample financial
            activity.
          </p>
        </div>
        <div className="border border-slate-200 bg-white p-7 shadow-sm">
          <WalletCards className="h-7 w-7 text-[#008f94]" />
          <h2 className="mt-4 text-lg font-bold text-slate-950">
            View statements
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Your verified account statements and transaction history are
            available from Wallet & statements.
          </p>
          <button
            className="mt-5 text-sm font-semibold text-[#001f5b] hover:underline"
            onClick={() => setActiveNav("wallet")}
            type="button"
          >
            Open wallet & statements
          </button>
        </div>
      </div>
    </section>
  );
};
