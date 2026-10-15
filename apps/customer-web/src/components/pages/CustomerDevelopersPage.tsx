"use client";

import React, { useMemo, useState } from "react";
import {
  BookOpen,
  Code2,
  Copy,
  ExternalLink,
  KeyRound,
  Radio,
  ShieldCheck,
} from "lucide-react";
import { useCustomer } from "@/mock/CustomerContext";

interface CustomerDevelopersPageProps {
  initialSubPage?: string;
}

type DeveloperTab = "overview" | "keys" | "webhooks" | "logs" | "docs";

const mapTab = (page: string): DeveloperTab => {
  if (page.includes("key")) return "keys";
  if (page.includes("webhook")) return "webhooks";
  if (page.includes("log") || page.includes("event")) return "logs";
  if (page.includes("doc")) return "docs";
  return "overview";
};

export const CustomerDevelopersPage: React.FC<CustomerDevelopersPageProps> = ({
  initialSubPage = "overview",
}) => {
  const { user } = useCustomer();
  const [activeTab, setActiveTab] = useState<DeveloperTab>(() =>
    mapTab(initialSubPage),
  );
  const [copied, setCopied] = useState(false);
  const apiUrl =
    process.env.NEXT_PUBLIC_MONEYFLOW_API_URL ||
    "API address is not configured";
  const callbackUrl = useMemo(
    () =>
      `${typeof window === "undefined" ? "https://your-domain.example" : window.location.origin}/webhooks/moneyflow`,
    [],
  );

  const copyCallbackUrl = async () => {
    await navigator.clipboard.writeText(callbackUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const tabs: Array<{ id: DeveloperTab; label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "keys", label: "API keys" },
    { id: "webhooks", label: "Webhooks" },
    { id: "logs", label: "Request logs" },
    { id: "docs", label: "Documentation" },
  ];

  return (
    <section className="mx-auto max-w-6xl pb-12">
      <header className="border-b border-slate-200 pb-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#008f94]">
          Customer workspace
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          API & developers
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Connect your own business systems to MoneyFlow. Credentials, webhook
          registration and request history will appear here once these services
          are enabled for your account.
        </p>
        <nav className="mt-5 flex gap-4 overflow-x-auto text-sm font-medium">
          {tabs.map((tab) => (
            <button
              className={`shrink-0 border-b-2 pb-2 transition-colors ${activeTab === tab.id ? "border-[#001f5b] text-[#001f5b]" : "border-transparent text-slate-500 hover:text-slate-900"}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {activeTab === "overview" && (
        <div className="grid gap-5 pt-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="border border-slate-200 bg-white p-6 shadow-sm">
            <Code2 className="h-6 w-6 text-[#001f5b]" />
            <h2 className="mt-4 text-lg font-bold text-slate-950">
              Build against MoneyFlow
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Your developer account is ready for API access. No live API key
              has been issued and no requests have been recorded yet.
            </p>
            <div className="mt-5 rounded border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                API base URL
              </p>
              <code className="mt-2 block break-all text-sm text-slate-900">
                {apiUrl}
              </code>
            </div>
          </div>
          <div className="border border-slate-200 bg-white p-6 shadow-sm">
            <ShieldCheck className="h-6 w-6 text-[#008f94]" />
            <h2 className="mt-4 text-lg font-bold text-slate-950">
              Security first
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Keep secret keys on your server only. Never place them in a
              website, mobile app, email, or source-code repository.
            </p>
          </div>
        </div>
      )}

      {activeTab === "keys" && (
        <div className="pt-6">
          <EmptyState
            icon={<KeyRound className="h-6 w-6" />}
            title="No API keys have been issued"
            description="API-key issuance is not connected to the live service yet. When it is enabled, you will be able to create, rotate and revoke keys here."
          />
        </div>
      )}

      {activeTab === "webhooks" && (
        <div className="grid gap-5 pt-6 lg:grid-cols-2">
          <div className="border border-slate-200 bg-white p-6 shadow-sm">
            <Radio className="h-6 w-6 text-[#001f5b]" />
            <h2 className="mt-4 text-lg font-bold text-slate-950">
              Webhook delivery
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              You do not have webhook endpoints registered. This section will
              display your configured endpoints and their delivery status.
            </p>
          </div>
          <div className="border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Example callback address
            </p>
            <code className="mt-3 block break-all rounded bg-slate-50 p-3 text-xs text-slate-800">
              {callbackUrl}
            </code>
            <button
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#001f5b] hover:underline"
              onClick={() => void copyCallbackUrl()}
              type="button"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied" : "Copy example"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "logs" && (
        <div className="pt-6">
          <EmptyState
            icon={<Radio className="h-6 w-6" />}
            title="No API requests yet"
            description="Once your account has a live key and your integration makes requests, this page will show only your own request history."
          />
        </div>
      )}

      {activeTab === "docs" && (
        <div className="grid gap-5 pt-6 lg:grid-cols-2">
          <div className="border border-slate-200 bg-white p-6 shadow-sm">
            <BookOpen className="h-6 w-6 text-[#001f5b]" />
            <h2 className="mt-4 text-lg font-bold text-slate-950">
              Integration guide
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Documentation will be published with the live API contract. It
              will cover authentication, payouts, webhooks and error handling.
            </p>
          </div>
          <div className="border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-slate-950">Signed in as</p>
            <p className="mt-2 text-sm text-slate-600">
              {user.email || "Your account"}
            </p>
            <a
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#001f5b] hover:underline"
              href="mailto:enakomgt@gmail.com?subject=MoneyFlow%20API%20access"
            >
              Request API access <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </section>
  );
};

const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-[#001f5b]">
      {icon}
    </div>
    <h2 className="mt-4 text-lg font-bold text-slate-950">{title}</h2>
    <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
      {description}
    </p>
  </div>
);
