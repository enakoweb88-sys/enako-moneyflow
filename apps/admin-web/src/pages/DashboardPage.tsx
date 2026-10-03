import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useMock } from '@/mock/MockContext'
import { ArrowUpRight, DollarSign, Wallet, CheckSquare, Edit3 } from 'lucide-react'
import { toast } from 'sonner'

interface DashboardPageProps {
  onNavigate: (navId: string) => void
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { kpis, urgentItems, approvalsCount, reconciliationOpenCount } = useMock()

  // 30-day volume mock data points (normalized to 100 height)
  const volumePoints = [
    32, 38, 35, 42, 40, 48, 55, 52, 60, 58, 64, 70, 68, 75, 72, 80, 78, 85, 82, 90, 88, 92, 95, 91,
    98, 102, 105, 110, 108, 115,
  ]
  const maxVal = Math.max(...volumePoints)
  const minVal = Math.min(...volumePoints)
  const svgWidth = 600
  const svgHeight = 160
  const padding = 20

  const pointsString = volumePoints
    .map((val, idx) => {
      const x = padding + (idx / (volumePoints.length - 1)) * (svgWidth - 2 * padding)
      const y =
        svgHeight - padding - ((val - minVal) / (maxVal - minVal)) * (svgHeight - 2 * padding)
      return `${x},${y}`
    })
    .join(' ')

  const statusBreakdown = [
    { label: 'Completed', count: 1842, percent: 84, color: 'bg-emerald-600' },
    { label: 'Under Review / Pending', count: 218, percent: 10, color: 'bg-amber-500' },
    { label: 'Failed / Rejected', count: 88, percent: 4, color: 'bg-rose-500' },
    { label: 'Unknown / Stuck', count: 44, percent: 2, color: 'bg-slate-400' },
  ]

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
              www.enakoos.com • MoneyFlow Treasury Core
            </p>
          </div>
        </div>

        {/* Middle: Key Organization Metadata Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 flex-1 max-w-xl">
          <div>
            <p className="text-xs text-slate-500 font-normal">Super Administrator</p>
            <p className="text-xs font-bold text-slate-800">ops-admin@enako-group.cm</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-normal">Plan</p>
            <p className="text-xs font-bold text-[#001f5b]">Enterprise Multi-Currency Engine</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-normal">Dual-Control Status</p>
            <p className="text-xs font-bold text-emerald-700">Four-Eyes Enforced</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-normal">Audit Trail Engine</p>
            <p className="text-xs font-bold text-slate-800">PostgreSQL 16 Append-Only</p>
          </div>
        </div>

        {/* Right: Quick Action Pencil */}
        <button
          type="button"
          onClick={() => toast.success('Organization configuration is synchronized')}
          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
          title="Edit Details"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      <PageHeader
        title="Dashboard"
        subtitle="Operational overview, core KPI performance, and prioritized attention items"
        action={
          <Button variant="default" size="sm" onClick={() => onNavigate('approvals')}>
            Review Pending Approvals ({approvalsCount})
          </Button>
        }
      />

      {/* ── 2. TOP METRIC CARDS WITH COLORED BOTTOM ACCENT (enako-os signature pattern) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Red Bottom Accent — Remittances */}
        <div className="bg-white border border-slate-200/90 border-b-[3px] border-b-rose-500 rounded-lg p-4 shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">
              REMITTANCE TODAY
            </p>
            <p className="text-2xl font-bold text-slate-900 leading-tight font-mono">
              {kpis.remittanceVolumeToday.toLocaleString()}{' '}
              <span className="text-xs font-sans text-slate-500">XAF</span>
            </p>
          </div>
        </div>

        {/* Card 2: Green Bottom Accent — Withdrawals */}
        <div className="bg-white border border-slate-200/90 border-b-[3px] border-b-emerald-500 rounded-lg p-4 shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">
              WITHDRAWAL TODAY
            </p>
            <p className="text-2xl font-bold text-slate-900 leading-tight font-mono">
              {kpis.withdrawalVolumeToday.toLocaleString()}{' '}
              <span className="text-xs font-sans text-slate-500">XAF</span>
            </p>
          </div>
        </div>

        {/* Card 3: Oxford Navy #001f5b Bottom Accent — Fee Income */}
        <div className="bg-white border border-slate-200/90 border-b-[3px] border-b-[#001f5b] rounded-lg p-4 shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#001f5b]/10 flex items-center justify-center text-[#001f5b] shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">
              FEE INCOME (MONTH)
            </p>
            <p className="text-2xl font-bold text-slate-900 leading-tight font-mono">
              {kpis.feeIncomeMonth.toLocaleString()}{' '}
              <span className="text-xs font-sans text-slate-500">XAF</span>
            </p>
          </div>
        </div>

        {/* Card 4: Amber Bottom Accent — Pending Queue */}
        <div className="bg-white border border-slate-200/90 border-b-[3px] border-b-amber-500 rounded-lg p-4 shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">
              WORK QUEUE QUEUED
            </p>
            <p className="text-2xl font-bold text-slate-900 leading-tight font-mono">
              {approvalsCount + reconciliationOpenCount}{' '}
              <span className="text-xs font-sans text-amber-700">Pending</span>
            </p>
          </div>
        </div>
      </div>

      {/* Needs Attention Panel */}
      <Card className="border-slate-200/90 shadow-2xs rounded-lg">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">Needs Attention</CardTitle>
              <CardDescription className="mt-0.5 text-xs text-slate-500">
                Urgent work items aggregated across payment verification, approvals, stuck
                withdrawals, and reconciliation
              </CardDescription>
            </div>
            <Badge variant="warning">{urgentItems.length} Urgent Items</Badge>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">Type</th>
                <th className="py-3 px-6">Reference</th>
                <th className="py-3 px-6">Amount / Context</th>
                <th className="py-3 px-6">Age</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {urgentItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-sans font-medium text-slate-900">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2" />
                    {item.type}
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-slate-700">{item.reference}</td>
                  <td className="py-3.5 px-6 font-sans text-slate-700">{item.amount}</td>
                  <td className="py-3.5 px-6 text-amber-800 font-sans font-medium">{item.age}</td>
                  <td className="py-3.5 px-6 text-right font-sans">
                    <button
                      type="button"
                      onClick={() => onNavigate(item.linkNav)}
                      className="text-xs font-semibold text-[#001f5b] hover:text-[#001744] hover:underline cursor-pointer"
                    >
                      Open in {item.linkNav.replace('-', ' ')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Row of 2 Visual Telemetry Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 30-Day Volume Graph with Oxford Navy styling */}
        <Card className="border-slate-200/90 shadow-2xs rounded-lg">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Transaction Volume (Last 30 Days)
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs text-slate-500">
                  Daily aggregate turnover in million XAF
                </CardDescription>
              </div>
              <span className="text-xs font-mono text-[#001f5b] font-bold">
                Min: 32M | Max: 115M
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 pb-2">
            <div className="w-full overflow-hidden">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44 text-slate-200">
                <line
                  x1="20"
                  y1="20"
                  x2="580"
                  y2="20"
                  stroke="currentColor"
                  strokeDasharray="3 3"
                />
                <line
                  x1="20"
                  y1="70"
                  x2="580"
                  y2="70"
                  stroke="currentColor"
                  strokeDasharray="3 3"
                />
                <line
                  x1="20"
                  y1="120"
                  x2="580"
                  y2="120"
                  stroke="currentColor"
                  strokeDasharray="3 3"
                />

                <polyline
                  fill="none"
                  stroke="#001f5b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pointsString}
                />
              </svg>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2 border-t border-slate-100">
              <span>Day 1</span>
              <span>Day 10</span>
              <span>Day 20</span>
              <span className="text-[#001f5b] font-bold">Today</span>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Status Breakdown */}
        <Card className="border-slate-200/90 shadow-2xs rounded-lg">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-bold text-slate-900">
              Transaction Status Distribution
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs text-slate-500">
              30-day cumulative execution health across all processing rails
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {/* Stacked Progress Bar */}
            <div className="h-4 w-full bg-slate-100 rounded-md overflow-hidden flex">
              {statusBreakdown.map((item) => (
                <div
                  key={item.label}
                  style={{ width: `${item.percent}%` }}
                  className={`${item.color} h-full transition-all`}
                  title={`${item.label}: ${item.percent}%`}
                />
              ))}
            </div>

            {/* Legend & Count Rows */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {statusBreakdown.map((item) => (
                <div
                  key={item.label}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200/60"
                >
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1.5">
                    <span className="text-sm font-bold text-slate-900 font-mono">
                      {item.count.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{item.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
