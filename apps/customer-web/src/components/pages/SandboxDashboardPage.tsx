"use client";

import React from "react";
import {
  Activity,
  ArrowRight,
  Braces,
  FlaskConical,
  Radio,
  ShieldCheck,
} from "lucide-react";
import { useCustomer } from "@/mock/CustomerContext";

const steps = [
  {
    number: "01",
    title: "Create test data",
    copy: "Reset a test wallet and use the seeded MTN or Orange beneficiary.",
  },
  {
    number: "02",
    title: "Call the same API shape",
    copy: "Authenticate, submit a payment request and store the returned reference.",
  },
  {
    number: "03",
    title: "Force an outcome",
    copy: "Reproduce completed, pending or failed provider responses whenever you need them.",
  },
  {
    number: "04",
    title: "Inspect the event",
    copy: "Validate balances, activity records and—next—your webhook handling.",
  },
];

export function SandboxDashboardPage() {
  const { setActiveNav, user } = useCustomer();
  return (
    <div className="space-y-6 pb-10">
      <section className="relative overflow-hidden rounded-[30px] bg-[#07162f] px-6 py-8 text-white shadow-[0_26px_70px_rgba(7,22,47,.2)] sm:px-9 sm:py-10 lg:px-12">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative grid items-end gap-9 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-cyan-200">
                Sandbox workspace
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />{" "}
                Isolated from Live
              </span>
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-[-.045em] sm:text-5xl">
              Build it. Break it. Repeat it safely.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              Welcome {user.name?.split(" ")[0] || "back"}. This workspace
              exercises MoneyFlow’s payment behaviour using simulated XAF.
              Nothing here can settle to a real mobile-money or bank account.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveNav("sandbox-lab")}
                className="inline-flex items-center gap-2 rounded-xl bg-[#ff8d80] px-5 py-3 text-sm font-bold text-[#281313] transition hover:-translate-y-0.5 hover:bg-[#ffa197]"
              >
                Open Sandbox lab <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveNav("developers")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
              >
                <Braces className="h-4 w-4" /> View API workspace
              </button>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[.06] p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                Environment
              </span>
              <FlaskConical className="h-4 w-4 text-cyan-300" />
            </div>
            <code className="mt-5 block rounded-2xl bg-black/25 p-4 text-xs leading-6 text-cyan-100">
              POST /api/v1/sandbox/simulate
              <br />
              <span className="text-slate-500">{"{"}</span> scenario:{" "}
              <span className="text-[#ffaca3]">
                &quot;WITHDRAWAL_PENDING&quot;
              </span>{" "}
              <span className="text-slate-500">{"}"}</span>
            </code>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-300" /> Separate
              wallet, ledger and beneficiaries
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: Radio,
            label: "Predictable outcomes",
            value: "4",
            copy: "Deposit, success, pending and failed",
          },
          {
            icon: Activity,
            label: "Test events",
            value: "Persistent",
            copy: "Still available after a browser refresh",
          },
          {
            icon: ShieldCheck,
            label: "Live exposure",
            value: "None",
            copy: "Database-enforced environment boundary",
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <item.icon className="h-5 w-5 text-[#c75b60]" />
            <p className="mt-5 text-xs font-semibold text-slate-500">
              {item.label}
            </p>
            <strong className="mt-1 block text-2xl tracking-tight text-slate-950">
              {item.value}
            </strong>
            <span className="mt-1 block text-xs leading-5 text-slate-500">
              {item.copy}
            </span>
          </article>
        ))}
      </section>

      <section className="rounded-[28px] border border-[#eadbd0] bg-[#fbf6f0] p-6 sm:p-8">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-[#ad565a]">
            A real integration rehearsal
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">
            How a Sandbox test should move
          </h2>
        </div>
        <div className="mt-7 grid gap-3 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-[#eadbd0] bg-white/80 p-5"
            >
              <span className="text-xs font-extrabold text-[#d76164]">
                {step.number}
              </span>
              <strong className="mt-5 block text-sm text-slate-900">
                {step.title}
              </strong>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                {step.copy}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
