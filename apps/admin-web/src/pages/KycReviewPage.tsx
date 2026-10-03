import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useMock } from '@/mock/MockContext'
import type { KycReviewItem } from '@/mock/data'

export const KycReviewPage: React.FC = () => {
  const { kycQueue, decideKyc, kycCount } = useMock()

  const [activeItem, setActiveItem] = useState<KycReviewItem | null>(null)
  const [viewingDoc, setViewingDoc] = useState<string | null>(null)

  // Decision Dialog State
  const [decisionType, setDecisionType] = useState<
    'Approve' | 'Request more info' | 'Reject' | null
  >(null)

  const getStatusBadgeVariant = (status: KycReviewItem['status']) => {
    switch (status) {
      case 'Approved':
        return 'success'
      case 'Pending':
      case 'Under Review':
        return 'warning'
      case 'More Info Requested':
        return 'info'
      case 'Rejected':
        return 'danger'
    }
  }

  const handleOpenDecision = (type: 'Approve' | 'Request more info' | 'Reject') => {
    setDecisionType(type)
  }

  const handleConfirmDecision = (reason: string) => {
    if (!activeItem || !decisionType) return
    decideKyc(activeItem.id, decisionType, reason)
    setActiveItem(null)
    setDecisionType(null)
    setViewingDoc(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="KYC Review Queue"
        subtitle="Identity verification queue, submitted identification dossier analysis, and tier approvals"
      />

      {/* Main Review Queue Table */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Pending Applications ({kycCount})</CardTitle>
              <CardDescription className="mt-0.5">
                Compliance officer dual review for Tier 2 and Tier 3 account upgrades
              </CardDescription>
            </div>
            <Badge variant="warning">{kycCount} Pending Actions</Badge>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">Customer Name</th>
                <th className="py-3 px-6">Submitted Date</th>
                <th className="py-3 px-6">Requested Tier</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Assigned Reviewer</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {kycQueue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-sans font-semibold text-slate-900">
                    {item.customerName}
                  </td>
                  <td className="py-3.5 px-6 text-slate-600 font-sans">{item.submittedDate}</td>
                  <td className="py-3.5 px-6 font-sans">
                    <Badge variant="info">{item.requestedTier}</Badge>
                  </td>
                  <td className="py-3.5 px-6 font-sans">
                    <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                  </td>
                  <td className="py-3.5 px-6 font-sans text-slate-600">{item.assignedReviewer}</td>
                  <td className="py-3.5 px-6 text-right font-sans">
                    <Button
                      variant={item.status === 'Approved' ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => {
                        setActiveItem(item)
                        setViewingDoc(null)
                      }}
                      className="text-xs h-7 px-3"
                    >
                      {item.status === 'Approved' ? 'View' : 'Review'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Review Detail Modal */}
      {activeItem && (
        <Modal
          isOpen={!!activeItem}
          onClose={() => {
            setActiveItem(null)
            setViewingDoc(null)
          }}
          title={`KYC Application: ${activeItem.customerName}`}
          subtitle={`Submitted: ${activeItem.submittedDate} | Target: ${activeItem.requestedTier}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Split Layout: Identity Info vs Documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Side: Submitted Identity Info */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="font-semibold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2">
                  Submitted Identity Information
                </div>

                <div>
                  <span className="text-slate-500 block font-medium">Full Legal Name</span>
                  <span className="font-semibold text-slate-900 text-sm font-sans">
                    {activeItem.customerName}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block font-medium">Date of Birth</span>
                  <span className="font-mono text-slate-800">{activeItem.dateOfBirth}</span>
                </div>

                <div>
                  <span className="text-slate-500 block font-medium">Nationality</span>
                  <span className="font-sans text-slate-800">{activeItem.nationality}</span>
                </div>

                <div>
                  <span className="text-slate-500 block font-medium">Country of Residence</span>
                  <span className="font-sans text-slate-800">{activeItem.residenceCountry}</span>
                </div>

                <div>
                  <span className="text-slate-500 block font-medium">Document Type & Number</span>
                  <span className="font-mono text-slate-800 font-semibold">
                    {activeItem.idDocType} — {activeItem.idDocNumber}
                  </span>
                </div>

                {activeItem.reviewNotes && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-amber-800 font-semibold block">
                      Previous Review Notes:
                    </span>
                    <p className="text-slate-700 italic mt-0.5">{activeItem.reviewNotes}</p>
                  </div>
                )}
              </div>

              {/* Right Side: Uploaded Documents */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="font-semibold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2">
                  Uploaded Verification Documents
                </div>

                <div className="space-y-2">
                  {activeItem.documents.map((doc) => (
                    <div
                      key={doc.name}
                      className="p-3 bg-white rounded border border-slate-200 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 font-mono">{doc.name}</span>
                        <span className="text-slate-400 font-mono">{doc.size}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                        <span className="text-slate-500">{doc.type}</span>
                        <button
                          type="button"
                          onClick={() => setViewingDoc(doc.name)}
                          className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline cursor-pointer"
                        >
                          View Document
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Document Viewer Preview Block */}
                {viewingDoc && (
                  <div className="mt-4 p-3 bg-white rounded border border-emerald-300">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="font-semibold text-emerald-800">Preview: {viewingDoc}</span>
                      <button
                        type="button"
                        onClick={() => setViewingDoc(null)}
                        className="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
                      >
                        Close Preview
                      </button>
                    </div>
                    <div className="py-6 px-4 text-center bg-slate-50 mt-2 rounded border border-slate-200 font-mono text-slate-600">
                      [Document Viewer: Verified Watermark — Authenticity Check Passed for{' '}
                      {viewingDoc}]
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Decision Panel */}
            <div className="p-4 bg-slate-100 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase block tracking-wider">
                  Compliance Decision Panel
                </span>
                <span className="text-xs text-slate-600">
                  Each action requires a written justification for audit records.
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDecision('Request more info')}
                >
                  Request More Info
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleOpenDecision('Reject')}>
                  Reject
                </Button>
                <Button variant="default" size="sm" onClick={() => handleOpenDecision('Approve')}>
                  Approve Application
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Decision Confirmation Dialog */}
      {decisionType && activeItem && (
        <ConfirmDialog
          isOpen={!!decisionType}
          title={`Confirm KYC Decision: ${decisionType}`}
          description={`You are about to record a ${decisionType} decision for customer ${activeItem.customerName}. Please specify your formal compliance rationale below.`}
          confirmLabel={decisionType === 'Approve' ? 'Confirm Approval' : decisionType}
          variant={
            decisionType === 'Approve'
              ? 'primary'
              : decisionType === 'Reject'
                ? 'destructive'
                : 'secondary'
          }
          requireReason
          reasonLabel="Compliance Justification (Required):"
          reasonPlaceholder={
            decisionType === 'Approve'
              ? 'e.g. National ID verified against government civil registry. Proof of address authentic.'
              : decisionType === 'Request more info'
                ? 'e.g. Please provide a high-resolution scan of your national ID back side.'
                : 'e.g. Documents failed authenticity verification.'
          }
          onConfirm={handleConfirmDecision}
          onCancel={() => setDecisionType(null)}
        />
      )}
    </div>
  )
}
