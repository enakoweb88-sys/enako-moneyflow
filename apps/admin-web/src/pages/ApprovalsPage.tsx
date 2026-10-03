import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Tabs } from '@/components/ui/tabs'
import { useMock } from '@/mock/MockContext'
import type { ApprovalItem } from '@/mock/data'

export const ApprovalsPage: React.FC = () => {
  const { approvals, approvalsHistory, decideApproval, currentUser, approvalsCount } = useMock()

  const [activeTab, setActiveTab] = useState('pending')
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null)

  // Decision Modal
  const [decisionType, setDecisionType] = useState<'Approve' | 'Reject' | 'Return' | null>(null)

  const handleOpenDecision = (type: 'Approve' | 'Reject' | 'Return') => {
    setDecisionType(type)
  }

  const handleConfirmDecision = (reason: string) => {
    if (!selectedItem || !decisionType) return
    decideApproval(selectedItem.id, decisionType, reason)
    setSelectedItem(null)
    setDecisionType(null)
  }

  // Check if current user is the maker of the request
  const isUserMaker = selectedItem?.makerId === currentUser.id

  return (
    <div className="space-y-6">
      <PageHeader
        title="Approvals & Dual-Control Hub"
        subtitle="Universal checker authorization queue across manual credits, withdrawals, FX rates, fee structures, and reversals"
      />

      {/* Tabs: Pending Queue vs History */}
      <Tabs
        tabs={[
          { id: 'pending', label: 'Pending Approvals', count: approvalsCount },
          { id: 'history', label: 'Decision History', count: approvalsHistory.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab 1: Pending Queue Table */}
      {activeTab === 'pending' && (
        <Card>
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Pending Work Queue ({approvals.length})</CardTitle>
                <CardDescription className="mt-0.5">
                  Items waiting for second-person checker sign-off
                </CardDescription>
              </div>
              <Badge variant="warning">{approvals.length} Awaiting Authorization</Badge>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Type</th>
                  <th className="py-3 px-6">Reference</th>
                  <th className="py-3 px-6 text-right">Amount / Value</th>
                  <th className="py-3 px-6">Maker (Created By)</th>
                  <th className="py-3 px-6">Time Waiting</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {approvals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 font-sans">
                      No approvals are currently pending in your queue.
                    </td>
                  </tr>
                ) : (
                  approvals.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6 font-sans font-semibold text-slate-900">
                        {item.type}
                      </td>
                      <td className="py-3.5 px-6 font-semibold text-slate-700">{item.reference}</td>
                      <td className="py-3.5 px-6 text-right font-bold text-slate-900">
                        {item.amountFormatted}
                      </td>
                      <td className="py-3.5 px-6 font-sans text-slate-700">{item.makerName}</td>
                      <td className="py-3.5 px-6 font-sans">
                        <span
                          className={`font-semibold ${
                            item.isPastThreshold ? 'text-amber-800' : 'text-slate-600'
                          }`}
                        >
                          {item.timeWaiting}
                          {item.isPastThreshold && (
                            <span className="ml-2 text-xs text-amber-700 font-normal">
                              (Past SLA)
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right font-sans">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => setSelectedItem(item)}
                          className="text-xs h-7 px-3"
                        >
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 2: Decision History Table */}
      {activeTab === 'history' && (
        <Card>
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base">
              Decided Approvals History ({approvalsHistory.length})
            </CardTitle>
            <CardDescription className="mt-0.5">
              Historical ledger of dual-control sign-offs and rejections
            </CardDescription>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Type</th>
                  <th className="py-3 px-6">Reference</th>
                  <th className="py-3 px-6 text-right">Amount / Value</th>
                  <th className="py-3 px-6">Maker</th>
                  <th className="py-3 px-6">Checker (Decided By)</th>
                  <th className="py-3 px-6">Decision</th>
                  <th className="py-3 px-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {approvalsHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-sans font-semibold text-slate-900">
                      {item.type}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-700">{item.reference}</td>
                    <td className="py-3.5 px-6 text-right font-bold text-slate-900">
                      {item.amountFormatted}
                    </td>
                    <td className="py-3.5 px-6 font-sans text-slate-600">{item.makerName}</td>
                    <td className="py-3.5 px-6 font-sans text-slate-900 font-medium">
                      {item.decidedBy}
                    </td>
                    <td className="py-3.5 px-6 font-sans">
                      <Badge variant={item.status === 'Approved' ? 'success' : 'danger'}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6 font-sans text-slate-500">{item.decidedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Review & Decision Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={`Dual Control Review: ${selectedItem.reference}`}
          subtitle={`Type: ${selectedItem.type} | Maker: ${selectedItem.makerName}`}
          maxWidth="lg"
        >
          <div className="space-y-5 text-xs">
            {/* Description & Maker Details */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 uppercase tracking-wide block border-b border-slate-200 pb-1">
                Underlying Request Context
              </span>
              <p className="text-slate-800 font-sans text-sm font-medium">
                {selectedItem.underlyingContext.description}
              </p>
              <div className="pt-2 text-slate-600">
                <span className="font-semibold text-slate-700">Maker Justification: </span>
                {selectedItem.underlyingContext.reason}
              </div>
            </div>

            {/* Structured Parameters */}
            <div className="p-4 bg-white rounded border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 uppercase tracking-wide block mb-1">
                Transaction Parameters
              </span>
              {Object.entries(selectedItem.underlyingContext.details).map(([key, val]) => (
                <div key={key} className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">{key}:</span>
                  <span className="font-mono font-semibold text-slate-900">{val}</span>
                </div>
              ))}
            </div>

            {/* Two-person maker enforcement check */}
            {isUserMaker && (
              <div className="p-3 bg-amber-50 rounded border border-amber-300 text-amber-900 font-sans">
                <span className="font-bold block">Maker-Checker Restriction Active</span>
                You created this request as the maker. Under financial compliance rules, a maker
                cannot approve their own request. Another authorized manager must perform the
                checker sign-off.
              </div>
            )}

            {/* Decision Actions Panel */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <Button variant="outline" size="sm" onClick={() => setSelectedItem(null)}>
                Cancel
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUserMaker}
                  onClick={() => handleOpenDecision('Return')}
                >
                  Return for Correction
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={isUserMaker}
                  onClick={() => handleOpenDecision('Reject')}
                >
                  Reject Request
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  disabled={isUserMaker}
                  onClick={() => handleOpenDecision('Approve')}
                >
                  Approve Request
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Decision Reason Confirmation Dialog */}
      {decisionType && selectedItem && (
        <ConfirmDialog
          isOpen={!!decisionType}
          title={`Confirm Decision: ${decisionType} ${selectedItem.reference}`}
          description={`Please provide your formal checker justification for recording a ${decisionType} decision on this ${selectedItem.type}.`}
          confirmLabel={decisionType === 'Approve' ? 'Confirm Approval' : decisionType}
          variant={
            decisionType === 'Approve'
              ? 'primary'
              : decisionType === 'Reject'
                ? 'destructive'
                : 'secondary'
          }
          requireReason
          reasonLabel="Checker Justification (Required):"
          reasonPlaceholder={
            decisionType === 'Approve'
              ? 'e.g. Verified against bank statement and verified authorized signatory.'
              : decisionType === 'Return'
                ? 'e.g. Please re-attach the updated swift confirmation document.'
                : 'e.g. Insufficient treasury balance or unauthorized rate.'
          }
          onConfirm={handleConfirmDecision}
          onCancel={() => setDecisionType(null)}
        />
      )}
    </div>
  )
}
