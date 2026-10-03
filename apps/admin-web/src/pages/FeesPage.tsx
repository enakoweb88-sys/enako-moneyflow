import React, { useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { useMock } from '@/mock/MockContext'
import type { FeeRule } from '@/mock/data'

export const FeesPage: React.FC = () => {
  const { feeRules, createFeeRule } = useMock()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [transactionType, setTransactionType] = useState('Remittance Inward (EUR)')
  const [currency, setCurrency] = useState('EUR')
  const [structureType, setStructureType] =
    useState<FeeRule['structureType']>('Percentage with min/max')

  // Parameter fields
  const [fixedAmount, setFixedAmount] = useState('500')
  const [percentRate, setPercentRate] = useState('1.0')
  const [minFee, setMinFee] = useState('5')
  const [maxFee, setMaxFee] = useState('50')
  const [tiers, setTiers] = useState<{ from: number; to: number; rate: string }[]>([
    { from: 1, to: 50000, rate: '1.2%' },
    { from: 50001, to: 250000, rate: '1.0%' },
  ])

  const handleAddTier = () => {
    const lastTier = tiers[tiers.length - 1]
    const nextFrom = lastTier ? lastTier.to + 1 : 1
    setTiers([...tiers, { from: nextFrom, to: nextFrom + 500000, rate: '0.8%' }])
  }

  const handleRemoveTier = (idx: number) => {
    setTiers(tiers.filter((_, i) => i !== idx))
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let summary = ''
    if (structureType === 'Fixed') {
      summary = `${fixedAmount} ${currency} flat fee`
    } else if (structureType === 'Percentage') {
      summary = `${percentRate}% flat`
    } else if (structureType === 'Percentage with min/max') {
      summary = `${percentRate}% (Min: ${minFee} ${currency}, Max: ${maxFee} ${currency})`
    } else if (structureType === 'Tiered') {
      summary = `Tiered: ${tiers.length} bands`
    }

    createFeeRule({
      transactionType,
      currency,
      structureType,
      structureSummary: summary,
      tiers: structureType === 'Tiered' ? tiers : undefined,
    })

    setIsCreateOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Rules & Commission Pricing"
        subtitle="Operational fees, mobile money aggregator tariffs, and tiered commission structures"
        action={
          <Button variant="default" size="sm" onClick={() => setIsCreateOpen(true)}>
            Create Fee Rule
          </Button>
        }
      />

      {/* Fee Rules Table */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Active & Pending Rules ({feeRules.length})</CardTitle>
            <span className="text-xs text-slate-500">
              New rules are reviewed in Approvals before going live
            </span>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">Transaction Type</th>
                <th className="py-3 px-6">Currency</th>
                <th className="py-3 px-6">Rule Structure</th>
                <th className="py-3 px-6">Effective Date</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {feeRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-slate-900 font-sans">
                    {rule.transactionType}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-slate-800">{rule.currency}</td>
                  <td className="py-3.5 px-6 text-slate-700 font-sans">{rule.structureSummary}</td>
                  <td className="py-3.5 px-6 text-slate-600 font-sans">{rule.effectiveDate}</td>
                  <td className="py-3.5 px-6 font-sans">
                    <Badge variant={rule.status === 'Active' ? 'success' : 'warning'}>
                      {rule.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Fee Rule Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Fee Rule"
        subtitle="Proposed fee structures route through Approvals for maker-checker sign-off."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
              Transaction Corridor / Type
            </label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-sans"
            >
              <option value="Remittance Inward (EUR)">Remittance Inward (EUR)</option>
              <option value="Remittance Inward (USD)">Remittance Inward (USD)</option>
              <option value="Remittance Inward (GBP)">Remittance Inward (GBP)</option>
              <option value="MTN MoMo Cashout">MTN MoMo Cashout</option>
              <option value="Orange Money Cashout">Orange Money Cashout</option>
              <option value="Bank Account Transfer">Bank Account Transfer</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                Settlement Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-sans"
              >
                <option value="XAF">XAF</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                Pricing Structure Model
              </label>
              <select
                value={structureType}
                onChange={(e) => setStructureType(e.target.value as FeeRule['structureType'])}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-sans"
              >
                <option value="Percentage">Percentage Flat</option>
                <option value="Fixed">Fixed Amount</option>
                <option value="Percentage with min/max">Percentage with Min/Max</option>
                <option value="Tiered">Tiered Bands</option>
              </select>
            </div>
          </div>

          {/* Dynamic Fields per Structure Type */}
          {structureType === 'Fixed' && (
            <div>
              <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                Fixed Charge ({currency})
              </label>
              <Input
                type="number"
                value={fixedAmount}
                onChange={(e) => setFixedAmount(e.target.value)}
                className="w-full text-xs font-mono"
              />
            </div>
          )}

          {structureType === 'Percentage' && (
            <div>
              <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                Percentage Rate (%)
              </label>
              <Input
                type="number"
                step="0.01"
                value={percentRate}
                onChange={(e) => setPercentRate(e.target.value)}
                className="w-full text-xs font-mono"
              />
            </div>
          )}

          {structureType === 'Percentage with min/max' && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                  Rate (%)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={percentRate}
                  onChange={(e) => setPercentRate(e.target.value)}
                  className="w-full text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                  Min ({currency})
                </label>
                <Input
                  type="number"
                  value={minFee}
                  onChange={(e) => setMinFee(e.target.value)}
                  className="w-full text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                  Max ({currency})
                </label>
                <Input
                  type="number"
                  value={maxFee}
                  onChange={(e) => setMaxFee(e.target.value)}
                  className="w-full text-xs font-mono"
                />
              </div>
            </div>
          )}

          {structureType === 'Tiered' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                <span className="font-semibold text-slate-800 uppercase">Tier Bands</span>
                <button
                  type="button"
                  onClick={handleAddTier}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer underline"
                >
                  Add Tier
                </button>
              </div>

              {tiers.map((tier, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <span className="text-slate-400 block text-xs">From</span>
                    <Input
                      type="number"
                      value={tier.from}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        setTiers(tiers.map((t, i) => (i === idx ? { ...t, from: val } : t)))
                      }}
                      className="text-xs font-mono"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-slate-400 block text-xs">To</span>
                    <Input
                      type="number"
                      value={tier.to}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        setTiers(tiers.map((t, i) => (i === idx ? { ...t, to: val } : t)))
                      }}
                      className="text-xs font-mono"
                    />
                  </div>
                  <div className="w-24">
                    <span className="text-slate-400 block text-xs">Rate</span>
                    <Input
                      type="text"
                      value={tier.rate}
                      onChange={(e) => {
                        const val = e.target.value
                        setTiers(tiers.map((t, i) => (i === idx ? { ...t, rate: val } : t)))
                      }}
                      className="text-xs font-mono"
                    />
                  </div>
                  {tiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTier(idx)}
                      className="text-rose-600 hover:text-rose-800 text-xs font-bold pt-4 px-1 cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex justify-end space-x-3">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="default" size="sm" type="submit">
              Submit Fee Rule
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
