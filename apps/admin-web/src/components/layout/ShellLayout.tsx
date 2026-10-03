import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Toaster } from 'sonner'
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  ArrowUpRight,
  CreditCard,
  Wallet,
  CheckSquare,
  Layers,
  TrendingUp,
  DollarSign,
  SlidersHorizontal,
  FileText,
  History,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMock } from '@/mock/MockContext'
import { ALL_ROLES, type UserRole } from '@/mock/data'

// Import All Real Admin Pages
import { DashboardPage } from '@/pages/DashboardPage'
import { CustomersPage } from '@/pages/CustomersPage'
import { KycReviewPage } from '@/pages/KycReviewPage'
import { RemittancesPage } from '@/pages/RemittancesPage'
import { ManualCreditPage } from '@/pages/ManualCreditPage'
import { WithdrawalsPage } from '@/pages/WithdrawalsPage'
import { ApprovalsPage } from '@/pages/ApprovalsPage'
import { WalletsLedgerPage } from '@/pages/WalletsLedgerPage'
import { FxRatesPage } from '@/pages/FxRatesPage'
import { FeesPage } from '@/pages/FeesPage'
import { ReconciliationPage } from '@/pages/ReconciliationPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { AuditLogsPage } from '@/pages/AuditLogsPage'
import { AdministrationPage } from '@/pages/AdministrationPage'

export const ShellLayout: React.FC = () => {
  const { t, i18n } = useTranslation()
  const {
    currentUser,
    setCurrentRole,
    isNavAllowed,
    kycCount,
    approvalsCount,
    withdrawalsAttentionCount,
    reconciliationOpenCount,
  } = useMock()

  const [activeNav, setActiveNav] = useState<string>('dashboard')

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'fr' : 'en'
    i18n.changeLanguage(nextLang)
  }

  // Navigation Group Hierarchy
  const navSections = [
    {
      label: t('sections.overview'),
      items: [{ id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard }],
    },
    {
      label: t('sections.customers'),
      items: [
        { id: 'customers', label: t('nav.customers'), icon: Users },
        { id: 'kyc-review', label: t('nav.kycReview'), count: kycCount, icon: ShieldCheck },
      ],
    },
    {
      label: t('sections.transactions'),
      items: [
        { id: 'remittances', label: t('nav.remittances'), icon: ArrowUpRight },
        { id: 'manual-credit', label: t('nav.manualCredit'), icon: CreditCard },
        {
          id: 'withdrawals',
          label: t('nav.withdrawals'),
          count: withdrawalsAttentionCount,
          icon: Wallet,
        },
        { id: 'approvals', label: t('nav.approvals'), count: approvalsCount, icon: CheckSquare },
      ],
    },
    {
      label: t('sections.finance'),
      items: [
        { id: 'wallets-ledger', label: t('nav.walletsLedger'), icon: Layers },
        { id: 'fx-rates', label: t('nav.fxRates'), icon: TrendingUp },
        { id: 'fees', label: t('nav.fees'), icon: DollarSign },
        {
          id: 'reconciliation',
          label: t('nav.reconciliation'),
          count: reconciliationOpenCount,
          icon: SlidersHorizontal,
        },
      ],
    },
    {
      label: t('sections.insights'),
      items: [
        { id: 'reports', label: t('nav.reports'), icon: FileText },
        { id: 'audit-logs', label: t('nav.auditLogs'), icon: History },
      ],
    },
    {
      label: t('sections.system'),
      items: [
        { id: 'administration', label: t('nav.administration'), icon: Settings },
        { id: 'settings', label: t('nav.settings'), icon: SlidersHorizontal },
      ],
    },
  ]

  // Render Current Active Page
  const renderCurrentPage = () => {
    // Check permission
    if (!isNavAllowed(activeNav)) {
      return (
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
          <div className="text-base font-bold text-rose-800 uppercase tracking-wide">
            Access Restricted
          </div>
          <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto">
            Your current assigned role ({currentUser.role}) does not have permission to view the{' '}
            <span className="font-semibold text-slate-900">{activeNav}</span> module. Please use the
            top-bar role switcher to test as Administrator or a manager with required entitlements.
          </p>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => setActiveNav('dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      )
    }

    switch (activeNav) {
      case 'dashboard':
        return <DashboardPage onNavigate={setActiveNav} />
      case 'customers':
        return <CustomersPage />
      case 'kyc-review':
        return <KycReviewPage />
      case 'remittances':
        return <RemittancesPage />
      case 'manual-credit':
        return <ManualCreditPage />
      case 'withdrawals':
        return <WithdrawalsPage />
      case 'approvals':
        return <ApprovalsPage />
      case 'wallets-ledger':
        return <WalletsLedgerPage />
      case 'fx-rates':
        return <FxRatesPage />
      case 'fees':
        return <FeesPage />
      case 'reconciliation':
        return <ReconciliationPage />
      case 'reports':
        return <ReportsPage />
      case 'audit-logs':
        return <AuditLogsPage />
      case 'administration':
        return <AdministrationPage initialTab="users" />
      case 'settings':
        return <AdministrationPage initialTab="settings" />
      default:
        return <DashboardPage onNavigate={setActiveNav} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans relative">
      <Toaster position="top-right" />

      {/* Top Header Bar — Oxford Navy Brand Palette */}
      <header className="bg-[#001f5b] text-white h-16 px-6 flex items-center justify-between border-b border-[#001744] shadow-sm shrink-0">
        <div className="flex items-center space-x-3.5">
          <div className="bg-white/10 ring-1 ring-white/20 px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider text-white">
            E-NAKO
          </div>
          <span className="font-bold text-lg tracking-tight text-white">{t('app.title')}</span>
          <span className="text-[11px] font-semibold bg-[#001744] text-slate-300 px-2.5 py-0.5 rounded-full border border-white/10 hidden sm:inline-block">
            {t('app.environment')}
          </span>
        </div>

        <div className="flex items-center space-x-5">
          {/* User & Interactive Role Switcher */}
          <div className="flex items-center space-x-3 text-right">
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-white">{currentUser.name}</div>
              <div className="text-[11px] text-slate-300">{currentUser.role}</div>
            </div>

            {/* Quick Role Switcher for verification */}
            <div className="hidden md:flex items-center space-x-1.5 bg-[#001744] px-2.5 py-1.5 rounded-lg border border-white/10">
              <span className="text-[11px] text-slate-300 font-medium">Role:</span>
              <select
                value={currentUser.role}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer"
              >
                {ALL_ROLES.map((r) => (
                  <option key={r} value={r} className="bg-[#001f5b] text-white">
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Language Toggle Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="text-xs bg-[#001744] text-white border border-white/15 px-3 py-1.5 rounded-lg hover:bg-[#001233] transition-colors cursor-pointer font-semibold"
          >
            {t('shell.language')}: {i18n.language.toUpperCase()}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Full Expanded Sidebar Navigation — enako-os Clean White with Oxford Navy Accents */}
        <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 hidden md:flex shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
          <div className="p-3 overflow-y-auto scrollbar-hide">
            {navSections.map((section, sIdx) => {
              // Filter items visible to current role
              const allowedItems = section.items.filter((item) => isNavAllowed(item.id))
              if (allowedItems.length === 0) return null

              return (
                <div key={section.label} className={sIdx > 0 ? 'mt-4' : ''}>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
                    {section.label}
                  </div>
                  <nav className="space-y-0.5">
                    {allowedItems.map((item) => {
                      const isActive = activeNav === item.id
                      const Icon = item.icon
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveNav(item.id)}
                          className={`relative w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-150 ease-in-out cursor-pointer active:scale-[0.98] flex items-center justify-between group ${
                            isActive
                              ? 'bg-[#001f5b]/10 text-[#001f5b] font-bold'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                          }`}
                        >
                          {/* Active Pill Indicator on left border — ENAKO Oxford Navy #001f5b */}
                          {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3.5px] h-6 bg-[#001f5b] rounded-r-full shadow-xs" />
                          )}

                          <div className="flex items-center gap-2.5 truncate">
                            {Icon && (
                              <Icon
                                className={`w-4 h-4 shrink-0 transition-colors ${
                                  isActive
                                    ? 'text-[#001f5b]'
                                    : 'text-slate-400 group-hover:text-slate-700'
                                }`}
                              />
                            )}
                            <span className="truncate">{item.label}</span>
                          </div>

                          {/* Work queue counter badge */}
                          {item.count !== undefined && item.count > 0 && (
                            <span
                              className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                                isActive
                                  ? 'bg-[#001f5b]/20 text-[#001f5b] font-bold'
                                  : 'bg-slate-100 text-slate-500 font-semibold'
                              }`}
                            >
                              {item.count}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </nav>
                </div>
              )
            })}
          </div>

          {/* Engine Status Block with Avatar Initials */}
          <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#001f5b]/10 border border-[#001f5b]/20 flex items-center justify-center text-xs font-bold text-[#001f5b] shrink-0">
                {currentUser.name
                  .split(' ')
                  .map((w: string) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  PostgreSQL 16 Engine
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto">{renderCurrentPage()}</div>
        </main>
      </div>
    </div>
  )
}

export default ShellLayout
