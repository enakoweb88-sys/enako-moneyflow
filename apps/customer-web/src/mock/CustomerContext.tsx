"use client";

import React, { createContext, useContext, useState } from "react";
import {
  INITIAL_CUSTOMER_USER,
  INITIAL_WALLET,
  INITIAL_ACTIVITIES,
  INITIAL_BENEFICIARIES,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SESSIONS,
  type CustomerUser,
  type CustomerWallet,
  type TransactionActivity,
  type CustomerBeneficiary,
  type CustomerDocument,
  type CustomerNotification,
  type CustomerSession,
} from "./customerData";
import { toast } from "sonner";

interface CustomerContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  language: "EN" | "FR";
  toggleLanguage: () => void;

  user: CustomerUser;
  wallet: CustomerWallet;
  activities: TransactionActivity[];
  beneficiaries: CustomerBeneficiary[];
  documents: CustomerDocument[];
  notifications: CustomerNotification[];
  sessions: CustomerSession[];

  // Actions
  buyXaf: (amountSource: number, currency: string, netXaf: number) => void;
  withdrawXaf: (amount: number, fee: number, beneficiaryName: string) => void;
  addBeneficiary: (
    name: string,
    provider: CustomerBeneficiary["provider"],
    account: string,
  ) => void;
  removeBeneficiary: (id: string) => void;
  uploadDocument: (name: string, type: string) => void;
  markAllNotificationsRead: () => void;
  terminateSession: (sessionId: string) => void;
  terminateAllOtherSessions: () => void;
  toggleMfa: () => void;
  updateProfile: (name: string, phone: string, address: string) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(
  undefined,
);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [language, setLanguage] = useState<"EN" | "FR">("EN");

  const [user, setUser] = useState<CustomerUser>(INITIAL_CUSTOMER_USER);
  const [wallet, setWallet] = useState<CustomerWallet>(INITIAL_WALLET);
  const [activities, setActivities] =
    useState<TransactionActivity[]>(INITIAL_ACTIVITIES);
  const [beneficiaries, setBeneficiaries] = useState<CustomerBeneficiary[]>(
    INITIAL_BENEFICIARIES,
  );
  const [documents, setDocuments] =
    useState<CustomerDocument[]>(INITIAL_DOCUMENTS);
  const [notifications, setNotifications] = useState<CustomerNotification[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [sessions, setSessions] = useState<CustomerSession[]>(INITIAL_SESSIONS);

  const toggleLanguage = () => {
    const next = language === "EN" ? "FR" : "EN";
    setLanguage(next);
    toast.success(`Language set to ${next}`);
  };

  const buyXaf = (amountSource: number, currency: string, netXaf: number) => {
    const now = new Date();
    const dateStr = `${now.toISOString().split("T")[0]} ${now.toTimeString().substring(0, 5)}`;
    const newTx: TransactionActivity = {
      id: `tx_${Date.now()}`,
      date: dateStr,
      description: `Inward Remittance from ${currency} (${amountSource.toLocaleString()} ${currency})`,
      direction: "in",
      amountFormatted: `+${netXaf.toLocaleString()} XAF`,
      amountNumeric: netXaf,
      currency: "XAF",
      runningBalance: `${(wallet.balance + netXaf).toLocaleString()} XAF`,
      status: "Pending",
    };

    setActivities((prev) => [newTx, ...prev]);
    setWallet((prev) => ({
      ...prev,
      balance: prev.balance + netXaf,
      available: prev.available + netXaf,
    }));
    toast.success("Remittance created and submitted for verification.");
  };

  const withdrawXaf = (
    amount: number,
    fee: number,
    beneficiaryName: string,
  ) => {
    const totalDebit = amount + fee;
    const now = new Date();
    const dateStr = `${now.toISOString().split("T")[0]} ${now.toTimeString().substring(0, 5)}`;

    const newTx: TransactionActivity = {
      id: `tx_${Date.now()}`,
      date: dateStr,
      description: `Disbursement to ${beneficiaryName}`,
      direction: "out",
      amountFormatted: `-${totalDebit.toLocaleString()} XAF`,
      amountNumeric: totalDebit,
      currency: "XAF",
      runningBalance: `${(wallet.balance - totalDebit).toLocaleString()} XAF`,
      status: "Processing",
    };

    setActivities((prev) => [newTx, ...prev]);
    setWallet((prev) => ({
      ...prev,
      balance: prev.balance - totalDebit,
      available: prev.available - totalDebit,
    }));
    toast.success("Withdrawal submitted for processing.");
  };

  const addBeneficiary = (
    name: string,
    provider: CustomerBeneficiary["provider"],
    account: string,
  ) => {
    const newBen: CustomerBeneficiary = {
      id: `ben_${Date.now()}`,
      name,
      provider,
      accountMasked:
        account.length > 6
          ? `${account.substring(0, 4)}••••••${account.substring(account.length - 2)}`
          : account,
      accountReal: account,
      status: "Cooldown",
      cooldownNote: "Security cooldown active: Available in 24 hours.",
    };
    setBeneficiaries((prev) => [newBen, ...prev]);
    toast.success(
      "Beneficiary added successfully. 24-hour security cooldown initiated.",
    );
  };

  const removeBeneficiary = (id: string) => {
    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
    toast.success("Beneficiary removed from your saved list.");
  };

  const uploadDocument = (name: string, type: string) => {
    const now = new Date().toISOString().split("T")[0];
    const newDoc: CustomerDocument = {
      id: `doc_${Date.now()}`,
      name,
      type,
      status: "Pending",
      uploadedAt: now,
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setUser((prev) => ({ ...prev, kycStatus: "Pending" }));
    toast.success(
      "Identity document uploaded and queued for compliance review.",
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success("All notifications marked as read.");
  };

  const terminateSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast.success("Device session revoked successfully.");
  };

  const terminateAllOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    toast.success("All other remote device sessions terminated.");
  };

  const toggleMfa = () => {
    setUser((prev) => {
      const next = !prev.mfaEnabled;
      toast.success(
        `Multi-factor authentication (MFA) ${next ? "enabled" : "disabled"}.`,
      );
      return { ...prev, mfaEnabled: next };
    });
  };

  const updateProfile = (name: string, phone: string, address: string) => {
    setUser((prev) => ({ ...prev, name, phone, address }));
    toast.success("Profile contact details updated.");
  };

  return (
    <CustomerContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        activeNav,
        setActiveNav,
        language,
        toggleLanguage,
        user,
        wallet,
        activities,
        beneficiaries,
        documents,
        notifications,
        sessions,
        buyXaf,
        withdrawXaf,
        addBeneficiary,
        removeBeneficiary,
        uploadDocument,
        markAllNotificationsRead,
        terminateSession,
        terminateAllOtherSessions,
        toggleMfa,
        updateProfile,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
};
