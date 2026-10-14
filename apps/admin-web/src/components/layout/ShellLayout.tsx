import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Toaster, toast } from 'sonner'
import {
  Home,
  Scale,
  ArrowLeftRight,
  Users,
  BookOpen,
  Layers,
  Network,
  CreditCard,
  SlidersHorizontal,
  BarChart3,
  Settings,
  MoreHorizontal,
  Search,
  Grid,
  HelpCircle,
  Bell,
  Plus,
  ChevronDown,
  Star,
  X,
  CheckSquare,
  AlertTriangle,
  Wallet,
  TrendingUp,
  ChevronUp,
  ChevronRight,
  User,
  Info,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMock } from '@/mock/MockContext'
import { ALL_ROLES, type UserRole } from '@/mock/data'

// Reusable Chrome & Flow Components
import { OnboardingWizard } from '@/components/common/OnboardingWizard'
import { SetupGuide } from '@/components/common/SetupGuide'
import { CoachMark } from '@/components/common/CoachMark'

// All Admin Page Views
import { DashboardPage } from '@/pages/DashboardPage'
import { BalancesPage } from '@/pages/BalancesPage'
import { TransactionsPage } from '@/pages/TransactionsPage'
import { CustomersPage } from '@/pages/CustomersPage'
import { ProductCatalogPage } from '@/pages/ProductCatalogPage'
import { ConnectPartnersPage } from '@/pages/ConnectPartnersPage'
import { ReconciliationExceptionsPage } from '@/pages/ReconciliationExceptionsPage'
import { AnalyticsOverviewPage } from '@/pages/AnalyticsOverviewPage'
import { DevelopersPage } from '@/pages/DevelopersPage'
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
  const { i18n } = useTranslation()
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

  // Setup Guide & Coach Mark states
  const [showSetupGuide, setShowSetupGuide] = useState<boolean>(false)
  const [showCoachMark, setShowCoachMark] = useState<boolean>(false)

  // First-run Onboarding state (persisted per user)
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false)

  // Top Bar Search & Quick-Create Dialogs
  const [searchOpen, setSearchOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [quickCreateOpen, setQuickCreateOpen] = useState<boolean>(false)
  const [helpMenuOpen, setHelpMenuOpen] = useState<boolean>(false)
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState<boolean>(false)
  const [showCreateSubmenu, setShowCreateSubmenu] = useState<boolean>(false)
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false)
  const workspaceMenuRef = useRef<HTMLDivElement>(null)

  // Close workspace dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (workspaceMenuRef.current && !workspaceMenuRef.current.contains(e.target as Node)) {
        setWorkspaceMenuOpen(false)
        setShowCreateSubmenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Collapsible Products in Sidebar
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    treasury: false,
    connect: false,
    payments: false,
    billing: false,
    reporting: false,
    apps: false,
    more: false,
  })

  // Check Onboarding & CoachMark on Mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const onboardingDone = localStorage.getItem('enako_admin_onboarding_done')
      if (!onboardingDone) {
        setShowOnboarding(true)
      }

      const coachMarkSeen = localStorage.getItem('enako_coachmark_connect_seen')
      if (!coachMarkSeen && onboardingDone) {
        // Trigger contextual coach mark after onboarding
        setShowCoachMark(true)
      }
    }
  }, [])

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setQuickCreateOpen(false)
        setHelpMenuOpen(false)
        setWorkspaceMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'fr' : 'en'
    i18n.changeLanguage(nextLang)
  }

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

  const handleDismissCoachMark = () => {
    setShowCoachMark(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('enako_coachmark_connect_seen', 'true')
    }
  }

  // Top-level sidebar items matching Stripe
  const topNavItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'balances', label: 'Balances', icon: Scale },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'product-catalog', label: 'Product catalog', icon: BookOpen },
  ]

  // Starred Shortcuts pinned by admin
  const shortcutItems = [
    {
      id: 'reconciliation',
      label: 'Billing overview',
      icon: SlidersHorizontal,
      count: reconciliationOpenCount,
    },
    { id: 'exceptions', label: 'Disputes & Exceptions', icon: AlertTriangle },
    { id: 'approvals', label: 'Dual-Approvals', icon: CheckSquare, count: approvalsCount },
  ]

  // Collapsible Products navigation hierarchy
  const productSections = [
    {
      key: 'treasury',
      label: 'Treasury',
      icon: Layers,
      items: [
        { id: 'wallets-ledger', label: 'Wallets & Ledger' },
        { id: 'balances', label: 'Control Accounts' },
      ],
    },
    {
      key: 'connect',
      label: 'Connect',
      icon: Network,
      items: [{ id: 'connect', label: 'Partner Connections' }],
    },
    {
      key: 'payments',
      label: 'Payments',
      icon: CreditCard,
      items: [
        { id: 'remittances', label: 'Remittances' },
        { id: 'withdrawals', label: 'Withdrawals', count: withdrawalsAttentionCount },
        { id: 'manual-credit', label: 'Manual Credits' },
      ],
    },
    {
      key: 'billing',
      label: 'Billing',
      icon: SlidersHorizontal,
      items: [
        { id: 'reconciliation', label: 'Reconciliation', count: reconciliationOpenCount },
        { id: 'exceptions', label: 'Exceptions Queue' },
        { id: 'fees', label: 'Fee Rules' },
      ],
    },
    {
      key: 'reporting',
      label: 'Reporting',
      icon: BarChart3,
      items: [
        { id: 'analytics', label: 'Your overview' },
        { id: 'reports', label: 'Financial Reports' },
      ],
    },
    {
      key: 'apps',
      label: 'Apps',
      icon: Settings,
      items: [
        { id: 'administration', label: 'User Directory & Roles' },
        { id: 'settings', label: 'System Settings' },
      ],
    },
    {
      key: 'more',
      label: 'More',
      icon: MoreHorizontal,
      items: [
        { id: 'audit-logs', label: 'Audit Trail' },
        { id: 'approvals', label: 'Maker-Checker Queue', count: approvalsCount },
        { id: 'kyc-review', label: 'KYC Reviews', count: kycCount },
        { id: 'fx-rates', label: 'FX Rate Matrix' },
      ],
    },
  ]

  // Quick Command Search Items
  const searchablePages = [
    { id: 'dashboard', title: 'Home (Today overview)', category: 'Core' },
    { id: 'balances', title: 'Balances & Control Accounts', category: 'Treasury' },
    { id: 'transactions', title: 'Unified Transactions Feed', category: 'Payments' },
    { id: 'customers', title: 'Customer Directory & KYC Profiles', category: 'Core' },
    { id: 'product-catalog', title: 'Product Catalog (Fee & FX Rules)', category: 'Products' },
    { id: 'connect', title: 'Connect Partner Gateways (MTN, Orange, Banks)', category: 'Connect' },
    { id: 'exceptions', title: 'Reconciliation Exceptions (Disputes)', category: 'Billing' },
    { id: 'analytics', title: 'Analytics / Your Overview', category: 'Reporting' },
    { id: 'developers', title: 'Developers API & Webhooks', category: 'System' },
    { id: 'remittances', title: 'Remittance Operations', category: 'Payments' },
    { id: 'withdrawals', title: 'Withdrawal Approvals', category: 'Payments' },
    { id: 'manual-credit', title: 'Manual Balance Credits', category: 'Payments' },
    { id: 'wallets-ledger', title: 'Double-entry General Ledger', category: 'Treasury' },
    { id: 'fx-rates', title: 'Foreign Exchange Rate Board', category: 'Treasury' },
    { id: 'fees', title: 'Tiered Fee Configurations', category: 'Billing' },
    { id: 'reconciliation', title: 'Bank & Telco Reconciliation', category: 'Billing' },
    { id: 'reports', title: 'Financial Balance Sheet & Reports', category: 'Reporting' },
    { id: 'audit-logs', title: 'Immutable Audit Trail', category: 'Compliance' },
    { id: 'approvals', title: 'Dual Maker-Checker Work Queue', category: 'Compliance' },
    { id: 'kyc-review', title: 'Customer KYC Review Queue', category: 'Compliance' },
    { id: 'administration', title: 'Staff Directory & Entitlements', category: 'Apps' },
  ]

  const filteredSearchPages =
    searchQuery.trim() === ''
      ? searchablePages.slice(0, 8)
      : searchablePages.filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )

  // Render Current Active Page with permission check
  const renderCurrentPage = () => {
    if (!isNavAllowed(activeNav)) {
      return (
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-xs">
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
              Return to Home
            </Button>
          </div>
        </div>
      )
    }

    switch (activeNav) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={setActiveNav}
            showSetupGuide={showSetupGuide}
            onToggleSetupGuide={() => setShowSetupGuide(!showSetupGuide)}
          />
        )
      case 'balances':
        return <BalancesPage onNavigate={setActiveNav} />
      case 'transactions':
        return <TransactionsPage onNavigate={setActiveNav} />
      case 'customers':
        return <CustomersPage onNavigate={setActiveNav} />
      case 'product-catalog':
        return <ProductCatalogPage onNavigate={setActiveNav} />
      case 'connect':
        return <ConnectPartnersPage onNavigate={setActiveNav} />
      case 'exceptions':
        return <ReconciliationExceptionsPage onNavigate={setActiveNav} />
      case 'analytics':
        return <AnalyticsOverviewPage onNavigate={setActiveNav} />
      case 'developers':
        return <DevelopersPage />
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
        return (
          <DashboardPage
            onNavigate={setActiveNav}
            showSetupGuide={showSetupGuide}
            onToggleSetupGuide={() => setShowSetupGuide(!showSetupGuide)}
          />
        )
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#001f5b]/10 selection:text-[#001f5b]">
      <Toaster position="top-right" />

      {/* ============================================================ */}
      {/* GLOBAL TOP BAR (Workspace, Search, Actions, Setup Guide)     */}
      {/* ============================================================ */}
      <header className="bg-white text-slate-800 h-13 px-4 flex items-center justify-between border-b border-slate-200/90 shadow-2xs shrink-0 z-30 select-none">
        {/* Left: Workspace switcher & Corner Section */}
        <div className="flex items-center space-x-3">
          <div className="relative" ref={workspaceMenuRef}>
            <button
              type="button"
              onClick={() => {
                setWorkspaceMenuOpen(!workspaceMenuOpen)
                setShowCreateSubmenu(false)
              }}
              className={`flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer group ${
                workspaceMenuOpen
                  ? 'bg-slate-100 text-slate-900 shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
              aria-label="Workspace switcher"
            >
              <div className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200/80">
                E
              </div>
              <span className="text-sm font-semibold tracking-tight text-slate-900">Enako</span>
              {workspaceMenuOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-600 transition-transform" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform" />
              )}
            </button>

            {/* Exact Corner Dropdown Matching Screenshot */}
            {workspaceMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-3 px-2 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-100 select-none">
                {/* 1. Org Identity Header */}
                <div className="flex flex-col items-center pt-1 pb-3">
                  <div className="w-12 h-9 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200/60 shadow-2xs">
                    <span className="text-xs font-bold text-slate-600 tracking-wider">EN</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-2">Enako</h3>
                </div>

                {/* 2. Workspace Navigation & Actions */}
                <div className="space-y-0.5">
                  {/* Settings */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveNav('settings')
                      setWorkspaceMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer group"
                  >
                    <Settings
                      className="w-4 h-4 text-slate-500 group-hover:text-slate-700"
                      strokeWidth={1.75}
                    />
                    <span>Settings</span>
                  </button>

                  {/* Create */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCreateSubmenu(!showCreateSubmenu)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <Plus
                          className="w-4 h-4 text-slate-500 group-hover:text-slate-700"
                          strokeWidth={2}
                        />
                        <span>Create</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                    </button>

                    {/* Quick Create Submenu */}
                    {showCreateSubmenu && (
                      <div className="absolute left-full top-0 ml-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                          Create New
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveNav('manual-credit')
                            setShowCreateSubmenu(false)
                            setWorkspaceMenuOpen(false)
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center space-x-2 text-slate-700 cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          <span>Manual credit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveNav('withdrawals')
                            setShowCreateSubmenu(false)
                            setWorkspaceMenuOpen(false)
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center space-x-2 text-slate-700 cursor-pointer"
                        >
                          <Wallet className="w-3.5 h-3.5 text-slate-400" />
                          <span>Initiate withdrawal</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveNav('customers')
                            setShowCreateSubmenu(false)
                            setWorkspaceMenuOpen(false)
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center space-x-2 text-slate-700 cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>Add customer</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveNav('wallets-ledger')
                            setShowCreateSubmenu(false)
                            setWorkspaceMenuOpen(false)
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center space-x-2 text-slate-700 cursor-pointer"
                        >
                          <Layers className="w-3.5 h-3.5 text-slate-400" />
                          <span>Open ledger account</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Divider Line */}
                <div className="h-px bg-slate-100 my-2 mx-1" />

                {/* 4. User Profile & Sign Out */}
                <div className="space-y-0.5">
                  <div
                    onClick={() => setShowUserDetails(!showUserDetails)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 truncate min-w-0">
                      <User className="w-4 h-4 text-slate-500 shrink-0" strokeWidth={1.75} />
                      <span className="truncate text-slate-800 font-medium">
                        Nounga Joseph Youmi
                      </span>
                    </div>
                    <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2" />
                  </div>

                  {showUserDetails && (
                    <div className="mx-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 space-y-1">
                      <div className="font-semibold text-slate-900">Nounga Joseph Youmi</div>
                      <div className="text-slate-500 font-mono text-[10px]">
                        nounga.youmi@enako.com
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 mt-1">
                        <span className="text-slate-500">Role:</span>
                        <span className="font-semibold text-slate-800">{currentUser.role}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setWorkspaceMenuOpen(false)
                      toast.info('Signed out successfully')
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:text-rose-600 hover:bg-rose-50/50 text-xs font-medium transition-colors cursor-pointer group"
                  >
                    <LogOut
                      className="w-4 h-4 text-slate-500 group-hover:text-rose-600"
                      strokeWidth={1.75}
                    />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Global Search Bar matching Stripe screenshot */}
        <div className="flex-1 max-w-sm mx-4 hidden sm:block">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="w-full bg-slate-100/80 hover:bg-slate-100 text-slate-500 text-xs px-3 py-1.5 rounded-lg border border-transparent hover:border-slate-200/80 flex items-center justify-between transition-colors cursor-pointer group"
          >
            <div className="flex items-center space-x-2">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              <span className="text-slate-400 group-hover:text-slate-600">Search</span>
            </div>
            <kbd className="text-[10px] bg-white border border-slate-200/80 px-1.5 py-0.5 rounded-sm font-mono text-slate-400 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center space-x-2.5">
          {/* Setup Guide Pill with Circular Progress Ring */}
          <button
            type="button"
            onClick={() => setShowSetupGuide(!showSetupGuide)}
            className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200/70 text-slate-700 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200/80 transition-colors cursor-pointer"
            title="Open Setup Guide"
          >
            <svg className="w-3.5 h-3.5 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#00c2c7]"
                strokeDasharray="40, 100"
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="text-[11px] font-semibold text-slate-700">Setup guide</span>
          </button>

          {/* Quick-Create Circular "+" Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setQuickCreateOpen(!quickCreateOpen)}
              className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/80 flex items-center justify-center font-bold shadow-2xs transition-transform active:scale-95 cursor-pointer"
              title="Create new payment, account or customer"
              aria-label="Quick create"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Quick-Create Dropdown */}
            {quickCreateOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Quick Actions
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav('manual-credit')
                    setQuickCreateOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center space-x-2 text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  <span>Create manual credit</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav('withdrawals')
                    setQuickCreateOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center space-x-2 text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  <Wallet className="w-3.5 h-3.5 text-slate-400" />
                  <span>Initiate withdrawal</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav('customers')
                    setQuickCreateOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center space-x-2 text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Add customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav('wallets-ledger')
                    setQuickCreateOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center space-x-2 text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Open ledger account</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav('fx-rates')
                    setQuickCreateOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center space-x-2 text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                  <span>Propose FX rate</span>
                </button>
              </div>
            )}
          </div>

          {/* Functional Icon Affordances: Apps, Help, Notifications, Settings */}
          <button
            type="button"
            onClick={() => setActiveNav('administration')}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Apps & Admin"
            aria-label="Apps"
          >
            <Grid className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setHelpMenuOpen(!helpMenuOpen)}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Help & Onboarding"
              aria-label="Help"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            {helpMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowOnboarding(true)
                    setHelpMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center space-x-2 text-slate-700 cursor-pointer font-medium"
                >
                  <span>Relaunch Onboarding Wizard</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCoachMark(true)
                    setHelpMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center space-x-2 text-slate-700 cursor-pointer"
                >
                  <span>Show Guided Tour Spotlight</span>
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav('developers')
                    setHelpMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center space-x-2 text-slate-700 cursor-pointer"
                >
                  <span>API Documentation</span>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setActiveNav('approvals')}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer relative"
            title="Notifications & Queues"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {(approvalsCount > 0 || withdrawalsAttentionCount > 0) && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('settings')}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Interactive Role Switcher */}
          <div className="hidden lg:flex items-center space-x-1.5 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">
              Role:
            </span>
            <select
              value={currentUser.role}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-transparent text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              {ALL_ROLES.map((r) => (
                <option key={r} value={r} className="bg-white text-slate-900">
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Language Toggle Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="text-[11px] bg-slate-100 text-slate-700 border border-slate-200/80 px-2 py-1 rounded-md hover:bg-slate-200/70 transition-colors cursor-pointer font-semibold"
          >
            {i18n.language.toUpperCase()}
          </button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 3. MAIN WORKSPACE (Sidebar + Content Canvas)                 */}
      {/* ============================================================ */}
      <div className="flex flex-1 overflow-hidden">
        {/* Stripe-Fidelity Hierarchical Sidebar */}
        <aside className="w-60 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 hidden md:flex shadow-[1px_0_3px_rgba(0,0,0,0.02)] select-none">
          <div className="p-3 overflow-y-auto scrollbar-hide space-y-4">
            {/* 3.1 Top-Level Core Items (Home, Balances, Transactions, Customers, Product Catalog) */}
            <nav className="space-y-0.5">
              {topNavItems.map((item) => {
                const isActive = activeNav === item.id
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveNav(item.id)}
                    className={`relative w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-all duration-150 ease-in-out cursor-pointer flex items-center justify-between group ${
                      isActive
                        ? 'bg-[#001f5b]/10 text-[#001f5b] font-bold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 bg-[#001f5b] rounded-r-full" />
                    )}
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-[#001f5b]' : 'text-slate-400 group-hover:text-slate-700'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                  </button>
                )
              })}
            </nav>

            {/* 3.2 Pinned Shortcuts Group */}
            <div>
              <div className="flex items-center justify-between px-2.5 mb-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500/20" />
                  <span>Shortcuts</span>
                </div>
              </div>
              <nav className="space-y-0.5">
                {shortcutItems.map((item) => {
                  const isActive = activeNav === item.id
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveNav(item.id)}
                      className={`relative w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-all duration-150 ease-in-out cursor-pointer flex items-center justify-between group ${
                        isActive
                          ? 'bg-[#001f5b]/10 text-[#001f5b] font-bold'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive
                              ? 'text-[#001f5b]'
                              : 'text-slate-400 group-hover:text-slate-700'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.count !== undefined && item.count > 0 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                          {item.count}
                        </span>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* 3.3 Collapsible Products Group */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 mb-1.5">
                Products
              </div>
              <div className="space-y-0.5">
                {productSections.map((section) => {
                  const isExpanded = !!expandedSections[section.key]
                  const Icon = section.icon
                  const hasActiveChild = section.items.some((i) => i.id === activeNav)

                  return (
                    <div key={section.key} className="space-y-0.5">
                      <button
                        type="button"
                        onClick={() => toggleSection(section.key)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer flex items-center justify-between group ${
                          hasActiveChild
                            ? 'text-[#001f5b] font-semibold'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0" />
                          <span className="truncate">{section.label}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>

                      {/* Nested Indented Sub-items */}
                      {isExpanded && (
                        <div className="pl-6 pr-1 space-y-0.5 border-l-2 border-slate-100 ml-4 py-0.5">
                          {section.items.map((subItem) => {
                            const isSubActive = activeNav === subItem.id
                            return (
                              <button
                                key={subItem.id}
                                type="button"
                                onClick={() => setActiveNav(subItem.id)}
                                className={`w-full text-left px-2 py-1 rounded text-xs transition-colors cursor-pointer flex items-center justify-between ${
                                  isSubActive
                                    ? 'bg-[#001f5b]/10 text-[#001f5b] font-bold'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
                                }`}
                              >
                                <span className="truncate">{subItem.label}</span>
                                {subItem.count !== undefined && subItem.count > 0 && (
                                  <span className="text-[10px] font-mono px-1 rounded bg-slate-100 text-slate-600 font-bold">
                                    {subItem.count}
                                  </span>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto">{renderCurrentPage()}</div>
        </main>
      </div>

      {/* ============================================================ */}
      {/* 4. DOCKED SETUP GUIDE SLIDE-OVER / PANEL                     */}
      {/* ============================================================ */}
      <SetupGuide
        isOpen={showSetupGuide}
        onClose={() => setShowSetupGuide(false)}
        onStepClick={(step) => {
          if (step.actionRoute) {
            setActiveNav(step.actionRoute)
            setShowSetupGuide(false)
          }
        }}
      />

      {/* ============================================================ */}
      {/* 5. CONTEXTUAL GUIDED COACH-MARK SPOTLIGHT OVERLAY            */}
      {/* ============================================================ */}
      <CoachMark
        isOpen={showCoachMark}
        title="Next, connect a payment provider"
        description="Integrate MTN Mobile Money, Orange Money, or your settlement bank partner to begin processing live float and transfers."
        actionLabel="Go to Connect Partners"
        onAction={() => setActiveNav('connect')}
        onDismiss={handleDismissCoachMark}
        stepIndicator="Guided Setup · Step 2 of 4"
      />

      {/* ============================================================ */}
      {/* 6. SANDBOX-FIRST ONBOARDING WIZARD (6-STEP MODAL)            */}
      {/* ============================================================ */}
      <OnboardingWizard
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => {
          setShowOnboarding(false)
          setShowCoachMark(true)
        }}
      />

      {/* ============================================================ */}
      {/* 7. GLOBAL COMMAND / SEARCH PALETTE MODAL (⌘K)                */}
      {/* ============================================================ */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/50 backdrop-blur-2xs animate-in fade-in duration-100">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-100">
            <div className="p-3 border-b border-slate-100 flex items-center space-x-2">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search modules, actions, documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto p-2 divide-y divide-slate-50">
              {filteredSearchPages.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">No results found</div>
              ) : (
                filteredSearchPages.map((page) => (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => {
                      setActiveNav(page.id)
                      setSearchOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-50 flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 group-hover:text-[#001f5b]">
                        {page.title}
                      </div>
                      <div className="text-[10px] text-slate-400">{page.category}</div>
                    </div>
                    <span className="text-[10px] text-slate-400 group-hover:text-slate-600">
                      Jump →
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShellLayout
