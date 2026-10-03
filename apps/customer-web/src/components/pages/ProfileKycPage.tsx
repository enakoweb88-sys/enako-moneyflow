"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useCustomer } from "@/mock/CustomerContext";

export const ProfileKycPage: React.FC = () => {
  const { user, documents, uploadDocument, updateProfile } = useCustomer();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editAddress, setEditAddress] = useState(user.address);

  const [uploadedDocName, setUploadedDocName] = useState("");
  const [docType, setDocType] = useState("Proof of Residence");

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(editName, editPhone, editAddress);
    setIsEditProfileOpen(false);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedDocName.trim()) return;
    uploadDocument(uploadedDocName.trim(), docType);
    setUploadedDocName("");
  };

  const getKycBadgeVariant = (status: typeof user.kycStatus) => {
    switch (status) {
      case "Verified":
        return "success";
      case "Pending":
      case "More info needed":
        return "warning";
      case "Not started":
      default:
        return "neutral";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Profile & Compliance Verification (KYC)"
        subtitle="Manage personal identification details, compliance tier limits, and regulatory dossier uploads"
      />

      {/* Profile Section */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">
                Customer Account Profile
              </CardTitle>
              <CardDescription className="text-xs">
                Verified legal identity registered with E-NAKO Financial
                Clearing
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditProfileOpen(true)}
            >
              Edit Details
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-semibold block uppercase">
                Legal Name
              </span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                {user.name}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-semibold block uppercase">
                Registered Email
              </span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block font-mono">
                {user.email}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-semibold block uppercase">
                Verified Telephone
              </span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block font-mono">
                {user.phone}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-semibold block uppercase">
                National ID Number
              </span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block font-mono">
                {user.nationalIdMasked}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 sm:col-span-2">
              <span className="text-slate-500 font-semibold block uppercase">
                Residential Address
              </span>
              <span className="text-sm font-medium text-slate-900 mt-0.5 block">
                {user.address}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KYC Section */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <CardTitle className="text-base">KYC Compliance Tier</CardTitle>
                <Badge variant={getKycBadgeVariant(user.kycStatus)}>
                  {user.kycStatus}
                </Badge>
                <Badge variant="info">{user.kycTier}</Badge>
              </div>
              <CardDescription className="text-xs mt-1">
                {user.kycStatus === "Verified"
                  ? "Your account is fully verified. Maximum daily turnover is 25,000,000 XAF."
                  : "Your account verification is currently under review by compliance officers."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Reviewer Note if information requested */}
          {user.kycStatus === "More info needed" && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-900 font-sans">
              <span className="font-bold uppercase tracking-wider block text-xs mb-1">
                Compliance Reviewer Note:
              </span>
              Please provide a recent utility bill dated within the last 90 days
              showing your exact residential address.
            </div>
          )}

          {/* Uploaded Documents List */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Dossier Verification Documents ({documents.length})
            </span>

            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-slate-900 block">
                      {doc.name}
                    </span>
                    <span className="text-slate-500 font-sans">
                      {doc.type} • Uploaded {doc.uploadedAt}
                    </span>
                  </div>
                  <Badge
                    variant={doc.status === "Verified" ? "success" : "warning"}
                  >
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Document Upload Area (Drop-zone pattern matching Buy XAF Step 3) */}
          <form
            onSubmit={handleUploadSubmit}
            className="space-y-4 pt-2 border-t border-slate-100 text-xs font-sans"
          >
            <span className="font-bold text-slate-900 uppercase tracking-wider block">
              Upload Additional Verification Document
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Document Category
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md font-sans text-slate-800"
                >
                  <option value="National ID Card">
                    National ID Card (CNI)
                  </option>
                  <option value="Passport Biometric Page">
                    Passport Biometric Page
                  </option>
                  <option value="Proof of Residence">
                    Proof of Address / ENEO Bill
                  </option>
                  <option value="Tax Notice / Proof of Wealth">
                    Tax Notice / Proof of Income
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Document File Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g. proof_of_address_douala.pdf"
                  value={uploadedDocName}
                  onChange={(e) => setUploadedDocName(e.target.value)}
                  className="w-full text-xs font-mono"
                />
              </div>
            </div>

            <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
              <span className="font-bold text-slate-800 text-xs block">
                Drag a file here or specify the file name above
              </span>
              <span className="text-slate-500 text-xs mt-0.5 block">
                Official documents up to 10MB (PDF, PNG, JPG)
              </span>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                variant="default"
                size="sm"
                type="submit"
                disabled={!uploadedDocName.trim()}
              >
                Upload Document
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <Modal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          title="Edit Profile Information"
          subtitle="Update your contact telephone and residential address."
          maxWidth="md"
        >
          <form
            onSubmit={handleProfileSubmit}
            className="space-y-4 text-xs font-sans"
          >
            <div>
              <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                Full Name
              </label>
              <Input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                Telephone Number
              </label>
              <Input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                Residential Address
              </label>
              <Input
                type="text"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="w-full text-xs"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="default" size="sm" type="submit">
                Save Profile
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
