"use client";

import React from "react";
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
import { EmptyState } from "@/components/ui/empty-state";
import { useCustomer } from "@/mock/CustomerContext";
import { ArrowUpRight, Wallet, Layers, CreditCard, Edit3 } from "lucide-react";
import { toast } from "sonner";

export const DashboardPage: React.FC = () => {
  const { wallet, activities, setActiveNav, user } = useCustomer();

  const pendingCount = activities.filter(
    (a) => a.status === "Pending" || a.status === "Processing",
  ).length;
  const totalSentThisMonth = activities
    .filter((a) => a.direction === "out" && a.status === "Completed")
    .reduce((sum, a) => sum + a.amountNumeric, 0);
  const totalReceivedThisMonth = activities
    .filter((a) => a.direction === "in" && a.status === "Completed")
    .reduce((sum, a) => sum + a.amountNumeric, 0);

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
    <div className="space-y-6 font-sans">
      {/* ── 1. ORGANIZATION SUMMARY (enako-os Style) ── */}
      <div className="pb-5 border-b border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Organization Brand & Web Address */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="w-14 h-14 rounded-lg border border-slate-200/90 p-1 flex items-center justify-center bg-white shadow-2xs shrink-0">
            <div className="w-full h-full bg-[#001f5b] rounded text-white font-extrabold flex items-center justify-center text-xs tracking-wider">
              E-NAKO
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
              E NAKO COMPANY PLC
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              www.enakoos.com • Customer Treasury Portal
            </p>
          </div>
        </div>

        {/* Middle: Key Organization Metadata Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 flex-1 max-w-xl">
          <div>
            <p className="text-xs text-slate-500 font-normal">Account Holder</p>
            <p className="text-xs font-bold text-slate-800">
              {user.name} ({user.email})
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-normal">Plan</p>
            <p className="text-xs font-bold text-[#001f5b]">
              Tier 3 Corporate Settlement
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-normal">
              Escrow Guarantee
            </p>
            <p className="text-xs font-bold text-emerald-700">
              100% Backed by Cash Reserves
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-normal">Daily Limit</p>
            <p className="text-xs font-bold text-slate-800">
              25,000,000 XAF Daily Turnover
            </p>
          </div>
        </div>

        {/* Right: Quick Action Pencil */}
        <button
          type="button"
          onClick={() => toast.success("Customer account profile verified")}
          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
          title="Edit Details"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      <PageHeader
        title="Customer Dashboard"
        subtitle="Manage your Central African CFA Francs (XAF) wallet, buy currency, and monitor transfer statuses"
        action={
          <Button
            variant="default"
            size="sm"
            onClick={() => setActiveNav("buy-xaf")}
          >
            Buy XAF
          </Button>
        }
      />

      {/* ── 2. TOP METRIC CARDS WITH COLORED BOTTOM ACCENT (enako-os signature pattern) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Red Bottom Accent — This Month Sent */}
        <div className="bg-white border border-slate-200/90 border-b-[3px] border-b-rose-500 rounded-lg p-4 shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">
              THIS MONTH SENT
            </p>
            <p className="text-2xl font-bold text-slate-900 leading-tight font-mono">
              {totalSentThisMonth > 0
                ? `-${totalSentThisMonth.toLocaleString()}`
                : "0"}{" "}
              <span className="text-xs font-sans text-slate-500">XAF</span>
            </p>
          </div>
        </div>

        {/* Card 2: Green Bottom Accent — This Month Received */}
        <div className="bg-white border border-slate-200/90 border-b-[3px] border-b-emerald-500 rounded-lg p-4 shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">
              THIS MONTH RECEIVED
            </p>
            <p className="text-2xl font-bold text-slate-900 leading-tight font-mono">
              +{totalReceivedThisMonth.toLocaleString()}{" "}
              <span className="text-xs font-sans text-slate-500">XAF</span>
            </p>
          </div>
        </div>

        {/* Card 3: Oxford Navy #001f5b Bottom Accent — Available Funds */}
        <div className="bg-white border border-slate-200/90 border-b-[3px] border-b-[#001f5b] rounded-lg p-4 shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#001f5b]/10 flex items-center justify-center text-[#001f5b] shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">
              AVAILABLE FUNDS
            </p>
            <p className="text-2xl font-bold text-slate-900 leading-tight font-mono">
              {wallet.available.toLocaleString()}{" "}
              <span className="text-xs font-sans text-slate-500">XAF</span>
            </p>
          </div>
        </div>

        {/* Card 4: Amber Bottom Accent — Pending Transactions */}
        <div className="bg-white border border-slate-200/90 border-b-[3px] border-b-amber-500 rounded-lg p-4 shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">
              PENDING TRANSACTIONS
            </p>
            <p className="text-2xl font-bold text-slate-900 leading-tight font-mono">
              {pendingCount}{" "}
              <span className="text-xs font-sans text-amber-700">
                In Verification
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Large Wallet Balance Card */}
      <Card className="border-slate-200/90 bg-white shadow-2xs rounded-lg overflow-hidden">
        <div className="bg-slate-50/80 border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#001f5b] bg-[#001f5b]/10 px-2.5 py-0.5 rounded">
              Primary Wallet
            </span>
            <span className="text-xs text-slate-500 font-mono">
              CEMAC Regional Currency
            </span>
          </div>
          <span className="text-xs text-emerald-700 font-semibold font-mono">
            100% Backed by Cash Escrow
          </span>
        </div>

        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Total Ledger Balance
            </span>
            <div className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-mono">
              {wallet.balance.toLocaleString()}{" "}
              <span className="text-2xl text-slate-500 font-sans font-bold">
                XAF
              </span>
            </div>

            {/* Available vs Held Breakdown */}
            <div className="flex items-center space-x-6 pt-2 text-xs font-mono">
              <div>
                <span className="text-slate-400 block font-sans">
                  Available Payout Funds:
                </span>
                <span className="font-bold text-emerald-800 text-sm">
                  {wallet.available.toLocaleString()} XAF
                </span>
              </div>
              {wallet.held > 0 && (
                <div>
                  <span className="text-slate-400 block font-sans">
                    Held in Escrow:
                  </span>
                  <span className="font-bold text-amber-700 text-sm">
                    {wallet.held.toLocaleString()} XAF
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions on the Card */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="default"
              size="lg"
              onClick={() => setActiveNav("buy-xaf")}
              className="px-6 h-11 text-xs font-bold uppercase tracking-wider"
            >
              Buy XAF
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setActiveNav("send-withdraw")}
              className="px-6 h-11 text-xs font-bold uppercase tracking-wider"
            >
              Send / Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Table */}
      <Card className="border-slate-200/90 shadow-2xs rounded-lg">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Recent Activity ({activities.length})
              </CardTitle>
              <CardDescription className="mt-0.5 text-xs text-slate-500">
                Real-time statement feed of deposits, conversions, and mobile
                money payouts
              </CardDescription>
            </div>
            <button
              type="button"
              onClick={() => setActiveNav("wallet")}
              className="text-xs text-[#001f5b] hover:text-[#001744] font-semibold cursor-pointer underline"
            >
              View Full Statement
            </button>
          </div>
        </CardHeader>

        {activities.length === 0 ? (
          <EmptyState
            title="No transactions recorded yet."
            description="Start by purchasing CFA Francs via international bank transfer."
            actionLabel="Buy XAF"
            onAction={() => setActiveNav("buy-xaf")}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Date & Time</th>
                  <th className="py-3 px-6">Description</th>
                  <th className="py-3 px-6 text-right">Amount</th>
                  <th className="py-3 px-6 text-right">Running Balance</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {activities.map((tx) => (
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
                          ? "text-emerald-700"
                          : "text-slate-900"
                      }`}
                    >
                      {tx.amountFormatted}
                    </td>
                    <td className="py-3.5 px-6 text-right text-slate-500">
                      {tx.runningBalance}
                    </td>
                    <td className="py-3.5 px-6 font-sans">
                      <Badge variant={getStatusBadgeVariant(tx.status)}>
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
