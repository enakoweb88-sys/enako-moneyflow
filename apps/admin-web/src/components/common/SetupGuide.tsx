import React, { useState } from 'react'
import { CheckCircle2, Circle, ChevronDown, ChevronRight, X, Lock } from 'lucide-react'

export interface SetupStep {
  id: string
  title: string
  completed: boolean
  actionText?: string
  actionRoute?: string
}

export interface SetupSection {
  id: string
  title: string
  locked?: boolean
  steps: SetupStep[]
}

export interface SetupGuideProps {
  isOpen: boolean
  onClose: () => void
  onStepClick?: (step: SetupStep) => void
}

export const SetupGuide: React.FC<SetupGuideProps> = ({ isOpen, onClose, onStepClick }) => {
  const [sections, setSections] = useState<SetupSection[]>([
    {
      id: 'ledger-setup',
      title: 'Set up ledger & accounts',
      locked: false,
      steps: [
        {
          id: 'step-chart-of-accounts',
          title: 'Import chart of accounts',
          completed: true,
          actionText: 'View ledger structure',
          actionRoute: 'wallets-ledger',
        },
        {
          id: 'step-test-wallet',
          title: 'Create a test clearing wallet',
          completed: true,
          actionText: 'Inspect balances',
          actionRoute: 'balances',
        },
        {
          id: 'step-approval-workflow',
          title: 'Explore your dual-approval workflow',
          completed: false,
          actionText: 'Test maker-checker rule',
          actionRoute: 'approvals',
        },
      ],
    },
    {
      id: 'org-verification',
      title: 'Verify your organization',
      locked: false,
      steps: [
        {
          id: 'step-corporate-docs',
          title: 'Submit COBAC registration & business licenses',
          completed: false,
          actionText: 'Upload documents',
          actionRoute: 'administration',
        },
        {
          id: 'step-compliance-officer',
          title: 'Designate primary compliance officer',
          completed: false,
          actionText: 'Assign AML role',
          actionRoute: 'administration',
        },
      ],
    },
    {
      id: 'go-live',
      title: 'Activate production clearing rails',
      locked: true,
      steps: [
        {
          id: 'step-live-keys',
          title: 'Request live API credentials & webhook endpoints',
          completed: false,
          actionText: 'Generate live keys',
          actionRoute: 'developers',
        },
        {
          id: 'step-bank-liquidity',
          title: 'Link commercial settlement accounts',
          completed: false,
          actionText: 'Add clearing bank',
          actionRoute: 'balances',
        },
      ],
    },
  ])

  const [expandedSection, setExpandedSection] = useState<string>('ledger-setup')

  if (!isOpen) return null

  // Calculate overall progress
  const allSteps = sections.flatMap((s) => s.steps)
  const completedSteps = allSteps.filter((s) => s.completed).length
  const totalSteps = allSteps.length
  const progressPercent = Math.round((completedSteps / totalSteps) * 100)

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? '' : sectionId)
  }

  const toggleStepCompleted = (stepId: string) => {
    setSections((prev) =>
      prev.map((sec) => ({
        ...sec,
        steps: sec.steps.map((st) => (st.id === stepId ? { ...st, completed: !st.completed } : st)),
      }))
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-5 space-y-5 animate-in fade-in duration-150">
      {/* Top Title & Progress Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          {/* Progress Circular Pill */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg className="w-8 h-8 transform -rotate-90">
              <circle cx="16" cy="16" r="13" stroke="#e2e8f0" strokeWidth="2.5" fill="none" />
              <circle
                cx="16"
                cy="16"
                r="13"
                stroke="#001f5b"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray="81.68"
                strokeDashoffset={81.68 - (81.68 * progressPercent) / 100}
                className="transition-all duration-300"
              />
            </svg>
            <span className="absolute text-[10px] font-bold font-mono text-slate-800">
              {progressPercent}%
            </span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900">Setup guide</h3>
            <p className="text-xs text-slate-500 font-mono">
              {completedSteps} of {totalSteps} completed
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Dismiss setup guide"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-[#001f5b] h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist Sections */}
      <div className="space-y-3">
        {sections.map((section) => {
          const isExpanded = expandedSection === section.id
          const isLocked = section.locked
          const sectionCompleted = section.steps.every((st) => st.completed)

          return (
            <div
              key={section.id}
              className={`border rounded-xl transition-all ${
                isLocked
                  ? 'border-slate-100 bg-slate-50/50 opacity-60'
                  : isExpanded
                    ? 'border-slate-300 bg-white shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                disabled={isLocked}
                onClick={() => toggleSection(section.id)}
                className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-2.5">
                  {isLocked ? (
                    <Lock className="w-4 h-4 text-slate-400" />
                  ) : sectionCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-[#001f5b]" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      isLocked ? 'text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {section.title}
                  </span>
                </div>
                {!isLocked && (
                  <div>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                )}
              </button>

              {/* Sub-steps */}
              {isExpanded && !isLocked && (
                <div className="px-3.5 pb-3.5 pt-1 space-y-2 border-t border-slate-100">
                  {section.steps.map((step) => (
                    <div
                      key={step.id}
                      className="p-2.5 rounded-lg bg-slate-50/60 border border-slate-200/60 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors"
                    >
                      <div
                        className="flex items-center space-x-2.5 cursor-pointer flex-1"
                        onClick={() => toggleStepCompleted(step.id)}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-[#001f5b] shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 shrink-0 hover:text-slate-500" />
                        )}
                        <span
                          className={`${
                            step.completed
                              ? 'line-through text-slate-400 font-medium'
                              : 'text-slate-700 font-medium'
                          }`}
                        >
                          {step.title}
                        </span>
                      </div>

                      {step.actionText && (
                        <button
                          type="button"
                          onClick={() => onStepClick && onStepClick(step)}
                          className="ml-2 font-semibold text-[#001f5b] hover:text-[#001433] underline underline-offset-2 shrink-0 cursor-pointer"
                        >
                          {step.actionText}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
