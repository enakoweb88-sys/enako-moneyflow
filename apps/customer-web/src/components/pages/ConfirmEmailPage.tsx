"use client";

import React, { useState } from "react";
import { CheckCircle2, Mail, RefreshCw } from "lucide-react";
import { useCustomer } from "@/mock/CustomerContext";

export const ConfirmEmailPage: React.FC = () => {
  const { pendingConfirmationEmail, resendConfirmation, setActiveNav } =
    useCustomer();
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const resend = async () => {
    setSending(true);
    setMessage("");
    try {
      await resendConfirmation();
      setMessage(
        "A new confirmation link has been sent. Check your inbox and spam folder.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not resend the confirmation email.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <section className="w-full max-w-md border border-slate-200 bg-white p-7 text-center shadow-lg sm:p-9">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#001f5b] text-[#00c2c7]">
          <Mail className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-950">
          Confirm your email
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          We sent a confirmation link to{" "}
          <strong>{pendingConfirmationEmail || "your email address"}</strong>.
          Open it, then return here and sign in.
        </p>
        <div className="mt-6 border border-slate-200 bg-slate-50 p-4 text-left text-sm text-slate-600">
          <p className="flex items-center gap-2 font-semibold text-slate-800">
            <CheckCircle2 className="h-4 w-4 text-[#008f94]" /> What to do next
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Check your inbox and spam folder.</li>
            <li>Open the E-NAKO confirmation email.</li>
            <li>Use the link, then sign in with your password.</li>
          </ol>
        </div>
        {message ? (
          <p className="mt-4 text-sm text-slate-600">{message}</p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            className="inline-flex flex-1 items-center justify-center gap-2 border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            onClick={() => void resend()}
            disabled={sending}
            type="button"
          >
            <RefreshCw className="h-4 w-4" />{" "}
            {sending ? "Sending…" : "Resend link"}
          </button>
          <button
            className="flex-1 bg-[#001f5b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#001744]"
            onClick={() => setActiveNav("login")}
            type="button"
          >
            Go to sign in
          </button>
        </div>
      </section>
    </div>
  );
};
