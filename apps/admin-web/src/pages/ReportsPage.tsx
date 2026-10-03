import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { REPORT_TEMPLATES, type ReportCategory } from '@/mock/data'
import { toast } from 'sonner'

export const ReportsPage: React.FC = () => {
  const [activeReport, setActiveReport] = useState<ReportCategory | null>(null)
  const [dateRange, setDateRange] = useState('2026-09-01_2026-10-01')
  const [currency, setCurrency] = useState('ALL')
  const [previewRows, setPreviewRows] = useState<Record<string, string | number>[]>([])

  const handleGenerate = (template: ReportCategory) => {
    setActiveReport(template)
    // Generate preview mock rows
    if (template.id === 'rep_1') {
      setPreviewRows([
        {
          date: '2026-10-01',
          ref: 'TX-10921',
          corridor: 'EUR -> XAF',
          volume: '14,500,000 XAF',
          status: 'Completed',
        },
        {
          date: '2026-10-01',
          ref: 'TX-10922',
          corridor: 'GBP -> XAF',
          volume: '4,200,000 XAF',
          status: 'Completed',
        },
        {
          date: '2026-09-30',
          ref: 'TX-10901',
          corridor: 'USD -> XAF',
          volume: '8,900,000 XAF',
          status: 'Completed',
        },
      ])
    } else if (template.id === 'rep_2') {
      setPreviewRows([
        {
          period: '2026-09',
          corridor: 'Inward Remittance',
          grossFee: '2,450,000 XAF',
          aggregatorShare: '350,000 XAF',
          netIncome: '2,100,000 XAF',
        },
        {
          period: '2026-09',
          corridor: 'Cashout Payouts',
          grossFee: '1,570,000 XAF',
          aggregatorShare: '250,000 XAF',
          netIncome: '1,320,000 XAF',
        },
      ])
    } else {
      setPreviewRows([
        {
          period: 'Q3 2026',
          metric: 'Tier 1 Accounts',
          count: '1,420',
          turnover: '84,000,000 XAF',
          flags: '0',
        },
        {
          period: 'Q3 2026',
          metric: 'Tier 2 Accounts',
          count: '890',
          turnover: '340,000,000 XAF',
          flags: '1',
        },
        {
          period: 'Q3 2026',
          metric: 'Tier 3 Corporate',
          count: '115',
          turnover: '980,000,000 XAF',
          flags: '0',
        },
      ])
    }
  }

  const handleExportCsv = () => {
    if (!activeReport) return
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      Object.keys(previewRows[0] || {}).join(',') +
      '\n' +
      previewRows.map((r) => Object.values(r).join(',')).join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${activeReport.title.replace(/\s+/g, '_')}_2026.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success(`Export CSV generated: ${activeReport.title}.csv downloaded.`)
  }

  const handleExportPdf = () => {
    if (!activeReport) return
    toast.success(`Export PDF generated: ${activeReport.title}.pdf prepared for print.`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial & Compliance Reports"
        subtitle="Analytical data exports, statutory regulatory disclosures, and corridor performance metrics"
      />

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORT_TEMPLATES.map((template) => {
          const isSelected = activeReport?.id === template.id
          return (
            <Card
              key={template.id}
              className={`transition-colors ${isSelected ? 'border-emerald-500 bg-emerald-50/10' : ''}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="neutral">{template.frequency}</Badge>
                  {isSelected && <Badge variant="success">Active Preview</Badge>}
                </div>
                <CardTitle className="text-base mt-2">{template.title}</CardTitle>
                <CardDescription className="text-xs mt-1">{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 flex justify-end">
                <Button
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleGenerate(template)}
                >
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Report Filter & Preview Panel */}
      {activeReport && (
        <Card className="border-emerald-200">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base">Generated Preview: {activeReport.title}</CardTitle>
                <CardDescription className="mt-0.5">
                  Filtered data table ready for export and statutory auditing
                </CardDescription>
              </div>

              {/* Export Actions */}
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" onClick={handleExportPdf}>
                  Export PDF
                </Button>
                <Button variant="default" size="sm" onClick={handleExportCsv}>
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            {/* Filter Bar */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center gap-4 text-xs">
              <div>
                <label className="block text-slate-500 uppercase font-semibold mb-1">
                  Date Period
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="h-9 px-3 bg-white border border-slate-300 rounded-md font-sans"
                >
                  <option value="2026-10-01">Current Month (October 2026)</option>
                  <option value="2026-09-01_2026-10-01">Last 30 Days</option>
                  <option value="2026-Q3">Quarter 3 2026 (July - September)</option>
                  <option value="2026-YTD">Year to Date 2026</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 uppercase font-semibold mb-1">
                  Currency Filter
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="h-9 px-3 bg-white border border-slate-300 rounded-md font-sans"
                >
                  <option value="ALL">All Currencies</option>
                  <option value="XAF">XAF</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>

              <div className="pt-4 ml-auto">
                <span className="text-slate-500 font-mono text-xs">3 rows returned</span>
              </div>
            </div>

            {/* Preview Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    {Object.keys(previewRows[0] || {}).map((headerKey) => (
                      <th key={headerKey} className="py-2.5 px-4 uppercase font-sans">
                        {headerKey}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80">
                      {Object.values(row).map((val, cIdx) => (
                        <td key={cIdx} className="py-3 px-4 font-sans text-slate-800">
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
