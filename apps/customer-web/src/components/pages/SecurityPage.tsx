"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  KeyRound,
  Monitor,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import { useCustomer } from "@/mock/CustomerContext";
import { requestPasswordReset } from "@/lib/supabaseAuth";

export const SecurityPage: React.FC<{
  focusMfa?: boolean;
  focusRecovery?: boolean;
}> = ({ focusMfa = false, focusRecovery = false }) => {
  const {
    user,
    sessions,
    beginMfaEnrollment,
    verifyMfaEnrollment,
    beginPhoneVerification,
    verifyPhoneVerification,
    terminateSession,
    terminateAllOtherSessions,
  } = useCustomer();
  const mfaRef = useRef<HTMLElement>(null);
  const [openSection, setOpenSection] = useState<
    "password" | "mfa" | "recovery" | null
  >(focusMfa ? "mfa" : focusRecovery ? "recovery" : null);
  useEffect(() => {
    if (focusMfa)
      window.setTimeout(
        () =>
          mfaRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        100,
      );
  }, [focusMfa]);
  const score = Math.max(
    35,
    35 +
      (user.phone ? 20 : 0) +
      (user.kycStatus === "Verified" ? 20 : 0) +
      (user.mfaEnabled ? 25 : 0),
  );
  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-16">
      <section className="grid gap-8 border-y border-slate-200 py-9 md:grid-cols-[1fr_220px] md:items-center">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#bd5d59]">
            Security centre
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-.045em] text-[#171b29] sm:text-5xl">
            Protect every move.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Manage access, recovery methods and the devices connected to your
            MoneyFlow account.
          </p>
        </div>
        <div className="flex items-center gap-4 md:justify-end">
          <div className="grid h-24 w-24 place-items-center rounded-full border-[7px] border-[#ef766f] bg-white shadow-[0_10px_30px_rgba(23,27,41,.08)]">
            <strong className="money-number text-2xl text-[#171b29]">
              {score}%
            </strong>
          </div>
          <span className="max-w-20 text-xs font-bold leading-5 text-slate-500">
            Protection score
          </span>
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        <SecurityItem
          icon={<KeyRound />}
          title="Password"
          copy="Use a unique password you do not use elsewhere."
          action="Request secure reset"
          open={openSection === "password"}
          onClick={() =>
            setOpenSection(openSection === "password" ? null : "password")
          }
        />
        <SecurityItem
          icon={<Smartphone />}
          title="Two-step verification"
          copy={
            user.mfaEnabled
              ? "A second factor protects sensitive actions."
              : "Add a second factor before moving funds."
          }
          action={user.mfaEnabled ? "MFA enabled" : "Enable MFA"}
          open={openSection === "mfa"}
          onClick={() => setOpenSection(openSection === "mfa" ? null : "mfa")}
        />
        <SecurityItem
          icon={<ShieldCheck />}
          title="Recovery details"
          copy={
            user.phone
              ? `Recovery phone: ${user.phone}`
              : "Add a phone number to improve account recovery."
          }
          action="Review profile"
          open={openSection === "recovery"}
          onClick={() =>
            setOpenSection(openSection === "recovery" ? null : "recovery")
          }
        />
      </section>
      {openSection === "password" && <PasswordSetup email={user.email} />}
      <section
        ref={mfaRef}
        className={openSection === "mfa" ? "block scroll-mt-6" : "hidden"}
      >
        <TotpSetup
          enabled={user.mfaEnabled}
          begin={beginMfaEnrollment}
          verify={verifyMfaEnrollment}
          onClose={() => setOpenSection(null)}
        />
      </section>
      {openSection === "recovery" && (
        <PhoneVerification
          phone={user.phone}
          verified={user.phoneVerified}
          begin={beginPhoneVerification}
          verify={verifyPhoneVerification}
        />
      )}
      <section className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
        <div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#bd5d59]">
                Device access
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-[-.035em] text-[#171b29]">
                Active sessions
              </h2>
            </div>
            {sessions.some((s) => !s.isCurrent) && (
              <button
                onClick={terminateAllOtherSessions}
                className="text-xs font-bold text-[#bd5d59]"
              >
                Log out other devices
              </button>
            )}
          </div>
          {sessions.length ? (
            <div className="mt-5 border-t border-slate-200">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-4 border-b border-slate-200 py-5"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[#f7f4f1] text-[#bd5d59]">
                    <Monitor size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <strong className="text-sm text-[#171b29]">
                      {session.device}
                    </strong>
                    <p className="mt-1 text-xs text-slate-500">
                      {session.location} · {session.lastActive}
                    </p>
                  </div>
                  {session.isCurrent ? (
                    <span className="text-[11px] font-bold text-[#39756d]">
                      This device
                    </span>
                  ) : (
                    <button
                      onClick={() => terminateSession(session.id)}
                      className="text-xs font-bold text-red-600"
                    >
                      Log out
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 border-y border-slate-200 py-10">
              <p className="font-bold text-[#171b29]">
                No session records available.
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Authenticated device activity will appear here when session
                management is connected.
              </p>
            </div>
          )}
        </div>
        <aside className="rounded-[28px] bg-[#f7f4f1] p-7">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#bd5d59]">
            Recommended next
          </p>
          <h3 className="mt-3 text-2xl font-bold tracking-[-.035em] text-[#171b29]">
            Keep recovery routes current.
          </h3>
          <div className="mt-6 space-y-4 text-xs leading-5 text-slate-600">
            <p>
              <strong className="block text-[#171b29]">Email</strong>
              {user.email || "Not provided"}
            </p>
            <p>
              <strong className="block text-[#171b29]">Phone</strong>
              {user.phone || "Not provided"}
            </p>
            <p>
              <strong className="block text-[#171b29]">Identity</strong>
              {user.kycStatus}
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
};

function SecurityItem({
  icon,
  title,
  copy,
  action,
  onClick,
  open,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
  action: string;
  onClick: () => void;
  open: boolean;
}) {
  return (
    <article className="border-t border-slate-200 py-6">
      <span className="text-[#ef766f]">{icon}</span>
      <h2 className="mt-5 text-lg font-bold text-[#171b29]">{title}</h2>
      <p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">{copy}</p>
      <button
        onClick={onClick}
        className="mt-5 flex items-center gap-1 text-xs font-bold text-[#171b29]"
      >
        {action}
        <ChevronDown
          size={14}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>
    </article>
  );
}

function PasswordSetup({ email }: { email: string }) {
  const [busy, setBusy] = useState(false);
  const send = async () => {
    if (!email) return toast.error("Add an email address first.");
    setBusy(true);
    try {
      await requestPasswordReset(email);
      toast.success("Password reset instructions were sent to your email.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "We could not send the reset email.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="rounded-[28px] bg-[#f7f4f1] p-7 sm:p-9">
      <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#bd5d59]">
        Password security
      </p>
      <h2 className="mt-3 text-2xl font-bold text-[#171b29]">
        Change your password securely.
      </h2>
      <p className="mt-3 max-w-2xl text-xs leading-6 text-slate-500">
        We will send a protected reset link to{" "}
        <strong>{email || "your confirmed email"}</strong>. MoneyFlow will never
        ask you to send your current password to support.
      </p>
      <button
        onClick={() => void send()}
        disabled={busy}
        className="mt-6 rounded-xl bg-[#171b29] px-6 py-3.5 text-xs font-bold text-white disabled:opacity-50"
      >
        {busy ? "Sending…" : "Send password reset link"}
      </button>
    </section>
  );
}

function PhoneVerification({
  phone,
  verified,
  begin,
  verify,
}: {
  phone: string;
  verified: boolean;
  begin: (phone: string) => Promise<void>;
  verify: (phone: string, code: string) => Promise<void>;
}) {
  const [number, setNumber] = useState(phone);
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const send = async () => {
    if (!/^\+[1-9]\d{7,14}$/.test(number.replace(/\s/g, "")))
      return toast.error(
        "Enter the phone in international format, for example +237…",
      );
    setBusy(true);
    try {
      await begin(number.replace(/\s/g, ""));
      setSent(true);
      toast.success("A six-digit verification code was sent by SMS.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "We could not send the SMS code.",
      );
    } finally {
      setBusy(false);
    }
  };
  const confirm = async () => {
    if (!/^\d{6}$/.test(code))
      return toast.error("Enter the six-digit SMS code.");
    setBusy(true);
    try {
      await verify(number.replace(/\s/g, ""), code);
      toast.success("Phone number verified.");
      setSent(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "The phone code could not be verified.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="grid overflow-hidden rounded-[28px] border border-slate-200 bg-white lg:grid-cols-[260px_1fr]">
      <aside className="bg-[#f7f4f1] p-7">
        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#bd5d59]">
          Recovery and verification
        </p>
        <h2 className="mt-4 text-2xl font-bold text-[#171b29]">
          Verify your phone.
        </h2>
        <p className="mt-3 text-xs leading-6 text-slate-500">
          A verified number helps secure recovery and can be required before
          Live activation.
        </p>
        <span
          className={`mt-6 inline-block rounded-full px-3 py-2 text-xs font-bold ${verified ? "bg-[#dceee9] text-[#28665f]" : "bg-white text-[#bd5d59]"}`}
        >
          {verified ? "Verified" : "Not verified"}
        </span>
      </aside>
      <div className="p-7 sm:p-9">
        <label className="block text-xs font-bold text-slate-600">
          Phone number
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="+237 6XX XXX XXX"
            className="verify-input"
          />
        </label>
        {!sent ? (
          <button
            onClick={() => void send()}
            disabled={busy || verified}
            className="mt-5 rounded-xl bg-[#ef766f] px-6 py-3.5 text-xs font-bold text-white disabled:opacity-40"
          >
            {verified
              ? "Phone verified"
              : busy
                ? "Sending…"
                : "Send verification code"}
          </button>
        ) : (
          <div className="mt-5">
            <label className="block text-xs font-bold text-slate-600">
              Six-digit SMS code
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                inputMode="numeric"
                className="verify-input money-number text-xl tracking-[.3em]"
              />
            </label>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => void confirm()}
                disabled={busy}
                className="rounded-xl bg-[#171b29] px-6 py-3 text-xs font-bold text-white"
              >
                {busy ? "Verifying…" : "Verify phone"}
              </button>
              <button
                onClick={() => void send()}
                className="text-xs font-bold text-[#bd5d59]"
              >
                Resend code
              </button>
            </div>
          </div>
        )}
        <p className="mt-5 text-[11px] leading-5 text-slate-400">
          SMS delivery requires a phone provider configured in Supabase Auth.
          Standard provider rates may apply.
        </p>
      </div>
    </section>
  );
}

function TotpSetup({
  enabled,
  begin,
  verify,
  onClose,
}: {
  enabled: boolean;
  begin: () => Promise<{ factorId: string; qrCode: string; secret: string }>;
  verify: (factorId: string, code: string) => Promise<void>;
  onClose: () => void;
}) {
  const [stage, setStage] = useState<"intro" | "scan" | "done">(
    enabled ? "done" : "intro",
  );
  const [factor, setFactor] = useState<{
    factorId: string;
    qrCode: string;
    secret: string;
  } | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const start = async () => {
    setBusy(true);
    try {
      setFactor(await begin());
      setStage("scan");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not begin authenticator setup.",
      );
    } finally {
      setBusy(false);
    }
  };
  const confirm = async () => {
    if (!factor || !/^\d{6}$/.test(code))
      return toast.error(
        "Enter the six-digit code from your authenticator app.",
      );
    setBusy(true);
    try {
      await verify(factor.factorId, code);
      setStage("done");
      toast.success("Authenticator app enabled.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "The code could not be verified.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="grid overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(23,27,41,.06)] lg:grid-cols-[260px_1fr]">
      <aside className="bg-[#171b29] p-7 text-white">
        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#f49a91]">
          Authenticator app
        </p>
        <h2 className="mt-4 text-2xl font-bold">
          Secure sign-in with a rotating code.
        </h2>
        <p className="mt-4 text-xs leading-6 text-white/55">
          Works with Google Authenticator, Microsoft Authenticator, Authy and
          other TOTP-compatible apps.
        </p>
        <div className="mt-7 space-y-3 text-xs">
          <p className={stage !== "intro" ? "text-[#8fd1c6]" : "text-white"}>
            01 · Install an app
          </p>
          <p
            className={
              stage === "scan" || stage === "done"
                ? "text-[#8fd1c6]"
                : "text-white/45"
            }
          >
            02 · Scan and enter code
          </p>
          <p className={stage === "done" ? "text-[#8fd1c6]" : "text-white/45"}>
            03 · Enabled
          </p>
        </div>
      </aside>
      <div className="p-7 sm:p-9">
        {stage === "intro" && (
          <div>
            <h3 className="text-2xl font-bold text-[#171b29]">
              Set up two-step verification
            </h3>
            <p className="mt-3 max-w-xl text-xs leading-6 text-slate-500">
              Download an authenticator app on your phone. We will create a
              private QR code linked to this account. Never share the QR code or
              setup key.
            </p>
            <button
              onClick={() => void start()}
              disabled={busy}
              className="mt-7 rounded-xl bg-[#ef766f] px-6 py-3.5 text-xs font-bold text-white disabled:opacity-50"
            >
              {busy ? "Preparing…" : "Create secure QR code"}
            </button>
          </div>
        )}
        {stage === "scan" && factor && (
          <div>
            <h3 className="text-2xl font-bold text-[#171b29]">
              Scan the QR code
            </h3>
            <p className="mt-2 text-xs text-slate-500">
              In Google Authenticator, tap +, choose “Scan a QR code,” then
              enter the six-digit code shown.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-[180px_1fr]">
              <img
                src={factor.qrCode}
                alt="Authenticator enrollment QR code"
                className="h-44 w-44 rounded-xl border border-slate-200 bg-white p-2"
              />
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">
                  Cannot scan?
                </p>
                <code className="mt-2 block break-all rounded-xl bg-slate-50 p-3 text-xs text-[#171b29]">
                  {factor.secret}
                </code>
                <label className="mt-5 block text-xs font-bold text-slate-600">
                  Six-digit code
                  <input
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    className="verify-input money-number text-xl tracking-[.3em]"
                  />
                </label>
                <button
                  onClick={() => void confirm()}
                  disabled={busy}
                  className="mt-4 rounded-xl bg-[#171b29] px-6 py-3 text-xs font-bold text-white disabled:opacity-50"
                >
                  {busy ? "Verifying…" : "Verify and enable"}
                </button>
              </div>
            </div>
          </div>
        )}
        {stage === "done" && (
          <div>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#dceee9] text-[#28665f]">
              <ShieldCheck />
            </span>
            <h3 className="mt-5 text-2xl font-bold text-[#171b29]">
              Authenticator protection is enabled.
            </h3>
            <p className="mt-3 text-xs leading-6 text-slate-500">
              MoneyFlow can now require a time-based code for sensitive access
              and Live-account actions.
            </p>
            <button
              onClick={onClose}
              className="mt-6 text-xs font-bold text-[#bd5d59]"
            >
              Close setup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
