"use client";

import React, { useState } from "react";
import {
  TransactionListTemplate,
  type TransactionListItem,
} from "@/components/common/TransactionListTemplate";
import { ModuleIntro } from "@/components/common/ModuleIntro";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const DisputesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "intro">("list");
  const [activeTab, setActiveTab] = useState("open");
  const [activeStatus, setActiveStatus] = useState("All");
  const [showRaiseForm, setShowRaiseForm] = useState(false);

  // Mock dispute data
  const disputes: TransactionListItem[] = [
    {
      id: "disp_001",
      date: "2026-10-02 09:15",
      description: "Failed withdrawal still showing debit — REM-2026-9042",
      amount: "-175 000 XAF",
      status: "Pending",
      reference: "DISP-2026-001",
    },
    {
      id: "disp_002",
      date: "2026-09-28 14:30",
      description: "Duplicate fee charged on remittance — REM-2026-8791",
      amount: "-5 250 XAF",
      status: "Processing",
      reference: "DISP-2026-002",
    },
    {
      id: "disp_003",
      date: "2026-09-20 11:00",
      description: "Incorrect exchange rate applied — REM-2026-8450",
      amount: "-32 100 XAF",
      status: "Completed",
      reference: "DISP-2026-003",
    },
  ];

  const tabs = [
    { id: "open", label: "Open", count: 1 },
    { id: "in-review", label: "In review", count: 1 },
    { id: "all", label: "All", count: 3 },
    { id: "resolved", label: "Resolved", count: 1 },
    { id: "declined", label: "Declined", count: 0 },
  ];

  const statusFilters = ["All", "Pending", "Processing", "Completed", "Failed"];

  if (viewMode === "intro") {
    return (
      <ModuleIntro
        moduleName="Disputes"
        badgeLabel="Account Protection"
        headline="Raise and track concerns about your transactions"
        description="If a withdrawal failed but still shows a debit, a remittance is stuck in review, or a fee seems incorrect — you can raise a case here. Our operations team will investigate and keep you updated throughout the process."
        primaryActionLabel="View my disputes"
        onPrimaryAction={() => setViewMode("list")}
        secondaryActionLabel="Learn about dispute resolution"
        onSecondaryAction={() => {}}
        features={[
          {
            title: "Transparent tracking",
            description:
              "Every dispute has a timeline showing investigation progress and resolution updates.",
          },
          {
            title: "Direct communication",
            description:
              "Message our support team directly within each case for faster resolution.",
          },
          {
            title: "Evidence upload",
            description:
              "Attach screenshots, receipts, or bank statements as supporting evidence.",
          },
        ]}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <TransactionListTemplate
        title="Transaction Disputes"
        subtitle="Raise and track concerns about your transactions"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        statusFilters={statusFilters}
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
        items={disputes}
        searchPlaceholder="Search by reference or description..."
        emptyTitle="No disputes right now"
        emptyDescription="If you have a concern about any of your transactions, you can raise a dispute here."
        emptyActionLabel="Learn about disputes"
        onEmptyAction={() => setViewMode("intro")}
        primaryActionLabel="Raise a dispute"
        onPrimaryAction={() => setShowRaiseForm(true)}
      />

      {/* Raise Dispute Modal */}
      {showRaiseForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-[1px] animate-in fade-in duration-100">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Raise a dispute
              </h3>
              <button
                type="button"
                onClick={() => setShowRaiseForm(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Select the transaction you&apos;re concerned about and describe
              the issue.
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Transaction
                </label>
                <select className="w-full border border-slate-300 rounded-md p-2 text-xs">
                  <option>
                    REM-2026-9042 — Withdrawal to MTN MoMo (-175 000 XAF)
                  </option>
                  <option>
                    REM-2026-8791 — Inward Remittance from EUR (+3 260 106 XAF)
                  </option>
                  <option>
                    REM-2026-8450 — Withdrawal to Orange Money (-50 000 XAF)
                  </option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Reason
                </label>
                <select className="w-full border border-slate-300 rounded-md p-2 text-xs">
                  <option>Failed transaction still debited</option>
                  <option>Incorrect amount charged</option>
                  <option>Duplicate fee</option>
                  <option>Wrong exchange rate</option>
                  <option>Transaction stuck in review</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the issue in detail..."
                  className="w-full border border-slate-300 rounded-md p-2 text-xs resize-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Evidence (optional)
                </label>
                <div className="border border-dashed border-slate-300 rounded-md p-4 text-center text-slate-400">
                  <span className="text-xs">
                    Drop a file here or click to upload
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-2 flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRaiseForm(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => setShowRaiseForm(false)}
                className="bg-[#001f5b] text-white"
              >
                Submit dispute
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
