"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCustomer } from "@/mock/CustomerContext";

export const LandingPage: React.FC = () => {
  const { setActiveNav, setIsLoggedIn } = useCustomer();

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center space-y-6 px-4">
        <Badge variant="success">Official CEMAC & SEPA Clearing Corridor</Badge>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Send Money Internationally and Convert to XAF with Zero Hidden Spreads
        </h1>

        <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Fast, compliant cross-border remittances from Europe, North America,
          and the UK directly into Central African CFA Francs (XAF) with instant
          mobile money payout.
        </p>

        <div className="pt-2 flex items-center justify-center space-x-4">
          <Button
            variant="default"
            size="lg"
            onClick={() => setActiveNav("register")}
            className="text-base px-8 h-12"
          >
            Create account
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setActiveNav("login")}
            className="text-base px-6 h-12"
          >
            Log in to Portal
          </Button>
        </div>

        {/* Live Sample Rate Card as Visual Anchor (No imagery) */}
        <div className="pt-6 max-w-md mx-auto">
          <Card className="border-emerald-200 bg-white shadow-md">
            <CardHeader className="bg-emerald-50/60 border-b border-emerald-100 py-3 px-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Live Quoted Settlement Parity
                </span>
                <span className="text-xs font-mono text-emerald-800 font-semibold">
                  Institutional Grade
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-5 text-center space-y-1">
              <div className="text-xs text-slate-500 uppercase font-semibold">
                Fixed Peg Official Rate
              </div>
              <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                1 EUR = 655.957 XAF
              </div>
              <div className="text-xs text-slate-500 pt-1">
                Zero percentage markups on BEAC Central Bank parity peg
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3-Step Explainer Section */}
      <section className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            How E-NAKO MoneyFlow Works
          </h2>
          <p className="text-sm text-slate-500">
            A three-step deterministic transfer workflow governed by strict
            dual-control settlement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="text-xs font-bold font-mono text-emerald-800 uppercase tracking-wider">
                Step 1
              </div>
              <CardTitle className="text-lg mt-1 text-slate-900">
                1. Send your payment
              </CardTitle>
              <CardDescription className="text-xs text-slate-600 mt-1">
                Generate a unique payment reference and wire funds via standard
                bank transfer (SEPA, Faster Payments, or ACH) into our
                segregated client clearing accounts.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="text-xs font-bold font-mono text-emerald-800 uppercase tracking-wider">
                Step 2
              </div>
              <CardTitle className="text-lg mt-1 text-slate-900">
                2. We verify and convert it
              </CardTitle>
              <CardDescription className="text-xs text-slate-600 mt-1">
                Our treasury team verifies the incoming statement credit,
                freezes the guaranteed exchange rate, and performs automated AML
                and sanctions compliance screening.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="text-xs font-bold font-mono text-emerald-800 uppercase tracking-wider">
                Step 3
              </div>
              <CardTitle className="text-lg mt-1 text-slate-900">
                3. Your XAF wallet is credited
              </CardTitle>
              <CardDescription className="text-xs text-slate-600 mt-1">
                Your Central African Franc wallet receives the exact net
                proceeds instantly. Disburse to MTN Mobile Money, Orange Money,
                or regional commercial bank accounts.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Trust & Security Section (Plain Text) */}
      <section className="max-w-4xl mx-auto px-4">
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-8 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Institutional Trust & Regulatory Security
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              E-NAKO MoneyFlow operates under strict regulatory oversight
              complying with Central African Banking Commission (COBAC)
              prudential guidelines and international Anti-Money Laundering
              (AML) standards. All customer funds are held in ring-fenced escrow
              accounts with Tier-1 commercial partner banks. Double-entry
              cryptographic ledgering ensures complete zero-sum accounting
              integrity across all currency corridors.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-white rounded border border-slate-200 text-xs font-mono text-slate-700">
                CEMAC Region Authorized
              </span>
              <span className="px-2.5 py-1 bg-white rounded border border-slate-200 text-xs font-mono text-slate-700">
                End-to-End Audit Trail
              </span>
              <span className="px-2.5 py-1 bg-white rounded border border-slate-200 text-xs font-mono text-slate-700">
                Segregated Escrow Clearing
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Demo Shortcut Quick Entry */}
      <section className="max-w-md mx-auto text-center px-4">
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-xs space-y-2">
          <span className="font-bold text-emerald-900 uppercase tracking-wide block">
            Pair Programming Demo Mode
          </span>
          <p className="text-emerald-800">
            Click below to instantly log in as the verified test customer
            (Samuel Eto’o Fosso) to inspect all logged-in portal features.
          </p>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setIsLoggedIn(true);
              setActiveNav("dashboard");
            }}
          >
            Enter Portal as Test Customer
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 pt-8 pb-12 max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-900">E-NAKO MoneyFlow</span>
          <span>— Customer Web Portal</span>
        </div>
        <div className="flex items-center space-x-6">
          <button
            type="button"
            onClick={() => setActiveNav("support")}
            className="hover:text-slate-900 cursor-pointer"
          >
            Support
          </button>
          <span className="hover:text-slate-900 cursor-pointer">
            Terms of Service
          </span>
          <span className="hover:text-slate-900 cursor-pointer">
            Privacy Notice
          </span>
        </div>
        <div>© 2026 E-NAKO Financial Technologies. All rights reserved.</div>
      </footer>
    </div>
  );
};
