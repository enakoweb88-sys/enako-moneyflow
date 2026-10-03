"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useCustomer } from "@/mock/CustomerContext";
import type { CustomerBeneficiary } from "@/mock/customerData";
import { toast } from "sonner";

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saved Beneficiaries"
        subtitle="Manage authorized mobile money wallets and bank accounts for instant cashouts"
        action={
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsAddOpen(true)}
          >
            Add Beneficiary
          </Button>
        }
      />

      {/* Beneficiaries Table */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Registered Accounts ({beneficiaries.length})
            </CardTitle>
            <span className="text-xs text-slate-500 font-mono">
              24-Hour Cooldown on New Additions
            </span>
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
                    {ben.name}
                  </td>
                  <td className="py-3.5 px-6 font-sans text-slate-700">
                    {ben.provider}
                  </td>
                  <td className="py-3.5 px-6 text-slate-800">
                    {ben.accountMasked}
                  </td>
                  <td className="py-3.5 px-6 font-sans">
                    <div className="space-y-1">
                      <Badge
                        variant={
                          ben.status === "Active" ? "success" : "warning"
                        }
                      >
                        {ben.status}
                      </Badge>
                      {ben.cooldownNote && (
                        <p className="text-slate-500 text-xs italic">
                          {ben.cooldownNote}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-right font-sans space-x-3">
                    <button
                      type="button"
                      onClick={() => setEditingBen(ben)}
                      className="text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(ben)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer underline"
                    >
                      Remove
                    </button>
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
        subtitle="For security against unauthorized withdrawals, new beneficiaries undergo a 24-hour cooldown."
        maxWidth="md"
      >
        <form
          onSubmit={handleAddSubmit}
          className="space-y-4 text-xs font-sans"
        >
          <div>
            <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
              Beneficiary Full Name
            </label>
            <Input
              type="text"
              placeholder="e.g. Marcella Ebong"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs font-sans"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
              Provider / Payment Switch
            </label>
            <select
              value={provider}
              onChange={(e) =>
                setProvider(e.target.value as CustomerBeneficiary["provider"])
              }
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-sans"
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
            <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
              Mobile Number / Bank Account Number
            </label>
            <Input
              type="text"
              placeholder="e.g. +237 677 00 11 22 or IBAN"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full text-xs font-mono"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end space-x-3">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setIsAddOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="default" size="sm" type="submit">
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
          subtitle="Update recipient profile information."
          maxWidth="md"
        >
          <form
            onSubmit={handleEditSave}
            className="space-y-4 text-xs font-sans"
          >
            <div>
              <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                Beneficiary Name
              </label>
              <Input
                type="text"
                defaultValue={editingBen.name}
                className="w-full text-xs font-sans"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                Account Number
              </label>
              <Input
                type="text"
                defaultValue={editingBen.accountReal}
                className="w-full text-xs font-mono"
              />
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setEditingBen(null)}
              >
                Cancel
              </Button>
              <Button variant="default" size="sm" type="submit">
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
