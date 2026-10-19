"use client";

import React, { useState } from "react";
import { Bell, Check } from "lucide-react";
import { useCustomer } from "@/mock/CustomerContext";

export const NotificationsPage: React.FC = () => {
  const { notifications, markAllNotificationsRead } = useCustomer();
  const [prefs, setPrefs] = useState({
    security: true,
    transactions: true,
    product: false,
    email: true,
    push: false,
  });
  const unread = notifications.filter((item) => item.unread).length;
  const toggle = (key: keyof typeof prefs) =>
    setPrefs((value) => ({ ...value, [key]: !value[key] }));
  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-16">
      <section className="flex flex-col gap-6 border-l-4 border-[#ef766f] py-3 pl-6 sm:flex-row sm:items-center sm:justify-between sm:pl-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#bd5d59]">
            Account signals
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-.045em] text-[#171b29]">
            Know what needs you.
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Security, transaction and account updates gathered in one calm
            place.
          </p>
        </div>
        <div className="flex items-baseline gap-2 sm:px-8">
          <div className="money-number text-5xl font-bold text-[#ef766f]">
            {unread}
          </div>
          <span className="text-xs font-bold text-slate-400">unread</span>
        </div>
      </section>
      <div className="grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-[-.035em] text-[#171b29]">
              Latest updates
            </h2>
            {unread > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="flex items-center gap-2 text-xs font-bold text-[#bd5d59]"
              >
                <Check size={14} />
                Mark all read
              </button>
            )}
          </div>
          {notifications.length ? (
            <div className="mt-5 border-t border-slate-200">
              {notifications.map((item) => (
                <article
                  key={item.id}
                  className="grid grid-cols-[12px_1fr_auto] gap-4 border-b border-slate-200 py-5"
                >
                  <span
                    className={`mt-1.5 h-2 w-2 rounded-full ${item.unread ? "bg-[#ef766f]" : "bg-slate-200"}`}
                  />
                  <div>
                    <h3 className="text-sm font-bold text-[#171b29]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                  <time className="text-[10px] text-slate-400">
                    {item.timestamp}
                  </time>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 grid min-h-64 place-items-center border-y border-slate-200 text-center">
              <div>
                <Bell className="mx-auto text-[#ef766f]" />
                <h3 className="mt-4 text-lg font-bold text-[#171b29]">
                  You are all caught up.
                </h3>
                <p className="mt-2 text-xs text-slate-500">
                  New account activity will appear here.
                </p>
              </div>
            </div>
          )}
        </section>
        <aside className="rounded-[28px] bg-[#171b29] p-7 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#f49a91]">
            Preferences
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-[-.035em]">
            Choose your signal.
          </h2>
          <p className="mt-2 text-xs leading-5 text-white/50">
            Security alerts remain recommended. Channel delivery activates with
            the notification service.
          </p>
          <div className="mt-7 divide-y divide-white/10">
            {(
              [
                ["security", "Security alerts"],
                ["transactions", "Money movement"],
                ["product", "Product updates"],
                ["email", "Email delivery"],
                ["push", "Push notifications"],
              ] as [keyof typeof prefs, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggle(key)}
                className="flex w-full items-center justify-between py-4 text-left text-xs font-bold"
              >
                <span>{label}</span>
                <span
                  className={`relative h-6 w-11 rounded-full transition ${prefs[key] ? "bg-[#ef766f]" : "bg-white/15"}`}
                >
                  <i
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${prefs[key] ? "left-6" : "left-1"}`}
                  />
                </span>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};
