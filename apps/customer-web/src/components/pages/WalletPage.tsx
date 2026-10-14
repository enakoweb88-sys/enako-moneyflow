"use client";

import React, { useState, useMemo } from "react";
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
import { useCustomer } from "@/mock/CustomerContext";
import { formatMoney } from "@/lib/format";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Building,
  ShieldCheck,
  CreditCard,
  Layers,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export const WalletPage: React.FC = () => {
  const { wallet, activities, setActiveNav } = useCustomer();

  const [dateFilter, setDateFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const filteredActivities = useMemo(() => {
    return activities.filter((tx) => {
      const matchType =
        typeFilter === "ALL" ||
        (typeFilter === "IN" && tx.direction === "in") ||
        (typeFilter === "OUT" && tx.direction === "out");
      const matchStatus = statusFilter === "ALL" || tx.status === statusFilter;
      return matchType && matchStatus;
    });
  }, [activities, typeFilter, statusFilter]);

  const handleDownloadCsv = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,Description,Direction,Amount,Running Balance,Status\n" +
      activities
        .map(
          (a) =>
            `"${a.date}","${a.description}","${a.direction}","${a.amountFormatted}","${a.runningBalance}","${a.status}"`,
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `E_NAKO_Wallet_Statement_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Official Account Statement CSV downloaded successfully.");
  };

  const getStatusBadgeVariant = (status: (typeof activities)[0]["status"]) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
      case "Processing":
        return "warning";
      case "Failed":
      default:
        return "danger";
    }
  };

  return (
    <div className="space-y-6 select-none font-sans">
      <PageHeader
        title="Wallet & Statements"
        subtitle="Complete accounting ledger of your XAF balances, deposits, and withdrawal disbursements"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCsv}
              className="border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 h-9"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Statement</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setActiveNav("buy-xaf")}
              className="bg-[#001f5b] hover:bg-[#001744] text-white flex items-center gap-1.5 h-9"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Fund Account</span>
            </Button>
          </div>
        }
      />

      {/* ── 1. BALANCE SUMMARY CARDS WITH BRAND PALETTE ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Ledger Balance */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Ledger Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#001f5b]/10 text-[#001f5b] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            {formatMoney(wallet.balance, "XAF")}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            Audited double-entry ledger balance
          </span>
        </div>

        {/* Available Balance */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Available Float
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#001f5b]/10 text-[#001f5b] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            {formatMoney(wallet.available, "XAF")}
          </div>
          <span className="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00c2c7]" />
            Liquid for instant mobile money payouts
          </span>
        </div>

        {/* Held Amount in Escrow */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Held in Escrow
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-700 font-mono tracking-tight">
            {formatMoney(wallet.held, "XAF")}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            Pending settlement clearing holds
          </span>
        </div>
      </div>

      {/* ── 2. DEDICATED BEAC ESCROW CLEARING WIRE DETAILS ── */}
      <Card className="border-slate-200/90 bg-white rounded-2xl shadow-2xs overflow-hidden">
        <CardHeader className="bg-slate-50/80 border-b border-slate-200/80 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#001f5b]" />
              <CardTitle className="text-sm font-bold text-slate-900">
                Official Settlement Account Details (Inward Wires)
              </CardTitle>
            </div>
            <span className="text-xs font-mono text-[#006e72] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00c2c7]" />
              CEMAC Clearing Corridor
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] font-sans font-bold uppercase tracking-wider">
                  Bank Name
                </span>
                <span className="font-bold text-slate-900">
                  Afriland First Bank
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy("Afriland First Bank", "Bank Name")}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {copiedField === "Bank Name" ? (
                  <CheckCircle2 className="w-4 h-4 text-[#00c2c7]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] font-sans font-bold uppercase tracking-wider">
                  Account Number (RIB)
                </span>
                <span className="font-bold text-slate-900">
                  10005 00001 02384910283 45
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy("10005 00001 02384910283 45", "RIB")}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {copiedField === "RIB" ? (
                  <CheckCircle2 className="w-4 h-4 text-[#00c2c7]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] font-sans font-bold uppercase tracking-wider">
                  SWIFT / BIC
                </span>
                <span className="font-bold text-slate-900">AFRICMCA</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy("AFRICMCA", "SWIFT")}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {copiedField === "SWIFT" ? (
                  <CheckCircle2 className="w-4 h-4 text-[#00c2c7]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] font-sans font-bold uppercase tracking-wider">
                  Beneficiary Entity
                </span>
                <span className="font-bold text-slate-900">
                  E NAKO COMPANY PLC
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy("E NAKO COMPANY PLC", "Beneficiary")}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {copiedField === "Beneficiary" ? (
                  <CheckCircle2 className="w-4 h-4 text-[#00c2c7]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 3. TRANSACTIONAL STATEMENT TABLE ── */}
      <Card className="border-slate-200/90 shadow-2xs rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-100 p-5 sm:p-6 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Audited Accounting Statement ({filteredActivities.length})
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Double-entry ledger records formatted using BEAC/CEMAC spacing
                standards
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadCsv}
                className="h-8 text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5 mr-1 text-slate-500" />
                CSV Export
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-4">
          {/* Filter Row */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-4 text-xs font-sans">
            <div>
              <label className="block text-slate-500 uppercase font-semibold text-[10px] mb-1">
                Time Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-8 px-2.5 bg-white border border-slate-300 rounded-lg text-xs"
              >
                <option value="ALL">All Recorded Activity</option>
                <option value="THIS_MONTH">This Month (October 2026)</option>
                <option value="LAST_30">Last 30 Days</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 uppercase font-semibold text-[10px] mb-1">
                Direction
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-8 px-2.5 bg-white border border-slate-300 rounded-lg text-xs"
              >
                <option value="ALL">All Directions (+ / −)</option>
                <option value="IN">Inward Deposits (+)</option>
                <option value="OUT">Outward Withdrawals (−)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 uppercase font-semibold text-[10px] mb-1">
                Settlement Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 px-2.5 bg-white border border-slate-300 rounded-lg text-xs"
              >
                <option value="ALL">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Statement Table */}
          <div className="overflow-x-auto border border-slate-200/90 rounded-xl">
            <table className="w-full text-left text-sm font-mono">
              <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Posting Date</th>
                  <th className="py-3 px-6 font-sans">Transaction Details</th>
                  <th className="py-3 px-6 text-right">
                    Debit / Credit Amount
                  </th>
                  <th className="py-3 px-6 text-right">Running Balance</th>
                  <th className="py-3 px-6 font-sans text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredActivities.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-6 text-slate-600 font-sans">
                      {tx.date}
                    </td>
                    <td className="py-3.5 px-6 font-sans font-semibold text-slate-900">
                      {tx.description}
                    </td>
                    <td
                      className={`py-3.5 px-6 text-right font-bold text-sm ${
                        tx.direction === "in"
                          ? "text-[#006e72]"
                          : "text-slate-900"
                      }`}
                    >
                      {tx.amountFormatted}
                    </td>
                    <td className="py-3.5 px-6 text-right text-slate-500">
                      {tx.runningBalance}
                    </td>
                    <td className="py-3.5 px-6 font-sans text-center">
                      <Badge variant={getStatusBadgeVariant(tx.status)}>
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
