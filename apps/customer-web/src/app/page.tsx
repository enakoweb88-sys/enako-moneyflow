"use client";

import React from "react";
import { CustomerHeader } from "@/components/layout/CustomerHeader";
import { CustomerSidebar } from "@/components/layout/CustomerSidebar";
import { CustomerOnboarding } from "@/components/common/CustomerOnboarding";
import { useCustomer } from "@/mock/CustomerContext";

// Page Components
import { LandingPage } from "@/components/pages/LandingPage";
import { RegisterPage } from "@/components/pages/RegisterPage";
import { LoginPage } from "@/components/pages/LoginPage";
import { ConfirmEmailPage } from "@/components/pages/ConfirmEmailPage";
import { DashboardPage } from "@/components/pages/DashboardPage";
import { BuyXafPage } from "@/components/pages/BuyXafPage";
import { WalletPage } from "@/components/pages/WalletPage";
import { SendWithdrawPage } from "@/components/pages/SendWithdrawPage";
import { BeneficiariesPage } from "@/components/pages/BeneficiariesPage";
import { ProfileKycPage } from "@/components/pages/ProfileKycPage";
import { SecurityPage } from "@/components/pages/SecurityPage";
import { NotificationsPage } from "@/components/pages/NotificationsPage";
import { SupportPage } from "@/components/pages/SupportPage";
import { CustomerDevelopersPage } from "@/components/pages/CustomerDevelopersPage";
import { CustomerAnalyticsPage } from "@/components/pages/CustomerAnalyticsPage";
import { DisputesPage } from "@/components/pages/DisputesPage";
import { PaymentActivationPage } from "@/components/pages/PaymentActivationPage";

export default function Home() {
  const { isLoggedIn, authLoading, activeNav, setActiveNav } = useCustomer();

  if (authLoading)
    return (
      <div className="grid min-h-dvh place-items-center bg-slate-50 text-sm font-medium text-slate-500">
        Restoring your secure session…
      </div>
    );

  // Unauthenticated pages (Landing, Register, Login, MFA)
  const isAuthPage =
    !isLoggedIn ||
    ["landing", "register", "login", "confirm-email"].includes(activeNav);

  const renderContent = () => {
    // If not logged in or on an auth page
    if (isAuthPage && !isLoggedIn) {
      switch (activeNav) {
        case "register":
          return <RegisterPage />;
        case "login":
          return <LoginPage />;
        case "confirm-email":
          return <ConfirmEmailPage />;
        case "landing":
        default:
          return <LandingPage />;
      }
    }

    if (activeNav.startsWith("dev-") || activeNav === "developers") {
      return (
        <CustomerDevelopersPage key={activeNav} initialSubPage={activeNav} />
      );
    }

    // Authenticated application pages
    switch (activeNav) {
      case "buy-xaf":
        return <BuyXafPage />;
      case "wallet":
        return <WalletPage />;
      case "analytics":
        return <CustomerAnalyticsPage />;
      case "send-withdraw":
        return <SendWithdrawPage />;
      case "activate-payments":
        return <PaymentActivationPage />;
      case "beneficiaries":
        return <BeneficiariesPage />;
      case "profile-kyc":
        return <ProfileKycPage />;
      case "security":
        return <SecurityPage />;
      case "notifications":
        return <NotificationsPage />;
      case "support":
        return <SupportPage />;
      case "disputes":
        return <DisputesPage />;
      case "dashboard":
      default:
        return <DashboardPage />;
    }
  };

  // Dedicated Public Marketing Homepage (Stripe-caliber design with custom sticky nav & mega-footer)
  if (!isLoggedIn && activeNav === "landing") {
    return <LandingPage />;
  }

  // Logged-out auth pages (Register, Login, MFA): Clean layout with CustomerHeader
  if (
    !isLoggedIn ||
    ["register", "login", "confirm-email"].includes(activeNav)
  ) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <CustomerHeader />
        <div className="flex-1 flex flex-col justify-start">
          {renderContent()}
        </div>
      </div>
    );
  }

  // Logged-in customer portal layout: Top bar + Sidebar + Main content
  const mobileNavTabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "wallet", label: "Wallet" },
    { id: "analytics", label: "Analytics" },
    { id: "send-withdraw", label: "Send & Withdraw" },
    { id: "activate-payments", label: "Activate payments" },
    { id: "beneficiaries", label: "Beneficiaries" },
    { id: "profile-kyc", label: "KYC" },
    { id: "security", label: "Security" },
    { id: "notifications", label: "Notices" },
    { id: "support", label: "Support" },
    { id: "disputes", label: "Disputes" },
    { id: "developers", label: "API" },
  ];

  return (
    <div className="h-dvh overflow-hidden flex flex-col bg-slate-50 font-sans">
      <CustomerHeader />

      {/* Mobile-only navigation bar (visible below md breakpoint) */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 overflow-x-auto flex space-x-2 shrink-0">
        {mobileNavTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveNav(tab.id)}
            className={`px-3 py-1.5 rounded text-xs whitespace-nowrap font-medium transition-colors ${
              activeNav === tab.id
                ? "bg-[#001f5b] text-white font-semibold"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        <CustomerSidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>
      <CustomerOnboarding />
    </div>
  );
}
