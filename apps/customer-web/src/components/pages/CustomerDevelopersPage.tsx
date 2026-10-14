"use client";

import React, { useState } from "react";
import {
  Code,
  Key,
  Globe,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  RefreshCw,
  Eye,
  EyeOff,
  Plus,
  Play,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Activity,
  Layers,
  Cpu,
  Sliders,
  FileCode,
  Search,
  ChevronRight,
  Radio,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CustomerDevelopersPageProps {
  initialSubPage?: string;
}

export const CustomerDevelopersPage: React.FC<CustomerDevelopersPageProps> = ({
  initialSubPage = "overview",
}) => {
  // Map incoming subpage ID
  const mapInitialTab = (
    page: string,
  ):
    | "overview"
    | "webhooks"
    | "events"
    | "logs"
    | "apikeys"
    | "apps"
    | "settings"
    | "health"
    | "inspector"
    | "blueprints"
    | "extensions"
    | "shell"
    | "docs" => {
    if (page.includes("webhook")) return "webhooks";
    if (page.includes("event")) return "events";
    if (page.includes("log")) return "logs";
    if (page.includes("key")) return "apikeys";
    if (page.includes("app")) return "apps";
    if (page.includes("setting")) return "settings";
    if (page.includes("health")) return "health";
    if (page.includes("inspector")) return "inspector";
    if (page.includes("blueprint")) return "blueprints";
    if (page.includes("extension")) return "extensions";
    if (page.includes("shell")) return "shell";
    if (
      page.includes("doc") ||
      page.includes("sdk") ||
      page.includes("cli") ||
      page.includes("api")
    )
      return "docs";
    return "overview";
  };

  const [activeTab, setActiveTab] = useState(mapInitialTab(initialSubPage));
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showSecretKey, setShowSecretKey] = useState<boolean>(false);

  // Webhooks State
  const [endpoints, setEndpoints] = useState([
    {
      id: "ep_1",
      url: "https://api.merchant.cm/v1/enako-listener",
      status: "Healthy (200 OK)",
      events: ["payout.settled", "payment.received", "payout.failed"],
      lastPing: "2 mins ago",
    },
    {
      id: "ep_2",
      url: "https://staging.merchant.cm/webhooks",
      status: "Healthy (200 OK)",
      events: ["all_events"],
      lastPing: "45 mins ago",
    },
  ]);
  const [showAddWebhook, setShowAddWebhook] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");

  // Shell State
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "Enako CLI v2.4.0 (Douala/BEAC Settlement Engine)",
    'Type "help" for available commands.',
  ]);
  const [shellInput, setShellInput] = useState("");

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleShellCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shellInput.trim()) return;
    const cmd = shellInput.trim();
    const newLogs = [...terminalLogs, `$ ${cmd}`];

    if (cmd === "help") {
      newLogs.push(
        "Available commands: balance, payouts:list, keys:list, ping, clear",
      );
    } else if (cmd === "balance") {
      newLogs.push(
        "Available: 84 250 000 XAF | Pending: 4 120 000 XAF | Reserve: 2 500 000 XAF",
      );
    } else if (cmd === "ping") {
      newLogs.push("PONG: latency to BEAC Central Gateway: 18ms (Douala hub)");
    } else if (cmd === "clear") {
      setTerminalLogs([]);
      setShellInput("");
      return;
    } else {
      newLogs.push(`Command executed: ${cmd} (status: OK 200)`);
    }
    setTerminalLogs(newLogs);
    setShellInput("");
  };

  const liveKeys = {
    publishable: "pk_live_enako_990142bc38104829fa771a",
    secret: "sk_live_enako_e9882a17f6920f32148da4210",
    webhook: "whsec_live_enako_sig_99210f43b2a",
  };

  const testKeys = {
    publishable: "pk_test_enako_sandbox_881920aa91283",
    secret: "sk_test_enako_sandbox_secret_998129bb",
    webhook: "whsec_test_enako_sig_test_10928a",
  };

  const currentKeys = isTestMode ? testKeys : liveKeys;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans">
      {/* Top Header */}
      <div className="border-b border-slate-200/90 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-[#001F5B] mb-0.5">
              Developers Workbench
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Developers & API
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              API credentials, webhook subscriptions, real-time event logs, and
              integration toolkits.
            </p>
          </div>

          {/* Test / Live Toggle in Enako Navy/Teal */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setIsTestMode(false)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                !isTestMode
                  ? "bg-white text-[#001F5B] shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Live API
            </button>
            <button
              type="button"
              onClick={() => setIsTestMode(true)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                isTestMode
                  ? "bg-[#001F5B] text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Sandbox (Test)
            </button>
          </div>
        </div>

        {/* Developer Workbench Subnav matching the screenshot dropdown */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-hide mt-5 -mb-[1px] text-xs font-medium">
          {[
            { id: "overview", label: "Overview" },
            { id: "apikeys", label: "API keys" },
            { id: "webhooks", label: "Webhooks" },
            { id: "events", label: "Events" },
            { id: "logs", label: "Logs" },
            { id: "apps", label: "Created apps" },
            { id: "health", label: "Health" },
            { id: "inspector", label: "Inspector" },
            { id: "shell", label: "Shell" },
            { id: "docs", label: "Documentation" },
            { id: "settings", label: "Settings" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`pb-2.5 whitespace-nowrap transition-colors cursor-pointer relative ${
                  isActive
                    ? "text-[#001F5B] font-bold border-b-2 border-[#001F5B]"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-5">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="border border-slate-200/90 rounded-xl bg-white p-4">
              <span className="text-xs font-semibold text-slate-500 block">
                API Success Rate
              </span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">
                99.98%
              </span>
              <span className="text-[10px] text-[#008f94] font-medium">
                BEAC Gateway Optimal
              </span>
            </div>
            <div className="border border-slate-200/90 rounded-xl bg-white p-4">
              <span className="text-xs font-semibold text-slate-500 block">
                Median Latency
              </span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">
                42ms
              </span>
              <span className="text-[10px] text-slate-500">
                MTN & Orange Direct Rail
              </span>
            </div>
            <div className="border border-slate-200/90 rounded-xl bg-white p-4">
              <span className="text-xs font-semibold text-slate-500 block">
                Total Requests (24h)
              </span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">
                142,850
              </span>
              <span className="text-[10px] text-slate-500">
                Across 2 configured webhooks
              </span>
            </div>
            <div className="border border-slate-200/90 rounded-xl bg-white p-4">
              <span className="text-xs font-semibold text-slate-500 block">
                API Version
              </span>
              <span className="text-xl font-bold text-[#001F5B] mt-1 block">
                v1.4.2
              </span>
              <span className="text-[10px] text-[#00C2C7] font-semibold">
                Latest Production
              </span>
            </div>
          </div>

          {/* Quickstart Card */}
          <div className="border border-slate-200/90 rounded-xl bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Quick Integration cURL
              </span>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `curl -X POST https://api.enako.cm/v1/payouts -H "Authorization: Bearer ${currentKeys.secret}" -d '{"amount":50000,"currency":"XAF"}'`,
                    "curl_quick",
                  )
                }
                className="text-xs text-[#001F5B] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                {copiedKey === "curl_quick" ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                Copy cURL
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto">
              {`curl -X POST https://api.enako.cm/v1/payouts \\
  -H "Authorization: Bearer ${currentKeys.secret.substring(0, 18)}••••••" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 50000,
    "currency": "XAF",
    "recipient_phone": "+237670000000",
    "operator": "mtn_momo"
  }'`}
            </pre>
          </div>
        </div>
      )}

      {/* 2. API KEYS */}
      {activeTab === "apikeys" && (
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-900">
            API Credentials
          </div>

          {/* Publishable Key */}
          <div className="border border-slate-200/90 rounded-xl bg-white p-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900">
                Publishable Key
              </span>
              <span className="text-slate-400 font-normal">
                Safe for frontend applications
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-800 select-all font-medium truncate mr-2">
                {currentKeys.publishable}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(currentKeys.publishable, "pk")}
                className="p-1 text-slate-500 hover:text-slate-900"
              >
                {copiedKey === "pk" ? (
                  <Check className="w-4 h-4 text-[#008f94]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Secret Key */}
          <div className="border border-slate-200/90 rounded-xl bg-white p-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900">Secret Key</span>
              <span className="text-rose-600 font-medium">
                Server-side confidential
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-800 select-all font-medium truncate mr-2">
                {showSecretKey
                  ? currentKeys.secret
                  : "sk_live_enako_••••••••••••••••••••••••"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="p-1 text-slate-500 hover:text-slate-900"
                >
                  {showSecretKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(currentKeys.secret, "sk")}
                  className="p-1 text-slate-500 hover:text-slate-900"
                >
                  {copiedKey === "sk" ? (
                    <Check className="w-4 h-4 text-[#008f94]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Webhook Secret */}
          <div className="border border-slate-200/90 rounded-xl bg-white p-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900">
                Webhook Signing Secret
              </span>
              <span className="text-slate-400 font-normal">
                HMAC-SHA256 signature verification
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-800 select-all font-medium truncate mr-2">
                {currentKeys.webhook}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(currentKeys.webhook, "wh")}
                className="p-1 text-slate-500 hover:text-slate-900"
              >
                {copiedKey === "wh" ? (
                  <Check className="w-4 h-4 text-[#008f94]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() =>
                alert(
                  "Credentials rotation initiated. Old key will remain valid for 24h.",
                )
              }
              className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Roll API Keys
            </button>
          </div>
        </div>
      )}

      {/* 3. WEBHOOKS */}
      {activeTab === "webhooks" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              Configured Endpoints
            </span>
            <button
              type="button"
              onClick={() => setShowAddWebhook(!showAddWebhook)}
              className="bg-[#001F5B] hover:bg-[#001744] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              + Add endpoint
            </button>
          </div>

          {showAddWebhook && (
            <div className="border border-slate-200/90 rounded-xl bg-slate-50 p-4 space-y-2">
              <label className="text-xs font-semibold text-slate-800 block">
                Endpoint Destination URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://api.yourdomain.cm/webhooks"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newWebhookUrl) {
                      setEndpoints([
                        ...endpoints,
                        {
                          id: "ep_" + Date.now(),
                          url: newWebhookUrl,
                          status: "Healthy (200 OK)",
                          events: ["all_events"],
                          lastPing: "Just now",
                        },
                      ]);
                      setNewWebhookUrl("");
                      setShowAddWebhook(false);
                    }
                  }}
                  className="bg-[#001F5B] text-white text-xs font-semibold px-3 py-1.5 rounded cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          <div className="border border-slate-200/90 rounded-xl bg-white divide-y divide-slate-100 overflow-hidden">
            {endpoints.map((ep) => (
              <div
                key={ep.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#001F5B]" />
                    <span className="font-mono text-xs font-semibold text-slate-900">
                      {ep.url}
                    </span>
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                      {ep.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 pt-0.5">
                    <span>Events: {ep.events.join(", ")}</span>
                    <span>• {ep.lastPing}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => alert(`Ping test sent to ${ep.url}`)}
                    className="border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 px-3 py-1 rounded transition-colors cursor-pointer"
                  >
                    Test ping
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEndpoints(endpoints.filter((e) => e.id !== ep.id))
                    }
                    className="text-xs text-rose-600 hover:text-rose-700 border border-rose-200 px-2.5 py-1 rounded transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. EVENTS */}
      {activeTab === "events" && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-900">
            Real-Time Event Stream
          </div>
          <div className="border border-slate-200/90 rounded-xl bg-white divide-y divide-slate-100 overflow-hidden font-mono text-xs">
            {[
              {
                id: "evt_99104",
                type: "payout.settled",
                ref: "po_99120",
                status: "200 OK",
                time: "1 min ago",
              },
              {
                id: "evt_99103",
                type: "payment.received",
                ref: "ch_88123",
                status: "200 OK",
                time: "8 mins ago",
              },
              {
                id: "evt_99102",
                type: "balance.updated",
                ref: "bal_0012",
                status: "200 OK",
                time: "22 mins ago",
              },
              {
                id: "evt_99101",
                type: "dispute.created",
                ref: "dp_11029",
                status: "200 OK",
                time: "1 hour ago",
              },
            ].map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#001F5B]">{evt.type}</span>
                  <span className="text-slate-400">{evt.id}</span>
                  <span className="text-slate-600 font-sans text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">
                    ref: {evt.ref}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-xs">
                  <span className="text-emerald-700 font-semibold">
                    {evt.status}
                  </span>
                  <span>{evt.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. LOGS */}
      {activeTab === "logs" && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-900">
            API Request Logs
          </div>
          <div className="border border-slate-200/90 rounded-xl bg-white divide-y divide-slate-100 overflow-hidden font-mono text-xs">
            {[
              {
                method: "POST",
                path: "/v1/payouts",
                code: 200,
                dur: "38ms",
                ip: "197.234.219.10",
                time: "10:42:01",
              },
              {
                method: "POST",
                path: "/v1/charges",
                code: 200,
                dur: "45ms",
                ip: "197.234.219.10",
                time: "10:40:15",
              },
              {
                method: "GET",
                path: "/v1/balances",
                code: 200,
                dur: "12ms",
                ip: "197.234.219.10",
                time: "10:35:22",
              },
              {
                method: "GET",
                path: "/v1/beneficiaries",
                code: 200,
                dur: "19ms",
                ip: "197.234.219.10",
                time: "10:29:50",
              },
            ].map((log, i) => (
              <div
                key={i}
                className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#001F5B]/10 text-[#001F5B]">
                    {log.method}
                  </span>
                  <span className="text-slate-800 font-semibold">
                    {log.path}
                  </span>
                  <span className="text-slate-400 font-sans text-[11px]">
                    {log.ip}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-emerald-700 font-bold">{log.code}</span>
                  <span className="text-slate-500">{log.dur}</span>
                  <span className="text-slate-400">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. CREATED APPS */}
      {activeTab === "apps" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              OAuth & Connected Applications
            </span>
            <button
              type="button"
              onClick={() => alert("New application credentials created.")}
              className="bg-[#001F5B] text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
            >
              + Create App
            </button>
          </div>
          <div className="border border-slate-200/90 rounded-xl bg-white p-4 space-y-1">
            <div className="text-xs font-bold text-slate-900">
              Merchant Storefront Checkout v2
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Client ID: app_cl_99201402830219
            </div>
            <div className="text-[11px] text-emerald-700 font-medium pt-1">
              Status: Active & Authorized
            </div>
          </div>
        </div>
      )}

      {/* 7. HEALTH */}
      {activeTab === "health" && (
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-900">
            Regional Gateway Rail Status
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-slate-200/90 rounded-xl bg-white p-4 space-y-1">
              <span className="text-xs font-semibold text-slate-700 block">
                MTN MoMo Cameroon Rail
              </span>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Operational (99.99%)
              </span>
              <span className="text-[11px] text-slate-400 block pt-1">
                Latency: 28ms
              </span>
            </div>
            <div className="border border-slate-200/90 rounded-xl bg-white p-4 space-y-1">
              <span className="text-xs font-semibold text-slate-700 block">
                Orange Money CEMAC Rail
              </span>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Operational (99.98%)
              </span>
              <span className="text-[11px] text-slate-400 block pt-1">
                Latency: 35ms
              </span>
            </div>
            <div className="border border-slate-200/90 rounded-xl bg-white p-4 space-y-1">
              <span className="text-xs font-semibold text-slate-700 block">
                BEAC Real-Time Gross Settlement
              </span>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Operational (100.0%)
              </span>
              <span className="text-[11px] text-slate-400 block pt-1">
                Latency: 18ms
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 8. INSPECTOR */}
      {activeTab === "inspector" && (
        <div className="border border-slate-200/90 rounded-xl bg-white p-5 space-y-3">
          <div className="text-xs font-bold text-slate-900">
            Live Request Inspector
          </div>
          <p className="text-xs text-slate-500">
            Listening for incoming requests sent to your live and test keys...
          </p>
          <div className="p-4 bg-slate-900 text-slate-300 font-mono text-xs rounded-lg">
            {/* Ready. Send a transaction to see headers, IP signatures, and parsed bodies. */}
          </div>
        </div>
      )}

      {/* 9. SHELL */}
      {activeTab === "shell" && (
        <div className="border border-slate-200/90 rounded-xl bg-slate-950 text-slate-200 p-5 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-400">
            <span>Enako Cloud Interactive Terminal</span>
            <span className="text-[#00C2C7]">CONNECTED</span>
          </div>

          <div className="space-y-1 min-h-[160px] max-h-64 overflow-y-auto">
            {terminalLogs.map((l, idx) => (
              <div key={idx} className="leading-relaxed text-slate-300">
                {l}
              </div>
            ))}
          </div>

          <form
            onSubmit={handleShellCommand}
            className="flex gap-2 pt-2 border-t border-slate-800"
          >
            <span className="text-[#00C2C7] font-bold self-center">$</span>
            <input
              type="text"
              value={shellInput}
              onChange={(e) => setShellInput(e.target.value)}
              placeholder="help, balance, ping..."
              className="flex-1 bg-transparent text-slate-100 focus:outline-none text-xs font-mono"
            />
          </form>
        </div>
      )}

      {/* 10. DOCUMENTATION */}
      {activeTab === "docs" && (
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-900">
            SDKs and Technical Manuals
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-slate-200/90 rounded-xl bg-white p-4 space-y-2">
              <span className="text-xs font-bold text-slate-900 block">
                Enako.js Client Library
              </span>
              <p className="text-xs text-slate-500">
                Drop-in frontend payment element for web apps and checkout
                forms.
              </p>
              <pre className="p-2.5 bg-slate-900 text-slate-200 rounded text-[11px] font-mono">
                npm install @enako/enako-js
              </pre>
            </div>
            <div className="border border-slate-200/90 rounded-xl bg-white p-4 space-y-2">
              <span className="text-xs font-bold text-slate-900 block">
                Node.js / TypeScript SDK
              </span>
              <p className="text-xs text-slate-500">
                Full-featured backend library for Node.js, Next.js, and Express.
              </p>
              <pre className="p-2.5 bg-slate-900 text-slate-200 rounded text-[11px] font-mono">
                npm install @enako/node-sdk
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 11. SETTINGS */}
      {activeTab === "settings" && (
        <div className="border border-slate-200/90 rounded-xl bg-white p-5 space-y-4 max-w-2xl">
          <div className="text-xs font-bold text-slate-900">
            Developer Configuration
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">
                  IP Whitelisting
                </span>
                <span className="text-slate-500">
                  Restrict API key usage to verified IP ranges
                </span>
              </div>
              <input
                type="text"
                placeholder="197.234.0.0/16"
                className="border border-slate-300 rounded px-2.5 py-1 text-xs w-44"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="font-semibold text-slate-800 block">
                  Webhook Retry Limit
                </span>
                <span className="text-slate-500">
                  Number of retry attempts upon HTTP failure
                </span>
              </div>
              <select className="border border-slate-300 rounded px-2.5 py-1 text-xs">
                <option value="5">5 Retries (Exponential backoff)</option>
                <option value="10">10 Retries</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
