"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  BarChart3,
  CircleHelp,
  ChevronDown,
  Code2,
  LayoutDashboard,
  Lock,
  Send,
  ShieldCheck,
  MessageSquareWarning,
  Users,
  Wallet,
} from "lucide-react";
import { useCustomer } from "@/mock/CustomerContext";

export const CustomerSidebar: React.FC = () => {
  const { activeNav, setActiveNav, notifications, user } = useCustomer();
  const [developerMenuOpen, setDeveloperMenuOpen] = useState(false);
  const developerMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!developerMenuRef.current?.contains(event.target as Node))
        setDeveloperMenuOpen(false);
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);
  const unread = notifications.filter(
    (notification) => notification.unread,
  ).length;
  const items = [
    {
      id: "dashboard",
      label: "Home",
      icon: LayoutDashboard,
      group: "Workspace",
    },
    {
      id: "wallet",
      label: "Wallet & statements",
      icon: Wallet,
      group: "Workspace",
    },
    {
      id: "analytics",
      label: "Activity & analytics",
      icon: BarChart3,
      group: "Workspace",
    },
    {
      id: "send-withdraw",
      label: "Send & withdraw",
      icon: Send,
      group: "Money movement",
    },
    {
      id: "beneficiaries",
      label: "Beneficiaries",
      icon: Users,
      group: "Money movement",
    },
    {
      id: "disputes",
      label: "Transaction disputes",
      icon: MessageSquareWarning,
      group: "Money movement",
    },
    {
      id: "profile-kyc",
      label: "Profile & verification",
      icon: ShieldCheck,
      group: "Account",
    },
    { id: "security", label: "Security", icon: Lock, group: "Account" },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      count: unread,
      group: "Account",
    },
    { id: "support", label: "Support", icon: CircleHelp, group: "Account" },
    {
      id: "developers",
      label: "API & developers",
      icon: Code2,
      group: "Developers",
    },
  ];
  const initials = (user.name || "New customer")
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="hidden w-60 shrink-0 flex-col justify-between border-r border-slate-200 bg-white md:flex">
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-5 flex items-center gap-2 px-2.5">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-[#001f5b] text-[9px] font-bold text-white">
            E
          </span>
          <span className="text-[13px] font-semibold tracking-tight text-slate-900">
            E‑NAKO MoneyFlow
          </span>
        </div>
        <nav className="space-y-0.5">
          {items.map((item, index) => {
            const Icon = item.icon;
            const isDeveloperMenu = item.id === "developers";
            const active =
              activeNav === item.id ||
              (isDeveloperMenu && activeNav.startsWith("dev-"));
            const previousGroup = items[index - 1]?.group;
            const groupHeading =
              item.group !== previousGroup ? (
                <p
                  className={`px-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400 ${index === 0 ? "mb-1" : "mb-1 mt-5"}`}
                >
                  {item.group}
                </p>
              ) : null;
            if (isDeveloperMenu) {
              return (
                <React.Fragment key={item.id}>
                  {groupHeading}
                  <div className="relative" ref={developerMenuRef}>
                    <button
                      type="button"
                      onClick={() => setDeveloperMenuOpen((open) => !open)}
                      className={`relative flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-[13px] font-medium transition-colors ${active ? "bg-[#001f5b]/8 font-semibold text-[#001f5b]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                      aria-expanded={developerMenuOpen}
                    >
                      {active ? (
                        <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 bg-[#001f5b]" />
                      ) : null}
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${developerMenuOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {developerMenuOpen ? (
                      <div className="absolute bottom-full left-1 right-1 z-30 mb-1 overflow-hidden rounded border border-slate-200 bg-white py-1 shadow-[0_8px_18px_rgba(15,23,42,0.13)]">
                        <p className="px-3 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          API workspace
                        </p>
                        {[
                          ["developers", "Overview"],
                          ["dev-keys", "API keys"],
                          ["dev-webhooks", "Webhooks"],
                          ["dev-logs", "Events & logs"],
                          ["dev-docs", "Documentation"],
                        ].map(([id, label]) => (
                          <button
                            key={id}
                            className="block w-full px-3 py-1.5 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-[#001f5b]"
                            onClick={() => {
                              setActiveNav(id);
                              setDeveloperMenuOpen(false);
                            }}
                            type="button"
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </React.Fragment>
              );
            }
            return (
              <React.Fragment key={item.id}>
                {groupHeading}
                <button
                  type="button"
                  onClick={() => setActiveNav(item.id)}
                  className={`relative flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-[13px] font-medium transition-colors ${active ? "bg-[#001f5b]/8 font-semibold text-[#001f5b]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                >
                  {active ? (
                    <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 bg-[#001f5b]" />
                  ) : null}
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {item.count ? (
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                      {item.count}
                    </span>
                  ) : null}
                </button>
              </React.Fragment>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-2.5 border-t border-slate-200 bg-slate-50/70 p-3.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#001f5b]/20 bg-[#001f5b]/10 text-xs font-bold text-[#001f5b]">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-slate-900">
            {user.name || "Account setup"}
          </p>
          <p className="text-[10px] font-semibold text-[#008f94]">
            {user.kycStatus === "Verified"
              ? `${user.kycTier} verified`
              : "Verification required"}
          </p>
        </div>
      </div>
    </aside>
  );
};
