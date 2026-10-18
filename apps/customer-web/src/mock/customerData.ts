// Customer portal data contracts. No demonstration accounts or financial records ship with the app.

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
  avatarId: number;
}

export interface CustomerWallet {
  currency: string;
  balance: number;
  available: number;
  held: number;
}

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

export interface CustomerDocument {
  id: string;
  name: string;
  type: string;
  status: "Verified" | "Pending" | "Rejected";
  uploadedAt: string;
}

export interface CustomerNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
}

export interface CustomerSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export const INITIAL_CUSTOMER_USER: CustomerUser = {
  id: "",
  name: "",
  email: "",
  phone: "",
  kycStatus: "Not started",
  kycTier: "Tier 1",
  mfaEnabled: false,
  nationalIdMasked: "",
  address: "",
  avatarId: 0,
};
export const INITIAL_WALLET: CustomerWallet = {
  currency: "XAF",
  balance: 0,
  available: 0,
  held: 0,
};
export const INITIAL_ACTIVITIES: TransactionActivity[] = [];
export const INITIAL_BENEFICIARIES: CustomerBeneficiary[] = [];
export const INITIAL_DOCUMENTS: CustomerDocument[] = [];
export const INITIAL_NOTIFICATIONS: CustomerNotification[] = [];
export const INITIAL_SESSIONS: CustomerSession[] = [];
