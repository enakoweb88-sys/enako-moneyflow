"use client";

import React, { useEffect, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useCustomer } from "@/mock/CustomerContext";

type Application = {
  purpose: string;
  source: string;
  monthlyVolume: string;
  largestTransaction: string;
  useCase: string;
  countries: string;
  providers: string[];
  declaration: boolean;
};
const emptyApplication: Application = {
  purpose: "",
  source: "",
  monthlyVolume: "",
  largestTransaction: "",
  useCase: "",
  countries: "Cameroon",
  providers: [],
  declaration: false,
};

export const OperationalApprovalPage: React.FC = () => {
  const { user, setActiveNav } = useCustomer();
  const [step, setStep] = useState(0);
  const [application, setApplication] = useState<Application>(emptyApplication);
  const prerequisites = Boolean(
    user.email &&
    user.phoneVerified &&
    user.kycStatus === "Verified" &&
    user.mfaEnabled,
  );
  useEffect(() => {
    try {
      const saved = JSON.parse(
        window.localStorage.getItem("moneyflow-live-application") || "null",
      ) as { step?: number; application?: Application } | null;
      if (saved) {
        // Restore the user's persisted wizard position on the first client render.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStep(saved.step || 0);
        setApplication({ ...emptyApplication, ...saved.application });
      }
    } catch {}
  }, []);
  useEffect(() => {
    window.localStorage.setItem(
      "moneyflow-live-application",
      JSON.stringify({ step, application }),
    );
  }, [step, application]);
  const update = <K extends keyof Application>(key: K, value: Application[K]) =>
    setApplication((current) => ({ ...current, [key]: value }));
  const valid = [
    prerequisites,
    Boolean(
      application.purpose && application.source && application.useCase.trim(),
    ),
    Boolean(
      application.monthlyVolume &&
      application.largestTransaction &&
      application.countries.trim() &&
      application.providers.length,
    ),
    application.declaration,
  ][step];
  const next = () =>
    valid
      ? setStep((current) => Math.min(3, current + 1))
      : toast.error(
          step === 0
            ? "Complete identity, phone and authenticator security first."
            : "Complete every required field before continuing.",
        );
  const submit = () =>
    toast.info(
      "Operational submission will be enabled when the compliance workflow API is connected.",
    );
  const labels = [
    "Account readiness",
    "Intended use",
    "Expected activity",
    "Review and declare",
  ];
  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-16">
      <header className="border-y border-slate-200 py-10">
        <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#bd5d59]">
          Final Live review
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-[-.045em] text-[#171b29] sm:text-5xl">
          Tell us how you plan to use MoneyFlow.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500">
          You provide your intended use and expected activity. MoneyFlow then
          performs the risk review and assigns appropriate transaction limits
          and payment routes.
        </p>
      </header>
      <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
        <aside>
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#bd5d59]">
            Your application
          </p>
          <div className="mt-4 space-y-1">
            {labels.map((label, index) => (
              <button
                key={label}
                onClick={() => index <= step && setStep(index)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-bold ${step === index ? "bg-[#f7ece6] text-[#8f4546]" : index < step ? "text-[#39756d]" : "text-slate-400"}`}
              >
                <span
                  className={`grid h-7 w-7 place-items-center rounded-full ${index < step ? "bg-[#dceee9]" : "bg-white"}`}
                >
                  {index < step ? <Check size={13} /> : index + 1}
                </span>
                {label}
              </button>
            ))}
          </div>
          <div className="mt-7 border-t border-slate-200 pt-5 text-[11px] leading-5 text-slate-500">
            <strong className="text-[#171b29]">After submission</strong>
            <p className="mt-2">
              Risk review and limit assignment are MoneyFlow actions. You will
              see their status here; you do not approve those yourself.
            </p>
          </div>
        </aside>
        <section className="min-h-[520px] rounded-[28px] bg-[#f7f4f1] p-6 sm:p-9">
          {step === 0 && (
            <div>
              <Step
                number="01"
                title="Complete your identity and security"
                copy="These checks establish who owns the account and protect access before real funds are enabled."
              />
              <div className="mt-7 divide-y divide-slate-200 border-y border-slate-200">
                <Requirement
                  label="Identity verification"
                  complete={user.kycStatus === "Verified"}
                  action={() => setActiveNav("profile-verification")}
                />
                <Requirement
                  label="Verified phone number"
                  complete={user.phoneVerified}
                  action={() => setActiveNav("security-phone")}
                />
                <Requirement
                  label="Authenticator 2FA"
                  complete={user.mfaEnabled}
                  action={() => setActiveNav("security-mfa")}
                />
              </div>
            </div>
          )}
          {step === 1 && (
            <div>
              <Step
                number="02"
                title="Describe your intended account use"
                copy="This helps us understand why you need the account and whether the requested services fit that purpose."
              />
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <Field label="Account use">
                  <select
                    value={application.purpose}
                    onChange={(e) => update("purpose", e.target.value)}
                    className="verify-input"
                  >
                    <option value="">Select the closest match</option>
                    <option>Personal transfers</option>
                    <option>Freelance or salary receipts</option>
                    <option>Business collections</option>
                    <option>Supplier and staff payments</option>
                    <option>Marketplace or platform payouts</option>
                  </select>
                </Field>
                <Field label="Primary source of funds">
                  <select
                    value={application.source}
                    onChange={(e) => update("source", e.target.value)}
                    className="verify-input"
                  >
                    <option value="">Choose a source</option>
                    <option>Salary or professional income</option>
                    <option>Business revenue</option>
                    <option>Savings</option>
                    <option>Investment income</option>
                    <option>Family support or remittances</option>
                  </select>
                </Field>
              </div>
              <Field label="Describe what you expect to do">
                <textarea
                  rows={5}
                  value={application.useCase}
                  onChange={(e) => update("useCase", e.target.value)}
                  placeholder="For example: receive monthly consulting payments from clients in France, convert to XAF and withdraw to my verified mobile-money account."
                  className="verify-input resize-none"
                />
              </Field>
              <p className="mt-3 text-[11px] text-slate-500">
                Include who normally sends the funds, who receives them and the
                business or personal reason.
              </p>
            </div>
          )}
          {step === 2 && (
            <div>
              <Step
                number="03"
                title="Estimate your expected activity"
                copy="Estimates are acceptable. They help MoneyFlow propose an initial limit and confirm which payment routes you need."
              />
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <Field label="Expected monthly activity">
                  <select
                    value={application.monthlyVolume}
                    onChange={(e) => update("monthlyVolume", e.target.value)}
                    className="verify-input"
                  >
                    <option value="">Choose a range</option>
                    <option>Below 500,000 XAF</option>
                    <option>500,000–2,000,000 XAF</option>
                    <option>2,000,001–10,000,000 XAF</option>
                    <option>Above 10,000,000 XAF</option>
                  </select>
                </Field>
                <Field label="Largest expected transaction">
                  <select
                    value={application.largestTransaction}
                    onChange={(e) =>
                      update("largestTransaction", e.target.value)
                    }
                    className="verify-input"
                  >
                    <option value="">Choose a range</option>
                    <option>Below 100,000 XAF</option>
                    <option>100,000–500,000 XAF</option>
                    <option>500,001–2,000,000 XAF</option>
                    <option>Above 2,000,000 XAF</option>
                  </select>
                </Field>
              </div>
              <Field label="Countries connected to your payments">
                <input
                  value={application.countries}
                  onChange={(e) => update("countries", e.target.value)}
                  placeholder="For example: Cameroon, France and Belgium"
                  className="verify-input"
                />
              </Field>
              <div className="mt-5">
                <p className="text-xs font-bold text-slate-600">
                  Payment routes you need
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    "MTN Mobile Money",
                    "Orange Money",
                    "Bank transfer",
                    "International funding",
                  ].map((provider) => (
                    <button
                      key={provider}
                      onClick={() =>
                        update(
                          "providers",
                          application.providers.includes(provider)
                            ? application.providers.filter(
                                (item) => item !== provider,
                              )
                            : [...application.providers, provider],
                        )
                      }
                      className={`rounded-full border px-4 py-2.5 text-xs font-bold ${application.providers.includes(provider) ? "border-[#ef766f] bg-[#f7ece6] text-[#8f4546]" : "border-slate-200 bg-white text-slate-500"}`}
                    >
                      {provider}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <Step
                number="04"
                title="Review and request approval"
                copy="After submission, MoneyFlow performs the remaining risk, compliance, provider and limit checks."
              />
              <div className="mt-7 divide-y divide-slate-200 border-y border-slate-200">
                <Summary label="Account use" value={application.purpose} />
                <Summary label="Source of funds" value={application.source} />
                <Summary
                  label="Monthly activity"
                  value={application.monthlyVolume}
                />
                <Summary
                  label="Largest transaction"
                  value={application.largestTransaction}
                />
                <Summary label="Countries" value={application.countries} />
                <Summary
                  label="Requested routes"
                  value={application.providers.join(", ")}
                />
              </div>
              <label className="mt-6 flex items-start gap-3 text-xs leading-5 text-slate-600">
                <input
                  type="checkbox"
                  checked={application.declaration}
                  onChange={(e) => update("declaration", e.target.checked)}
                  className="mt-1 accent-[#ef766f]"
                />
                <span>
                  I confirm that this intended use and expected activity are
                  accurate. I understand MoneyFlow may request supporting
                  information and will assign limits after review.
                </span>
              </label>
              <button
                onClick={submit}
                disabled={!application.declaration}
                className="mt-6 rounded-xl bg-[#ef766f] px-6 py-3.5 text-xs font-bold text-white disabled:opacity-40"
              >
                Submit Live-account application
              </button>
            </div>
          )}
          <div className="mt-9 flex items-center justify-between border-t border-slate-200 pt-5">
            <button
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              disabled={step === 0}
              className="text-xs font-bold text-slate-500 disabled:opacity-30"
            >
              Back
            </button>
            {step < 3 && (
              <button
                onClick={next}
                className="rounded-xl bg-[#171b29] px-6 py-3 text-xs font-bold text-white"
              >
                Next <ChevronRight size={14} className="ml-1 inline" />
              </button>
            )}
          </div>
        </section>
      </div>
      <section className="grid gap-5 border-t border-slate-200 pt-7 sm:grid-cols-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#bd5d59]">
            MoneyFlow action
          </p>
          <h2 className="mt-2 text-lg font-bold text-[#171b29]">
            Risk and compliance review
          </h2>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Our review checks identity, activity expectations and any required
            supporting information. The customer only responds if additional
            information is requested.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#bd5d59]">
            MoneyFlow action
          </p>
          <h2 className="mt-2 text-lg font-bold text-[#171b29]">
            Limits and provider readiness
          </h2>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            After approval, we assign initial transaction limits and enable the
            payment routes available for the customer’s country and account
            profile.
          </p>
        </div>
      </section>
    </div>
  );
};

function Step({
  number,
  title,
  copy,
}: {
  number: string;
  title: string;
  copy: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#bd5d59]">
        {number}
      </p>
      <h2 className="mt-3 text-2xl font-bold tracking-[-.035em] text-[#171b29]">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-xs leading-6 text-slate-500">{copy}</p>
    </div>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mt-4 block text-xs font-bold text-slate-600">
      {label}
      {children}
    </label>
  );
}
function Requirement({
  label,
  complete,
  action,
}: {
  label: string;
  complete: boolean;
  action: () => void;
}) {
  return (
    <button
      onClick={action}
      className="flex w-full items-center justify-between py-5 text-left"
    >
      <span className="text-sm font-bold text-[#171b29]">{label}</span>
      <span
        className={`text-xs font-bold ${complete ? "text-[#39756d]" : "text-[#bd5d59]"}`}
      >
        {complete ? "Completed" : "Complete now"}
      </span>
    </button>
  );
}
function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between">
      <span className="text-xs text-slate-500">{label}</span>
      <strong className="text-sm text-[#171b29]">
        {value || "Not provided"}
      </strong>
    </div>
  );
}
