import React, { useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { useMock } from '@/mock/MockContext'
import type { FxRate } from '@/mock/data'

export const FxRatesPage: React.FC = () => {
  const { fxRates, proposeFxRate } = useMock()

  const [isProposeOpen, setIsProposeOpen] = useState(false)
  const [currencyPair, setCurrencyPair] = useState('EUR / XAF')
  const [baseRate, setBaseRate] = useState('655.957')
  const [customerRate, setCustomerRate] = useState('655.957')
  const [reason, setReason] = useState('')
  const [formError, setFormError] = useState('')

  // Calculate deviation from active rate
  const activeRateObj = fxRates.find(
    (r) => r.currencyPair === currencyPair && r.status === 'Active'
  )
  const currentActiveCustomerRate = activeRateObj?.customerRate || parseFloat(customerRate) || 1
  const proposedNum = parseFloat(customerRate) || 0
  const deviationPercent =
    currentActiveCustomerRate > 0
      ? Math.abs(((proposedNum - currentActiveCustomerRate) / currentActiveCustomerRate) * 100)
      : 0
  const isHighDeviation = deviationPercent >= 2.0

  const handleProposeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const bRate = parseFloat(baseRate)
    const cRate = parseFloat(customerRate)
    if (!bRate || bRate <= 0 || !cRate || cRate <= 0) {
      setFormError('Please enter valid positive numbers for rates.')
      return
    }
    if (!reason.trim()) {
      setFormError('A treasury justification reason is mandatory.')
      return
    }

    proposeFxRate({
      currencyPair,
      baseRate: bRate,
      customerRate: cRate,
      reason: reason.trim(),
    })

    setIsProposeOpen(false)
    setReason('')
    setFormError('')
  }

  const getStatusBadgeVariant = (status: FxRate['status']) => {
    switch (status) {
      case 'Active':
        return 'success'
      case 'Approved':
        return 'info'
      case 'Proposed':
        return 'warning'
      case 'Superseded':
      default:
        return 'neutral'
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Foreign Exchange (FX) Rates"
        subtitle="Treasury exchange rates, corridor retail margins, and dual-control price proposal routing"
        action={
          <Button variant="default" size="sm" onClick={() => setIsProposeOpen(true)}>
            Propose New Rate
          </Button>
        }
      />

      {/* Rates Table */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Exchange Rates ({fxRates.length})</CardTitle>
            <span className="text-xs text-slate-500">
              Rates proposed by staff route to Approvals before activation
            </span>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">Currency Pair</th>
                <th className="py-3 px-6 text-right">Interbank Base Rate</th>
                <th className="py-3 px-6 text-right">Retail Customer Rate</th>
                <th className="py-3 px-6 text-right">Spread Margin</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Effective Date</th>
                <th className="py-3 px-6">Created By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {fxRates.map((rate) => {
                const spread = Math.abs(rate.baseRate - rate.customerRate)
                return (
                  <tr key={rate.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900 font-sans">
                      {rate.currencyPair}
                    </td>
                    <td className="py-3.5 px-6 text-right text-slate-700 font-semibold">
                      {rate.baseRate.toFixed(3)}
                    </td>
                    <td className="py-3.5 px-6 text-right font-bold text-slate-900">
                      {rate.customerRate.toFixed(3)}
                    </td>
                    <td className="py-3.5 px-6 text-right text-emerald-800 font-medium">
                      {spread.toFixed(3)}
                    </td>
                    <td className="py-3.5 px-6 font-sans">
                      <Badge variant={getStatusBadgeVariant(rate.status)}>{rate.status}</Badge>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 font-sans">{rate.effectiveDate}</td>
                    <td className="py-3.5 px-6 font-sans text-slate-700">{rate.createdBy}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Propose New Rate Modal */}
      <Modal
        isOpen={isProposeOpen}
        onClose={() => setIsProposeOpen(false)}
        title="Propose New FX Rate"
        subtitle="Submitting routes to Approvals for Maker-Checker authorization."
        maxWidth="md"
      >
        <form onSubmit={handleProposeSubmit} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3 bg-rose-50 text-rose-800 rounded border border-rose-200 font-medium">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
              Currency Pair
            </label>
            <select
              value={currencyPair}
              onChange={(e) => {
                setCurrencyPair(e.target.value)
                if (e.target.value === 'EUR / XAF') {
                  setBaseRate('655.957')
                  setCustomerRate('655.957')
                } else if (e.target.value === 'USD / XAF') {
                  setBaseRate('602.15')
                  setCustomerRate('595.00')
                } else if (e.target.value === 'GBP / XAF') {
                  setBaseRate('775.40')
                  setCustomerRate('765.00')
                } else if (e.target.value === 'CAD / XAF') {
                  setBaseRate('442.80')
                  setCustomerRate('435.00')
                }
              }}
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-sans"
            >
              <option value="EUR / XAF">EUR / XAF</option>
              <option value="USD / XAF">USD / XAF</option>
              <option value="GBP / XAF">GBP / XAF</option>
              <option value="CAD / XAF">CAD / XAF</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                Interbank Base Rate
              </label>
              <Input
                type="number"
                step="0.001"
                value={baseRate}
                onChange={(e) => setBaseRate(e.target.value)}
                className="w-full text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                Proposed Customer Rate
              </label>
              <Input
                type="number"
                step="0.001"
                value={customerRate}
                onChange={(e) => setCustomerRate(e.target.value)}
                className="w-full text-xs font-mono"
              />
            </div>
          </div>

          {/* Inline Amber Warning for High Deviation */}
          {isHighDeviation && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-300 text-amber-900 font-sans">
              <span className="font-bold block uppercase tracking-wide text-xs">
                Significant Deviation Warning
              </span>
              The proposed rate deviates by {deviationPercent.toFixed(2)}% from the current active
              rate ({currentActiveCustomerRate}). Large movements trigger elevated treasury scrutiny
              in the approvals queue.
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
              Treasury Rationale & Market Reference (Required)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Central bank parity revaluation, market volatility hedge, or promotional corridor incentive..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end space-x-3">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setIsProposeOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="default" size="sm" type="submit">
              Submit Proposal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
