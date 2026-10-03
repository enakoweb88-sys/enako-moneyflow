"use client";

import React from "react";
import {
  LayoutDashboard,
  ArrowUpRight,
  Wallet,
  Send,
  Users,
  ShieldCheck,
  Lock,
  Bell,
  HelpCircle,
} from "lucide-react";
import { useCustomer } from "@/mock/CustomerContext";

export const CustomerSidebar: React.FC = () => {
  const { activeNav, setActiveNav, notifications, user } = useCustomer();

  const unreadNotifs = notifications.filter((n) => n.unread).length;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "buy-xaf", label: "Buy XAF", icon: ArrowUpRight },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "send-withdraw", label: "Send & Withdraw", icon: Send },
    { id: "beneficiaries", label: "Beneficiaries", icon: Users },
    { id: "profile-kyc", label: "Profile & KYC", icon: ShieldCheck },
    { id: "security", label: "Security", icon: Lock },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      count: unreadNotifs,
    },
    { id: "support", label: "Support", icon: HelpCircle },
  ];

  const userInitials = user.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 hidden md:flex shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
      <div className="p-3 overflow-y-auto scrollbar-hide">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          NAVIGATION
        </div>
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNav(item.id)}
                className={`relative w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all duration-150 ease-in-out cursor-pointer active:scale-[0.98] flex items-center justify-between group ${
                  isActive
                    ? "bg-[#001f5b]/10 text-[#001f5b] font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
                }`}
              >
                {/* Active Pill Indicator on left border — ENAKO Oxford Navy #001f5b */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3.5px] h-6 bg-[#001f5b] rounded-r-full shadow-xs" />
                )}

                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? "text-[#001f5b]"
                        : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-[#001f5b]/20 text-[#001f5b] font-bold"
                        : "bg-slate-100 text-slate-500 font-semibold"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Customer Account Status Card with Avatar Initials */}
      <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#001f5b]/10 border border-[#001f5b]/20 flex items-center justify-center text-xs font-bold text-[#001f5b] shrink-0">
            {userInitials}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">
              {user.name}
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Tier 3 Verified Account
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
