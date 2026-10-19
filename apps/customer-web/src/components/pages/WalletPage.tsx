"use client";

import React, { useMemo, useState } from "react";
import { ArrowDownLeft, Check, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { useCustomer } from "@/mock/CustomerContext";
import { formatMoney } from "@/lib/format";

export const WalletPage: React.FC = () => {
  const { wallet, activities, setActiveNav } = useCustomer();
  const [dateFilter, setDateFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const filteredActivities = useMemo(
    () =>
      activities.filter((transaction) => {
        const typeMatches =
          typeFilter === "ALL" ||
          (typeFilter === "IN" && transaction.direction === "in") ||
          (typeFilter === "OUT" && transaction.direction === "out");
        return (
          typeMatches &&
          (statusFilter === "ALL" || transaction.status === statusFilter)
        );
      }),
    [activities, statusFilter, typeFilter],
  );

  const copy = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(label);
    toast.success(`${label} copied`);
    window.setTimeout(() => setCopiedField(null), 1800);
  };

  const downloadStatement = () => {
    const rows = activities.map((item) =>
      [
        item.date,
        item.description,
        item.direction,
        item.amountFormatted,
        item.runningBalance,
        item.status,
      ]
        .map((value) => `"${value}"`)
        .join(","),
    );
    const content = [
      "Date,Description,Direction,Amount,Running Balance,Status",
      ...rows,
    ].join("\n");
    const link = document.createElement("a");
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(content)}`;
    link.download = "E_NAKO_Wallet_Statement_2026.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("Official account statement downloaded");
  };

  const settlementDetails = [
    ["Bank", "Afriland First Bank"],
    ["Account number (RIB)", "10005 00001 02384910283 45"],
    ["SWIFT / BIC", "AFRICMCA"],
    ["Beneficiary", "E NAKO COMPANY PLC"],
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-10 pb-14">
      <section className="relative overflow-hidden rounded-[30px] bg-[#171b29] px-7 py-8 text-white sm:px-10 sm:py-10">
        <div className="wallet-orbit wallet-orbit-one" />
        <div className="wallet-orbit wallet-orbit-two" />
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="wallet-live-dot" />
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#ffaaa5]">
                Wallet connected
              </p>
            </div>
            <p className="mt-7 text-sm text-white/58">Available balance</p>
            <p className="money-number mt-2 text-5xl font-bold tracking-[-.055em] sm:text-6xl">
              {formatMoney(wallet.available, "XAF")}
            </p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/62">
              Your live XAF position, settlement holds and verified ledger move
              together in one account.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveNav("buy-xaf")}
                className="rounded-xl bg-[#ef7775] px-4 py-3 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#e36766]"
              >
                Fund account
              </button>
              <button
                onClick={() => setActiveNav("send-withdraw")}
                className="rounded-xl border border-white/20 bg-white/7 px-4 py-3 text-xs font-bold text-white transition hover:bg-white/12"
              >
                Withdraw funds
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 border-l border-white/12 pl-0 lg:pl-9">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-white/42">
                Ledger balance
              </p>
              <p className="money-number mt-2 text-xl font-bold">
                {formatMoney(wallet.balance, "XAF")}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-white/42">
                Settlement hold
              </p>
              <p className="money-number mt-2 text-xl font-bold text-[#ffaaa5]">
                {formatMoney(wallet.held, "XAF")}
              </p>
            </div>
            <div className="col-span-2 border-t border-white/12 pt-5">
              <div className="flex items-center justify-between text-[11px] text-white/55">
                <span>Account liquidity</span>
                <span className="money-number font-bold text-white">100%</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="wallet-flow-bar h-full w-full rounded-full bg-gradient-to-r from-[#ef7775] via-[#ffb1a6] to-[#72ded5]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[.72fr_1.28fr]">
        <div className="flex flex-col justify-between bg-[#f8ece5] p-7 sm:p-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#b15357]">
              Settlement corridor
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-.04em] text-[#292321]">
              Official inward-wire details.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6e605a]">
              Use these verified instructions when funding through the CEMAC
              clearing corridor. Tap any value to copy it.
            </p>
          </div>
          <div className="mt-10 flex items-center gap-2 text-xs font-bold text-[#3b716e]">
            <span className="wallet-live-dot !h-2 !w-2" /> Corridor available
          </div>
        </div>

        <div className="border-y border-[#dfd8d3]">
          {settlementDetails.map(([label, value]) => (
            <button
              key={label}
              type="button"
              onClick={() => void copy(value, label)}
              className="group grid w-full grid-cols-[minmax(120px,.45fr)_1fr_auto] items-center gap-4 border-b border-[#ebe5e1] px-2 py-5 text-left last:border-0 hover:bg-[#fffaf7] sm:px-4"
            >
              <span className="text-[10px] font-bold uppercase tracking-[.1em] text-slate-400">
                {label}
              </span>
              <strong className="money-number break-all text-sm text-[#292f3d]">
                {value}
              </strong>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f5eee9] text-[#9f5557] transition group-hover:bg-[#ef7775] group-hover:text-white">
                {copiedField === label ? (
                  <Check size={14} />
                ) : (
                  <Copy size={14} />
                )}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#b15357]">
              Audited ledger
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-.04em] text-[#202838]">
              Account statement
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {filteredActivities.length} verified ledger entries in the current
              view.
            </p>
          </div>
          <button
            onClick={downloadStatement}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-300 px-4 py-3 text-xs font-bold text-slate-700 transition hover:border-[#cf7772] hover:text-[#a84f53]"
          >
            <Download size={14} /> Export statement
          </button>
        </div>

        <div className="flex flex-wrap gap-3 border-b border-slate-200 py-5">
          {[
            [
              "Period",
              dateFilter,
              setDateFilter,
              [
                ["ALL", "All activity"],
                ["THIS_MONTH", "This month"],
                ["LAST_30", "Last 30 days"],
              ],
            ],
            [
              "Direction",
              typeFilter,
              setTypeFilter,
              [
                ["ALL", "All directions"],
                ["IN", "Deposits"],
                ["OUT", "Withdrawals"],
              ],
            ],
            [
              "Status",
              statusFilter,
              setStatusFilter,
              [
                ["ALL", "All statuses"],
                ["Completed", "Completed"],
                ["Pending", "Pending"],
                ["Processing", "Processing"],
                ["Failed", "Failed"],
              ],
            ],
          ].map(([label, value, setter, options]) => (
            <label
              key={label as string}
              className="flex items-center gap-2 rounded-full bg-[#f7f4f1] px-3 py-2 text-[11px] font-bold text-slate-500"
            >
              {label as string}
              <select
                value={value as string}
                onChange={(event) =>
                  (setter as React.Dispatch<React.SetStateAction<string>>)(
                    event.target.value,
                  )
                }
                className="bg-transparent font-bold text-slate-800 outline-none"
              >
                {(options as string[][]).map(([optionValue, optionLabel]) => (
                  <option key={optionValue} value={optionValue}>
                    {optionLabel}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        {filteredActivities.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-[10px] font-bold uppercase tracking-[.1em] text-slate-400">
                <tr>
                  <th className="py-4">Date</th>
                  <th>Transaction</th>
                  <th className="text-right">Amount</th>
                  <th className="text-right">Balance</th>
                  <th className="text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map((item) => (
                  <tr
                    key={item.id}
                    className="group border-t border-slate-100 transition hover:bg-[#fffaf7]"
                  >
                    <td className="py-5 text-xs text-slate-500">{item.date}</td>
                    <td className="font-semibold text-slate-800">
                      {item.description}
                    </td>
                    <td
                      className={`money-number text-right font-bold ${item.direction === "in" ? "text-emerald-700" : "text-slate-900"}`}
                    >
                      {item.amountFormatted}
                    </td>
                    <td className="money-number text-right text-slate-500">
                      {item.runningBalance}
                    </td>
                    <td className="text-right">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="relative overflow-hidden border-b border-slate-200 py-16 text-center">
            <div className="wallet-scan-line" />
            <p className="text-sm font-bold text-slate-700">
              Your live ledger is ready.
            </p>
            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">
              Deposits, withdrawals and settlement updates will flow into this
              statement automatically.
            </p>
            <button
              onClick={() => setActiveNav("buy-xaf")}
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#ae5558]"
            >
              <ArrowDownLeft size={14} /> Make the first deposit
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
