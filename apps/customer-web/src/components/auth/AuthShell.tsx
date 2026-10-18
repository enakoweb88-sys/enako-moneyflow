"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Globe2, ShieldCheck } from "lucide-react";
import { useCustomer } from "@/mock/CustomerContext";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: AuthShellProps) {
  const { setActiveNav } = useCustomer();

  return (
    <main className="auth-shell">
      <section
        className="auth-visual"
        aria-label="MoneyFlow regional payment network"
      >
        <motion.div
          className="auth-visual-image"
          animate={{ scale: [1.02, 1.08, 1.02], x: [0, -10, 0], y: [0, 8, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/moneyflow-auth-network.png"
            alt="An illuminated financial network connecting African markets"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </motion.div>
        <div className="auth-visual-shade" />

        <div className="auth-visual-content">
          <button
            type="button"
            onClick={() => setActiveNav("landing")}
            className="auth-back"
          >
            <ArrowLeft size={16} /> Back to MoneyFlow
          </button>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="auth-visual-copy"
          >
            <div className="auth-kicker">
              <Globe2 size={16} /> Built for regional movement
            </div>
            <h2>Move money across borders with confidence.</h2>
            <p>
              Secure settlement, transparent conversion and dependable
              delivery—designed for Africa&apos;s growing businesses.
            </p>
            <div className="auth-trust-row">
              <span>
                <ShieldCheck size={17} /> Bank-grade security
              </span>
              <span>
                <CheckCircle2 size={17} /> Clear settlement status
              </span>
            </div>
          </motion.div>

          <div className="auth-live-card">
            <span className="auth-live-dot" />
            <div>
              <strong>Protected connection</strong>
              <small>Encrypted end to end</small>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-form-side">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="auth-form-wrap"
        >
          <div className="auth-mobile-brand">
            E-NAKO <span>MoneyFlow</span>
          </div>
          <p className="auth-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="auth-description">{description}</p>
          {children}
          <p className="auth-legal">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </section>
    </main>
  );
}
