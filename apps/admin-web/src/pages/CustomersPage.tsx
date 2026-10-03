import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Tabs } from '@/components/ui/tabs'
import { useMock } from '@/mock/MockContext'
import type { Customer } from '@/mock/data'

export const CustomersPage: React.FC = () => {
  const { customers, suspendCustomer, restoreCustomer, unmaskCustomerField, currentUser } =
    useMock()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [kycFilter, setKycFilter] = useState('ALL')

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [detailTab, setDetailTab] = useState('overview')
  const [revealedFields, setRevealedFields] = useState<Record<string, boolean>>({})

  // Suspend Dialog
  const [suspendTarget, setSuspendTarget] = useState<Customer | null>(null)

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phoneMasked.includes(searchTerm) ||
        c.phoneReal.includes(searchTerm)

      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter
      const matchesKyc = kycFilter === 'ALL' || c.kycLevel === kycFilter

      return matchesSearch && matchesStatus && matchesKyc
    })
  }, [customers, searchTerm, statusFilter, kycFilter])

  const handleOpenDetail = (cust: Customer) => {
    setSelectedCustomer(cust)
    setDetailTab('overview')
    setRevealedFields({})
  }

  const handleRevealField = (fieldKey: string, fieldLabel: string) => {
    if (!selectedCustomer) return
    setRevealedFields((prev) => ({ ...prev, [fieldKey]: true }))
    unmaskCustomerField(selectedCustomer.id, fieldLabel)
  }

  const getStatusBadgeVariant = (status: Customer['status']) => {
    switch (status) {
      case 'Active':
        return 'success'
      case 'Suspended':
        return 'danger'
      case 'Pending verification':
        return 'warning'
      case 'Closed':
        return 'neutral'
    }
  }

  const canManageCustomers =
    currentUser.role === 'Administrator' ||
    currentUser.role === 'Operations Manager' ||
    currentUser.role === 'Compliance Officer'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        subtitle="Customer registry, KYC classifications, multi-currency wallets, and compliance profiles"
      />

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <Input
                placeholder="Search by customer name, email, phone, or customer number..."
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
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Pending verification">Pending verification</option>
                <option value="Closed">Closed</option>
              </select>

              <select
                value={kycFilter}
                onChange={(e) => setKycFilter(e.target.value)}
                className="h-10 px-3 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="ALL">All KYC Tiers</option>
                <option value="Tier 1">Tier 1</option>
                <option value="Tier 2">Tier 2</option>
                <option value="Tier 3">Tier 3</option>
              </select>

              {(searchTerm || statusFilter !== 'ALL' || kycFilter !== 'ALL') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('ALL')
                    setKycFilter('ALL')
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

      {/* Customer Registry Table */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Customer Accounts ({filteredCustomers.length})
            </CardTitle>
            <span className="text-xs text-slate-500">Click View to open customer details</span>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">Customer No.</th>
                <th className="py-3 px-6">Name & Email</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">KYC Tier</th>
                <th className="py-3 px-6">Date Joined</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-sans">
                    No customers found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-700">
                      {cust.customerNumber}
                    </td>
                    <td className="py-3.5 px-6 font-sans">
                      <div className="font-semibold text-slate-900">{cust.name}</div>
                      <div className="text-xs text-slate-500">{cust.email}</div>
                    </td>
                    <td className="py-3.5 px-6 font-sans">
                      <Badge variant={getStatusBadgeVariant(cust.status)}>{cust.status}</Badge>
                    </td>
                    <td className="py-3.5 px-6 font-sans font-medium text-slate-700">
                      {cust.kycLevel}
                    </td>
                    <td className="py-3.5 px-6 font-sans text-slate-600">{cust.dateJoined}</td>
                    <td className="py-3.5 px-6 text-right font-sans">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDetail(cust)}
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

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={selectedCustomer.name}
          subtitle={`Account No: ${selectedCustomer.customerNumber} | Joined: ${selectedCustomer.dateJoined}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Header Core Details & Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <Badge variant={getStatusBadgeVariant(selectedCustomer.status)}>
                  {selectedCustomer.status}
                </Badge>
                <Badge variant="info">{selectedCustomer.kycLevel}</Badge>
                <span className="text-xs text-slate-500 font-mono">{selectedCustomer.email}</span>
              </div>
              {canManageCustomers && (
                <div>
                  {selectedCustomer.status === 'Active' ? (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setSuspendTarget(selectedCustomer)}
                      className="text-xs"
                    >
                      Suspend Customer
                    </Button>
                  ) : selectedCustomer.status === 'Suspended' ? (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        restoreCustomer(selectedCustomer.id)
                        setSelectedCustomer((prev) => (prev ? { ...prev, status: 'Active' } : null))
                      }}
                      className="text-xs"
                    >
                      Restore Customer
                    </Button>
                  ) : null}
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <Tabs
              tabs={[
                { id: 'overview', label: 'Overview' },
                { id: 'kyc', label: 'KYC & Identity' },
                { id: 'wallets', label: 'Wallets', count: selectedCustomer.wallets.length },
                {
                  id: 'beneficiaries',
                  label: 'Beneficiaries',
                  count: selectedCustomer.beneficiariesCount,
                },
                { id: 'audit', label: 'Audit Trail' },
              ]}
              activeTab={detailTab}
              onChange={setDetailTab}
            />

            {/* Tab 1: Overview */}
            {detailTab === 'overview' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded border border-slate-200">
                    <span className="text-slate-500 font-semibold block uppercase">
                      Residential Address
                    </span>
                    <span className="text-slate-800 font-medium text-sm mt-1 block">
                      {selectedCustomer.address}
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded border border-slate-200">
                    <span className="text-slate-500 font-semibold block uppercase">
                      Total Balance (XAF Eq.)
                    </span>
                    <span className="text-slate-900 font-bold text-sm mt-1 block font-mono">
                      {selectedCustomer.wallets
                        .reduce(
                          (sum, w) =>
                            sum + (w.currency === 'EUR' ? w.balance * 655.957 : w.balance),
                          0
                        )
                        .toLocaleString()}{' '}
                      XAF
                    </span>
                  </div>
                </div>

                {/* Masked Sensitive Fields Block */}
                <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-3">
                  <div className="font-semibold text-slate-800 uppercase tracking-wide">
                    Sensitive Profile Attributes (Masked by Default)
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-slate-200">
                    <div>
                      <span className="text-slate-500 block font-medium">Telephone Number</span>
                      <span className="font-mono text-sm text-slate-900">
                        {revealedFields.phone
                          ? selectedCustomer.phoneReal
                          : selectedCustomer.phoneMasked}
                      </span>
                    </div>
                    {!revealedFields.phone && (
                      <button
                        type="button"
                        onClick={() => handleRevealField('phone', 'Phone Number')}
                        className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline cursor-pointer"
                      >
                        Show
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <span className="text-slate-500 block font-medium">
                        National Identity / Passport No.
                      </span>
                      <span className="font-mono text-sm text-slate-900">
                        {revealedFields.nationalId
                          ? selectedCustomer.nationalIdReal
                          : selectedCustomer.nationalIdMasked}
                      </span>
                    </div>
                    {!revealedFields.nationalId && (
                      <button
                        type="button"
                        onClick={() => handleRevealField('nationalId', 'National ID Number')}
                        className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline cursor-pointer"
                      >
                        Show
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: KYC */}
            {detailTab === 'kyc' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200 flex justify-between">
                  <span className="text-slate-600 font-medium">Assigned Tier:</span>
                  <Badge variant="info">{selectedCustomer.kycLevel}</Badge>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 flex justify-between">
                  <span className="text-slate-600 font-medium">Daily Allowed Limit:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {selectedCustomer.kycLevel === 'Tier 3'
                      ? '25,000,000 XAF'
                      : selectedCustomer.kycLevel === 'Tier 2'
                        ? '2,000,000 XAF'
                        : '200,000 XAF'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 flex justify-between">
                  <span className="text-slate-600 font-medium">Verification Status:</span>
                  <span className="font-semibold text-emerald-700">Verified & Approved</span>
                </div>
              </div>
            )}

            {/* Tab 3: Wallets */}
            {detailTab === 'wallets' && (
              <div className="space-y-3">
                {selectedCustomer.wallets.map((w) => (
                  <div
                    key={w.currency}
                    className="p-3 bg-white rounded border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{w.currency} Wallet</span>
                      <span className="text-slate-500 block">Status: Active</span>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-slate-900 text-sm">
                        {w.balance.toLocaleString()} {w.currency}
                      </div>
                      {w.held > 0 && (
                        <div className="text-amber-700">
                          Held: {w.held.toLocaleString()} {w.currency}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: Beneficiaries */}
            {detailTab === 'beneficiaries' && (
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-900 block">
                      Hélène Ngannou (Mother)
                    </span>
                    <span className="text-slate-500 font-mono">MTN MoMo: +237 6••••••56</span>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-900 block">
                      Jean-Marc Fosso (Brother)
                    </span>
                    <span className="text-slate-500 font-mono">Orange Money: +237 6••••••12</span>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>
            )}

            {/* Tab 5: Audit Trail */}
            {detailTab === 'audit' && (
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="flex justify-between font-mono text-slate-500">
                    <span>2026-10-01 19:42</span>
                    <span>Compliance Officer</span>
                  </div>
                  <div className="font-semibold text-slate-800 mt-1">
                    UNMASK_CUSTOMER_DATA — Viewed National ID Number
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    Reason: Compliance audit inspection for high-value remittance review.
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Suspend Confirmation Dialog */}
      {suspendTarget && (
        <ConfirmDialog
          isOpen={!!suspendTarget}
          title={`Suspend Customer Account: ${suspendTarget.name}`}
          description="Suspending this customer will immediately freeze outgoing withdrawals and flag all pending remittances for manual review. A written explanation is required for compliance audit logging."
          confirmLabel="Suspend Customer"
          cancelLabel="Cancel"
          variant="destructive"
          requireReason
          reasonLabel="Reason for suspension (Required):"
          reasonPlaceholder="e.g. Unpaid bounced cheque, AML alert match, or legal court order..."
          onConfirm={(reason) => {
            suspendCustomer(suspendTarget.id, reason)
            if (selectedCustomer?.id === suspendTarget.id) {
              setSelectedCustomer((prev) => (prev ? { ...prev, status: 'Suspended' } : null))
            }
            setSuspendTarget(null)
          }}
          onCancel={() => setSuspendTarget(null)}
        />
      )}
    </div>
  )
}
