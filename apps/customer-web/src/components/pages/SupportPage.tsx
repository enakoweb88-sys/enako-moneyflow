"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PageHeader } from "../ui/page-header";
import { toast } from "sonner";
import {
  HelpCircle,
  MessageSquare,
  Send,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Shield,
} from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: "faq_1",
    question: "How long does a Buy XAF remittance take to credit my wallet?",
    answer:
      "Bank transfers initiated via SEPA, Faster Payments, or ACH typically settle within 15 to 45 minutes after you upload your proof of transfer. Once verified by our treasury team, your XAF wallet balance updates automatically.",
  },
  {
    id: "faq_2",
    question: "What are the daily withdrawal limits to MTN and Orange Money?",
    answer:
      "For Verified (Level 2) accounts, the maximum single transaction limit is 5 000 000 XAF, with a rolling daily limit of 10 000 000 XAF. Contact institutional support if your organization requires higher treasury thresholds.",
  },
  {
    id: "faq_3",
    question: "Why does a newly added beneficiary have a 24-hour cooldown?",
    answer:
      "To safeguard your funds against unauthorized access, newly added disbursement accounts require a mandatory 24-hour verification hold before disbursements can be initiated to them.",
  },
  {
    id: "faq_4",
    question: "What documents are accepted for KYC identity verification?",
    answer:
      "We accept valid international passports, CEMAC national ID cards, and official residence permits. Proof of address must be a utility bill or bank statement dated within the past 90 days.",
  },
  {
    id: "faq_5",
    question: "Are there any hidden exchange rate markups or fees?",
    answer:
      "No. E-NAKO uses competitive wholesale interbank FX rates. All conversion fees (typically 0.75% for EUR to XAF) and mobile network disbursement tariffs are itemized transparently before you confirm any transaction.",
  },
];

export const SupportPage: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQS[0].id);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Please enter both a subject and your message.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        "Your support request has been logged. Ticket #SUP-88214 created.",
      );
      setSubject("");
      setMessage("");
    }, 500);
  };

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support & Treasury Advisory"
        subtitle="Need assistance with an FX wire or automated clearing settlement? Our team is available 24/7"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Contact Form */}
        <div className="lg:col-span-5">
          <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#001f5b] via-[#00c2c7] to-[#D4AF37]" />
            <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50">
              <CardTitle className="text-base font-bold text-slate-900">
                Send an Inquiry
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Submit an inquiry directly to the E-NAKO operations and clearing
                desk
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Subject / Reference
                  </label>
                  <Input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Deposit confirmation for wire ENK-REM-89211"
                    required
                    className="w-full text-xs border-slate-300 rounded-xl h-10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Message Details
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Detail your question, beneficiary account, or remittance reference number..."
                    className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#001f5b] transition-all"
                    required
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                  ⚡ <strong>Response SLA:</strong> Institutional clearing desk
                  tickets are prioritized within 15 minutes.
                </div>

                <Button
                  type="submit"
                  variant="default"
                  className="w-full bg-[#001f5b] hover:bg-[#00153f] text-white rounded-xl shadow-xs font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Dispatching..." : "Submit Support Ticket"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* FAQs list */}
        <div className="lg:col-span-7">
          <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#001f5b] via-[#00c2c7] to-[#D4AF37]" />
            <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50">
              <CardTitle className="text-base font-bold text-slate-900">
                Frequently Asked Questions
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Official guidance regarding FX clearing, daily disbursement
                limits, and settlement windows
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {FAQS.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="border border-slate-200 rounded-xl overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        className={`w-full text-left p-4 flex items-center justify-between transition-colors ${
                          isOpen
                            ? "bg-[#001f5b]/5 text-[#001f5b] font-bold"
                            : "text-slate-800 hover:bg-slate-50 font-semibold"
                        }`}
                      >
                        <span className="text-xs">{faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-[#001f5b] shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="p-4 pt-2 text-xs leading-relaxed text-slate-600 bg-white border-t border-slate-100">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
