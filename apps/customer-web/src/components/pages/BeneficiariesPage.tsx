"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useCustomer } from "@/mock/CustomerContext";
import type { CustomerBeneficiary } from "@/mock/customerData";

export const BeneficiariesPage: React.FC = () => {
  const { beneficiaries, addBeneficiary, removeBeneficiary, setActiveNav } =
    useCustomer();
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<CustomerBeneficiary | null>(null);
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [provider, setProvider] =
    useState<CustomerBeneficiary["provider"]>("MTN Mobile Money");
  const [saving, setSaving] = useState(false);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !account.trim())
      return toast.error("Enter the legal name and destination account.");
    setSaving(true);
    try {
      await addBeneficiary(name.trim(), provider, account.trim());
      setName("");
      setAccount("");
      setAdding(false);
      toast.success("Beneficiary saved successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Beneficiary could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-9 pb-14">
      <section className="relative overflow-hidden rounded-[30px] bg-[#171b29] px-7 py-9 text-white sm:px-10">
        <div className="send-current" />
        <div className="relative z-10 flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#ffaaa5]">
              Trusted destinations
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-[-.045em] sm:text-5xl">
              Know exactly where your money can go.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">
              Maintain verified mobile wallets and bank accounts before starting
              a payout.
            </p>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 self-start rounded-xl bg-[#ef7775] px-4 py-3 text-xs font-bold"
          >
            <Plus size={14} /> Add beneficiary
          </button>
        </div>
      </section>
      <section className="grid gap-7 lg:grid-cols-[.65fr_1.35fr]">
        <aside className="bg-[#f8ece5] p-7">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#b15357]">
            Security control
          </p>
          <h2 className="mt-4 text-2xl font-bold tracking-[-.035em]">
            New destinations cool down for 24 hours.
          </h2>
          <p className="mt-4 text-xs leading-6 text-[#75645e]">
            The hold gives you time to identify an unauthorized change before
            high-value withdrawals are enabled.
          </p>
          <div className="mt-8 border-t border-[#e2cec5] pt-5">
            <p className="money-number text-4xl font-bold">
              {beneficiaries.length}
            </p>
            <p className="mt-1 text-xs text-[#75645e]">Saved destinations</p>
          </div>
        </aside>
        <div className="border-y border-slate-200">
          {beneficiaries.length ? (
            beneficiaries.map((item) => (
              <div
                key={item.id}
                className="group grid gap-4 border-b border-slate-100 px-2 py-5 last:border-0 sm:grid-cols-[1fr_.8fr_.7fr_auto] sm:items-center"
              >
                <div>
                  <strong className="block text-sm text-slate-800">
                    {item.name}
                  </strong>
                  <span className="mt-1 block text-xs text-slate-400">
                    {item.accountMasked}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  {item.provider}
                </span>
                <span
                  className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold ${item.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                >
                  {item.status}
                </span>
                <button
                  onClick={() => setDeleting(item)}
                  className="text-slate-300 hover:text-rose-600"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          ) : (
            <div className="grid min-h-80 place-items-center text-center">
              <div>
                <p className="text-sm font-bold text-slate-700">
                  No trusted destinations yet.
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Add and verify a recipient before withdrawing.
                </p>
                <button
                  onClick={() => setAdding(true)}
                  className="mt-6 text-xs font-bold text-[#a95054]"
                >
                  Add your first beneficiary
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="flex flex-col justify-between gap-5 bg-[#edf7f5] p-7 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold text-[#24413f]">
            Ready to move money?
          </p>
          <p className="mt-1 text-xs text-[#5e7774]">
            Only active destinations appear in the withdrawal flow.
          </p>
        </div>
        <button
          onClick={() => setActiveNav("send-withdraw")}
          className="self-start rounded-xl bg-[#24413f] px-4 py-3 text-xs font-bold text-white"
        >
          Open send & withdraw
        </button>
      </section>
      <Modal
        isOpen={adding}
        onClose={() => setAdding(false)}
        title="Add a trusted destination"
        subtitle="The destination enters a 24-hour security cooldown after it is saved."
        maxWidth="md"
      >
        <form onSubmit={save} className="space-y-5">
          <label className="grid gap-2 text-xs font-bold text-slate-600">
            Legal beneficiary name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-[#d76164]"
            />
          </label>
          <label className="grid gap-2 text-xs font-bold text-slate-600">
            Provider
            <select
              value={provider}
              onChange={(e) =>
                setProvider(e.target.value as CustomerBeneficiary["provider"])
              }
              className="rounded-xl border border-slate-300 px-3 py-3 text-sm"
            >
              <option>MTN Mobile Money</option>
              <option>Orange Money</option>
              <option>Ecobank Cameroon</option>
              <option>Afriland First Bank</option>
            </select>
          </label>
          <label className="grid gap-2 text-xs font-bold text-slate-600">
            Phone or bank account
            <input
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="money-number rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-[#d76164]"
            />
          </label>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-3 text-xs font-bold text-slate-500"
            >
              Cancel
            </button>
            <button
              disabled={saving}
              className="rounded-xl bg-[#d76164] px-5 py-3 text-xs font-bold text-white disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save destination"}
            </button>
          </div>
        </form>
      </Modal>
      {deleting ? (
        <ConfirmDialog
          isOpen
          title={`Remove ${deleting.name}?`}
          description="This destination will no longer be available for withdrawals."
          confirmLabel="Remove"
          cancelLabel="Keep it"
          variant="destructive"
          onConfirm={() => {
            void removeBeneficiary(deleting.id)
              .then(() => toast.success("Beneficiary removed."))
              .catch((error) =>
                toast.error(
                  error instanceof Error
                    ? error.message
                    : "Beneficiary could not be removed.",
                ),
              );
            setDeleting(null);
          }}
          onCancel={() => setDeleting(null)}
        />
      ) : null}
    </div>
  );
};
