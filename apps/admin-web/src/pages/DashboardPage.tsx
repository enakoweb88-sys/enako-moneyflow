import React, { useState } from 'react'
import { ArrowUpRight, CheckCircle2, ChevronRight, X, Sparkles, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SetupGuide } from '@/components/common/SetupGuide'
import { MetricTile } from '@/components/common/MetricTile'

interface DashboardPageProps {
  onNavigate: (navId: string) => void
  showSetupGuide?: boolean
  onToggleSetupGuide?: () => void
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  showSetupGuide = true,
  onToggleSetupGuide,
}) => {
  const [comparisonPeriod, setComparisonPeriod] = useState('Yesterday')
  const [showRecommendations, setShowRecommendations] = useState(true)

  // Hourly volume data points for today chart
  const hourlyData = [
    { hour: '12 AM', val: 1.2 },
    { hour: '3 AM', val: 0.8 },
    { hour: '6 AM', val: 2.5 },
    { hour: '9 AM', val: 8.4 },
    { hour: '12 PM', val: 14.8 },
    { hour: '3 PM', val: 22.4 },
    { hour: '6 PM', val: 19.1 },
    { hour: '9 PM', val: 15.0 },
  ]

  // Chart coordinates
  const svgWidth = 640
  const svgHeight = 180
  const paddingX = 30
  const paddingY = 25
  const maxVal = 25

  const points = hourlyData
    .map((d, i) => {
      const x = paddingX + (i / (hourlyData.length - 1)) * (svgWidth - 2 * paddingX)
      const y = svgHeight - paddingY - (d.val / maxVal) * (svgHeight - 2 * paddingY)
      return `${x},${y}`
    })
    .join(' ')

  const areaPoints = `${paddingX},${svgHeight - paddingY} ${points} ${
    svgWidth - paddingX
  },${svgHeight - paddingY}`

  return (
    <div className="space-y-10 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-150">
      {/* ── Page Header: "Today" & Top-Right Primary Action ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Today</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-mono">
            Saturday, Oct 3, 2026 • Live CEMAC Clearing Core
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('reports')}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center space-x-1.5 h-8.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export ledger</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => onNavigate('reconciliation')}
            className="bg-[#001f5b] hover:bg-[#001744] text-white text-xs font-semibold flex items-center space-x-1.5 h-8.5 shadow-2xs"
          >
            <span>Run reconciliation</span>
          </Button>
        </div>
      </div>

      {/* ── Main Two-Column Layout (Matches Stripe Reference Images 11 & 12) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Headline Metric Block + Chart + Summary Rows */}
        <div className="lg:col-span-8 space-y-6">
          {/* Headline Metric Card with SVG Sparkline & Baseline */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-slate-700 uppercase font-mono tracking-wider">
                  Gross XAF Volume
                </span>
                <div className="flex items-center bg-slate-100 rounded-md px-2 py-0.5 text-xs text-slate-700 font-semibold border border-slate-200">
                  <span className="text-slate-400 mr-1 font-normal">vs</span>
                  <select
                    value={comparisonPeriod}
                    onChange={(e) => setComparisonPeriod(e.target.value)}
                    className="bg-transparent outline-hidden cursor-pointer"
                  >
                    <option>Yesterday</option>
                    <option>Previous week</option>
                    <option>Previous month</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 text-xs font-mono font-semibold text-[#00c2c7]">
                <ArrowUpRight className="w-4 h-4" />
                <span>+18.5% today</span>
              </div>
            </div>

            {/* Figures */}
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-mono">
                84 250 000 XAF
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Compared to 71 100 000 XAF at this time yesterday
              </div>
            </div>

            {/* SVG Chart with Dotted Baseline & Axis Labels */}
            <div className="pt-2">
              <div className="relative w-full overflow-hidden">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-44 overflow-visible"
                >
                  <defs>
                    <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#001f5b" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#001f5b" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Dotted Baseline */}
                  <line
                    x1={paddingX}
                    y1={svgHeight - paddingY}
                    x2={svgWidth - paddingX}
                    y2={svgHeight - paddingY}
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />

                  {/* Midline */}
                  <line
                    x1={paddingX}
                    y1={(svgHeight - paddingY) / 2}
                    x2={svgWidth - paddingX}
                    y2={(svgHeight - paddingY) / 2}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />

                  {/* Shaded Area */}
                  <polygon points={areaPoints} fill="url(#volumeGradient)" />

                  {/* Trend Line */}
                  <polyline
                    fill="none"
                    stroke="#001f5b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />

                  {/* Hour Markers */}
                  {hourlyData.map((d, idx) => {
                    const x = paddingX + (idx / (hourlyData.length - 1)) * (svgWidth - 2 * paddingX)
                    return (
                      <text
                        key={idx}
                        x={x}
                        y={svgHeight - 6}
                        textAnchor="middle"
                        className="text-[10px] font-mono fill-slate-400 font-medium"
                      >
                        {d.hour}
                      </text>
                    )
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Compact Summary Rows beneath Chart (Matches Reference) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Balances Summary Row */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Balances
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('balances')}
                  className="text-xs font-semibold text-[#001f5b] hover:underline flex items-center"
                >
                  <span>View more</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="text-xl font-bold font-mono text-slate-900">482 900 000 XAF</div>
                <p className="text-xs text-slate-500">
                  Total available across 4 settlement pockets & escrow accounts.
                </p>
              </div>
            </div>

            {/* Payouts / Settlements Summary Row */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Settlements & Payouts
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('withdrawals')}
                  className="text-xs font-semibold text-[#001f5b] hover:underline flex items-center"
                >
                  <span>View</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="text-xl font-bold font-mono text-[#001f5b] flex items-center space-x-1.5">
                  <CheckCircle2 className="w-5 h-5 text-[#00c2c7]" />
                  <span>All Rails Active</span>
                </div>
                <p className="text-xs text-slate-500">
                  MTN MoMo & Orange Money operating at 38s median latency.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Recommendations Card + Docked Setup Guide */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recommendations Card (Dismissible with X) */}
          {showRecommendations && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="p-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-bold font-mono text-slate-900 uppercase">
                    Recommendations
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRecommendations(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                  title="Dismiss recommendations"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 divide-y divide-slate-100">
                <div className="pt-2 space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">
                    Design a custom dual-approval threshold
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Require four-eyes signoff for any payout exceeding 5 000 000 XAF to meet COBAC
                    circulars.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('approvals')}
                    className="text-xs font-semibold text-[#001f5b] hover:underline block pt-0.5"
                  >
                    Configure approval matrix
                  </button>
                </div>

                <div className="pt-3 space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">
                    Set up your wholesale FX spread margin
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Lock live central bank parity curves for high-volume commercial exporter
                    clients.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('fx-rates')}
                    className="text-xs font-semibold text-[#001f5b] hover:underline block pt-0.5"
                  >
                    Manage exchange catalog
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Persistent Setup Guide Panel (Section 4) */}
          <SetupGuide
            isOpen={showSetupGuide}
            onClose={() => {
              if (onToggleSetupGuide) onToggleSetupGuide()
            }}
            onStepClick={(step) => {
              if (step.actionRoute) onNavigate(step.actionRoute)
            }}
          />
        </div>
      </div>

      {/* ── Below the Fold: Embedded "Your Overview" Analytics Section ── */}
      <div className="pt-6 border-t border-slate-200/80 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Your Overview</h2>
            <p className="text-xs text-slate-500">
              Key performance indicators and operational health.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('reporting')}
            className="text-xs font-semibold text-[#001f5b] hover:underline flex items-center"
          >
            <span>View full analytics</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricTile
            id="tile-remittance"
            title="Remittance Volume"
            tooltip="Total inbound international wires converted to XAF"
            value="XAF 84.25M"
            comparisonValue="vs 71.10M yesterday"
            trend="up"
            trendPercent="+18.5%"
            chartData={[30, 42, 50, 62, 70, 84]}
            onMoreDetails={() => onNavigate('reporting')}
          />
          <MetricTile
            id="tile-disbursement"
            title="Mobile Money Payouts"
            tooltip="Total funds dispatched to MTN MoMo and Orange Money"
            value="XAF 42.10M"
            comparisonValue="vs 38.90M yesterday"
            trend="up"
            trendPercent="+8.2%"
            chartData={[25, 28, 33, 37, 40, 42]}
            onMoreDetails={() => onNavigate('reporting')}
          />
          <MetricTile
            id="tile-match-rate"
            title="Reconciliation Match Rate"
            tooltip="Transactions auto-matched against partner MT940 statements"
            value="99.4%"
            comparisonValue="vs 99.1% prev"
            trend="up"
            trendPercent="+0.3%"
            chartData={[98.8, 99.0, 99.1, 99.2, 99.4]}
            onMoreDetails={() => onNavigate('reconciliation')}
          />
          <MetricTile
            id="tile-turnaround"
            title="Approval Turnaround"
            tooltip="Median time for dual-approval signoff"
            value="4.2 mins"
            comparisonValue="vs 5.3 mins prev"
            trend="down"
            trendPercent="-20.7%"
            chartData={[6.2, 5.5, 5.0, 4.5, 4.2]}
            onMoreDetails={() => onNavigate('approvals')}
          />
        </div>
      </div>
    </div>
  )
}
