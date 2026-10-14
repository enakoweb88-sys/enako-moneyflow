import React, { useState } from 'react'
import { ListPageTemplate } from '@/components/common/ListPageTemplate'
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-react'

interface TransactionsPageProps {
  onNavigate: (navId: string) => void
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('all')
  const [activeStatus, setActiveStatus] = useState('all')
  const [searchVal, setSearchVal] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const TABS = [
    { id: 'remittances', label: 'Remittances', count: 84 },
    { id: 'withdrawals', label: 'Withdrawals', count: 42 },
    { id: 'manual-credits', label: 'Manual credits', count: 12 },
    { id: 'fees', label: 'Fees collected', count: 65 },
    { id: 'transfers', label: 'Internal transfers', count: 8 },
    { id: 'all', label: 'All activity', count: 211 },
  ]

  const STATUS_CHIPS = [
    { id: 'all', label: 'All' },
    { id: 'completed', label: 'Completed' },
    { id: 'pending', label: 'Pending' },
    { id: 'flagged', label: 'Flagged / Review' },
    { id: 'failed', label: 'Failed' },
    { id: 'reversed', label: 'Reversed' },
    { id: 'blocked', label: 'Blocked' },
  ]

  // Mock Transactions Dataset
  const TRANSACTIONS = [
    {
      id: 'TXN-9081',
      sender: 'Jean-Luc Dupont',
      source: 'EUR 1,200.00',
      netXaf: '787 148 XAF',
      channel: 'MTN MoMo Cameroon',
      account: '+237 670 11 22 33',
      status: 'Completed',
      date: 'Today, 14:22',
      type: 'remittances',
    },
    {
      id: 'TXN-9080',
      sender: 'Kribi Cocoa Export Co.',
      source: 'EUR 25,000.00',
      netXaf: '16 398 925 XAF',
      channel: 'UBA Cameroon Wire',
      account: 'CM21 1003 3001 0002',
      status: 'Completed',
      date: 'Today, 13:50',
      type: 'remittances',
    },
    {
      id: 'TXN-9079',
      sender: 'Marcelle N.',
      source: 'USD 450.00',
      netXaf: '273 789 XAF',
      channel: 'Orange Money Cameroon',
      account: '+237 699 44 55 66',
      status: 'Pending',
      date: 'Today, 12:10',
      type: 'remittances',
    },
    {
      id: 'TXN-9078',
      sender: 'Treasury Float Rebalance',
      source: 'XAF 10,000,000',
      netXaf: '10 000 000 XAF',
      channel: 'MTN Provider Clearing Pool',
      account: 'POCKET-MTN-01',
      status: 'Completed',
      date: 'Today, 10:45',
      type: 'transfers',
    },
    {
      id: 'TXN-9077',
      sender: 'Samuel Eto’o Fosso',
      source: 'EUR 500.00',
      netXaf: '327 978 XAF',
      channel: 'MTN MoMo Cameroon',
      account: '+237 677 88 99 00',
      status: 'Completed',
      date: 'Yesterday, 19:15',
      type: 'remittances',
    },
    {
      id: 'TXN-9076',
      sender: 'AfriWork Freelance Payout',
      source: 'USD 2,400.00',
      netXaf: '1 460 208 XAF',
      channel: 'Orange Money Cameroon',
      account: '+237 690 12 34 56',
      status: 'Flagged',
      date: 'Yesterday, 16:30',
      type: 'withdrawals',
    },
    {
      id: 'TXN-9075',
      sender: 'Manual Correction Adjust',
      source: 'XAF 150,000',
      netXaf: '150 000 XAF',
      channel: 'Client Escrow Adjust',
      account: 'ACC-CL-0092',
      status: 'Completed',
      date: 'Yesterday, 14:02',
      type: 'manual-credits',
    },
  ]

  // Filter logic
  const filtered = TRANSACTIONS.filter((t) => {
    if (activeTab !== 'all' && t.type !== activeTab) return false
    if (activeStatus !== 'all' && t.status.toLowerCase() !== activeStatus.toLowerCase())
      return false
    if (searchVal) {
      const q = searchVal.toLowerCase()
      return (
        t.id.toLowerCase().includes(q) ||
        t.sender.toLowerCase().includes(q) ||
        t.account.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <ListPageTemplate
      title="Transactions"
      subtitle="Unified real-time activity feed across all currency corridors, mobile money channels, and ledger postings."
      primaryActionLabel="Create manual credit"
      primaryActionShortcut="N"
      onPrimaryAction={() => onNavigate('manual-credit')}
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      infoBanner={{
        message:
          "Use Reconciliation's automated matching engine to resolve partner statement differences faster.",
        linkText: 'Explore reconciliation runs',
        onLinkClick: () => onNavigate('reconciliation'),
      }}
      statusChips={STATUS_CHIPS}
      activeStatusChip={activeStatus}
      onStatusChipChange={setActiveStatus}
      searchPlaceholder="Search by ID, sender, phone..."
      searchValue={searchVal}
      onSearchChange={setSearchVal}
      totalCount={filtered.length}
      currentPage={currentPage}
      pageSize={10}
      onPageChange={setCurrentPage}
      isEmpty={filtered.length === 0}
      emptyStateTitle="No transactions match this view"
      emptyStateDescription="Try resetting your status filters or searching with a different transaction reference ID."
      emptyStateLinkText="View transaction documentation"
      onEmptyStateLinkClick={() => onNavigate('developers')}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">Sender / Entity</th>
              <th className="py-3 px-4">Source Amount</th>
              <th className="py-3 px-4">Net XAF Settled</th>
              <th className="py-3 px-4">Destination Channel</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filtered.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{row.id}</td>
                <td className="py-3.5 px-4 font-medium text-slate-800">{row.sender}</td>
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">{row.source}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{row.netXaf}</td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-800">{row.channel}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{row.account}</div>
                </td>
                <td className="py-3.5 px-4">
                  <Badge
                    variant={
                      row.status === 'Completed'
                        ? 'success'
                        : row.status === 'Pending'
                          ? 'warning'
                          : 'danger'
                    }
                  >
                    {row.status}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-500">{row.date}</td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => onNavigate('remittances')}
                    className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                    title="Inspect details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ListPageTemplate>
  )
}
