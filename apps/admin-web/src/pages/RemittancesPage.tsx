import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useMock } from '@/mock/MockContext'
import type { Remittance, RemittanceStatus } from '@/mock/data'

export const RemittancesPage: React.FC = () => {
  const { remittances, verifyRemittancePayment, rejectRemittancePayment } = useMock()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [dateFilter, setDateFilter] = useState('')

  const [selectedRemittance, setSelectedRemittance] = useState<Remittance | null>(null)
  const [rejectDialogTarget, setRejectDialogTarget] = useState<Remittance | null>(null)

  const filteredRemittances = useMemo(() => {
    return remittances.filter((r) => {
      const matchesSearch =
        r.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.recipientName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter
      const matchesDate = !dateFilter || r.createdDate.startsWith(dateFilter)

      return matchesSearch && matchesStatus && matchesDate
    })
  }, [remittances, searchTerm, statusFilter, dateFilter])

  const getStatusBadgeVariant = (status: RemittanceStatus) => {
    switch (status) {
      case 'Completed':
      case 'Approved':
      case 'Verified':
        return 'success'
      case 'Under review':
      case 'Payment reported':
      case 'Pending approval':
      case 'FX locked':
        return 'warning'
      case 'Rejected':
      case 'Cancelled':
      case 'Expired':
        return 'danger'
      case 'Awaiting payment':
      case 'Reversed':
      default:
        return 'neutral'
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Remittances"
        subtitle="Inward payment matching, FX conversion locking, and disbursement routing"
      />

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <Input
                placeholder="Search by reference, sender name, or recipient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="ALL">All Statuses</option>
                <option value="Awaiting payment">Awaiting payment</option>
                <option value="Payment reported">Payment reported</option>
                <option value="Under review">Under review</option>
                <option value="Verified">Verified</option>
                <option value="FX locked">FX locked</option>
                <option value="Pending approval">Pending approval</option>
                <option value="Approved">Approved</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Expired">Expired</option>
                <option value="Reversed">Reversed</option>
              </select>

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-10 px-3 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />

              {(searchTerm || statusFilter !== 'ALL' || dateFilter) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('ALL')
                    setDateFilter('')
                  }}
                  className="text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remittances Table */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Transactions ({filteredRemittances.length})</CardTitle>
            <span className="text-xs text-slate-500">Amounts shown in source & net XAF</span>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">Reference</th>
                <th className="py-3 px-6">Sender Customer</th>
                <th className="py-3 px-6">Recipient</th>
                <th className="py-3 px-6 text-right">Source Amount</th>
                <th className="py-3 px-6 text-right">Net XAF</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Created Date</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {filteredRemittances.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-sans">
                    No remittances found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRemittances.map((rem) => (
                  <tr key={rem.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-700">{rem.reference}</td>
                    <td className="py-3.5 px-6 font-sans">
                      <div className="font-semibold text-slate-900">{rem.customerName}</div>
                      <div className="text-xs text-slate-500">{rem.customerId}</div>
                    </td>
                    <td className="py-3.5 px-6 font-sans text-slate-700">{rem.recipientName}</td>
                    <td className="py-3.5 px-6 text-right font-bold text-slate-900">
                      {rem.sourceAmount.toLocaleString()} {rem.sourceCurrency}
                    </td>
                    <td className="py-3.5 px-6 text-right font-bold text-emerald-800">
                      {rem.netXafAmount.toLocaleString()} XAF
                    </td>
                    <td className="py-3.5 px-6 font-sans">
                      <Badge variant={getStatusBadgeVariant(rem.status)}>{rem.status}</Badge>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 font-sans">{rem.createdDate}</td>
                    <td className="py-3.5 px-6 text-right font-sans">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRemittance(rem)}
                        className="text-xs h-7 px-2.5"
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Remittance Detail & Verification Screen Modal */}
      {selectedRemittance && (
        <Modal
          isOpen={!!selectedRemittance}
          onClose={() => setSelectedRemittance(null)}
          title={`Remittance Order: ${selectedRemittance.reference}`}
          subtitle={`Created: ${selectedRemittance.createdDate} | Sender: ${selectedRemittance.customerName}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Top Status & Recipient Header */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block uppercase">Current Status</span>
                <div className="mt-1">
                  <Badge variant={getStatusBadgeVariant(selectedRemittance.status)}>
                    {selectedRemittance.status}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block uppercase">
                  Designated Beneficiary
                </span>
                <span className="font-semibold text-slate-900 text-sm font-sans mt-0.5 block">
                  {selectedRemittance.recipientName}
                </span>
                <span className="font-mono text-slate-600">
                  {selectedRemittance.recipientPhone}
                </span>
              </div>
            </div>

            {/* Split: Payment Proof vs Bank Statement Matching */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Payment Proof Viewer */}
              <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-2 text-xs">
                <span className="font-semibold text-slate-800 uppercase tracking-wide block">
                  Customer Payment Proof
                </span>
                {selectedRemittance.paymentProofDoc ? (
                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <div className="font-mono font-medium text-slate-800">
                      {selectedRemittance.paymentProofDoc}
                    </div>
                    <div className="mt-2 text-slate-500">
                      Attached transfer receipt verified against sender KYC profile.
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 text-slate-500 italic">
                    No payment proof uploaded yet.
                  </div>
                )}
              </div>

              {/* Right: Bank Statement Matching Panel */}
              <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-2 text-xs">
                <span className="font-semibold text-slate-800 uppercase tracking-wide block">
                  Treasury Bank Statement Match
                </span>
                {selectedRemittance.bankStatementMatched ? (
                  <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-emerald-900">
                    <div className="font-semibold">Statement Match Confirmed</div>
                    <div className="font-mono text-xs mt-1">
                      Ref: {selectedRemittance.bankStatementRef || 'BNP-CLEARED-8821'}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 rounded border border-amber-200 text-amber-900">
                    <div className="font-semibold">Unmatched in Bank Clearing</div>
                    <div className="text-xs mt-1">
                      Awaiting settlement ingestion from Paris treasury feed.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Computed Calculation Panel (Right-aligned numbers) */}
            <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider block border-b border-slate-200 pb-2">
                Settlement & Conversion Calculation
              </span>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600">Source Deposited Amount:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {selectedRemittance.sourceAmount.toLocaleString()}{' '}
                  {selectedRemittance.sourceCurrency}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600">Frozen FX Conversion Rate:</span>
                <span className="font-mono font-semibold text-slate-900">
                  1 {selectedRemittance.sourceCurrency} = {selectedRemittance.frozenFxRate} XAF
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600">Assessment Fee:</span>
                <span className="font-mono text-slate-700">
                  {selectedRemittance.feeAmount} {selectedRemittance.sourceCurrency}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <span className="font-bold text-slate-900 text-sm">
                  Net Beneficiary Payout (XAF):
                </span>
                <span className="font-mono font-extrabold text-emerald-800 text-base">
                  {selectedRemittance.netXafAmount.toLocaleString()} XAF
                </span>
              </div>
            </div>

            {/* Status Dependent Actions */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                {selectedRemittance.status === 'Pending approval' && (
                  <span className="text-xs text-amber-800 font-semibold bg-amber-50 px-3 py-1.5 rounded border border-amber-200">
                    Payment verified — Request is currently pending Checker sign-off in Approvals.
                  </span>
                )}
                {selectedRemittance.status === 'Completed' && (
                  <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
                    Order fulfilled and disbursed to recipient mobile wallet.
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" onClick={() => setSelectedRemittance(null)}>
                  Close
                </Button>

                {selectedRemittance.status === 'Under review' && (
                  <>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setRejectDialogTarget(selectedRemittance)}
                    >
                      Reject Payment
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        verifyRemittancePayment(selectedRemittance.id)
                        setSelectedRemittance((prev) =>
                          prev
                            ? { ...prev, status: 'Pending approval', bankStatementMatched: true }
                            : null
                        )
                      }}
                    >
                      Verify Payment
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Confirmation Dialog */}
      {rejectDialogTarget && (
        <ConfirmDialog
          isOpen={!!rejectDialogTarget}
          title={`Reject Remittance Order: ${rejectDialogTarget.reference}`}
          description="Rejecting this remittance will cancel the conversion lock and notify the sender. A written rejection reason is mandatory for compliance logs."
          confirmLabel="Reject Remittance"
          cancelLabel="Cancel"
          variant="destructive"
          requireReason
          reasonLabel="Rejection Rationale (Required):"
          reasonPlaceholder="e.g. Sender bank statement name did not match KYC customer..."
          onConfirm={(reason) => {
            rejectRemittancePayment(rejectDialogTarget.id, reason)
            if (selectedRemittance?.id === rejectDialogTarget.id) {
              setSelectedRemittance((prev) => (prev ? { ...prev, status: 'Rejected' } : null))
            }
            setRejectDialogTarget(null)
          }}
          onCancel={() => setRejectDialogTarget(null)}
        />
      )}
    </div>
  )
}
