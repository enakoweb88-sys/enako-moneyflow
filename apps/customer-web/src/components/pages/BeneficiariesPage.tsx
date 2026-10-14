"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useCustomer } from "@/mock/CustomerContext";
import type { CustomerBeneficiary } from "@/mock/customerData";
import { toast } from "sonner";
import {
  Plus,
  Users,
  ShieldCheck,
  Building2,
  Smartphone,
  Edit2,
  Trash2,
} from "lucide-react";

export const BeneficiariesPage: React.FC = () => {
  const { beneficiaries, addBeneficiary, removeBeneficiary } = useCustomer();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBen, setEditingBen] = useState<CustomerBeneficiary | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<CustomerBeneficiary | null>(
    null,
  );

  // Form State
  const [name, setName] = useState("");
  const [provider, setProvider] =
    useState<CustomerBeneficiary["provider"]>("MTN Mobile Money");
  const [account, setAccount] = useState("");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !account.trim()) {
      toast.error("Please enter beneficiary legal name and account number.");
      return;
    }
    addBeneficiary(name.trim(), provider, account.trim());
    setIsAddOpen(false);
    setName("");
    setAccount("");
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBen) return;
    toast.success(`Beneficiary ${editingBen.name} details updated.`);
    setEditingBen(null);
  };

  const getProviderIcon = (prov: string) => {
    if (prov.includes("MTN") || prov.includes("Orange")) {
      return <Smartphone className="w-4 h-4 text-[#001f5b]" />;
    }
    return <Building2 className="w-4 h-4 text-[#001f5b]" />;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saved Beneficiaries"
        subtitle="Manage authorized mobile money wallets and bank clearing coordinates for automated disbursements"
        action={
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="bg-[#001f5b] hover:bg-[#00153f] text-white rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Beneficiary
          </Button>
        }
      />

      {/* Security Notice */}
      <div className="p-4 rounded-2xl bg-[#001f5b]/5 border border-[#001f5b]/15 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#001f5b] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#00c2c7]" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#001f5b] block">
              Dual-Control Security Cooldown Active
            </span>
            <span className="text-[11px] text-slate-600">
              Newly registered payout accounts undergo a 24-hour verification
              hold before high-volume withdrawals are permitted.
            </span>
          </div>
        </div>
        <Badge
          variant="neutral"
          className="text-[10px] font-mono shrink-0 hidden sm:inline-flex"
        >
          AML / BEAC Standard
        </Badge>
      </div>

      {/* Beneficiaries Table */}
      <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#001f5b] via-[#00c2c7] to-[#D4AF37]" />
        <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Registered Beneficiaries ({beneficiaries.length})
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Verified payment destinations across Cameroon and the CEMAC zone
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">Beneficiary Name</th>
                <th className="py-3 px-6">Network Provider</th>
                <th className="py-3 px-6">Account / Phone</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {beneficiaries.map((ben) => (
                <tr
                  key={ben.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3.5 px-6 font-sans font-semibold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        {getProviderIcon(ben.provider)}
                      </div>
                      <span>{ben.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 font-sans text-slate-700">
                    {ben.provider}
                  </td>
                  <td className="py-3.5 px-6 text-slate-800">
                    {ben.accountMasked}
                  </td>
                  <td className="py-3.5 px-6 font-sans">
                    <div className="space-y-0.5">
                      <Badge
                        variant={
                          ben.status === "Active" ? "success" : "warning"
                        }
                      >
                        {ben.status}
                      </Badge>
                      {ben.cooldownNote && (
                        <p className="text-slate-500 text-[10px] italic">
                          {ben.cooldownNote}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-right font-sans space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingBen(ben)}
                      className="text-xs text-slate-600 hover:text-slate-900 h-8 px-2"
                    >
                      <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(ben)}
                      className="text-xs text-rose-600 hover:text-rose-800 h-8 px-2"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Beneficiary Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Beneficiary Account"
        subtitle="For security against unauthorized withdrawals, newly added accounts enter a 24-hour verification cooldown."
        maxWidth="md"
      >
        <form
          onSubmit={handleAddSubmit}
          className="space-y-4 text-xs font-sans"
        >
          <div>
            <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
              Beneficiary Legal Name
            </label>
            <Input
              type="text"
              placeholder="e.g. Marcella Ebong"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs font-sans border-slate-300 rounded-xl h-10"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
              Provider / Payment Switch
            </label>
            <select
              value={provider}
              onChange={(e) =>
                setProvider(e.target.value as CustomerBeneficiary["provider"])
              }
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#001f5b] font-sans"
            >
              <option value="MTN Mobile Money">
                MTN Mobile Money Cameroun
              </option>
              <option value="Orange Money">Orange Money Cameroun</option>
              <option value="Ecobank Cameroon">
                Ecobank Cameroon (Commercial Wire)
              </option>
              <option value="Afriland First Bank">Afriland First Bank</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
              Mobile Number / Bank Account Number
            </label>
            <Input
              type="text"
              placeholder="e.g. +237 677 00 11 22 or IBAN"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full text-xs font-mono border-slate-300 rounded-xl h-10"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end space-x-3">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              type="submit"
              className="bg-[#001f5b] hover:bg-[#00153f] text-white rounded-xl"
            >
              Save Beneficiary
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Beneficiary Modal */}
      {editingBen && (
        <Modal
          isOpen={!!editingBen}
          onClose={() => setEditingBen(null)}
          title={`Edit Beneficiary: ${editingBen.name}`}
          subtitle="Update recipient profile details."
          maxWidth="md"
        >
          <form
            onSubmit={handleEditSave}
            className="space-y-4 text-xs font-sans"
          >
            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                Beneficiary Name
              </label>
              <Input
                type="text"
                defaultValue={editingBen.name}
                className="w-full text-xs font-sans border-slate-300 rounded-xl h-10"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                Account Number
              </label>
              <Input
                type="text"
                defaultValue={editingBen.accountReal}
                className="w-full text-xs font-mono border-slate-300 rounded-xl h-10"
              />
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setEditingBen(null)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                type="submit"
                className="bg-[#001f5b] hover:bg-[#00153f] text-white rounded-xl"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Remove Confirmation Dialog */}
      {deleteTarget && (
        <ConfirmDialog
          isOpen={!!deleteTarget}
          title={`Remove Beneficiary: ${deleteTarget.name}`}
          description={`Are you sure you want to remove ${deleteTarget.name} (${deleteTarget.provider}) from your saved accounts? If re-added in the future, it will enter a 24-hour security cooldown.`}
          confirmLabel="Remove Beneficiary"
          cancelLabel="Cancel"
          variant="destructive"
          onConfirm={() => {
            removeBeneficiary(deleteTarget.id);
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};
