"use client";

import React, { useState } from "react";
import { Copy, Check, ExternalLink, Plus, HelpCircle } from "lucide-react";
import { useCustomer } from "@/mock/CustomerContext";

export const ProfileKycPage: React.FC = () => {
  const { user, updateProfile } = useCustomer();

  // Primary Tabs matching User Screenshots
  const [activeTab, setActiveTab] = useState<
    "account" | "business" | "tax" | "branding" | "domains" | "emails"
  >("business");

  // Account details state
  const [accountName, setAccountName] = useState(user.name || "Enako");
  const [accountId] = useState("acct_1UMHcxIFFwAstFq7");
  const [copiedId, setCopiedId] = useState(false);
  const [timezone, setTimezone] = useState("Africa - Douala");
  const [accountSaved, setAccountSaved] = useState(false);

  // Business details state
  const [businessWebsite, setBusinessWebsite] = useState("enako.cm");
  const [publicBusinessName, setPublicBusinessName] = useState("Enako");
  const [statementDescriptor, setStatementDescriptor] = useState("ENAKO");
  const [accountRep, setAccountRep] = useState(
    "Verified Account Representative",
  );
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Tax details state
  const [taxBusinessType, setTaxBusinessType] = useState("Individual");
  const [taxLegalName, setTaxLegalName] = useState(user.name || "Enako");
  const [taxIdNumber, setTaxIdNumber] = useState("");
  const [taxSaved, setTaxSaved] = useState(false);

  // Branding state
  const [brandColor, setBrandColor] = useState("#001F5B");
  const [accentColor, setAccentColor] = useState("#00C2C7");
  const [preferLogo, setPreferLogo] = useState(false);
  const [brandingSubTab, setBrandingSubTab] = useState<
    "receipts" | "checkout" | "portal" | "invoice" | "identity" | "payouts"
  >("payouts");
  const [previewMode, setPreviewMode] = useState<"email" | "form">("email");

  // Custom Domains state
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [customDomainInput, setCustomDomainInput] = useState("");
  const [domains, setDomains] = useState([
    { product: "CHECKOUT", domain: "checkout.enako.cm" },
    { product: "PAYMENT LINKS", domain: "buy.enako.cm" },
    { product: "CUSTOMER PORTAL", domain: "billing.enako.cm" },
  ]);

  // Customer Emails state
  const [emailSettings, setEmailSettings] = useState({
    successfulPayments: true,
    refunds: true,
    upcomingRenewals: true,
    failedCharges: true,
  });
  const [emailSaved, setEmailSaved] = useState(false);

  const handleCopyAccountId = () => {
    navigator.clipboard.writeText(accountId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(accountName, user.phone, user.address);
    setAccountSaved(true);
    setTimeout(() => setAccountSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 font-sans">
      {/* Top Header matching exact screenshot */}
      <div className="border-b border-slate-200/90 pb-0">
        <div className="text-xs font-semibold text-[#001F5B] mb-0.5">
          Settings
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-4">
          Business
        </h1>

        {/* Tab Bar matching exact screenshot */}
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide -mb-[1px]">
          {[
            { id: "account", label: "Account details" },
            { id: "business", label: "Business details" },
            { id: "tax", label: "Tax details" },
            { id: "branding", label: "Branding" },
            { id: "domains", label: "Custom domains" },
            { id: "emails", label: "Customer emails" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`pb-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer relative ${
                  isActive
                    ? "text-[#001F5B] font-bold border-b-2 border-[#001F5B]"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. BUSINESS DETAILS TAB (Matching user photo exactly) */}
      {/* ============================================================== */}
      {activeTab === "business" && (
        <div className="space-y-6 max-w-4xl">
          {/* Section 1: Business details */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-slate-900">
              Business details
            </h2>
            <div className="border border-slate-200/90 rounded-xl bg-white p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-900">
                    Business information
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-6">
                      <span className="text-slate-500 w-36">
                        Business website
                      </span>
                      <a
                        href={`https://${businessWebsite}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#001F5B] hover:text-[#00C2C7] hover:underline flex items-center gap-1 font-medium"
                      >
                        {businessWebsite} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-slate-500 w-36">
                        Public business name
                      </span>
                      <span className="text-slate-800 font-medium">
                        {publicBusinessName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="text-[11px] font-medium text-rose-500 bg-rose-50/80 border border-rose-200/60 px-2 py-0.5 rounded">
                    Incomplete
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingSection(
                        editingSection === "info" ? null : "info",
                      )
                    }
                    className="text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200/90 bg-white hover:bg-slate-50 px-3 py-1 rounded transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {editingSection === "info" && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Business website
                      </label>
                      <input
                        type="text"
                        value={businessWebsite}
                        onChange={(e) => setBusinessWebsite(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#001F5B]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Public business name
                      </label>
                      <input
                        type="text"
                        value={publicBusinessName}
                        onChange={(e) => setPublicBusinessName(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#001F5B]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingSection(null)}
                      className="text-xs border border-slate-200 bg-white px-3 py-1 rounded text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSection(null)}
                      className="text-xs bg-[#001F5B] hover:bg-[#001744] text-white font-medium px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Public details */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-slate-900">Public details</h2>
            <div className="border border-slate-200/90 rounded-xl bg-white p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-900">
                    Customer-facing information
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-6">
                      <span className="text-slate-500 w-36">
                        Public business name
                      </span>
                      <span className="text-slate-800 font-medium">
                        {publicBusinessName}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-slate-500 w-36">Also provided</span>
                      <span className="text-slate-700 font-medium">
                        Business website
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="text-[11px] font-medium text-rose-500 bg-rose-50/80 border border-rose-200/60 px-2 py-0.5 rounded">
                    Incomplete
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const name = prompt(
                        "Update public business name:",
                        publicBusinessName,
                      );
                      if (name) setPublicBusinessName(name);
                    }}
                    className="text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200/90 bg-white hover:bg-slate-50 px-3 py-1 rounded transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Statement descriptor */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-slate-900">
              Statement descriptor
            </h2>
            <div className="border border-slate-200/90 rounded-xl bg-white p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-900">
                    Statement descriptor
                  </div>
                  <div className="text-xs text-slate-600 font-mono font-medium">
                    {statementDescriptor}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="text-[11px] font-medium text-rose-500 bg-rose-50/80 border border-rose-200/60 px-2 py-0.5 rounded">
                    Incomplete
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const desc = prompt(
                        "Enter statement descriptor (e.g. ENAKO*PAY):",
                        statementDescriptor,
                      );
                      if (desc) setStatementDescriptor(desc.toUpperCase());
                    }}
                    className="text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200/90 bg-white hover:bg-slate-50 px-3 py-1 rounded transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Management and ownership */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-slate-900">
              Management and ownership
            </h2>
            <div className="border border-slate-200/90 rounded-xl bg-white p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-900">
                    Account representative
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    {accountRep}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="text-[11px] font-medium text-rose-500 bg-rose-50/80 border border-rose-200/60 px-2 py-0.5 rounded">
                    Incomplete
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const rep = prompt(
                        "Enter representative legal full name:",
                        accountRep,
                      );
                      if (rep) setAccountRep(rep);
                    }}
                    className="text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200/90 bg-white hover:bg-slate-50 px-3 py-1 rounded transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. ACCOUNT DETAILS TAB (Image 4) */}
      {/* ============================================================== */}
      {activeTab === "account" && (
        <div className="max-w-2xl space-y-5">
          <form onSubmit={handleSaveAccount} className="space-y-5">
            {/* Account name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-900">
                Account name
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#001F5B]"
              />
            </div>

            {/* Account ID */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-900">
                Account ID
              </label>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 flex items-center justify-between font-mono text-xs text-slate-700">
                <span>{accountId}</span>
                <button
                  type="button"
                  onClick={handleCopyAccountId}
                  className="text-slate-400 hover:text-slate-700 p-1 transition-colors cursor-pointer"
                  title="Copy Account ID"
                >
                  {copiedId ? (
                    <Check className="w-4 h-4 text-[#008f94]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Phone verification */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-semibold text-slate-900">
                Phone verification
              </label>
              <div>
                <button
                  type="button"
                  onClick={() =>
                    alert(`Verification SMS dispatched to ${user.phone}`)
                  }
                  className="border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Verify now
                </button>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pt-0.5">
                You must verify your phone number via SMS to process payments
                from the Dashboard. Your number won't be publicly displayed.
              </p>
            </div>

            {/* Time zone */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-semibold text-slate-900">
                Time zone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#001F5B]"
              >
                <option value="Africa - Douala">Africa - Douala</option>
                <option value="Africa - Lagos">Africa - Lagos</option>
                <option value="Europe - Paris">Europe - Paris</option>
                <option value="America - New York">America - New York</option>
                <option value="UTC">UTC</option>
              </select>
            </div>

            {/* Save Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="bg-[#001F5B] hover:bg-[#001744] text-white text-xs font-semibold px-6 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Save
              </button>
              {accountSaved && (
                <span className="text-xs text-[#008f94] font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. TAX DETAILS TAB (Image 3) */}
      {/* ============================================================== */}
      {activeTab === "tax" && (
        <div className="max-w-4xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Tax information
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              We need to collect this information so we can submit accurate tax
              reports.
            </p>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Updating this information may introduce new account requirements,
              listed on your{" "}
              <span
                className="text-[#001F5B] hover:underline cursor-pointer font-medium"
                onClick={() => setActiveTab("business")}
              >
                business information page
              </span>
              . You will have a 7-day grace period during which account
              functionality remains the same. To prevent your features from
              being blocked, you must resolve all requirements by the end of the
              grace period.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setTaxSaved(true);
              setTimeout(() => setTaxSaved(false), 2000);
            }}
            className="space-y-5 pt-2"
          >
            {/* Type of business */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-900">
                Type of business
              </label>
              <select
                value={taxBusinessType}
                onChange={(e) => setTaxBusinessType(e.target.value)}
                className="w-full sm:w-80 bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#001F5B]"
              >
                <option value="Individual">Individual</option>
                <option value="Company / LLC">Company / LLC</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="Partnership">Partnership</option>
              </select>
              <div className="text-xs text-slate-500 pt-1">
                • {taxBusinessType}: Enter your individual legal name and
                SSN/ITIN.
              </div>
            </div>

            {/* Legal name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-900">
                Legal name
              </label>
              <p className="text-xs text-slate-500">
                Since you selected individual as your business type, your name
                is also the legal name of your business.
              </p>
              <input
                type="text"
                value={taxLegalName}
                onChange={(e) => setTaxLegalName(e.target.value)}
                className="w-full sm:w-80 bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#001F5B]"
              />
            </div>

            {/* Tax Identification Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-900">
                Tax Identification Number
              </label>
              <input
                type="text"
                placeholder="123-45-6789"
                value={taxIdNumber}
                onChange={(e) => setTaxIdNumber(e.target.value)}
                className="w-full sm:w-80 bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#001F5B]"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
              {taxSaved && (
                <span className="text-xs text-[#008f94] font-medium flex items-center gap-1 mr-auto">
                  <Check className="w-3.5 h-3.5" /> Tax details updated
                </span>
              )}
              <button
                type="button"
                onClick={() => setActiveTab("business")}
                className="border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#001F5B] hover:bg-[#001744] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. BRANDING TAB (Image 1) */}
      {/* ============================================================== */}
      {activeTab === "branding" && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Branding</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px] border border-slate-200/90 rounded-xl overflow-hidden bg-white">
            {/* Left: Brand Elements */}
            <div className="lg:col-span-4 p-6 border-r border-slate-100 space-y-6">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Brand elements
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Set your default brand elements to determine how Stripe
                  products appear to your customers.
                </p>
              </div>

              {/* Icon */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
                  <span>Icon</span>
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div
                  onClick={() => alert("Icon selector")}
                  className="w-10 h-10 border border-slate-200 hover:border-slate-300 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-50 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </div>
              </div>

              {/* Logo */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
                  <span>Logo</span>
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div
                  onClick={() => alert("Logo selector")}
                  className="w-20 h-10 border border-slate-200 hover:border-slate-300 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-50 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </div>
              </div>

              {/* Prefer logo over icon */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
                  <span>Prefer logo over icon</span>
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setPreferLogo(!preferLogo)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                    preferLogo ? "bg-[#001F5B]" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-2xs transition-transform transform ${
                      preferLogo ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Brand color */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
                  <span>Brand color</span>
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-2 py-1 bg-white">
                  <div
                    className="w-5 h-5 rounded"
                    style={{ backgroundColor: brandColor }}
                  />
                  <input
                    type="text"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-16 font-mono text-xs text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Accent color */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
                  <span>Accent color</span>
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-2 py-1 bg-white">
                  <div
                    className="w-5 h-5 rounded"
                    style={{ backgroundColor: accentColor }}
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-16 font-mono text-xs text-slate-700 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right: Preview with subtabs */}
            <div className="lg:col-span-8 p-6 flex flex-col bg-slate-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200/80">
                <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide text-xs font-medium text-slate-600">
                  {[
                    { id: "receipts", label: "Email receipts" },
                    { id: "checkout", label: "Checkout & Payment Links" },
                    { id: "portal", label: "Customer portal" },
                    { id: "invoice", label: "Invoice" },
                    { id: "identity", label: "Identity" },
                    { id: "payouts", label: "Global Payouts" },
                  ].map((subTab) => (
                    <button
                      key={subTab.id}
                      type="button"
                      onClick={() =>
                        setBrandingSubTab(subTab.id as typeof brandingSubTab)
                      }
                      className={`pb-1 whitespace-nowrap transition-colors cursor-pointer ${
                        brandingSubTab === subTab.id
                          ? "text-[#001F5B] font-bold border-b-2 border-[#001F5B]"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {subTab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-white shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("email")}
                    className={`text-xs px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      previewMode === "email"
                        ? "bg-white text-[#001F5B] border border-[#001F5B] shadow-2xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("form")}
                    className={`text-xs px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      previewMode === "form"
                        ? "bg-white text-[#001F5B] border border-[#001F5B] shadow-2xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Payout details form
                  </button>
                </div>
              </div>

              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-4">
                PREVIEW
              </div>

              <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6 space-y-5">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 shadow-2xs"
                      style={{ backgroundColor: brandColor }}
                    >
                      <span className="font-bold text-xs">E</span>
                    </div>
                    <div className="text-xs min-w-0">
                      <div className="text-slate-500 font-medium">
                        From: Stripe
                      </div>
                      <div className="text-slate-900 font-semibold truncate">
                        Subject: Enako sent you $100.00
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-1">
                    <div className="text-sm font-bold text-slate-900">
                      Enako
                    </div>

                    <div>
                      <div className="text-lg font-extrabold text-slate-900 tracking-tight">
                        Enako sent you $100.00
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        To receive the money, provide your information by
                        October 8, 2026.
                      </p>
                    </div>

                    <div>
                      <button
                        type="button"
                        className="text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-2xs cursor-pointer transition-opacity hover:opacity-90"
                        style={{ backgroundColor: accentColor }}
                      >
                        Accept money
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. CUSTOM DOMAINS TAB (Image 5) */}
      {/* ============================================================== */}
      {activeTab === "domains" && (
        <div className="max-w-4xl space-y-6">
          <p className="text-xs text-slate-600 leading-relaxed">
            The following products use stripe.com as the default domain. Or, use
            your own domain.
          </p>

          <div className="space-y-4 pt-2">
            {domains.map((item) => (
              <div key={item.product} className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                  {item.product}
                </span>
                <div className="text-xs font-semibold text-slate-900">
                  {item.domain}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAddDomain(!showAddDomain)}
              className="bg-[#001F5B] hover:bg-[#001744] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              Add your domain
            </button>
          </div>

          {showAddDomain && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 pt-3">
              <span className="text-xs font-semibold text-slate-800 block">
                Connect Custom Domain
              </span>
              <p className="text-xs text-slate-500">
                Point a CNAME record at your DNS provider to{" "}
                <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">
                  cname.enako.cm
                </code>
                .
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="pay.mybusiness.cm"
                  value={customDomainInput}
                  onChange={(e) => setCustomDomainInput(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customDomainInput) {
                      setDomains([
                        ...domains,
                        { product: "CUSTOM DOMAIN", domain: customDomainInput },
                      ]);
                      setCustomDomainInput("");
                      setShowAddDomain(false);
                    }
                  }}
                  className="bg-[#001F5B] text-white text-xs px-3 py-1.5 rounded cursor-pointer"
                >
                  Verify
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. CUSTOMER EMAILS TAB */}
      {/* ============================================================== */}
      {activeTab === "emails" && (
        <div className="max-w-4xl space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Customer emails
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Configure which transaction receipts and lifecycle emails are
              automatically sent to your customers.
            </p>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200/90 rounded-xl bg-white p-4">
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-900">
                  Email customers about successful payments
                </div>
                <div className="text-xs text-slate-500">
                  Send instant payment receipt with order breakdown and
                  reference.
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEmailSettings({
                    ...emailSettings,
                    successfulPayments: !emailSettings.successfulPayments,
                  })
                }
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  emailSettings.successfulPayments
                    ? "bg-[#001F5B]"
                    : "bg-slate-200"
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white shadow-2xs transition-transform transform ${
                    emailSettings.successfulPayments
                      ? "translate-x-4"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-900">
                  Email customers about refunds
                </div>
                <div className="text-xs text-slate-500">
                  Notify customer when a full or partial refund has been
                  credited.
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEmailSettings({
                    ...emailSettings,
                    refunds: !emailSettings.refunds,
                  })
                }
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  emailSettings.refunds ? "bg-[#001F5B]" : "bg-slate-200"
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white shadow-2xs transition-transform transform ${
                    emailSettings.refunds ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-900">
                  Email customers about upcoming renewal payments
                </div>
                <div className="text-xs text-slate-500">
                  Send reminder email 7 days before an automated subscription
                  charges.
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEmailSettings({
                    ...emailSettings,
                    upcomingRenewals: !emailSettings.upcomingRenewals,
                  })
                }
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  emailSettings.upcomingRenewals
                    ? "bg-[#001F5B]"
                    : "bg-slate-200"
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white shadow-2xs transition-transform transform ${
                    emailSettings.upcomingRenewals
                      ? "translate-x-4"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-900">
                  Email customers about failed charges
                </div>
                <div className="text-xs text-slate-500">
                  Notify customers to update their payment methods when a
                  transaction declines.
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEmailSettings({
                    ...emailSettings,
                    failedCharges: !emailSettings.failedCharges,
                  })
                }
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  emailSettings.failedCharges ? "bg-[#001F5B]" : "bg-slate-200"
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white shadow-2xs transition-transform transform ${
                    emailSettings.failedCharges
                      ? "translate-x-4"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setEmailSaved(true);
                setTimeout(() => setEmailSaved(false), 2000);
              }}
              className="bg-[#001F5B] hover:bg-[#001744] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              Save preferences
            </button>
            {emailSaved && (
              <span className="text-xs text-[#008f94] font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Email settings saved
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
