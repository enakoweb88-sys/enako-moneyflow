// Customer Portal Mock Data and State Management

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  kycStatus: "Verified" | "Pending" | "Not started" | "More info needed";
  kycTier: "Tier 1" | "Tier 2" | "Tier 3";
  mfaEnabled: boolean;
  nationalIdMasked: string;
  address: string;
}

export const INITIAL_CUSTOMER_USER: CustomerUser = {
  id: "cust_user_1",
  name: "Samuel Eto’o Fosso",
  email: "s.fosso@enako-group.cm",
  phone: "+237 677 89 23 82",
  kycStatus: "Verified",
  kycTier: "Tier 3",
  mfaEnabled: true,
  nationalIdMasked: "LT••••••9841",
  address: "Bonapriso, Douala, Littoral Region",
};

export interface CustomerWallet {
  currency: string;
  balance: number;
  available: number;
  held: number;
}

export const INITIAL_WALLET: CustomerWallet = {
  currency: "XAF",
  balance: 3450000,
  available: 3450000,
  held: 0,
};

export interface TransactionActivity {
  id: string;
  date: string;
  description: string;
  direction: "in" | "out";
  amountFormatted: string;
  amountNumeric: number;
  currency: string;
  runningBalance: string;
  status: "Completed" | "Pending" | "Failed" | "Processing";
}

export const INITIAL_ACTIVITIES: TransactionActivity[] = [
  {
    id: "tx_1",
    date: "2026-10-01 15:20",
    description: "Inward Remittance from EUR (SEPA Wire)",
    direction: "in",
    amountFormatted: "+3 260 106 XAF",
    amountNumeric: 3260106,
    currency: "XAF",
    runningBalance: "3 450 000 XAF",
    status: "Completed",
  },
  {
    id: "tx_2",
    date: "2026-09-28 10:14",
    description: "Withdrawal to MTN Mobile Money (+237 6••••82)",
    direction: "out",
    amountFormatted: "-252 500 XAF",
    amountNumeric: 252500,
    currency: "XAF",
    runningBalance: "189 894 XAF",
    status: "Completed",
  },
  {
    id: "tx_3",
    date: "2026-09-25 18:30",
    description: "Internal Wallet Transfer to Brice Ngannou",
    direction: "out",
    amountFormatted: "-150 000 XAF",
    amountNumeric: 150000,
    currency: "XAF",
    runningBalance: "442 394 XAF",
    status: "Completed",
  },
  {
    id: "tx_4",
    date: "2026-09-20 09:00",
    description: "Inward Remittance from USD",
    direction: "in",
    amountFormatted: "+592 394 XAF",
    amountNumeric: 592394,
    currency: "XAF",
    runningBalance: "592 394 XAF",
    status: "Completed",
  },
];

export interface CustomerBeneficiary {
  id: string;
  name: string;
  provider:
    | "MTN Mobile Money"
    | "Orange Money"
    | "Ecobank Cameroon"
    | "Afriland First Bank";
  accountMasked: string;
  accountReal: string;
  status: "Active" | "Cooldown";
  cooldownNote?: string;
}

export const INITIAL_BENEFICIARIES: CustomerBeneficiary[] = [
  {
    id: "ben_1",
    name: "Hélène Ngannou (Mother)",
    provider: "MTN Mobile Money",
    accountMasked: "+237 6••••••56",
    accountReal: "+237 677 12 34 56",
    status: "Active",
  },
  {
    id: "ben_2",
    name: "Jean-Marc Fosso (Brother)",
    provider: "Orange Money",
    accountMasked: "+237 6••••••12",
    accountReal: "+237 699 44 21 12",
    status: "Active",
  },
  {
    id: "ben_3",
    name: "GIE Agro-Pastorale Douala",
    provider: "Ecobank Cameroon",
    accountMasked: "CM21 1002 9••••••88",
    accountReal: "CM21 1002 9988 2211 4488",
    status: "Cooldown",
    cooldownNote:
      "Security cooldown active: Available in 18 hours after account addition.",
  },
];

export interface CustomerDocument {
  id: string;
  name: string;
  type: string;
  status: "Verified" | "Pending" | "Rejected";
  uploadedAt: string;
}

export const INITIAL_DOCUMENTS: CustomerDocument[] = [
  {
    id: "doc_1",
    name: "cni_national_id_front.pdf",
    type: "National ID (Front)",
    status: "Verified",
    uploadedAt: "2026-01-15",
  },
  {
    id: "doc_2",
    name: "cni_national_id_back.pdf",
    type: "National ID (Back)",
    status: "Verified",
    uploadedAt: "2026-01-15",
  },
  {
    id: "doc_3",
    name: "eneo_utility_bill_residence.pdf",
    type: "Proof of Address",
    status: "Verified",
    uploadedAt: "2026-01-15",
  },
];

export interface CustomerNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
}

export const INITIAL_NOTIFICATIONS: CustomerNotification[] = [
  {
    id: "notif_1",
    title: "Remittance Credited Successfully",
    description:
      "Your payment of 5 000 EUR was processed. 3 260 106 XAF has been credited to your wallet balance.",
    timestamp: "2 hours ago",
    unread: true,
  },
  {
    id: "notif_2",
    title: "New Beneficiary Added",
    description:
      "GIE Agro-Pastorale Douala was registered. Security cooldown will lift in 18 hours.",
    timestamp: "Yesterday at 14:20",
    unread: true,
  },
  {
    id: "notif_3",
    title: "KYC Tier 3 Verification Approved",
    description:
      "Your account limits have been increased to 25 000 000 XAF daily turnover.",
    timestamp: "3 days ago",
    unread: false,
  },
];

export interface CustomerSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export const INITIAL_SESSIONS: CustomerSession[] = [
  {
    id: "sess_1",
    device: "Chrome on macOS (Current Device)",
    location: "Douala, Cameroon",
    lastActive: "Just now",
    isCurrent: true,
  },
  {
    id: "sess_2",
    device: "Safari on iPhone 15 Pro",
    location: "Paris, France",
    lastActive: "3 days ago",
    isCurrent: false,
  },
];
