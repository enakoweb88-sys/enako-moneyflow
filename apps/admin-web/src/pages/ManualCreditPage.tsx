import React, { useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { useMock } from '@/mock/MockContext'
import type { ManualCredit } from '@/mock/data'

export const ManualCreditPage: React.FC = () => {
  const { manualCredits, customers, createManualCredit } = useMock()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedCredit, setSelectedCredit] = useState<ManualCredit | null>(null)

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '')
  const [currency, setCurrency] = useState('XAF')
  const [amount, setAmount] = useState('')
  const [exchangeRate, setExchangeRate] = useState('1.0')
  const [evidenceFileName, setEvidenceFileName] = useState('')
  const [notes, setNotes] = useState('')
  const [formError, setFormError] = useState('')

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numericAmount = parseFloat(amount)
    if (!numericAmount || numericAmount <= 0) {
      setFormError('Please enter a valid credit amount.')
      return
    }
    if (!notes.trim()) {
      setFormError('Audit notes explaining the manual credit origin are mandatory.')
      return
    }

    createManualCredit({
      customerId: selectedCustomerId,
      currency,
      amount: numericAmount,
      exchangeRate: parseFloat(exchangeRate) || 1.0,
      evidenceFileName: evidenceFileName || 'bank_swift_wire_inward.pdf',
      notes: notes.trim(),
    })

    setIsCreateOpen(false)
    setAmount('')
    setNotes('')
    setEvidenceFileName('')
    setFormError('')
  }

  const getStatusBadgeVariant = (status: ManualCredit['status']) => {
    switch (status) {
      case 'Approved':
      case 'Executed':
        return 'success'
      case 'Submitted':
        return 'warning'
      case 'Returned':
        return 'info'
      case 'Rejected':
        return 'danger'
      case 'Draft':
      default:
        return 'neutral'
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manual Credit Requests"
        subtitle="Dual-control manual balance adjustments, external bank wire credits, and maker-checker validation"
        action={
          <Button variant="default" size="sm" onClick={() => setIsCreateOpen(true)}>
            Create Manual Credit Request
          </Button>
        }
      />

      {/* Manual Credit Requests Table */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Credit Requests ({manualCredits.length})</CardTitle>
            <span className="text-xs text-slate-500">
              Maker-checker enforcement: Two staff signatures required
            </span>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">Reference</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6 text-right">Amount</th>
                <th className="py-3 px-6">Created By (Maker)</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {manualCredits.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-slate-700">{item.reference}</td>
                  <td className="py-3.5 px-6 font-sans">
                    <div className="font-semibold text-slate-900">{item.customerName}</div>
                    <div className="text-xs text-slate-500">{item.customerId}</div>
                  </td>
                  <td className="py-3.5 px-6 text-right font-bold text-slate-900">
                    {item.amount.toLocaleString()} {item.currency}
                  </td>
                  <td className="py-3.5 px-6 font-sans text-slate-700">{item.createdBy}</td>
                  <td className="py-3.5 px-6 font-sans">
                    <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                  </td>
                  <td className="py-3.5 px-6 text-right font-sans">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCredit(item)}
                      className="text-xs h-7 px-2.5"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Manual Credit Request Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Manual Credit Request"
        subtitle="Step 1: Maker Submission — Requires checker authorization before wallet credit occurs."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3 bg-rose-50 text-rose-800 rounded border border-rose-200 font-medium">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
              Select Customer Account
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#001f5b] font-sans"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.customerNumber} ({c.email})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value)
                  if (e.target.value === 'EUR') setExchangeRate('655.957')
                  else if (e.target.value === 'GBP') setExchangeRate('775.40')
                  else if (e.target.value === 'USD') setExchangeRate('602.15')
                  else setExchangeRate('1.0')
                }}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#001f5b] font-sans"
              >
                <option value="XAF">XAF (Central African Franc)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="GBP">GBP (British Pound)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                Credit Amount
              </label>
              <Input
                type="number"
                placeholder="e.g. 5000000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
              Applied Exchange Rate
            </label>
            <Input
              type="text"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              className="w-full text-xs font-mono"
            />
          </div>

          {/* Evidence Upload Drop-zone area (pattern matching KYC docs) */}
          <div>
            <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
              External Bank Proof / SWIFT MT103 (Drop-Zone)
            </label>
            <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
              <span className="font-semibold text-slate-700 block">
                Click or drag & drop proof document here
              </span>
              <span className="text-slate-500 block text-xs mt-0.5">
                PDF, JPG, or PNG up to 10MB (Bank swift, clearing slip, or treasury voucher)
              </span>
              <input
                type="text"
                placeholder="Or specify proof document name (e.g. ecobank_wire_receipt.pdf)..."
                value={evidenceFileName}
                onChange={(e) => setEvidenceFileName(e.target.value)}
                className="mt-3 w-full text-xs px-3 py-1.5 border border-slate-300 rounded bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
              Audit Notes & Operational Justification (Required)
            </label>
            <textarea
              rows={2}
              placeholder="State clearing bank account, bank reference number, and confirmation method..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001f5b] text-slate-900"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="default" size="sm" type="submit">
              Submit for Approval
            </Button>
          </div>
        </form>
      </Modal>

      {/* Detail View Modal (Dual Control Maker-Checker visible) */}
      {selectedCredit && (
        <Modal
          isOpen={!!selectedCredit}
          onClose={() => setSelectedCredit(null)}
          title={`Manual Credit Request: ${selectedCredit.reference}`}
          subtitle={`Beneficiary: ${selectedCredit.customerName}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex justify-between items-center">
              <span className="text-slate-500 uppercase font-semibold">Current Status</span>
              <Badge variant={getStatusBadgeVariant(selectedCredit.status)}>
                {selectedCredit.status}
              </Badge>
            </div>

            <div className="p-4 bg-white rounded border border-slate-200 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Customer:</span>
                <span className="font-semibold text-slate-900">{selectedCredit.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Credit Amount:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {selectedCredit.amount.toLocaleString()} {selectedCredit.currency}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Exchange Rate:</span>
                <span className="font-mono text-slate-800">{selectedCredit.exchangeRate}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Evidence File:</span>
                <span className="font-mono text-[#001f5b] font-semibold">
                  {selectedCredit.evidenceFileName}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 uppercase font-semibold block mb-1">
                Maker Justification
              </span>
              <p className="text-slate-800 font-sans">{selectedCredit.notes}</p>
            </div>

            {/* Maker-Checker Plain Labeled Text Container */}
            <div className="p-4 bg-slate-100 rounded-lg border border-slate-300 space-y-2 font-sans">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
                Dual Control Verification Signatures
              </div>
              <div>
                <span className="text-slate-600 font-medium">Created by: </span>
                <span className="font-semibold text-slate-900">{selectedCredit.createdBy}</span>
                <span className="text-slate-500 ml-2">on {selectedCredit.createdAt}</span>
              </div>

              {selectedCredit.decidedBy ? (
                <div>
                  <span className="text-slate-600 font-medium">
                    {selectedCredit.status === 'Approved' || selectedCredit.status === 'Executed'
                      ? 'Approved by: '
                      : 'Rejected by: '}
                  </span>
                  <span className="font-semibold text-slate-900">{selectedCredit.decidedBy}</span>
                  {selectedCredit.decidedAt && (
                    <span className="text-slate-500 ml-2">on {selectedCredit.decidedAt}</span>
                  )}
                  {selectedCredit.decisionReason && (
                    <p className="text-slate-700 italic mt-1">
                      Reason: {selectedCredit.decisionReason}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-amber-800 font-medium italic">
                  Awaiting Checker authorization in Approvals queue.
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedCredit(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
