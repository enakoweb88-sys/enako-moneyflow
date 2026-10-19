"use client";

import React from "react";
import { Check, ChevronRight, LockKeyhole } from "lucide-react";
import { useCustomer } from "@/mock/CustomerContext";

export const LiveActivationPage: React.FC = () => {
  const { user, setActiveNav } = useCustomer();
  const requirements = [
    {
      label: "Email confirmed",
      complete: Boolean(user.email),
      nav: "profile-verification",
    },
    {
      label: "Phone number verified",
      complete: user.phoneVerified,
      nav: "security-phone",
    },
    {
      label: "Identity verification approved",
      complete: user.kycStatus === "Verified",
      nav: "profile-verification",
    },
    {
      label: "Two-step verification enabled",
      complete: user.mfaEnabled,
      nav: "security-mfa",
    },
    {
      label: "Live account operational approval",
      complete: false,
      nav: "operational-approval",
    },
  ];
  const completed = requirements.filter((item) => item.complete).length;
  const progress = Math.round((completed / requirements.length) * 100);

  return (
    <div className="mx-auto max-w-5xl space-y-9 pb-16">
      <header className="grid gap-8 border-y border-slate-200 py-10 lg:grid-cols-[1fr_280px] lg:items-center">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#bd5d59]">
            Live account activation
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-.045em] text-[#171b29] sm:text-5xl">
            Prepare your account for real money.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
            Your Sandbox remains available while identity, security and
            operational checks are completed. Live balances and transactions
            will remain fully isolated.
          </p>
        </div>
        <div className="flex items-center gap-5 lg:justify-end">
          <div className="grid h-24 w-24 place-items-center rounded-full border-[7px] border-[#ef766f]">
            <strong className="money-number text-2xl text-[#171b29]">
              {progress}%
            </strong>
          </div>
          <div>
            <LockKeyhole className="text-[#ef766f]" />
            <p className="mt-2 text-xs font-bold text-slate-500">
              Live is locked
            </p>
          </div>
        </div>
      </header>
      <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#bd5d59]">
            Activation checklist
          </p>
          <div className="mt-5 border-t border-slate-200">
            {requirements.map((item, index) => (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.nav)}
                className="grid w-full grid-cols-[42px_1fr_auto] items-center gap-3 border-b border-slate-200 py-5 text-left"
              >
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${item.complete ? "bg-[#dceee9] text-[#28665f]" : "bg-[#f7ece6] text-[#bd5d59]"}`}
                >
                  {item.complete ? (
                    <Check size={15} />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </span>
                <span>
                  <strong className="text-sm text-[#171b29]">
                    {item.label}
                  </strong>
                  <small className="mt-1 block text-xs text-slate-500">
                    {item.complete
                      ? "Completed"
                      : "Action required before Live access"}
                  </small>
                </span>
                <ChevronRight size={16} className="text-slate-400" />
              </button>
            ))}
          </div>
        </div>
        <aside className="rounded-[28px] bg-[#171b29] p-7 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#f49a91]">
            Sandbox stays active
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-[-.035em]">
            Keep testing safely.
          </h2>
          <p className="mt-4 text-xs leading-6 text-white/55">
            Continue exploring payment flows with test funds. Nothing created in
            Sandbox will become a Live beneficiary, balance or transaction.
          </p>
          <button
            onClick={() => setActiveNav("dashboard")}
            className="mt-7 w-full rounded-xl bg-[#ef766f] px-5 py-3.5 text-xs font-bold"
          >
            Return to Sandbox
          </button>
        </aside>
      </section>
    </div>
  );
};
