"use client";

import React, { useEffect, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import { toast } from "sonner";
import { useCustomer } from "@/mock/CustomerContext";
import { formatMoney, formatNumber } from "@/lib/format";

const rates: Record<string, number> = {
  EUR: 655.957,
  USD: 608.45,
  GBP: 775.4,
  CAD: 442.8,
};
const fees: Record<string, number> = { EUR: 10, USD: 12, GBP: 8, CAD: 15 };

export const BuyXafPage: React.FC = () => {
  const { buyXaf, setActiveNav } = useCustomer();
  const [step, setStep] = useState(0);
  const [currency, setCurrency] = useState("EUR");
  const [amount, setAmount] = useState("");
  const [seconds, setSeconds] = useState(1800);
  const [proof, setProof] = useState<File | null>(null);
  const source = Number(amount) || 0;
  const fee = fees[currency];
  const rate = rates[currency];
  const net = Math.max(0, source - fee);
  const xaf = Math.round(net * rate);
  const reference = "ENK-REM-89211";

  useEffect(() => {
    if (step !== 1 || seconds <= 0) return;
    const timer = window.setInterval(
      () => setSeconds((value) => value - 1),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [seconds, step]);

  const copy = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  };

  const finish = () => {
    buyXaf(source, currency, xaf);
    setStep(3);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-14">
      <section className="relative overflow-hidden rounded-[30px] bg-[#171b29] px-7 py-9 text-white sm:px-10">
        <div className="send-current" />
        <div className="relative z-10">
          <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#ffaaa5]">
            Fund your wallet
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-.045em] sm:text-5xl">
            Convert international funds into usable XAF.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">
            See the rate, fee, expected credit and settlement instructions
            before committing any money.
          </p>
        </div>
      </section>

      {step < 3 ? (
        <div className="grid grid-cols-3 border-y border-slate-200">
          {["Build quote", "Send funds", "Confirm transfer"].map(
            (label, index) => (
              <div
                key={label}
                className={`py-4 text-center text-xs font-bold ${index === step ? "bg-[#f8ece5] text-[#a84f53]" : index < step ? "text-emerald-700" : "text-slate-400"}`}
              >
                {index < step ? "✓ " : `${index + 1}. `}
                {label}
              </div>
            ),
          )}
        </div>
      ) : null}

      {step === 0 ? (
        <section className="grid gap-10 lg:grid-cols-[1.12fr_.88fr]">
          <div className="space-y-8">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[.14em] text-[#b15357]">
                Sending currency
              </label>
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                className="mt-3 w-full border-0 border-b border-slate-300 bg-transparent py-4 text-base font-bold outline-none focus:border-[#d76164]"
              >
                <option>EUR</option>
                <option>USD</option>
                <option>GBP</option>
                <option>CAD</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[.14em] text-[#b15357]">
                You send
              </label>
              <div className="mt-3 flex items-baseline border-b border-slate-300 focus-within:border-[#d76164]">
                <input
                  type="number"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0"
                  className="money-number min-w-0 flex-1 bg-transparent py-4 text-5xl font-bold tracking-[-.05em] outline-none placeholder:text-slate-200"
                />
                <span className="font-bold text-slate-400">{currency}</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                disabled={source <= fee}
                onClick={() => setStep(1)}
                className="rounded-xl bg-[#d76164] px-6 py-4 text-sm font-bold text-white disabled:opacity-35"
              >
                Lock quote and continue
              </button>
            </div>
          </div>
          <aside className="bg-[#f8ece5] p-8">
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#b15357]">
              Live conversion quote
            </p>
            <p className="money-number mt-6 text-4xl font-bold tracking-[-.04em] text-[#28211f]">
              {formatMoney(xaf, "XAF")}
            </p>
            <p className="mt-2 text-xs text-[#75645e]">
              Estimated wallet credit
            </p>
            <div className="mt-8 border-t border-[#e2cec5]">
              {[
                ["Rate", `1 ${currency} = ${formatNumber(rate, 3)} XAF`],
                ["Processing fee", formatMoney(fee, currency)],
                ["Net converted", formatMoney(net, currency)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between border-b border-[#e8d8d0] py-4 text-xs"
                >
                  <span className="text-[#79655e]">{label}</span>
                  <strong className="money-number text-[#2b2421]">
                    {value}
                  </strong>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs leading-5 text-[#75645e]">
              Quote remains valid for 30 minutes after you continue. Final
              credit begins after bank receipt verification.
            </p>
          </aside>
        </section>
      ) : step === 1 ? (
        <section className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <aside className="bg-[#edf7f5] p-8">
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#39716c]">
              Quote reserved
            </p>
            <p className="money-number mt-5 text-4xl font-bold text-[#213b39]">
              {String(Math.floor(seconds / 60)).padStart(2, "0")}:
              {String(seconds % 60).padStart(2, "0")}
            </p>
            <p className="mt-2 text-xs text-[#607b78]">Time remaining</p>
            <p className="mt-8 text-xs leading-5 text-[#607b78]">
              Send exactly {formatMoney(source, currency)} and include the
              reference. Missing references delay matching.
            </p>
          </aside>
          <div>
            <div className="flex items-center justify-between border-y border-slate-200 py-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">
                  Mandatory reference
                </p>
                <strong className="money-number mt-1 block text-2xl text-[#202838]">
                  {reference}
                </strong>
              </div>
              <button
                onClick={() => void copy(reference, "Reference")}
                className="rounded-full bg-[#f7f1ed] p-3 text-[#a75053]"
              >
                <Copy size={15} />
              </button>
            </div>
            {[
              ["Beneficiary", "E-NAKO Financial Clearing SAS"],
              ["Bank", "BNP Paribas Paris Commercial"],
              ["IBAN", "FR76 3000 4001 9283 7465 1928 344"],
              ["BIC / SWIFT", "BNPAFRPP"],
            ].map(([label, value]) => (
              <button
                key={label}
                onClick={() => void copy(value, label)}
                className="group grid w-full grid-cols-[130px_1fr_auto] border-b border-slate-100 py-5 text-left"
              >
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  {label}
                </span>
                <strong className="money-number text-sm text-slate-800">
                  {value}
                </strong>
                <Copy
                  size={14}
                  className="text-slate-300 group-hover:text-[#b15357]"
                />
              </button>
            ))}
            <div className="mt-7 flex justify-between">
              <button
                onClick={() => setStep(0)}
                className="text-xs font-bold text-slate-500"
              >
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                className="rounded-xl bg-[#d76164] px-5 py-3 text-xs font-bold text-white"
              >
                I sent the funds
              </button>
            </div>
          </div>
        </section>
      ) : step === 2 ? (
        <section className="grid gap-10 lg:grid-cols-[1fr_.7fr]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#b15357]">
              Settlement evidence
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-.04em]">
              Confirm your bank transfer.
            </h2>
            <label className="mt-7 grid min-h-52 cursor-pointer place-items-center border border-dashed border-[#d9bcb1] bg-[#fffaf7] p-8 text-center">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="sr-only"
                onChange={(event) => setProof(event.target.files?.[0] ?? null)}
              />
              <span>
                <Upload className="mx-auto text-[#b15357]" />
                <strong className="mt-4 block text-sm">
                  {proof?.name || "Choose bank receipt or transfer advice"}
                </strong>
                <small className="mt-2 block text-slate-500">
                  PDF, PNG or JPG · maximum 10 MB
                </small>
              </span>
            </label>
            <div className="mt-7 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-500"
              >
                Back
              </button>
              <button
                disabled={!proof}
                onClick={finish}
                className="rounded-xl bg-[#d76164] px-5 py-3 text-xs font-bold text-white disabled:opacity-35"
              >
                Submit for matching
              </button>
            </div>
          </div>
          <aside className="bg-[#f8ece5] p-8">
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#b15357]">
              Final check
            </p>
            {[
              ["Reference", reference],
              ["Sent", formatMoney(source, currency)],
              ["Expected credit", formatMoney(xaf, "XAF")],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between border-b border-[#e6d4cc] py-4 text-xs"
              >
                <span className="text-[#79655e]">{label}</span>
                <strong className="money-number">{value}</strong>
              </div>
            ))}
          </aside>
        </section>
      ) : (
        <section className="grid min-h-[430px] place-items-center bg-[#edf7f5] p-8 text-center">
          <div>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#316f69] text-white">
              <Check />
            </span>
            <h2 className="mt-6 text-3xl font-bold">
              Deposit submitted for matching.
            </h2>
            <p className="mt-3 text-sm text-[#5e7774]">
              We’ll update your wallet when the clearing account confirms
              receipt.
            </p>
            <button
              onClick={() => setActiveNav("wallet")}
              className="mt-7 rounded-xl bg-[#24413f] px-5 py-3 text-xs font-bold text-white"
            >
              Return to wallet
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
