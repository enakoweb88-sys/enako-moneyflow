"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Check, FlaskConical, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { restoreSession } from "@/lib/supabaseAuth";

type Scenario = "DEPOSIT_COMPLETED" | "DEPOSIT_PENDING" | "DEPOSIT_FAILED";

interface SandboxState {
  initialized: boolean;
  balanceMinor: number;
  heldMinor: number;
  availableMinor: number;
  beneficiaries: Array<{
    id: string;
    displayName: string;
    provider: string;
    accountMasked: string;
    status: string;
  }>;
  movements: Array<{
    id: string;
    direction: "credit" | "debit";
    movementType: string;
    status: string;
    amountMinor: number;
    currency: string;
    reference: string;
    description: string;
    createdAt: string;
  }>;
}

const money = new Intl.NumberFormat("en-CM", {
  style: "currency",
  currency: "XAF",
  maximumFractionDigits: 0,
});

const scenarios: Array<{
  value: Scenario;
  title: string;
  description: string;
  tone: string;
}> = [
  {
    value: "DEPOSIT_COMPLETED",
    title: "Deposit succeeds",
    description: "Credits the Sandbox wallet and writes a ledger entry.",
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    value: "DEPOSIT_PENDING",
    title: "Deposit is pending",
    description:
      "Creates an unsettled payment without crediting the test wallet.",
    tone: "bg-amber-50 text-amber-700",
  },
  {
    value: "DEPOSIT_FAILED",
    title: "Deposit fails",
    description:
      "Returns a failed payment response without crediting test funds.",
    tone: "bg-rose-50 text-rose-700",
  },
];

export function SandboxLabPage() {
  const [state, setState] = useState<SandboxState | null>(null);
  const [scenario, setScenario] = useState<Scenario>("DEPOSIT_COMPLETED");
  const [amount, setAmount] = useState("50000");
  const [busy, setBusy] = useState(false);
  const [needsReset, setNeedsReset] = useState(false);

  const api = useCallback(async (path: string, init?: RequestInit) => {
    const session = await restoreSession();
    if (!session)
      throw new Error("Your session has expired. Please sign in again.");
    const base = process.env.NEXT_PUBLIC_MONEYFLOW_API_URL;
    if (!base)
      throw new Error("Customer API is not configured for this environment.");
    const response = await fetch(
      `${base.replace(/\/$/, "")}/api/v1/sandbox${path}`,
      {
        ...init,
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
          ...(init?.headers || {}),
        },
      },
    );
    const payload = (await response.json().catch(() => ({}))) as {
      message?: string;
      detail?: string;
      error?: string;
    };
    if (!response.ok)
      throw new Error(
        payload.detail ||
          payload.message ||
          payload.error ||
          `Sandbox request failed (${response.status}).`,
      );
    return payload;
  }, []);

  const load = useCallback(async () => {
    try {
      const snapshot = (await api("/state")) as unknown as SandboxState;
      setState(snapshot);
      setNeedsReset(!snapshot.initialized);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Sandbox is unavailable.";
      toast.error(message);
    }
  }, [api]);

  useEffect(() => {
    // Initial remote state hydration is intentionally effect-driven.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const reset = async (openingBalanceMinor: number) => {
    setBusy(true);
    try {
      await api("/reset", {
        method: "POST",
        body: JSON.stringify({ openingBalanceMinor }),
      });
      await load();
      toast.success("Sandbox reset. Live data was not touched.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Sandbox reset failed.",
      );
    } finally {
      setBusy(false);
    }
  };

  const run = async () => {
    const amountMinor = Number(amount);
    if (!Number.isInteger(amountMinor) || amountMinor < 1) {
      toast.error("Enter a whole amount of at least 1 XAF.");
      return;
    }
    setBusy(true);
    try {
      await api("/simulate", {
        method: "POST",
        body: JSON.stringify({ scenario, amountMinor }),
      });
      await load();
      toast.success("Scenario completed and added to the Sandbox timeline.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Scenario failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <section className="overflow-hidden rounded-[28px] border border-[#ecd8cd] bg-[#fffaf6]">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_.85fr] lg:p-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f3ddd4] px-3 py-1 text-[11px] font-bold uppercase tracking-[.14em] text-[#9b4f52]">
              <FlaskConical className="h-3.5 w-3.5" /> Safe test environment
            </span>
            <h1 className="mt-5 max-w-2xl text-3xl font-extrabold tracking-[-.035em] text-slate-950 sm:text-4xl">
              Break the flow here, not in Live.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Run predictable deposit outcomes, inspect wallet changes and
              repeat your tests. Sandbox funds and events are isolated from
              Live; withdrawals require an approved Live account.
            </p>
          </div>
          <div className="rounded-3xl bg-[#14233c] p-6 text-white shadow-[0_22px_55px_rgba(20,35,60,.16)]">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#efb2a8]">
              Test balance
            </p>
            <p className="mt-3 text-4xl font-extrabold tracking-tight">
              {money.format(state?.balanceMinor ?? 0)}
            </p>
            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-300">
              <span>Available</span>
              <strong className="text-white">
                {money.format(state?.availableMinor ?? 0)}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-[#b05a5e]">
                Scenario runner
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-950">
                Choose the provider outcome
              </h2>
            </div>
            <label className="text-xs font-semibold text-slate-600">
              Amount in XAF
              <input
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value.replace(/\D/g, ""))
                }
                inputMode="numeric"
                className="mt-1 block w-44 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-[#d76164]"
              />
            </label>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {scenarios.map((item) => (
              <button
                type="button"
                key={item.value}
                onClick={() => setScenario(item.value)}
                className={`rounded-2xl border p-4 text-left transition ${scenario === item.value ? "border-[#d76164] bg-[#fff8f5] shadow-sm" : "border-slate-200 hover:border-slate-300"}`}
              >
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${item.tone}`}
                >
                  {scenario === item.value
                    ? "Selected"
                    : item.title.split(" ").at(-1)}
                </span>
                <strong className="mt-3 block text-sm text-slate-900">
                  {item.title}
                </strong>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  {item.description}
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={busy || needsReset}
            onClick={run}
            className="mt-5 w-full rounded-xl bg-[#001f5b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#12336d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy
              ? "Running…"
              : needsReset
                ? "Reset Sandbox first"
                : "Run selected scenario"}
          </button>
        </section>

        <aside className="space-y-4">
          <section className="rounded-[26px] border border-[#eadbd0] bg-[#fbf6f0] p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <RefreshCw className="h-4 w-4 text-[#b65359]" /> Start from a
              clean state
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-600">
              {needsReset
                ? "Create your first test wallet and two test beneficiaries. Choose an opening balance below."
                : "Reset removes only your Sandbox events and recreates the two test beneficiaries."}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[100000, 1000000, 5000000].map((value) => (
                <button
                  key={value}
                  type="button"
                  disabled={busy}
                  onClick={() => void reset(value)}
                  className="rounded-xl border border-[#e5cfc5] bg-white px-2 py-2.5 text-xs font-bold text-[#8c4c4f] hover:border-[#d76164] disabled:opacity-50"
                >
                  {value >= 1000000 ? `${value / 1000000}m` : "100k"}
                </button>
              ))}
            </div>
          </section>
          <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              <strong>Simulation only.</strong> These balances cannot be
              withdrawn, converted or transferred to Live.
            </p>
          </div>
        </aside>
      </div>

      <section className="rounded-[26px] border border-slate-200 bg-white p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">
              Database-backed timeline
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">
              Latest test events
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {state?.movements.length ?? 0} events
          </span>
        </div>
        <div className="mt-5 divide-y divide-slate-100">
          {state?.movements.length ? (
            state.movements.map((movement) => (
              <div
                key={movement.id}
                className="grid gap-3 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 grid h-8 w-8 place-items-center rounded-full ${movement.status === "completed" ? "bg-emerald-50 text-emerald-700" : movement.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}
                  >
                    <Check className="h-4 w-4" />
                  </span>
                  <div>
                    <strong className="block text-sm capitalize text-slate-900">
                      {movement.movementType}
                    </strong>
                    <span className="text-xs text-slate-500">
                      {movement.reference} ·{" "}
                      {new Date(movement.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <span
                  className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${movement.status === "completed" ? "bg-emerald-50 text-emerald-700" : movement.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}
                >
                  {movement.status}
                </span>
                <strong
                  className={`text-sm ${movement.direction === "credit" ? "text-emerald-700" : "text-slate-900"}`}
                >
                  {movement.direction === "credit" ? "+" : "−"}
                  {money.format(movement.amountMinor)}
                </strong>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-sm text-slate-500">
              {needsReset
                ? "Create your test wallet above to begin."
                : "No test events yet. Run your first scenario."}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
