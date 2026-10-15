import React, { createContext, useContext, useState } from 'react'
import {
  type UserRole,
  type CurrentUser,
  ROLE_PERMISSIONS,
  type DashboardKPIs,
  type UrgentAttentionItem,
  type Customer,
  type KycReviewItem,
  type Remittance,
  type ManualCredit,
  type Withdrawal,
  type ApprovalItem,
  type CustomerWalletRecord,
  type ChartOfAccount,
  type FxRate,
  type FeeRule,
  type ReconciliationRun,
  type AuditLogRecord,
  type LedgerEntry,
  type StaffUser,
  type SystemSetting,
} from './data'
import { toast } from 'sonner'

const EMPTY_CURRENT_USER: CurrentUser = {
  id: '',
  name: 'Administrator',
  role: 'Administrator',
  email: '',
}

const EMPTY_KPIS: DashboardKPIs = {
  remittanceVolumeToday: 0,
  withdrawalVolumeToday: 0,
  feeIncomeMonth: 0,
  pendingApprovals: 0,
  openReconciliationItems: 0,
}

const EMPTY_URGENT_ITEMS: UrgentAttentionItem[] = []

interface MockContextType {
  currentUser: CurrentUser
  setCurrentRole: (role: UserRole) => void
  isNavAllowed: (navId: string) => boolean

  // Data collections
  kpis: DashboardKPIs
  urgentItems: UrgentAttentionItem[]
  customers: Customer[]
  kycQueue: KycReviewItem[]
  remittances: Remittance[]
  manualCredits: ManualCredit[]
  withdrawals: Withdrawal[]
  approvals: ApprovalItem[]
  approvalsHistory: ApprovalItem[]
  wallets: CustomerWalletRecord[]
  accounts: ChartOfAccount[]
  ledgerEntries: Record<string, LedgerEntry[]>
  fxRates: FxRate[]
  feeRules: FeeRule[]
  reconRuns: ReconciliationRun[]
  auditLogs: AuditLogRecord[]
  staffUsers: StaffUser[]
  systemSettings: SystemSetting[]

  // Work queue counts
  kycCount: number
  approvalsCount: number
  withdrawalsAttentionCount: number
  reconciliationOpenCount: number

  // Actions
  suspendCustomer: (customerId: string, reason: string) => void
  restoreCustomer: (customerId: string) => void
  unmaskCustomerField: (customerId: string, fieldName: string) => void
  decideKyc: (
    kycId: string,
    decision: 'Approve' | 'Request more info' | 'Reject',
    reason: string
  ) => void
  verifyRemittancePayment: (remittanceId: string) => void
  rejectRemittancePayment: (remittanceId: string, reason: string) => void
  createManualCredit: (params: {
    customerId: string
    currency: string
    amount: number
    exchangeRate: number
    evidenceFileName: string
    notes: string
  }) => void
  decideApproval: (
    approvalId: string,
    decision: 'Approve' | 'Reject' | 'Return',
    reason: string
  ) => void
  proposeFxRate: (params: {
    currencyPair: string
    baseRate: number
    customerRate: number
    reason: string
  }) => void
  createFeeRule: (params: {
    transactionType: string
    currency: string
    structureType: FeeRule['structureType']
    structureSummary: string
    tiers?: { from: number; to: number; rate: string }[]
  }) => void
  freezeWallet: (walletId: string, reason: string) => void
  unfreezeWallet: (walletId: string) => void
  resolveReconItem: (runId: string, itemId: string, explanation: string) => void
  inviteStaffUser: (params: { name: string; email: string; role: UserRole }) => void
  updateSystemSetting: (settingId: string, newValue: string) => void
  addAuditLog: (entry: Omit<AuditLogRecord, 'id' | 'timestamp'>) => void
}

const MockContext = createContext<MockContextType | undefined>(undefined)

export const MockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(EMPTY_CURRENT_USER)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [kycQueue, setKycQueue] = useState<KycReviewItem[]>([])
  const [remittances, setRemittances] = useState<Remittance[]>([])
  const [manualCredits, setManualCredits] = useState<ManualCredit[]>([])
  const [withdrawals] = useState<Withdrawal[]>([])
  const [approvals, setApprovals] = useState<ApprovalItem[]>([])
  const [approvalsHistory, setApprovalsHistory] = useState<ApprovalItem[]>([])
  const [wallets, setWallets] = useState<CustomerWalletRecord[]>([])
  const [accounts] = useState<ChartOfAccount[]>([])
  const [ledgerEntries] = useState<Record<string, LedgerEntry[]>>({})
  const [fxRates, setFxRates] = useState<FxRate[]>([])
  const [feeRules, setFeeRules] = useState<FeeRule[]>([])
  const [reconRuns, setReconRuns] = useState<ReconciliationRun[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([])
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([])
  const [systemSettings, setSystemSettings] = useState<SystemSetting[]>([])

  const setCurrentRole = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }))
    toast.success(`Active role switched to: ${role}`)
  }

  const isNavAllowed = (navId: string) => {
    const allowed = ROLE_PERMISSIONS[currentUser.role] || []
    return allowed.includes(navId)
  }

  const addAuditLog = (entry: Omit<AuditLogRecord, 'id' | 'timestamp'>) => {
    const now = new Date()
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 5)}`
    const newRecord: AuditLogRecord = {
      id: `aud_${Date.now()}`,
      timestamp,
      ...entry,
    }
    setAuditLogs((prev) => [newRecord, ...prev])
  }

  // Work Queue Counts
  const kycCount = kycQueue.filter(
    (k) =>
      k.status === 'Pending' || k.status === 'Under Review' || k.status === 'More Info Requested'
  ).length
  const approvalsCount = approvals.filter((a) => a.status === 'Pending').length
  const withdrawalsAttentionCount = withdrawals.filter((w) => w.status === 'Unknown').length
  const reconciliationOpenCount = reconRuns.reduce((acc, r) => acc + r.openCount, 0)

  // Customer Actions
  const suspendCustomer = (customerId: string, reason: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, status: 'Suspended' } : c))
    )
    const target = customers.find((c) => c.id === customerId)
    addAuditLog({
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'SUSPEND_CUSTOMER',
      entityType: 'Customer Profile',
      entityReference: target?.customerNumber || customerId,
      oldValue: 'Status: Active',
      newValue: 'Status: Suspended',
      reason,
    })
    toast.success(`Customer suspended successfully.`)
  }

  const restoreCustomer = (customerId: string) => {
    setCustomers((prev) => prev.map((c) => (c.id === customerId ? { ...c, status: 'Active' } : c)))
    const target = customers.find((c) => c.id === customerId)
    addAuditLog({
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'RESTORE_CUSTOMER',
      entityType: 'Customer Profile',
      entityReference: target?.customerNumber || customerId,
      oldValue: 'Status: Suspended',
      newValue: 'Status: Active',
      reason: 'Administrative restoration after verification.',
    })
    toast.success(`Customer status restored to Active.`)
  }

  const unmaskCustomerField = (customerId: string, fieldName: string) => {
    const target = customers.find((c) => c.id === customerId)
    addAuditLog({
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'UNMASK_CUSTOMER_DATA',
      entityType: 'Customer Profile',
      entityReference: target?.customerNumber || customerId,
      oldValue: `${fieldName}: [MASKED]`,
      newValue: `${fieldName}: [VIEWED_UNMASKED]`,
      reason: 'User explicitly revealed sensitive field in Customer Detail view.',
    })
    toast.success(`Sensitive field displayed and logged to audit trail.`)
  }

  // KYC Actions
  const decideKyc = (
    kycId: string,
    decision: 'Approve' | 'Request more info' | 'Reject',
    reason: string
  ) => {
    const item = kycQueue.find((k) => k.id === kycId)
    const newStatus =
      decision === 'Approve'
        ? 'Approved'
        : decision === 'Request more info'
          ? 'More Info Requested'
          : 'Rejected'

    setKycQueue((prev) =>
      prev.map((k) => (k.id === kycId ? { ...k, status: newStatus, reviewNotes: reason } : k))
    )

    if (decision === 'Approve' && item) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === item.customerId ? { ...c, kycLevel: item.requestedTier } : c))
      )
    }

    addAuditLog({
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: `KYC_${decision.toUpperCase().replace(/\s+/g, '_')}`,
      entityType: 'KYC Application',
      entityReference: item?.customerName || kycId,
      oldValue: `Status: ${item?.status}`,
      newValue: `Status: ${newStatus}`,
      reason,
    })

    toast.success(`KYC decision recorded: ${decision}`)
  }

  // Remittance Actions
  const verifyRemittancePayment = (remittanceId: string) => {
    const item = remittances.find((r) => r.id === remittanceId)
    setRemittances((prev) =>
      prev.map((r) =>
        r.id === remittanceId ? { ...r, status: 'Pending approval', bankStatementMatched: true } : r
      )
    )

    // Also route to Approvals
    if (item) {
      const newApproval: ApprovalItem = {
        id: `app_rem_${Date.now()}`,
        type: 'Withdrawal', // or Remittance Approval
        reference: item.reference,
        amountFormatted: `${item.sourceAmount} ${item.sourceCurrency} (${item.netXafAmount.toLocaleString()} XAF)`,
        currency: item.sourceCurrency,
        makerName: `${currentUser.name} (${currentUser.role})`,
        makerId: currentUser.id,
        timeWaiting: 'Just now',
        isPastThreshold: false,
        underlyingContext: {
          description: `Remittance verification for ${item.customerName}`,
          reason: 'Bank wire verified and matched against treasury statement.',
          details: {
            Reference: item.reference,
            Customer: item.customerName,
            Amount: `${item.sourceAmount} ${item.sourceCurrency}`,
            'Net XAF': `${item.netXafAmount.toLocaleString()} XAF`,
          },
        },
        status: 'Pending',
      }
      setApprovals((prev) => [newApproval, ...prev])
    }

    addAuditLog({
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'VERIFY_REMITTANCE_PAYMENT',
      entityType: 'Remittance',
      entityReference: item?.reference || remittanceId,
      oldValue: 'Status: Under review',
      newValue: 'Status: Pending approval',
      reason: 'Matched with bank statement receipt.',
    })

    toast.success('Payment verified and routed to Approvals.')
  }

  const rejectRemittancePayment = (remittanceId: string, reason: string) => {
    const item = remittances.find((r) => r.id === remittanceId)
    setRemittances((prev) =>
      prev.map((r) => (r.id === remittanceId ? { ...r, status: 'Rejected', notes: reason } : r))
    )
    addAuditLog({
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'REJECT_REMITTANCE_PAYMENT',
      entityType: 'Remittance',
      entityReference: item?.reference || remittanceId,
      oldValue: `Status: ${item?.status}`,
      newValue: 'Status: Rejected',
      reason,
    })
    toast.success('Remittance payment rejected.')
  }

  // Manual Credit
  const createManualCredit = (params: {
    customerId: string
    currency: string
    amount: number
    exchangeRate: number
    evidenceFileName: string
    notes: string
  }) => {
    const cust = customers.find((c) => c.id === params.customerId)
    const ref = `MCR-2026-${Math.floor(1000 + Math.random() * 9000)}`
    const now = new Date()
    const createdAt = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 5)}`

    const newCredit: ManualCredit = {
      id: `mcr_${Date.now()}`,
      reference: ref,
      customerId: params.customerId,
      customerName: cust?.name || 'Customer',
      currency: params.currency,
      amount: params.amount,
      exchangeRate: params.exchangeRate,
      evidenceFileName: params.evidenceFileName || 'bank_evidence_upload.pdf',
      notes: params.notes,
      status: 'Submitted',
      createdBy: `${currentUser.name} (${currentUser.role})`,
      createdAt,
    }

    setManualCredits((prev) => [newCredit, ...prev])

    // Route to Approvals queue
    const newApproval: ApprovalItem = {
      id: `app_mcr_${Date.now()}`,
      type: 'Manual Credit',
      reference: ref,
      amountFormatted: `${params.amount.toLocaleString()} ${params.currency}`,
      currency: params.currency,
      makerName: `${currentUser.name} (${currentUser.role})`,
      makerId: currentUser.id,
      timeWaiting: 'Just now',
      isPastThreshold: false,
      underlyingContext: {
        description: `Manual credit request for ${cust?.name}`,
        reason: params.notes,
        details: {
          Customer: cust?.name || '',
          'Customer Number': cust?.customerNumber || '',
          Amount: `${params.amount.toLocaleString()} ${params.currency}`,
          Evidence: params.evidenceFileName || 'Uploaded Evidence',
        },
      },
      status: 'Pending',
    }
    setApprovals((prev) => [newApproval, ...prev])

    addAuditLog({
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'CREATE_MANUAL_CREDIT',
      entityType: 'Manual Credit',
      entityReference: ref,
      oldValue: 'None (Draft)',
      newValue: `Submitted: ${params.amount} ${params.currency} for ${cust?.name}`,
      reason: params.notes,
    })

    toast.success('Manual credit request submitted and routed to Approvals.')
  }

  // Approvals Decision
  const decideApproval = (
    approvalId: string,
    decision: 'Approve' | 'Reject' | 'Return',
    reason: string
  ) => {
    const item = approvals.find((a) => a.id === approvalId)
    if (!item) return

    const now = new Date()
    const decidedAt = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 5)}`
    const updatedStatus =
      decision === 'Approve' ? 'Approved' : decision === 'Reject' ? 'Rejected' : 'Returned'

    const finishedItem: ApprovalItem = {
      ...item,
      status: updatedStatus,
      decidedBy: `${currentUser.name} (${currentUser.role})`,
      decidedAt,
      decisionReason: reason,
    }

    setApprovals((prev) => prev.filter((a) => a.id !== approvalId))
    setApprovalsHistory((prev) => [finishedItem, ...prev])

    // If underlying is manual credit, update its state
    if (item.type === 'Manual Credit') {
      setManualCredits((prev) =>
        prev.map((m) =>
          m.reference === item.reference
            ? {
                ...m,
                status:
                  decision === 'Approve'
                    ? 'Approved'
                    : decision === 'Reject'
                      ? 'Rejected'
                      : 'Returned',
                decidedBy: `${currentUser.name} (${currentUser.role})`,
                decidedAt,
                decisionReason: reason,
              }
            : m
        )
      )
    }

    addAuditLog({
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: `APPROVAL_${decision.toUpperCase()}`,
      entityType: item.type,
      entityReference: item.reference,
      oldValue: 'Status: Pending',
      newValue: `Status: ${updatedStatus}`,
      reason,
    })

    toast.success(`Approval decision submitted: ${decision}`)
  }

  // Propose FX Rate
  const proposeFxRate = (params: {
    currencyPair: string
    baseRate: number
    customerRate: number
    reason: string
  }) => {
    const ref = `FXR-2026-${Math.floor(100 + Math.random() * 900)}`
    const now = new Date()
    const effectiveDate = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 5)}`

    const newRate: FxRate = {
      id: `fx_${Date.now()}`,
      currencyPair: params.currencyPair,
      baseRate: params.baseRate,
      customerRate: params.customerRate,
      effectiveDate,
      status: 'Proposed',
      createdBy: `${currentUser.name} (${currentUser.role})`,
    }

    setFxRates((prev) => [newRate, ...prev])

    // Route to Approvals queue
    const newApproval: ApprovalItem = {
      id: `app_fx_${Date.now()}`,
      type: 'FX Rate Change',
      reference: ref,
      amountFormatted: `${params.currencyPair} Rate ${params.customerRate}`,
      currency: params.currencyPair,
      makerName: `${currentUser.name} (${currentUser.role})`,
      makerId: currentUser.id,
      timeWaiting: 'Just now',
      isPastThreshold: false,
      underlyingContext: {
        description: `Proposed FX rate change for ${params.currencyPair}`,
        reason: params.reason,
        details: {
          'Currency Pair': params.currencyPair,
          'Base Rate': String(params.baseRate),
          'Proposed Customer Rate': String(params.customerRate),
        },
      },
      status: 'Pending',
    }
    setApprovals((prev) => [newApproval, ...prev])

    addAuditLog({
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'PROPOSE_FX_RATE',
      entityType: 'FX Rate',
      entityReference: ref,
      oldValue: 'None',
      newValue: `${params.currencyPair}: ${params.customerRate}`,
      reason: params.reason,
    })

    toast.success('FX Rate proposal routed to Approvals.')
  }

  // Create Fee Rule
  const createFeeRule = (params: {
    transactionType: string
    currency: string
    structureType: FeeRule['structureType']
    structureSummary: string
    tiers?: { from: number; to: number; rate: string }[]
  }) => {
    const ref = `FEE-2026-${Math.floor(100 + Math.random() * 900)}`
    const now = new Date()
    const effectiveDate = now.toISOString().split('T')[0]

    const newRule: FeeRule = {
      id: `fee_${Date.now()}`,
      transactionType: params.transactionType,
      currency: params.currency,
      structureType: params.structureType,
      structureSummary: params.structureSummary,
      effectiveDate,
      status: 'Pending Approval',
      tiers: params.tiers,
    }

    setFeeRules((prev) => [newRule, ...prev])

    // Route to Approvals
    const newApproval: ApprovalItem = {
      id: `app_fee_${Date.now()}`,
      type: 'Fee Rule Change',
      reference: ref,
      amountFormatted: params.transactionType,
      currency: params.currency,
      makerName: `${currentUser.name} (${currentUser.role})`,
      makerId: currentUser.id,
      timeWaiting: 'Just now',
      isPastThreshold: false,
      underlyingContext: {
        description: `New fee rule for ${params.transactionType}`,
        reason: 'Fee adjustment routed for operational sign-off.',
        details: {
          'Transaction Type': params.transactionType,
          Structure: params.structureSummary,
          Currency: params.currency,
        },
      },
      status: 'Pending',
    }
    setApprovals((prev) => [newApproval, ...prev])

    addAuditLog({
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'CREATE_FEE_RULE',
      entityType: 'Fee Rule',
      entityReference: ref,
      oldValue: 'None',
      newValue: `${params.transactionType}: ${params.structureSummary}`,
      reason: 'Proposed pricing structure update.',
    })

    toast.success('Fee rule created and routed to Approvals.')
  }

  // Wallets
  const freezeWallet = (walletId: string, reason: string) => {
    setWallets((prev) =>
      prev.map((w) =>
        w.id === walletId
          ? { ...w, status: 'Frozen', heldAmount: w.ledgerBalance, availableBalance: 0 }
          : w
      )
    )
    const target = wallets.find((w) => w.id === walletId)
    addAuditLog({
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'FREEZE_WALLET',
      entityType: 'Wallet',
      entityReference: `${target?.customerNumber} (${target?.currency})`,
      oldValue: 'Status: Active',
      newValue: 'Status: Frozen',
      reason,
    })
    toast.success('Wallet frozen successfully.')
  }

  const unfreezeWallet = (walletId: string) => {
    setWallets((prev) =>
      prev.map((w) =>
        w.id === walletId
          ? { ...w, status: 'Active', heldAmount: 0, availableBalance: w.ledgerBalance }
          : w
      )
    )
    const target = wallets.find((w) => w.id === walletId)
    addAuditLog({
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'UNFREEZE_WALLET',
      entityType: 'Wallet',
      entityReference: `${target?.customerNumber} (${target?.currency})`,
      oldValue: 'Status: Frozen',
      newValue: 'Status: Active',
      reason: 'Administrative unfreeze after verification.',
    })
    toast.success('Wallet restored to Active.')
  }

  // Reconciliation
  const resolveReconItem = (runId: string, itemId: string, explanation: string) => {
    setReconRuns((prev) =>
      prev.map((run) => {
        if (run.id === runId) {
          const updatedItems = run.items.map((item) =>
            item.id === itemId ? { ...item, status: 'Resolved' as const } : item
          )
          const remainingOpen = updatedItems.filter((i) => i.status !== 'Resolved').length
          return {
            ...run,
            items: updatedItems,
            openCount: remainingOpen,
            status: remainingOpen === 0 ? 'Complete' : 'Partial',
          }
        }
        return run
      })
    )

    // Route adjustment to Approvals
    const ref = `ADJ-REC-${Math.floor(1000 + Math.random() * 9000)}`
    const newApproval: ApprovalItem = {
      id: `app_adj_${Date.now()}`,
      type: 'Reversal',
      reference: ref,
      amountFormatted: 'Adjustment Journal Post',
      currency: 'XAF',
      makerName: `${currentUser.name} (${currentUser.role})`,
      makerId: currentUser.id,
      timeWaiting: 'Just now',
      isPastThreshold: false,
      underlyingContext: {
        description: `Reconciliation adjustment for run ${runId}`,
        reason: explanation,
        details: {
          'Recon Item ID': itemId,
          Explanation: explanation,
        },
      },
      status: 'Pending',
    }
    setApprovals((prev) => [newApproval, ...prev])

    addAuditLog({
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'RESOLVE_RECON_ITEM',
      entityType: 'Reconciliation Item',
      entityReference: itemId,
      oldValue: 'Status: Open',
      newValue: 'Status: Resolved (Adjustment pending approval)',
      reason: explanation,
    })

    toast.success('Adjustment routed to Approvals before journal posts.')
  }

  // Staff Administration
  const inviteStaffUser = (params: { name: string; email: string; role: UserRole }) => {
    const newUser: StaffUser = {
      id: `stf_${Date.now()}`,
      name: params.name,
      email: params.email,
      role: params.role,
      status: 'Active',
      lastLogin: 'Never',
    }
    setStaffUsers((prev) => [...prev, newUser])
    addAuditLog({
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'INVITE_STAFF_USER',
      entityType: 'User Account',
      entityReference: params.email,
      oldValue: 'None',
      newValue: `Role: ${params.role}`,
      reason: 'Staff invitation issued by Administrator.',
    })
    toast.success(`Invitation sent to ${params.email}`)
  }

  const updateSystemSetting = (settingId: string, newValue: string) => {
    setSystemSettings((prev) =>
      prev.map((s) => (s.id === settingId ? { ...s, value: newValue } : s))
    )
    const target = systemSettings.find((s) => s.id === settingId)
    addAuditLog({
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'UPDATE_SYSTEM_SETTING',
      entityType: 'System Configuration',
      entityReference: target?.key || settingId,
      oldValue: target?.value,
      newValue,
      reason: 'Configuration modified via System Administration.',
    })
    toast.success('System setting updated.')
  }

  return (
    <MockContext.Provider
      value={{
        currentUser,
        setCurrentRole,
        isNavAllowed,
        kpis: EMPTY_KPIS,
        urgentItems: EMPTY_URGENT_ITEMS,
        customers,
        kycQueue,
        remittances,
        manualCredits,
        withdrawals,
        approvals,
        approvalsHistory,
        wallets,
        accounts,
        ledgerEntries,
        fxRates,
        feeRules,
        reconRuns,
        auditLogs,
        staffUsers,
        systemSettings,
        kycCount,
        approvalsCount,
        withdrawalsAttentionCount,
        reconciliationOpenCount,
        suspendCustomer,
        restoreCustomer,
        unmaskCustomerField,
        decideKyc,
        verifyRemittancePayment,
        rejectRemittancePayment,
        createManualCredit,
        decideApproval,
        proposeFxRate,
        createFeeRule,
        freezeWallet,
        unfreezeWallet,
        resolveReconItem,
        inviteStaffUser,
        updateSystemSetting,
        addAuditLog,
      }}
    >
      {children}
    </MockContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMock = () => {
  const context = useContext(MockContext)
  if (!context) {
    throw new Error('useMock must be used within a MockProvider')
  }
  return context
}
