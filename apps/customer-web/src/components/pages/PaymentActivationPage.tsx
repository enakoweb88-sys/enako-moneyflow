"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  ShieldCheck,
} from "lucide-react";
import { useCustomer } from "@/mock/CustomerContext";
import { restoreSession } from "@/lib/supabaseAuth";
import { toast } from "sonner";

const steps = [
  "Business use",
  "Organisation",
  "Representative",
  "Payment channels",
  "Settlement",
  "Review",
];
const uses = [
  [
    "accept",
    "Accept payments",
    "Collect customer payments through payment links, checkout, or an integrated website.",
  ],
  [
    "payouts",
    "Send payouts",
    "Pay suppliers, staff, or customers to MTN MoMo and Orange Money.",
  ],
  [
    "platform",
    "Build a platform",
    "Enable your own customers to accept payments and receive payouts through your product.",
  ],
] as const;

export const PaymentActivationPage: React.FC = () => {
  const { setActiveNav } = useCustomer();
  const [step, setStep] = useState(0);
  const [useCase, setUseCase] = useState<(typeof uses)[number][0] | "">("");
  const [channels, setChannels] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    businessCountry: "CM",
    organisationType: "",
    legalBusinessName: "",
    representativeName: "",
    representativeEmail: "",
    representativePhone: "",
    representativeRole: "",
    settlementCurrency: "XAF",
    expectedMonthlyVolume: "",
  });
  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const api = async (path: string, options?: RequestInit) => {
    const session = await restoreSession();
    const baseUrl = process.env.NEXT_PUBLIC_MONEYFLOW_API_URL;
    if (!session || !baseUrl)
      throw new Error("Sign in again before continuing payment setup.");
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });
    if (response.status === 404) return null;
    const payload = await response.json().catch(() => ({}));
    if (!response.ok)
      throw new Error(payload.message || "Payment setup could not be saved.");
    return payload;
  };
  useEffect(() => {
    void api("/api/v1/payment-activations/me")
      .then((request) => {
        if (!request) return;
        const reverseChannelMap: Record<string, string> = {
          mtn_momo: "mtn",
          orange_money: "orange",
          bank_settlement: "bank",
        };
        setUseCase(request.businessUse || "");
        setChannels(
          (request.channels || [])
            .map((item: string) => reverseChannelMap[item])
            .filter(Boolean),
        );
        setStatus(request.status || "");
        setForm((current) => ({
          ...current,
          businessCountry: request.businessCountry || "CM",
          organisationType: request.organisationType || "",
          legalBusinessName: request.legalBusinessName || "",
          representativeName: request.representativeName || "",
          representativeEmail: request.representativeEmail || "",
          representativePhone: request.representativePhone || "",
          representativeRole: request.representativeRole || "",
          settlementCurrency: request.settlementCurrency || "XAF",
          expectedMonthlyVolume: request.expectedMonthlyVolume || "",
        }));
      })
      .catch(() => undefined);
  }, []);
  const saveAndSubmit = async () => {
    const channelMap: Record<string, string> = {
      mtn: "mtn_momo",
      orange: "orange_money",
      bank: "bank_settlement",
    };
    if (
      !useCase ||
      !form.organisationType ||
      !form.legalBusinessName ||
      !form.representativeName ||
      !form.representativeEmail ||
      !form.representativeRole ||
      !channels.length
    ) {
      toast.error(
        "Complete the required organisation, representative, and payment-channel details.",
      );
      return;
    }
    setSaving(true);
    try {
      await api("/api/v1/payment-activations/me", {
        method: "PUT",
        body: JSON.stringify({
          businessUse: useCase,
          ...form,
          channels: channels.map((channel) => channelMap[channel]),
        }),
      });
      const request = await api("/api/v1/payment-activations/me/submit", {
        method: "POST",
      });
      setStatus(request.status);
      toast.success("Payment activation request submitted for review.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Payment setup could not be submitted.",
      );
    } finally {
      setSaving(false);
    }
  };
  const selected = (value: string) => channels.includes(value);
  const toggleChannel = (value: string) =>
    setChannels((current) =>
      selected(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );

  const content = () => {
    if (step === 0)
      return (
        <>
          <h1>How will you use E‑NAKO MoneyFlow?</h1>
          <p className="mf-activation-copy">
            Choose the services your organisation needs. You can request more
            products later.
          </p>
          <div className="mf-choice-stack">
            {uses.map(([id, title, text]) => (
              <button
                className={`mf-choice ${useCase === id ? "is-selected" : ""}`}
                key={id}
                onClick={() => setUseCase(id)}
                type="button"
              >
                <span className="mf-check">
                  {useCase === id ? <Check className="h-3.5 w-3.5" /> : null}
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </span>
              </button>
            ))}
          </div>
        </>
      );
    if (step === 1)
      return (
        <>
          <h1>Tell us about your organisation</h1>
          <p className="mf-activation-copy">
            This information prepares your verification and payment
            configuration.
          </p>
          <div className="mf-form-grid">
            <label>
              Country
              <select
                value={form.businessCountry}
                onChange={(event) =>
                  update("businessCountry", event.target.value)
                }
              >
                <option value="CM">Cameroon</option>
                <option value="GA">Gabon</option>
                <option value="CG">Republic of the Congo</option>
                <option value="TD">Chad</option>
              </select>
            </label>
            <label>
              Organisation type
              <select
                value={form.organisationType}
                onChange={(event) =>
                  update("organisationType", event.target.value)
                }
              >
                <option value="" disabled>
                  Select one
                </option>
                <option>Registered business</option>
                <option>Individual business</option>
                <option>Nonprofit organisation</option>
                <option>Government entity</option>
              </select>
            </label>
            <label className="mf-form-full">
              Legal business name
              <input
                value={form.legalBusinessName}
                onChange={(event) =>
                  update("legalBusinessName", event.target.value)
                }
                placeholder="Your registered organisation name"
              />
            </label>
          </div>
        </>
      );
    if (step === 2)
      return (
        <>
          <h1>Account representative</h1>
          <p className="mf-activation-copy">
            Add the person authorised to act for this organisation. Verification
            is required before live payments can be activated.
          </p>
          <div className="mf-form-grid">
            <label>
              Full name
              <input
                value={form.representativeName}
                onChange={(event) =>
                  update("representativeName", event.target.value)
                }
                placeholder="Full legal name"
              />
            </label>
            <label>
              Work email
              <input
                value={form.representativeEmail}
                onChange={(event) =>
                  update("representativeEmail", event.target.value)
                }
                type="email"
                placeholder="name@organisation.cm"
              />
            </label>
            <label>
              Phone number
              <input
                value={form.representativePhone}
                onChange={(event) =>
                  update("representativePhone", event.target.value)
                }
                placeholder="+237"
              />
            </label>
            <label>
              Role
              <select
                value={form.representativeRole}
                onChange={(event) =>
                  update("representativeRole", event.target.value)
                }
              >
                <option value="" disabled>
                  Select role
                </option>
                <option>Owner or director</option>
                <option>Finance manager</option>
                <option>Operations manager</option>
              </select>
            </label>
          </div>
        </>
      );
    if (step === 3)
      return (
        <>
          <h1>Select payment channels</h1>
          <p className="mf-activation-copy">
            Choose the payment services you want to configure for your
            organisation.
          </p>
          <div className="mf-choice-stack">
            {[
              [
                "mtn",
                "MTN Mobile Money",
                "Accept and send XAF using MTN MoMo.",
              ],
              [
                "orange",
                "Orange Money",
                "Accept and send XAF using Orange Money.",
              ],
              [
                "bank",
                "Bank settlement",
                "Settle collections to a verified business bank account.",
              ],
            ].map(([id, title, text]) => (
              <button
                className={`mf-choice ${selected(id) ? "is-selected" : ""}`}
                key={id}
                onClick={() => toggleChannel(id)}
                type="button"
              >
                <span className="mf-check">
                  {selected(id) ? <Check className="h-3.5 w-3.5" /> : null}
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </span>
              </button>
            ))}
          </div>
        </>
      );
    if (step === 4)
      return (
        <>
          <h1>Settlement preferences</h1>
          <p className="mf-activation-copy">
            Tell us how you expect to receive cleared funds. You can update this
            after verification.
          </p>
          <div className="mf-form-grid">
            <label>
              Settlement currency
              <select
                value={form.settlementCurrency}
                onChange={(event) =>
                  update("settlementCurrency", event.target.value)
                }
              >
                <option>XAF</option>
              </select>
            </label>
            <label>
              Expected monthly volume
              <select
                value={form.expectedMonthlyVolume}
                onChange={(event) =>
                  update("expectedMonthlyVolume", event.target.value)
                }
              >
                <option value="" disabled>
                  Select range
                </option>
                <option>Under 1,000,000 XAF</option>
                <option>1,000,000 – 10,000,000 XAF</option>
                <option>10,000,000 – 100,000,000 XAF</option>
                <option>Over 100,000,000 XAF</option>
              </select>
            </label>
          </div>
        </>
      );
    return (
      <>
        <h1>Review your payment setup</h1>
        <p className="mf-activation-copy">
          Confirm the details above to begin verification. Nothing is activated
          until E‑NAKO reviews your organisation.
        </p>
        <div className="mf-review">
          <div>
            <span>Selected use</span>
            <strong>
              {uses.find(([id]) => id === useCase)?.[1] || "Not selected"}
            </strong>
          </div>
          <div>
            <span>Payment channels</span>
            <strong>
              {channels.length ? channels.join(", ") : "Not selected"}
            </strong>
          </div>
          <div>
            <span>Next step</span>
            <strong>Organisation verification</strong>
          </div>
        </div>
        <div className="mf-notice">
          <ShieldCheck className="h-4 w-4" />
          <p>
            {status === "submitted"
              ? "Your request is submitted and awaiting E‑NAKO review."
              : "Your submission will be reviewed before channels or API credentials are enabled."}
          </p>
        </div>
      </>
    );
  };

  return (
    <section className="mf-activation">
      <header>
        <button
          aria-label="Close payment activation"
          onClick={() => setActiveNav("dashboard")}
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span>Activate payments</span>
      </header>
      <div className="mf-activation-shell">
        <aside>
          {steps.map((label, index) => (
            <div
              className={
                index === step
                  ? "is-current"
                  : index < step
                    ? "is-complete"
                    : ""
              }
              key={label}
            >
              <span>
                {index < step ? <Check className="h-3 w-3" /> : index + 1}
              </span>
              <p>{label}</p>
            </div>
          ))}
        </aside>
        <main>
          <div className="mf-activation-content">{content()}</div>
          <footer>
            <button
              className="mf-text-button"
              disabled={step === 0}
              onClick={() => setStep((current) => current - 1)}
              type="button"
            >
              Back
            </button>
            <button
              className="mf-primary-button"
              disabled={
                (step === 0 && !useCase) || saving || status === "submitted"
              }
              onClick={() =>
                step === steps.length - 1
                  ? void saveAndSubmit()
                  : setStep((current) => current + 1)
              }
              type="button"
            >
              {step === steps.length - 1 ? (
                saving ? (
                  "Submitting…"
                ) : status === "submitted" ? (
                  "Submitted"
                ) : (
                  "Submit for review"
                )
              ) : (
                <>
                  Continue <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </footer>
        </main>
      </div>
      <p className="mf-activation-help">
        <CircleHelp className="h-4 w-4" /> Need help setting up payments?
        Contact E‑NAKO support.
      </p>
    </section>
  );
};
