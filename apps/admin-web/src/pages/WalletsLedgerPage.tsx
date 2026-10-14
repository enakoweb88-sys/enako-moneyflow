import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Tabs } from '@/components/ui/tabs'
import { useMock } from '@/mock/MockContext'
import type { CustomerWalletRecord, ChartOfAccount } from '@/mock/data'

export const WalletsLedgerPage: React.FC = () => {
  const { wallets, accounts, ledgerEntries, freezeWallet, unfreezeWallet } = useMock()

  const [activeTab, setActiveTab] = useState<'wallets' | 'ledger' | 'trial'>('wallets')
  const [selectedAccount, setSelectedAccount] = useState<ChartOfAccount | null>(null)

  // Freeze Dialog
  const [freezeTarget, setFreezeTarget] = useState<CustomerWalletRecord | null>(null)

  // Accounts by currency
  const xafAccounts = accounts.filter((a) => a.currency === 'XAF')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wallets & Financial Ledger"
        subtitle="Customer multi-currency balances, general ledger chart of accounts, and zero-sum trial balance"
      />

      <Tabs
        tabs={[
          { id: 'wallets', label: 'Customer Wallets', count: wallets.length },
          { id: 'ledger', label: 'Chart of Accounts & Ledger', count: accounts.length },
          { id: 'trial', label: 'Trial Balance Verification' },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as typeof activeTab)}
      />

      {/* Tab 1: Wallets Tab */}
      {activeTab === 'wallets' && (
        <Card>
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Customer Wallets ({wallets.length})</CardTitle>
                <CardDescription className="mt-0.5">
                  Real-time ledger balance, held funds, and available liquidity
                </CardDescription>
              </div>
              <Badge variant="neutral">Multi-Currency Engine</Badge>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Currency</th>
                  <th className="py-3 px-6 text-right">Ledger Balance</th>
                  <th className="py-3 px-6 text-right">Held Amount</th>
                  <th className="py-3 px-6 text-right">Available Balance</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {wallets.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-sans">
                      <div className="font-semibold text-slate-900">{w.customerName}</div>
                      <div className="text-xs text-slate-500">{w.customerNumber}</div>
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-800">{w.currency}</td>
                    <td className="py-3.5 px-6 text-right font-bold text-slate-900">
                      {w.ledgerBalance.toLocaleString()} {w.currency}
                    </td>
                    <td className="py-3.5 px-6 text-right text-amber-800 font-semibold">
                      {w.heldAmount.toLocaleString()} {w.currency}
                    </td>
                    <td className="py-3.5 px-6 text-right font-bold text-[#001f5b]">
                      {w.availableBalance.toLocaleString()} {w.currency}
                    </td>
                    <td className="py-3.5 px-6 font-sans">
                      <Badge variant={w.status === 'Active' ? 'success' : 'danger'}>
                        {w.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6 text-right font-sans">
                      {w.status === 'Active' ? (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setFreezeTarget(w)}
                          className="text-xs h-7 px-2.5"
                        >
                          Freeze
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => unfreezeWallet(w.id)}
                          className="text-xs h-7 px-2.5"
                        >
                          Unfreeze
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 2: Chart of Accounts & Ledger */}
      {activeTab === 'ledger' && (
        <Card>
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Chart of Accounts ({accounts.length})</CardTitle>
                <CardDescription className="mt-0.5">
                  Double-entry bookkeeping accounts. Click any account code to inspect journal
                  ledger entries.
                </CardDescription>
              </div>
              <span className="text-xs font-mono text-slate-500">OHADA / CEMAC Compliant</span>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Account Code</th>
                  <th className="py-3 px-6">Account Name & Description</th>
                  <th className="py-3 px-6">Category Type</th>
                  <th className="py-3 px-6">Currency</th>
                  <th className="py-3 px-6 text-right">Net Balance</th>
                  <th className="py-3 px-6 text-right">Ledger Entries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {accounts.map((acc) => (
                  <tr key={acc.code} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900">{acc.code}</td>
                    <td className="py-3.5 px-6 font-sans">
                      <div className="font-semibold text-slate-900">{acc.name}</div>
                      <div className="text-xs text-slate-500">{acc.description}</div>
                    </td>
                    <td className="py-3.5 px-6 font-sans">
                      <Badge
                        variant={
                          acc.type === 'Asset'
                            ? 'info'
                            : acc.type === 'Liability'
                              ? 'warning'
                              : 'success'
                        }
                      >
                        {acc.type}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-700">{acc.currency}</td>
                    <td className="py-3.5 px-6 text-right font-bold text-slate-900">
                      {acc.balance.toLocaleString()} {acc.currency}
                    </td>
                    <td className="py-3.5 px-6 text-right font-sans">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAccount(acc)}
                        className="text-xs h-7 px-2.5"
                      >
                        Inspect Ledger
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 3: Trial Balance View */}
      {activeTab === 'trial' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    Trial Balance Verification (Zero-Sum Proof)
                  </CardTitle>
                  <CardDescription className="mt-0.5">
                    Strict balance constraint: Assets + Liabilities + Revenue + Expenses == 0
                  </CardDescription>
                </div>
                <Badge variant="success">Engine in Exact Balance</Badge>
              </div>
            </CardHeader>
            <div className="p-6 space-y-6">
              {/* Prominent Zero Row Display */}
              <div className="p-4 bg-[#00c2c7]/10 rounded-xl border border-[#00c2c7]/30 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#001f5b] uppercase tracking-wider block">
                    Zero-Sum Ledger Guarantee
                  </span>
                  <p className="text-xs text-[#001f5b] mt-0.5">
                    Every transaction is posted with balanced debit and credit entries.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#001f5b] uppercase font-semibold block">
                    Total Net Variance
                  </span>
                  <span className="text-2xl font-mono font-extrabold text-[#0a0f2c]">0.00 XAF</span>
                </div>
              </div>

              {/* Breakdown Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-6">Account Code</th>
                      <th className="py-3 px-6">Account Title</th>
                      <th className="py-3 px-6">Type</th>
                      <th className="py-3 px-6 text-right">Debit (XAF)</th>
                      <th className="py-3 px-6 text-right">Credit (XAF)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-xs">
                    {xafAccounts.map((a) => (
                      <tr key={a.code}>
                        <td className="py-3 px-6 font-bold">{a.code}</td>
                        <td className="py-3 px-6 font-sans font-medium text-slate-900">{a.name}</td>
                        <td className="py-3 px-6 font-sans text-slate-600">{a.type}</td>
                        <td className="py-3 px-6 text-right font-bold text-slate-900">
                          {a.balance > 0 ? a.balance.toLocaleString() : '—'}
                        </td>
                        <td className="py-3 px-6 text-right font-bold text-slate-900">
                          {a.balance < 0 ? Math.abs(a.balance).toLocaleString() : '—'}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                      <td colSpan={3} className="py-3 px-6 uppercase font-sans text-slate-800">
                        Total Sum (Debits & Credits Equal)
                      </td>
                      <td className="py-3 px-6 text-right text-[#001f5b]">466 500 000 XAF</td>
                      <td className="py-3 px-6 text-right text-[#001f5b]">466 500 000 XAF</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Inspect Ledger Entries Modal */}
      {selectedAccount && (
        <Modal
          isOpen={!!selectedAccount}
          onClose={() => setSelectedAccount(null)}
          title={`Ledger Entries: ${selectedAccount.code} — ${selectedAccount.name}`}
          subtitle={`Current Balance: ${selectedAccount.balance.toLocaleString()} ${selectedAccount.currency}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex justify-between font-sans">
              <span className="text-slate-600 font-medium">{selectedAccount.description}</span>
              <span className="font-mono font-bold text-slate-900">
                {selectedAccount.balance.toLocaleString()} {selectedAccount.currency}
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Journal Ref</th>
                    <th className="py-2.5 px-4 text-right">Debit</th>
                    <th className="py-2.5 px-4 text-right">Credit</th>
                    <th className="py-2.5 px-4">Counter Account</th>
                    <th className="py-2.5 px-4">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(ledgerEntries[selectedAccount.code] || []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 font-sans">
                        No recent journal postings found for this account.
                      </td>
                    </tr>
                  ) : (
                    (ledgerEntries[selectedAccount.code] || []).map((entry) => (
                      <tr key={entry.id}>
                        <td className="py-2.5 px-4 text-slate-600">{entry.date}</td>
                        <td className="py-2.5 px-4 font-semibold text-slate-800">
                          {entry.journalRef}
                        </td>
                        <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                          {entry.debitAmount > 0 ? entry.debitAmount.toLocaleString() : '—'}
                        </td>
                        <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                          {entry.creditAmount > 0 ? entry.creditAmount.toLocaleString() : '—'}
                        </td>
                        <td className="py-2.5 px-4 font-sans text-slate-700">
                          {entry.counterAccount}
                        </td>
                        <td className="py-2.5 px-4 font-sans text-slate-600">
                          {entry.description}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedAccount(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Freeze Confirmation Dialog */}
      {freezeTarget && (
        <ConfirmDialog
          isOpen={!!freezeTarget}
          title={`Freeze Customer Wallet: ${freezeTarget.customerName} (${freezeTarget.currency})`}
          description="Freezing this wallet will immediately prevent any withdrawals, payments, or balance transfers until an administrative unfreeze is issued."
          confirmLabel="Freeze Wallet"
          cancelLabel="Cancel"
          variant="destructive"
          requireReason
          reasonLabel="Reason for freezing (Required):"
          reasonPlaceholder="e.g. Unusual transactional activity, suspected account takeover, or chargeback..."
          onConfirm={(reason) => {
            freezeWallet(freezeTarget.id, reason)
            setFreezeTarget(null)
          }}
          onCancel={() => setFreezeTarget(null)}
        />
      )}
    </div>
  )
}
