"use client";

import React, { useState, useMemo } from "react";
import { Search, X, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface TransactionListTab {
  id: string;
  label: string;
  count?: number;
}

export interface TransactionListItem {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: "Completed" | "Pending" | "Failed" | "Processing" | "Reversed";
  channel?: string;
  reference?: string;
}

export interface TransactionListTemplateProps {
  title: string;
  subtitle?: string;
  tabs: TransactionListTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  statusFilters: string[];
  activeStatus: string;
  onStatusChange: (status: string) => void;
  items: TransactionListItem[];
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
}

export const TransactionListTemplate: React.FC<
  TransactionListTemplateProps
> = ({
  title,
  subtitle,
  tabs,
  activeTab,
  onTabChange,
  statusFilters,
  activeStatus,
  onStatusChange,
  items,
  searchPlaceholder = "Search by reference...",
  emptyTitle = "No transactions yet",
  emptyDescription = "When you make your first transfer, it will appear here.",
  emptyActionLabel,
  onEmptyAction,
  primaryActionLabel,
  onPrimaryAction,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchStatus =
        activeStatus === "All" || item.status === activeStatus;
      const matchSearch =
        searchQuery.trim() === "" ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [items, activeStatus, searchQuery]);

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const getStatusBadgeVariant = (status: TransactionListItem["status"]) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
      case "Processing":
        return "warning";
      case "Failed":
        return "danger";
      case "Reversed":
        return "info";
      default:
        return "neutral";
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {primaryActionLabel && onPrimaryAction && (
          <Button variant="default" size="sm" onClick={onPrimaryAction}>
            {primaryActionLabel}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <div className="flex space-x-0 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                onTabChange(tab.id);
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#001f5b] text-[#001f5b] font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1.5 text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter Chips + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => {
                onStatusChange(status);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                activeStatus === status
                  ? "bg-[#001f5b] text-white border-[#001f5b]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-8 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001f5b]/20 focus:border-[#001f5b]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table or Empty State */}
      {paginatedItems.length === 0 ? (
        <div className="py-16 text-center space-y-3 border border-slate-200 rounded-xl bg-white">
          <div className="w-12 h-12 rounded-lg border border-slate-200 mx-auto flex items-center justify-center bg-slate-50">
            <Inbox className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">{emptyTitle}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {emptyDescription}
          </p>
          {emptyActionLabel && onEmptyAction && (
            <button
              type="button"
              onClick={onEmptyAction}
              className="text-xs font-semibold text-[#001f5b] hover:underline cursor-pointer"
            >
              {emptyActionLabel}
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  {items.some((i) => i.reference) && (
                    <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Reference
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium">
                      {item.description}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                      {item.amount}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadgeVariant(item.status)}>
                        {item.status}
                      </Badge>
                    </td>
                    {items.some((i) => i.reference) && (
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                        {item.reference || "—"}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">
                Showing {(currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, filteredItems.length)} of{" "}
                {filteredItems.length}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-1 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
