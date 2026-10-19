"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { useCustomer } from "@/mock/CustomerContext";
import { formatMoney } from "@/lib/format";

export const SendWithdrawPage: React.FC = () => {
  const { wallet, beneficiaries, withdrawXaf, setActiveNav } = useCustomer();
  const [mode, setMode] = useState<"withdraw" | "send">("withdraw");
  const [beneficiaryId, setBeneficiaryId] = useState(
    beneficiaries[0]?.id ?? "",
  );
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [completedReference, setCompletedReference] = useState("");
  const selectedBeneficiary = beneficiaries.find(
    (item) => item.id === beneficiaryId,
  );
  const numericAmount = Number(amount) || 0;
  const fee = mode === "withdraw" ? Math.round(numericAmount * 0.01) : 0;
  const total = numericAmount + fee;
  const canContinue =
    numericAmount > 0 &&
    total <= wallet.available &&
    (mode === "send"
      ? recipient.trim().length > 3
      : Boolean(selectedBeneficiary));

  const quoteRows = useMemo(
    () => [
      [
        mode === "withdraw" ? "Recipient receives" : "Transfer amount",
        numericAmount,
      ],
      [mode === "withdraw" ? "Network fee · 1%" : "MoneyFlow fee", fee],
      ["Total debit", total],
    ],
    [fee, mode, numericAmount, total],
  );

  useEffect(() => {
    if (!processing) return;
    const timer = window.setTimeout(() => {
      const reference = `${mode === "withdraw" ? "WTH" : "TRF"}-${Date.now().toString().slice(-8)}`;
      withdrawXaf(
        numericAmount,
        fee,
        mode === "withdraw"
          ? selectedBeneficiary?.name || "Beneficiary"
          : recipient,
      );
      setCompletedReference(reference);
      setProcessing(false);
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [
    fee,
    mode,
    numericAmount,
    processing,
    recipient,
    selectedBeneficiary?.name,
    withdrawXaf,
  ]);

  const beginReview = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canContinue) {
      toast.error(
        mode === "withdraw" && !selectedBeneficiary
          ? "Add a verified beneficiary before withdrawing."
          : "Review the recipient, amount and available balance.",
      );
      return;
    }
    setConfirming(true);
  };

  const dispatch = () => {
    setConfirming(false);
    setProcessing(true);
  };

  const reset = () => {
    setAmount("");
    setRecipient("");
    setCompletedReference("");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-14">
      <section className="relative overflow-hidden rounded-[32px] bg-[#171b29] px-7 py-9 text-white shadow-[0_24px_70px_rgba(23,27,41,.16)] sm:px-10 sm:py-11">
        <div className="send-current" />
        <div className="relative z-10 grid gap-9 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#f49a91]">
              Money movement
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-.045em] sm:text-5xl">
              Send money with every detail under control.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/65">
              Choose the destination, see the exact debit and review delivery
              details before authorizing.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[.06] p-5 backdrop-blur-md">
            <p className="text-[10px] font-bold uppercase tracking-[.12em] text-white/45">
              Available balance
            </p>
            <p className="money-number mt-2 text-3xl font-bold">
              {formatMoney(wallet.available, "XAF")}
            </p>
            <button
              onClick={() => setActiveNav("buy-xaf")}
              className="mt-5 w-full rounded-xl bg-[#ef766f] px-4 py-3 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#e36762] hover:shadow-lg"
            >
              Deposit money
            </button>
          </div>
        </div>
      </section>

      <div className="grid rounded-2xl bg-[#f0f1f3] p-1.5 sm:grid-cols-2">
        {[
          ["withdraw", "Withdraw to mobile money"],
          ["send", "Send to MoneyFlow wallet"],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => {
              setMode(value as typeof mode);
              reset();
            }}
            className={`rounded-xl px-4 py-3.5 text-sm font-bold transition ${mode === value ? "bg-white text-[#171b29] shadow-sm" : "text-slate-500 hover:text-[#171b29]"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {completedReference ? (
        <section className="grid min-h-[430px] place-items-center bg-[#edf7f5] p-8 text-center">
          <div>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#316f69] text-white">
              <Check size={25} />
            </span>
            <p className="mt-6 text-[11px] font-bold uppercase tracking-[.14em] text-[#4b7d78]">
              Transfer confirmed
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-.04em] text-[#1f3735]">
              Your money is on its way.
            </h2>
            <p className="money-number mt-4 text-sm font-bold text-[#5d7673]">
              {completedReference}
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <button
                onClick={reset}
                className="rounded-xl bg-[#24413f] px-4 py-3 text-xs font-bold text-white"
              >
                Make another transfer
              </button>
              <button
                onClick={() => setActiveNav("wallet")}
                className="rounded-xl border border-[#b8cfcb] px-4 py-3 text-xs font-bold text-[#315a56]"
              >
                View statement
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <form
            onSubmit={beginReview}
            className="space-y-8 rounded-[28px] border border-[#ebe2dd] bg-white p-6 shadow-[0_18px_55px_rgba(72,48,40,.06)] sm:p-9"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#b15357]">
                01 · Destination
              </p>
              {mode === "withdraw" ? (
                beneficiaries.length ? (
                  <select
                    value={beneficiaryId}
                    onChange={(event) => setBeneficiaryId(event.target.value)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-[#fcfaf8] px-4 py-4 text-sm font-bold outline-none focus:border-[#d76164]"
                  >
                    {beneficiaries.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} · {item.provider} · {item.accountMasked}
                      </option>
                    ))}
                  </select>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveNav("beneficiaries")}
                    className="mt-3 flex w-full items-center justify-between rounded-xl border border-dashed border-[#ddbbb1] bg-[#fffaf7] px-4 py-5 text-left text-sm font-bold text-[#a54f53]"
                  >
                    Add your first verified beneficiary{" "}
                    <ChevronRight size={17} />
                  </button>
                )
              ) : (
                <input
                  value={recipient}
                  onChange={(event) => setRecipient(event.target.value)}
                  placeholder="Recipient email or MoneyFlow ID"
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-[#fcfaf8] px-4 py-4 text-sm font-bold outline-none placeholder:font-medium placeholder:text-slate-300 focus:border-[#d76164]"
                />
              )}
            </div>
            <div>
              <div className="flex items-end justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#b15357]">
                  02 · Amount
                </p>
                <p className="money-number text-xs text-slate-500">
                  Available {formatMoney(wallet.available, "XAF")}
                </p>
              </div>
              <div className="mt-3 flex items-baseline rounded-2xl border border-slate-200 bg-[#fcfaf8] px-5 focus-within:border-[#d76164]">
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0"
                  className="money-number min-w-0 flex-1 bg-transparent py-5 text-5xl font-bold tracking-[-.05em] outline-none placeholder:text-slate-200"
                />
                <span className="text-sm font-bold text-slate-400">XAF</span>
              </div>
              <div className="mt-4 flex gap-2">
                {[25000, 50000, 100000].map((value) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setAmount(String(value))}
                    className="rounded-full bg-[#f7f1ed] px-3 py-2 text-[11px] font-bold text-[#765e57]"
                  >
                    + {value.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={!canContinue}
              className="w-full rounded-xl bg-[#d76164] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#c65357] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Review and authorize
            </button>
          </form>

          <aside className="rounded-[28px] bg-[#f7f4f1] p-7 sm:p-8 lg:sticky lg:top-6 lg:self-start">
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#b15357]">
              Live quote
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-.035em] text-[#28211f]">
              Everything before you approve.
            </h2>
            <div className="mt-7 border-t border-[#e2cec5]">
              {quoteRows.map(([label, value], index) => (
                <div
                  key={label as string}
                  className={`flex items-center justify-between border-b border-[#e8d8d0] py-4 ${index === 2 ? "font-bold" : ""}`}
                >
                  <span className="text-xs text-[#79655e]">
                    {label as string}
                  </span>
                  <span className="money-number text-sm text-[#2b2421]">
                    {formatMoney(value as number, "XAF")}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-7 space-y-4 text-xs leading-5 text-[#74635d]">
              <p>
                <strong className="text-[#3e3430]">Estimated arrival</strong>
                <br />
                {mode === "withdraw"
                  ? "Usually within minutes after network acceptance."
                  : "Immediate after recipient validation."}
              </p>
              <p>
                <strong className="text-[#3e3430]">Security</strong>
                <br />
                Recipient and balance are checked again at authorization.
              </p>
              <p>
                <strong className="text-[#3e3430]">Reference</strong>
                <br />A traceable ledger reference is created after
                confirmation.
              </p>
            </div>
          </aside>
        </section>
      )}

      {!completedReference ? (
        <section className="grid gap-4 border-y border-slate-200 py-6 text-xs text-slate-500 sm:grid-cols-3">
          <p>
            <strong className="block text-slate-800">
              Protected authorization
            </strong>
            <span className="mt-1 block leading-5">
              Balance and destination are rechecked before dispatch.
            </span>
          </p>
          <p>
            <strong className="block text-slate-800">
              Transparent pricing
            </strong>
            <span className="mt-1 block leading-5">
              The final debit is visible before confirmation.
            </span>
          </p>
          <p>
            <strong className="block text-slate-800">Traceable delivery</strong>
            <span className="mt-1 block leading-5">
              Every completed instruction receives a ledger reference.
            </span>
          </p>
        </section>
      ) : null}

      {processing ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#171b29]/80 backdrop-blur">
          <div className="text-center text-white">
            <div className="send-processing mx-auto h-20 w-20 rounded-full border border-white/20" />
            <p className="mt-6 text-xl font-bold">Securing your transfer…</p>
            <p className="mt-2 text-xs text-white/55">
              Checking recipient, balance and payout route
            </p>
          </div>
        </div>
      ) : null}

      <Modal
        isOpen={confirming}
        onClose={() => setConfirming(false)}
        title="Review transfer"
        subtitle="Confirm the final destination and total debit."
        maxWidth="md"
      >
        <div className="space-y-5">
          <div className="border-y border-slate-200">
            {[
              [
                "Destination",
                mode === "withdraw"
                  ? selectedBeneficiary?.name || ""
                  : recipient,
              ],
              ...quoteRows,
            ].map(([label, value]) => (
              <div
                key={label as string}
                className="flex justify-between gap-5 border-b border-slate-100 py-4 last:border-0"
              >
                <span className="text-xs text-slate-500">
                  {label as string}
                </span>
                <strong className="money-number text-right text-sm text-slate-800">
                  {typeof value === "number"
                    ? formatMoney(value, "XAF")
                    : value}
                </strong>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setConfirming(false)}
              className="px-3 py-2 text-xs font-bold text-slate-500"
            >
              Go back
            </button>
            <button
              onClick={dispatch}
              className="rounded-xl bg-[#d76164] px-5 py-3 text-xs font-bold text-white"
            >
              Confirm transfer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
