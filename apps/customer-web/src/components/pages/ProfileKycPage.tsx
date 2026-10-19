"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Check, ChevronRight, FileText, Upload } from "lucide-react";
import { toast } from "sonner";
import { CustomerAvatar } from "@/components/common/CustomerAvatar";
import { useCustomer } from "@/mock/CustomerContext";

type Tab = "profile" | "verification" | "documents" | "account";

export const ProfileKycPage: React.FC<{ initialTab?: Tab }> = ({
  initialTab = "profile",
}) => {
  const { user, documents, updateProfile, uploadDocument, setActiveNav } =
    useCustomer();
  const [tab, setTab] = useState<Tab>(initialTab);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [avatarId, setAvatarId] = useState(user.avatarId);
  const [saving, setSaving] = useState(false);
  const completion = useMemo(() => {
    const checks = [
      user.name,
      user.email,
      user.phone,
      user.address,
      user.kycStatus === "Verified",
      user.mfaEnabled,
    ];
    return Math.max(
      20,
      Math.round((checks.filter(Boolean).length / checks.length) * 100),
    );
  }, [user]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim())
      return toast.error("Enter the name you want shown on your account.");
    setSaving(true);
    try {
      await updateProfile(name.trim(), phone.trim(), address.trim(), avatarId);
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "We could not update your profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-16">
      <section className="border-b border-slate-200 pb-8 pt-2">
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-5">
            <CustomerAvatar
              avatarId={avatarId}
              label={`${name || "Customer"} avatar`}
              className="h-20 w-20 ring-4 ring-[#f3d7d1] shadow-lg sm:h-24 sm:w-24"
            />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#bd5d59]">
                Your account
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-[-.04em] text-[#171b29] sm:text-4xl">
                {user.name || "Complete your profile"}
              </h1>
              <p className="mt-2 text-sm text-slate-500">{user.email}</p>
            </div>
          </div>
          <div className="min-w-[230px] border-l-2 border-[#ef766f] pl-5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Account readiness</span>
              <strong className="text-[#171b29]">{completion}%</strong>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[#ef766f]"
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              Profile, identity and security combined
            </p>
          </div>
        </div>
      </section>

      <nav className="flex gap-1 overflow-x-auto border-b border-slate-200">
        {(
          [
            ["profile", "Personal profile"],
            ["verification", "Verification"],
            ["documents", "Documents"],
            ["account", "Account controls"],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-xs font-bold transition ${tab === id ? "border-[#ef766f] text-[#171b29]" : "border-transparent text-slate-400 hover:text-slate-700"}`}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "profile" && (
        <div className="grid gap-7 lg:grid-cols-[.72fr_1.28fr]">
          <section className="rounded-[28px] bg-[#f7f4f1] p-6 sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#bd5d59]">
              Choose your avatar
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-.035em] text-[#171b29]">
              Make the space yours.
            </h2>
            <div className="mt-7 grid grid-cols-4 gap-3">
              {Array.from({ length: 12 }, (_, id) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => setAvatarId(id)}
                  className={`rounded-full p-1 transition ${avatarId === id ? "bg-[#ef766f] shadow-md" : "bg-white hover:-translate-y-0.5"}`}
                >
                  <CustomerAvatar
                    avatarId={id}
                    className="aspect-square w-full"
                  />
                </button>
              ))}
            </div>
            <p className="mt-6 text-xs leading-5 text-slate-500">
              Your avatar and chosen name appear in the sidebar and account
              areas.
            </p>
          </section>
          <form
            onSubmit={save}
            className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(23,27,41,.05)] sm:p-8"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#bd5d59]">
                Personal details
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-[-.035em] text-[#171b29]">
                How we identify and reach you.
              </h2>
            </div>
            <label className="block text-xs font-bold text-slate-600">
              Full name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-[#fbfaf9] px-4 py-3.5 text-sm outline-none focus:border-[#ef766f]"
              />
            </label>
            <label className="block text-xs font-bold text-slate-600">
              Email address
              <input
                value={user.email}
                readOnly
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-500"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-bold text-slate-600">
                Phone number
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-[#fbfaf9] px-4 py-3.5 text-sm outline-none focus:border-[#ef766f]"
                />
              </label>
              <label className="block text-xs font-bold text-slate-600">
                Home address
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-[#fbfaf9] px-4 py-3.5 text-sm outline-none focus:border-[#ef766f]"
                />
              </label>
            </div>
            <button
              disabled={saving}
              className="rounded-xl bg-[#ef766f] px-6 py-3.5 text-xs font-bold text-white transition hover:bg-[#df6862] disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save profile"}
            </button>
          </form>
        </div>
      )}

      <div className={tab === "verification" ? "block" : "hidden"}>
        <VerificationFlow
          user={user}
          onOpenSecurity={() => setActiveNav("security")}
          onSubmit={uploadDocument}
          address={address}
          onSaveIdentity={async (legalName, nextPhone) => {
            await updateProfile(
              legalName.trim(),
              nextPhone.trim(),
              address.trim(),
              avatarId,
            );
            setName(legalName.trim());
            setPhone(nextPhone.trim());
          }}
          onSaveAddress={async (nextAddress) => {
            await updateProfile(
              name.trim(),
              phone.trim(),
              nextAddress.trim(),
              avatarId,
            );
            setAddress(nextAddress.trim());
          }}
        />
      </div>

      {tab === "documents" && (
        <section>
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#bd5d59]">
                Verification records
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-.04em] text-[#171b29]">
                Your submitted documents.
              </h2>
              <p className="mt-3 max-w-2xl text-xs leading-6 text-slate-500">
                This is a read-only history of files accepted by the secure
                verification service. Start or continue an application from the
                Verification tab.
              </p>
            </div>
            <button
              onClick={() => setTab("verification")}
              className="text-xs font-bold text-[#bd5d59]"
            >
              Open verification
            </button>
          </div>
          <div className="mt-7">
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#bd5d59]">
              Document history
            </p>
            {documents.length ? (
              <div className="mt-4 border-t border-slate-200">
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center gap-4 border-b border-slate-200 py-5"
                  >
                    <FileText className="text-slate-400" />
                    <div className="flex-1">
                      <strong className="text-sm text-[#171b29]">
                        {document.name}
                      </strong>
                      <p className="mt-1 text-xs text-slate-500">
                        {document.type} · {document.uploadedAt}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#bd5d59]">
                      {document.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 border-y border-slate-200 py-12">
                <p className="text-lg font-bold text-[#171b29]">
                  No documents submitted yet.
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Documents accepted by the verification service will appear
                  here.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {tab === "account" && (
        <section>
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#bd5d59]">
            Account controls
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-.04em] text-[#171b29]">
            Everything connected to your account.
          </h2>
          <div className="mt-7 border-t border-slate-200">
            {[
              [
                "Security and active sessions",
                "Manage MFA, recovery and connected devices",
                "security",
              ],
              [
                "Notification preferences",
                "Choose which account events reach you",
                "notifications",
              ],
              [
                "Help and account requests",
                "Contact support or request an account change",
                "support",
              ],
            ].map(([title, copy, nav]) => (
              <button
                key={nav}
                onClick={() => setActiveNav(nav)}
                className="grid w-full grid-cols-[1fr_auto] items-center border-b border-slate-200 py-6 text-left transition hover:px-2"
              >
                <span>
                  <strong className="text-sm text-[#171b29]">{title}</strong>
                  <small className="mt-1 block text-xs text-slate-500">
                    {copy}
                  </small>
                </span>
                <ChevronRight size={18} className="text-[#ef766f]" />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

type VerificationUser = ReturnType<typeof useCustomer>["user"];
type VerificationDraft = {
  step: number;
  documentType: string;
  country: string;
  documentNumber: string;
  front: File | null;
  back: File | null;
  selfie: File | null;
  addressProof: File | null;
  consent: boolean;
  address: string;
  legalName: string;
  phone: string;
};
let verificationDraft: VerificationDraft | null = null;
const loadSavedVerificationDraft = (): VerificationDraft | null => {
  if (typeof window === "undefined") return null;
  try {
    const saved = JSON.parse(
      window.localStorage.getItem("moneyflow-verification-draft") || "null",
    ) as Partial<VerificationDraft> | null;
    if (!saved) return null;
    return {
      step: Math.min(Number(saved.step) || 0, 2),
      documentType: saved.documentType || "National identity card",
      country: saved.country || "Cameroon",
      documentNumber: saved.documentNumber || "",
      front: null,
      back: null,
      selfie: null,
      addressProof: null,
      consent: false,
      address: saved.address || "",
      legalName: saved.legalName || "",
      phone: saved.phone || "",
    };
  } catch {
    return null;
  }
};

function VerificationFlow({
  user,
  onOpenSecurity,
  onSubmit,
  address,
  onSaveAddress,
  onSaveIdentity,
}: {
  user: VerificationUser;
  onOpenSecurity: () => void;
  onSubmit: (name: string, type: string) => void;
  address: string;
  onSaveAddress: (address: string) => Promise<void>;
  onSaveIdentity: (legalName: string, phone: string) => Promise<void>;
}) {
  const initialDraft = verificationDraft;
  const [step, setStep] = useState(initialDraft?.step ?? 0);
  const [documentType, setDocumentType] = useState(
    initialDraft?.documentType ?? "National identity card",
  );
  const [country, setCountry] = useState(initialDraft?.country ?? "Cameroon");
  const [documentNumber, setDocumentNumber] = useState(
    initialDraft?.documentNumber ?? "",
  );
  const [front, setFront] = useState<File | null>(initialDraft?.front ?? null);
  const [back, setBack] = useState<File | null>(initialDraft?.back ?? null);
  const [selfie, setSelfie] = useState<File | null>(
    initialDraft?.selfie ?? null,
  );
  const [addressProof, setAddressProof] = useState<File | null>(
    initialDraft?.addressProof ?? null,
  );
  const [consent, setConsent] = useState(initialDraft?.consent ?? false);
  const [verificationAddress, setVerificationAddress] = useState(
    initialDraft?.address || address,
  );
  const [legalName, setLegalName] = useState(
    initialDraft?.legalName || user.name,
  );
  const [verificationPhone, setVerificationPhone] = useState(
    initialDraft?.phone || user.phone,
  );
  const [savingIdentity, setSavingIdentity] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  useEffect(() => {
    if (verificationDraft) {
      // The module cache already contains the hydrated draft.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDraftLoaded(true);
      return;
    }
    const saved = loadSavedVerificationDraft();
    if (saved) {
      setStep(saved.step);
      setDocumentType(saved.documentType);
      setCountry(saved.country);
      setDocumentNumber(saved.documentNumber);
      setVerificationAddress(saved.address || address);
      setLegalName(saved.legalName || user.name);
      setVerificationPhone(saved.phone || user.phone);
    }
    setDraftLoaded(true);
  }, [address, user.name, user.phone]);
  useEffect(() => {
    if (!draftLoaded) return;
    verificationDraft = {
      step,
      documentType,
      country,
      documentNumber,
      front,
      back,
      selfie,
      addressProof,
      consent,
      address: verificationAddress,
      legalName,
      phone: verificationPhone,
    };
    window.localStorage.setItem(
      "moneyflow-verification-draft",
      JSON.stringify({
        step,
        documentType,
        country,
        documentNumber,
        address: verificationAddress,
        legalName,
        phone: verificationPhone,
      }),
    );
  }, [
    step,
    documentType,
    country,
    documentNumber,
    front,
    back,
    selfie,
    addressProof,
    consent,
    verificationAddress,
    legalName,
    verificationPhone,
    draftLoaded,
  ]);
  const steps = [
    "Your details",
    "Identity document",
    "Document images",
    "Face check",
    "Address",
    "Review",
  ];
  const needsBack = documentType !== "Passport";
  const valid = [
    Boolean(legalName.trim() && user.email && verificationPhone.trim()),
    Boolean(documentType && country && documentNumber.trim()),
    Boolean(front && (!needsBack || back)),
    Boolean(selfie),
    Boolean(verificationAddress.trim() && addressProof),
    consent,
  ][step];
  const next = async () => {
    if (!valid)
      return toast.error(
        "Complete the required information before continuing.",
      );
    if (
      step === 0 &&
      (legalName.trim() !== user.name ||
        verificationPhone.trim() !== user.phone)
    ) {
      setSavingIdentity(true);
      try {
        await onSaveIdentity(legalName, verificationPhone);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "We could not save your identity details.",
        );
        return;
      } finally {
        setSavingIdentity(false);
      }
    }
    if (step === 4 && verificationAddress.trim() !== address) {
      setSavingAddress(true);
      try {
        await onSaveAddress(verificationAddress);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "We could not save your address.",
        );
        return;
      } finally {
        setSavingAddress(false);
      }
    }
    setStep((current) => Math.min(5, current + 1));
  };
  const submit = () => {
    if (!consent || !front || !selfie || !addressProof)
      return toast.error(
        "Review the application and attach every required file.",
      );
    onSubmit(front.name, documentType);
  };
  return (
    <section>
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#bd5d59]">
            Identity verification · {user.kycStatus}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-.04em] text-[#171b29]">
            Verify your identity step by step.
          </h2>
          <p className="mt-3 max-w-2xl text-xs leading-6 text-slate-500">
            Prepare one valid government identity document, a clear selfie and
            recent proof of address. You can review everything before
            submission.
          </p>
        </div>
        <span className="text-xs font-bold text-[#bd5d59]">
          Step {step + 1} of {steps.length}
        </span>
      </div>
      <div className="mt-7 grid gap-8 lg:grid-cols-[230px_1fr]">
        <aside>
          <div className="space-y-1">
            {steps.map((label, index) => (
              <button
                key={label}
                onClick={() => index <= step && setStep(index)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-bold ${index === step ? "bg-[#f7ece6] text-[#8f4546]" : index < step ? "text-[#39756d]" : "text-slate-400"}`}
              >
                <span
                  className={`grid h-7 w-7 place-items-center rounded-full ${index < step ? "bg-[#dceee9]" : "bg-white"}`}
                >
                  {index < step ? <Check size={13} /> : index + 1}
                </span>
                {label}
              </button>
            ))}
          </div>
          <div className="mt-6 border-t border-slate-200 pt-5 text-[11px] leading-5 text-slate-500">
            <strong className="text-[#171b29]">Before you begin</strong>
            <p className="mt-2">
              Use original, unexpired documents. Photograph every corner in good
              light. Do not edit screenshots or obscure information.
            </p>
          </div>
        </aside>
        <div className="min-h-[460px] rounded-[28px] bg-[#f7f4f1] p-6 sm:p-9">
          {step === 0 && (
            <div>
              <StepTitle
                number="01"
                title="Confirm your personal details"
                copy="The name and contact information on your account should belong to the person completing verification."
              />
              <Field label="Full legal name">
                <input
                  value={legalName}
                  onChange={(event) => setLegalName(event.target.value)}
                  autoComplete="name"
                  placeholder="First name, middle or third names, surname"
                  className="verify-input"
                />
              </Field>
              <p className="mt-2 text-[11px] leading-5 text-slate-500">
                Enter every name exactly as it appears on the identity document,
                including middle or third names.
              </p>
              <Field label="Email address">
                <input
                  value={user.email}
                  readOnly
                  className="verify-input bg-slate-50 text-slate-500"
                />
              </Field>
              <Field label="Phone number">
                <input
                  value={verificationPhone}
                  onChange={(event) => setVerificationPhone(event.target.value)}
                  autoComplete="tel"
                  placeholder="For example +237 6XX XXX XXX"
                  className="verify-input"
                />
              </Field>
            </div>
          )}
          {step === 1 && (
            <div>
              <StepTitle
                number="02"
                title="Choose your identity document"
                copy="Select the original government document you will photograph. It must be valid and show your full legal name and date of birth."
              />
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <Field label="Issuing country">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="verify-input"
                  >
                    <option>Cameroon</option>
                    <option>Other country</option>
                  </select>
                </Field>
                <Field label="Document type">
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="verify-input"
                  >
                    <option>National identity card</option>
                    <option>Passport</option>
                    <option>Residence permit</option>
                  </select>
                </Field>
              </div>
              <Field label="Document number">
                <input
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  placeholder="Enter it exactly as printed"
                  className="verify-input"
                />
              </Field>
              <div className="mt-6 border-l-2 border-[#ef766f] pl-4 text-xs leading-6 text-slate-600">
                <strong className="text-[#171b29]">Accepted documents</strong>
                <p>
                  National identity card: front and back. Passport: photo page.
                  Residence permit: front and back. The document must not be
                  expired.
                </p>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <StepTitle
                number="03"
                title="Upload clear document images"
                copy="Accepted formats: JPG, PNG or PDF. Each file should be clear, in colour and show all four corners."
              />
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <FileDrop
                  label={
                    documentType === "Passport"
                      ? "Passport photo page"
                      : "Front of document"
                  }
                  file={front}
                  onChange={setFront}
                />
                {needsBack && (
                  <FileDrop
                    label="Back of document"
                    file={back}
                    onChange={setBack}
                  />
                )}
              </div>
              <p className="mt-5 text-[11px] leading-5 text-slate-500">
                Avoid glare, blur, cropped edges, photocopies and screenshots.
                Details must be readable at full size.
              </p>
            </div>
          )}
          {step === 3 && (
            <div>
              <StepTitle
                number="04"
                title="Complete the face check"
                copy="Use a recent, unfiltered selfie. Your face should be fully visible so it can be compared with your identity document."
              />
              <FileDrop
                label="Selfie or liveness capture"
                file={selfie}
                onChange={setSelfie}
              />
              <div className="mt-5 grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
                <p>Face the camera directly</p>
                <p>Remove hats and dark glasses</p>
                <p>Use even natural light</p>
              </div>
            </div>
          )}
          {step === 4 && (
            <div>
              <StepTitle
                number="05"
                title="Confirm your residential address"
                copy="Enter your current address and provide one document issued within the last three months."
              />
              <Field label="Residential address">
                <textarea
                  rows={3}
                  value={verificationAddress}
                  onChange={(event) =>
                    setVerificationAddress(event.target.value)
                  }
                  placeholder="Street, neighbourhood, city and country"
                  className="verify-input resize-none"
                />
              </Field>
              <div className="mt-6">
                <FileDrop
                  label="Proof of address"
                  file={addressProof}
                  onChange={setAddressProof}
                />
              </div>
              <p className="mt-4 text-[11px] leading-5 text-slate-500">
                Accepted evidence: utility bill, bank statement, tax notice or
                official government correspondence showing your name, address
                and issue date.
              </p>
            </div>
          )}
          {step === 5 && (
            <div>
              <StepTitle
                number="06"
                title="Review and submit"
                copy="Confirm that the information belongs to you and that every image is accurate and readable."
              />
              <div className="mt-7 divide-y divide-slate-200 border-y border-slate-200">
                <ReviewRow
                  label="Identity"
                  value={`${documentType} · ${country}`}
                />
                <ReviewRow
                  label="Document images"
                  value={`${front?.name || "Missing"}${needsBack ? ` · ${back?.name || "back missing"}` : ""}`}
                />
                <ReviewRow
                  label="Face check"
                  value={selfie?.name || "Missing"}
                />
                <ReviewRow
                  label="Address evidence"
                  value={addressProof?.name || "Missing"}
                />
              </div>
              <label className="mt-6 flex items-start gap-3 text-xs leading-5 text-slate-600">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 accent-[#ef766f]"
                />
                <span>
                  I confirm these details are accurate, the documents belong to
                  me and I authorize their use for identity verification.
                </span>
              </label>
              <button
                onClick={submit}
                disabled={!consent}
                className="mt-6 rounded-xl bg-[#ef766f] px-6 py-3.5 text-xs font-bold text-white disabled:opacity-40"
              >
                Submit for verification
              </button>
              <button
                onClick={onOpenSecurity}
                className="ml-3 text-xs font-bold text-slate-500"
              >
                Review security
              </button>
            </div>
          )}
          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
            <button
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              disabled={step === 0}
              className="text-xs font-bold text-slate-500 disabled:opacity-30"
            >
              Back
            </button>
            {step < 5 && (
              <button
                onClick={() => void next()}
                disabled={savingAddress || savingIdentity}
                className="rounded-xl bg-[#171b29] px-6 py-3 text-xs font-bold text-white disabled:opacity-50"
              >
                {savingAddress
                  ? "Saving address…"
                  : savingIdentity
                    ? "Saving details…"
                    : "Next"}{" "}
                <ChevronRight className="ml-1 inline" size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepTitle({
  number,
  title,
  copy,
}: {
  number: string;
  title: string;
  copy: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#bd5d59]">
        {number}
      </p>
      <h3 className="mt-3 text-2xl font-bold tracking-[-.035em] text-[#171b29]">
        {title}
      </h3>
      <p className="mt-3 max-w-2xl text-xs leading-6 text-slate-500">{copy}</p>
    </div>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mt-4 block text-xs font-bold text-slate-600">
      {label}
      {children}
    </label>
  );
}
function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs text-slate-500">{label}</span>
      <strong className="text-sm text-[#171b29]">{value}</strong>
    </div>
  );
}
function FileDrop({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <label
      className={`block cursor-pointer rounded-2xl border border-dashed p-5 transition ${file ? "border-[#79a9a1] bg-[#edf7f5]" : "border-[#d8c7bf] bg-white hover:border-[#ef766f]"}`}
    >
      <input
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        className="sr-only"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
      <Upload
        size={18}
        className={file ? "text-[#39756d]" : "text-[#bd5d59]"}
      />
      <strong className="mt-4 block text-xs text-[#171b29]">{label}</strong>
      <span className="mt-2 block truncate text-[11px] text-slate-500">
        {file ? file.name : "Choose JPG, PNG or PDF"}
      </span>
    </label>
  );
}
