"use client";

import React, { useState } from "react";
import { useCustomer } from "@/mock/CustomerContext";

export const DisputesPage: React.FC = () => {
  const { activities, setActiveNav } = useCustomer();
  const [reference, setReference] = useState("");
  const [reason, setReason] = useState("");
  return (
    <div className="mx-auto max-w-7xl space-y-9 pb-14">
      <section className="relative overflow-hidden rounded-[30px] bg-[#171b29] px-7 py-9 text-white sm:px-10">
        <div className="send-current" />
        <div className="relative z-10">
          <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#ffaaa5]">
            Transaction protection
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-[-.045em] sm:text-5xl">
            Raise a concern with the evidence attached.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">
            Select your transaction, explain what happened and follow every
            review stage from one case timeline.
          </p>
        </div>
      </section>
      <section className="grid gap-9 lg:grid-cols-[1.05fr_.95fr]">
        <form
          className="space-y-7"
          onSubmit={(event) => event.preventDefault()}
        >
          <div>
            <label className="text-[11px] font-bold uppercase tracking-[.14em] text-[#b15357]">
              Transaction reference
            </label>
            <select
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="mt-3 w-full border-0 border-b border-slate-300 bg-transparent py-4 text-sm font-bold outline-none focus:border-[#d76164]"
            >
              <option value="">Choose one of your transactions</option>
              {activities.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} · {item.description} · {item.amountFormatted}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-[.14em] text-[#b15357]">
              What went wrong?
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-3 w-full border-0 border-b border-slate-300 bg-transparent py-4 text-sm font-bold outline-none focus:border-[#d76164]"
            >
              <option value="">Select a reason</option>
              <option>Recipient did not receive funds</option>
              <option>Amount or fee is incorrect</option>
              <option>I do not recognize this transaction</option>
              <option>Transaction is delayed</option>
              <option>Something else</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-[.14em] text-[#b15357]">
              Your explanation
            </label>
            <textarea
              rows={5}
              placeholder="Include dates, recipient details and what you expected to happen."
              className="mt-3 w-full resize-none border border-slate-200 bg-[#fffaf7] p-4 text-sm outline-none focus:border-[#d76164]"
            />
          </div>
          <div className="flex justify-end">
            <button
              disabled={!reference || !reason}
              className="rounded-xl bg-[#d76164] px-5 py-3 text-xs font-bold text-white disabled:opacity-35"
            >
              Review dispute
            </button>
          </div>
        </form>
        <aside className="bg-[#f8ece5] p-8">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#b15357]">
            What happens next
          </p>
          <div className="mt-6">
            {[
              [
                "01",
                "Case received",
                "A case reference and evidence checklist are created.",
              ],
              [
                "02",
                "Transaction traced",
                "Operations reviews ledger and network confirmations.",
              ],
              [
                "03",
                "Resolution issued",
                "You receive the outcome and any corrective action.",
              ],
            ].map(([number, title, copy]) => (
              <div
                key={number}
                className="grid grid-cols-[32px_1fr] gap-3 border-b border-[#e5d2ca] py-5"
              >
                <span className="text-xs font-bold text-[#b15357]">
                  {number}
                </span>
                <div>
                  <strong className="text-sm text-[#2e2522]">{title}</strong>
                  <p className="mt-1 text-xs leading-5 text-[#76635d]">
                    {copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-7 text-xs leading-5 text-[#76635d]">
            Urgent account-security concerns should also be reported through
            Support immediately.
          </p>
          <button
            onClick={() => setActiveNav("support")}
            type="button"
            className="mt-4 text-xs font-bold text-[#9f4d51]"
          >
            Open support
          </button>
        </aside>
      </section>
      <section>
        <div className="flex justify-between border-b border-slate-200 pb-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#b15357]">
              Your cases
            </p>
            <h2 className="mt-2 text-2xl font-bold">Dispute history</h2>
          </div>
          <span className="money-number text-3xl font-bold text-slate-300">
            0
          </span>
        </div>
        <div className="grid min-h-48 place-items-center text-center">
          <div>
            <p className="text-sm font-bold text-slate-700">
              No cases have been opened.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Submitted disputes and their timelines will appear here.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
