import React, { useState } from 'react'
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Building,
  Globe,
  Shield,
  Layers,
  Users,
  Sliders,
  DollarSign,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface OnboardingWizardProps {
  isOpen: boolean
  onComplete: () => void
  onClose: () => void
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  onComplete,
  onClose,
}) => {
  const [step, setStep] = useState<number>(1)

  // Step 2 selection
  const [setupMethod, setSetupMethod] = useState<'dashboard' | 'ai'>('dashboard')

  // Step 3 selections
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Configure FX rates',
    'Set up approval thresholds',
    'Connect MTN Mobile Money',
  ])

  // Step 4 fields
  const [website, setWebsite] = useState('')
  const [businessDescription, setBusinessDescription] = useState('')

  // Step 5 fields
  const [orgName, setOrgName] = useState('Enako Financial Services')
  const [country, setCountry] = useState('Cameroon (CEMAC)')
  const [cookieDismissed, setCookieDismissed] = useState(false)

  // Step 6 fields
  const [email, setEmail] = useState('admin@enako.com')
  const [fullName, setFullName] = useState('Platform Administrator')
  const [marketingOptIn, setMarketingOptIn] = useState(true)

  if (!isOpen) return null

  const GOALS_LIST = [
    { id: 'Configure FX rates', label: 'Configure FX rates', icon: DollarSign },
    { id: 'Set up approval thresholds', label: 'Set up approval thresholds', icon: Shield },
    { id: 'Connect MTN Mobile Money', label: 'Connect MTN Mobile Money', icon: Globe },
    { id: 'Connect Orange Money', label: 'Connect Orange Money', icon: Globe },
    { id: 'Invite team members', label: 'Invite team members', icon: Users },
    { id: 'Configure fee rules', label: 'Configure fee rules', icon: Sliders },
    { id: 'Set KYC levels', label: 'Set KYC compliance levels', icon: Shield },
    { id: 'Import chart of accounts', label: 'Import chart of accounts', icon: Layers },
  ]

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]))
  }

  const handleFinish = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('enako_admin_onboarding_done', 'true')
    }
    onComplete()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col min-h-[580px] max-h-[90vh]">
        {/* Top Header & Step Progress Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-[#001f5b] text-[#00c2c7] font-mono font-bold text-xs flex items-center justify-center">
              E
            </div>
            <span className="text-xs font-bold font-mono tracking-wider text-slate-700 uppercase">
              E-NAKO Setup Wizard • Step {step} of 6
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Progress line */}
            <div className="w-24 sm:w-36 bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#001f5b] h-full rounded-full transition-all duration-300"
                style={{ width: `${(step / 6) * 100}%` }}
              />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              title="Close wizard"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body based on Current Step */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col justify-center">
          {/* STEP 1: Get started with live clearing */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Get started with clearing operations
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Configure your financial workflows, automated mobile money payouts, and approval
                    matrices for institutional operations.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[#00c2c7]/15 text-[#001f5b] font-bold text-xs flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Complete your setup</h4>
                      <p className="text-xs text-slate-500">
                        Configure FX rates, ledger accounts, and user roles.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Verify clearing settlement
                      </h4>
                      <p className="text-xs text-slate-500">
                        Verify your corporate identity and connect commercial settlement banks.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">You're ready to go</h4>
                      <p className="text-xs text-slate-500">
                        Disburse to MTN MoMo and Orange Money at institutional scale.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Mini Mockup */}
              <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-[#001f5b] rounded-2xl p-5 text-white shadow-xl space-y-3">
                <div className="text-[10px] font-mono text-[#00c2c7]">TREASURY GATEWAY</div>
                <div className="p-3 bg-white/10 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-300">Available Float:</span>
                    <span className="font-bold text-white">50 000 000 XAF</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-300">Live Payouts:</span>
                    <span className="text-[#00c2c7] font-semibold">12 Settled</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 leading-relaxed">
                  Every API call and treasury action runs with bank-grade multi-layer encryption and
                  ledger verification.
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Choose how to set up */}
          {step === 2 && (
            <div className="max-w-xl mx-auto space-y-6 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Choose how to set up E-NAKO MoneyFlow
                </h2>
                <p className="text-sm text-slate-600">
                  Select your preferred onboarding path to configure your organization.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
                <div
                  onClick={() => setSetupMethod('dashboard')}
                  className={`p-6 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                    setupMethod === 'dashboard'
                      ? 'border-[#001f5b] bg-slate-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 border border-slate-200">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Set up in the Dashboard</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Guided step-by-step checklist to configure ledgers, users, and payout
                      channels.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setSetupMethod('ai')}
                  className={`p-6 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                    setupMethod === 'ai'
                      ? 'border-[#001f5b] bg-slate-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#00c2c7]/10 flex items-center justify-center text-[#001f5b] border border-[#00c2c7]/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Start with an AI tool</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Automated setup assistant using natural language prompts to scaffold rules.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: What do you need to get started? (Multi-select chip cards) */}
          {step === 3 && (
            <div className="max-w-2xl mx-auto space-y-6 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  What do you need to get started?
                </h2>
                <p className="text-sm text-slate-600">
                  Select all setup goals relevant to your operations team.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left pt-2">
                {GOALS_LIST.map((goal) => {
                  const isSelected = selectedGoals.includes(goal.id)
                  const Icon = goal.icon
                  return (
                    <div
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? 'border-[#001f5b] bg-[#001f5b]/5 text-[#001f5b] font-semibold'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className="w-4 h-4" />
                        {isSelected && <Check className="w-4 h-4 text-[#001f5b]" />}
                      </div>
                      <span className="text-xs">{goal.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Describe your business */}
          {step === 4 && (
            <div className="max-w-lg mx-auto space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Describe your business
                </h2>
                <p className="text-sm text-slate-600">
                  Helps us customize compliance thresholds and regional corridors.
                </p>
              </div>

              <div className="space-y-4 pt-2 text-left">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Website
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-hidden focus:border-[#001f5b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    What does your business do?
                  </label>
                  <textarea
                    rows={3}
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    placeholder="E.g., Agricultural exporter remitting cocoa harvest payments to cooperatives across Cameroon..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-hidden focus:border-[#001f5b]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Organization Info */}
          {step === 5 && (
            <div className="max-w-lg mx-auto space-y-6 relative">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Tell us about your organization
                </h2>
                <p className="text-sm text-slate-600">
                  Configure corporate entity name and regulatory jurisdiction.
                </p>
              </div>

              <div className="space-y-4 pt-2 text-left">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-hidden focus:border-[#001f5b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Country / Region
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-hidden focus:border-[#001f5b]"
                  >
                    <option>Cameroon (CEMAC)</option>
                    <option>Chad (CEMAC)</option>
                    <option>Gabon (CEMAC)</option>
                    <option>Congo (CEMAC)</option>
                    <option>Equatorial Guinea (CEMAC)</option>
                    <option>Central African Republic (CEMAC)</option>
                    <option>France / EU (SEPA Clearing)</option>
                  </select>
                </div>
              </div>

              {/* Cookie Consent Banner Bottom-Right (matches reference) */}
              {!cookieDismissed && (
                <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-[11px] text-slate-600">
                  <span>We use essential cookies to maintain secure admin sessions.</span>
                  <button
                    type="button"
                    onClick={() => setCookieDismissed(true)}
                    className="ml-3 font-semibold text-[#001f5b] hover:underline"
                  >
                    Accept
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Finish creating account */}
          {step === 6 && (
            <div className="max-w-md mx-auto space-y-6 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Finish creating your account
                </h2>
                <p className="text-sm text-slate-600">
                  Ready to activate your live treasury operations.
                </p>
              </div>

              <div className="space-y-3.5 pt-2 text-left">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-hidden focus:border-[#001f5b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-hidden focus:border-[#001f5b]"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="marketing"
                    checked={marketingOptIn}
                    onChange={(e) => setMarketingOptIn(e.target.checked)}
                    className="rounded border-slate-300 text-[#001f5b]"
                  />
                  <label htmlFor="marketing" className="text-xs text-slate-600">
                    Receive regional clearing updates and regulatory bulletins.
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Skip for now
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {step < 6 ? (
              <>
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-2 cursor-pointer"
                >
                  Skip
                </button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setStep((s) => s + 1)}
                  className="bg-[#001f5b] hover:bg-[#001744] text-white flex items-center space-x-1"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={handleFinish}
                className="bg-[#001f5b] hover:bg-[#001f5b] text-white font-bold px-6"
              >
                Create account
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
