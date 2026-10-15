"use client";

import React from "react";
import { MessageSquareWarning, ShieldCheck } from "lucide-react";

export const DisputesPage: React.FC = () => (
  <section className="mx-auto max-w-6xl pb-12">
    <header className="border-b border-slate-200 pb-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#008f94]">
        Customer support
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
        Transaction disputes
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        Raise and follow up on concerns relating to your own MoneyFlow
        transactions.
      </p>
    </header>
    <div className="mt-6 grid gap-5 lg:grid-cols-2">
      <div className="border border-slate-200 bg-white p-7 shadow-sm">
        <MessageSquareWarning className="h-7 w-7 text-[#001f5b]" />
        <h2 className="mt-4 text-lg font-bold text-slate-950">
          No disputes found
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          No cases are displayed until the live dispute service is connected.
          This area will never show another customer’s cases.
        </p>
      </div>
      <div className="border border-slate-200 bg-white p-7 shadow-sm">
        <ShieldCheck className="h-7 w-7 text-[#008f94]" />
        <h2 className="mt-4 text-lg font-bold text-slate-950">
          Need help with a payment?
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Use Support to contact E-NAKO while dispute submission is being
          connected to the live API.
        </p>
      </div>
    </div>
  </section>
);
