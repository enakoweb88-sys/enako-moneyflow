import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Tabs } from '@/components/ui/tabs'
import { useMock } from '@/mock/MockContext'
import { ROLES_PERMISSIONS_MATRIX, ALL_ROLES, type UserRole, type SystemSetting } from '@/mock/data'

interface AdministrationPageProps {
  initialTab?: 'users' | 'roles' | 'settings'
}

export const AdministrationPage: React.FC<AdministrationPageProps> = ({ initialTab = 'users' }) => {
  const { staffUsers, systemSettings, inviteStaffUser, updateSystemSetting, currentUser } =
    useMock()

  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'settings'>(initialTab)

  // Invite User Modal
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<UserRole>('Operator')

  // Edit Setting Modal
  const [editingSetting, setEditingSetting] = useState<SystemSetting | null>(null)
  const [settingValue, setSettingValue] = useState('')

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteName.trim() || !inviteEmail.trim()) return
    inviteStaffUser({ name: inviteName.trim(), email: inviteEmail.trim(), role: inviteRole })
    setIsInviteOpen(false)
    setInviteName('')
    setInviteEmail('')
  }

  const handleEditSettingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSetting || !settingValue.trim()) return
    updateSystemSetting(editingSetting.id, settingValue.trim())
    setEditingSetting(null)
  }

  const isAdmin = currentUser.role === 'Administrator'

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Administration & Security"
        subtitle="Staff identity directory, role-based authorization matrix, and core system operational limits"
        action={
          activeTab === 'users' && isAdmin ? (
            <Button variant="default" size="sm" onClick={() => setIsInviteOpen(true)}>
              Invite User
            </Button>
          ) : undefined
        }
      />

      <Tabs
        tabs={[
          { id: 'users', label: 'Staff Accounts', count: staffUsers.length },
          { id: 'roles', label: 'Roles & Permissions Matrix' },
          { id: 'settings', label: 'System Settings & Thresholds', count: systemSettings.length },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as typeof activeTab)}
      />

      {/* Tab 1: Users */}
      {activeTab === 'users' && (
        <Card>
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Staff Accounts ({staffUsers.length})</CardTitle>
                <CardDescription className="mt-0.5">
                  Internal enterprise operators, compliance officers, and treasury staff
                </CardDescription>
              </div>
              <Badge variant="neutral">Enterprise IAM</Badge>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Email Address</th>
                  <th className="py-3 px-6">Role Assignment</th>
                  <th className="py-3 px-6">Account Status</th>
                  <th className="py-3 px-6">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {staffUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-900 font-sans">
                      {user.name}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">{user.email}</td>
                    <td className="py-3.5 px-6 font-sans">
                      <Badge variant="info">{user.role}</Badge>
                    </td>
                    <td className="py-3.5 px-6 font-sans">
                      <Badge variant={user.status === 'Active' ? 'success' : 'danger'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 font-sans">{user.lastLogin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 2: Roles & Permissions Matrix */}
      {activeTab === 'roles' && (
        <Card>
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Role-Based Access Control (RBAC) Matrix</CardTitle>
                <CardDescription className="mt-0.5">
                  Entitlements mapping per organizational function (Yes = Full, Limit = Threshold
                  Constrained, — = Denied)
                </CardDescription>
              </div>
              <span className="text-xs text-slate-500 font-mono">Strict Privilege Enforcement</span>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-72">Permission Entitlement</th>
                  <th className="py-3 px-3 text-center">Operator</th>
                  <th className="py-3 px-3 text-center">Operations Mgr</th>
                  <th className="py-3 px-3 text-center">Finance Mgr</th>
                  <th className="py-3 px-3 text-center">Compliance</th>
                  <th className="py-3 px-3 text-center">Support</th>
                  <th className="py-3 px-3 text-center">CEO</th>
                  <th className="py-3 px-3 text-center bg-slate-100">Administrator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {ROLES_PERMISSIONS_MATRIX.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-semibold text-slate-800">{row.permission}</td>
                    <td className="py-3 px-3 text-center text-slate-700 font-mono">
                      {row.operator}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700 font-mono">
                      {row.operationsManager}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700 font-mono">
                      {row.financeManager}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700 font-mono">
                      {row.complianceOfficer}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700 font-mono">
                      {row.customerSupport}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700 font-mono">{row.ceo}</td>
                    <td className="py-3 px-3 text-center font-bold text-[#001f5b] bg-slate-50 font-mono">
                      {row.admin}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 3: System Settings & Thresholds */}
      {activeTab === 'settings' && (
        <Card>
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  Operational System Settings & Thresholds
                </CardTitle>
                <CardDescription className="mt-0.5">
                  Core risk rules, dual-control trigger limits, and KYC daily transaction caps
                </CardDescription>
              </div>
              <Badge variant="warning">High Impact Config</Badge>
            </div>
          </CardHeader>
          <div className="divide-y divide-slate-100 text-xs font-sans">
            {systemSettings.map((set) => (
              <div
                key={set.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{set.label}</span>
                    <Badge variant="neutral">{set.category}</Badge>
                  </div>
                  <p className="text-slate-500 text-xs">{set.description}</p>
                  <div className="font-mono text-xs text-slate-400">Parameter Key: {set.key}</div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-mono font-bold text-slate-900 text-sm px-3 py-1.5 bg-slate-100 rounded border border-slate-200">
                    {set.value}
                  </span>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingSetting(set)
                        setSettingValue(set.value)
                      }}
                      className="text-xs h-8 px-3"
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Invite User Modal */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invite New Staff User"
        subtitle="Provision an enterprise access account with specific role-based permissions."
        maxWidth="md"
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
              Full Legal Name
            </label>
            <Input
              type="text"
              placeholder="e.g. Marcella Ebong"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              className="w-full text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
              Enterprise Email Address
            </label>
            <Input
              type="email"
              placeholder="e.g. m.ebong@enako.cm"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
              Assigned System Role
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as UserRole)}
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#001f5b] font-sans"
            >
              {ALL_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end space-x-3">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setIsInviteOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="default" size="sm" type="submit">
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit System Setting Modal */}
      {editingSetting && (
        <Modal
          isOpen={!!editingSetting}
          onClose={() => setEditingSetting(null)}
          title={`Edit System Setting: ${editingSetting.label}`}
          subtitle="Modifications to approval ceilings and turnover limits are logged immediately in the audit trail."
          maxWidth="md"
        >
          <form onSubmit={handleEditSettingSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-700 font-semibold uppercase tracking-wider mb-1">
                Parameter Value
              </label>
              <Input
                type="text"
                value={settingValue}
                onChange={(e) => setSettingValue(e.target.value)}
                className="w-full text-xs font-mono font-semibold"
              />
              <p className="text-slate-500 mt-1">{editingSetting.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setEditingSetting(null)}
              >
                Cancel
              </Button>
              <Button variant="default" size="sm" type="submit">
                Save & Log Setting
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
