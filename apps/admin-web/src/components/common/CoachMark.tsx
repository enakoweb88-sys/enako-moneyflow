import React from 'react'
import { Sparkles, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface CoachMarkProps {
  isOpen: boolean
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  onDismiss: () => void
  stepIndicator?: string
}

export const CoachMark: React.FC<CoachMarkProps> = ({
  isOpen,
  title,
  description,
  actionLabel = 'Got it',
  onAction,
  onDismiss,
  stepIndicator = 'Next step',
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-2xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Dismiss spotlight"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-[#00c2c7]/10 text-[#001f5b] border border-[#00c2c7]/30">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono font-bold text-[#001f5b] uppercase tracking-wider">
            {stepIndicator}
          </span>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{description}</p>
        </div>

        <div className="pt-2 flex items-center justify-end space-x-3">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              if (onAction) onAction()
              onDismiss()
            }}
            className="bg-[#001f5b] hover:bg-[#001744] text-white flex items-center space-x-1"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
