"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";
import { useCustomer } from "@/mock/CustomerContext";
import { formatMoney } from "@/lib/format";
import { toast } from "sonner";
import {
  ArrowUpRight,
  Send,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Users,
  Zap,
  Wallet,
  ArrowRight,
} from "lucide-react";

export const SendWithdrawPage: React.FC = () => {
  const { wallet, beneficiaries, withdrawXaf, setActiveNav } = useCustomer();

  const [activeTab, setActiveTab] = useState<"withdraw" | "send">("withdraw");

  // Withdraw Form State
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState(
    beneficiaries[0]?.id || "",
  );
  const [withdrawAmount, setWithdrawAmount] = useState("250000");

  // Send Form State
  const [targetWalletEmail, setTargetWalletEmail] = useState("");
  const [sendAmount, setSendAmount] = useState("");

  // Flow State
  const [isConfirming, setIsConfirming] = useState(false);
  const [isMfaOpen, setIsMfaOpen] = useState(false);
  const [mfaDigits, setMfaDigits] = useState(["", "", "", "", "", ""]);

  // In-place post-submission status screen state
  const [submittedTx, setSubmittedTx] = useState<{
    id: string;
    beneficiaryName: string;
    amount: number;
    fee: number;
    total: number;
    status: "Processing" | "Completed" | "Failed";
  } | null>(null);

  const fee = 2500; // 1.0% aggregator fee
  const numAmount = parseFloat(withdrawAmount) || 0;
  const totalDebit = numAmount + fee;
  const selectedBen =
    beneficiaries.find((b) => b.id === selectedBeneficiaryId) ||
    beneficiaries[0];

  // In-place status update timer (Processing -> Completed without page refresh)
  useEffect(() => {
    if (!submittedTx || submittedTx.status !== "Processing") return;
    const timer = setTimeout(() => {
      setSubmittedTx((prev) =>
        prev ? { ...prev, status: "Completed" } : null,
      );
      toast.success("Mobile Money Switch confirmed payout completion.");
    }, 3500);
    return () => clearInterval(timer);
  }, [submittedTx]);

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) {
      toast.error("Please enter a valid disbursement amount.");
      return;
    }
    if (totalDebit > wallet.available) {
      toast.error("Insufficient available balance in your XAF wallet.");
      return;
    }
    setIsConfirming(true);
  };

  const handleConfirmSubmit = () => {
    setIsConfirming(false);
    setIsMfaOpen(true);
  };

  const handleMfaVerifyAndDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMfaOpen(false);

    withdrawXaf(numAmount, fee, selectedBen?.name || "Beneficiary");
    setSubmittedTx({
      id: `WTH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      beneficiaryName: selectedBen?.name || "Beneficiary",
      amount: numAmount,
      fee,
      total: totalDebit,
      status: "Processing",
    });
  };

  const handleSendToWallet = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(sendAmount) || 0;
    if (!targetWalletEmail || amountNum <= 0) {
      toast.error("Please specify recipient customer email and amount.");
      return;
    }
    withdrawXaf(amountNum, 0, `E-NAKO Wallet: ${targetWalletEmail}`);
    toast.success(
      `Internal wallet transfer dispatched to ${targetWalletEmail}.`,
    );
    setSendAmount("");
    setTargetWalletEmail("");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Send & Withdraw"
        subtitle="Disburse funds to registered mobile money wallets or send peer-to-peer between E-NAKO corporate accounts"
      />

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "withdraw", label: "Withdraw to Mobile Money" },
          { id: "send", label: "Peer-to-Peer E-NAKO Transfer" },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as typeof activeTab)}
      />

      {/* Post-Submission Status Screen */}
      {submittedTx ? (
        <Card className="border-slate-200 bg-white shadow-md rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#001f5b] via-[#00c2c7] to-[#D4AF37]" />
          <CardHeader className="bg-slate-50/80 border-b border-slate-100 py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#00c2c7]/15 text-[#001f5b] flex items-center justify-center mx-auto mb-3">
              {submittedTx.status === "Completed" ? (
                <CheckCircle2 className="w-6 h-6 text-[#001f5b]" />
              ) : (
                <Zap className="w-6 h-6 text-[#001f5b] animate-pulse" />
              )}
            </div>
            <div className="flex items-center justify-center mb-2">
              <Badge
                variant={
                  submittedTx.status === "Completed" ? "success" : "warning"
                }
                className="font-mono text-xs uppercase"
              >
                {submittedTx.status === "Completed"
                  ? "Settlement Confirmed"
                  : "Routing to Aggregator"}
              </Badge>
            </div>
            <CardTitle className="text-2xl font-extrabold text-slate-900">
              {submittedTx.status === "Processing"
                ? "Disbursement in Processing..."
                : "Payout Completed Successfully"}
            </CardTitle>
            <CardDescription className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
              {submittedTx.status === "Processing"
                ? "Your payout request is being executed via the CEMAC mobile money switch. Verification in progress..."
                : "Funds have been delivered and acknowledged by the recipient mobile network operator."}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Withdrawal Ref</span>
                <span className="font-bold text-slate-900">
                  {submittedTx.id}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Beneficiary</span>
                <span className="font-semibold text-slate-900 font-sans">
                  {submittedTx.beneficiaryName}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Payout Amount</span>
                <span className="font-bold text-slate-900">
                  {formatMoney(submittedTx.amount, "XAF")}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 font-sans font-bold">
                  Total Debited
                </span>
                <span className="font-extrabold text-[#001f5b] text-sm">
                  {formatMoney(submittedTx.total, "XAF")}
                </span>
              </div>
            </div>

            <div className="flex justify-center space-x-3">
              <Button
                variant="outline"
                size="default"
                onClick={() => setSubmittedTx(null)}
                className="rounded-xl"
              >
                New Withdrawal
              </Button>
              <Button
                variant="default"
                size="default"
                onClick={() => setActiveNav("dashboard")}
                className="bg-[#001f5b] hover:bg-[#00153f] text-white rounded-xl shadow-xs"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : activeTab === "withdraw" ? (
        /* WITHDRAW TAB FORM */
        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#001f5b] via-[#00c2c7] to-[#D4AF37]" />
          <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50">
            <CardTitle className="text-base font-bold text-slate-900">
              Instant Mobile Money Cashout
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Direct API disbursement to MTN Mobile Money and Orange Money
              Cameroun
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form
              onSubmit={handleOpenConfirm}
              className="space-y-5 text-xs font-sans"
            >
              {/* Beneficiary Selector */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-xs">
                    Select Verified Recipient
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveNav("beneficiaries")}
                    className="text-[#001f5b] hover:text-[#00c2c7] font-semibold cursor-pointer underline text-xs transition-colors"
                  >
                    + Register new beneficiary
                  </button>
                </div>
                <select
                  value={selectedBeneficiaryId}
                  onChange={(e) => setSelectedBeneficiaryId(e.target.value)}
                  className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#001f5b]"
                >
                  {beneficiaries.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} — {b.provider} ({b.accountMasked})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount Field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-xs">
                    Withdrawal Amount (XAF)
                  </label>
                  <span className="text-slate-500 font-mono text-xs">
                    Available:{" "}
                    <strong className="text-slate-900">
                      {formatMoney(wallet.available, "XAF")}
                    </strong>
                  </span>
                </div>
                <Input
                  type="number"
                  placeholder="e.g. 250000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full h-11 text-base font-bold font-mono border-slate-300 rounded-xl"
                />
              </div>

              {/* Summary Calculation Panel */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs font-sans">
                <span className="font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-200 pb-2">
                  Disbursement Fee Breakdown
                </span>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-medium">
                    Disbursed Payout to Mobile:
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {formatMoney(numAmount, "XAF")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-medium">
                    Aggregator Gateway Tariff (1.0%):
                  </span>
                  <span className="font-mono text-slate-700">
                    {formatMoney(fee, "XAF")}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-slate-200">
                  <span className="font-bold text-slate-900 text-sm uppercase">
                    Total Amount Debited:
                  </span>
                  <span className="font-mono font-extrabold text-[#001f5b] text-xl">
                    {formatMoney(totalDebit, "XAF")}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  variant="default"
                  size="default"
                  type="submit"
                  disabled={numAmount <= 0 || totalDebit > wallet.available}
                  className="px-8 font-semibold bg-[#001f5b] hover:bg-[#00153f] text-white rounded-xl shadow-xs"
                >
                  Review Authorization <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        /* SEND TO ANOTHER E-NAKO WALLET */
        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#001f5b] via-[#00c2c7] to-[#D4AF37]" />
          <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50">
            <CardTitle className="text-base font-bold text-slate-900">
              Peer-to-Peer Wallet Transfer
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Instant zero-fee transfer to any verified E-NAKO customer or
              merchant account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form
              onSubmit={handleSendToWallet}
              className="space-y-5 text-xs font-sans"
            >
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2 text-xs">
                  Recipient Customer Email / Corporate ID
                </label>
                <Input
                  type="email"
                  placeholder="e.g. corporate.treasury@cameroon-logistics.cm"
                  value={targetWalletEmail}
                  onChange={(e) => setTargetWalletEmail(e.target.value)}
                  className="w-full h-11 text-xs font-sans border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-xs">
                    Transfer Amount (XAF)
                  </label>
                  <span className="text-slate-500 font-mono text-xs">
                    Available:{" "}
                    <strong className="text-slate-900">
                      {formatMoney(wallet.available, "XAF")}
                    </strong>
                  </span>
                </div>
                <Input
                  type="number"
                  placeholder="e.g. 50000"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  className="w-full h-11 text-base font-bold font-mono border-slate-300 rounded-xl"
                />
              </div>

              <div className="p-4 bg-[#001f5b]/5 rounded-2xl border border-[#001f5b]/15 text-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#001f5b] text-white flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-[#00c2c7]" />
                </div>
                <div>
                  <span className="font-bold text-[#001f5b] block">
                    Instant Settlement • Zero Fee
                  </span>
                  <span className="text-slate-600">
                    Internal peer-to-peer ledger updates settle immediately with
                    0 XAF fees.
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  variant="default"
                  size="default"
                  type="submit"
                  className="px-8 font-semibold bg-[#001f5b] hover:bg-[#00153f] text-white rounded-xl shadow-xs"
                >
                  Send Funds <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Step Before Submission Modal */}
      {isConfirming && (
        <Modal
          isOpen={isConfirming}
          onClose={() => setIsConfirming(false)}
          title="Confirm Withdrawal Authorization"
          subtitle="Please inspect recipient coordinates and total debit before dispatching."
          maxWidth="md"
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Recipient Beneficiary:</span>
                <span className="font-bold text-slate-900">
                  {selectedBen?.name}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Provider Switch:</span>
                <span className="font-medium text-slate-800">
                  {selectedBen?.provider}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Disbursed Amount:</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatMoney(numAmount, "XAF")}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Gateway Fee:</span>
                <span className="font-mono text-slate-700">
                  {formatMoney(fee, "XAF")}
                </span>
              </div>
              <div className="flex justify-between py-1.5 pt-2">
                <span className="font-bold text-slate-900 uppercase">
                  Total Debited:
                </span>
                <span className="font-mono font-extrabold text-[#001f5b] text-base">
                  {formatMoney(totalDebit, "XAF")}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsConfirming(false)}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium px-3 py-1 cursor-pointer"
              >
                Cancel
              </button>
              <Button
                variant="default"
                size="default"
                onClick={handleConfirmSubmit}
                className="bg-[#001f5b] hover:bg-[#00153f] text-white rounded-xl shadow-xs"
              >
                Confirm Payout
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MFA Security Screen Modal for Withdrawal */}
      {isMfaOpen && (
        <Modal
          isOpen={isMfaOpen}
          onClose={() => setIsMfaOpen(false)}
          title="Security Step: Enter MFA Code"
          subtitle="Confirm this disbursement with your 6-digit authorization code."
          maxWidth="sm"
        >
          <form
            onSubmit={handleMfaVerifyAndDispatch}
            className="space-y-5 text-xs text-center font-sans"
          >
            <div className="flex justify-between gap-1">
              {mfaDigits.map((d, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={d}
                  onChange={(e) => {
                    const clean = e.target.value.slice(-1);
                    const n = [...mfaDigits];
                    n[i] = clean;
                    setMfaDigits(n);
                  }}
                  className="w-10 h-12 text-center text-lg font-bold font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#001f5b] focus:outline-none"
                />
              ))}
            </div>

            <p className="text-slate-500 text-xs">
              Dispatched to verified device ending in ••82.
            </p>

            <div className="pt-2 flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setIsMfaOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                type="submit"
                className="bg-[#001f5b] hover:bg-[#00153f] text-white"
              >
                Authorize Payout
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
