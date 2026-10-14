import React from 'react'
import { Info, ArrowUpRight, ArrowDownRight, X } from 'lucide-react'

export interface MetricTileProps {
  id: string
  title: string
  tooltip?: string
  value: string
  comparisonValue?: string
  trend?: 'up' | 'down' | 'neutral'
  trendPercent?: string
  updatedAt?: string
  chartData?: number[]
  emptyChart?: boolean
  isEditing?: boolean
  onRemove?: () => void
  onMoreDetails?: () => void
}

export const MetricTile: React.FC<MetricTileProps> = ({
  title,
  tooltip,
  value,
  comparisonValue,
  trend = 'up',
  trendPercent,
  updatedAt = 'Updated 4m ago',
  chartData,
  emptyChart = false,
  isEditing = false,
  onRemove,
  onMoreDetails,
}) => {
  return (
    <div className="relative bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4">
      {/* Edit Mode Remove Button */}
      {isEditing && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-2 -right-2 p-1 rounded-full bg-rose-500 text-white shadow-md hover:bg-rose-600 transition-colors z-10 cursor-pointer"
          title="Remove tile"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Top Title & Info Tooltip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5 group relative">
          <span className="text-xs font-semibold text-slate-700">{title}</span>
          {tooltip && (
            <div className="relative flex items-center">
              <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 cursor-pointer" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-[11px] rounded-md shadow-lg z-20 pointer-events-none">
                {tooltip}
              </div>
            </div>
          )}
        </div>
        <span className="text-[10px] text-slate-400 font-mono">{updatedAt}</span>
      </div>

      {/* Big Number & Comparison */}
      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
          {value}
        </div>
        {(comparisonValue || trendPercent) && (
          <div className="flex items-center space-x-1.5 text-xs">
            {trendPercent && (
              <span
                className={`font-semibold font-mono flex items-center ${
                  trend === 'up'
                    ? 'text-[#001f5b]'
                    : trend === 'down'
                      ? 'text-rose-700'
                      : 'text-slate-500'
                }`}
              >
                {trend === 'up' ? (
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                ) : trend === 'down' ? (
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                ) : null}
                {trendPercent}
              </span>
            )}
            {comparisonValue && <span className="text-slate-400 font-mono">{comparisonValue}</span>}
          </div>
        )}
      </div>

      {/* Sparkline / Chart or Stripe-style Dashed Empty Box */}
      <div className="pt-1">
        {emptyChart || !chartData || chartData.length === 0 ? (
          <div className="h-16 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center text-[11px] text-slate-400 font-mono">
            No data for current period
          </div>
        ) : (
          <div className="h-16 w-full flex items-end space-x-1 pt-2">
            {chartData.map((val, idx) => {
              const max = Math.max(...chartData)
              const heightPercent = max > 0 ? (val / max) * 100 : 10
              return (
                <div
                  key={idx}
                  className="flex-1 bg-slate-100 rounded-xs overflow-hidden h-full flex items-end"
                >
                  <div
                    className="w-full bg-[#001f5b]/80 hover:bg-[#001f5b] transition-colors rounded-xs"
                    style={{ height: `${Math.max(8, heightPercent)}%` }}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={onMoreDetails}
          className="text-xs font-semibold text-slate-600 hover:text-[#001f5b] underline underline-offset-2 cursor-pointer"
        >
          More details
        </button>
      </div>
    </div>
  )
}
