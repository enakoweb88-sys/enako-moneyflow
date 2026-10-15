"use client";

import React from "react";
import {
  Bell,
  CircleHelp,
  Code2,
  LayoutDashboard,
  Lock,
  Send,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { useCustomer } from "@/mock/CustomerContext";

export const CustomerSidebar: React.FC = () => {
  const { activeNav, setActiveNav, notifications, user } = useCustomer();
  const unread = notifications.filter(
    (notification) => notification.unread,
  ).length;
  const items = [
    { id: "dashboard", label: "Home", icon: LayoutDashboard },
    { id: "wallet", label: "Wallet & statements", icon: Wallet },
    { id: "send-withdraw", label: "Send & withdraw", icon: Send },
    { id: "beneficiaries", label: "Beneficiaries", icon: Users },
    { id: "profile-kyc", label: "Profile & verification", icon: ShieldCheck },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell, count: unread },
    { id: "support", label: "Support", icon: CircleHelp },
    { id: "developers", label: "API & developers", icon: Code2 },
  ];
  const initials = (user.name || "New customer")
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="hidden w-60 shrink-0 flex-col justify-between border-r border-slate-200/90 bg-white shadow-[1px_0_3px_rgba(0,0,0,0.02)] md:flex">
      <div className="flex-1 overflow-y-auto p-3">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Customer portal
        </p>
        <nav className="space-y-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNav(item.id)}
                className={`relative flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-medium transition-colors ${active ? "bg-[#001f5b]/10 font-bold text-[#001f5b]" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
              >
                {active ? (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#001f5b]" />
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
