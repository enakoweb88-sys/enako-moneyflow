import React from 'react'
import { ArrowRight, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface ModuleIntroProps {
  moduleName: string
  badgeLabel?: string
  headline: string
  description: string
  policyNote?: string
  primaryActionLabel?: string
  onPrimaryAction?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
  features: {
    title: string
    description: string
  }[]
}

export const ModuleIntro: React.FC<ModuleIntroProps> = ({
  moduleName,
  badgeLabel,
  headline,
  description,
  policyNote,
  primaryActionLabel = 'Get started',
  onPrimaryAction,
  secondaryActionLabel = 'View documentation',
  onSecondaryAction,
  features,
}) => {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-10 animate-in fade-in duration-200">
      {/* Header Block */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
          <span className="w-1.5 h-1.5 rounded-full bg-[#001f5b]" />
          <span>{badgeLabel || moduleName}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {headline}
        </h1>

        <p className="text-base text-slate-600 leading-relaxed">{description}</p>

        {policyNote && (
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 font-medium">
            {policyNote}
          </div>
        )}

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Button
            variant="default"
            size="default"
            onClick={onPrimaryAction}
            className="bg-[#001f5b] hover:bg-[#001744] text-white flex items-center space-x-2"
          >
            <span>{primaryActionLabel}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          <Button
            variant="outline"
            size="default"
            onClick={onSecondaryAction}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
          >
            <BookOpen className="w-4 h-4 mr-1 text-slate-500" />
            <span>{secondaryActionLabel}</span>
          </Button>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200">
        {features.map((feat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors space-y-2"
          >
            <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-xs font-mono font-bold text-slate-700 border border-slate-200">
              0{idx + 1}
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">{feat.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
