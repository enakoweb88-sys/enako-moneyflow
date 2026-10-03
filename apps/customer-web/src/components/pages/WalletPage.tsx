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
import { toast } from "sonner";

export const WalletPage: React.FC = () => {
  const { wallet, activities, setActiveNav } = useCustomer();

  const [dateFilter, setDateFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

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
    <div className="space-y-6">
      <PageHeader
        title="Wallet & Statements"
        subtitle="Complete accounting ledger of your XAF balances, deposits, and withdrawal disbursements"
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

      {/* Balance Summary Card */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Total Ledger Balance
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">
                {wallet.balance.toLocaleString()}{" "}
                <span className="text-base text-slate-500 font-sans font-semibold">
                  XAF
                </span>
              </div>
              <span className="text-xs text-slate-400 mt-1 block">
                Full legal ledger value
              </span>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-xs font-semibold text-emerald-900 uppercase tracking-wider block">
                Available Balance
              </span>
              <div className="text-3xl font-extrabold text-emerald-800 mt-2 font-mono">
                {wallet.available.toLocaleString()}{" "}
                <span className="text-base text-emerald-700 font-sans font-semibold">
                  XAF
                </span>
              </div>
              <span className="text-xs text-emerald-700 mt-1 block">
                Ready for instant mobile cashout
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Held Amount in Escrow
              </span>
              <div className="text-3xl font-extrabold text-slate-700 mt-2 font-mono">
                {wallet.held.toLocaleString()}{" "}
                <span className="text-base text-slate-400 font-sans font-semibold">
                  XAF
                </span>
              </div>
              <span className="text-xs text-slate-400 mt-1 block">
                Pending settlement holds
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statement Table Section */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">
                Transactional Statement ({filteredActivities.length})
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Every credit and debit reflects verified double-entry ledger
                postings
              </CardDescription>
            </div>

            {/* Download Statement Action */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleDownloadCsv}>
                Download Statement (CSV)
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {/* Filter Row */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center gap-4 text-xs font-sans">
            <div>
              <label className="block text-slate-500 uppercase font-semibold mb-1">
                Time Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-9 px-3 bg-white border border-slate-300 rounded-md font-sans"
              >
                <option value="ALL">All Recorded Activity</option>
                <option value="THIS_MONTH">This Month (October 2026)</option>
                <option value="LAST_30">Last 30 Days</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 uppercase font-semibold mb-1">
                Direction
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-9 px-3 bg-white border border-slate-300 rounded-md font-sans"
              >
                <option value="ALL">All Directions (+ / −)</option>
                <option value="IN">Inward Deposits (+)</option>
                <option value="OUT">Outward Withdrawals (−)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 uppercase font-semibold mb-1">
                Settlement Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 bg-white border border-slate-300 rounded-md font-sans"
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
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-sm font-mono">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Posting Date</th>
                  <th className="py-3 px-6 font-sans">Transaction Details</th>
                  <th className="py-3 px-6 text-right">
                    Debit / Credit Amount
                  </th>
                  <th className="py-3 px-6 text-right">Running Balance</th>
                  <th className="py-3 px-6 font-sans">Status</th>
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
        </CardContent>
      </Card>
    </div>
  );
};
