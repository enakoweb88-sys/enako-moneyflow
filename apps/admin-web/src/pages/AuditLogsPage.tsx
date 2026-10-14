import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { useMock } from '@/mock/MockContext'
import type { AuditLogRecord } from '@/mock/data'

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useMock()

  const [actorFilter, setActorFilter] = useState('ALL')
  const [actionFilter, setActionFilter] = useState('ALL')
  const [entityFilter, setEntityFilter] = useState('ALL')
  const [selectedLog, setSelectedLog] = useState<AuditLogRecord | null>(null)

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchActor = actorFilter === 'ALL' || log.actorName === actorFilter
      const matchAction = actionFilter === 'ALL' || log.action === actionFilter
      const matchEntity = entityFilter === 'ALL' || log.entityType === entityFilter
      return matchActor && matchAction && matchEntity
    })
  }, [auditLogs, actorFilter, actionFilter, entityFilter])

  // Extract unique actors and actions
  const actors = Array.from(new Set(auditLogs.map((l) => l.actorName)))
  const actions = Array.from(new Set(auditLogs.map((l) => l.action)))
  const entityTypes = Array.from(new Set(auditLogs.map((l) => l.entityType)))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Immutable Audit Logs"
        subtitle="Cryptographically verified administrative audit trail capturing all state mutations, permission overrides, and sensitive inspections"
      />

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-slate-700 uppercase tracking-wider">Filters:</span>

            <select
              value={actorFilter}
              onChange={(e) => setActorFilter(e.target.value)}
              className="h-9 px-3 bg-white border border-slate-300 rounded-md font-sans text-slate-700"
            >
              <option value="ALL">All Actors ({actors.length})</option>
              {actors.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>

            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="h-9 px-3 bg-white border border-slate-300 rounded-md font-mono text-slate-700"
            >
              <option value="ALL">All Action Codes</option>
              {actions.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>

            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="h-9 px-3 bg-white border border-slate-300 rounded-md font-sans text-slate-700"
            >
              <option value="ALL">All Entity Types</option>
              {entityTypes.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>

            {(actorFilter !== 'ALL' || actionFilter !== 'ALL' || entityFilter !== 'ALL') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActorFilter('ALL')
                  setActionFilter('ALL')
                  setEntityFilter('ALL')
                }}
                className="text-xs"
              >
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Dense Table */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Audit Trail Records ({filteredLogs.length})</CardTitle>
            <Badge variant="neutral">Read-Only Immutable Log</Badge>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-6">Timestamp</th>
                <th className="py-2.5 px-6">Actor Name</th>
                <th className="py-2.5 px-6">Role</th>
                <th className="py-2.5 px-6">Action Event</th>
                <th className="py-2.5 px-6">Entity Reference</th>
                <th className="py-2.5 px-6 text-right font-sans">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-6 text-slate-600">{log.timestamp}</td>
                  <td className="py-3 px-6 font-sans font-semibold text-slate-900">
                    {log.actorName}
                  </td>
                  <td className="py-3 px-6 font-sans text-slate-600">{log.actorRole}</td>
                  <td className="py-3 px-6 font-bold text-slate-800">{log.action}</td>
                  <td className="py-3 px-6 font-sans text-slate-700">
                    <span className="text-slate-400 font-mono text-xs mr-1">
                      [{log.entityType}]
                    </span>
                    {log.entityReference}
                  </td>
                  <td className="py-3 px-6 text-right font-sans">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                      className="text-xs h-6 px-2.5"
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Side-by-Side Before/After Detail Modal */}
      {selectedLog && (
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title={`Audit Log Record: ${selectedLog.action}`}
          subtitle={`Logged on ${selectedLog.timestamp} by ${selectedLog.actorName} (${selectedLog.actorRole})`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            {/* Target Information */}
            <div className="p-3 bg-slate-50 rounded border border-slate-200 font-sans">
              <span className="text-slate-500 uppercase font-semibold block text-xs">
                Impacted Entity
              </span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                {selectedLog.entityType}: {selectedLog.entityReference}
              </span>
            </div>

            {/* Side-by-Side Old vs New Values */}
            <div className="grid grid-cols-2 gap-4">
              {/* Old Value */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 uppercase tracking-wide block border-b border-slate-200 pb-1">
                  Prior State (Old Value)
                </span>
                <p className="font-mono text-slate-700 pt-1 leading-relaxed">
                  {selectedLog.oldValue || '— None (Initial Record) —'}
                </p>
              </div>

              {/* New Value */}
              <div className="p-4 bg-[#00c2c7]/10 rounded-lg border border-[#00c2c7]/30 space-y-1">
                <span className="font-bold text-[#001f5b] uppercase tracking-wide block border-b border-[#00c2c7]/30 pb-1">
                  Mutated State (New Value)
                </span>
                <p className="font-mono text-[#0a0f2c] pt-1 font-semibold leading-relaxed">
                  {selectedLog.newValue || '—'}
                </p>
              </div>
            </div>

            {/* Recorded Reason */}
            {selectedLog.reason && (
              <div className="p-3 bg-white rounded border border-slate-200 font-sans">
                <span className="font-semibold text-slate-700 uppercase block mb-1">
                  Recorded Operator Explanation
                </span>
                <p className="text-slate-800 italic">{selectedLog.reason}</p>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedLog(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
