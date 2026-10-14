import React, { useState } from 'react'
import { ListPageTemplate } from '@/components/common/ListPageTemplate'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, Phone } from 'lucide-react'

interface CustomersPageProps {
  onNavigate: (navId: string) => void
}

export const CustomersPage: React.FC<CustomersPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('all')
  const [activeStatus, setActiveStatus] = useState('all')
  const [searchVal, setSearchVal] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const TABS = [
    { id: 'all', label: 'All customers', count: 184 },
    { id: 'with_balance', label: 'Remaining balances', count: 142 },
    { id: 'high_volume', label: 'High volume enterprise', count: 18 },
  ]

  const STATUS_CHIPS = [
    { id: 'all', label: 'All KYC' },
    { id: 'verified', label: 'KYC Level 2 Verified' },
    { id: 'pending', label: 'KYC Level 1 Pending' },
    { id: 'unverified', label: 'Tier 0 Registered' },
    { id: 'suspended', label: 'Restricted' },
  ]

  const CUSTOMERS = [
    {
      id: 'CUST-001',
      name: 'Samuel Eto’o Fosso',
      email: 'samuel.etoo@diaspora-paris.fr',
      phone: '+33 6 12 34 56 78',
      country: 'France / Cameroon',
      kyc: 'verified',
      kycLabel: 'KYC Level 2',
      balance: '3 450 000 XAF',
      createdDate: '12 Jan 2026',
    },
    {
      id: 'CUST-002',
      name: 'Kribi Cocoa Cooperative Union',
      email: 'finance@kribi-agro.cm',
      phone: '+237 677 88 99 00',
      country: 'Cameroon',
      kyc: 'verified',
      kycLabel: 'Corporate Tier 3',
      balance: '48 200 000 XAF',
      createdDate: '04 Feb 2026',
    },
    {
      id: 'CUST-003',
      name: 'Marcelle Ngassa',
      email: 'm.ngassa@tech-douala.com',
      phone: '+237 699 11 22 33',
      country: 'Cameroon',
      kyc: 'verified',
      kycLabel: 'KYC Level 2',
      balance: '820 000 XAF',
      createdDate: '18 Feb 2026',
    },
    {
      id: 'CUST-004',
      name: 'Dr. Emmanuel Kamdem',
      email: 'kamdem@brussels-health.be',
      phone: '+32 470 12 34 56',
      country: 'Belgium / Cameroon',
      kyc: 'verified',
      kycLabel: 'KYC Level 2',
      balance: '1 250 000 XAF',
      createdDate: '01 Mar 2026',
    },
    {
      id: 'CUST-005',
      name: 'AfriWork Freelancer Pool',
      email: 'settlement@afriwork.org',
      phone: '+237 655 44 33 22',
      country: 'Cameroon',
      kyc: 'pending',
      kycLabel: 'KYC Review Pending',
      balance: '0 XAF',
      createdDate: '15 Mar 2026',
    },
    {
      id: 'CUST-006',
      name: 'Central Logistics Chad SARL',
      email: 'ops@chad-logistics.td',
      phone: '+235 66 11 22 33',
      country: 'Chad (CEMAC)',
      kyc: 'verified',
      kycLabel: 'Corporate Tier 3',
      balance: '12 900 000 XAF',
      createdDate: '22 Mar 2026',
    },
  ]

  const filtered = CUSTOMERS.filter((c) => {
    if (activeTab === 'with_balance' && c.balance.startsWith('0')) return false
    if (activeTab === 'high_volume' && !c.kycLabel.includes('Corporate')) return false
    if (activeStatus !== 'all' && c.kyc !== activeStatus) return false
    if (searchVal) {
      const q = searchVal.toLowerCase()
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <ListPageTemplate
      title="Customers"
      subtitle="View, verify, and manage all verified senders, commercial exporters, and beneficiary counter-parties."
      primaryActionLabel="Add customer"
      primaryActionShortcut="C"
      onPrimaryAction={() => alert('New customer modal: Enter email, full name, KYC tier')}
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      infoBanner={{
        message:
          'All customer balances are segregated in Tier-1 commercial partner escrow accounts.',
        linkText: 'Inspect escrow holdings',
        onLinkClick: () => onNavigate('balances'),
      }}
      statusChips={STATUS_CHIPS}
      activeStatusChip={activeStatus}
      onStatusChipChange={setActiveStatus}
      searchPlaceholder="Search by name, email, phone..."
      searchValue={searchVal}
      onSearchChange={setSearchVal}
      totalCount={filtered.length}
      currentPage={currentPage}
      pageSize={10}
      onPageChange={setCurrentPage}
      isEmpty={filtered.length === 0}
      emptyStateTitle="No customers found"
      emptyStateDescription="Try adjusting your search criteria or invite a new individual or corporate customer."
      emptyStateLinkText="View customer onboarding guide"
      onEmptyStateLinkClick={() => onNavigate('developers')}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">KYC / Compliance</th>
              <th className="py-3 px-4">Wallet Balance</th>
              <th className="py-3 px-4">Jurisdiction</th>
              <th className="py-3 px-4">Created Date</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filtered.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#001f5b] text-[#00c2c7] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {row.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{row.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{row.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 space-y-0.5">
                  <div className="flex items-center space-x-1.5 text-slate-700">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{row.email}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-400 font-mono text-[10px]">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{row.phone}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <Badge variant={row.kyc === 'verified' ? 'success' : 'warning'}>
                    {row.kycLabel}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{row.balance}</td>
                <td className="py-3.5 px-4 text-slate-600 font-medium">{row.country}</td>
                <td className="py-3.5 px-4 font-mono text-slate-400">{row.createdDate}</td>
                <td className="py-3.5 px-4 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate('kyc-review')}
                    className="text-xs h-7 px-2.5 border-slate-300"
                  >
                    View profile
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ListPageTemplate>
  )
}
