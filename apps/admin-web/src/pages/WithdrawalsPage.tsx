import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { useMock } from '@/mock/MockContext'
import { toast } from 'sonner'
import type { Withdrawal, WithdrawalStatus } from '@/mock/data'

export const WithdrawalsPage: React.FC = () => {
  const { withdrawals, withdrawalsAttentionCount } = useMock()

  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null)
  const [isQuerying, setIsQuerying] = useState(false)

  const filteredWithdrawals = useMemo(() => {
    if (statusFilter === 'ALL') return withdrawals
    return withdrawals.filter((w) => w.status === statusFilter)
  }, [withdrawals, statusFilter])

  const getStatusBadgeVariant = (status: WithdrawalStatus) => {
    switch (status) {
      case 'Completed':
        return 'success'
      case 'Requested':
      case 'Funds held':
      case 'Submitted':
      case 'Processing':
        return 'info'
      case 'Pending approval':
      case 'Unknown':
        return 'warning'
      case 'Failed':
      case 'Rejected':
        return 'danger'
    }
  }

  const handleQueryProvider = () => {
    setIsQuerying(true)
    setTimeout(() => {
      setIsQuerying(false)
      toast.success(
        'Provider Gateway Switch queried: Status remains UNCONFIRMED in aggregator ledger.'
      )
    }, 1200)
  }

  const handleSendManualReview = () => {
    toast.success('Disbursement flagged and escalated to Treasury Manual Review team.')
    setSelectedWithdrawal(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Withdrawals & Disbursements"
        subtitle="Outgoing cashout requests, mobile money aggregators (MTN / Orange), and stuck payout resolution"
      />

      {/* Filter Bar with Dedicated Unknown Status Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Filter Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="ALL">All Statuses ({withdrawals.length})</option>
                <option value="Requested">Requested</option>
                <option value="Funds held">Funds held</option>
                <option value="Pending approval">Pending approval</option>
                <option value="Submitted">Submitted</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
                <option value="Unknown">Unknown (Stuck / Attention Needed)</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Dedicated Isolation Button for Unknown Status */}
            <div>
              <button
                type="button"
                onClick={() => setStatusFilter(statusFilter === 'Unknown' ? 'ALL' : 'Unknown')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer border transition-colors ${
                  statusFilter === 'Unknown'
                    ? 'bg-amber-600 text-white border-amber-700'
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                }`}
              >
                Isolate Unknown State ({withdrawalsAttentionCount} flagged)
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawals Table */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Withdrawals ({filteredWithdrawals.length})</CardTitle>
            <span className="text-xs text-slate-500">Amounts shown in XAF</span>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">Reference</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Beneficiary / Provider</th>
                <th className="py-3 px-6 text-right">Amount</th>
                <th className="py-3 px-6 text-right">Fee</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Created Date</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {filteredWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-sans">
                    No withdrawals match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredWithdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-700">{w.reference}</td>
                    <td className="py-3.5 px-6 font-sans">
                      <div className="font-semibold text-slate-900">{w.customerName}</div>
                      <div className="text-xs text-slate-500">{w.customerId}</div>
                    </td>
                    <td className="py-3.5 px-6 font-sans">
                      <div className="font-semibold text-slate-800">{w.beneficiaryProvider}</div>
                      <div className="text-xs text-slate-500 font-mono">
                        {w.beneficiaryMaskedNumber}
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-right font-bold text-slate-900">
                      {w.amount.toLocaleString()} XAF
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono text-slate-500">
                      {w.fee.toLocaleString()} XAF
                    </td>
                    <td className="py-3.5 px-6 font-sans">
                      <Badge variant={getStatusBadgeVariant(w.status)}>{w.status}</Badge>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 font-sans">{w.createdDate}</td>
                    <td className="py-3.5 px-6 text-right font-sans">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedWithdrawal(w)}
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

      {/* Withdrawal Detail & Provider Timeline Modal */}
      {selectedWithdrawal && (
        <Modal
          isOpen={!!selectedWithdrawal}
          onClose={() => setSelectedWithdrawal(null)}
          title={`Withdrawal Transaction: ${selectedWithdrawal.reference}`}
          subtitle={`Disbursement via ${selectedWithdrawal.beneficiaryProvider}`}
          maxWidth="lg"
        >
          <div className="space-y-6 text-xs">
            {/* Core Info */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 font-semibold block uppercase">
                  Beneficiary Account
                </span>
                <span className="font-semibold text-slate-900 font-sans text-sm mt-0.5 block">
                  {selectedWithdrawal.beneficiaryProvider}
                </span>
                <span className="font-mono text-slate-700">
                  {selectedWithdrawal.beneficiaryRealNumber}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 font-semibold block uppercase">
                  Total Disbursed
                </span>
                <span className="font-mono font-bold text-slate-900 text-base mt-0.5 block">
                  {selectedWithdrawal.amount.toLocaleString()} XAF
                </span>
                <span className="text-slate-500 font-mono">
                  Fee: {selectedWithdrawal.fee.toLocaleString()} XAF
                </span>
              </div>
            </div>

            {/* Provider Status Timeline (Plain text rows: Timestamp + Status + Note, Zero Icons) */}
            <div className="space-y-3">
              <span className="font-bold text-slate-900 uppercase tracking-wide block border-b border-slate-200 pb-2">
                Provider Status Timeline (Audit History)
              </span>

              <div className="space-y-2 font-sans">
                {selectedWithdrawal.timeline.map((event, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded border border-slate-200 flex flex-col space-y-1"
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-slate-500">{event.timestamp}</span>
                      <span className="font-semibold text-slate-800 uppercase">{event.status}</span>
                    </div>
                    <p className="text-slate-700 text-xs">{event.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stuck State Action Controls */}
            {selectedWithdrawal.status === 'Unknown' && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-300 space-y-3">
                <div>
                  <span className="font-bold text-amber-900 uppercase block tracking-wider">
                    Unresolved Aggregator Status
                  </span>
                  <p className="text-amber-800 mt-0.5">
                    This transaction timed out during transmission. Use the operations switch below
                    to query the provider gateway or route to treasury for manual reconciliation.
                  </p>
                </div>
                <div className="flex items-center space-x-3 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isQuerying}
                    onClick={handleQueryProvider}
                    className="bg-white border-amber-300 text-amber-900 hover:bg-amber-100"
                  >
                    {isQuerying ? 'Querying Switch...' : 'Query Provider Status'}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSendManualReview}
                    className="bg-amber-700 hover:bg-amber-800 text-white"
                  >
                    Send to Manual Review
                  </Button>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedWithdrawal(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
