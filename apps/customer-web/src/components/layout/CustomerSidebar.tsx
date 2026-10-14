"use client";

import React, { useState, useRef, useEffect } from "react";
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
  AlertTriangle,
  BarChart3,
  Terminal,
  ExternalLink,
  ChevronRight,
  Building2,
} from "lucide-react";
import { useCustomer } from "@/mock/CustomerContext";

export const CustomerSidebar: React.FC = () => {
  const { activeNav, setActiveNav, notifications, user } = useCustomer();
  const [isDevMenuOpen, setIsDevMenuOpen] = useState(false);
  const [isMoreSubmenuOpen, setIsMoreSubmenuOpen] = useState(false);
  const devMenuRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter((n) => n.unread).length;

  // Close dev menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        devMenuRef.current &&
        !devMenuRef.current.contains(event.target as Node)
      ) {
        setIsDevMenuOpen(false);
        setIsMoreSubmenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { id: "dashboard", label: "Home", icon: LayoutDashboard },
    { id: "buy-xaf", label: "Buy XAF", icon: ArrowUpRight },
    { id: "wallet", label: "Wallet & Statements", icon: Wallet },
    { id: "send-withdraw", label: "Send & Withdraw", icon: Send },
    { id: "beneficiaries", label: "Beneficiaries", icon: Users },
    { id: "disputes", label: "Disputes", icon: AlertTriangle },
    { id: "analytics", label: "Your overview", icon: BarChart3 },
    { id: "profile-kyc", label: "Business & Settings", icon: Building2 },
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

  const handleSelectDevPage = (pageId: string) => {
    setActiveNav(pageId);
    setIsDevMenuOpen(false);
    setIsMoreSubmenuOpen(false);
  };

  const isDevActive =
    activeNav.startsWith("dev-") || activeNav === "developers";

  return (
    <aside className="w-60 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 hidden md:flex shadow-[1px_0_3px_rgba(0,0,0,0.02)] select-none relative font-sans">
      <div className="p-3 overflow-y-auto scrollbar-hide flex-1">
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
                className={`relative w-full text-left px-3 py-2 rounded-md text-xs transition-all duration-150 ease-in-out cursor-pointer active:scale-[0.98] flex items-center justify-between group ${
                  isActive
                    ? "bg-[#001f5b]/10 text-[#001f5b] font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
                }`}
              >
                {/* Active Pill Indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#001f5b] rounded-r-full" />
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
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
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

      {/* Pinned Developers Button with Floating Popover Dropdown matching exact screenshot */}
      <div
        ref={devMenuRef}
        className="p-3 border-t border-slate-200/90 relative"
      >
        <button
          type="button"
          onClick={() => setIsDevMenuOpen(!isDevMenuOpen)}
          className={`w-full text-left px-3 py-2 rounded-md text-xs transition-all duration-150 ease-in-out cursor-pointer flex items-center justify-between ${
            isDevActive
              ? "bg-[#001f5b]/10 text-[#001f5b] font-bold"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-600">
              &gt;_
            </span>
            <span>Developers</span>
          </div>
          <ChevronRight
            className={`w-3.5 h-3.5 transition-transform text-slate-400 ${
              isDevMenuOpen ? "-rotate-90" : ""
            }`}
          />
        </button>

        {/* Floating Menu matching exact screenshot */}
        {isDevMenuOpen && (
          <div className="absolute bottom-14 left-3 z-50 w-56 bg-white border border-slate-200/90 rounded-xl shadow-xl p-2 text-xs font-sans animate-in fade-in zoom-in-95 duration-100">
            {/* Workbench Section */}
            <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Workbench
            </div>
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => handleSelectDevPage("dev-overview")}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => handleSelectDevPage("dev-webhooks")}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                Webhooks
              </button>
              <button
                type="button"
                onClick={() => handleSelectDevPage("dev-events")}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                Events
              </button>
              <button
                type="button"
                onClick={() => handleSelectDevPage("dev-logs")}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                Logs
              </button>

              {/* More... with Flyout Submenu */}
              <div
                className="relative"
                onMouseEnter={() => setIsMoreSubmenuOpen(true)}
                onMouseLeave={() => setIsMoreSubmenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setIsMoreSubmenuOpen(!isMoreSubmenuOpen)}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-700 hover:text-slate-900 flex items-center justify-between cursor-pointer"
                >
                  <span>More...</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Flyout Submenu matching screenshot */}
                {isMoreSubmenuOpen && (
                  <div className="absolute left-full -bottom-10 ml-1.5 w-44 bg-white border border-slate-200/90 rounded-xl shadow-xl p-1.5 text-xs font-sans z-50">
                    <button
                      type="button"
                      onClick={() => handleSelectDevPage("dev-health")}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 text-slate-700 cursor-pointer"
                    >
                      Health
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectDevPage("dev-inspector")}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 text-slate-700 cursor-pointer"
                    >
                      Inspector
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectDevPage("dev-blueprints")}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 text-slate-700 cursor-pointer"
                    >
                      Blueprints
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectDevPage("dev-extensions")}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 text-slate-700 cursor-pointer"
                    >
                      Extension runs
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectDevPage("dev-shell")}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 text-slate-700 cursor-pointer"
                    >
                      Shell
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Documentation Section */}
            <div className="px-2 pt-2.5 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Documentation
            </div>
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => handleSelectDevPage("dev-docs-api")}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-700 hover:text-slate-900 flex items-center justify-between cursor-pointer"
              >
                <span>API reference</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => handleSelectDevPage("dev-docs-sdks")}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-700 hover:text-slate-900 flex items-center justify-between cursor-pointer"
              >
                <span>SDKs</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => handleSelectDevPage("dev-docs-js")}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-700 hover:text-slate-900 flex items-center justify-between cursor-pointer"
              >
                <span>Enako.js</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => handleSelectDevPage("dev-docs-cli")}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-700 hover:text-slate-900 flex items-center justify-between cursor-pointer"
              >
                <span>CLI</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            {/* Bottom Actions Section */}
            <div className="border-t border-slate-100 mt-2 pt-1.5 space-y-0.5">
              <button
                type="button"
                onClick={() => handleSelectDevPage("dev-apikeys")}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-700 hover:text-slate-900 cursor-pointer font-medium"
              >
                API keys
              </button>
              <button
                type="button"
                onClick={() => handleSelectDevPage("dev-apps")}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                Created apps
              </button>
              <button
                type="button"
                onClick={() => handleSelectDevPage("dev-settings")}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                Developer settings
              </button>
            </div>
          </div>
        )}
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
            <div className="text-[10px] text-[#008f94] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00c2c7] animate-pulse" />
              {user.kycTier} Verified Account
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
