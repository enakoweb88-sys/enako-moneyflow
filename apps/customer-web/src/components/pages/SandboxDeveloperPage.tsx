"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Copy, KeyRound, Play, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { restoreSession } from "@/lib/supabaseAuth";

type KeyView = {
  id: string;
  prefix: string;
  label: string;
  lastUsedAt?: string;
  createdAt: string;
};
type PaymentResult = {
  movementId: string;
  reference: string;
  status: string;
  amountMinor: number;
  balanceMinor: number;
};

export function SandboxDeveloperPage() {
  const [keys, setKeys] = useState<KeyView[]>([]);
  const [label, setLabel] = useState("Local website");
  const [secret, setSecret] = useState("");
  const [amount, setAmount] = useState("10");
  const [outcome, setOutcome] = useState("SUCCESS");
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [busy, setBusy] = useState(false);
  const base =
    process.env.NEXT_PUBLIC_MONEYFLOW_API_URL?.replace(/\/$/, "") ||
    "http://localhost:8081";

  const portal = useCallback(
    async (path: string, init?: RequestInit) => {
      const session = await restoreSession();
      if (!session) throw new Error("Sign in again to manage Sandbox keys.");
      const response = await fetch(`${base}/api/v1/developer/keys${path}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
          ...(init?.headers || {}),
        },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(
          payload.detail ||
            payload.message ||
            `Request failed (${response.status}).`,
        );
      return payload;
    },
    [base],
  );

  const load = useCallback(
    async () => setKeys((await portal("")) as KeyView[]),
    [portal],
  );
  useEffect(() => {
    // Initial remote state hydration is intentionally effect-driven.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load().catch((error) => toast.error(error.message));
  }, [load]);

  const createKey = async () => {
    setBusy(true);
    try {
      const issued = (await portal("", {
        method: "POST",
        body: JSON.stringify({ label }),
      })) as KeyView & { secret: string };
      setSecret(issued.secret);
      await load();
      toast.success(
        "Sandbox key created. Copy it now—it will not be shown again.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Key creation failed.",
      );
    } finally {
      setBusy(false);
    }
  };

  const testPayment = async () => {
    if (!secret) return toast.error("Create or paste a Sandbox key first.");
    setBusy(true);
    try {
      const response = await fetch(`${base}/api/v1/sandbox-api/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-MoneyFlow-Key": secret,
          "Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({
          amountMinor: Number(amount),
          outcome,
          customerReference: `web-${Date.now()}`,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(
          payload.detail ||
            payload.message ||
            `Payment failed (${response.status}).`,
        );
      setResult(payload as PaymentResult);
      toast.success("Sandbox payment accepted through the external API.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Payment request failed.",
      );
    } finally {
      setBusy(false);
    }
  };

  const curl = `curl -X POST ${base}/api/v1/sandbox-api/payments \\\n+  -H "Content-Type: application/json" \\\n+  -H "X-MoneyFlow-Key: ${secret || "mf_sbx_your_key"}" \\\n+  -H "Idempotency-Key: order-1001" \\\n+  -d '{"amountMinor":10,"outcome":"SUCCESS","customerReference":"ORDER-1001"}'`;

  return (
    <div className="space-y-6 pb-10">
      <section className="rounded-[30px] bg-[#091a33] p-7 text-white sm:p-10">
        <span className="text-[11px] font-bold uppercase tracking-[.16em] text-cyan-300">
          Developer Sandbox
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-[-.04em]">
          Connect your own application.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Create a revocable test key, send idempotent fake-deposit requests and
          inspect exactly the response your integration receives. No real funds
          move here.
        </p>
      </section>
      <div className="grid gap-6 xl:grid-cols-[.85fr_1.15fr]">
        <section className="rounded-[24px] border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-[#c75b60]" />
            <h2 className="text-lg font-bold">Sandbox API keys</h2>
          </div>
          <div className="mt-5 flex gap-2">
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm"
            />
            <button
              disabled={busy}
              onClick={createKey}
              className="inline-flex items-center gap-2 rounded-xl bg-[#001f5b] px-4 py-3 text-xs font-bold text-white"
            >
              <Plus className="h-4 w-4" /> Create key
            </button>
          </div>
          {secret ? (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-bold text-amber-900">
                Copy this secret now
              </p>
              <div className="mt-2 flex gap-2">
                <code className="min-w-0 flex-1 break-all text-xs text-amber-900">
                  {secret}
                </code>
                <button
                  onClick={() => {
                    void navigator.clipboard.writeText(secret);
                    toast.success("Key copied.");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : null}
          <div className="mt-5 divide-y divide-slate-100">
            {keys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <strong className="block text-sm">{key.label}</strong>
                  <code className="text-xs text-slate-500">
                    {key.prefix}••••
                  </code>
                </div>
                <button
                  aria-label="Revoke key"
                  onClick={() =>
                    void portal(`/${key.id}`, { method: "DELETE" })
                      .then(load)
                      .then(() => toast.success("Key revoked."))
                  }
                  className="text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-[24px] border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold">Send a fake deposit</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <label className="text-xs font-bold text-slate-600">
              Amount XAF
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3"
              />
            </label>
            <label className="text-xs font-bold text-slate-600">
              Outcome
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3"
              >
                <option>SUCCESS</option>
                <option>PENDING</option>
                <option>FAILED</option>
              </select>
            </label>
            <button
              disabled={busy}
              onClick={testPayment}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#d76164] px-4 py-3 text-xs font-bold text-white"
            >
              <Play className="h-4 w-4" /> Send request
            </button>
          </div>
          {result ? (
            <pre className="mt-5 overflow-auto rounded-2xl bg-[#07162f] p-4 text-xs leading-6 text-cyan-100">
              {JSON.stringify(result, null, 2)}
            </pre>
          ) : null}
        </section>
      </div>
      <section className="rounded-[24px] border border-slate-200 bg-white p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#b15357]">
              Quick start
            </p>
            <h2 className="mt-1 text-xl font-bold">Call it from any backend</h2>
          </div>
          <button
            onClick={() => {
              void navigator.clipboard.writeText(curl);
              toast.success("cURL copied.");
            }}
            className="text-xs font-bold text-[#001f5b]"
          >
            Copy cURL
          </button>
        </div>
        <pre className="mt-5 overflow-auto rounded-2xl bg-slate-950 p-5 text-xs leading-6 text-slate-200">
          {curl}
        </pre>
        <p className="mt-4 text-xs leading-5 text-slate-500">
          Reuse the same Idempotency-Key when retrying the same payment. A
          different amount with the same key is rejected. Retrieve status with{" "}
          <code>GET /api/v1/sandbox-api/payments/{`{movementId}`}</code>.
        </p>
      </section>
    </div>
  );
}
