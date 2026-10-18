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
  CreditCard,
  Users,
  Wallet,
} from "lucide-react";
import { useCustomer } from "@/mock/CustomerContext";
import { CustomerAvatar } from "@/components/common/CustomerAvatar";

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
      id: "activate-payments",
      label: "Activate payments",
      icon: CreditCard,
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
  return (
    <aside className="relative hidden w-64 shrink-0 flex-col justify-between overflow-hidden border-r border-[#eadbd0] bg-[#fbf6f0] md:flex">
      <div className="pointer-events-none absolute -left-24 -top-28 h-64 w-64 rounded-full bg-[#efaaa0]/18 blur-3xl" />
      <div className="relative flex-1 overflow-y-auto px-3.5 py-5">
        <button
          type="button"
          onClick={() => setActiveNav("profile-kyc")}
          className="mb-6 flex w-full items-center gap-3 rounded-2xl border border-[#e8d2c8] bg-white/75 p-3 text-left shadow-[0_8px_24px_rgba(111,65,50,.06)] transition hover:-translate-y-0.5 hover:border-[#dc8a82] hover:bg-white hover:shadow-md"
        >
          <CustomerAvatar
            avatarId={user.avatarId}
            label={`${user.name || "Customer"} avatar`}
            className="h-11 w-11 ring-2 ring-[#f3b6ad] shadow-sm"
          />
          <span className="min-w-0 flex-1">
            <strong className="block truncate text-[13px] font-bold text-slate-900">
              {user.name || "Complete your profile"}
            </strong>
            <small className="mt-0.5 block truncate text-[10px] font-medium text-slate-500">
              {user.email || "Choose your name and avatar"}
            </small>
            <small className="mt-1 block text-[10px] font-bold text-[#b65359]">
              View profile
            </small>
          </span>
        </button>
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
                  className={`px-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#a78d82] ${index === 0 ? "mb-1.5" : "mb-1.5 mt-5"}`}
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
                      className={`relative flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-[13px] font-medium transition-all ${active ? "bg-[#f3ddd4] font-semibold text-[#793e3f] shadow-sm" : "text-[#655852] hover:bg-white/80 hover:text-[#332b28]"}`}
                      aria-expanded={developerMenuOpen}
                    >
                      {active ? (
                        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-[#d76164]" />
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
                          Workbench
                        </p>
                        {[
                          ["developers", "Overview"],
                          ["dev-webhooks", "Webhooks"],
                          ["dev-events", "Events"],
                          ["dev-logs", "Logs"],
                          ["dev-more", "More…"],
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
                        <div className="my-1 border-t border-slate-200" />
                        <p className="px-3 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Documentation
                        </p>
                        {[
                          ["dev-docs", "Documentation"],
                          ["dev-reference", "API reference ↗"],
                          ["dev-sdks", "SDKs ↗"],
                          ["dev-cli", "CLI ↗"],
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
                        <div className="my-1 border-t border-slate-200" />
                        {[
                          ["dev-keys", "API keys"],
                          ["dev-apps", "Created apps"],
                          ["dev-settings", "Developer settings"],
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
                  className={`relative flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-[13px] font-medium transition-all ${active ? "bg-[#f3ddd4] font-semibold text-[#793e3f] shadow-sm" : "text-[#655852] hover:translate-x-0.5 hover:bg-white/80 hover:text-[#332b28]"}`}
                >
                  {active ? (
                    <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-[#d76164]" />
                  ) : null}
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {item.count ? (
                    <span className="rounded-full bg-[#edd4cb] px-1.5 py-0.5 text-[10px] font-bold text-[#8d494c]">
                      {item.count}
                    </span>
                  ) : null}
                </button>
              </React.Fragment>
            );
          })}
        </nav>
      </div>
      <button
        type="button"
        onClick={() => setActiveNav("profile-kyc")}
        className="relative m-3.5 mt-2 rounded-xl border border-[#e5cfc5] bg-gradient-to-r from-[#fffaf6] to-[#f5dfd7] p-3.5 text-left text-[11px] font-bold text-[#8c4c4f] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        {user.kycStatus === "Verified"
          ? `${user.kycTier} identity verified`
          : "Complete identity verification →"}
      </button>
    </aside>
  );
};
