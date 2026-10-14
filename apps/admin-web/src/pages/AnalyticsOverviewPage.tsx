import React, { useState } from 'react'
import { Plus, Sliders, Calendar, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MetricTile, type MetricTileProps } from '@/components/common/MetricTile'

interface AnalyticsOverviewPageProps {
  onNavigate: (navId: string) => void
}

const DEFAULT_TILES: MetricTileProps[] = [
  {
    id: 'remittance_volume',
    title: 'Remittance Gross Volume',
    tooltip: 'Total foreign currency converted and credited into XAF wallets.',
    value: 'XAF 84.25M',
    comparisonValue: 'vs XAF 71.10M prev',
    trend: 'up',
    trendPercent: '+18.5%',
    chartData: [45, 52, 48, 60, 58, 65, 70, 72, 84],
  },
  {
    id: 'withdrawal_volume',
    title: 'Mobile Money Disbursements',
    tooltip: 'Net payouts dispatched to MTN MoMo and Orange Money wallets.',
    value: 'XAF 42.10M',
    comparisonValue: 'vs XAF 38.90M prev',
    trend: 'up',
    trendPercent: '+8.2%',
    chartData: [30, 32, 28, 35, 34, 40, 38, 41, 42],
  },
  {
    id: 'fee_income',
    title: 'Net Platform Fee Income',
    tooltip: 'Total commission and corridor interchange fees collected.',
    value: 'XAF 1.84M',
    comparisonValue: 'vs XAF 1.64M prev',
    trend: 'up',
    trendPercent: '+12.0%',
    chartData: [1.2, 1.3, 1.25, 1.5, 1.4, 1.6, 1.7, 1.8, 1.84],
  },
  {
    id: 'failed_transactions',
    title: 'Failed Payouts',
    tooltip: 'Transfers halted due to recipient wallet limits or operator downtime.',
    value: '8 Items',
    comparisonValue: 'vs 11 items prev',
    trend: 'down',
    trendPercent: '-27.3%',
    chartData: [5, 4, 6, 8, 3, 2, 4, 3, 2],
  },
  {
    id: 'new_customers',
    title: 'New Customer Registrations',
    tooltip: 'Verified individual senders and commercial business accounts.',
    value: '142',
    comparisonValue: 'vs 123 prev',
    trend: 'up',
    trendPercent: '+15.4%',
    chartData: [12, 14, 11, 16, 15, 18, 17, 19, 20],
  },
  {
    id: 'recon_match_rate',
    title: 'Reconciliation Match Rate',
    tooltip: 'Percentage of statements matched without human intervention.',
    value: '99.4%',
    comparisonValue: 'vs 99.1% prev',
    trend: 'up',
    trendPercent: '+0.3%',
    chartData: [98.8, 99.0, 99.1, 99.2, 99.1, 99.3, 99.4, 99.4, 99.4],
  },
  {
    id: 'approval_turnaround',
    title: 'Median Approval Turnaround',
    tooltip: 'Time elapsed between Maker submission and Checker signature.',
    value: '4.2 mins',
    comparisonValue: 'vs 5.3 mins prev',
    trend: 'down',
    trendPercent: '-20.7%',
    chartData: [6.2, 5.8, 5.5, 5.2, 5.0, 4.8, 4.5, 4.3, 4.2],
  },
  {
    id: 'top_commercial_entity',
    title: 'Top Commercial Counterparty',
    tooltip: 'Highest clearing volume client in the selected date window.',
    value: 'Kribi Cocoa',
    comparisonValue: 'XAF 25M cleared',
    emptyChart: true,
  },
]

export const AnalyticsOverviewPage: React.FC<AnalyticsOverviewPageProps> = ({ onNavigate }) => {
  const [tiles, setTiles] = useState<MetricTileProps[]>(DEFAULT_TILES)
  const [isEditing, setIsEditing] = useState(false)
  const [dateRange, setDateRange] = useState('Last 7 days')
  const [granularity, setGranularity] = useState('Daily')
  const [compareEnabled, setCompareEnabled] = useState(true)
  const [showAddTileModal, setShowAddTileModal] = useState(false)

  const handleRemoveTile = (id: string) => {
    setTiles((prev) => prev.filter((t) => t.id !== id))
  }

  const handleResetTiles = () => {
    setTiles(DEFAULT_TILES)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-150">
      {/* ── Page Header & Controls Bar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Overview</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time analytics and performance metrics across your payment and settlement network.
          </p>
        </div>

        {/* Controls: Date Range, Granularity, Compare, Add/Edit Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Selector */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 outline-hidden cursor-pointer"
            >
              <option>Today</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>

          {/* Granularity Selector */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs shadow-2xs">
            <span className="text-slate-400 mr-1.5">Interval:</span>
            <select
              value={granularity}
              onChange={(e) => setGranularity(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 outline-hidden cursor-pointer"
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>

          {/* Compare Toggle */}
          <button
            type="button"
            onClick={() => setCompareEnabled(!compareEnabled)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              compareEnabled
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Compare: Prev Period
          </button>

          {/* Add / Edit Tiles Customization Buttons */}
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetTiles}
                className="text-xs h-8 border-slate-300"
              >
                Reset layout
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="bg-[#001f5b] hover:bg-[#001f5b] text-white text-xs h-8 font-semibold flex items-center space-x-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Done</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs flex items-center space-x-1 h-8"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit tiles</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddTileModal(true)}
                className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs flex items-center space-x-1 h-8"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500" />
                <span>Add tile</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Active Customization Notice ── */}
      {isEditing && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between animate-in fade-in duration-150">
          <span>
            <strong>Customizing layout:</strong> Click the red <strong>X</strong> on any tile to
            hide it from your dashboard view.
          </span>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="font-bold underline hover:text-amber-950"
          >
            Finish editing
          </button>
        </div>
      )}

      {/* ── Metric Tiles Responsive Grid (Section 10) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiles.map((tile) => (
          <MetricTile
            key={tile.id}
            {...tile}
            isEditing={isEditing}
            onRemove={() => handleRemoveTile(tile.id)}
            onMoreDetails={() => onNavigate('reporting')}
          />
        ))}
      </div>

      {/* ── Add Tile Modal ── */}
      {showAddTileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Metric Tile</h3>
              <button
                type="button"
                onClick={() => setShowAddTileModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Select an analytics tile to pin to your customized overview dashboard:
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {DEFAULT_TILES.map((t) => {
                const isAlreadyPresent = tiles.some((existing) => existing.id === t.id)
                return (
                  <div
                    key={t.id}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                      isAlreadyPresent
                        ? 'border-slate-100 bg-slate-50 text-slate-400'
                        : 'border-slate-200 hover:border-slate-400 cursor-pointer text-slate-800'
                    }`}
                    onClick={() => {
                      if (!isAlreadyPresent) {
                        setTiles((prev) => [...prev, t])
                        setShowAddTileModal(false)
                      }
                    }}
                  >
                    <div>
                      <div className="font-semibold">{t.title}</div>
                      <div className="text-[10px] text-slate-400">{t.tooltip}</div>
                    </div>
                    {isAlreadyPresent ? (
                      <span className="text-[10px] font-mono uppercase text-slate-400">Added</span>
                    ) : (
                      <Button variant="outline" size="sm" className="text-[11px] h-6 px-2">
                        + Pin
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
