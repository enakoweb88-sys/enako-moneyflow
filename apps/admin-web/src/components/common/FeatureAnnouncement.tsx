import React from 'react'
import { X, Sparkles, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface FeatureAnnouncementProps {
  isOpen: boolean
  onClose: () => void
  headline: string
  tagline?: string
  paragraphs: string[]
  primaryButtonLabel?: string
  onPrimaryClick?: () => void
  secondaryLinkLabel?: string
  onSecondaryClick?: () => void
  previewCardTitle?: string
  previewBadge?: string
  previewDetails: { label: string; value: string }[]
}

export const FeatureAnnouncement: React.FC<FeatureAnnouncementProps> = ({
  isOpen,
  onClose,
  headline,
  tagline = 'New Feature',
  paragraphs,
  primaryButtonLabel = 'Got it',
  onPrimaryClick,
  secondaryLinkLabel = 'Learn more in documentation',
  onSecondaryClick,
  previewCardTitle = 'Automated Reconciliation Matrix',
  previewBadge = 'v2.4 Live',
  previewDetails,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12 animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Editorial & Actions */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#00c2c7]/10 border border-[#00c2c7]/30 text-xs font-semibold text-[#001f5b]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{tagline}</span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {headline}
            </h2>

            <div className="space-y-2.5 text-sm text-slate-600 leading-relaxed">
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center space-x-4">
            <Button
              variant="default"
              size="default"
              onClick={() => {
                if (onPrimaryClick) onPrimaryClick()
                onClose()
              }}
              className="bg-[#001f5b] hover:bg-[#001744] text-white"
            >
              {primaryButtonLabel}
            </Button>

            <button
              type="button"
              onClick={onSecondaryClick}
              className="text-xs font-semibold text-slate-700 hover:text-slate-950 underline underline-offset-4 flex items-center space-x-1 cursor-pointer"
            >
              <span>{secondaryLinkLabel}</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>

        {/* Right Side: Stylized Preview Card on Gradient Background */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#001f5b] to-[#0a192f] p-6 sm:p-8 flex items-center justify-center relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#00c2c7]/100/20 filter blur-2xl pointer-events-none" />

          <div className="w-full bg-white/95 backdrop-blur-md rounded-xl p-5 shadow-xl border border-white/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 truncate">{previewCardTitle}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00c2c7]/15 text-[#001f5b]">
                {previewBadge}
              </span>
            </div>

            <div className="space-y-2.5">
              {previewDetails.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="font-mono font-semibold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-[#001f5b]">
              <span>LEDGER SYNCED</span>
              <span>ZERO DELAY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
