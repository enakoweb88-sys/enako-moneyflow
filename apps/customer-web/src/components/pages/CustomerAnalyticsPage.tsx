"use client";

import React, { useState } from "react";
import {
  CustomerMetricTile,
  type CustomerMetricTileProps,
} from "@/components/common/CustomerMetricTile";
import { Button } from "@/components/ui/button";
import { Plus, X, Check, TrendingUp, BarChart3, Filter } from "lucide-react";

const DEFAULT_TILES: CustomerMetricTileProps[] = [
  {
    id: "total_sent",
    title: "Total Sent",
    tooltip: "Total XAF disbursed to beneficiaries this period.",
    value: "1 245 000 XAF",
    comparisonValue: "vs 980 000 XAF prev",
    trend: "up",
    trendPercent: "+27.0%",
    chartData: [40, 52, 48, 65, 58, 72, 80, 85, 95],
  },
  {
    id: "total_received",
    title: "Total Received",
    tooltip: "Total inward remittances credited to your wallet.",
    value: "3 260 106 XAF",
    comparisonValue: "vs 2 800 000 XAF prev",
    trend: "up",
    trendPercent: "+16.4%",
    chartData: [55, 60, 58, 70, 75, 82, 90, 88, 96],
  },
  {
    id: "fees_paid",
    title: "Fees Paid",
    tooltip: "Total commissions and transfer fees deducted.",
    value: "18 750 XAF",
    comparisonValue: "vs 15 200 XAF prev",
    trend: "up",
    trendPercent: "+23.4%",
    chartData: [10, 12, 11, 14, 13, 16, 15, 18, 19],
  },
  {
    id: "avg_transfer",
    title: "Avg Transfer Size",
    tooltip: "Average amount per outbound transfer.",
    value: "207 500 XAF",
    comparisonValue: "vs 196 000 XAF prev",
    trend: "up",
    trendPercent: "+5.9%",
    chartData: [180, 190, 195, 200, 205, 210, 208, 215, 207],
  },
  {
    id: "favorite_corridor",
    title: "Favorite Corridor",
    value: "EUR → XAF",
    comparisonValue: "78% of volume",
    trend: "flat",
  },
  {
    id: "failed_rate",
    title: "Failed Tx Rate",
    tooltip: "Percentage of transactions that failed or were reversed.",
    value: "0.0%",
    comparisonValue: "vs 1.2% prev",
    trend: "down",
    trendPercent: "-1.2%",
    chartData: [3, 2, 1.5, 1, 0.5, 0.2, 0, 0, 0],
  },
];

const AVAILABLE_TILES = [
  { id: "total_beneficiaries", title: "Active Beneficiaries", value: "4" },
  { id: "wallet_balance", title: "Current Balance", value: "3 450 000 XAF" },
  { id: "monthly_volume", title: "Monthly Volume", value: "4 505 106 XAF" },
];

export const CustomerAnalyticsPage: React.FC = () => {
  const [tiles, setTiles] = useState<CustomerMetricTileProps[]>(DEFAULT_TILES);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [dateRange, setDateRange] = useState("Last 7 days");
  const [granularity, setGranularity] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");

  const removeTile = (id: string) => {
    setTiles((prev) => prev.filter((t) => t.id !== id));
  };

  const addTile = (tileId: string) => {
    const found = AVAILABLE_TILES.find((t) => t.id === tileId);
    if (found && !tiles.find((t) => t.id === found.id)) {
      setTiles((prev) => [
        ...prev,
        {
          id: found.id,
          title: found.title,
          value: found.value,
          trend: "flat" as const,
        },
      ]);
    }
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Financial Treasury Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Institutional cashflow velocity, remittance volumes, and corridor
            analytics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#001f5b]"
          >
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Year to date</option>
          </select>

          {/* Granularity */}
          <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200">
            {(["daily", "weekly", "monthly"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGranularity(g)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                  granularity === g
                    ? "bg-white text-[#001f5b] shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>

          {/* Edit / Add */}
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className={`rounded-xl ${isEditing ? "bg-[#001f5b] text-white" : ""}`}
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1" />
                <span>Done</span>
              </>
            ) : (
              <span>Edit layout</span>
            )}
          </Button>

          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="rounded-xl"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add metric</span>
            </Button>
          )}
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map((tile) => (
          <CustomerMetricTile
            key={tile.id}
            {...tile}
            isEditing={isEditing}
            onRemove={removeTile}
          />
        ))}
      </div>

      {tiles.length === 0 && (
        <div className="py-16 text-center space-y-3 border border-slate-200 rounded-2xl bg-white">
          <h3 className="text-sm font-bold text-slate-900">
            No metrics displayed
          </h3>
          <p className="text-xs text-slate-500">
            Click &ldquo;Edit layout&rdquo; and then &ldquo;Add metric&rdquo; to
            add tiles.
          </p>
        </div>
      )}

      {/* Add Tile Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-[1px] animate-in fade-in duration-100">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4 animate-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Add metric tile
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {AVAILABLE_TILES.filter(
                (at) => !tiles.find((t) => t.id === at.id),
              ).map((at) => (
                <button
                  key={at.id}
                  type="button"
                  onClick={() => addTile(at.id)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-[#001f5b] hover:bg-[#001f5b]/5 transition-colors cursor-pointer text-xs"
                >
                  <span className="font-semibold text-slate-800">
                    {at.title}
                  </span>
                  <span className="text-slate-400 ml-2 font-mono">
                    {at.value}
                  </span>
                </button>
              ))}
              {AVAILABLE_TILES.filter(
                (at) => !tiles.find((t) => t.id === at.id),
              ).length === 0 && (
                <p className="text-xs text-slate-500 text-center py-4">
                  All available tiles are already displayed.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
