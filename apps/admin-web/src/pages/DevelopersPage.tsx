import React, { useState } from 'react'
import { Key, Globe, Copy, Check, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const DevelopersPage: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Developers & API
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            API keys, webhook endpoints, gateway integrations, and technical integration
            documentation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="success" className="font-mono text-xs">
            LIVE PRODUCTION ENVIRONMENT
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: API Keys & Webhooks */}
        <div className="lg:col-span-8 space-y-6">
          {/* API Keys Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-[#001f5b]" />
                <h3 className="text-base font-bold text-slate-900">Production API Keys</h3>
              </div>
              <Badge variant="neutral">LIVE ACTIVE</Badge>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {/* Publishable Key */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Publishable Key</span>
                  <span className="text-[11px] text-slate-400">Client-side safe</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="text-slate-800 select-all">pk_live_enako_990142bc38104829</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('pk_live_enako_990142bc38104829', 'pk')}
                    className="p-1 hover:text-slate-900 text-slate-400"
                  >
                    {copiedKey === 'pk' ? (
                      <Check className="w-4 h-4 text-[#001f5b]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Secret Key */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Secret Key</span>
                  <span className="text-[11px] text-rose-600 font-semibold">
                    Server-side confidential
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="text-slate-800 select-all">
                    sk_live_enako_••••••••••••••••••••
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy('sk_live_enako_secret_key_prod_sim_123', 'sk')}
                    className="p-1 hover:text-slate-900 text-slate-400"
                  >
                    {copiedKey === 'sk' ? (
                      <Check className="w-4 h-4 text-[#001f5b]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Webhook Secret */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Webhook Signing Secret</span>
                  <span className="text-[11px] text-slate-400">
                    HMAC-SHA256 signature verification
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="text-slate-800 select-all">
                    whsec_live_enako_signature_secret_99
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy('whsec_live_enako_signature_secret_99', 'wh')}
                    className="p-1 hover:text-slate-900 text-slate-400"
                  >
                    {copiedKey === 'wh' ? (
                      <Check className="w-4 h-4 text-[#001f5b]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Webhook Endpoints Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-[#001f5b]" />
                <h3 className="text-base font-bold text-slate-900">Configured Webhook Listeners</h3>
              </div>
              <Button variant="outline" size="sm" className="text-xs h-7">
                + Add endpoint
              </Button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800">
                    https://api.merchant.com/webhooks/enako
                  </span>
                  <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                    Events: transfer.settled, payout.failed
                  </div>
                </div>
                <Badge variant="success">HEALTHY 200</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Docs & Quickstart */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">OpenAPI Specification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore typed request schemas, idempotent token generation, and response models.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert('Opening OpenAPI specification viewer...')}
                className="w-full text-xs font-semibold h-8 border-slate-300 text-slate-800"
              >
                <Terminal className="w-3.5 h-3.5 mr-1 text-slate-500" />
                <span>View OpenAPI 3.1 Spec</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
