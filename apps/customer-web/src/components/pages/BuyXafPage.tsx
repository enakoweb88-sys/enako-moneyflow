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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCustomer } from "@/mock/CustomerContext";
import { formatMoney, formatNumber } from "@/lib/format";
import { toast } from "sonner";
import {
  CheckCircle2,
  Copy,
  ArrowRight,
  ShieldCheck,
  Clock,
  Building2,
  UploadCloud,
  FileCheck,
  ArrowDownLeft,
} from "lucide-react";

export const BuyXafPage: React.FC = () => {
  const { buyXaf, setActiveNav } = useCustomer();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [currency, setCurrency] = useState("EUR");
  const [amount, setAmount] = useState("1000");

  // Rates matching Enako BEAC institutional peg
  const rates: Record<string, number> = {
    EUR: 655.957,
    USD: 608.45,
    GBP: 775.4,
    CAD: 442.8,
  };
  const fees: Record<string, number> = {
    EUR: 10,
    USD: 12,
    GBP: 8,
    CAD: 15,
  };

  const selectedRate = rates[currency] || 655.957;
  const selectedFee = fees[currency] || 10;
  const sourceNum = parseFloat(amount) || 0;
  const netAmountSource = Math.max(0, sourceNum - selectedFee);
  const estimatedXaf = Math.round(netAmountSource * selectedRate);

  // Step 2 Reference & Timer
  const [reference] = useState("ENK-REM-89211");
  const [secondsRemaining, setSecondsRemaining] = useState(1799); // 29m 59s

  useEffect(() => {
    if (currentStep !== 2 || secondsRemaining <= 0) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStep, secondsRemaining]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
  };

  // Step 3 File Upload
  const [uploadedFile, setUploadedFile] = useState<string | null>(
    "bnp_sepa_wire_receipt_1000eur.pdf",
  );

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleCompleteSubmission = () => {
    buyXaf(sourceNum, currency, estimatedXaf);
    setCurrentStep(4);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Buy Central African Francs (XAF)"
        subtitle="Lock BEAC institutional parity and credit your multi-currency XAF treasury wallet"
      />

      {/* Modern Stepper Indicator */}
      {currentStep < 4 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                num: 1,
                title: "Amount & Currency",
                desc: "Real-time conversion",
              },
              {
                num: 2,
                title: "Wire Instructions",
                desc: "Clearing account details",
              },
              { num: 3, title: "Proof Submission", desc: "Voucher upload" },
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isDone = currentStep > step.num;
              return (
                <div
                  key={step.num}
                  className={`p-3 rounded-xl border transition-all ${
                    isActive
                      ? "border-[#001f5b] bg-[#001f5b]/5 text-[#001f5b]"
                      : isDone
                        ? "border-[#00c2c7]/40 bg-[#00c2c7]/5 text-slate-800"
                        : "border-slate-100 bg-slate-50/60 text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                        isActive
                          ? "bg-[#001f5b] text-white shadow-xs"
                          : isDone
                            ? "bg-[#00c2c7] text-[#001f5b]"
                            : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isDone ? "✓" : step.num}
                    </span>
                    <span className="text-xs font-bold truncate">
                      {step.title}
                    </span>
                  </div>
                  <span className="text-[10px] hidden sm:block text-slate-500 truncate">
                    {step.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 1: Amount & Currency Selection */}
      {currentStep === 1 && (
        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#001f5b] via-[#00c2c7] to-[#D4AF37]" />
          <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50">
            <CardTitle className="text-base font-bold text-slate-900">
              Step 1 — Conversion Parameters
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Select foreign deposit currency and nominal amount to convert to
              CEMAC XAF
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Deposit Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#001f5b]"
                >
                  <option value="EUR">EUR — Euro (SEPA Institutional)</option>
                  <option value="USD">USD — US Dollar (Fedwire / SWIFT)</option>
                  <option value="GBP">
                    GBP — British Pound (CHAPS / Faster Payments)
                  </option>
                  <option value="CAD">
                    CAD — Canadian Dollar (Interac / EFT)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Deposit Amount ({currency})
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-11 text-base font-bold font-mono border-slate-300 rounded-xl"
                />
              </div>
            </div>

            {/* Live Exchange Calculation Box */}
            <div className="p-5 rounded-2xl bg-[#001f5b]/5 border border-[#001f5b]/15 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#001f5b]/10 text-xs">
                <span className="text-slate-600 font-medium">
                  Guaranteed Institutional Parity
                </span>
                <span className="font-mono font-bold text-[#001f5b] bg-white px-2 py-0.5 rounded-md border border-[#001f5b]/10 shadow-2xs">
                  1 {currency} = {formatNumber(selectedRate, 3)} XAF
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">
                  Operational Processing Fee
                </span>
                <span className="font-mono font-semibold text-slate-800">
                  {formatMoney(selectedFee, currency)}
                </span>
              </div>

              <div className="pt-3 border-t border-[#001f5b]/10 flex flex-col sm:flex-row justify-between sm:items-baseline gap-2">
                <div>
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Estimated Net XAF Treasury Credit
                  </span>
                  <span className="text-xs text-slate-500">
                    Net convertible: {formatMoney(netAmountSource, currency)}
                  </span>
                </div>
                <div className="sm:text-right">
                  <div className="text-3xl font-extrabold text-[#001f5b] font-mono tracking-tight">
                    {formatMoney(estimatedXaf, "XAF")}
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5 border-t border-[#001f5b]/10">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00c2c7] shrink-0" />
                <span>
                  Rate locked for 30 minutes upon initiating settlement.
                  Guaranteed zero slippage.
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="default"
                size="default"
                disabled={sourceNum <= selectedFee}
                onClick={() => setCurrentStep(2)}
                className="px-8 font-semibold bg-[#001f5b] hover:bg-[#00153f] text-white rounded-xl shadow-xs"
              >
                Proceed to Payment Details{" "}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: Payment Instructions */}
      {currentStep === 2 && (
        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#001f5b] via-[#00c2c7] to-[#D4AF37]" />
          <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Step 2 — Deposit Bank Wire Instructions
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Transfer funds from your corporate account quoting the
                  designated payment reference
                </CardDescription>
              </div>
              <Badge
                variant="warning"
                className="flex items-center gap-1 font-mono"
              >
                <Clock className="w-3 h-3" /> Expires in{" "}
                {formatTimer(secondsRemaining)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Prominent Payment Reference Block */}
            <div className="p-4 bg-[#001f5b]/5 rounded-2xl border border-[#001f5b]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#001f5b] uppercase tracking-wider block">
                  Mandatory Wire Memo / Payment Reference
                </span>
                <span className="text-2xl font-extrabold font-mono text-slate-900 tracking-wider mt-1 block">
                  {reference}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(reference, "Payment Reference")}
                className="bg-white border-slate-300 text-[#001f5b] hover:bg-slate-50 rounded-lg shrink-0"
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Reference
              </Button>
            </div>

            {/* Bank Details Table */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#001f5b]" />
                  <span className="font-bold text-slate-900 uppercase tracking-wider">
                    E-NAKO Designated Clearing Bank Account ({currency})
                  </span>
                </div>
                <Badge variant="neutral" className="text-[10px]">
                  Correspondent Account
                </Badge>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">
                  Beneficiary Name
                </span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-900">
                    E-NAKO Financial Clearing SAS
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        "E-NAKO Financial Clearing SAS",
                        "Beneficiary Name",
                      )
                    }
                    className="text-[#001f5b] font-medium hover:underline text-xs cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">
                  Clearing Depository
                </span>
                <span className="font-semibold text-slate-900">
                  BNP Paribas Paris Commercial
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">
                  IBAN / Account Number
                </span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-slate-900">
                    FR76 3000 4001 9283 7465 1928 344
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard("FR7630004001928374651928344", "IBAN")
                    }
                    className="text-[#001f5b] font-medium hover:underline text-xs cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 font-medium">
                  BIC / SWIFT Routing
                </span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-slate-900">
                    BNPAFRPP
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("BNPAFRPP", "BIC")}
                    className="text-[#001f5b] font-medium hover:underline text-xs cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="default"
                onClick={() => setCurrentStep(1)}
                className="rounded-xl"
              >
                Back to Amount
              </Button>
              <Button
                variant="default"
                size="default"
                onClick={() => setCurrentStep(3)}
                className="px-6 font-semibold bg-[#001f5b] hover:bg-[#00153f] text-white rounded-xl shadow-xs"
              >
                I Have Sent the Wire <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: Proof Upload */}
      {currentStep === 3 && (
        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#001f5b] via-[#00c2c7] to-[#D4AF37]" />
          <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50">
            <CardTitle className="text-base font-bold text-slate-900">
              Step 3 — Upload Settlement Proof
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Attach wire transfer advice or transaction receipt to dispatch
              instant clearing
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Settlement Advice Document
              </label>
              <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl text-center bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer space-y-2">
                <UploadCloud className="w-8 h-8 text-[#001f5b] mx-auto opacity-70" />
                <span className="font-bold text-slate-800 text-sm block">
                  Drag and drop proof here, or browse files
                </span>
                <span className="text-xs text-slate-500 block max-w-sm mx-auto">
                  Accepts PDF, JPG, PNG up to 10MB (Official bank swift voucher
                  or online wire receipt)
                </span>
              </div>
            </div>

            {uploadedFile && (
              <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#001f5b]/10 text-[#001f5b] flex items-center justify-center font-bold">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-xs text-slate-900 block">
                      {uploadedFile}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      1.8 MB • Ready to dispatch
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedFile(null)}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="default"
                onClick={() => setCurrentStep(2)}
                className="rounded-xl"
              >
                Back to Bank Details
              </Button>
              <Button
                variant="default"
                size="default"
                disabled={!uploadedFile}
                onClick={handleCompleteSubmission}
                className="px-8 font-semibold bg-[#001f5b] hover:bg-[#00153f] text-white rounded-xl shadow-xs"
              >
                Submit for Verification
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 4: Confirmation Screen */}
      {currentStep === 4 && (
        <Card className="border-slate-200 bg-white shadow-md rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#001f5b] via-[#00c2c7] to-[#D4AF37]" />
          <CardHeader className="bg-slate-50/80 border-b border-slate-100 py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#00c2c7]/15 text-[#001f5b] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-[#001f5b]" />
            </div>
            <Badge
              variant="success"
              className="mx-auto mb-2 bg-[#00c2c7]/15 text-[#001f5b] border-[#00c2c7]/30"
            >
              Remittance Queued
            </Badge>
            <CardTitle className="text-2xl font-extrabold text-slate-900">
              Wire Deposit Acknowledged
            </CardTitle>
            <CardDescription className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
              Your remittance order has been registered in the Enako treasury
              matching engine. Funds will credit your wallet immediately upon
              clearing.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6 text-center">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto space-y-2.5 text-xs text-left">
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500 font-medium">
                  Remittance Reference
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {reference}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500 font-medium">
                  Source Remittance Amount
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {formatMoney(sourceNum, currency)}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 font-medium">
                  Anticipated Wallet Credit
                </span>
                <span className="font-mono font-extrabold text-[#001f5b] text-sm">
                  {formatMoney(estimatedXaf, "XAF")}
                </span>
              </div>
            </div>

            <div>
              <Button
                variant="default"
                size="lg"
                onClick={() => setActiveNav("dashboard")}
                className="px-8 font-semibold bg-[#001f5b] hover:bg-[#00153f] text-white rounded-xl shadow-xs"
              >
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
