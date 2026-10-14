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
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useCustomer } from "../../mock/CustomerContext";
import {
  Bell,
  CheckCheck,
  Shield,
  ArrowDownLeft,
  AlertCircle,
  Info,
} from "lucide-react";

export const NotificationsPage: React.FC = () => {
  const { notifications, markAllNotificationsRead } = useCustomer();

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Notifications & Advisory"
        subtitle="Treasury alerts, settlement clearing notifications, and security dispatches"
      />

      <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#001f5b] via-[#00c2c7] to-[#D4AF37]" />
        <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold text-slate-900">
                  Operational Log
                </CardTitle>
                {unreadCount > 0 && (
                  <Badge variant="warning" className="text-[10px] font-mono">
                    {unreadCount} Unread
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""} requiring attention.`
                  : "All operational notices have been acknowledged."}
              </CardDescription>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllNotificationsRead}
                className="text-xs text-[#001f5b] hover:bg-[#001f5b]/5 border-slate-200 rounded-xl font-semibold"
              >
                <CheckCheck className="w-3.5 h-3.5 mr-1 text-[#00c2c7]" /> Mark
                all as read
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
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
                  className={`relative p-4 rounded-xl border transition-all ${
                    item.unread
                      ? "bg-[#00c2c7]/5 border-slate-200 border-l-4 border-l-[#001f5b] shadow-2xs"
                      : "bg-white border-slate-200/80 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.unread ? "bg-[#00c2c7]" : "bg-slate-300"
                        }`}
                      />
                      <h3
                        className={`text-xs ${
                          item.unread
                            ? "font-bold text-slate-900"
                            : "font-medium text-slate-700"
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap pl-4 sm:pl-0">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-4">
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
