import React, { useState } from 'react'
import { Download, BarChart2, X, CheckCircle2, Sparkles, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FeatureAnnouncement } from '@/components/common/FeatureAnnouncement'

interface ReconciliationExceptionsPageProps {
  onNavigate: (navId: string) => void
}

type ExceptionTab = 'needs_response' | 'in_review' | 'all' | 'resolved' | 'rejected'

export const ReconciliationExceptionsPage: React.FC<ReconciliationExceptionsPageProps> = ({
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<ExceptionTab>('needs_response')
  const [showAnnouncementBanner, setShowAnnouncementBanner] = useState(true)
  const [showFeatureModal, setShowFeatureModal] = useState(false)

  // Filter values
  const [filterReason, setFilterReason] = useState('All Reasons')
  const [filterSource, setFilterSource] = useState('All Sources')

  const TABS: Array<{ id: ExceptionTab; label: string; count: number }> = [
    { id: 'needs_response', label: 'Needs response', count: 3 },
    { id: 'in_review', label: 'In review', count: 5 },
    { id: 'all', label: 'All exceptions', count: 18 },
    { id: 'resolved', label: 'Resolved', count: 9 },
    { id: 'rejected', label: 'Rejected', count: 1 },
  ]

  const EXCEPTIONS_DATA = [
    {
      id: 'EXC-4091',
      reason: 'Provider Statement Discrepancy',
      source: 'MTN Mobile Money Cameroon',
      amount: '500 000 XAF',
      externalRef: 'MOMO-CMR-990142',
      dateOpened: 'Today, 09:30',
      dueBy: 'In 24 hours',
      assignedTo: 'Jean-Paul (Lead Treasury)',
      status: 'needs_response',
      explanation:
        'Partner MT940 statement reports debit of 500 000 XAF without matching internal remittance transaction ID.',
    },
    {
      id: 'EXC-4090',
      reason: 'SEPA Clearing Parity Rounding',
      source: 'UBA Paris EUR Clearing',
      amount: '4.20 EUR (2 755 XAF)',
      externalRef: 'SEPA-UBA-881023',
      dateOpened: 'Yesterday, 17:15',
      dueBy: 'In 48 hours',
      assignedTo: 'Nadine (Recon Officer)',
      status: 'needs_response',
      explanation:
        'Cumulative centime difference over 1,200 transactions exceeds automatic auto-reconciliation threshold.',
    },
    {
      id: 'EXC-4089',
      reason: 'Orange MoMo Delayed Webhook',
      source: 'Orange Money Douala',
      amount: '1 200 000 XAF',
      externalRef: 'OM-DLA-771920',
      dateOpened: 'Oct 1, 14:00',
      dueBy: 'In 12 hours',
      assignedTo: 'Samuel (Tech Lead)',
      status: 'needs_response',
      explanation:
        'Customer wallet credited on Orange platform, but webhook callback failed with HTTP 504 gateway timeout.',
    },
    {
      id: 'EXC-4085',
      reason: 'Duplicate Bank Wire Reference',
      source: 'Ecobank Yaoundé',
      amount: '4 500 000 XAF',
      externalRef: 'ECO-YDE-441029',
      dateOpened: 'Sep 29, 11:20',
      dueBy: 'Resolved',
      assignedTo: 'Jean-Paul',
      status: 'resolved',
      explanation:
        'Customer sent two wires using same invoice payment memo. Manual credit created for second wire.',
    },
  ]

  const filtered = EXCEPTIONS_DATA.filter((item) => {
    if (activeTab === 'all') return true
    return item.status === activeTab
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-150">
      {/* ── Page Header: Title & Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Reconciliation Exceptions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Resolve un-matched provider transactions, statement variances, and clearing disputes.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('reconciliation')}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs flex items-center space-x-1.5 h-8"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Reconciliation runs</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setShowFeatureModal(true)}
            className="bg-[#001f5b] hover:bg-[#001744] text-white text-xs flex items-center space-x-1.5 h-8 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00c2c7]" />
            <span>New: Automated matching</span>
          </Button>
        </div>
      </div>

      {/* ── Category Tabs (Plain Text, Stripe Style) ── */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8 overflow-x-auto no-scrollbar" aria-label="Exception Tabs">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 cursor-pointer ${
                  isActive
                    ? 'border-[#001f5b] text-[#001f5b]'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 text-xs rounded-full font-mono ${
                    isActive ? 'bg-[#001f5b]/10 text-[#001f5b]' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* ── Dismissible Announcement Banner (Matches Image 3) ── */}
      {showAnnouncementBanner && (
        <div className="p-4 bg-[#00c2c7]/10/70 border border-[#00c2c7]/30/80 rounded-xl flex items-center justify-between text-xs text-[#0a0f2c] animate-in fade-in duration-150">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-[#001f5b] shrink-0" />
            <span>
              <strong>Manage exceptions with automated matching:</strong> Reduce manual
              investigation times by 80% with our multi-source rules engine.
            </span>
            <button
              type="button"
              onClick={() => setShowFeatureModal(true)}
              className="font-bold underline underline-offset-2 hover:text-[#001f5b] cursor-pointer ml-1"
            >
              View announcement
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowAnnouncementBanner(false)}
            className="p-1 rounded text-[#001f5b] hover:text-[#0a0f2c] hover:bg-[#00c2c7]/15/60"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Dense Filter Chip Row + Export / Analyze Buttons (Image 3) ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* Reason Filter */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs shadow-2xs">
            <span className="text-slate-400 mr-1.5">Reason:</span>
            <select
              value={filterReason}
              onChange={(e) => setFilterReason(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 outline-hidden cursor-pointer"
            >
              <option>All Reasons</option>
              <option>Statement Discrepancy</option>
              <option>Parity Rounding</option>
              <option>Delayed Webhook</option>
              <option>Duplicate Reference</option>
            </select>
          </div>

          {/* Settlement Source Filter */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs shadow-2xs">
            <span className="text-slate-400 mr-1.5">Source:</span>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 outline-hidden cursor-pointer"
            >
              <option>All Sources</option>
              <option>MTN MoMo</option>
              <option>Orange Money</option>
              <option>UBA Paris</option>
              <option>Ecobank</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setFilterReason('All Reasons')
              setFilterSource('All Sources')
            }}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 underline underline-offset-2 ml-1 cursor-pointer"
          >
            Clear filters
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Exporting exceptions CSV...')}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs flex items-center space-x-1 h-8"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('reporting')}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs flex items-center space-x-1 h-8"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Analyze</span>
          </Button>
        </div>
      </div>

      {/* ── Exceptions Table or Calm Empty State (Image 3) ── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        {filtered.length === 0 ? (
          <div className="py-20 px-6 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
              <CheckCircle2 className="w-6 h-6 text-[#001f5b]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No items need a response</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                All provider statements and transaction ledgers are fully balanced. All incoming and
                outgoing ledger entries have zero variance.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('developers')}
              className="text-xs font-semibold text-[#001f5b] hover:text-[#0a0f2c] underline underline-offset-4 cursor-pointer"
            >
              View exception resolution rules
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Exception ID</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Clearing Source</th>
                  <th className="py-3 px-4">Disputed Amount</th>
                  <th className="py-3 px-4">Due By</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{item.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{item.reason}</td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{item.source}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.externalRef}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {item.amount}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-amber-700 font-semibold">
                      {item.dueBy}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{item.assignedTo}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          item.status === 'resolved'
                            ? 'success'
                            : item.status === 'in_review'
                              ? 'warning'
                              : 'danger'
                        }
                      >
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate('reconciliation')}
                        className="text-xs h-7 px-2.5 border-slate-300"
                      >
                        Investigate
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Feature Announcement Modal Pattern (Image 4) ── */}
      <FeatureAnnouncement
        isOpen={showFeatureModal}
        onClose={() => setShowFeatureModal(false)}
        headline="Accelerate settlement dispute resolution with Automated Matrix Matching"
        tagline="Release v2.4"
        paragraphs={[
          'Reconciliation exceptions no longer require manual statement scanning. Our new machine-learning matching engine compares MT940 statement entries, webhook payloads, and internal ledger transactions in real time.',
          'Transactions with identical amounts, matching provider timestamps within ±120 seconds, and verified recipient accounts are automatically resolved and cleared without human intervention.',
          'Review exception logs and establish custom dispute tolerance windows directly in your treasury settings.',
        ]}
        primaryButtonLabel="Got it, open matrix"
        onPrimaryClick={() => onNavigate('reconciliation')}
        secondaryLinkLabel="Read matching rules documentation"
        onSecondaryClick={() => onNavigate('developers')}
        previewCardTitle="Auto-Reconciled Corridor"
        previewBadge="99.4% Match Rate"
        previewDetails={[
          { label: 'Variance Tolerance', value: '±0.00 XAF' },
          { label: 'Avg Match Latency', value: '1.2s' },
          { label: 'Unresolved Count', value: '3 Items' },
          { label: 'Audit Trail Signature', value: 'VERIFIED' },
        ]}
      />
    </div>
  )
}
