"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCustomer } from "@/mock/CustomerContext";

export const CustomerHeader: React.FC = () => {
  const {
    isLoggedIn,
    setIsLoggedIn,
    user,
    language,
    toggleLanguage,
    setActiveNav,
  } = useCustomer();

  const getKycBadgeVariant = (status: typeof user.kycStatus) => {
    switch (status) {
      case "Verified":
        return "success";
      case "Pending":
      case "More info needed":
        return "warning";
      case "Not started":
      default:
        return "neutral";
    }
  };

  return (
    <header className="bg-[#001f5b] text-white h-16 px-6 flex items-center justify-between border-b border-[#001744] shadow-sm shrink-0 select-none">
      {/* Brand Wordmark & Green Badge */}
      <div
        className="flex items-center space-x-3 cursor-pointer"
        onClick={() => {
          if (isLoggedIn) setActiveNav("dashboard");
          else setActiveNav("landing");
        }}
      >
        <div className="bg-white/10 ring-1 ring-white/20 px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider text-white">
          E-NAKO
        </div>
        <span className="font-bold text-lg tracking-tight text-white">
          E-NAKO MoneyFlow
        </span>
        <span className="text-[11px] font-semibold bg-[#001744] text-slate-300 border border-white/10 px-2.5 py-0.5 rounded-full font-mono hidden sm:inline-block">
          Customer Portal
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-5">
        {/* Language Toggle */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="text-xs bg-[#001744] text-white border border-white/15 px-3 py-1.5 rounded-lg hover:bg-[#001233] transition-colors cursor-pointer font-semibold"
        >
          Language: {language}
        </button>

        {isLoggedIn ? (
          <>
            {/* Customer User Info & KYC Status Pill */}
            <div className="hidden sm:flex items-center space-x-3">
              <span className="text-xs font-bold text-white">{user.name}</span>
              <Badge variant={getKycBadgeVariant(user.kycStatus)}>
                KYC: {user.kycStatus}
              </Badge>
            </div>

            {/* Logout Text Action */}
            <button
              type="button"
              onClick={() => {
                setIsLoggedIn(false);
                setActiveNav("landing");
              }}
              className="text-xs text-slate-400 hover:text-white font-medium cursor-pointer transition-colors"
            >
              Log out
            </button>
          </>
        ) : (
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setActiveNav("login")}
              className="text-xs text-slate-300 hover:text-white font-semibold cursor-pointer px-2 py-1"
            >
              Log in
            </button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setActiveNav("register")}
              className="text-xs"
            >
              Create account
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
