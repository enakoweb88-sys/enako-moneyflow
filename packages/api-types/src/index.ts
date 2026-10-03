/**
 * E-NAKO MoneyFlow API Types
 * Auto-generated from OpenAPI 3.1.0 Contract
 * Single Source of Truth across Frontend and Backend
 */

export interface LoginRequest {
  email: string;
  password: string;
  mfaCode?: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  role:
    | "CUSTOMER"
    | "OPERATOR"
    | "COMPLIANCE_OFFICER"
    | "FINANCE_CONTROLLER"
    | "TREASURY_ANALYST"
    | "SUPER_ADMIN";
  kycStatus: "Not started" | "Pending" | "Verified" | "More info needed";
  mfaRequired?: boolean;
}

export interface WalletBalanceResponse {
  currency: string;
  balance: number;
  available: number;
  held: number;
}

export interface CreateRemittanceRequest {
  sourceCurrency: "EUR" | "USD" | "GBP" | "CAD";
  sourceAmount: number;
}

export interface RemittanceOrder {
  id: string;
  reference: string;
  sourceAmount: number;
  sourceCurrency: string;
  netXaf: number;
  rate: number;
  status: "Pending" | "Processing" | "Completed" | "Failed";
  expiresAt: string;
}

export interface CreateWithdrawalRequest {
  beneficiaryId: string;
  amount: number;
  mfaCode?: string;
}

export interface WithdrawalOrder {
  id: string;
  reference: string;
  beneficiaryName: string;
  amount: number;
  fee: number;
  totalDebit: number;
  status: "Processing" | "Completed" | "Failed";
}

export interface ApprovalRequest {
  id: string;
  reference: string;
  type:
    | "MANUAL_CREDIT"
    | "FX_OVERRIDE"
    | "FEE_EXCEPTION"
    | "TIER_UPGRADE"
    | "RECONCILIATION_WRITE_OFF";
  maker: string;
  amount: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}
