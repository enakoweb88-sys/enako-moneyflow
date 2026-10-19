"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { updatePassword } from "@/lib/supabaseAuth";
import { useCustomer } from "@/mock/CustomerContext";

export const ResetPasswordPage: React.FC = () => {
  const { setActiveNav } = useCustomer();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 10) return toast.error("Use at least 10 characters.");
    if (password !== confirm) return toast.error("The passwords do not match.");
    setBusy(true);
    try {
      await updatePassword(password);
      setDone(true);
      toast.success("Password updated securely.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "We could not update your password.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-4xl place-items-center py-10">
      <section className="grid w-full overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(23,27,41,.1)] md:grid-cols-[.8fr_1.2fr]">
        <aside className="bg-[#171b29] p-8 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#f49a91]">
            Secure recovery
          </p>
          <h1 className="mt-5 text-3xl font-bold tracking-[-.04em]">
            Create a new password.
          </h1>
          <p className="mt-4 text-xs leading-6 text-white/55">
            Use a password that is unique to MoneyFlow. Never reuse an email,
            banking or social-media password.
          </p>
          <div className="mt-8 space-y-3 text-xs text-white/70">
            <p>At least 10 characters</p>
            <p>Uppercase and lowercase letters</p>
            <p>A number and a symbol</p>
          </div>
        </aside>
        <div className="p-8 sm:p-10">
          {done ? (
            <div>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#dceee9] text-[#28665f]">
                <Check />
              </span>
              <h2 className="mt-5 text-2xl font-bold text-[#171b29]">
                Password changed.
              </h2>
              <p className="mt-3 text-xs text-slate-500">
                Your new password is active. You can return to the security
                centre.
              </p>
              <button
                onClick={() => setActiveNav("security")}
                className="mt-6 rounded-xl bg-[#171b29] px-6 py-3 text-xs font-bold text-white"
              >
                Continue to security
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h2 className="text-2xl font-bold text-[#171b29]">
                Choose your password
              </h2>
              <label className="mt-7 block text-xs font-bold text-slate-600">
                New password
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Try a memorable passphrase"
                  className="verify-input"
                />
              </label>
              <label className="mt-4 block text-xs font-bold text-slate-600">
                Confirm new password
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Type the same password again"
                  className="verify-input"
                />
              </label>
              <button
                disabled={busy}
                className="mt-6 w-full rounded-xl bg-[#ef766f] px-6 py-3.5 text-xs font-bold text-white disabled:opacity-50"
              >
                {busy ? "Updating…" : "Update password"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
