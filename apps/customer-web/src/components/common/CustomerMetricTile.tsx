"use client";

import React from "react";
import { Info } from "lucide-react";

export interface CustomerMetricTileProps {
  id: string;
  title: string;
  tooltip?: string;
  value: string;
  comparisonValue?: string;
  trend?: "up" | "down" | "flat";
  trendPercent?: string;
  chartData?: number[];
  isEditing?: boolean;
  onRemove?: (id: string) => void;
}

export const CustomerMetricTile: React.FC<CustomerMetricTileProps> = ({
  id,
  title,
  tooltip,
  value,
  comparisonValue,
  trend,
  trendPercent,
  chartData,
  isEditing,
  onRemove,
}) => {
  // Generate SVG sparkline from chartData
  const renderSparkline = () => {
    if (!chartData || chartData.length < 2) return null;

    const width = 120;
    const height = 32;
    const max = Math.max(...chartData);
    const min = Math.min(...chartData);
    const range = max - min || 1;

    const points = chartData
      .map((val, i) => {
        const x = (i / (chartData.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(" ");

    const color = trend === "down" ? "#e11d48" : "#00c2c7";

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-28 h-8 mt-1">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="relative bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-colors space-y-2">
      {isEditing && onRemove && (
        <button
          type="button"
          onClick={() => onRemove(id)}
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center text-xs font-bold transition-colors"
          aria-label="Remove tile"
        >
          ×
        </button>
      )}

      <div className="flex items-center space-x-1.5">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {tooltip && (
          <span className="group relative cursor-help">
            <Info className="w-3 h-3 text-slate-400" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-800 text-white text-[10px] rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {tooltip}
            </span>
          </span>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-lg font-extrabold text-slate-900 font-mono tracking-tight">
            {value}
          </div>
          {comparisonValue && (
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              {comparisonValue}
            </div>
          )}
          {trendPercent && (
            <span
              className={`text-[11px] font-mono font-bold ${
                trend === "down"
                  ? "text-rose-600"
                  : trend === "up"
                    ? "text-[#00898d]"
                    : "text-slate-500"
              }`}
            >
              {trendPercent}
            </span>
          )}
        </div>
        {renderSparkline()}
      </div>
    </div>
  );
};
