"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  LifeBuoy,
  MessageCircle,
  Paperclip,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useCustomer } from "@/mock/CustomerContext";

const guides = [
  [
    "Funding and settlement",
    "Understand deposits, processing and wallet availability.",
  ],
  [
    "Sending and withdrawing",
    "Review beneficiaries, delivery windows and transaction status.",
  ],
  [
    "Identity and account access",
    "Get help with verification, security and recovery.",
  ],
];
const faqs = [
  [
    "When will a deposit appear?",
    "A deposit appears after the payment route confirms settlement. Its status will be visible in Wallet & statements.",
  ],
  [
    "Why is a beneficiary unavailable?",
    "A beneficiary may require verification or a security review before it can receive funds.",
  ],
  [
    "Which identity documents can I use?",
    "The verification flow will show the documents accepted for your country and account level.",
  ],
];

export const SupportPage: React.FC = () => {
  const { setActiveNav } = useCustomer();
  const [open, setOpen] = useState(0);
  const [category, setCategory] = useState("Account and profile");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!subject.trim() || !message.trim())
      return toast.error("Add a subject and a short description.");
    toast.info(
      "Support submission will be available when the live support service is connected.",
    );
  };
  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-16">
      <section className="grid overflow-hidden border-y border-slate-200 lg:grid-cols-[1fr_280px]">
        <div className="py-9 pr-6 sm:py-12">
          <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#bd5d59]">
            MoneyFlow support
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-.045em] text-[#171b29] sm:text-5xl">
            Answers without the runaround.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
            Find the right path, describe what happened and keep sensitive
            financial details inside the secure account.
          </p>
        </div>
        <div className="flex items-end bg-[#ef766f] p-7 text-white">
          <div>
            <MessageCircle size={28} />
            <p className="mt-8 text-xs font-bold uppercase tracking-[.14em] text-white/70">
              Support workspace
            </p>
            <p className="mt-2 text-lg font-bold">
              Guidance, requests and account safety in one place.
            </p>
          </div>
        </div>
      </section>
      <section className="grid gap-5 sm:grid-cols-3">
        {guides.map(([title, copy], index) => (
          <article key={title} className="border-t border-slate-200 py-6">
            <span className="money-number text-xs font-bold text-[#ef766f]">
              0{index + 1}
            </span>
            <h2 className="mt-5 text-lg font-bold text-[#171b29]">{title}</h2>
            <p className="mt-2 text-xs leading-5 text-slate-500">{copy}</p>
            <button
              onClick={() =>
                index === 0
                  ? setActiveNav("wallet")
                  : index === 1
                    ? setActiveNav("send-withdraw")
                    : setActiveNav("profile-kyc")
              }
              className="mt-5 flex items-center gap-1 text-xs font-bold text-[#171b29]"
            >
              Open related area <ChevronRight size={14} />
            </button>
          </article>
        ))}
      </section>
      <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <form
          onSubmit={submit}
          className="rounded-[28px] bg-[#f7f4f1] p-7 sm:p-8"
        >
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#bd5d59]">
            Contact support
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-[-.035em] text-[#171b29]">
            Tell us what you need.
          </h2>
          <div className="mt-7 space-y-4">
            <label className="block text-xs font-bold text-slate-600">
              Category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none"
              >
                <option>Account and profile</option>
                <option>Deposit or withdrawal</option>
                <option>Verification</option>
                <option>Security concern</option>
                <option>Technical issue</option>
              </select>
            </label>
            <label className="block text-xs font-bold text-slate-600">
              Subject
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="A short summary"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none focus:border-[#ef766f]"
              />
            </label>
            <label className="block text-xs font-bold text-slate-600">
              What happened?
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Include useful dates or references. Never share your password or verification code."
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none focus:border-[#ef766f]"
              />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() =>
                  toast.info(
                    "Attachments will be enabled with the live support service.",
                  )
                }
                className="flex items-center gap-2 text-xs font-bold text-slate-500"
              >
                <Paperclip size={15} />
                Attach evidence
              </button>
              <button className="rounded-xl bg-[#ef766f] px-6 py-3.5 text-xs font-bold text-white">
                Prepare support request
              </button>
            </div>
          </div>
        </form>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#bd5d59]">
            Quick answers
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-[-.035em] text-[#171b29]">
            Before you contact us.
          </h2>
          <div className="mt-6 border-t border-slate-200">
            {faqs.map(([question, answer], index) => (
              <div key={question} className="border-b border-slate-200">
                <button
                  onClick={() => setOpen(open === index ? -1 : index)}
                  className="flex w-full items-center justify-between py-5 text-left text-sm font-bold text-[#171b29]"
                >
                  {question}
                  <ChevronDown
                    size={17}
                    className={`transition ${open === index ? "rotate-180" : ""}`}
                  />
                </button>
                {open === index && (
                  <p className="pb-5 pr-8 text-xs leading-6 text-slate-500">
                    {answer}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => setActiveNav("disputes")}
              className="flex items-center gap-3 rounded-2xl bg-[#171b29] p-5 text-left text-white"
            >
              <ShieldAlert className="text-[#ef766f]" />
              <span>
                <strong className="block text-sm">Report a transaction</strong>
                <small className="text-white/45">Open disputes</small>
              </span>
            </button>
            <div className="flex items-center gap-3 rounded-2xl bg-[#edf7f5] p-5">
              <MessageCircle className="text-[#39756d]" />
              <span>
                <strong className="block text-sm text-[#171b29]">
                  Case history
                </strong>
                <small className="text-slate-500">No connected cases yet</small>
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-4 border-y border-slate-200 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <LifeBuoy className="text-[#ef766f]" />
          <div>
            <strong className="text-sm text-[#171b29]">
              Urgent account security concern?
            </strong>
            <p className="mt-1 text-xs text-slate-500">
              Secure your account first, then prepare a support request.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveNav("security")}
          className="text-xs font-bold text-[#bd5d59]"
        >
          Open security centre
        </button>
      </section>
    </div>
  );
};
