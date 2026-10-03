"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { PageHeader } from "../ui/page-header";
import { EmptyState } from "../ui/empty-state";
import { useCustomer } from "../../mock/CustomerContext";

export const NotificationsPage: React.FC = () => {
  const { notifications, markAllNotificationsRead } = useCustomer();

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Operational notices, transaction updates, and security logs."
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Activity Feed</CardTitle>
              <CardDescription>
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
                  : "All notifications are caught up."}
              </CardDescription>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold underline text-left sm:text-right"
              >
                Mark all as read
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {notifications.length === 0 ? (
            <EmptyState
              title="No notifications"
              description="You do not have any notices at this moment. New account activity will appear here."
            />
          ) : (
            <div className="space-y-3">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`relative p-4 rounded border transition-colors ${
                    item.unread
                      ? "bg-emerald-50/30 border-slate-200 border-l-4 border-l-emerald-600"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                    <h3
                      className={`text-sm ${
                        item.unread
                          ? "font-bold text-slate-900"
                          : "font-medium text-slate-800"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
