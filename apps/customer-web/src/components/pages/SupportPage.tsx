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
      "For Verified (Level 2) accounts, the maximum single transaction limit is 5,000,000 XAF, with a rolling daily limit of 10,000,000 XAF. Contact institutional support if your organization requires higher treasury thresholds.",
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
        title="Support & Knowledge Base"
        subtitle="Need assistance with an FX transaction or settlement? Our operational team is available 24/7."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Contact Form */}
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>
                Submit an inquiry directly to the E-NAKO operations desk.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Subject
                  </label>
                  <Input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Deposit confirmation for TX-8821"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Detail your question or reference number..."
                    className="w-full text-sm bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div className="text-xs text-slate-500">
                  Response SLA: Average response time is under 15 minutes during
                  standard operational windows.
                </div>

                <Button
                  type="submit"
                  variant="default"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* FAQs list using accordion pattern without any icons */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Immediate answers to common queries regarding deposits, limits,
                and settlement times.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100">
                {FAQS.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div key={faq.id} className="py-2">
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        className={`w-full text-left px-3 py-3 rounded transition-colors ${
                          isOpen
                            ? "bg-slate-100 font-semibold text-slate-900"
                            : "text-slate-800 hover:bg-slate-50 font-medium"
                        }`}
                      >
                        <div className="text-sm">{faq.question}</div>
                      </button>

                      {isOpen && (
                        <div className="px-3 pt-2 pb-3 text-xs leading-relaxed text-slate-600 border-l-2 border-emerald-600 ml-3 my-1">
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
