"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  INITIAL_ACTIVITIES,
  INITIAL_BENEFICIARIES,
  INITIAL_CUSTOMER_USER,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SESSIONS,
  INITIAL_WALLET,
  type CustomerBeneficiary,
  type CustomerDocument,
  type CustomerNotification,
  type CustomerSession,
  type CustomerUser,
  type CustomerWallet,
  type TransactionActivity,
} from "./customerData";
import {
  clearSession,
  restoreSession,
  signInWithPassword,
  signUpWithPassword,
  type AuthSession,
} from "@/lib/supabaseAuth";

export type CustomerEnvironment = "sandbox" | "live";

interface CustomerContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;
  authLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  language: "EN" | "FR";
  toggleLanguage: () => void;
  environment: CustomerEnvironment;
  setEnvironment: (env: CustomerEnvironment) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  setRegistrationDetails: (details: {
    name: string;
    email: string;
    phone: string;
  }) => void;
  user: CustomerUser;
  wallet: CustomerWallet;
  activities: TransactionActivity[];
  beneficiaries: CustomerBeneficiary[];
  documents: CustomerDocument[];
  notifications: CustomerNotification[];
  sessions: CustomerSession[];
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
const unavailable = (feature: string) =>
  toast.info(`${feature} will be available when its live API is enabled.`);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("landing");
  const [language, setLanguage] = useState<"EN" | "FR">("EN");
  const [environment, setEnvironment] =
    useState<CustomerEnvironment>("sandbox");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [user, setUser] = useState<CustomerUser>(INITIAL_CUSTOMER_USER);
  const [wallet] = useState<CustomerWallet>(INITIAL_WALLET);
  const [activities] = useState<TransactionActivity[]>(INITIAL_ACTIVITIES);
  const [beneficiaries] = useState<CustomerBeneficiary[]>(
    INITIAL_BENEFICIARIES,
  );
  const [documents] = useState<CustomerDocument[]>(INITIAL_DOCUMENTS);
  const [notifications] = useState<CustomerNotification[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [sessions] = useState<CustomerSession[]>(INITIAL_SESSIONS);

  const loadApplicationProfile = async (session: AuthSession) => {
    const apiUrl = process.env.NEXT_PUBLIC_MONEYFLOW_API_URL;
    if (!apiUrl) return false;
    const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/v1/me`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    if (response.status === 404 || !response.ok) return false;
    const profile = (await response.json()) as {
      email?: string;
      displayName?: string;
    };
    setUser((current) => ({
      ...current,
      email: profile.email || session.user.email || "",
      name: profile.displayName || current.name,
    }));
    return true;
  };

  useEffect(() => {
    void (async () => {
      const session = await restoreSession();
      if (session) {
        setIsLoggedIn(true);
        const profileExists = await loadApplicationProfile(session);
        setActiveNav("dashboard");
        setShowOnboarding(!profileExists);
      }
      setAuthLoading(false);
    })();
  }, []);

  const signIn = async (email: string, password: string) => {
    const session = await signInWithPassword(email, password);
    setIsLoggedIn(true);
    setActiveNav("dashboard");
    setShowOnboarding(!(await loadApplicationProfile(session)));
  };
  const signUp = async (email: string, password: string) => {
    const session = await signUpWithPassword(email, password);
    if (!session) return false;
    setIsLoggedIn(true);
    setActiveNav("dashboard");
    setShowOnboarding(true);
    return true;
  };
  const signOut = () => {
    clearSession();
    setIsLoggedIn(false);
    setShowOnboarding(false);
    setActiveNav("landing");
    setUser(INITIAL_CUSTOMER_USER);
  };
  const setRegistrationDetails = (details: {
    name: string;
    email: string;
    phone: string;
  }) =>
    setUser((current) => ({
      ...current,
      name: details.name,
      email: details.email,
      phone: details.phone,
    }));

  return (
    <CustomerContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        authLoading,
        signIn,
        signUp,
        signOut,
        activeNav,
        setActiveNav,
        language,
        toggleLanguage: () => {
          const next = language === "EN" ? "FR" : "EN";
          setLanguage(next);
        },
        environment,
        setEnvironment,
        showOnboarding,
        setShowOnboarding,
        setRegistrationDetails,
        user,
        wallet,
        activities,
        beneficiaries,
        documents,
        notifications,
        sessions,
        buyXaf: () => unavailable("Remittance creation"),
        withdrawXaf: () => unavailable("Withdrawals"),
        addBeneficiary: () => unavailable("Beneficiary management"),
        removeBeneficiary: () => unavailable("Beneficiary management"),
        uploadDocument: () => unavailable("Document upload"),
        markAllNotificationsRead: () => unavailable("Notifications"),
        terminateSession: () => unavailable("Session management"),
        terminateAllOtherSessions: () => unavailable("Session management"),
        toggleMfa: () => unavailable("MFA changes"),
        updateProfile: () => unavailable("Profile updates"),
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context)
    throw new Error("useCustomer must be used within a CustomerProvider");
  return context;
};
