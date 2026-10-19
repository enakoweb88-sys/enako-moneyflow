"use client";

import React, { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCustomer } from "@/mock/CustomerContext";
import {
  Search,
  HelpCircle,
  Bell,
  Settings,
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Box,
  User,
  Info,
  LogOut,
  X,
  ArrowUpRight,
  Send,
  Users,
  Wallet,
} from "lucide-react";

export const CustomerHeader: React.FC = () => {
  const {
    isLoggedIn,
    setIsLoggedIn,
    user,
    language,
    toggleLanguage,
    setActiveNav,
    environment,
    requestEnvironment,
    notifications,
  } = useCustomer();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [showEnvSubmenu, setShowEnvSubmenu] = useState(false);
  const [showCreateSubmenu, setShowCreateSubmenu] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const workspaceMenuRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        workspaceMenuRef.current &&
        !workspaceMenuRef.current.contains(e.target as Node)
      ) {
        setWorkspaceMenuOpen(false);
        setShowEnvSubmenu(false);
        setShowCreateSubmenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadNotifs = notifications.filter((n) => n.unread).length;

  // Keyboard shortcut: Cmd/Ctrl+K for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setQuickCreateOpen(false);
        setWorkspaceMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

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

  const searchablePages = [
    { id: "dashboard", title: "Home / Dashboard", category: "Core" },
    {
      id: "buy-xaf",
      title: "Buy XAF — Convert foreign currency",
      category: "Transfers",
    },
    { id: "wallet", title: "Wallet & Statements", category: "Core" },
    {
      id: "send-withdraw",
      title: "Send & Withdraw money",
      category: "Transfers",
    },
    {
      id: "beneficiaries",
      title: "Manage beneficiaries",
      category: "Directory",
    },
    { id: "disputes", title: "Transaction disputes", category: "Support" },
    {
      id: "analytics",
      title: "Your overview — analytics",
      category: "Insights",
    },
    {
      id: "profile-kyc",
      title: "Profile & KYC verification",
      category: "Account",
    },
    { id: "security", title: "Security & MFA settings", category: "Account" },
    { id: "notifications", title: "Notifications center", category: "Account" },
    { id: "support", title: "Help & Support", category: "Support" },
  ];

  const filteredSearch =
    searchQuery.trim() === ""
      ? searchablePages.slice(0, 6)
      : searchablePages.filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()),
        );

  return (
    <>
      {/* Environment Banner (Sandbox mode) */}
      {isLoggedIn && environment === "sandbox" && (
        <div className="bg-[#001433] text-slate-200 text-xs px-4 py-2 border-b border-[#002255] flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs">
            <span className="font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-sm uppercase tracking-wider text-[10px]">
              Sandbox
            </span>
            <span className="text-slate-300">
              You&apos;re testing in a sandbox. No real funds move here.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveNav("sandbox-lab")}
              className="hidden font-semibold text-white/80 transition hover:text-white sm:inline"
            >
              Open test lab
            </button>
            <button
              type="button"
              onClick={() => requestEnvironment("live")}
              className="text-[#00c2c7] hover:text-[#38e1e5] font-semibold underline underline-offset-2 transition-colors cursor-pointer text-[11px]"
            >
              Switch to Live Account
            </button>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="bg-white text-slate-800 h-13 px-4 flex items-center justify-between border-b border-slate-200/90 shadow-2xs shrink-0 select-none z-30">
        {/* Left: workspace / brand switcher matching screenshot */}
        <div className="flex items-center space-x-3">
          <div className="relative" ref={workspaceMenuRef}>
            <button
              type="button"
              onClick={() => {
                if (isLoggedIn) {
                  setWorkspaceMenuOpen(!workspaceMenuOpen);
                  setShowEnvSubmenu(false);
                  setShowCreateSubmenu(false);
                } else {
                  setActiveNav("landing");
                }
              }}
              className={`flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer group ${
                workspaceMenuOpen
                  ? "bg-slate-100 text-slate-900 shadow-2xs"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200/80">
                E
              </div>
              <span className="text-sm font-semibold tracking-tight text-slate-900">
                Enako
              </span>
              {isLoggedIn &&
                (workspaceMenuOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-600 transition-transform" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform" />
                ))}
            </button>

            {/* Exact Corner Dropdown Matching Screenshot */}
            {workspaceMenuOpen && isLoggedIn && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-3 px-2 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-100 select-none">
                {/* 1. Org Identity Header */}
                <div className="flex flex-col items-center pt-1 pb-3">
                  <div className="w-12 h-9 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200/60 shadow-2xs">
                    <span className="text-xs font-bold text-slate-600 tracking-wider">
                      EN
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-2">
                    Enako
                  </h3>
                </div>

                {/* 2. Workspace Navigation & Actions */}
                <div className="space-y-0.5">
                  {/* Settings */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveNav("security");
                      setWorkspaceMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer group"
                  >
                    <Settings
                      className="w-4 h-4 text-slate-500 group-hover:text-slate-700"
                      strokeWidth={1.75}
                    />
                    <span>Settings</span>
                  </button>

                  {/* Switch to sandbox / Switch to live */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowEnvSubmenu(!showEnvSubmenu)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <Box
                          className="w-4 h-4 text-slate-500 group-hover:text-slate-700"
                          strokeWidth={1.75}
                        />
                        <span>
                          {environment === "live"
                            ? "Switch to sandbox"
                            : "Switch environment"}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                    </button>

                    {/* Environment Submenu */}
                    {showEnvSubmenu && (
                      <div className="absolute left-full top-0 ml-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                          Select Environment
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            requestEnvironment("sandbox");
                            setShowEnvSubmenu(false);
                            setWorkspaceMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                            environment === "sandbox"
                              ? "font-bold text-[#001f5b] bg-[#001f5b]/5"
                              : ""
                          }`}
                        >
                          <span>Sandbox (Test Mode)</span>
                          {environment === "sandbox" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            requestEnvironment("live");
                            setShowEnvSubmenu(false);
                            setWorkspaceMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                            environment === "live"
                              ? "font-bold text-[#001f5b] bg-[#001f5b]/5"
                              : ""
                          }`}
                        >
                          <div className="flex items-center space-x-1.5">
                            <span>Live account</span>
                            <span className="text-[10px] bg-[#00c2c7]/15 text-[#00898d] font-mono px-1 rounded-sm">
                              Live
                            </span>
                          </div>
                          {environment === "live" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00c2c7]" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Create */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCreateSubmenu(!showCreateSubmenu)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <Plus
                          className="w-4 h-4 text-slate-500 group-hover:text-slate-700"
                          strokeWidth={2}
                        />
                        <span>Create</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                    </button>

                    {/* Quick Create Submenu */}
                    {showCreateSubmenu && (
                      <div className="absolute left-full top-0 ml-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                          Create New
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveNav("buy-xaf");
                            setShowCreateSubmenu(false);
                            setWorkspaceMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center space-x-2 text-slate-700 cursor-pointer"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                          <span>New remittance</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveNav("send-withdraw");
                            setShowCreateSubmenu(false);
                            setWorkspaceMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center space-x-2 text-slate-700 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-slate-400" />
                          <span>New withdrawal</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveNav("beneficiaries");
                            setShowCreateSubmenu(false);
                            setWorkspaceMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center space-x-2 text-slate-700 cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>Add beneficiary</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Divider Line */}
                <div className="h-px bg-slate-100 my-2 mx-1" />

                {/* 4. User Profile & Sign Out */}
                <div className="space-y-0.5">
                  <div
                    onClick={() => setShowUserDetails(!showUserDetails)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 truncate min-w-0">
                      <User
                        className="w-4 h-4 text-slate-500 shrink-0"
                        strokeWidth={1.75}
                      />
                      <span className="truncate text-slate-800 font-medium">
                        {user.name || "Nounga Joseph Youmi"}
                      </span>
                    </div>
                    <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2" />
                  </div>

                  {showUserDetails && (
                    <div className="mx-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 space-y-1">
                      <div className="font-semibold text-slate-900">
                        {user.name || "Nounga Joseph Youmi"}
                      </div>
                      <div className="text-slate-500 font-mono text-[10px]">
                        {user.email || "nounga.youmi@enako.com"}
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 mt-1">
                        <span className="text-slate-500">Tier:</span>
                        <span className="font-semibold text-slate-800">
                          {user.kycTier}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setWorkspaceMenuOpen(false);
                      setIsLoggedIn(false);
                      setActiveNav("landing");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:text-rose-600 hover:bg-rose-50/50 text-xs font-medium transition-colors cursor-pointer group"
                  >
                    <LogOut
                      className="w-4 h-4 text-slate-500 group-hover:text-rose-600"
                      strokeWidth={1.75}
                    />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Search Bar */}
        {isLoggedIn && (
          <div className="flex-1 max-w-sm mx-4 hidden sm:block">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="w-full bg-slate-100/80 hover:bg-slate-100 text-slate-500 text-xs px-3 py-1.5 rounded-lg border border-transparent hover:border-slate-200/80 flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div className="flex items-center space-x-2">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                <span className="text-slate-400 group-hover:text-slate-600">
                  Search
                </span>
              </div>
              <kbd className="text-[10px] bg-white border border-slate-200/80 px-1.5 py-0.5 rounded-sm font-mono text-slate-400 shadow-2xs">
                ⌘K
              </kbd>
            </button>
          </div>
        )}

        {/* Right controls */}
        <div className="flex items-center space-x-2.5">
          {isLoggedIn ? (
            <>
              {/* Quick-Create Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setQuickCreateOpen(!quickCreateOpen)}
                  className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/80 flex items-center justify-center font-bold shadow-2xs transition-transform active:scale-95 cursor-pointer"
                  title="Quick create"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
                {quickCreateOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      Quick Actions
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveNav("buy-xaf");
                        setQuickCreateOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center space-x-2 text-slate-700 cursor-pointer"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                      <span>New remittance</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveNav("send-withdraw");
                        setQuickCreateOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center space-x-2 text-slate-700 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-slate-400" />
                      <span>New withdrawal</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveNav("beneficiaries");
                        setQuickCreateOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center space-x-2 text-slate-700 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Add beneficiary</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Help */}
              <button
                type="button"
                onClick={() => setActiveNav("support")}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Help"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* Notifications Bell */}
              <button
                type="button"
                onClick={() => setActiveNav("notifications")}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>

              {/* Settings */}
              <button
                type="button"
                onClick={() => setActiveNav("security")}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* KYC Status */}
              <div className="hidden lg:flex items-center space-x-2">
                <Badge variant={getKycBadgeVariant(user.kycStatus)}>
                  KYC: {user.kycStatus}
                </Badge>
              </div>

              {/* Language */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="text-[11px] bg-slate-100 text-slate-700 border border-slate-200/80 px-2 py-1 rounded-md hover:bg-slate-200/70 transition-colors cursor-pointer font-semibold"
              >
                {language}
              </button>

              {/* Logout */}
              <button
                type="button"
                onClick={() => {
                  setIsLoggedIn(false);
                  setActiveNav("landing");
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer transition-colors hidden sm:block"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={toggleLanguage}
                className="text-[11px] bg-[#00143a] text-slate-300 border border-white/10 px-2 py-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer font-semibold"
              >
                {language}
              </button>
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

      {/* Global Command Search Palette (⌘K) */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/50 backdrop-blur-[1px] animate-in fade-in duration-100">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-100">
            <div className="p-3 border-b border-slate-100 flex items-center space-x-2">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search pages, actions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto p-2">
              {filteredSearch.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  No results found
                </div>
              ) : (
                filteredSearch.map((page) => (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => {
                      setActiveNav(page.id);
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-50 flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 group-hover:text-[#001f5b]">
                        {page.title}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {page.category}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 group-hover:text-slate-600">
                      Jump →
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
