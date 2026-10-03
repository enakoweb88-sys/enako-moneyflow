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
import { toast } from "sonner";

export const BuyXafPage: React.FC = () => {
  const { buyXaf, setActiveNav } = useCustomer();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [currency, setCurrency] = useState("EUR");
  const [amount, setAmount] = useState("1000");

  // Calculated estimates
  const rates: Record<string, number> = {
    EUR: 655.957,
    USD: 602.15,
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
    setCurrentStep(4); // Confirmation step
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Buy Central African Francs (XAF)"
        subtitle="Lock institutional exchange parity and fund your CFA wallet via bank wire transfer"
      />

      {/* Slim Step Indicator (Matching card style) */}
      {currentStep < 4 && (
        <Card className="border-slate-200">
          <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs font-semibold">
            <span
              className={`px-3 py-1 rounded transition-colors ${
                currentStep === 1
                  ? "bg-emerald-600 text-white"
                  : "text-slate-600 bg-white border border-slate-200"
              }`}
            >
              Step 1 — Amount
            </span>
            <span className="text-slate-300 font-mono">───</span>
            <span
              className={`px-3 py-1 rounded transition-colors ${
                currentStep === 2
                  ? "bg-emerald-600 text-white"
                  : "text-slate-600 bg-white border border-slate-200"
              }`}
            >
              Step 2 — Instructions
            </span>
            <span className="text-slate-300 font-mono">───</span>
            <span
              className={`px-3 py-1 rounded transition-colors ${
                currentStep === 3
                  ? "bg-emerald-600 text-white"
                  : "text-slate-600 bg-white border border-slate-200"
              }`}
            >
              Step 3 — Proof Upload
            </span>
          </div>
        </Card>
      )}

      {/* STEP 1: Amount & Currency Selection */}
      {currentStep === 1 && (
        <Card>
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base">
              Step 1 — Choose Currency & Enter Amount
            </CardTitle>
            <CardDescription className="text-xs">
              Select the source currency you will deposit from your bank
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Source Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="EUR">EUR — Euro (SEPA Transfer)</option>
                  <option value="USD">USD — US Dollar (Wire / ACH)</option>
                  <option value="GBP">
                    GBP — British Pound (Faster Payments)
                  </option>
                  <option value="CAD">
                    CAD — Canadian Dollar (Interac / EFT)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Deposit Amount ({currency})
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-base font-bold font-mono"
                />
              </div>
            </div>

            {/* Results Panel */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">
                  Guaranteed Institutional Rate:
                </span>
                <span className="font-mono font-bold text-slate-800">
                  1 {currency} = {selectedRate.toFixed(3)} XAF
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">
                  Operational Processing Fee:
                </span>
                <span className="font-mono text-slate-700">
                  {selectedFee} {currency}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide block">
                    Estimated Net Payout into XAF Wallet
                  </span>
                  <span className="text-xs text-slate-500">
                    Calculated on net amount ({netAmountSource.toLocaleString()}{" "}
                    {currency})
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-emerald-800 font-mono tracking-tight">
                    {estimatedXaf.toLocaleString()} XAF
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-500 italic">
                * Note: The final conversion rate is frozen and locked as soon
                as your bank wire is acknowledged by our clearing desk.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="default"
                size="default"
                disabled={sourceNum <= selectedFee}
                onClick={() => setCurrentStep(2)}
                className="px-8 font-semibold"
              >
                Continue to Payment Instructions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: Payment Instructions */}
      {currentStep === 2 && (
        <Card>
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  Step 2 — Deposit Bank Wire Instructions
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Transfer the exact amount using the mandatory payment
                  reference
                </CardDescription>
              </div>
              <Badge variant="warning">
                Expires in {formatTimer(secondsRemaining)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Prominent Payment Reference Block */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                  Mandatory Transfer Reference (Must include in wire memo)
                </span>
                <span className="text-2xl font-extrabold font-mono text-emerald-950 tracking-wider mt-1 block">
                  {reference}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(reference, "Payment Reference")}
                className="bg-white border-emerald-300 text-emerald-900"
              >
                Copy Reference
              </Button>
            </div>

            {/* Bank Details Table */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 text-xs">
              <span className="font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-100 pb-2">
                E-NAKO Designated Clearing Bank Account ({currency})
              </span>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">
                  Beneficiary Name:
                </span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-900 font-sans">
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
                    className="text-emerald-700 underline text-xs cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Bank Name:</span>
                <span className="font-semibold text-slate-900">
                  BNP Paribas Paris Commercial
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">
                  IBAN / Account Number:
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
                    className="text-emerald-700 underline text-xs cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 font-medium">
                  BIC / SWIFT Code:
                </span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-slate-900">
                    BNPAFRPP
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("BNPAFRPP", "BIC")}
                    className="text-emerald-700 underline text-xs cursor-pointer"
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
              >
                Back to Amount
              </Button>
              <Button
                variant="default"
                size="default"
                onClick={() => setCurrentStep(3)}
                className="px-6 font-semibold"
              >
                I’ve Made the Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: Proof Upload */}
      {currentStep === 3 && (
        <Card>
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base">
              Step 3 — Upload Payment Proof
            </CardTitle>
            <CardDescription className="text-xs">
              Upload your bank receipt or wire transfer confirmation to
              accelerate verification
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Drop-zone Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Bank Transfer Receipt (Drop-Zone)
              </label>
              <div className="p-8 border-2 border-dashed border-slate-300 rounded-xl text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer space-y-2">
                <span className="font-bold text-slate-800 text-sm block">
                  Drag a file here or click to upload
                </span>
                <span className="text-xs text-slate-500 block">
                  Accepts PDF, JPG, PNG up to 10MB (Official bank swift advice,
                  receipt, or transaction voucher)
                </span>
              </div>
            </div>

            {/* Uploaded File Item */}
            {uploadedFile && (
              <div className="p-4 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-xs text-slate-900 block">
                    {uploadedFile}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    1.8 MB • Ready to dispatch
                  </span>
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
              >
                Back to Bank Details
              </Button>
              <Button
                variant="default"
                size="default"
                disabled={!uploadedFile}
                onClick={handleCompleteSubmission}
                className="px-8 font-semibold"
              >
                Submit for Verification
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 4: Confirmation Screen */}
      {currentStep === 4 && (
        <Card className="border-emerald-200 bg-white shadow-md">
          <CardHeader className="bg-emerald-50/60 border-b border-emerald-100 py-6 text-center">
            <Badge variant="success" className="mx-auto mb-2">
              Remittance Submitted
            </Badge>
            <CardTitle className="text-2xl font-extrabold text-slate-900">
              Payment Awaiting Verification
            </CardTitle>
            <CardDescription className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
              Your remittance order has been registered in our clearing system
              and queued for dual-control treasury matching.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6 text-center">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">
                  Remittance Reference:
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {reference}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">
                  Source Amount:
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {sourceNum.toLocaleString()} {currency}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">
                  Credited to Wallet:
                </span>
                <span className="font-mono font-extrabold text-emerald-800 text-sm">
                  {estimatedXaf.toLocaleString()} XAF
                </span>
              </div>
            </div>

            <div>
              <Button
                variant="default"
                size="lg"
                onClick={() => setActiveNav("dashboard")}
                className="px-8 font-semibold"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
