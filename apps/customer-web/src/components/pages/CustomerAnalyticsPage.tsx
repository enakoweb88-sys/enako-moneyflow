"use client";

import React, { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { useCustomer } from "@/mock/CustomerContext";
import { formatMoney } from "@/lib/format";

export const CustomerAnalyticsPage: React.FC = () => {
  const { activities, wallet, setActiveNav } = useCustomer();
  const [range, setRange] = useState("30D");
  const metrics = useMemo(() => {
    const completed = activities.filter((item) => item.status === "Completed");
    const incoming = completed
      .filter((item) => item.direction === "in")
      .reduce((total, item) => total + item.amountNumeric, 0);
    const outgoing = completed
      .filter((item) => item.direction === "out")
      .reduce((total, item) => total + item.amountNumeric, 0);
    return {
      incoming,
      outgoing,
      completed: completed.length,
      completionRate: activities.length
        ? Math.round((completed.length / activities.length) * 100)
        : 0,
    };
  }, [activities]);

  const exportReport = () => {
    const report = JSON.stringify(
      { range, wallet, metrics, activities },
      null,
      2,
    );
    const link = document.createElement("a");
    link.href = `data:application/json;charset=utf-8,${encodeURIComponent(report)}`;
    link.download = `moneyflow-analytics-${range.toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("Analytics report downloaded");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-10 pb-14">
      <section className="relative overflow-hidden rounded-[30px] bg-[#171b29] px-7 py-9 text-white sm:px-10">
        <div className="analytics-glow" />
        <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="wallet-live-dot" />
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#ffaaa5]">
                Account intelligence
              </p>
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-.045em] sm:text-5xl">
              See how your money moves, not just where it lands.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">
              Live account movement, settlement quality and transaction patterns
              drawn only from your verified activity.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ["7D", "7 days"],
              ["30D", "30 days"],
              ["90D", "90 days"],
              ["1Y", "1 year"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setRange(value)}
                className={`rounded-full px-3 py-2 text-[11px] font-bold transition ${range === value ? "bg-[#ef7775] text-white" : "bg-white/8 text-white/60 hover:bg-white/12"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.4fr_.6fr]">
        <div className="border-y border-slate-200 py-7">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#b15357]">
                Money movement
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-[-.035em] text-[#202838]">
                Flow over time
              </h2>
            </div>
            <button
              onClick={exportReport}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#aa5256]"
            >
              <Download size={14} /> Export
            </button>
          </div>
          <div className="relative mt-8 h-64 overflow-hidden bg-gradient-to-b from-[#fff8f4] to-white">
            <div className="analytics-grid" />
            {activities.length ? (
              <svg
                viewBox="0 0 600 220"
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="none"
                aria-label="Transaction flow trend"
              >
                <defs>
                  <linearGradient id="flow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ef7775" stopOpacity=".35" />
                    <stop offset="1" stopColor="#ef7775" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 175 C90 165 115 90 200 120 S330 190 405 92 S520 76 600 38 L600 220 L0 220Z"
                  fill="url(#flow)"
                />
                <path
                  d="M0 175 C90 165 115 90 200 120 S330 190 405 92 S520 76 600 38"
                  fill="none"
                  stroke="#d96264"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="text-sm font-bold text-slate-700">
                    Waiting for your first completed transaction.
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    The live flow curve will build automatically as funds move.
                  </p>
                </div>
              </div>
            )}
            <div className="analytics-scan" />
          </div>
        </div>

        <div className="bg-[#f8ece5] p-7">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#b15357]">
            Current position
          </p>
          <p className="money-number mt-6 text-4xl font-bold tracking-[-.045em] text-[#25201f]">
            {formatMoney(wallet.available, "XAF")}
          </p>
          <p className="mt-2 text-xs text-[#75645e]">Available to move now</p>
          <div className="mt-8 border-t border-[#e4d0c7]">
            {[
              ["Money in", metrics.incoming],
              ["Money out", metrics.outgoing],
            ].map(([label, amount]) => (
              <div
                key={label as string}
                className="flex items-center justify-between border-b border-[#eadad3] py-4"
              >
                <span className="text-xs font-semibold text-[#705e58]">
                  {label as string}
                </span>
                <strong className="money-number text-sm text-[#28211f]">
                  {formatMoney(amount as number, "XAF")}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#b15357]">
          Performance signals
        </p>
        <div className="mt-4 grid border-y border-slate-200 md:grid-cols-3">
          {[
            [
              "Completed transfers",
              metrics.completed.toString(),
              "Successfully settled instructions",
            ],
            [
              "Completion rate",
              `${metrics.completionRate}%`,
              "Completed versus total activity",
            ],
            ["Active corridors", "0", "Appears after the first routed payment"],
          ].map(([label, value, description], index) => (
            <div
              key={label}
              className={`py-7 md:px-7 ${index ? "border-t border-slate-200 md:border-l md:border-t-0" : ""}`}
            >
              <p className="text-xs font-semibold text-slate-500">{label}</p>
              <p className="money-number mt-3 text-4xl font-bold tracking-[-.04em] text-[#202838]">
                {value}
              </p>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col justify-between gap-5 bg-[#edf7f5] p-7 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold text-[#24413f]">
            Need the accounting detail behind these signals?
          </p>
          <p className="mt-1 text-xs text-[#5e7774]">
            Open the audited statement for transaction-level evidence.
          </p>
        </div>
        <button
          onClick={() => setActiveNav("wallet")}
          className="self-start rounded-xl bg-[#24413f] px-4 py-3 text-xs font-bold text-white"
        >
          Open wallet & statements
        </button>
      </section>
    </div>
  );
};
