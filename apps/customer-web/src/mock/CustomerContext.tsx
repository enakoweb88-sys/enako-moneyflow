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
  resendConfirmationEmail,
  restoreSession,
  signInWithPassword,
  signOutSession,
  signUpWithPassword,
  updateAuthProfile,
  beginTotpEnrollment,
  verifyTotpEnrollment,
  beginPhoneVerification,
  verifyPhoneChange,
  onPasswordRecovery,
  type AuthSession,
} from "@/lib/supabaseAuth";

export type CustomerEnvironment = "sandbox" | "live";

interface CustomerContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;
  authLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    profile: { fullName: string; phone: string },
  ) => Promise<boolean>;
  signOut: () => Promise<void>;
  pendingConfirmationEmail: string;
  resendConfirmation: () => Promise<void>;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  language: "EN" | "FR";
  toggleLanguage: () => void;
  environment: CustomerEnvironment;
  setEnvironment: (env: CustomerEnvironment) => void;
  requestEnvironment: (env: CustomerEnvironment) => void;
  liveEligible: boolean;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  onboardingOrigin: "registration" | "dashboard";
  openOnboarding: (origin: "registration" | "dashboard") => void;
  setRegistrationDetails: (details: {
    name: string;
    email: string;
    phone: string;
  }) => void;
  completeOnboarding: () => Promise<void>;
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
  ) => Promise<void>;
  removeBeneficiary: (id: string) => Promise<void>;
  uploadDocument: (name: string, type: string) => void;
  markAllNotificationsRead: () => void;
  terminateSession: (sessionId: string) => void;
  terminateAllOtherSessions: () => void;
  toggleMfa: () => void;
  beginMfaEnrollment: () => Promise<{
    factorId: string;
    qrCode: string;
    secret: string;
  }>;
  verifyMfaEnrollment: (factorId: string, code: string) => Promise<void>;
  beginPhoneVerification: (phone: string) => Promise<void>;
  verifyPhoneVerification: (phone: string, code: string) => Promise<void>;
  updateProfile: (
    name: string,
    phone: string,
    address: string,
    avatarId: number,
  ) => Promise<void>;
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
  const [pendingConfirmationEmail, setPendingConfirmationEmail] = useState("");
  const [activeNav, setActiveNav] = useState("landing");
  const [language, setLanguage] = useState<"EN" | "FR">("EN");
  const [environment, setEnvironment] =
    useState<CustomerEnvironment>("sandbox");
  const liveEligible = false;
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingOrigin, setOnboardingOrigin] = useState<
    "registration" | "dashboard"
  >("registration");
  const [user, setUser] = useState<CustomerUser>(INITIAL_CUSTOMER_USER);
  const [wallet] = useState<CustomerWallet>(INITIAL_WALLET);
  const [activities] = useState<TransactionActivity[]>(INITIAL_ACTIVITIES);
  const [beneficiaries, setBeneficiaries] = useState<CustomerBeneficiary[]>(
    INITIAL_BENEFICIARIES,
  );
  const [documents] = useState<CustomerDocument[]>(INITIAL_DOCUMENTS);
  const [notifications] = useState<CustomerNotification[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [sessions] = useState<CustomerSession[]>(INITIAL_SESSIONS);

  const loadApplicationProfile = async (
    session: AuthSession,
  ): Promise<"exists" | "missing" | "unavailable"> => {
    setUser((current) => ({
      ...current,
      id: session.user.id,
      email: session.user.email || current.email,
      name: session.user.fullName || current.name,
      phone: session.user.phone || current.phone,
      phoneVerified: session.user.phoneVerified ?? current.phoneVerified,
      avatarId: session.user.avatarId ?? current.avatarId,
    }));
    const apiUrl = process.env.NEXT_PUBLIC_MONEYFLOW_API_URL;
    if (!apiUrl) return "unavailable";
    try {
      const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/v1/me`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      if (response.status === 404) return "missing";
      if (!response.ok) return "unavailable";
      const profile = (await response.json()) as {
        email?: string;
        displayName?: string;
      };
      setUser((current) => ({
        ...current,
        email: profile.email || session.user.email || "",
        name:
          (profile.displayName && profile.displayName !== profile.email
            ? profile.displayName
            : session.user.fullName) ||
          profile.displayName ||
          current.name,
      }));
      return "exists";
    } catch {
      // A backend outage, CORS block, or local network issue must not invalidate
      // a valid Supabase session or crash the customer portal.
      setUser((current) => ({
        ...current,
        email: current.email || session.user.email || "",
      }));
      return "unavailable";
    }
  };

  useEffect(() => {
    const savedEnvironment = window.localStorage.getItem(
      "moneyflow-environment",
    );
    // Restore the explicitly selected environment during client hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedEnvironment === "sandbox") setEnvironment("sandbox");
    void (async () => {
      const session = await restoreSession();
      if (session) {
        setIsLoggedIn(true);
        const profileState = await loadApplicationProfile(session);
        const savedPage = window.localStorage.getItem("moneyflow-active-page");
        setActiveNav(
          savedPage &&
            !["landing", "login", "register", "confirm-email"].includes(
              savedPage,
            )
            ? savedPage
            : "dashboard",
        );
        if (profileState === "missing") {
          setOnboardingOrigin("registration");
          setShowOnboarding(true);
        }
      }
      setAuthLoading(false);
    })();
  }, []);

  useEffect(
    () =>
      onPasswordRecovery(() => {
        setIsLoggedIn(true);
        setActiveNav("reset-password");
      }),
    [],
  );

  useEffect(() => {
    if (isLoggedIn && activeNav !== "reset-password")
      window.localStorage.setItem("moneyflow-active-page", activeNav);
  }, [activeNav, isLoggedIn]);

  const beneficiaryRequest = async (path = "", init?: RequestInit) => {
    const session = await restoreSession();
    if (!session)
      throw new Error("Your session has expired. Please sign in again.");
    const apiUrl = process.env.NEXT_PUBLIC_MONEYFLOW_API_URL;
    if (!apiUrl)
      throw new Error("Customer API is not configured for this environment.");
    const response = await fetch(
      `${apiUrl.replace(/\/$/, "")}/api/v1/beneficiaries${path}`,
      {
        ...init,
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
          "X-MoneyFlow-Environment": environment,
          ...(init?.headers || {}),
        },
      },
    );
    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as {
        detail?: string;
        message?: string;
        error?: string;
      };
      throw new Error(
        payload.detail ||
          payload.message ||
          payload.error ||
          `Beneficiary request failed (${response.status}).`,
      );
    }
    if (response.status === 204) return null;
    return response.json();
  };

  const refreshBeneficiaries = async () => {
    const records = (await beneficiaryRequest()) as Array<{
      id: string;
      displayName: string;
      provider: CustomerBeneficiary["provider"];
      accountMasked: string;
      status: "active" | "cooldown";
    }>;
    setBeneficiaries(
      records.map((record) => ({
        id: record.id,
        name: record.displayName,
        provider: record.provider,
        accountMasked: record.accountMasked,
        accountReal: "",
        status: record.status === "active" ? "Active" : "Cooldown",
        cooldownNote:
          record.status === "cooldown"
            ? "Available after the 24-hour security hold"
            : undefined,
      })),
    );
  };

  useEffect(() => {
    if (!isLoggedIn || activeNav !== "beneficiaries") return;
    // Refresh the server-backed collection when its page becomes active.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshBeneficiaries().catch((error) =>
      toast.error(
        error instanceof Error
          ? error.message
          : "Beneficiaries could not be loaded.",
      ),
    );
  }, [activeNav, environment, isLoggedIn]);

  const requestEnvironment = (next: CustomerEnvironment) => {
    if (next === "live" && !liveEligible) {
      setActiveNav("live-activation");
      return;
    }
    setEnvironment(next);
    window.localStorage.setItem("moneyflow-environment", next);
    setActiveNav("dashboard");
  };

  const signIn = async (email: string, password: string) => {
    const session = await signInWithPassword(email, password);
    setIsLoggedIn(true);
    setActiveNav("dashboard");
    if ((await loadApplicationProfile(session)) === "missing") {
      setOnboardingOrigin("registration");
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  };
  const signUp = async (
    email: string,
    password: string,
    profile: { fullName: string; phone: string },
  ) => {
    const session = await signUpWithPassword(email, password, profile);
    if (!session) {
      setPendingConfirmationEmail(email);
      return false;
    }
    setIsLoggedIn(true);
    setActiveNav("dashboard");
    setOnboardingOrigin("registration");
    setShowOnboarding(true);
    return true;
  };
  const resendConfirmation = async () => {
    if (!pendingConfirmationEmail) {
      throw new Error(
        "Enter your email again so we know where to send the confirmation link.",
      );
    }
    await resendConfirmationEmail(pendingConfirmationEmail);
  };
  const signOut = async () => {
    await signOutSession();
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

  const openOnboarding = (origin: "registration" | "dashboard") => {
    setOnboardingOrigin(origin);
    setShowOnboarding(true);
  };

  const completeOnboarding = async () => {
    const session = await restoreSession();
    if (!session)
      throw new Error("Your session has expired. Please sign in again.");
    const apiUrl = process.env.NEXT_PUBLIC_MONEYFLOW_API_URL;
    if (!apiUrl)
      throw new Error("Customer API is not configured for this environment.");
    const response = await fetch(
      `${apiUrl.replace(/\/$/, "")}/api/v1/customers/me`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName:
            user.name ||
            session.user.fullName ||
            session.user.email ||
            "Customer",
          phoneE164: user.phone || session.user.phone || null,
        }),
      },
    );
    const payload = (await response.json().catch(() => ({}))) as {
      message?: string;
      displayName?: string;
      email?: string;
    };
    if (!response.ok)
      throw new Error(payload.message || "We could not finish account setup.");
    setUser((current) => ({
      ...current,
      name: payload.displayName || current.name,
      email: payload.email || session.user.email || current.email,
    }));
    setShowOnboarding(false);
    setActiveNav("dashboard");
  };

  const updateProfile = async (
    name: string,
    phone: string,
    address: string,
    avatarId: number,
  ) => {
    const session = await restoreSession();
    if (!session)
      throw new Error("Your session has expired. Please sign in again.");
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    await updateAuthProfile({
      fullName: cleanName,
      phone: cleanPhone,
      avatarId,
    });

    const apiUrl = process.env.NEXT_PUBLIC_MONEYFLOW_API_URL;
    if (apiUrl) {
      const response = await fetch(
        `${apiUrl.replace(/\/$/, "")}/api/v1/customers/me`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            displayName: cleanName,
            phoneE164: cleanPhone || null,
          }),
        },
      );
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(payload.message || "We could not save your profile.");
      }
    }
    setUser((current) => ({
      ...current,
      name: cleanName,
      phone: cleanPhone,
      address,
      avatarId,
    }));
  };

  return (
    <CustomerContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        authLoading,
        signIn,
        signUp,
        signOut,
        pendingConfirmationEmail,
        resendConfirmation,
        activeNav,
        setActiveNav,
        language,
        toggleLanguage: () => {
          const next = language === "EN" ? "FR" : "EN";
          setLanguage(next);
        },
        environment,
        setEnvironment,
        requestEnvironment,
        liveEligible,
        showOnboarding,
        setShowOnboarding,
        onboardingOrigin,
        openOnboarding,
        setRegistrationDetails,
        completeOnboarding,
        user,
        wallet,
        activities,
        beneficiaries,
        documents,
        notifications,
        sessions,
        buyXaf: () => unavailable("Remittance creation"),
        withdrawXaf: () => unavailable("Withdrawals"),
        addBeneficiary: async (name, provider, account) => {
          await beneficiaryRequest("", {
            method: "POST",
            body: JSON.stringify({
              displayName: name,
              provider,
              accountReference: account,
            }),
          });
          await refreshBeneficiaries();
        },
        removeBeneficiary: async (id) => {
          await beneficiaryRequest(`/${id}`, { method: "DELETE" });
          setBeneficiaries((current) =>
            current.filter((beneficiary) => beneficiary.id !== id),
          );
        },
        uploadDocument: () => unavailable("Document upload"),
        markAllNotificationsRead: () => unavailable("Notifications"),
        terminateSession: () => unavailable("Session management"),
        terminateAllOtherSessions: () => unavailable("Session management"),
        toggleMfa: () => unavailable("MFA changes"),
        beginMfaEnrollment: beginTotpEnrollment,
        verifyMfaEnrollment: async (factorId, code) => {
          await verifyTotpEnrollment(factorId, code);
          setUser((current) => ({ ...current, mfaEnabled: true }));
        },
        beginPhoneVerification,
        verifyPhoneVerification: async (phone, code) => {
          await verifyPhoneChange(phone, code);
          setUser((current) => ({ ...current, phone, phoneVerified: true }));
        },
        updateProfile,
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
