// Mock Data and State Management for E-NAKO MoneyFlow Dashboard

export type UserRole =
  | 'Operator'
  | 'Operations Manager'
  | 'Finance Manager'
  | 'Compliance Officer'
  | 'Customer Support'
  | 'CEO'
  | 'Administrator'

export interface CurrentUser {
  id: string
  name: string
  role: UserRole
  email: string
}

export const CURRENT_USER_DEFAULT: CurrentUser = {
  id: 'usr_001',
  name: 'Alex Vance',
  role: 'Administrator',
  email: 'a.vance@enako.cm',
}

export const ALL_ROLES: UserRole[] = [
  'Administrator',
  'Operations Manager',
  'Finance Manager',
  'Compliance Officer',
  'Operator',
  'Customer Support',
  'CEO',
]

// Navigation Role Mapping
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  Administrator: [
    'dashboard',
    'customers',
    'kyc-review',
    'remittances',
    'manual-credit',
    'withdrawals',
    'approvals',
    'wallets-ledger',
    'fx-rates',
    'fees',
    'reconciliation',
    'reports',
    'audit-logs',
    'administration',
    'settings',
  ],
  'Operations Manager': [
    'dashboard',
    'customers',
    'kyc-review',
    'remittances',
    'manual-credit',
    'withdrawals',
    'approvals',
    'reports',
    'audit-logs',
  ],
  'Finance Manager': [
    'dashboard',
    'remittances',
    'manual-credit',
    'withdrawals',
    'approvals',
    'wallets-ledger',
    'fx-rates',
    'fees',
    'reconciliation',
    'reports',
    'audit-logs',
  ],
  'Compliance Officer': [
    'dashboard',
    'customers',
    'kyc-review',
    'remittances',
    'reports',
    'audit-logs',
  ],
  Operator: ['dashboard', 'remittances', 'manual-credit', 'withdrawals'],
  'Customer Support': ['dashboard', 'customers', 'remittances', 'withdrawals'],
  CEO: [
    'dashboard',
    'customers',
    'remittances',
    'withdrawals',
    'approvals',
    'wallets-ledger',
    'fx-rates',
    'fees',
    'reconciliation',
    'reports',
    'audit-logs',
    'settings',
  ],
}

// 3.1 Dashboard Mock Data
export interface DashboardKPIs {
  remittanceVolumeToday: number
  withdrawalVolumeToday: number
  feeIncomeMonth: number
  pendingApprovals: number
  openReconciliationItems: number
}

export interface UrgentAttentionItem {
  id: string
  type: string
  reference: string
  amount: string
  age: string
  linkNav: string
  priority: 'high' | 'medium'
}

export const INITIAL_KPIS: DashboardKPIs = {
  remittanceVolumeToday: 48250000,
  withdrawalVolumeToday: 18920000,
  feeIncomeMonth: 3420000,
  pendingApprovals: 7,
  openReconciliationItems: 4,
}

export const INITIAL_URGENT_ITEMS: UrgentAttentionItem[] = [
  {
    id: 'urg_1',
    type: 'Payment Verification',
    reference: 'REM-2026-9041',
    amount: 'EUR 3,500 (2,295,850 XAF)',
    age: '3h 15m',
    linkNav: 'remittances',
    priority: 'high',
  },
  {
    id: 'urg_2',
    type: 'Approval Pending',
    reference: 'MCR-2026-0042',
    amount: 'XAF 5,000,000',
    age: '5h 40m',
    linkNav: 'approvals',
    priority: 'high',
  },
  {
    id: 'urg_3',
    type: 'Withdrawal Unknown State',
    reference: 'WTH-2026-1092',
    amount: 'XAF 450,000',
    age: '2h 10m',
    linkNav: 'withdrawals',
    priority: 'high',
  },
  {
    id: 'urg_4',
    type: 'Aged Reconciliation Item',
    reference: 'REC-MTN-8812',
    amount: 'XAF 1,200,000',
    age: '48h 00m',
    linkNav: 'reconciliation',
    priority: 'high',
  },
  {
    id: 'urg_5',
    type: 'Approval Pending',
    reference: 'FXR-2026-0012',
    amount: 'EUR/XAF New Rate 657.20',
    age: '1h 20m',
    linkNav: 'approvals',
    priority: 'medium',
  },
]

// 3.2 Customers Mock Data
export interface Customer {
  id: string
  customerNumber: string
  name: string
  email: string
  phoneMasked: string
  phoneReal: string
  nationalIdMasked: string
  nationalIdReal: string
  status: 'Active' | 'Suspended' | 'Pending verification' | 'Closed'
  kycLevel: 'Tier 1' | 'Tier 2' | 'Tier 3'
  dateJoined: string
  address: string
  wallets: { currency: string; balance: number; held: number }[]
  beneficiariesCount: number
}

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust_1',
    customerNumber: 'ENK-CUST-10492',
    name: 'Samuel Eto’o Fosso',
    email: 's.fosso@enako-group.cm',
    phoneMasked: '+237 6••••••82',
    phoneReal: '+237 677 89 23 82',
    nationalIdMasked: 'LT••••••9841',
    nationalIdReal: 'LT104982739841',
    status: 'Active',
    kycLevel: 'Tier 3',
    dateJoined: '2025-11-14',
    address: 'Bonapriso, Douala, Littoral Region',
    wallets: [
      { currency: 'XAF', balance: 3450000, held: 0 },
      { currency: 'EUR', balance: 1200, held: 0 },
    ],
    beneficiariesCount: 4,
  },
  {
    id: 'cust_2',
    customerNumber: 'ENK-CUST-10508',
    name: 'Brice Ngannou',
    email: 'brice.ngannou@outlook.fr',
    phoneMasked: '+33 6••••••91',
    phoneReal: '+33 612 34 56 91',
    nationalIdMasked: 'FR••••••4421',
    nationalIdReal: 'FR9988224421',
    status: 'Active',
    kycLevel: 'Tier 2',
    dateJoined: '2026-01-20',
    address: '14 Rue de Paradis, 75010 Paris, France',
    wallets: [
      { currency: 'EUR', balance: 450, held: 100 },
      { currency: 'XAF', balance: 0, held: 0 },
    ],
    beneficiariesCount: 2,
  },
  {
    id: 'cust_3',
    customerNumber: 'ENK-CUST-10515',
    name: 'Marie-Claire Tchaptchet',
    email: 'mc.tchaptchet@yahoo.com',
    phoneMasked: '+237 6••••••14',
    phoneReal: '+237 699 44 21 14',
    nationalIdMasked: 'CE••••••7723',
    nationalIdReal: 'CE20194837723',
    status: 'Pending verification',
    kycLevel: 'Tier 1',
    dateJoined: '2026-02-18',
    address: 'Bastos, Yaoundé, Centre Region',
    wallets: [{ currency: 'XAF', balance: 120000, held: 0 }],
    beneficiariesCount: 1,
  },
  {
    id: 'cust_4',
    customerNumber: 'ENK-CUST-10522',
    name: 'David Kamgaing',
    email: 'dkamgaing@camnet.cm',
    phoneMasked: '+237 6••••••70',
    phoneReal: '+237 655 12 34 70',
    nationalIdMasked: 'LT••••••1102',
    nationalIdReal: 'LT44920191102',
    status: 'Suspended',
    kycLevel: 'Tier 2',
    dateJoined: '2025-10-05',
    address: 'Akwa, Douala, Littoral Region',
    wallets: [{ currency: 'XAF', balance: 850000, held: 850000 }],
    beneficiariesCount: 3,
  },
  {
    id: 'cust_5',
    customerNumber: 'ENK-CUST-10530',
    name: 'Aline Mballa',
    email: 'aline.mballa@gmail.com',
    phoneMasked: '+44 7••••••65',
    phoneReal: '+44 7911 123465',
    nationalIdMasked: 'UK••••••8832',
    nationalIdReal: 'UK9988118832',
    status: 'Active',
    kycLevel: 'Tier 3',
    dateJoined: '2026-03-01',
    address: '22 Baker St, London, United Kingdom',
    wallets: [
      { currency: 'GBP', balance: 820, held: 0 },
      { currency: 'XAF', balance: 650000, held: 0 },
    ],
    beneficiariesCount: 5,
  },
]

// 3.3 KYC Review Mock Data
export interface KycReviewItem {
  id: string
  customerId: string
  customerName: string
  submittedDate: string
  status: 'Pending' | 'Under Review' | 'More Info Requested' | 'Approved' | 'Rejected'
  assignedReviewer: string
  requestedTier: 'Tier 2' | 'Tier 3'
  nationality: string
  dateOfBirth: string
  residenceCountry: string
  idDocType: string
  idDocNumber: string
  documents: { name: string; type: string; size: string; status: string }[]
  reviewNotes?: string
}

export const INITIAL_KYC_QUEUE: KycReviewItem[] = [
  {
    id: 'kyc_1',
    customerId: 'cust_3',
    customerName: 'Marie-Claire Tchaptchet',
    submittedDate: '2026-10-01 08:30',
    status: 'Pending',
    assignedReviewer: 'Compliance Officer (Sarah M.)',
    requestedTier: 'Tier 2',
    nationality: 'Cameroonian',
    dateOfBirth: '1989-06-14',
    residenceCountry: 'Cameroon',
    idDocType: 'National ID Card (CNI)',
    idDocNumber: 'CE20194837723',
    documents: [
      {
        name: 'cni_front_tchaptchet.pdf',
        type: 'ID Document (Front)',
        size: '1.8 MB',
        status: 'Uploaded',
      },
      {
        name: 'cni_back_tchaptchet.pdf',
        type: 'ID Document (Back)',
        size: '1.4 MB',
        status: 'Uploaded',
      },
      {
        name: 'proof_residence_eneo_bill.pdf',
        type: 'Proof of Address',
        size: '2.1 MB',
        status: 'Uploaded',
      },
    ],
  },
  {
    id: 'kyc_2',
    customerId: 'cust_2',
    customerName: 'Brice Ngannou',
    submittedDate: '2026-09-30 14:15',
    status: 'Under Review',
    assignedReviewer: 'Compliance Officer (Sarah M.)',
    requestedTier: 'Tier 3',
    nationality: 'Cameroonian / French Resident',
    dateOfBirth: '1984-11-22',
    residenceCountry: 'France',
    idDocType: 'Passport',
    idDocNumber: 'FR9988224421',
    documents: [
      {
        name: 'passport_ngannou_biometric.pdf',
        type: 'Passport Biometric Page',
        size: '3.2 MB',
        status: 'Uploaded',
      },
      {
        name: 'tax_notice_france_2025.pdf',
        type: 'Proof of Wealth / Income',
        size: '4.5 MB',
        status: 'Uploaded',
      },
      {
        name: 'edf_electricity_bill_aug2026.pdf',
        type: 'Proof of Residence',
        size: '1.1 MB',
        status: 'Uploaded',
      },
    ],
  },
  {
    id: 'kyc_3',
    customerId: 'cust_6',
    customerName: 'Jean-Paul Biya',
    submittedDate: '2026-09-29 11:00',
    status: 'More Info Requested',
    assignedReviewer: 'Compliance Officer (Sarah M.)',
    requestedTier: 'Tier 2',
    nationality: 'Cameroonian',
    dateOfBirth: '1992-03-08',
    residenceCountry: 'Cameroon',
    idDocType: 'National ID Card (CNI)',
    idDocNumber: 'LT9920192831',
    documents: [
      {
        name: 'cni_scan_blurry.jpg',
        type: 'National ID Card',
        size: '850 KB',
        status: 'Rejected - Blurry image',
      },
    ],
    reviewNotes:
      'The ID scan submitted was blurry and unreadable. Requested a high-resolution scan.',
  },
]

// 3.4 Remittances Mock Data
export type RemittanceStatus =
  | 'Awaiting payment'
  | 'Payment reported'
  | 'Under review'
  | 'Verified'
  | 'FX locked'
  | 'Pending approval'
  | 'Approved'
  | 'Completed'
  | 'Rejected'
  | 'Cancelled'
  | 'Expired'
  | 'Reversed'

export interface Remittance {
  id: string
  reference: string
  customerName: string
  customerId: string
  sourceCurrency: string
  sourceAmount: number
  targetCurrency: string
  frozenFxRate: number
  feeAmount: number
  netXafAmount: number
  status: RemittanceStatus
  createdDate: string
  paymentProofDoc?: string
  bankStatementMatched?: boolean
  bankStatementRef?: string
  recipientName: string
  recipientPhone: string
  notes?: string
}

export const INITIAL_REMITTANCES: Remittance[] = [
  {
    id: 'rem_1',
    reference: 'REM-2026-9041',
    customerName: 'Brice Ngannou',
    customerId: 'cust_2',
    sourceCurrency: 'EUR',
    sourceAmount: 3500,
    targetCurrency: 'XAF',
    frozenFxRate: 655.957,
    feeAmount: 25,
    netXafAmount: 2277000,
    status: 'Under review',
    createdDate: '2026-10-02 00:15',
    paymentProofDoc: 'sepa_transfer_receipt_3500eur.pdf',
    bankStatementMatched: true,
    bankStatementRef: 'BNP-CREDIT-992018',
    recipientName: 'Hélène Ngannou (Mother)',
    recipientPhone: '+237 677 12 34 56',
  },
  {
    id: 'rem_2',
    reference: 'REM-2026-9040',
    customerName: 'Aline Mballa',
    customerId: 'cust_5',
    sourceCurrency: 'GBP',
    sourceAmount: 1200,
    targetCurrency: 'XAF',
    frozenFxRate: 775.4,
    feeAmount: 15,
    netXafAmount: 918849,
    status: 'Pending approval',
    createdDate: '2026-10-01 19:40',
    paymentProofDoc: 'barclays_wire_proof_1200gbp.pdf',
    bankStatementMatched: true,
    bankStatementRef: 'BARC-STMT-77491',
    recipientName: 'Samuel Mballa',
    recipientPhone: '+237 699 88 77 66',
  },
  {
    id: 'rem_3',
    reference: 'REM-2026-9039',
    customerName: 'Samuel Eto’o Fosso',
    customerId: 'cust_1',
    sourceCurrency: 'EUR',
    sourceAmount: 5000,
    targetCurrency: 'XAF',
    frozenFxRate: 655.957,
    feeAmount: 30,
    netXafAmount: 3260106,
    status: 'Completed',
    createdDate: '2026-10-01 15:20',
    paymentProofDoc: 'wire_receipt_5000eur.pdf',
    bankStatementMatched: true,
    recipientName: 'GIE Agro-Pastorale Douala',
    recipientPhone: '+237 655 00 11 22',
  },
  {
    id: 'rem_4',
    reference: 'REM-2026-9038',
    customerName: 'Jacques Foko',
    customerId: 'cust_7',
    sourceCurrency: 'USD',
    sourceAmount: 800,
    targetCurrency: 'XAF',
    frozenFxRate: 602.15,
    feeAmount: 12,
    netXafAmount: 474494,
    status: 'Payment reported',
    createdDate: '2026-10-01 14:00',
    paymentProofDoc: 'chase_quickpay_800usd.pdf',
    bankStatementMatched: false,
    recipientName: 'Paul Foko',
    recipientPhone: '+237 671 22 33 44',
  },
  {
    id: 'rem_5',
    reference: 'REM-2026-9037',
    customerName: 'Esther Kenmoe',
    customerId: 'cust_8',
    sourceCurrency: 'CAD',
    sourceAmount: 1500,
    targetCurrency: 'XAF',
    frozenFxRate: 442.8,
    feeAmount: 20,
    netXafAmount: 655344,
    status: 'Awaiting payment',
    createdDate: '2026-10-01 10:30',
    bankStatementMatched: false,
    recipientName: 'Jean Kenmoe',
    recipientPhone: '+237 690 11 22 33',
  },
  {
    id: 'rem_6',
    reference: 'REM-2026-9036',
    customerName: 'David Kamgaing',
    customerId: 'cust_4',
    sourceCurrency: 'EUR',
    sourceAmount: 2000,
    targetCurrency: 'XAF',
    frozenFxRate: 655.957,
    feeAmount: 20,
    netXafAmount: 1298795,
    status: 'Rejected',
    createdDate: '2026-09-30 16:10',
    notes: 'Sender name on bank wire did not match KYC customer profile.',
    recipientName: 'David Kamgaing',
    recipientPhone: '+237 655 12 34 70',
  },
]

// 3.5 Manual Credit Mock Data (Maker-Checker)
export interface ManualCredit {
  id: string
  reference: string
  customerId: string
  customerName: string
  currency: string
  amount: number
  exchangeRate: number
  evidenceFileName: string
  notes: string
  status: 'Draft' | 'Submitted' | 'Returned' | 'Approved' | 'Rejected' | 'Executed'
  createdBy: string // Maker
  createdAt: string
  decidedBy?: string // Checker
  decidedAt?: string
  decisionReason?: string
}

export const INITIAL_MANUAL_CREDITS: ManualCredit[] = [
  {
    id: 'mcr_1',
    reference: 'MCR-2026-0042',
    customerId: 'cust_1',
    customerName: 'Samuel Eto’o Fosso',
    currency: 'XAF',
    amount: 5000000,
    exchangeRate: 1.0,
    evidenceFileName: 'ecobank_swift_inward_5m_ref991.pdf',
    notes: 'Inward wire received at Ecobank Cameroon corporate clearing. Ref: ECO/CM/99120.',
    status: 'Submitted',
    createdBy: 'Marcus Thorne (Operator)',
    createdAt: '2026-10-01 21:00',
  },
  {
    id: 'mcr_2',
    reference: 'MCR-2026-0041',
    customerId: 'cust_2',
    customerName: 'Brice Ngannou',
    currency: 'EUR',
    amount: 1200,
    exchangeRate: 655.957,
    evidenceFileName: 'bnp_paribas_swift_mt103.pdf',
    notes: 'Direct client payment into Paris escrow account.',
    status: 'Executed',
    createdBy: 'Marcus Thorne (Operator)',
    createdAt: '2026-09-30 11:30',
    decidedBy: 'Elena Rostova (Finance Manager)',
    decidedAt: '2026-09-30 13:45',
    decisionReason: 'MT103 confirmed by Treasury desk.',
  },
  {
    id: 'mcr_3',
    reference: 'MCR-2026-0040',
    customerId: 'cust_5',
    customerName: 'Aline Mballa',
    currency: 'GBP',
    amount: 400,
    exchangeRate: 775.4,
    evidenceFileName: 'hsbc_faster_payments_proof.pdf',
    notes: 'UK account adjustment after failed direct debit.',
    status: 'Approved',
    createdBy: 'Jeanette Bell (Operations Specialist)',
    createdAt: '2026-09-29 16:00',
    decidedBy: 'Elena Rostova (Finance Manager)',
    decidedAt: '2026-09-29 17:15',
    decisionReason: 'Funds verified in clearing ledger.',
  },
  {
    id: 'mcr_4',
    reference: 'MCR-2026-0039',
    customerId: 'cust_4',
    customerName: 'David Kamgaing',
    currency: 'XAF',
    amount: 1500000,
    exchangeRate: 1.0,
    evidenceFileName: 'cheque_deposit_slip_uic.pdf',
    notes: 'Bank cheque deposit at Akwa agency.',
    status: 'Rejected',
    createdBy: 'Marcus Thorne (Operator)',
    createdAt: '2026-09-28 09:20',
    decidedBy: 'Elena Rostova (Finance Manager)',
    decidedAt: '2026-09-28 11:10',
    decisionReason: 'Cheque returned unpaid by drawee bank.',
  },
]

// 3.6 Withdrawals Mock Data
export type WithdrawalStatus =
  | 'Requested'
  | 'Funds held'
  | 'Pending approval'
  | 'Submitted'
  | 'Processing'
  | 'Completed'
  | 'Failed'
  | 'Unknown'
  | 'Rejected'

export interface WithdrawalTimelineEvent {
  timestamp: string
  status: string
  note: string
}

export interface Withdrawal {
  id: string
  reference: string
  customerName: string
  customerId: string
  beneficiaryProvider: string
  beneficiaryMaskedNumber: string
  beneficiaryRealNumber: string
  amount: number
  fee: number
  status: WithdrawalStatus
  createdDate: string
  timeline: WithdrawalTimelineEvent[]
  providerRef?: string
}

export const INITIAL_WITHDRAWALS: Withdrawal[] = [
  {
    id: 'wth_1',
    reference: 'WTH-2026-1092',
    customerName: 'Marie-Claire Tchaptchet',
    customerId: 'cust_3',
    beneficiaryProvider: 'MTN Mobile Money',
    beneficiaryMaskedNumber: '+237 6••••••14',
    beneficiaryRealNumber: '+237 677 44 21 14',
    amount: 450000,
    fee: 4500,
    status: 'Unknown',
    createdDate: '2026-10-02 00:05',
    providerRef: 'MTN-PEND-992019',
    timeline: [
      {
        timestamp: '2026-10-02 00:05',
        status: 'Requested',
        note: 'Customer initiated withdrawal via web portal.',
      },
      {
        timestamp: '2026-10-02 00:06',
        status: 'Funds held',
        note: 'Customer wallet debited 454,500 XAF (amount + fee).',
      },
      {
        timestamp: '2026-10-02 00:07',
        status: 'Submitted',
        note: 'Dispatched to MTN MoMo API switch.',
      },
      {
        timestamp: '2026-10-02 00:12',
        status: 'Unknown',
        note: 'Provider webhook timed out. No response received from MTN Gateway after 3 retries.',
      },
    ],
  },
  {
    id: 'wth_2',
    reference: 'WTH-2026-1091',
    customerName: 'Samuel Eto’o Fosso',
    customerId: 'cust_1',
    beneficiaryProvider: 'Orange Money Cameroun',
    beneficiaryMaskedNumber: '+237 6••••••82',
    beneficiaryRealNumber: '+237 699 89 23 82',
    amount: 1000000,
    fee: 10000,
    status: 'Pending approval',
    createdDate: '2026-10-01 22:30',
    timeline: [
      {
        timestamp: '2026-10-01 22:30',
        status: 'Requested',
        note: 'High-value withdrawal initiated.',
      },
      {
        timestamp: '2026-10-01 22:31',
        status: 'Funds held',
        note: '1,010,000 XAF held in customer wallet.',
      },
      {
        timestamp: '2026-10-01 22:31',
        status: 'Pending approval',
        note: 'Amount exceeds automatic threshold of 500,000 XAF. Routed to Operations Manager.',
      },
    ],
  },
  {
    id: 'wth_3',
    reference: 'WTH-2026-1090',
    customerName: 'Brice Ngannou',
    customerId: 'cust_2',
    beneficiaryProvider: 'MTN Mobile Money',
    beneficiaryMaskedNumber: '+237 6••••••56',
    beneficiaryRealNumber: '+237 677 12 34 56',
    amount: 250000,
    fee: 2500,
    status: 'Completed',
    createdDate: '2026-10-01 18:15',
    providerRef: 'MTN-TX-882190',
    timeline: [
      {
        timestamp: '2026-10-01 18:15',
        status: 'Requested',
        note: 'Initiated by customer.',
      },
      {
        timestamp: '2026-10-01 18:15',
        status: 'Processing',
        note: 'Direct cashout push via API.',
      },
      {
        timestamp: '2026-10-01 18:16',
        status: 'Completed',
        note: 'MTN confirmed transaction success with Financial ID: MTN882190.',
      },
    ],
  },
  {
    id: 'wth_4',
    reference: 'WTH-2026-1089',
    customerName: 'Aline Mballa',
    customerId: 'cust_5',
    beneficiaryProvider: 'Orange Money Cameroun',
    beneficiaryMaskedNumber: '+237 6••••••66',
    beneficiaryRealNumber: '+237 699 88 77 66',
    amount: 150000,
    fee: 1500,
    status: 'Failed',
    createdDate: '2026-10-01 16:00',
    timeline: [
      {
        timestamp: '2026-10-01 16:00',
        status: 'Requested',
        note: 'Withdrawal created.',
      },
      {
        timestamp: '2026-10-01 16:01',
        status: 'Processing',
        note: 'Submitted to Orange Money switch.',
      },
      {
        timestamp: '2026-10-01 16:02',
        status: 'Failed',
        note: 'Orange returned error: Recipient wallet is unregistered or over ceiling.',
      },
    ],
  },
]

// 3.7 Approvals Mock Data (Unified Queue)
export type ApprovalType =
  'Manual Credit' | 'Withdrawal' | 'FX Rate Change' | 'Fee Rule Change' | 'Reversal'

export interface ApprovalItem {
  id: string
  type: ApprovalType
  reference: string
  amountFormatted: string
  currency: string
  makerName: string
  makerId: string
  timeWaiting: string
  isPastThreshold: boolean
  underlyingContext: {
    description: string
    reason: string
    details: Record<string, string>
  }
  status: 'Pending' | 'Approved' | 'Rejected' | 'Returned'
  decidedBy?: string
  decidedAt?: string
  decisionReason?: string
}

export const INITIAL_APPROVALS: ApprovalItem[] = [
  {
    id: 'app_1',
    type: 'Manual Credit',
    reference: 'MCR-2026-0042',
    amountFormatted: '5,000,000',
    currency: 'XAF',
    makerName: 'Marcus Thorne (Operator)',
    makerId: 'usr_operator_1',
    timeWaiting: '5h 40m',
    isPastThreshold: true,
    underlyingContext: {
      description: 'Manual credit for Samuel Eto’o Fosso after direct bank clearing.',
      reason: 'Inward wire received at Ecobank Cameroon corporate clearing. Ref: ECO/CM/99120.',
      details: {
        'Customer Number': 'ENK-CUST-10492',
        'Customer Name': 'Samuel Eto’o Fosso',
        'Amount to Credit': '5,000,000 XAF',
        Evidence: 'ecobank_swift_inward_5m_ref991.pdf',
      },
    },
    status: 'Pending',
  },
  {
    id: 'app_2',
    type: 'Withdrawal',
    reference: 'WTH-2026-1091',
    amountFormatted: '1,000,000',
    currency: 'XAF',
    makerName: 'Marcus Thorne (Operator)',
    makerId: 'usr_operator_1',
    timeWaiting: '3h 50m',
    isPastThreshold: false,
    underlyingContext: {
      description: 'High-value Orange Money withdrawal over automatic threshold (500k XAF).',
      reason: 'Customer initiated disbursement to family agriculture project in Douala.',
      details: {
        'Customer Name': 'Samuel Eto’o Fosso',
        Beneficiary: 'Orange Money (+237 699 89 23 82)',
        'Gross Amount': '1,000,000 XAF',
        Fee: '10,000 XAF',
      },
    },
    status: 'Pending',
  },
  {
    id: 'app_3',
    type: 'FX Rate Change',
    reference: 'FXR-2026-0012',
    amountFormatted: 'EUR/XAF Rate 657.20',
    currency: 'EUR/XAF',
    makerName: 'Alex Vance (Administrator)',
    makerId: 'usr_001',
    timeWaiting: '1h 20m',
    isPastThreshold: false,
    underlyingContext: {
      description: 'Proposal to update EUR/XAF customer rate from 655.957 to 657.20.',
      reason: 'Central Bank / Treasury rate fluctuation adjustment for Q4 volume drive.',
      details: {
        'Currency Pair': 'EUR / XAF',
        'Current Rate': '655.957',
        'Proposed Rate': '657.200',
        Deviation: '+0.19% (Within standard tolerance)',
      },
    },
    status: 'Pending',
  },
  {
    id: 'app_4',
    type: 'Fee Rule Change',
    reference: 'FEE-2026-0004',
    amountFormatted: 'Orange Money Cashout Tier 3',
    currency: 'XAF',
    makerName: 'Elena Rostova (Finance Manager)',
    makerId: 'usr_finance_1',
    timeWaiting: '6h 15m',
    isPastThreshold: true,
    underlyingContext: {
      description: 'Adjustment of Orange Money tier 3 fee from 1.0% to 0.85%.',
      reason: 'Competitive pricing alignment with regional market operators.',
      details: {
        'Fee Rule': 'Orange Money Cashout',
        'Current Structure': '1.0% above 500,000 XAF',
        'Proposed Structure': '0.85% above 500,000 XAF',
      },
    },
    status: 'Pending',
  },
  {
    id: 'app_5',
    type: 'Reversal',
    reference: 'REV-2026-0003',
    amountFormatted: '120,000',
    currency: 'XAF',
    makerName: 'Sarah Miller (Compliance Officer)',
    makerId: 'usr_comp_1',
    timeWaiting: '2h 10m',
    isPastThreshold: false,
    underlyingContext: {
      description: 'Reversal of erroneous double wallet debit for Marie-Claire Tchaptchet.',
      reason: 'Ledger reconciliation detected duplicate debit on transaction TX-9921.',
      details: {
        'Customer Name': 'Marie-Claire Tchaptchet',
        'Original Transaction': 'TX-9921 (2026-09-28)',
        'Reversal Amount': '120,000 XAF',
      },
    },
    status: 'Pending',
  },
]

export const INITIAL_APPROVALS_HISTORY: ApprovalItem[] = [
  {
    id: 'app_hist_1',
    type: 'Manual Credit',
    reference: 'MCR-2026-0041',
    amountFormatted: '1,200',
    currency: 'EUR',
    makerName: 'Marcus Thorne (Operator)',
    makerId: 'usr_operator_1',
    timeWaiting: 'Decided',
    isPastThreshold: false,
    underlyingContext: {
      description: 'Manual credit for Brice Ngannou.',
      reason: 'Direct client payment into Paris escrow account.',
      details: { 'Amount to Credit': '1,200 EUR' },
    },
    status: 'Approved',
    decidedBy: 'Elena Rostova (Finance Manager)',
    decidedAt: '2026-09-30 13:45',
    decisionReason: 'MT103 confirmed by Treasury desk.',
  },
  {
    id: 'app_hist_2',
    type: 'Withdrawal',
    reference: 'WTH-2026-1085',
    amountFormatted: '3,000,000',
    currency: 'XAF',
    makerName: 'Marcus Thorne (Operator)',
    makerId: 'usr_operator_1',
    timeWaiting: 'Decided',
    isPastThreshold: false,
    underlyingContext: {
      description: 'High value withdrawal to bank account.',
      reason: 'Commercial supplier invoice settlement.',
      details: { 'Amount to Disburse': '3,000,000 XAF' },
    },
    status: 'Approved',
    decidedBy: 'Elena Rostova (Finance Manager)',
    decidedAt: '2026-09-29 10:15',
    decisionReason: 'Verified with bank signatory list.',
  },
]

// 3.8 Wallets & Ledger Mock Data
export interface CustomerWalletRecord {
  id: string
  customerNumber: string
  customerName: string
  currency: string
  ledgerBalance: number
  heldAmount: number
  availableBalance: number
  status: 'Active' | 'Frozen' | 'Closed'
}

export const INITIAL_WALLETS: CustomerWalletRecord[] = [
  {
    id: 'w_1',
    customerNumber: 'ENK-CUST-10492',
    customerName: 'Samuel Eto’o Fosso',
    currency: 'XAF',
    ledgerBalance: 3450000,
    heldAmount: 0,
    availableBalance: 3450000,
    status: 'Active',
  },
  {
    id: 'w_2',
    customerNumber: 'ENK-CUST-10492',
    customerName: 'Samuel Eto’o Fosso',
    currency: 'EUR',
    ledgerBalance: 1200,
    heldAmount: 0,
    availableBalance: 1200,
    status: 'Active',
  },
  {
    id: 'w_3',
    customerNumber: 'ENK-CUST-10508',
    customerName: 'Brice Ngannou',
    currency: 'EUR',
    ledgerBalance: 450,
    heldAmount: 100,
    availableBalance: 350,
    status: 'Active',
  },
  {
    id: 'w_4',
    customerNumber: 'ENK-CUST-10522',
    customerName: 'David Kamgaing',
    currency: 'XAF',
    ledgerBalance: 850000,
    heldAmount: 850000,
    availableBalance: 0,
    status: 'Frozen',
  },
  {
    id: 'w_5',
    customerNumber: 'ENK-CUST-10530',
    customerName: 'Aline Mballa',
    currency: 'GBP',
    ledgerBalance: 820,
    heldAmount: 0,
    availableBalance: 820,
    status: 'Active',
  },
]

export interface ChartOfAccount {
  code: string
  name: string
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense'
  currency: string
  balance: number
  description: string
}

export const INITIAL_ACCOUNTS: ChartOfAccount[] = [
  {
    code: '1010',
    name: 'Nostro BNP Paris (EUR)',
    type: 'Asset',
    currency: 'EUR',
    balance: 145200.5,
    description: 'European settlement clearing bank account',
  },
  {
    code: '1020',
    name: 'Ecobank Operational Treasury (XAF)',
    type: 'Asset',
    currency: 'XAF',
    balance: 382400000,
    description: 'Cameroon local disbursement float',
  },
  {
    code: '1030',
    name: 'MTN MoMo Settlement Float (XAF)',
    type: 'Asset',
    currency: 'XAF',
    balance: 45200000,
    description: 'Aggregator cashout pool on MTN network',
  },
  {
    code: '1040',
    name: 'Orange Money Float (XAF)',
    type: 'Asset',
    currency: 'XAF',
    balance: 38900000,
    description: 'Aggregator cashout pool on Orange network',
  },
  {
    code: '2010',
    name: 'Customer Wallet Liabilities (XAF)',
    type: 'Liability',
    currency: 'XAF',
    balance: -428100000,
    description: 'Total funds owed to XAF customer wallets',
  },
  {
    code: '2020',
    name: 'Customer Wallet Liabilities (EUR)',
    type: 'Liability',
    currency: 'EUR',
    balance: -138900.5,
    description: 'Total funds owed to EUR customer wallets',
  },
  {
    code: '4010',
    name: 'FX Spread Income (XAF)',
    type: 'Revenue',
    currency: 'XAF',
    balance: -21400000,
    description: 'Net margin captured between interbank and retail FX rates',
  },
  {
    code: '4020',
    name: 'Transaction Fee Income (XAF)',
    type: 'Revenue',
    currency: 'XAF',
    balance: -17000000,
    description: 'Flat and percentage charges assessed on remittances and withdrawals',
  },
]

export interface LedgerEntry {
  id: string
  date: string
  journalRef: string
  debitAmount: number
  creditAmount: number
  counterAccount: string
  description: string
}

export const INITIAL_LEDGER_ENTRIES: Record<string, LedgerEntry[]> = {
  '1020': [
    {
      id: 'led_1',
      date: '2026-10-01 15:20',
      journalRef: 'JRN-2026-8812',
      debitAmount: 3260106,
      creditAmount: 0,
      counterAccount: '2010 Customer Deposits',
      description: 'Inward wire cleared for Samuel Eto’o Fosso',
    },
    {
      id: 'led_2',
      date: '2026-10-01 18:16',
      journalRef: 'JRN-2026-8815',
      debitAmount: 0,
      creditAmount: 252500,
      counterAccount: '1030 MTN Float',
      description: 'Settlement float rebalance to MTN aggregator',
    },
  ],
  '2010': [
    {
      id: 'led_3',
      date: '2026-10-01 15:20',
      journalRef: 'JRN-2026-8812',
      debitAmount: 0,
      creditAmount: 3260106,
      counterAccount: '1020 Ecobank Treasury',
      description: 'Credited to customer wallet Samuel Eto’o Fosso',
    },
    {
      id: 'led_4',
      date: '2026-10-01 18:15',
      journalRef: 'JRN-2026-8814',
      debitAmount: 252500,
      creditAmount: 0,
      counterAccount: '1030 MTN Float',
      description: 'Debited from customer wallet for withdrawal WTH-2026-1090',
    },
  ],
}

// 3.9 FX Rates Mock Data
export interface FxRate {
  id: string
  currencyPair: string
  baseRate: number
  customerRate: number
  effectiveDate: string
  status: 'Proposed' | 'Approved' | 'Active' | 'Superseded'
  createdBy: string
}

export const INITIAL_FX_RATES: FxRate[] = [
  {
    id: 'fx_1',
    currencyPair: 'EUR / XAF',
    baseRate: 655.957,
    customerRate: 655.957,
    effectiveDate: '2026-09-01 00:00',
    status: 'Active',
    createdBy: 'Treasury System',
  },
  {
    id: 'fx_2',
    currencyPair: 'USD / XAF',
    baseRate: 602.15,
    customerRate: 595.0,
    effectiveDate: '2026-09-28 08:00',
    status: 'Active',
    createdBy: 'Elena Rostova (Finance Manager)',
  },
  {
    id: 'fx_3',
    currencyPair: 'GBP / XAF',
    baseRate: 775.4,
    customerRate: 765.0,
    effectiveDate: '2026-09-28 08:00',
    status: 'Active',
    createdBy: 'Elena Rostova (Finance Manager)',
  },
  {
    id: 'fx_4',
    currencyPair: 'CAD / XAF',
    baseRate: 442.8,
    customerRate: 435.0,
    effectiveDate: '2026-09-28 08:00',
    status: 'Active',
    createdBy: 'Elena Rostova (Finance Manager)',
  },
  {
    id: 'fx_5',
    currencyPair: 'EUR / XAF',
    baseRate: 655.957,
    customerRate: 657.2,
    effectiveDate: '2026-10-02 12:00',
    status: 'Proposed',
    createdBy: 'Alex Vance (Administrator)',
  },
]

// 3.10 Fees Mock Data
export interface FeeRule {
  id: string
  transactionType: string
  currency: string
  structureType: 'Percentage' | 'Fixed' | 'Percentage with min/max' | 'Tiered'
  structureSummary: string
  effectiveDate: string
  status: 'Active' | 'Inactive' | 'Pending Approval'
  tiers?: { from: number; to: number; rate: string }[]
}

export const INITIAL_FEE_RULES: FeeRule[] = [
  {
    id: 'fee_1',
    transactionType: 'Remittance Inward (EUR)',
    currency: 'EUR',
    structureType: 'Percentage with min/max',
    structureSummary: '0.8% (Min: 5 EUR, Max: 50 EUR)',
    effectiveDate: '2026-01-01',
    status: 'Active',
  },
  {
    id: 'fee_2',
    transactionType: 'Remittance Inward (GBP)',
    currency: 'GBP',
    structureType: 'Percentage with min/max',
    structureSummary: '1.0% (Min: 5 GBP, Max: 40 GBP)',
    effectiveDate: '2026-01-01',
    status: 'Active',
  },
  {
    id: 'fee_3',
    transactionType: 'MTN MoMo Cashout',
    currency: 'XAF',
    structureType: 'Fixed',
    structureSummary: '1.0% flat fee',
    effectiveDate: '2026-02-15',
    status: 'Active',
  },
  {
    id: 'fee_4',
    transactionType: 'Orange Money Cashout',
    currency: 'XAF',
    structureType: 'Tiered',
    structureSummary: 'Tiered: 3 bands (0.5% - 1.2%)',
    effectiveDate: '2026-03-01',
    status: 'Active',
    tiers: [
      { from: 1, to: 50000, rate: '1.2%' },
      { from: 50001, to: 250000, rate: '1.0%' },
      { from: 250001, to: 1000000, rate: '0.85%' },
    ],
  },
]

// 3.11 Reconciliation Mock Data
export interface ReconciliationItem {
  id: string
  side: 'Internal' | 'External'
  reference: string
  amount: number
  currency: string
  age: string
  assignedStaff: string
  internalDetails: { ref: string; date: string; amount: string; note: string }
  externalDetails: { ref: string; date: string; amount: string; note: string }
  status: 'Open' | 'Assigned' | 'Resolved'
}

export interface ReconciliationRun {
  id: string
  businessDate: string
  provider: string
  status: 'Running' | 'Partial' | 'Complete'
  matchedCount: number
  openCount: number
  matchPercentage: number
  items: ReconciliationItem[]
}

export const INITIAL_RECON_RUNS: ReconciliationRun[] = [
  {
    id: 'rec_1',
    businessDate: '2026-10-01',
    provider: 'MTN Mobile Money Gateway',
    status: 'Partial',
    matchedCount: 1482,
    openCount: 4,
    matchPercentage: 99.73,
    items: [
      {
        id: 'rec_item_1',
        side: 'External',
        reference: 'REC-MTN-8812',
        amount: 1200000,
        currency: 'XAF',
        age: '48h 00m',
        assignedStaff: 'Elena Rostova (Finance Manager)',
        status: 'Open',
        internalDetails: {
          ref: 'WTH-2026-1080',
          date: '2026-09-29 14:22',
          amount: '1,200,000 XAF',
          note: 'Recorded as Pending Provider Response in internal ledger.',
        },
        externalDetails: {
          ref: 'MTN-FIN-992011',
          date: '2026-09-29 14:23',
          amount: '1,200,000 XAF',
          note: 'Provider statement indicates Successful debit to end-subscriber.',
        },
      },
      {
        id: 'rec_item_2',
        side: 'Internal',
        reference: 'REC-MTN-8813',
        amount: 450000,
        currency: 'XAF',
        age: '2h 10m',
        assignedStaff: 'Marcus Thorne (Operator)',
        status: 'Open',
        internalDetails: {
          ref: 'WTH-2026-1092',
          date: '2026-10-02 00:05',
          amount: '450,000 XAF',
          note: 'Internal wallet debited; webhook timed out.',
        },
        externalDetails: {
          ref: 'None',
          date: 'Pending settlement',
          amount: '0 XAF',
          note: 'Not found in MTN bank extraction log.',
        },
      },
    ],
  },
  {
    id: 'rec_2',
    businessDate: '2026-10-01',
    provider: 'Orange Money Gateway',
    status: 'Complete',
    matchedCount: 924,
    openCount: 0,
    matchPercentage: 100.0,
    items: [],
  },
  {
    id: 'rec_3',
    businessDate: '2026-09-30',
    provider: 'BNP Paribas Clearing',
    status: 'Complete',
    matchedCount: 312,
    openCount: 0,
    matchPercentage: 100.0,
    items: [],
  },
]

// 3.12 Reports Mock Data
export interface ReportCategory {
  id: string
  title: string
  description: string
  frequency: string
}

export const REPORT_TEMPLATES: ReportCategory[] = [
  {
    id: 'rep_1',
    title: 'Transaction Volume & Flow Report',
    description:
      'Complete breakdown of remittances and disbursements across all corridors and payment rails.',
    frequency: 'Daily / Monthly',
  },
  {
    id: 'rep_2',
    title: 'Fee Income & Revenue Report',
    description:
      'Detailed analysis of gross fee income, aggregator commissions, and net earnings per currency.',
    frequency: 'Monthly',
  },
  {
    id: 'rep_3',
    title: 'FX Spread & Margin Report',
    description:
      'Interbank settlement cost vs. customer quoted rate margin across EUR, USD, GBP, CAD.',
    frequency: 'Weekly / Monthly',
  },
  {
    id: 'rep_4',
    title: 'Regulatory & Compliance (COBAC) Report',
    description: 'AML/KYC threshold summary, high-value transactions, and PEP customer exposure.',
    frequency: 'Quarterly',
  },
]

// 3.13 Audit Logs Mock Data
export interface AuditLogRecord {
  id: string
  timestamp: string
  actorName: string
  actorRole: string
  action: string
  entityType: string
  entityReference: string
  oldValue?: string
  newValue?: string
  reason?: string
}

export const INITIAL_AUDIT_LOGS: AuditLogRecord[] = [
  {
    id: 'aud_1',
    timestamp: '2026-10-01 21:05',
    actorName: 'Marcus Thorne',
    actorRole: 'Operator',
    action: 'CREATE_MANUAL_CREDIT',
    entityType: 'Manual Credit',
    entityReference: 'MCR-2026-0042',
    oldValue: 'None (New Record)',
    newValue: 'Customer: Samuel Eto’o Fosso, Amount: 5,000,000 XAF',
    reason: 'Inward wire cleared at Ecobank.',
  },
  {
    id: 'aud_2',
    timestamp: '2026-10-01 19:42',
    actorName: 'Sarah Miller',
    actorRole: 'Compliance Officer',
    action: 'UNMASK_CUSTOMER_DATA',
    entityType: 'Customer Profile',
    entityReference: 'ENK-CUST-10492',
    oldValue: 'National ID: LT••••••9841',
    newValue: 'National ID: LT104982739841',
    reason: 'Compliance audit inspection for high-value remittance review.',
  },
  {
    id: 'aud_3',
    timestamp: '2026-10-01 16:30',
    actorName: 'Elena Rostova',
    actorRole: 'Finance Manager',
    action: 'CHANGE_FX_RATE',
    entityType: 'FX Rate',
    entityReference: 'FXR-USD-XAF',
    oldValue: 'Base: 600.50, Customer: 593.20',
    newValue: 'Base: 602.15, Customer: 595.00',
    reason: 'Daily treasury mid-market revaluation.',
  },
  {
    id: 'aud_4',
    timestamp: '2026-09-30 13:45',
    actorName: 'Elena Rostova',
    actorRole: 'Finance Manager',
    action: 'CREDIT_APPROVED',
    entityType: 'Manual Credit',
    entityReference: 'MCR-2026-0041',
    oldValue: 'Status: Submitted',
    newValue: 'Status: Approved',
    reason: 'MT103 confirmed by Treasury desk.',
  },
  {
    id: 'aud_5',
    timestamp: '2026-09-30 11:10',
    actorName: 'Elena Rostova',
    actorRole: 'Finance Manager',
    action: 'SUSPEND_CUSTOMER',
    entityType: 'Customer Profile',
    entityReference: 'ENK-CUST-10522',
    oldValue: 'Status: Active',
    newValue: 'Status: Suspended',
    reason: 'Unpaid bounced cheque returned by drawee bank.',
  },
]

// 3.14 Administration Mock Data
export interface StaffUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: 'Active' | 'Locked' | 'Disabled'
  lastLogin: string
}

export const INITIAL_STAFF_USERS: StaffUser[] = [
  {
    id: 'stf_1',
    name: 'Alex Vance',
    email: 'a.vance@enako.cm',
    role: 'Administrator',
    status: 'Active',
    lastLogin: '2026-10-02 02:10',
  },
  {
    id: 'stf_2',
    name: 'Elena Rostova',
    email: 'e.rostova@enako.cm',
    role: 'Finance Manager',
    status: 'Active',
    lastLogin: '2026-10-01 18:40',
  },
  {
    id: 'stf_3',
    name: 'Sarah Miller',
    email: 's.miller@enako.cm',
    role: 'Compliance Officer',
    status: 'Active',
    lastLogin: '2026-10-01 19:45',
  },
  {
    id: 'stf_4',
    name: 'Marcus Thorne',
    email: 'm.thorne@enako.cm',
    role: 'Operator',
    status: 'Active',
    lastLogin: '2026-10-02 00:30',
  },
  {
    id: 'stf_5',
    name: 'Amadou Bello',
    email: 'a.bello@enako.cm',
    role: 'Customer Support',
    status: 'Active',
    lastLogin: '2026-10-01 16:15',
  },
  {
    id: 'stf_6',
    name: 'Victorine Nfor',
    email: 'v.nfor@enako.cm',
    role: 'Operations Manager',
    status: 'Active',
    lastLogin: '2026-10-01 17:30',
  },
  {
    id: 'stf_7',
    name: 'Henriette Ngo',
    email: 'h.ngo@enako.cm',
    role: 'CEO',
    status: 'Active',
    lastLogin: '2026-09-30 09:00',
  },
]

export interface RolePermissionMatrixRow {
  permission: string
  operator: string
  operationsManager: string
  financeManager: string
  complianceOfficer: string
  customerSupport: string
  ceo: string
  admin: string
}

export const ROLES_PERMISSIONS_MATRIX: RolePermissionMatrixRow[] = [
  {
    permission: 'View Customer Data',
    operator: '—',
    operationsManager: 'Yes',
    financeManager: '—',
    complianceOfficer: 'Yes',
    customerSupport: 'Yes',
    ceo: 'Yes',
    admin: 'Yes',
  },
  {
    permission: 'Unmask Sensitive KYC Data',
    operator: '—',
    operationsManager: 'Limit',
    financeManager: '—',
    complianceOfficer: 'Yes',
    customerSupport: 'Limit',
    ceo: 'Yes',
    admin: 'Yes',
  },
  {
    permission: 'Approve KYC Tier Upgrades',
    operator: '—',
    operationsManager: '—',
    financeManager: '—',
    complianceOfficer: 'Yes',
    customerSupport: '—',
    ceo: 'Yes',
    admin: 'Yes',
  },
  {
    permission: 'Create Manual Credit (Maker)',
    operator: 'Yes',
    operationsManager: 'Yes',
    financeManager: 'Yes',
    complianceOfficer: '—',
    customerSupport: '—',
    ceo: '—',
    admin: 'Yes',
  },
  {
    permission: 'Approve Manual Credit (Checker)',
    operator: '—',
    operationsManager: 'Yes',
    financeManager: 'Yes',
    complianceOfficer: '—',
    customerSupport: '—',
    ceo: 'Yes',
    admin: 'Yes',
  },
  {
    permission: 'Approve High-Value Withdrawals',
    operator: '—',
    operationsManager: 'Limit',
    financeManager: 'Yes',
    complianceOfficer: '—',
    customerSupport: '—',
    ceo: 'Yes',
    admin: 'Yes',
  },
  {
    permission: 'Modify FX Rates & Spreads',
    operator: '—',
    operationsManager: '—',
    financeManager: 'Yes',
    complianceOfficer: '—',
    customerSupport: '—',
    ceo: 'Yes',
    admin: 'Yes',
  },
  {
    permission: 'Post Ledger Adjustments',
    operator: '—',
    operationsManager: '—',
    financeManager: 'Yes',
    complianceOfficer: '—',
    customerSupport: '—',
    ceo: '—',
    admin: 'Yes',
  },
  {
    permission: 'Execute Reconciliation Runs',
    operator: '—',
    operationsManager: '—',
    financeManager: 'Yes',
    complianceOfficer: '—',
    customerSupport: '—',
    ceo: '—',
    admin: 'Yes',
  },
  {
    permission: 'Manage Staff Accounts & System Config',
    operator: '—',
    operationsManager: '—',
    financeManager: '—',
    complianceOfficer: '—',
    customerSupport: '—',
    ceo: '—',
    admin: 'Yes',
  },
]

export interface SystemSetting {
  id: string
  key: string
  label: string
  value: string
  description: string
  category: 'Approvals' | 'Limits' | 'Compliance'
}

export const INITIAL_SYSTEM_SETTINGS: SystemSetting[] = [
  {
    id: 'set_1',
    key: 'high_value_withdrawal_threshold',
    label: 'High-Value Withdrawal Approval Threshold',
    value: '500,000 XAF',
    description: 'Withdrawals above this amount require second-tier approval before dispatch.',
    category: 'Approvals',
  },
  {
    id: 'set_2',
    key: 'manual_credit_dual_control_threshold',
    label: 'Manual Credit Dual Control Threshold',
    value: '0 XAF (All amounts)',
    description:
      'Every manual credit request requires maker-checker authorization regardless of sum.',
    category: 'Approvals',
  },
  {
    id: 'set_3',
    key: 'kyc_tier_1_daily_limit',
    label: 'KYC Tier 1 Maximum Daily Turnover',
    value: '200,000 XAF',
    description: 'Upper threshold for basic SMS-verified customer transactions.',
    category: 'Limits',
  },
  {
    id: 'set_4',
    key: 'kyc_tier_2_daily_limit',
    label: 'KYC Tier 2 Maximum Daily Turnover',
    value: '2,000,000 XAF',
    description: 'Upper threshold for verified National ID cardholders.',
    category: 'Limits',
  },
  {
    id: 'set_5',
    key: 'kyc_tier_3_daily_limit',
    label: 'KYC Tier 3 Maximum Daily Turnover',
    value: '25,000,000 XAF',
    description: 'Corporate and verified high-net-worth accounts with certified proof of funds.',
    category: 'Limits',
  },
]
