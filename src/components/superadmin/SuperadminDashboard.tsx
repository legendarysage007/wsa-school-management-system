import React, { useState } from 'react';
import {
  User,
  DeviceSession,
  AuditLogItem,
  SchoolInfo,
  AcademicYear,
  SchoolClass,
  Subject,
  Student,
  TerminalReport,
  AttendanceSession,
  UserRole,
  Assessment
} from '../../types';
import { schoolStore } from '../../services/store';
import {
  ShieldCheck,
  Smartphone,
  History,
  Users,
  Settings,
  Eye,
  Sliders,
  AlertOctagon,
  RefreshCw,
  Search,
  CheckCircle2,
  Trash2,
  Plus
} from 'lucide-react';

import { ActivityLog } from './ActivityLog';

interface Props {
  activeUser: User | null;
  users: User[];
  deviceSessions: DeviceSession[];
  auditLogs: AuditLogItem[];
  students: Student[];
  classes: SchoolClass[];
  reports: TerminalReport[];
  sessions: AttendanceSession[];
  schoolInfo: SchoolInfo;
  assessments?: Assessment[];
  onOpenSetupWizard: () => void;
  onOpenGradingConfig: () => void;
  onSwitchPreviewRole: (role: UserRole) => void;
}

export const SuperadminDashboard: React.FC<Props> = ({
  activeUser,
  users,
  deviceSessions,
  auditLogs,
  students,
  classes,
  reports,
  sessions,
  schoolInfo,
  assessments = [],
  onOpenSetupWizard,
  onOpenGradingConfig,
  onSwitchPreviewRole
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'sessions' | 'users'>('overview');
  const [auditFilter, setAuditFilter] = useState<string>('all');
  const [auditSearch, setAuditSearch] = useState<string>('');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesFilter =
      auditFilter === 'all'
        ? true
        : auditFilter === 'security'
        ? log.status === 'denied' || log.action.toLowerCase().includes('session') || log.action.toLowerCase().includes('login')
        : auditFilter === 'academic'
        ? log.action.toLowerCase().includes('score') || log.action.toLowerCase().includes('report')
        : auditFilter === 'attendance'
        ? log.action.toLowerCase().includes('attendance')
        : true;

    const matchesSearch =
      auditSearch.trim() === '' ||
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.affectedRecord.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const activeSessionsCount = deviceSessions.filter((s) => s.isActive).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Impersonation Hub */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Superadmin Command Workspace</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display mt-1 text-white">
              System Control & Integrity Hub
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Authenticated as <strong className="text-white">{activeUser?.name}</strong> · Full school governance authority
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenSetupWizard}
              className="px-3.5 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>School Setup Wizard</span>
            </button>

            <button
              onClick={onOpenGradingConfig}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Grading Engine</span>
            </button>
          </div>
        </div>

        {/* Superadmin Workspace Switch Cards (Without Logging Out) */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Instant Role Workspaces (Switch Without Logging Out):</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <button
              onClick={() => onSwitchPreviewRole('admin')}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-700/90 text-left rounded-lg border border-slate-700 transition-colors"
            >
              <div className="font-semibold text-white">Administrator</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Students, classes, QR</div>
            </button>

            <button
              onClick={() => onSwitchPreviewRole('teacher')}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-700/90 text-left rounded-lg border border-slate-700 transition-colors"
            >
              <div className="font-semibold text-white">Teacher / Staff</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Score entry & attendance</div>
            </button>

            <button
              onClick={() => onSwitchPreviewRole('headteacher')}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-700/90 text-left rounded-lg border border-slate-700 transition-colors"
            >
              <div className="font-semibold text-white">Headteacher</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Report reviews & remarks</div>
            </button>

            <button
              onClick={() => onSwitchPreviewRole('parent')}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-700/90 text-left rounded-lg border border-slate-700 transition-colors"
            >
              <div className="font-semibold text-white">Parent Preview</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Read-only child report</div>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'overview', label: 'SYSTEM OVERVIEW' },
          { id: 'activity', label: `REAL-TIME ACTIVITY LOG (${auditLogs.length})` },
          { id: 'sessions', label: `DEVICE SESSIONS (${activeSessionsCount})` },
          { id: 'users', label: `USERS & STAFF (${users.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-2.5 px-3 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Total Students</div>
              <div className="text-2xl font-bold text-slate-900 font-display tabular-nums mt-1">
                {students.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Creche through JHS 3</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Classes Active</div>
              <div className="text-2xl font-bold text-slate-900 font-display tabular-nums mt-1">
                {classes.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">14 Level Cohorts</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Active Device Sessions</div>
              <div className="text-2xl font-bold text-emerald-700 font-display tabular-nums mt-1">
                {activeSessionsCount}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Single-device policy active</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Audit Events Logged</div>
              <div className="text-2xl font-bold text-blue-900 font-display tabular-nums mt-1">
                {auditLogs.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Tamper-evident trail</div>
            </div>
          </div>

          {/* Real-time Activity Stream Preview in Overview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Live System Oversight Stream
              </h3>
              <button
                onClick={() => setActiveTab('activity')}
                className="text-xs text-blue-900 font-semibold hover:underline"
              >
                Open Full Activity Console →
              </button>
            </div>
            <ActivityLog auditLogs={auditLogs} activeUser={activeUser} />
          </div>
        </div>
      )}

      {/* ACTIVITY LOG TAB */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          <ActivityLog auditLogs={auditLogs} activeUser={activeUser} />
        </div>
      )}

      {/* SESSIONS TAB */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">Active Device Sessions</h3>
              <p className="text-xs text-slate-500">
                Staff accounts are limited to one active session. Administrators can terminate compromised sessions.
              </p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">User</th>
                  <th className="py-2.5 px-4 font-semibold">Role</th>
                  <th className="py-2.5 px-4 font-semibold">Device</th>
                  <th className="py-2.5 px-4 font-semibold">IP Address</th>
                  <th className="py-2.5 px-4 font-semibold">Last Active</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deviceSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{session.userName}</td>
                    <td className="py-3 px-4 uppercase text-[11px] font-bold text-slate-600">{session.role}</td>
                    <td className="py-3 px-4 text-slate-600">{session.deviceName}</td>
                    <td className="py-3 px-4 font-mono text-slate-500 tabular-nums">{session.ipAddress}</td>
                    <td className="py-3 px-4 text-slate-500">{new Date(session.lastActiveAt).toLocaleTimeString()}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider ${
                          session.isActive ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      >
                        {session.isActive ? 'Active' : 'Terminated'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {session.isActive && (
                        <button
                          onClick={() => schoolStore.terminateDeviceSession(session.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
                        >
                          Revoke Session
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">System Users & Roles</h3>
              <p className="text-xs text-slate-500">
                Superadmins, Administrators, Teachers, Headteacher, and Parents.
              </p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Name</th>
                  <th className="py-2.5 px-4 font-semibold">Email</th>
                  <th className="py-2.5 px-4 font-semibold">Role</th>
                  <th className="py-2.5 px-4 font-semibold">Staff / Parent ID</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{u.name}</td>
                    <td className="py-2.5 px-4 text-slate-600">{u.email}</td>
                    <td className="py-2.5 px-4 uppercase text-[10px] font-bold text-blue-900">{u.role}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">{u.staffId || '—'}</td>
                    <td className="py-2.5 px-4 text-emerald-700 font-medium text-[11px] capitalize">{u.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
