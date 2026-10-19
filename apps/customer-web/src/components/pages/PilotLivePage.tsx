"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Check, Copy, KeyRound, LockKeyhole, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { restoreSession } from "@/lib/supabaseAuth";
import { useCustomer } from "@/mock/CustomerContext";

type PilotKey = {
  id: string;
  prefix: string;
  label: string;
  createdAt: string;
  lastUsedAt?: string;
};
type ProviderReadiness = { mtnMomo: boolean; orangeMoney: boolean };
type WebhookEndpoint = {
  id: string;
  endpointUrl: string;
  secretPrefix: string;
  enabled: boolean;
  createdAt: string;
};
type WebhookDelivery = {
  id: string;
  eventType: string;
  status: string;
  attemptCount: number;
  lastHttpStatus?: number;
  createdAt: string;
};

export function PilotLivePage() {
  const { setActiveNav } = useCustomer();
  const [keys, setKeys] = useState<PilotKey[]>([]);
  const [secret, setSecret] = useState("");
  const [label, setLabel] = useState("Pilot checkout");
  const [busy, setBusy] = useState(false);
  const [section, setSection] = useState<"setup" | "docs">("setup");
  const [readiness, setReadiness] = useState<ProviderReadiness>({
    mtnMomo: false,
    orangeMoney: false,
  });
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const base =
    process.env.NEXT_PUBLIC_MONEYFLOW_API_URL?.replace(/\/$/, "") ||
    "http://localhost:8081";

  const accountApi = useCallback(
    async (path: string, init?: RequestInit) => {
      const session = await restoreSession();
      if (!session) throw new Error("Sign in again to manage Pilot Live keys.");
      const response = await fetch(`${base}${path}`, {
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
  const portal = useCallback(
    (path = "", init?: RequestInit) =>
      accountApi(`/api/v1/developer/payment-keys${path}`, init),
    [accountApi],
  );

  const load = useCallback(async () => {
    const [keyData, providerData, webhookData, deliveryData] =
      await Promise.all([
        portal("?environment=pilot_live") as Promise<PilotKey[]>,
        accountApi(
          "/api/v1/developer/provider-readiness",
        ) as Promise<ProviderReadiness>,
        accountApi(
          "/api/v1/developer/webhook-endpoints?environment=pilot_live",
        ) as Promise<WebhookEndpoint[]>,
        accountApi(
          "/api/v1/developer/webhook-endpoints/deliveries?environment=pilot_live",
        ) as Promise<WebhookDelivery[]>,
      ]);
    setKeys(keyData);
    setReadiness(providerData);
    setWebhooks(webhookData);
    setDeliveries(deliveryData);
  }, [accountApi, portal]);
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
        body: JSON.stringify({ environment: "pilot_live", label }),
      })) as PilotKey & { secret: string };
      setSecret(issued.secret);
      await load();
      toast.success(
        "Pilot Live key created. Copy it now—it will not be shown again.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Key creation failed.",
      );
    } finally {
      setBusy(false);
    }
  };

  const createWebhook = async () => {
    setBusy(true);
    try {
      const issued = (await accountApi("/api/v1/developer/webhook-endpoints", {
        method: "POST",
        body: JSON.stringify({
          environment: "pilot_live",
          endpointUrl: webhookUrl,
        }),
      })) as WebhookEndpoint & { signingSecret: string };
      setWebhookSecret(issued.signingSecret);
      setWebhookUrl("");
      await load();
      toast.success("Webhook endpoint created. Copy its signing secret now.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Webhook creation failed.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <section className="border-b border-slate-200 pb-8 pt-2 sm:pb-10">
        <div className="grid gap-9 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
          <div className="border-l-4 border-[#d76164] pl-6 sm:pl-8">
            <span className="text-[11px] font-bold uppercase tracking-[.18em] text-[#a94d52]">
              Pilot Live · real collections
            </span>
            <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-[-.045em] text-slate-950 sm:text-5xl">
              One integration.
              <br />
              <span className="text-[#ad5458]">A small real payment.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Prove your MTN MoMo or Orange Money checkout before completing
              Live activation. Your shopper never needs a MoneyFlow account.
            </p>
          </div>
          <div className="border-t border-slate-200 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-slate-400">
              The Pilot boundary
            </p>
            <strong className="mt-3 block text-2xl text-slate-950">
              Collect. Confirm. Hold.
            </strong>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Real deposits enter an isolated balance. Withdrawals and transfers
              stay unavailable until Live approval.
            </p>
            <button
              onClick={() => setActiveNav("live-activation")}
              className="mt-5 border-b border-[#a94d52] pb-1 text-sm font-bold text-[#a94d52]"
            >
              Review Live requirements →
            </button>
          </div>
        </div>
      </section>

      <nav
        className="flex gap-7 border-b border-slate-200"
        aria-label="Pilot Live sections"
      >
        {[
          ["setup", "Pilot setup"],
          ["docs", "Developer documentation"],
        ].map(([id, text]) => (
          <button
            key={id}
            type="button"
            onClick={() => setSection(id as "setup" | "docs")}
            className={`border-b-2 px-1 pb-3 text-sm font-bold ${section === id ? "border-[#b15357] text-slate-950" : "border-transparent text-slate-400"}`}
          >
            {text}
          </button>
        ))}
      </nav>

      {section === "setup" && (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            {[
              ["1–1,000 XAF", "Default amount allowed per Pilot payment"],
              ["5,000 XAF", "Default cumulative daily ceiling"],
              ["100% held", "Available only after Live approval"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <strong className="text-2xl text-slate-950">{value}</strong>
                <p className="mt-2 text-xs leading-5 text-slate-500">{label}</p>
              </div>
            ))}
          </section>

          <section className="rounded-[26px] border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-rose-50 p-2 text-[#b15357]">
                <KeyRound className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Pilot Live API keys
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Use this secret only from your website’s backend server.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <input
                value={label}
                maxLength={120}
                onChange={(event) => setLabel(event.target.value)}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm"
              />
              <button
                disabled={busy}
                onClick={createKey}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#001f5b] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                <Plus className="h-4 w-4" /> Create Pilot key
              </button>
            </div>
            {secret && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-bold text-amber-900">
                  Copy this secret now. It will not be displayed again.
                </p>
                <div className="mt-3 flex items-start gap-3">
                  <code className="min-w-0 flex-1 break-all text-xs text-amber-950">
                    {secret}
                  </code>
                  <button
                    aria-label="Copy Pilot key"
                    onClick={() => {
                      void navigator.clipboard.writeText(secret);
                      toast.success("Pilot key copied.");
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            <div className="mt-5 divide-y divide-slate-100">
              {keys.length === 0 ? (
                <div className="py-6 text-sm text-slate-500">
                  No Pilot keys yet.
                </div>
              ) : (
                keys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between py-4"
                  >
                    <div>
                      <strong className="block text-sm text-slate-900">
                        {key.label}
                      </strong>
                      <code className="mt-1 block text-xs text-slate-500">
                        {key.prefix}••••
                      </code>
                    </div>
                    <button
                      aria-label="Revoke Pilot key"
                      className="text-slate-400 hover:text-rose-600"
                      onClick={() =>
                        void portal(`/${key.id}?environment=pilot_live`, {
                          method: "DELETE",
                        })
                          .then(load)
                          .then(() => toast.success("Pilot key revoked."))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[26px] border border-slate-200 bg-white p-6 sm:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a94d52]">
                Payment notifications
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-950">
                Signed webhook endpoint
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                MoneyFlow sends final payment events to this public HTTPS URL
                and retries unsuccessful deliveries.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <input
                type="url"
                value={webhookUrl}
                onChange={(event) => setWebhookUrl(event.target.value)}
                placeholder="https://shop.example.com/webhooks/moneyflow"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm"
              />
              <button
                disabled={busy || !webhookUrl}
                onClick={createWebhook}
                className="rounded-xl bg-[#001f5b] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                Add endpoint
              </button>
            </div>
            {webhookSecret && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-bold text-amber-900">
                  Copy the signing secret now. Use it to verify every MoneyFlow
                  webhook.
                </p>
                <div className="mt-3 flex gap-3">
                  <code className="min-w-0 flex-1 break-all text-xs text-amber-950">
                    {webhookSecret}
                  </code>
                  <button
                    aria-label="Copy webhook secret"
                    onClick={() => {
                      void navigator.clipboard.writeText(webhookSecret);
                      toast.success("Webhook secret copied.");
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            <div className="mt-5 divide-y divide-slate-100">
              {webhooks.length === 0 ? (
                <p className="py-5 text-sm text-slate-500">
                  No Pilot webhook endpoint configured.
                </p>
              ) : (
                webhooks.map((endpoint) => (
                  <div
                    key={endpoint.id}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="min-w-0">
                      <strong className="block truncate text-sm text-slate-900">
                        {endpoint.endpointUrl}
                      </strong>
                      <code className="mt-1 block text-xs text-slate-500">
                        {endpoint.secretPrefix}••••
                      </code>
                    </div>
                    <button
                      aria-label="Delete webhook endpoint"
                      onClick={() =>
                        void accountApi(
                          `/api/v1/developer/webhook-endpoints/${endpoint.id}`,
                          { method: "DELETE" },
                        )
                          .then(load)
                          .then(() =>
                            toast.success("Webhook endpoint removed."),
                          )
                      }
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            {deliveries.length > 0 && (
              <div className="mt-7 border-t border-slate-200 pt-5">
                <h3 className="text-sm font-bold text-slate-950">
                  Recent deliveries
                </h3>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-xs">
                    <thead className="text-slate-400">
                      <tr>
                        <th className="py-2">Event</th>
                        <th>Status</th>
                        <th>Attempts</th>
                        <th>HTTP</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {deliveries.slice(0, 10).map((delivery) => (
                        <tr key={delivery.id}>
                          <td className="py-3 font-semibold text-slate-800">
                            {delivery.eventType}
                          </td>
                          <td>
                            <span
                              className={`rounded-full px-2 py-1 font-bold ${delivery.status === "succeeded" ? "bg-emerald-50 text-emerald-700" : delivery.status === "failed" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}
                            >
                              {delivery.status}
                            </span>
                          </td>
                          <td>{delivery.attemptCount}</td>
                          <td>{delivery.lastHttpStatus || "—"}</td>
                          <td>
                            {new Date(delivery.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
            <div className="flex gap-3">
              <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p>
                  <strong>Real money warning.</strong> Pilot payments contact
                  the configured provider and use real customer funds.
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <ProviderFlag label="MTN MoMo" ready={readiness.mtnMomo} />
                  <ProviderFlag
                    label="Orange Money"
                    ready={readiness.orangeMoney}
                  />
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {section === "docs" && <PilotDocumentation base={base} />}
    </div>
  );
}

function ProviderFlag({ label, ready }: { label: string; ready: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${ready ? "bg-emerald-100 text-emerald-800" : "bg-white/70 text-amber-900"}`}
    >
      {label}: {ready ? "configured" : "not configured"}
    </span>
  );
}

function PilotDocumentation({ base }: { base: string }) {
  const createExample = `curl -X POST ${base}/api/v1/payments \\\n+  -H "Authorization: Bearer mf_plt_your_secret" \\\n+  -H "Idempotency-Key: order-1001" \\\n+  -H "Content-Type: application/json" \\\n+  -d '{\n+    "amount": 10,\n+    "currency": "XAF",\n+    "provider": "MTN_MOMO",\n+    "payer": { "phone": "+237670000000" },\n+    "merchantReference": "ORDER-1001",\n+    "description": "Checkout test"\n+  }'`;
  return (
    <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-2 text-sm text-slate-500">
        <p className="font-bold text-slate-950">On this page</p>
        {[
          "How Pilot works",
          "Create a payment",
          "Payment states",
          "Confirm an order",
          "Move to Live",
        ].map((item, index) => (
          <a
            key={item}
            href={`#pilot-doc-${index}`}
            className="block border-l border-slate-200 py-1 pl-3 hover:border-[#b15357] hover:text-[#9e484c]"
          >
            {item}
          </a>
        ))}
      </aside>
      <article className="min-w-0 space-y-12">
        <section id="pilot-doc-0">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a94d52]">
            01 · How Pilot works
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-.035em] text-slate-950">
            A real collection with a locked settlement.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            Your server creates a payment. MoneyFlow sends the request to MTN
            MoMo or Orange Money. The shopper confirms on the provider channel.
            MoneyFlow verifies the provider result, credits your isolated Pilot
            balance, then notifies your server. The shopper does not create a
            MoneyFlow account.
          </p>
          <ol className="mt-6 border-y border-slate-200">
            {[
              "Create a Pilot key and keep it on your backend.",
              "Send a payment request with a unique order and idempotency reference.",
              "Show a pending state while the shopper confirms on their phone.",
              "Fulfil the order only after payment.completed or a completed status response.",
            ].map((step, index) => (
              <li
                key={step}
                className="grid grid-cols-[36px_1fr] gap-3 border-b border-slate-100 py-4 last:border-0"
              >
                <span className="font-bold text-[#b15357]">0{index + 1}</span>
                <span className="text-sm text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
        </section>
        <section id="pilot-doc-1">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a94d52]">
            02 · Create a payment
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">
            Call MoneyFlow from your server.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Never expose the Pilot key in frontend JavaScript. Use{" "}
            <code>ORANGE_MONEY</code> instead of <code>MTN_MOMO</code> for an
            Orange cash-in.
          </p>
          <div className="mt-5 overflow-hidden rounded-2xl bg-[#07162f]">
            <div className="flex justify-between border-b border-white/10 px-5 py-3 text-xs text-slate-400">
              <span>cURL</span>
              <button
                onClick={() => {
                  void navigator.clipboard.writeText(createExample);
                  toast.success("Example copied.");
                }}
                className="font-bold text-white"
              >
                Copy
              </button>
            </div>
            <pre className="overflow-auto p-5 text-xs leading-6 text-cyan-100">
              {createExample}
            </pre>
          </div>
        </section>
        <section id="pilot-doc-2">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a94d52]">
            03 · Payment states
          </p>
          <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
            {[
              [
                "pending_customer",
                "The request reached the provider and is waiting for customer approval.",
              ],
              [
                "processing",
                "The result is uncertain or still being verified. Keep the order pending.",
              ],
              [
                "completed",
                "The provider result is verified and the order may be fulfilled.",
              ],
              [
                "failed / expired",
                "Do not fulfil. Let the shopper try with a new payment reference.",
              ],
            ].map(([state, copy]) => (
              <div
                key={state}
                className="grid gap-2 py-4 sm:grid-cols-[170px_1fr]"
              >
                <code className="font-bold text-slate-950">{state}</code>
                <p className="text-sm text-slate-600">{copy}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="pilot-doc-3">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a94d52]">
            04 · Confirm an order
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">
            Never trust the first response as payment proof.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Creation is asynchronous. Store the MoneyFlow payment ID beside your
            order. Keep the order pending, verify the signed{" "}
            <code>payment.completed</code> webhook, and use{" "}
            <code>GET /api/v1/payments/{`{paymentId}`}</code> as recovery when a
            webhook is delayed.
          </p>
        </section>
        <section id="pilot-doc-4">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a94d52]">
            05 · Move to Live
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">
            Change the key, not your checkout.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            After Live approval, create an <code>mf_live_</code> key and replace
            the Pilot secret in your server environment. Keep the same endpoint,
            request schema, idempotency logic, payment states and webhook
            handler.
          </p>
          <div className="mt-5 flex items-center gap-3 text-sm font-semibold text-emerald-700">
            <Check className="h-5 w-5" /> Sandbox, Pilot and Live ledgers remain
            isolated.
          </div>
        </section>
      </article>
    </div>
  );
}
