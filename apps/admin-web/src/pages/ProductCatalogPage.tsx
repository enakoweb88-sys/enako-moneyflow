import React, { useState } from 'react'
import { ModuleIntro } from '@/components/common/ModuleIntro'
import { TrendingUp, DollarSign, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ProductCatalogPageProps {
  onNavigate: (navId: string) => void
}

export const ProductCatalogPage: React.FC<ProductCatalogPageProps> = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState<'catalog' | 'intro'>('catalog')

  if (viewMode === 'intro') {
    return (
      <ModuleIntro
        moduleName="Product Catalog"
        badgeLabel="Fee & Exchange Parity"
        headline="Configure FX rate spreads and automated fee schedules"
        description="Establish corridor-specific foreign exchange rates pegged to BEAC central bank parity, set tiered commission matrices, and enforce dual-signoff maker-checker controls for any pricing changes."
        policyNote="All fee and exchange rate changes require dual-signoff from a Level 2 Finance Approver before going live."
        primaryActionLabel="Create fee schedule"
        onPrimaryAction={() => setViewMode('catalog')}
        secondaryActionLabel="View FX documentation"
        onSecondaryAction={() => onNavigate('developers')}
        features={[
          {
            title: 'Pegged Parity Index',
            description:
              'Lock fixed BEAC official parity (655.957 XAF) for EUR while setting custom wholesale spreads for USD and GBP.',
          },
          {
            title: 'Tiered Commission Rules',
            description:
              'Define flat, percentage, or hybrid fee structures scaled dynamically by customer volume tiers.',
          },
          {
            title: 'Audit & Invariant Checks',
            description:
              'Every rate update is cryptographically hashed into the audit ledger with maker-checker attribution.',
          },
        ]}
      />
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Product Catalog</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Active foreign exchange corridors, parity benchmarks, and corridor fee schedules.
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
            onClick={() => onNavigate('fx-rates')}
            className="bg-[#001f5b] hover:bg-[#001744] text-white text-xs flex items-center space-x-1.5 h-8 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manage FX rates</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FX Corridors Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-[#001f5b]" />
              <h3 className="text-base font-bold text-slate-900">Exchange Corridors</h3>
            </div>
            <Badge variant="success">BEAC PEG ACTIVE</Badge>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900">EUR / XAF</span>
                <span className="text-[10px] text-slate-400 ml-2">Official Fixed Parity</span>
              </div>
              <span className="font-bold text-[#001f5b] text-sm">655.957 XAF</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900">USD / XAF</span>
                <span className="text-[10px] text-slate-400 ml-2">Wholesale Clearing</span>
              </div>
              <span className="font-bold text-slate-900 text-sm">608.420 XAF</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900">GBP / XAF</span>
                <span className="text-[10px] text-slate-400 ml-2">Faster Payments</span>
              </div>
              <span className="font-bold text-slate-900 text-sm">782.150 XAF</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('fx-rates')}
            className="text-xs font-semibold text-[#001f5b] hover:underline flex items-center pt-2"
          >
            <span>Update spread curves</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        {/* Fee Rules Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-[#001f5b]" />
              <h3 className="text-base font-bold text-slate-900">Fee Rules & Schedules</h3>
            </div>
            <Badge variant="neutral">FOUR-EYES ENFORCED</Badge>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900">Consumer Remittance</span>
                <span className="text-[10px] text-slate-400 ml-2">Tier 1</span>
              </div>
              <span className="font-bold text-slate-900 text-sm">0.75% Flat</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900">Commercial Wholesale</span>
                <span className="text-[10px] text-slate-400 ml-2">&gt; €50K / mo</span>
              </div>
              <span className="font-bold text-[#001f5b] text-sm">0.40% Flat</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900">MoMo Cashout Surcharge</span>
                <span className="text-[10px] text-slate-400 ml-2">MTN & Orange</span>
              </div>
              <span className="font-bold text-slate-900 text-sm">1.00% Net</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('fees')}
            className="text-xs font-semibold text-[#001f5b] hover:underline flex items-center pt-2"
          >
            <span>Configure fee matrices</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  )
}
