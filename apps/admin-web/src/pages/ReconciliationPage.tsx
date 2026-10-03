import React, { useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Tabs } from '@/components/ui/tabs'
import { useMock } from '@/mock/MockContext'
import type { ReconciliationRun, ReconciliationItem } from '@/mock/data'
import { toast } from 'sonner'

export const ReconciliationPage: React.FC = () => {
  const { reconRuns, resolveReconItem } = useMock()

  const [selectedRun, setSelectedRun] = useState<ReconciliationRun | null>(null)
  const [selectedItem, setSelectedItem] = useState<ReconciliationItem | null>(null)
  const [activeItemTab, setActiveItemTab] = useState<'Open' | 'Assigned' | 'Resolved'>('Open')

  // Start New Run Modal
  const [isStartOpen, setIsStartOpen] = useState(false)
  const [runDate, setRunDate] = useState('2026-10-02')
  const [providerSource, setProviderSource] = useState('MTN Mobile Money Gateway')

  // Resolve with adjustment dialog
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false)

  const handleStartRun = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success(
      `Reconciliation batch scheduled for ${providerSource} on ${runDate}. Ingestion started.`
    )
    setIsStartOpen(false)
  }

  const handleConfirmAdjustment = (explanation: string) => {
    if (!selectedRun || !selectedItem) return
    resolveReconItem(selectedRun.id, selectedItem.id, explanation)
    setIsResolveDialogOpen(false)
    setSelectedItem(null)
    // Update local run view
    setSelectedRun((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.map((i) =>
              i.id === selectedItem.id ? { ...i, status: 'Resolved' as const } : i
            ),
            openCount: Math.max(0, prev.openCount - 1),
          }
        : null
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Automated Reconciliation Engine"
        subtitle="Internal ledger transactions matched against external bank statements and aggregator switch settlement logs"
        action={
          <Button variant="default" size="sm" onClick={() => setIsStartOpen(true)}>
            Start New Run
          </Button>
        }
      />

      {/* Reconciliation Runs Table */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Reconciliation Batches ({reconRuns.length})</CardTitle>
            <span className="text-xs text-slate-500">
              Discrepancies require adjustment journal routing
            </span>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">Business Date</th>
                <th className="py-3 px-6">Provider / Source Channel</th>
                <th className="py-3 px-6 text-right">Matched Count</th>
                <th className="py-3 px-6 text-right">Open Discrepancies</th>
                <th className="py-3 px-6 text-right">Match Rate</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {reconRuns.map((run) => (
                <tr key={run.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-sans font-semibold text-slate-900">
                    {run.businessDate}
                  </td>
                  <td className="py-3.5 px-6 font-sans font-medium text-slate-800">
                    {run.provider}
                  </td>
                  <td className="py-3.5 px-6 text-right font-bold text-slate-900">
                    {run.matchedCount.toLocaleString()}
                  </td>
                  <td
                    className={`py-3.5 px-6 text-right font-bold ${
                      run.openCount > 0 ? 'text-amber-700' : 'text-slate-500'
                    }`}
                  >
                    {run.openCount}
                  </td>
                  <td className="py-3.5 px-6 text-right font-semibold text-emerald-800">
                    {run.matchPercentage}%
                  </td>
                  <td className="py-3.5 px-6 font-sans">
                    <Badge variant={run.status === 'Complete' ? 'success' : 'warning'}>
                      {run.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-6 text-right font-sans">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRun(run)}
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

      {/* Start New Run Modal */}
      <Modal
        isOpen={isStartOpen}
        onClose={() => setIsStartOpen(false)}
        title="Start Reconciliation Batch"
        subtitle="Ingest provider log files and match against internal double-entry ledger."
        maxWidth="md"
      >
        <form onSubmit={handleStartRun} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
              Business Date
            </label>
            <input
              type="date"
              value={runDate}
              onChange={(e) => setRunDate(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-sans"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
              Provider / Statement Source
            </label>
            <select
              value={providerSource}
              onChange={(e) => setProviderSource(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-sans"
            >
              <option value="MTN Mobile Money Gateway">MTN Mobile Money Gateway</option>
              <option value="Orange Money Gateway">Orange Money Gateway</option>
              <option value="BNP Paribas Clearing (EUR)">BNP Paribas Clearing (EUR)</option>
              <option value="Ecobank Corporate Treasury (XAF)">
                Ecobank Corporate Treasury (XAF)
              </option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end space-x-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsStartOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" size="sm" type="submit">
              Launch Run
            </Button>
          </div>
        </form>
      </Modal>

      {/* Run Detail Modal */}
      {selectedRun && (
        <Modal
          isOpen={!!selectedRun}
          onClose={() => {
            setSelectedRun(null)
            setSelectedItem(null)
          }}
          title={`Reconciliation: ${selectedRun.provider}`}
          subtitle={`Business Date: ${selectedRun.businessDate} | Match Rate: ${selectedRun.matchPercentage}%`}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs">
            {/* Summary Numbers */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <div>
                <span className="text-slate-500 font-semibold uppercase block">
                  Match Percentage
                </span>
                <span className="text-xl font-bold font-mono text-emerald-800 mt-0.5 block">
                  {selectedRun.matchPercentage}%
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold uppercase block">Total Matched</span>
                <span className="text-xl font-bold font-mono text-slate-900 mt-0.5 block">
                  {selectedRun.matchedCount.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold uppercase block">
                  Total Open Discrepancies
                </span>
                <span
                  className={`text-xl font-bold font-mono mt-0.5 block ${
                    selectedRun.openCount > 0 ? 'text-amber-700' : 'text-slate-900'
                  }`}
                >
                  {selectedRun.openCount}
                </span>
              </div>
            </div>

            {/* Tabs: Open / Assigned / Resolved */}
            <Tabs
              tabs={[
                {
                  id: 'Open',
                  label: 'Open Discrepancies',
                  count: selectedRun.items.filter((i) => i.status === 'Open').length,
                },
                {
                  id: 'Assigned',
                  label: 'Assigned',
                  count: selectedRun.items.filter((i) => i.status === 'Assigned').length,
                },
                {
                  id: 'Resolved',
                  label: 'Resolved',
                  count: selectedRun.items.filter((i) => i.status === 'Resolved').length,
                },
              ]}
              activeTab={activeItemTab}
              onChange={(id) => setActiveItemTab(id as typeof activeItemTab)}
            />

            {/* Discrepancy Items Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Side</th>
                    <th className="py-2.5 px-4">Reference</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                    <th className="py-2.5 px-4">Age</th>
                    <th className="py-2.5 px-4">Staff</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedRun.items.filter((i) => i.status === activeItemTab).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 font-sans">
                        No items under {activeItemTab} status.
                      </td>
                    </tr>
                  ) : (
                    selectedRun.items
                      .filter((i) => i.status === activeItemTab)
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80">
                          <td className="py-2.5 px-4 font-sans">
                            <Badge variant={item.side === 'Internal' ? 'info' : 'warning'}>
                              {item.side}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-4 font-semibold text-slate-800">
                            {item.reference}
                          </td>
                          <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                            {item.amount.toLocaleString()} {item.currency}
                          </td>
                          <td className="py-2.5 px-4 text-amber-800 font-sans font-medium">
                            {item.age}
                          </td>
                          <td className="py-2.5 px-4 font-sans text-slate-600">
                            {item.assignedStaff}
                          </td>
                          <td className="py-2.5 px-4 text-right font-sans">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedItem(item)}
                              className="text-xs h-6 px-2"
                            >
                              Investigate
                            </Button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Side-by-Side Item Detail View */}
            {selectedItem && (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-300 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900 uppercase">
                    Discrepancy Investigation: {selectedItem.reference}
                  </span>
                  <Badge variant={selectedItem.status === 'Resolved' ? 'success' : 'warning'}>
                    {selectedItem.status}
                  </Badge>
                </div>

                {/* Side-by-Side Comparison Blocks */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Left: Internal Ledger */}
                  <div className="p-3 bg-white rounded border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block text-xs uppercase text-sky-800">
                      Internal Core Ledger Record
                    </span>
                    <div className="text-slate-600">
                      Ref:{' '}
                      <span className="font-mono text-slate-900 font-semibold">
                        {selectedItem.internalDetails.ref}
                      </span>
                    </div>
                    <div className="text-slate-600">
                      Timestamp:{' '}
                      <span className="font-mono text-slate-900">
                        {selectedItem.internalDetails.date}
                      </span>
                    </div>
                    <div className="text-slate-600">
                      Recorded Amount:{' '}
                      <span className="font-mono font-bold text-slate-900">
                        {selectedItem.internalDetails.amount}
                      </span>
                    </div>
                    <div className="text-slate-600 text-xs mt-2 italic">
                      {selectedItem.internalDetails.note}
                    </div>
                  </div>

                  {/* Right: External Aggregator Log */}
                  <div className="p-3 bg-white rounded border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block text-xs uppercase text-amber-800">
                      External Provider Bank Statement
                    </span>
                    <div className="text-slate-600">
                      Ref:{' '}
                      <span className="font-mono text-slate-900 font-semibold">
                        {selectedItem.externalDetails.ref}
                      </span>
                    </div>
                    <div className="text-slate-600">
                      Timestamp:{' '}
                      <span className="font-mono text-slate-900">
                        {selectedItem.externalDetails.date}
                      </span>
                    </div>
                    <div className="text-slate-600">
                      Extracted Amount:{' '}
                      <span className="font-mono font-bold text-slate-900">
                        {selectedItem.externalDetails.amount}
                      </span>
                    </div>
                    <div className="text-slate-600 text-xs mt-2 italic">
                      {selectedItem.externalDetails.note}
                    </div>
                  </div>
                </div>

                {/* Resolve with Adjustment Action */}
                {selectedItem.status !== 'Resolved' && (
                  <div className="flex justify-end pt-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setIsResolveDialogOpen(true)}
                    >
                      Resolve with Adjustment
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedRun(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Resolve with Adjustment Dialog */}
      {isResolveDialogOpen && selectedItem && (
        <ConfirmDialog
          isOpen={isResolveDialogOpen}
          title={`Resolve with Adjustment: ${selectedItem.reference}`}
          description="Resolving this reconciliation discrepancy will generate an adjustment journal entry. Under financial compliance rules, this adjustment routes to the Approvals queue before posting to the ledger."
          confirmLabel="Route Adjustment to Approvals"
          cancelLabel="Cancel"
          variant="primary"
          requireReason
          reasonLabel="Adjustment Explanation & GL Account Target (Required):"
          reasonPlaceholder="e.g. Credit 1030 MTN Float and debit 4020 Settlement Clearing Variance for manual reconciliation..."
          onConfirm={handleConfirmAdjustment}
          onCancel={() => setIsResolveDialogOpen(false)}
        />
      )}
    </div>
  )
}
