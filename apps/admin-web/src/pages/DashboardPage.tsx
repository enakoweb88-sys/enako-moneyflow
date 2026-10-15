import React from 'react'
import { ArrowRight, ClipboardCheck, Landmark, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMock } from '@/mock/MockContext'

interface DashboardPageProps {
  onNavigate: (navId: string) => void
  showSetupGuide?: boolean
  onToggleSetupGuide?: () => void
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onToggleSetupGuide }) => {
  const { kpis, urgentItems } = useMock()
  const metrics = [
    {
      label: 'Remittance volume today',
      value: `${kpis.remittanceVolumeToday.toLocaleString()} XAF`,
      icon: Landmark,
    },
    {
      label: 'Withdrawal volume today',
      value: `${kpis.withdrawalVolumeToday.toLocaleString()} XAF`,
      icon: ArrowRight,
    },
    { label: 'Pending approvals', value: String(kpis.pendingApprovals), icon: ClipboardCheck },
    {
      label: 'Open reconciliation items',
      value: String(kpis.openReconciliationItems),
      icon: ShieldCheck,
    },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-6 py-4">
      <section className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Operations workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">
            Live operational figures will appear here when the backend reporting endpoints are
            connected.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleSetupGuide}
          className="border-slate-300"
        >
          Open setup guide
        </Button>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <section
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs"
          >
            <Icon className="h-5 w-5 text-[#001f5b]" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {label}
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
          </section>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-slate-900">Operational attention</h2>
            <p className="mt-1 text-sm text-slate-500">
              No sample transactions or recommendations are displayed.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onNavigate('approvals')}>
            Open approvals
          </Button>
        </div>
        {urgentItems.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-slate-200 p-7 text-center text-sm text-slate-500">
            No live operational items are available yet.
          </p>
        ) : null}
      </section>
    </div>
  )
}
