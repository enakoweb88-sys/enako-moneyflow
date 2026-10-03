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
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Modal } from "../ui/modal";
import { PageHeader } from "../ui/page-header";
import { useCustomer } from "../../mock/CustomerContext";
import { toast } from "sonner";

export const SecurityPage: React.FC = () => {
  const {
    user,
    toggleMfa,
    sessions,
    terminateSession,
    terminateAllOtherSessions,
  } = useCustomer();

  // Change password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    toast.success("Password changed successfully.");
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security & Authentication"
        subtitle="Manage your credentials, two-factor authentication, and active device sessions."
      />

      {/* Password Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Account Password</CardTitle>
              <CardDescription>
                Regularly update your password to maintain the highest level of
                account protection.
              </CardDescription>
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                setPasswordError("");
                setShowPasswordModal(true);
              }}
            >
              Change password
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-slate-500">
            Last changed: 32 days ago. Strong passphrase recommended (minimum 8
            characters, numbers, and symbols).
          </div>
        </CardContent>
      </Card>

      {/* Multi-Factor Authentication */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Multi-Factor Authentication (MFA)</CardTitle>
              <CardDescription>
                Require a six-digit verification code when logging in or
                authorizing high-value disbursements.
              </CardDescription>
            </div>
            <Button
              variant={user.mfaEnabled ? "secondary" : "default"}
              onClick={toggleMfa}
            >
              {user.mfaEnabled ? "Disable MFA" : "Enable MFA"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Current status:</span>
            <Badge variant={user.mfaEnabled ? "success" : "neutral"}>
              {user.mfaEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {user.mfaEnabled
              ? "Verification codes are sent to your registered phone number (+237 670 000 111) for all critical actions."
              : "Multi-factor authentication is currently inactive. We strongly recommend enabling it for enhanced security."}
          </p>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Devices and browsers that are currently authenticated to your
                account.
              </CardDescription>
            </div>
            {otherSessionsCount > 0 && (
              <Button variant="secondary" onClick={terminateAllOtherSessions}>
                Log out of all other sessions
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      {session.device}
                    </span>
                    {session.isCurrent && (
                      <Badge variant="success">Current session</Badge>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 flex flex-wrap gap-x-3">
                    <span>Location: {session.location}</span>
                    <span>Last active: {session.lastActive}</span>
                  </div>
                </div>

                <div>
                  {session.isCurrent ? (
                    <span className="text-xs text-slate-400 font-medium">
                      In use
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => terminateSession(session.id)}
                      className="text-xs text-red-600 font-medium hover:underline hover:text-red-700"
                    >
                      Log out
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change account password"
        subtitle="Enter your current password followed by your new password twice."
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {passwordError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              {passwordError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Current password
            </label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              New password
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Confirm new password
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Update password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
