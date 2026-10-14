"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCustomer } from "@/mock/CustomerContext";

// --- Static Data Definitions (Self-contained, Zero external dependencies) ---

const TESTIMONIALS = [
  {
    initials: "MN",
    quote:
      "E-NAKO MoneyFlow transformed our contractor payouts. What used to take 3 bank business days and painful manual reconciliation now settles directly into MTN MoMo in under a minute.",
    name: "Marcelle Ngassa",
    role: "Head of Operations",
    company: "Kribi Tech Logistics",
  },
  {
    initials: "EK",
    quote:
      "The zero hidden FX spread is real. Our diaspora members save thousands every month compared to legacy money transfer agencies, and funds land directly in our families' local wallets.",
    name: "Dr. Emmanuel Kamdem",
    role: "President",
    company: "Diaspora Solidarité Europe",
  },
  {
    initials: "SO",
    quote:
      "Integrating the Payouts API took our engineering team half a day. The OpenAPI specs, idempotency keys, and sub-100ms webhook delivery are on par with top global fintechs.",
    name: "Serge Ousmanou",
    role: "Principal Architect",
    company: "Afripay Systems",
  },
  {
    initials: "TB",
    quote:
      "Dual-approval workflows and the immutable double-entry ledger gave our executive audit committee complete peace of mind. Every single cent is mathematically reconciled.",
    name: "Thérèse Bisseck",
    role: "Chief Financial Officer",
    company: "Central African Logistics Group",
  },
];

const CASE_STUDIES = [
  {
    title: "Diaspora Family Corridors",
    tagline: "Paris, Brussels & Montreal to Douala & Yaoundé",
    story:
      "Over 45 000 diaspora senders bypass predatory 8-12% wire commissions. Senders wire funds in EUR, GBP, or USD into segregated clearing accounts, and recipients receive instant mobile money disbursements across Cameroon in under a minute.",
    stats: [
      { label: "Hidden FX Markup", val: "0.0%" },
      { label: "Median Delivery Time", val: "34 seconds" },
      { label: "Mobile Wallet Reach", val: "100% of operators" },
    ],
    linkText: "Read corridor impact study",
  },
  {
    title: "Agri-Commodity Export Platforms",
    tagline: "Multi-currency cocoa and coffee exporter settlements",
    story:
      "European and American commodity buyers remit wire payments that automatically settle to local cooperative accounts. Integrated dual-approval signing rules ensure compliance with BEAC foreign exchange regulations and local treasury controls.",
    stats: [
      { label: "Monthly Volume Cleared", val: "€4.8M" },
      { label: "Mandatory Approvers", val: "Dual Signoff" },
      { label: "Settlement Cycle", val: "T+0 Same Day" },
    ],
    linkText: "Read enterprise trade study",
  },
  {
    title: "Global Tech Platforms & Freelance Marketplaces",
    tagline: "Programmatic payouts to 18 000+ contractors across CEMAC",
    story:
      "High-growth marketplaces trigger automated payouts to developers, translators, and creative professionals. The E-NAKO Payout API validates recipient phone numbers and delivers micro-settlements with automated webhook confirmations.",
    stats: [
      { label: "Active Contractor Wallets", val: "18 200+" },
      { label: "Payout Success Rate", val: "99.98%" },
      { label: "API Response Latency", val: "48ms" },
    ],
    linkText: "Read developer architecture case",
  },
  {
    title: "Regional Import-Export Clearing & Treasury",
    tagline: "Eliminating cross-border supplier payment friction",
    story:
      "Commercial distributors settle goods across CEMAC borders through locked escrow contracts. Funds remain held securely until port clearance manifests are cryptographically verified against the platform ledger.",
    stats: [
      { label: "Escrow Volume Cleared", val: "$16M+" },
      { label: "Security Architecture", val: "Multi-Key Escrow" },
      { label: "Currency Volatility Risk", val: "0% Parity Pegged" },
    ],
    linkText: "Read treasury security brief",
  },
];

const CODE_SNIPPETS = {
  typescript: `// 1. Initialize E-NAKO MoneyFlow Client
const client = new MoneyFlowClient({
  apiKey: process.env.ENAKO_SECRET_KEY,
  corridor: 'EUR_XAF'
});

// 2. Dispatch immediate mobile money payout
const payout = await client.transfers.create({
  idempotencyKey: 'idemp_982b1c4a0e',
  amountEur: 1000.00,
  recipient: '+237670112233',
  channel: 'MTN_MOMO',
  lockParity: true
});

// Returns: status: 'settled', xafDelivered: 655957, ledgerRef: 'TXN-90214'`,
  curl: `curl -X POST https://api.enako.io/v1/transfers \\
  -H "Authorization: Bearer sec_live_..." \\
  -H "Idempotency-Key: idemp_982b1c4a0e" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount_eur": 1000.00,
    "recipient_phone": "+237670112233",
    "payout_channel": "MTN_MOMO"
  }'`,
  java: `// E-NAKO Java SDK 21
TransferResponse response = moneyFlowClient.transfers()
    .create(TransferRequest.builder()
        .idempotencyKey("idemp_982b1c4a0e")
        .sourceAmount(new BigDecimal("1000.00"))
        .sourceCurrency(Currency.EUR)
        .channel(PayoutChannel.ORANGE_MONEY)
        .build());`,
};

// --- Count-Up Hook for High-Performance Tabular Stats ---
function useCountUp(
  end: number,
  duration: number = 1400,
  trigger: boolean = false,
  decimals: number = 0,
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      // Check prefers-reduced-motion at runtime
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        setValue(end);
        return;
      }

      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // Ease-out cubic curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = easeOut * end;
      setValue(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setValue(end);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [trigger, end, duration]);

  if (decimals > 0) {
    return value.toFixed(decimals);
  }
  return Math.round(value).toLocaleString();
}

export const LandingPage: React.FC = () => {
  const { setActiveNav } = useCustomer();

  // Navigation & Scroll State
  const [scrolled, setScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Bento Interactive FX Calculator State
  const [fxCurrency, setFxCurrency] = useState<"EUR" | "USD" | "GBP">("EUR");
  const [fxAmount, setFxAmount] = useState<number>(1000);

  // Customer Accordion State
  const [activeAccordion, setActiveAccordion] = useState<number>(0);

  // Developer Code Panel State
  const [codeLanguage, setCodeLanguage] = useState<
    "curl" | "typescript" | "java"
  >("typescript");

  // Testimonial Carousel State
  const [testimonialIndex, setTestimonialIndex] = useState<number>(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState<boolean>(false);

  // Stats Count-Up Intersection Observer
  const statsSectionRef = useRef<HTMLDivElement | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for Stats Band
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.25 },
    );
    if (statsSectionRef.current) {
      observer.observe(statsSectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Auto-advancing Testimonial Carousel
  useEffect(() => {
    if (isCarouselHovered) return;
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isCarouselHovered]);

  // Dynamic calculated rates
  const getExchangeRate = () => {
    switch (fxCurrency) {
      case "EUR":
        return 655.957; // Official BEAC Peg
      case "USD":
        return 608.42;
      case "GBP":
        return 782.15;
    }
  };

  const calculatedXaf = Math.round(
    fxAmount * getExchangeRate(),
  ).toLocaleString();

  // Animated Stats Values
  const statCorridors = useCountUp(6, 1200, statsVisible, 0);
  const statSpeed = useCountUp(38, 1400, statsVisible, 0);
  const statUptime = useCountUp(99.99, 1600, statsVisible, 2);
  const statVolume = useCountUp(145, 1500, statsVisible, 0);

  return (
    <div className="relative min-h-screen bg-white text-slate-900 font-sans selection:bg-[#00c2c7]/20 selection:text-[#001f5b] overflow-x-hidden">
      {/* ========================================================================= */}
      {/* SECTION 2A: NAVIGATION BAR (Sticky, transparent to blur on scroll)       */}
      {/* ========================================================================= */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-3.5"
            : "bg-transparent border-b border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Wordmark & Brand Badge */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="inline-flex items-center justify-center bg-[#001f5b] text-[#00c2c7] font-mono font-bold text-xs tracking-wider px-2.5 py-1 rounded-md border border-[#00c2c7]/30">
                E-NAKO
              </div>
              <span className="text-xl font-bold tracking-tight text-[#001f5b]">
                MoneyFlow
              </span>
            </div>

            {/* Center Desktop Navigation Links with Mega-Menus */}
            <div className="hidden lg:flex items-center space-x-1 relative">
              {/* Send Money Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveMegaMenu("send-money")}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button
                  type="button"
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
                >
                  Send Money
                </button>
                {activeMegaMenu === "send-money" && (
                  <div className="absolute top-full left-0 w-[480px] bg-white rounded-xl shadow-xl border border-slate-200/80 p-6 grid grid-cols-2 gap-6 transition-all duration-200">
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                        International Corridors
                      </div>
                      <div className="space-y-2.5">
                        <div className="group cursor-pointer">
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00c2c7] transition-colors">
                            Europe to Cameroon
                          </div>
                          <div className="text-xs text-slate-500">
                            EUR to XAF official parity
                          </div>
                        </div>
                        <div className="group cursor-pointer">
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00c2c7] transition-colors">
                            North America to CEMAC
                          </div>
                          <div className="text-xs text-slate-500">
                            USD direct bank transfer clearing
                          </div>
                        </div>
                        <div className="group cursor-pointer">
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00c2c7] transition-colors">
                            United Kingdom Corridor
                          </div>
                          <div className="text-xs text-slate-500">
                            Faster Payments GBP to XAF
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Payout Channels
                      </div>
                      <div className="space-y-2.5">
                        <div className="group cursor-pointer">
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00c2c7] transition-colors">
                            MTN Mobile Money
                          </div>
                          <div className="text-xs text-slate-500">
                            Sub-minute direct wallet credit
                          </div>
                        </div>
                        <div className="group cursor-pointer">
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00c2c7] transition-colors">
                            Orange Money
                          </div>
                          <div className="text-xs text-slate-500">
                            Instant SMS confirmation payout
                          </div>
                        </div>
                        <div className="group cursor-pointer">
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00c2c7] transition-colors">
                            Commercial Bank Wire
                          </div>
                          <div className="text-xs text-slate-500">
                            UBA, Ecobank, Afribank, CBC
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* For Business Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveMegaMenu("business")}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button
                  type="button"
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
                >
                  For Business
                </button>
                {activeMegaMenu === "business" && (
                  <div className="absolute top-full left-0 w-[500px] bg-white rounded-xl shadow-xl border border-slate-200/80 p-6 grid grid-cols-2 gap-6 transition-all duration-200">
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Commercial Solutions
                      </div>
                      <div className="space-y-2.5">
                        <div className="group cursor-pointer">
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00c2c7] transition-colors">
                            B2B Supplier Settlement
                          </div>
                          <div className="text-xs text-slate-500">
                            High-volume wholesale clearing
                          </div>
                        </div>
                        <div className="group cursor-pointer">
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00c2c7] transition-colors">
                            Bulk Payroll & Contractor Payouts
                          </div>
                          <div className="text-xs text-slate-500">
                            Automated multi-recipient runs
                          </div>
                        </div>
                        <div className="group cursor-pointer">
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00c2c7] transition-colors">
                            Multi-Currency Treasury
                          </div>
                          <div className="text-xs text-slate-500">
                            Segregated escrow accounts
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Governance & Controls
                      </div>
                      <div className="space-y-2.5">
                        <div className="group cursor-pointer">
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00c2c7] transition-colors">
                            Dual-Control Approvals
                          </div>
                          <div className="text-xs text-slate-500">
                            Maker-checker security protocol
                          </div>
                        </div>
                        <div className="group cursor-pointer">
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00c2c7] transition-colors">
                            Cryptographic Audit Ledger
                          </div>
                          <div className="text-xs text-slate-500">
                            COBAC prudential compliance
                          </div>
                        </div>
                        <div className="group cursor-pointer">
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00c2c7] transition-colors">
                            Automated Statements
                          </div>
                          <div className="text-xs text-slate-500">
                            Daily reconciliation reports
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Developers Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveMegaMenu("developers")}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button
                  type="button"
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
                >
                  Developers
                </button>
                {activeMegaMenu === "developers" && (
                  <div className="absolute top-full left-0 w-[460px] bg-white rounded-xl shadow-xl border border-slate-200/80 p-6 grid grid-cols-2 gap-6 transition-all duration-200">
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                        API Documentation
                      </div>
                      <div className="space-y-2.5">
                        <div className="group cursor-pointer">
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00c2c7] transition-colors">
                            REST API Reference
                          </div>
                          <div className="text-xs text-slate-500">
                            OpenAPI 3.1 specification
                          </div>
                        </div>
                        <div className="group cursor-pointer">
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00c2c7] transition-colors">
                            Webhooks & Events
                          </div>
                          <div className="text-xs text-slate-500">
                            Sub-100ms delivery guarantees
                          </div>
                        </div>
                        <div className="group cursor-pointer">
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00c2c7] transition-colors">
                            Client SDKs
                          </div>
                          <div className="text-xs text-slate-500">
                            TypeScript, Java, Python
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Sandbox & Testing
                      </div>
                      <div className="space-y-2.5">
                        <div className="group cursor-pointer">
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00c2c7] transition-colors">
                            Testnet Environment
                          </div>
                          <div className="text-xs text-slate-500">
                            Simulate mobile money payouts
                          </div>
                        </div>
                        <div className="group cursor-pointer">
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00c2c7] transition-colors">
                            Idempotency Engine
                          </div>
                          <div className="text-xs text-slate-500">
                            Zero double-spend architecture
                          </div>
                        </div>
                        <div className="group cursor-pointer">
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00c2c7] transition-colors">
                            System Status
                          </div>
                          <div className="text-xs text-slate-500">
                            99.99% uptime live monitor
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Resources Link */}
              <div
                className="relative"
                onMouseEnter={() => setActiveMegaMenu("resources")}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button
                  type="button"
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
                >
                  Resources
                </button>
                {activeMegaMenu === "resources" && (
                  <div className="absolute top-full left-0 w-[300px] bg-white rounded-xl shadow-xl border border-slate-200/80 p-5 space-y-3 transition-all duration-200">
                    <div className="group cursor-pointer">
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00c2c7] transition-colors">
                        BEAC Parity Index
                      </div>
                      <div className="text-xs text-slate-500">
                        Live official central bank peg benchmark
                      </div>
                    </div>
                    <div className="group cursor-pointer">
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00c2c7] transition-colors">
                        COBAC Compliance Whitepaper
                      </div>
                      <div className="text-xs text-slate-500">
                        Regional banking regulatory framework
                      </div>
                    </div>
                    <div className="group cursor-pointer">
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00c2c7] transition-colors">
                        Double-Entry Ledger Security
                      </div>
                      <div className="text-xs text-slate-500">
                        Zero-sum balance sheet architecture
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing Direct Link */}
              <a
                href="#pricing-calculator"
                className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors"
              >
                Pricing
              </a>
            </div>

            {/* Right Side: Log In & Create Account Action */}
            <div className="hidden sm:flex items-center space-x-5">
              <button
                type="button"
                onClick={() => setActiveNav("login")}
                className="text-sm font-semibold text-slate-700 hover:text-[#001f5b] transition-colors cursor-pointer"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => setActiveNav("register")}
                className="btn-sheen btn-press-active bg-[#001f5b] hover:bg-[#001744] text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm cursor-pointer transition-all duration-150"
              >
                Create account
              </button>
            </div>

            {/* Mobile Hamburger Toggle (Pure CSS lines, NO icon glyph!) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`h-0.5 w-full bg-slate-900 rounded-sm transition-transform duration-200 ${
                    mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-slate-900 rounded-sm transition-opacity duration-200 ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-slate-900 rounded-sm transition-transform duration-200 ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Full-screen / Slide-down Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 pt-4 pb-8 space-y-5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-4 pt-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Navigation
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm font-medium text-slate-800">
                <div
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-slate-50 rounded"
                >
                  Send Money
                </div>
                <div
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-slate-50 rounded"
                >
                  For Business
                </div>
                <div
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-slate-50 rounded"
                >
                  Developers
                </div>
                <div
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-slate-50 rounded"
                >
                  Resources
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveNav("login");
                }}
                className="w-full text-center py-2.5 font-semibold text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveNav("register");
                }}
                className="w-full text-center py-2.5 font-semibold text-white bg-[#001f5b] rounded-lg shadow-sm"
              >
                Create account
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ========================================================================= */}
      {/* SECTION 2B: HERO WITH AMBIENT MORPHING GRADIENT MESH                      */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
        {/* Animated Gradient Mesh Ambient Background (Navy, teal, Gold, Cyan) */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          {/* Blob 1: Deep Navy & Teal blend */}
          <div
            className="mesh-blob-1 absolute -top-40 -left-32 w-[680px] h-[680px] rounded-full opacity-35 mix-blend-multiply filter blur-[96px]"
            style={{
              background:
                "radial-gradient(circle, #001f5b 0%, #00a86b 60%, transparent 80%)",
            }}
          />
          {/* Blob 2: Warm Gold & teal blend */}
          <div
            className="mesh-blob-2 absolute top-10 -right-24 w-[620px] h-[620px] rounded-full opacity-25 mix-blend-multiply filter blur-[90px]"
            style={{
              background:
                "radial-gradient(circle, #f59e0b 0%, #0d9488 50%, #ffffff 80%)",
            }}
          />
          {/* Soft central radiant glow */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] rounded-full opacity-20 filter blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, #00a86b 0%, #001f5b 70%, transparent 100%)",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Eyebrow, Headline with Italic Serif Accent, Subtitle & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Uppercase Eyebrow Line */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-[#00c2c7]/10 border border-[#00c2c7]/30 rounded-full shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#001f5b] pulse-indicator" />
                <span className="text-xs font-bold tracking-widest text-[#001f5b] uppercase font-mono">
                  CEMAC Cross-Border Settlement
                </span>
              </div>

              {/* Large Headline Mixing Sans-Serif and Italic Serif Accent Phrase */}
              <h1 className="text-4xl sm:text-5xl lg:text-[68px] font-extrabold text-slate-950 tracking-tight leading-[1.08]">
                Convert currency, land in XAF wallets —{" "}
                <span className="font-serif-accent font-normal text-slate-800">
                  settled on an auditable ledger.
                </span>
              </h1>

              {/* Supporting Sentence */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl leading-relaxed">
                Direct SEPA and ACH clearing into Central African CFA Francs
                (XAF) with instant Orange Money & MTN disbursements,
                institutional zero-spread pegs, and complete dual-approval audit
                trails.
              </p>

              {/* Two CTAs: Primary Sheen Button & Secondary Text Link with Animated Reveal */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                <button
                  type="button"
                  onClick={() => setActiveNav("register")}
                  className="btn-sheen btn-press-active bg-[#001f5b] hover:bg-[#001744] text-white text-base font-semibold px-8 py-4 rounded-xl shadow-md cursor-pointer transition-all duration-150"
                >
                  Get started
                </button>
                <a
                  href="#how-it-works"
                  className="group relative inline-block text-base font-semibold text-slate-900 py-1 transition-colors cursor-pointer"
                >
                  <span>See how it works</span>
                  <span className="block h-0.5 w-0 bg-[#001f5b] group-hover:w-full transition-all duration-250 ease-out" />
                </a>
              </div>

              {/* Institutional Parity Guarantee Pill */}
              <div className="pt-4 flex items-center space-x-3 text-xs text-slate-500 font-mono">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#001f5b]" />
                <span>BEAC Peg: 1 EUR = 655.957 XAF • Zero hidden spreads</span>
              </div>
            </div>

            {/* Right Column: High-Craft Live Interactive Calculator Card (Visual Anchor) */}
            <div id="pricing-calculator" className="lg:col-span-5">
              <div className="bento-card bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <div className="text-xs font-mono font-bold text-[#001f5b] uppercase tracking-wider">
                      Live Settlement Parity
                    </div>
                    <div className="text-sm font-semibold text-slate-900 mt-0.5">
                      Guaranteed Central Bank Rate
                    </div>
                  </div>
                  <div className="px-2.5 py-1 bg-[#00c2c7]/10 text-[#001f5b] text-xs font-mono font-bold rounded-md border border-[#00c2c7]/30">
                    INSTITUTIONAL
                  </div>
                </div>

                {/* Currency Selector Pill Group */}
                <div className="flex p-1 bg-slate-100 rounded-lg space-x-1">
                  {(["EUR", "USD", "GBP"] as const).map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => setFxCurrency(curr)}
                      className={`flex-1 py-1.5 text-xs font-bold font-mono rounded-md transition-all cursor-pointer ${
                        fxCurrency === curr
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>

                {/* Send Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>You send (Wire / SEPA)</span>
                    <span className="font-mono">Zero Deposit Fee</span>
                  </div>
                  <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 bg-slate-50/50 focus-within:border-[#001f5b] focus-within:bg-white transition-colors">
                    <span className="text-base font-bold text-slate-500 font-mono mr-2">
                      {fxCurrency === "EUR"
                        ? "€"
                        : fxCurrency === "USD"
                          ? "$"
                          : "£"}
                    </span>
                    <input
                      type="number"
                      value={fxAmount}
                      onChange={(e) =>
                        setFxAmount(Math.max(10, Number(e.target.value)))
                      }
                      className="w-full text-xl font-bold font-mono text-slate-900 bg-transparent outline-hidden tabular-nums"
                    />
                  </div>
                </div>

                {/* Parity Divider with Conversion Metadata */}
                <div className="relative py-1 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <span className="relative bg-white px-3 text-[11px] font-mono text-[#001f5b] font-bold border border-slate-200 rounded-full">
                    1 {fxCurrency} = {getExchangeRate()} XAF
                  </span>
                </div>

                {/* Recipient Receives */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>Recipient receives in XAF</span>
                    <span className="text-[#001f5b] font-semibold font-mono">
                      Instant Payout
                    </span>
                  </div>
                  <div className="flex items-center justify-between border border-[#00c2c7]/30 rounded-xl px-4 py-3.5 bg-[#00c2c7]/5">
                    <span className="text-2xl font-extrabold text-slate-950 font-mono tracking-tight tabular-nums">
                      {calculatedXaf}
                    </span>
                    <span className="text-xs font-bold font-mono text-[#001f5b] bg-[#00c2c7]/15 px-2 py-1 rounded">
                      FCFA
                    </span>
                  </div>
                </div>

                {/* Recipient Channels */}
                <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                  <span>Disbursement channels:</span>
                  <div className="flex items-center space-x-2 font-semibold text-slate-800 font-mono">
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded">
                      MTN MoMo
                    </span>
                    <span className="px-2 py-0.5 bg-orange-50 text-orange-900 border border-orange-200 rounded">
                      Orange Money
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveNav("register")}
                  className="btn-sheen btn-press-active w-full bg-[#001f5b] hover:bg-[#00153f] text-white font-semibold py-3.5 rounded-xl shadow-sm cursor-pointer transition-colors text-sm"
                >
                  Initiate transfer with guaranteed rate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontally Auto-Scrolling Partner & Trust-Signal Marquee Strip */}
        <div className="mt-20 pt-8 border-y border-slate-200/70 bg-white/40 backdrop-blur-xs overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Regional Clearing Networks & Liquidity Gateways
            </span>
          </div>
          <div className="animate-marquee py-2 flex items-center space-x-12">
            {[
              "MTN MOBILE MONEY",
              "ORANGE MONEY",
              "BEAC CENTRAL CLEARING",
              "SEPA DIRECT EURO",
              "UBA GROUP CEMAC",
              "ECOBANK CAMEROON",
              "COMMERCIAL BANK OF CHAD",
              "GIMAC INTEROPERABILITY",
              "AFRIBANK CEMAC",
              "SWIFT BIC CODE VALIDATED",
              // Repeat array for seamless 360 continuous loop
              "MTN MOBILE MONEY",
              "ORANGE MONEY",
              "BEAC CENTRAL CLEARING",
              "SEPA DIRECT EURO",
              "UBA GROUP CEMAC",
              "ECOBANK CAMEROON",
              "COMMERCIAL BANK OF CHAD",
              "GIMAC INTEROPERABILITY",
              "AFRIBANK CEMAC",
              "SWIFT BIC CODE VALIDATED",
            ].map((partner, idx) => (
              <div
                key={idx}
                className="shrink-0 flex items-center space-x-3 px-4 py-1.5 rounded-md bg-white border border-slate-200/80 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00c2c7]/100" />
                <span className="text-xs font-bold font-mono tracking-wider text-slate-700">
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2C: PRODUCT BENTO GRID ("One platform for every way money moves") */}
      {/* ========================================================================= */}
      <section
        id="how-it-works"
        className="py-24 bg-slate-50/60 border-b border-slate-200/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Section Heading & Subtitle */}
          <div className="max-w-3xl space-y-4">
            <div className="text-xs font-bold text-[#001f5b] uppercase tracking-widest font-mono">
              Core Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight">
              One platform for every way money moves
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Purpose-built infrastructure for consumer remittances,
              institutional treasury, and high-throughput mobile money
              disbursements across Central Africa.
            </p>
          </div>

          {/* Asymmetric Bento Box Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Buy XAF Remittance (Large 2-column card) */}
            <div className="bento-card lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 flex flex-col justify-between space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#001f5b] font-mono uppercase tracking-wider">
                  Remittance Engine
                </span>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Wholesale XAF Conversion with Fixed Central Bank Parity
                </h3>
                <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                  Remit EUR, USD, and GBP straight into Central African CFA
                  Francs without predatory spreads. Our direct clearing links
                  lock the exact BEAC rate from initiation to settlement.
                </p>
              </div>

              {/* Stylized UI Visual: Live Mock FX Ticker & Order Depth */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono border-b border-slate-200 pb-3">
                  <span className="font-bold text-slate-700">
                    RATE CONFIRMATION ENGINE
                  </span>
                  <span className="text-[#001f5b] font-semibold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00c2c7]/100" />
                    <span>LOCKED & GUARANTEED</span>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center font-mono">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <div className="text-[11px] text-slate-400">
                      INPUT CURRENCY
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-1">
                      1 000 EUR
                    </div>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <div className="text-[11px] text-slate-400">
                      BEAC FIXED PARITY
                    </div>
                    <div className="text-sm font-bold text-[#001f5b] mt-1">
                      1:655.957
                    </div>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <div className="text-[11px] text-slate-400">
                      SETTLED IN WALLET
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-1">
                      655 957 XAF
                    </div>
                  </div>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#001f5b] h-full w-4/5 rounded-full" />
                </div>
              </div>
            </div>

            {/* Card 2: Wallet & Statements (1-column card) */}
            <div className="bento-card bg-white rounded-2xl border border-slate-200 p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#001f5b] font-mono uppercase tracking-wider">
                  Treasury
                </span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Multi-Currency Escrow & Statement Generation
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Segregated client balances, instant statement exports, and
                  cryptographically verified transaction ledgers.
                </p>
              </div>

              {/* Stylized Visual: Wallet Balance & Statement Mockup */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 font-mono">
                <div className="text-[11px] text-slate-500 uppercase">
                  Available XAF Balance
                </div>
                <div className="text-xl font-bold text-slate-900">
                  4 250 000 XAF
                </div>
                <div className="flex justify-between text-xs pt-2 border-t border-slate-200 text-slate-600">
                  <span>In Escrow Clearing:</span>
                  <span className="font-semibold text-[#001f5b]">
                    300 000 XAF
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  SHA256: 8a7f19b2c340d...ec891
                </div>
              </div>
            </div>

            {/* Card 3: Send & Withdraw to Mobile Money */}
            <div className="bento-card bg-white rounded-2xl border border-slate-200 p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#001f5b] font-mono uppercase tracking-wider">
                  Mobile Money
                </span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Sub-Minute Mobile Money Disbursements
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Automated payout pipeline directly to MTN Mobile Money and
                  Orange Money phone numbers across Cameroon.
                </p>
              </div>

              {/* Stylized Visual: Phone Router Pill & Signal */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Destination Operator</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded">
                    MTN MoMo
                  </span>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold">
                  +237 670 ••• ••• (Verified)
                </div>
                <div className="flex items-center justify-between text-[#001f5b] font-bold text-[11px] pt-1">
                  <span>DISPATCH LATENCY</span>
                  <span>32 SECONDS</span>
                </div>
              </div>
            </div>

            {/* Card 4: Business Payouts & Bulk Disbursement */}
            <div className="bento-card bg-white rounded-2xl border border-slate-200 p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#001f5b] font-mono uppercase tracking-wider">
                  Commercial
                </span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Enterprise Batch Runs & Dual Approval
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Execute 500+ contractor or supplier payouts in a single batch
                  with mandatory dual-signoff maker-checker controls.
                </p>
              </div>

              {/* Stylized Visual: Batch Status & Approver Stamps */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Batch #BATCH-8902</span>
                  <span className="text-[#001f5b] font-bold">
                    100% EXECUTED
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2 bg-white border border-slate-200 rounded text-center">
                    <div className="text-slate-400">MAKER</div>
                    <div className="font-bold text-slate-900">Approved</div>
                  </div>
                  <div className="p-2 bg-white border border-slate-200 rounded text-center">
                    <div className="text-slate-400">CHECKER</div>
                    <div className="font-bold text-[#001f5b]">Signed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Compliance & Audit Ledger */}
            <div className="bento-card bg-white rounded-2xl border border-slate-200 p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#001f5b] font-mono uppercase tracking-wider">
                  Compliance
                </span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Cryptographic Double-Entry Ledger
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Zero-sum accounting with immutable balance sheets complying
                  strictly with COBAC and BEAC prudential banking norms.
                </p>
              </div>

              {/* Stylized Visual: Ledger Invariance Gauge */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Double-Entry Balance</span>
                  <span className="font-bold text-[#001f5b]">
                    INVARIANT (Δ 0.00)
                  </span>
                </div>
                <div className="p-2 bg-white border border-slate-200 rounded text-[11px] text-slate-700 flex justify-between">
                  <span>Total Debits: 145.2M</span>
                  <span>Total Credits: 145.2M</span>
                </div>
                <div className="text-[10px] text-slate-400 text-center">
                  Cryptographically Audited Every 60s
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2D: STATS BAND ("The backbone of regional settlement")             */}
      {/* ========================================================================= */}
      <section
        ref={statsSectionRef}
        className="py-24 bg-[#001744] text-white relative overflow-hidden bg-grid-pattern border-y border-slate-800"
      >
        {/* Subtle Ambient Radial Lighting */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] opacity-20 filter blur-[90px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, #00a86b 0%, #001f5b 80%, transparent 100%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-xs font-mono font-bold text-[#00c2c7] uppercase tracking-widest">
              Platform Reliability & Scale
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              The backbone of regional settlement
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Engineered with zero-downtime resilience to keep capital flowing
              across borders without interruption.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="space-y-2 text-center lg:text-left border-l-2 border-teal-500/40 pl-6">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-mono text-[#00c2c7] tabular-nums">
                {statCorridors}
              </div>
              <div className="text-sm font-semibold text-white">
                CEMAC Member States
              </div>
              <div className="text-xs text-slate-400">
                Cameroon, CAR, Chad, Congo, Gabon, Eq. Guinea
              </div>
            </div>

            <div className="space-y-2 text-center lg:text-left border-l-2 border-teal-500/40 pl-6">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-mono text-white tabular-nums">
                &lt;{statSpeed}s
              </div>
              <div className="text-sm font-semibold text-white">
                Median Settlement Speed
              </div>
              <div className="text-xs text-slate-400">
                From wire confirmation to phone credit
              </div>
            </div>

            <div className="space-y-2 text-center lg:text-left border-l-2 border-teal-500/40 pl-6">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-mono text-[#00c2c7] tabular-nums">
                {statUptime}%
              </div>
              <div className="text-sm font-semibold text-white">
                Core Ledger Availability
              </div>
              <div className="text-xs text-slate-400">
                Multi-region active-active cluster
              </div>
            </div>

            <div className="space-y-2 text-center lg:text-left border-l-2 border-teal-500/40 pl-6">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-mono text-white tabular-nums">
                ${statVolume}M+
              </div>
              <div className="text-sm font-semibold text-white">
                Annual Volume Cleared
              </div>
              <div className="text-xs text-slate-400">
                Commercial trade & family remittance flows
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2E: CUSTOMER / USE-CASE ACCORDION                                */}
      {/* ========================================================================= */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-3xl space-y-3">
            <div className="text-xs font-bold text-[#001f5b] uppercase tracking-widest font-mono">
              Proven Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight">
              Built for businesses and corridors of every size
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Explore how individuals, export cooperatives, and high-growth
              digital platforms rely on E-NAKO MoneyFlow to settle funds
              seamlessly.
            </p>
          </div>

          {/* Accordion Component with Smooth Height and State Transition */}
          <div className="space-y-4">
            {CASE_STUDIES.map((study, index) => {
              const isOpen = activeAccordion === index;
              return (
                <div
                  key={index}
                  className={`border rounded-2xl transition-all duration-250 cursor-pointer overflow-hidden ${
                    isOpen
                      ? "border-teal-700/60 bg-[#00c2c7]/10/20 shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                  onClick={() => setActiveAccordion(index)}
                >
                  <div className="p-6 sm:p-8 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-xs font-mono font-bold text-[#001f5b] uppercase tracking-wider">
                        Case Study 0{index + 1}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                        {study.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        {study.tagline}
                      </p>
                    </div>
                    <div className="shrink-0 ml-4 font-mono text-xs font-bold px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-700">
                      {isOpen ? "COLLAPSE" : "EXPAND"}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="px-6 pb-8 sm:px-8 space-y-6 pt-2 border-t border-slate-200/60 animate-in fade-in duration-200">
                      <p className="text-base text-slate-700 leading-relaxed max-w-4xl">
                        {study.story}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        {study.stats.map((st, i) => (
                          <div
                            key={i}
                            className="p-4 bg-white border border-slate-200/80 rounded-xl space-y-1"
                          >
                            <div className="text-lg sm:text-xl font-bold font-mono text-[#001f5b]">
                              {st.val}
                            </div>
                            <div className="text-xs text-slate-500">
                              {st.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2">
                        <span className="text-sm font-semibold text-[#001f5b] hover:text-[#001f5b] underline underline-offset-4 cursor-pointer">
                          {study.linkText}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2F: DEVELOPER / INFRASTRUCTURE SECTION                           */}
      {/* ========================================================================= */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Developer Overview & Small Stats */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-800 border border-slate-700 rounded-md">
                <span className="text-xs font-mono font-bold text-[#00c2c7] uppercase tracking-widest">
                  Developer Platform
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Reliable infrastructure for every integration
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Connect directly into regional mobile money gateways and
                clearing accounts with predictable REST APIs, strict idempotency
                enforcement, and sub-100ms webhook confirmations.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <div className="text-2xl font-bold font-mono text-[#00c2c7]">
                    180K+
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    API Requests / Day
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-white">
                    48ms
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Median Latency
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-[#00c2c7]">
                    99.99%
                  </div>
                  <div className="text-xs text-slate-400 mt-1">SLA Uptime</div>
                </div>
              </div>

              {/* Language Selector Tabs */}
              <div className="flex space-x-2 pt-2">
                {(["typescript", "curl", "java"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setCodeLanguage(lang)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold uppercase transition-colors cursor-pointer ${
                      codeLanguage === lang
                        ? "bg-[#001f5b] text-white"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Stylized Code Editor / Terminal Mockup */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs">
                {/* Terminal Title Bar with 3 Colored Window Dots */}
                <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-[#00c2c7]/100/80 inline-block" />
                    <span className="ml-3 text-[11px] text-slate-400">
                      POST /v1/transfers — E-NAKO Live Sandbox
                    </span>
                  </div>
                  <span className="text-[11px] text-[#00c2c7] font-bold">
                    201 CREATED
                  </span>
                </div>

                {/* Code Content Rendered Cleanly without JSX Comment Warnings */}
                <div className="p-5 space-y-4 overflow-x-auto text-slate-300 leading-relaxed font-mono">
                  <pre className="text-[13px] leading-relaxed font-mono whitespace-pre text-slate-200">
                    {CODE_SNIPPETS[codeLanguage]}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Three Lower Text Cards (Plain text cards with text link, NO icons!) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
              <h4 className="text-base font-bold text-white">No-code portal</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Initiate single transfers, manage recipient address books, and
                export audited statements directly from our web dashboard
                without code.
              </p>
              <span className="text-xs font-semibold text-[#00c2c7] hover:text-teal-300 underline underline-offset-4 cursor-pointer block pt-1">
                Explore web dashboard
              </span>
            </div>

            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
              <h4 className="text-base font-bold text-white">
                Pre-integrated partners
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Plug into already-configured MTN Mobile Money, Orange Money, and
                CEMAC interbank clearing rails with zero external licensing
                overhead.
              </p>
              <span className="text-xs font-semibold text-[#00c2c7] hover:text-teal-300 underline underline-offset-4 cursor-pointer block pt-1">
                Review network coverage
              </span>
            </div>

            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
              <h4 className="text-base font-bold text-white">
                Build your own integration
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Use our complete OpenAPI 3.1 contract, mock testnet sandbox
                environment, and automated signature verifiers to go live
                safely.
              </p>
              <span className="text-xs font-semibold text-[#00c2c7] hover:text-teal-300 underline underline-offset-4 cursor-pointer block pt-1">
                Read API specification
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2G: TESTIMONIAL CAROUSEL                                          */}
      {/* ========================================================================= */}
      <section
        className="py-24 bg-white border-b border-slate-200"
        onMouseEnter={() => setIsCarouselHovered(true)}
        onMouseLeave={() => setIsCarouselHovered(false)}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
          <div className="space-y-3">
            <div className="text-xs font-bold text-[#001f5b] uppercase tracking-widest font-mono">
              Partner Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Trusted by leaders moving capital across borders
            </h2>
          </div>

          {/* Active Testimonial Card */}
          <div className="bento-card p-8 sm:p-12 bg-slate-50 border border-slate-200 rounded-3xl max-w-3xl mx-auto space-y-8 min-h-[260px] flex flex-col justify-between">
            <p className="text-lg sm:text-xl text-slate-800 font-medium leading-relaxed italic">
              &ldquo;{TESTIMONIALS[testimonialIndex].quote}&rdquo;
            </p>

            <div className="flex items-center justify-center space-x-4 pt-2">
              <div className="w-12 h-12 rounded-full bg-[#001f5b] text-[#00c2c7] font-mono font-bold flex items-center justify-center text-sm border border-[#00c2c7]/30">
                {TESTIMONIALS[testimonialIndex].initials}
              </div>
              <div className="text-left">
                <div className="text-base font-bold text-slate-900">
                  {TESTIMONIALS[testimonialIndex].name}
                </div>
                <div className="text-xs text-slate-500">
                  {TESTIMONIALS[testimonialIndex].role} •{" "}
                  {TESTIMONIALS[testimonialIndex].company}
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Minimal Line Indicators & Plain-Text Controls (No icon glyphs!) */}
          <div className="flex items-center justify-center space-x-6 pt-2">
            <button
              type="button"
              onClick={() =>
                setTestimonialIndex((prev) =>
                  prev === 0 ? TESTIMONIALS.length - 1 : prev - 1,
                )
              }
              className="text-xs font-mono font-bold text-slate-500 hover:text-slate-950 px-3 py-1 rounded border border-slate-200 cursor-pointer"
            >
              PREVIOUS
            </button>

            <div className="flex space-x-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTestimonialIndex(idx)}
                  className={`h-1.5 transition-all duration-200 rounded-full cursor-pointer ${
                    testimonialIndex === idx
                      ? "w-8 bg-[#001f5b]"
                      : "w-2 bg-slate-300"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length)
              }
              className="text-xs font-mono font-bold text-slate-500 hover:text-slate-950 px-3 py-1 rounded border border-slate-200 cursor-pointer"
            >
              NEXT
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2H: NEWS / RESOURCES GRID ("What's happening at E-NAKO")          */}
      {/* ========================================================================= */}
      <section className="py-24 bg-slate-50/50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-3">
            <div className="text-xs font-bold text-[#001f5b] uppercase tracking-widest font-mono">
              Market Intelligence & Updates
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              What&apos;s happening at E-NAKO
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: teal accent */}
            <div className="bento-card bg-white rounded-xl border border-slate-200 border-t-4 border-t-teal-600 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-[#001f5b] uppercase">
                  Compliance
                </span>
                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  2026 CEMAC Cross-Border Payment Regulations Guide
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A comprehensive breakdown of foreign exchange licensing, COBAC
                  guidelines, and electronic money provisions.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-800 hover:text-[#001f5b] underline underline-offset-4 cursor-pointer">
                Read guide
              </span>
            </div>

            {/* Card 2: Navy accent */}
            <div className="bento-card bg-white rounded-xl border border-slate-200 border-t-4 border-t-[#001f5b] p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-[#001f5b] uppercase">
                  Engineering
                </span>
                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  Building a Zero-Sum Double-Entry Ledger in Java & Postgres
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Architectural patterns for database row locking, idempotent
                  transaction hashes, and zero-loss reconciliations.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-800 hover:text-[#001f5b] underline underline-offset-4 cursor-pointer">
                Read engineering post
              </span>
            </div>

            {/* Card 3: Warm Gold accent */}
            <div className="bento-card bg-white rounded-xl border border-slate-200 border-t-4 border-t-amber-500 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-amber-700 uppercase">
                  Network Coverage
                </span>
                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  Expanding Instant Mobile Settlements into Chad and Gabon
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Direct corridor onboarding enables corporate clients to
                  disburse funds to regional partners in Libreville and
                  N&apos;Djamena.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-800 hover:text-[#001f5b] underline underline-offset-4 cursor-pointer">
                Read announcement
              </span>
            </div>

            {/* Card 4: Teal accent */}
            <div className="bento-card bg-white rounded-xl border border-slate-200 border-t-4 border-t-teal-600 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-teal-800 uppercase">
                  Macroeconomics
                </span>
                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  The Power of Fixed Parity: How BEAC Currency Pegs Protect
                  Value
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Why institutional importers rely on the 655.957 peg to
                  completely hedge against emerging market currency shocks.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-800 hover:text-[#001f5b] underline underline-offset-4 cursor-pointer">
                Read analysis
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2I: FINAL CTA BAND                                                */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#001744] text-white text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none filter blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, #00a86b 0%, #001f5b 70%, transparent 100%)",
          }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Ready to accelerate your cross-border settlement?
            </h2>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Create an account in minutes to access guaranteed parity rates, or
              speak with our institutional treasury team for custom clearing
              corridors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={() => setActiveNav("register")}
              className="btn-sheen btn-press-active bg-[#00c2c7]/100 hover:bg-[#001f5b] text-slate-950 text-base font-bold px-8 py-4 rounded-xl shadow-lg cursor-pointer transition-all"
            >
              Create an account
            </button>
            <button
              type="button"
              onClick={() => setActiveNav("login")}
              className="btn-press-active bg-white/10 hover:bg-white/15 text-white text-base font-semibold px-6 py-4 rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              Log in to portal
            </button>
          </div>

          {/* Two Supporting Link Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-6 text-left">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-xs font-mono font-bold text-[#00c2c7]">
                INSTITUTIONAL PRICING
              </div>
              <div className="text-sm font-semibold text-white">
                See volume fee tiers
              </div>
              <div className="text-xs text-slate-400">
                Transparent rates starting at 0.4%
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-xs font-mono font-bold text-[#00c2c7]">
                TALK WITH TREASURY
              </div>
              <div className="text-sm font-semibold text-white">
                Contact our FX team
              </div>
              <div className="text-xs text-slate-400">
                Dedicated corridor support officers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2J: MEGA-FOOTER                                                   */}
      {/* ========================================================================= */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Multi-Column Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            {/* Column 1: Products */}
            <div className="space-y-3">
              <div className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
                Products
              </div>
              <ul className="space-y-2">
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Buy XAF
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Remittance API
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Mobile Money Payout
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Escrow Wallets
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Treasury Clearing
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 2: Solutions */}
            <div className="space-y-3">
              <div className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
                Solutions
              </div>
              <ul className="space-y-2">
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Diaspora Corridors
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Exporters & Importers
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Marketplace Payouts
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Payroll Operations
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Institutional Liquidity
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 3: Developers */}
            <div className="space-y-3">
              <div className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
                Developers
              </div>
              <ul className="space-y-2">
                <li>
                  <span className="hover:text-white cursor-pointer">
                    API Reference
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    OpenAPI Specification
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    SDK Libraries
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Webhooks Engine
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    System Status
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 4: Resources */}
            <div className="space-y-3">
              <div className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
                Resources
              </div>
              <ul className="space-y-2">
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Documentation
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    BEAC Parity Index
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Compliance Whitepaper
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Ledger Security Model
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Case Studies
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 5: Company */}
            <div className="space-y-3">
              <div className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
                Company
              </div>
              <ul className="space-y-2">
                <li>
                  <span className="hover:text-white cursor-pointer">
                    About E-NAKO
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Executive Leadership
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Careers
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Press & Media
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Ethics & Governance
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 6: Support */}
            <div className="space-y-3">
              <div className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
                Support
              </div>
              <ul className="space-y-2">
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Help Center
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Contact Treasury
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Fee Calculator
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Report an Issue
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">
                    Security Contacts
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Region / Language Selector & Regulatory Note */}
          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="text-white font-bold tracking-tight">
                E-NAKO MoneyFlow
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">
                Institutional Regional Clearing Platform
              </span>
            </div>
            <div className="flex items-center space-x-3 font-mono text-[11px]">
              <span className="text-slate-300 font-bold px-2.5 py-1 bg-slate-900 rounded border border-slate-800">
                English (CEMAC / Global)
              </span>
              <span className="hover:text-white cursor-pointer px-2.5 py-1 rounded">
                Français (Zone Franc)
              </span>
            </div>
          </div>

          {/* Regulatory Compliance Text */}
          <div className="text-[11px] text-slate-500 leading-relaxed space-y-2 max-w-5xl">
            <p>
              E-NAKO MoneyFlow is a financial technology infrastructure
              platform. Banking, escrow, and regulated currency conversion
              services are executed in partnership with licensed commercial
              financial institutions and authorized electronic money issuers
              under COBAC (Commission Bancaire de l&apos;Afrique Centrale) and
              BEAC (Banque des États de l&apos;Afrique Centrale) regulatory
              frameworks. All customer client funds are maintained in
              segregated, ring-fenced escrow accounts with Tier-1 partner banks.
            </p>
            <p>
              © 2026 E-NAKO Financial Technologies Ltd. All rights reserved.
              Double-entry ledger architecture and multi-corridor settlement
              engine.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
