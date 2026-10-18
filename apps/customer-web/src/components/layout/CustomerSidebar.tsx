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
    <aside className="hidden w-60 shrink-0 flex-col justify-between border-r border-slate-200 bg-white md:flex">
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <button
          type="button"
          onClick={() => setActiveNav("profile-kyc")}
          className="mb-5 flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-left transition hover:border-[#008f94]/30 hover:bg-white hover:shadow-sm"
        >
          <CustomerAvatar
            avatarId={user.avatarId}
            label={`${user.name || "Customer"} avatar`}
            className="h-11 w-11 ring-2 ring-white shadow-sm"
          />
          <span className="min-w-0 flex-1">
            <strong className="block truncate text-[13px] font-bold text-slate-900">
              {user.name || "Complete your profile"}
            </strong>
            <small className="mt-0.5 block truncate text-[10px] font-medium text-slate-500">
              {user.email || "Choose your name and avatar"}
            </small>
            <small className="mt-1 block text-[10px] font-bold text-[#008f94]">
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
      <button
        type="button"
        onClick={() => setActiveNav("profile-kyc")}
        className="border-t border-slate-200 p-3.5 text-left text-[11px] font-semibold text-slate-500 hover:bg-slate-50 hover:text-[#001f5b]"
      >
        {user.kycStatus === "Verified"
          ? `${user.kycTier} identity verified`
          : "Complete identity verification →"}
      </button>
    </aside>
  );
};
