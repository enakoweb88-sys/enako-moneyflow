import React, { useState } from 'react'
import {
  Info,
  ArrowLeftRight,
  Plus,
  ArrowUpRight,
  HelpCircle,
  ChevronRight,
  Clock,
  Building,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface BalancesPageProps {
  onNavigate: (navId: string) => void
}

export const BalancesPage: React.FC<BalancesPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'payouts' | 'ledger'>('payouts')
  const [showAddAccountModal, setShowAddAccountModal] = useState(false)

  const currencyBalances = [
    {
      code: 'XAF',
      name: 'Central African CFA Franc',
      amount: '380 500 000 XAF',
      badge: 'Primary',
      note: 'Settles daily to commercial clearing accounts',
    },
    {
      code: 'EUR',
      name: 'Euro (SEPA Corridor)',
      amount: '120 400 EUR',
      badge: 'BEAC Parity 655.957',
      note: 'Next automatic clearing at 18:00 GMT+1',
    },
    {
      code: 'USD',
      name: 'US Dollar (ACH Corridor)',
      amount: '45 200 USD',
      badge: 'Wholesale FX',
      note: 'Settles via partner bank escrow',
    },
    {
      code: 'GBP',
      name: 'British Pound (Faster Payments)',
      amount: '18 300 GBP',
      badge: 'Fixed Margin',
      note: 'Continuous real-time settlement',
    },
  ]

  const recentPayoutActivity = [
    {
      id: 'PAY-8921',
      recipient: 'MTN MoMo Cameroon (+237 670•••)',
      amount: '2 500 000 XAF',
      status: 'Completed',
      time: '12 mins ago',
    },
    {
      id: 'PAY-8920',
      recipient: 'Orange Money Cameroon (+237 699•••)',
      amount: '1 800 000 XAF',
      status: 'Completed',
      time: '28 mins ago',
    },
    {
      id: 'PAY-8919',
      recipient: 'Commercial Bank of Chad Wire',
      amount: '15 000 000 XAF',
      status: 'Pending Approval',
      time: '1 hour ago',
    },
    {
      id: 'PAY-8918',
      recipient: 'UBA Cameroon Settlement',
      amount: '8 400 000 XAF',
      status: 'Completed',
      time: '2 hours ago',
    },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-150">
      {/* ── Page Header: Balances Total & Info Tooltip ── */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Balances</h1>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-[#001f5b]">
            482 900 000 XAF
          </span>
          <div className="group relative cursor-pointer">
            <Info className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block w-64 p-2 bg-slate-900 text-white text-[11px] rounded-md shadow-lg z-20 pointer-events-none">
              Combined value of all available float, clearing pockets, and escrow balances converted
              to XAF at official BEAC parity.
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
          <span className="w-2 h-2 rounded-full bg-[#00c2c7]" />
          <span>Real-time zero-sum reconciled</span>
        </div>
      </div>

      {/* ── Action Button Row with Prefix Icons ── */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('withdrawals')}
          className="border-slate-300 text-slate-800 hover:bg-slate-50 flex items-center space-x-1.5 h-8 text-xs font-semibold rounded-lg shadow-2xs"
        >
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
          <span>Pay out</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('manual-credit')}
          className="border-slate-300 text-slate-800 hover:bg-slate-50 flex items-center space-x-1.5 h-8 text-xs font-semibold rounded-lg shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 text-slate-500" />
          <span>Add funds</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddAccountModal(true)}
          className="border-slate-300 text-slate-800 hover:bg-slate-50 flex items-center space-x-1.5 h-8 text-xs font-semibold rounded-lg shadow-2xs"
        >
          <Building className="w-3.5 h-3.5 text-slate-500" />
          <span>Manage bank accounts</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('wallets-ledger')}
          className="border-slate-300 text-slate-800 hover:bg-slate-50 flex items-center space-x-1.5 h-8 text-xs font-semibold rounded-lg shadow-2xs"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
          <span>Transfer between accounts</span>
        </Button>

        <button
          type="button"
          className="ml-auto text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Feedback</span>
        </button>
      </div>

      {/* ── Main Layout: Primary Balance Card & Side Info Cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Primary Balance Card */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
          {/* Incoming Row */}
          <div className="p-5 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-600 uppercase font-mono tracking-wider">
                Incoming earnings
              </span>
              <div className="text-xl font-bold font-mono text-slate-900">12 450 000 XAF</div>
            </div>
            <span className="text-xs font-medium text-slate-500 font-mono">
              In transit from SEPA / ACH wires
            </span>
          </div>

          {/* Currency Breakdown List */}
          <div className="divide-y divide-slate-100">
            {currencyBalances.map((curr) => (
              <div
                key={curr.code}
                className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#001f5b]/5 border border-[#001f5b]/10 flex items-center justify-center font-mono font-bold text-xs text-[#001f5b]">
                    {curr.code}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900">{curr.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {curr.badge}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{curr.note}</span>
                  </div>
                </div>

                <div className="text-right sm:self-center">
                  <div className="text-base font-bold font-mono text-slate-900">{curr.amount}</div>
                  <button
                    type="button"
                    onClick={() => onNavigate('wallets-ledger')}
                    className="text-xs font-semibold text-[#001f5b] hover:underline"
                  >
                    View ledger
                  </button>
                </div>
              </div>
            ))}

            {/* "+ Add account" dashed/ghost row at bottom of card */}
            <button
              type="button"
              onClick={() => setShowAddAccountModal(true)}
              className="w-full p-4 border-t border-dashed border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-400" />
              <span>+ Add currency account</span>
            </button>
          </div>
        </div>

        {/* Right Column: Contextual Float & Setup Cards */}
        <div className="lg:col-span-4 space-y-6">
          {/* Float Threshold & Liquidity Warning Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-slate-900 uppercase">
                Provider Liquidity Float
              </span>
              <Badge variant="success">HEALTHY</Badge>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600">MTN MoMo Pool</span>
                  <span className="font-bold text-slate-900">82% (41M / 50M)</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#00c2c7] h-full w-[82%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600">Orange Money Pool</span>
                  <span className="font-bold text-slate-900">94% (47M / 50M)</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#00c2c7] h-full w-[94%]" />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Auto-rebalance: ON</span>
              <button
                type="button"
                onClick={() => onNavigate('connect')}
                className="font-semibold text-[#001f5b] hover:underline"
              >
                Configure floats
              </button>
            </div>
          </div>

          {/* Upcoming Unresolved Setup Action Card (Dashed Border) */}
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 bg-slate-50/50 space-y-3">
            <div className="flex items-center space-x-2 text-slate-700">
              <Building className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold uppercase tracking-wider font-mono">
                Upcoming Setup
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">Connect a settlement bank account</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Link your commercial treasury bank account in Cameroon, Gabon, or Chad to automate
              end-of-day ledger sweeps.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('connect')}
              className="w-full bg-white border-slate-300 text-slate-800 text-xs font-semibold h-8"
            >
              Add settlement bank
            </Button>
          </div>
        </div>
      </div>

      {/* ── Recent Activity Section with Tabs ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex space-x-6">
            <button
              type="button"
              onClick={() => setActiveTab('payouts')}
              className={`text-sm font-semibold pb-2 border-b-2 cursor-pointer transition-colors ${
                activeTab === 'payouts'
                  ? 'border-[#001f5b] text-[#001f5b]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Recent Payouts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ledger')}
              className={`text-sm font-semibold pb-2 border-b-2 cursor-pointer transition-colors ${
                activeTab === 'ledger'
                  ? 'border-[#001f5b] text-[#001f5b]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Ledger Postings
            </button>
          </div>

          <button
            type="button"
            onClick={() => onNavigate(activeTab === 'payouts' ? 'withdrawals' : 'wallets-ledger')}
            className="text-xs font-semibold text-[#001f5b] hover:underline flex items-center space-x-1"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeTab === 'payouts' ? (
          <div className="divide-y divide-slate-100">
            {recentPayoutActivity.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-[#00c2c7]" />
                  <div>
                    <span className="font-mono font-bold text-slate-800">{act.id}</span>
                    <span className="text-slate-500 ml-2">{act.recipient}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-mono font-bold text-slate-900">{act.amount}</span>
                  <Badge variant={act.status === 'Completed' ? 'success' : 'warning'}>
                    {act.status}
                  </Badge>
                  <span className="text-slate-400 font-mono hidden sm:inline">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center space-y-2 text-slate-400 text-xs">
            <Clock className="w-6 h-6 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600">Continuous double-entry journal active</p>
            <p>All debits and credits balance to zero variance.</p>
          </div>
        )}

        {/* Add Account Modal */}
        {showAddAccountModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-2xs animate-in fade-in">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Add Currency Account</h3>
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-600">
                Configure a new designated clearing or settlement ledger balance for supported
                corridors.
              </p>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Currency Code</label>
                  <select className="w-full border border-slate-300 rounded-md p-2 text-xs">
                    <option>CAD - Canadian Dollar</option>
                    <option>NGN - Nigerian Naira</option>
                    <option>KES - Kenyan Shilling</option>
                    <option>CHF - Swiss Franc</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Account Purpose</label>
                  <input
                    type="text"
                    defaultValue="Regional Settlement Float"
                    className="w-full border border-slate-300 rounded-md p-2 text-xs"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => setShowAddAccountModal(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowAddAccountModal(false)}
                  className="bg-[#001f5b] text-white"
                >
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
