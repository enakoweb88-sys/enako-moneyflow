"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ModuleIntroProps {
  moduleName: string;
  badgeLabel?: string;
  headline: string;
  description: string;
  policyNote?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  features: {
    title: string;
    description: string;
  }[];
}

export const ModuleIntro: React.FC<ModuleIntroProps> = ({
  moduleName,
  badgeLabel,
  headline,
  description,
  policyNote,
  primaryActionLabel = "Get started",
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  features,
}) => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-10 animate-in fade-in duration-200">
      {/* Module Name Chip */}
      <div className="flex items-center space-x-2">
        <span className="text-xs font-bold text-[#001f5b] bg-[#001f5b]/10 border border-[#001f5b]/20 px-3 py-1 rounded-full uppercase tracking-wider">
          {moduleName}
        </span>
        {badgeLabel && (
          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            {badgeLabel}
          </span>
        )}
      </div>

      {/* Headline & Description */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {headline}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          {description}
        </p>
        {policyNote && (
          <p className="text-xs text-slate-500 italic border-l-2 border-slate-200 pl-3">
            {policyNote}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        {onPrimaryAction && (
          <Button variant="default" size="default" onClick={onPrimaryAction}>
            <span>{primaryActionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="outline" size="default" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>

      {/* Feature Cards */}
      {features.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-2xs hover:border-slate-300 transition-colors"
            >
              <h3 className="text-sm font-bold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
