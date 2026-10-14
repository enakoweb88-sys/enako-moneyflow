import React, { useState } from 'react'
import { ModuleIntro } from '@/components/common/ModuleIntro'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ConnectPartnersPageProps {
  onNavigate: (navId: string) => void
}

export const ConnectPartnersPage: React.FC<ConnectPartnersPageProps> = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState<'connections' | 'intro'>('connections')

  if (viewMode === 'intro') {
    return (
      <ModuleIntro
        moduleName="Connect"
        badgeLabel="Network Rails"
        headline="Direct clearing connections to MTN, Orange, and CEMAC banks"
        description="Establish resilient API integrations and settlement accounts with regional mobile network operators and commercial banking institutions across Cameroon, Gabon, and Chad."
        policyNote="Provider API credentials and encryption certificates are stored in AWS KMS HSMs."
        primaryActionLabel="View active integrations"
        onPrimaryAction={() => setViewMode('connections')}
        secondaryActionLabel="Review gateway API specs"
        onSecondaryAction={() => onNavigate('developers')}
        features={[
          {
            title: 'Sub-Minute MoMo Dispatch',
            description:
              'Direct dual-homed telecom links with MTN Mobile Money and Orange Money for sub-minute disbursement.',
          },
          {
            title: 'Commercial Bank Clearing',
            description:
              'Automated MT940 and ISO 20022 wire integrations with UBA, Ecobank, CBC, and Commercial Bank of Chad.',
          },
          {
            title: 'Automated Failover & Liquidity',
            description:
              'Continuous health monitoring automatically routes transactions to secondary clearing pools during operator downtime.',
          },
        ]}
      />
    )
  }

  const PROVIDERS = [
    {
      name: 'MTN Mobile Money Cameroon',
      code: 'MTN-CMR',
      status: 'Operational',
      latency: '34ms',
      successRate: '99.98%',
      floatAvailable: '41 000 000 XAF',
      lastPing: '2s ago',
    },
    {
      name: 'Orange Money Cameroon',
      code: 'OM-CMR',
      status: 'Operational',
      latency: '42ms',
      successRate: '99.94%',
      floatAvailable: '47 000 000 XAF',
      lastPing: '4s ago',
    },
    {
      name: 'UBA Cameroon Treasury Clearing',
      code: 'UBA-CM',
      status: 'Operational',
      latency: '110ms',
      successRate: '100%',
      floatAvailable: '180 000 000 XAF',
      lastPing: '15s ago',
    },
    {
      name: 'Ecobank CEMAC Interbank',
      code: 'ECO-CEMAC',
      status: 'Operational',
      latency: '95ms',
      successRate: '99.99%',
      floatAvailable: '95 000 000 XAF',
      lastPing: '30s ago',
    },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Connect</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Partner telecom gateways, clearing rails, and commercial bank interfaces.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('intro')}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs h-8"
          >
            Module overview
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => alert('Connect new provider modal: MTN, Orange, or Bank Wire')}
            className="bg-[#001f5b] hover:bg-[#001744] text-white text-xs flex items-center space-x-1.5 h-8 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect provider</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROVIDERS.map((p) => (
          <div
            key={p.code}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-mono font-bold text-xs text-slate-800">
                  {p.code.substring(0, 3)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{p.name}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">{p.code}</span>
                </div>
              </div>
              <Badge variant="success">HEALTHY</Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono text-center text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <div className="text-[10px] text-slate-400">LATENCY</div>
                <div className="font-bold text-slate-800 mt-0.5">{p.latency}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <div className="text-[10px] text-slate-400">SUCCESS</div>
                <div className="font-bold text-[#001f5b] mt-0.5">{p.successRate}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <div className="text-[10px] text-slate-400">HEARTBEAT</div>
                <div className="font-bold text-slate-600 mt-0.5">{p.lastPing}</div>
              </div>
            </div>

            <div className="p-3 bg-[#001f5b]/5 border border-[#001f5b]/10 rounded-xl flex justify-between items-center text-xs font-mono">
              <span className="text-slate-600">Available Escrow Float:</span>
              <span className="font-bold text-[#001f5b]">{p.floatAvailable}</span>
            </div>

            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Auto-failover enabled</span>
              <button
                type="button"
                onClick={() => onNavigate('balances')}
                className="font-semibold text-[#001f5b] hover:underline"
              >
                Inspect float
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
