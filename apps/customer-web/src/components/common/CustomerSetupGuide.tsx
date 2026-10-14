"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  X,
  Lock,
} from "lucide-react";

export interface SetupStep {
  id: string;
  title: string;
  completed: boolean;
  actionText?: string;
  actionRoute?: string;
}

export interface SetupSection {
  id: string;
  title: string;
  locked?: boolean;
  steps: SetupStep[];
}

export interface CustomerSetupGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onStepClick?: (step: SetupStep) => void;
}

export const CustomerSetupGuide: React.FC<CustomerSetupGuideProps> = ({
  isOpen,
  onClose,
  onStepClick,
}) => {
  const [sections, setSections] = useState<SetupSection[]>([
    {
      id: "profile-setup",
      title: "Complete your profile",
      locked: false,
      steps: [
        {
          id: "step-verify-phone",
          title: "Verify your phone number",
          completed: true,
          actionText: "View profile",
          actionRoute: "profile-kyc",
        },
        {
          id: "step-upload-kyc",
          title: "Upload KYC identity documents",
          completed: true,
          actionText: "View documents",
          actionRoute: "profile-kyc",
        },
        {
          id: "step-setup-mfa",
          title: "Set a transfer PIN or enable MFA",
          completed: false,
          actionText: "Configure security",
          actionRoute: "security",
        },
      ],
    },
    {
      id: "first-beneficiary",
      title: "Add your first beneficiary",
      locked: false,
      steps: [
        {
          id: "step-add-beneficiary",
          title: "Register a recipient (mobile money or bank)",
          completed: false,
          actionText: "Add beneficiary",
          actionRoute: "beneficiaries",
        },
      ],
    },
    {
      id: "first-transfer",
      title: "Make your first transfer",
      locked: true,
      steps: [
        {
          id: "step-buy-xaf",
          title: "Convert foreign currency into XAF",
          completed: false,
          actionText: "Buy XAF",
          actionRoute: "buy-xaf",
        },
        {
          id: "step-send-money",
          title: "Send XAF to a beneficiary",
          completed: false,
          actionText: "Send money",
          actionRoute: "send-withdraw",
        },
      ],
    },
  ]);

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    "profile-setup": true,
    "first-beneficiary": false,
    "first-transfer": false,
  });

  if (!isOpen) return null;

  const allSteps = sections.flatMap((s) => s.steps);
  const completedCount = allSteps.filter((s) => s.completed).length;
  const totalCount = allSteps.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const toggleStep = (stepId: string) => {
    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        steps: section.steps.map((step) =>
          step.id === stepId ? { ...step, completed: !step.completed } : step,
        ),
      })),
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-slate-950/40 backdrop-blur-[1px] animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] mt-16 mr-2 animate-in slide-in-from-right-5 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Setup guide
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close setup guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-500">
                {completedCount} of {totalCount} complete
              </span>
              <span className="font-bold text-[#001f5b]">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#001f5b] h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sections.map((section) => {
            const isExpanded = !!expandedSections[section.id];
            const sectionCompletedCount = section.steps.filter(
              (s) => s.completed,
            ).length;
            const sectionTotal = section.steps.length;
            const allSectionComplete = sectionCompletedCount === sectionTotal;

            return (
              <div
                key={section.id}
                className="border border-slate-200 rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => !section.locked && toggleSection(section.id)}
                  className={`w-full text-left p-3.5 flex items-center justify-between transition-colors ${
                    section.locked
                      ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                      : "bg-white hover:bg-slate-50 cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {section.locked ? (
                      <Lock className="w-4 h-4 text-slate-300" />
                    ) : allSectionComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-[#00c2c7]" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300" />
                    )}
                    <span
                      className={`text-xs font-semibold ${section.locked ? "text-slate-400" : "text-slate-800"}`}
                    >
                      {section.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">
                      {sectionCompletedCount}/{sectionTotal}
                    </span>
                    {!section.locked &&
                      (isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      ))}
                  </div>
                </button>

                {isExpanded && !section.locked && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-3 space-y-2">
                    {section.steps.map((step) => (
                      <div
                        key={step.id}
                        className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => toggleStep(step.id)}
                            className="shrink-0"
                          >
                            {step.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-[#00c2c7]" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                            )}
                          </button>
                          <span
                            className={`text-xs ${step.completed ? "text-slate-400 line-through" : "text-slate-700 font-medium"}`}
                          >
                            {step.title}
                          </span>
                        </div>
                        {step.actionText && onStepClick && !step.completed && (
                          <button
                            type="button"
                            onClick={() => onStepClick(step)}
                            className="text-[11px] text-[#001f5b] font-semibold hover:underline cursor-pointer shrink-0"
                          >
                            {step.actionText}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
