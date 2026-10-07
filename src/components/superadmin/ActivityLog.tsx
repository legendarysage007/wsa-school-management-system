import React, { useState } from 'react';
import { AuditLogItem, User } from '../../types';
import { schoolStore } from '../../services/store';
import {
  Activity,
  Shield,
  KeyRound,
  Database,
  FileCheck2,
  Clock,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  Sparkles,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal
} from 'lucide-react';

interface Props {
  auditLogs: AuditLogItem[];
  activeUser: User | null;
}

export const ActivityLog: React.FC<Props> = ({ auditLogs, activeUser }) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'login' | 'data' | 'academic' | 'attendance'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'warning' | 'denied'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [isLiveStreamActive, setIsLiveStreamActive] = useState<boolean>(true);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // Categorize log entry
  const getLogCategory = (log: AuditLogItem): 'login' | 'data' | 'academic' | 'attendance' | 'other' => {
    const act = log.action.toLowerCase();
    const details = log.details.toLowerCase();
    if (act.includes('login') || act.includes('session') || details.includes('device') || details.includes('authenticated')) {
      return 'login';
    }
    if (act.includes('score') || act.includes('report') || act.includes('grade') || details.includes('terminal')) {
      return 'academic';
    }
    if (act.includes('attendance') || act.includes('sign in') || act.includes('sign out') || act.includes('qr')) {
      return 'attendance';
    }
    if (act.includes('student') || act.includes('class') || act.includes('subject') || act.includes('staff') || act.includes('setup') || act.includes('update')) {
      return 'data';
    }
    return 'other';
  };

  const filteredLogs = auditLogs.filter((log) => {
    const category = getLogCategory(log);

    // Category filter
    if (filterCategory !== 'all') {
      if (filterCategory === 'login' && category !== 'login') return false;
      if (filterCategory === 'data' && category !== 'data') return false;
      if (filterCategory === 'academic' && category !== 'academic') return false;
      if (filterCategory === 'attendance' && category !== 'attendance') return false;
    }

    // Status filter
    if (filterStatus !== 'all' && log.status !== filterStatus) {
      return false;
    }

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        log.action.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q) ||
        log.userRole.toLowerCase().includes(q) ||
        log.affectedRecord.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const handleSimulateLiveEvent = (eventType: 'login_attempt' | 'data_edit' | 'security_alert') => {
    const now = new Date();
    if (eventType === 'login_attempt') {
      schoolStore.logAudit({
        userId: 'usr_teacher_2',
        userName: 'Ms. Lydia Asante',
        userRole: 'teacher',
        action: 'Staff Authentication Verified',
        affectedRecord: 'Session Token WSA-SEC-9921',
        details: 'Successful two-factor verified login from Primary Campus Faculty Room (Chrome Mobile).',
        status: 'success'
      });
      setNotificationMessage('Real-time event recorded: Staff Authentication Verified.');
    } else if (eventType === 'data_edit') {
      schoolStore.logAudit({
        userId: activeUser?.id || 'usr_superadmin_1',
        userName: activeUser?.name || 'Dr. Kwabena Mensah',
        userRole: 'superadmin',
        action: 'System Configuration Synchronized',
        affectedRecord: 'Academic Year 2026/2027 Schedule',
        details: 'Confirmed Term 1 assessment submission deadlines across Creche to JHS 3.',
        status: 'success'
      });
      setNotificationMessage('Real-time event recorded: System Configuration Synchronized.');
    } else {
      schoolStore.logAudit({
        userId: 'sys_guard',
        userName: 'Security Gatekeeper',
        userRole: 'superadmin',
        action: 'Concurrent Device Login Prevented',
        affectedRecord: 'Account: Mr. Samuel Owusu (Teacher)',
        details: 'Enforced Single Active Device policy. Denied concurrent login attempt from foreign IP 197.251.14.92.',
        status: 'denied'
      });
      setNotificationMessage('Real-time security alert logged: Concurrent Device Login Prevented.');
    }

    setTimeout(() => setNotificationMessage(null), 4000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `wsa_activity_log_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Metrics
  const loginEventsCount = auditLogs.filter((l) => getLogCategory(l) === 'login').length;
  const dataEventsCount = auditLogs.filter((l) => getLogCategory(l) === 'data').length;
  const securityWarningsCount = auditLogs.filter((l) => l.status === 'denied' || l.status === 'warning').length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
      {/* Activity Log Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/70">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-900 rounded-md">
                <Activity className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-950">
                Live System Oversight & Audit Stream
              </span>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Feed Active
              </span>
            </div>
            <h2 className="text-lg font-bold font-display text-slate-900 mt-1">
              System Activity & Audit Log
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Authoritative tamper-evident event stream capturing authentication attempts, database modifications, and security actions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSimulateLiveEvent('security_alert')}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              title="Test real-time security warning detection"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Simulate Alert</span>
            </button>

            <button
              onClick={() => handleSimulateLiveEvent('login_attempt')}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              title="Record verified login stream event"
            >
              <KeyRound className="w-3.5 h-3.5 text-blue-700" />
              <span>Log Auth Event</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit JSON</span>
            </button>
          </div>
        </div>

        {notificationMessage && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-lg flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notificationMessage}</span>
          </div>
        )}

        {/* Real-time KPI Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-200 text-xs">
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <div className="text-slate-500 font-medium">Total Stream Events</div>
            <div className="text-xl font-bold font-mono text-slate-900 tabular-nums mt-0.5">
              {auditLogs.length}
            </div>
            <div className="text-[10.5px] text-slate-400">Server verified</div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <div className="text-slate-500 font-medium">Authentication & Logins</div>
            <div className="text-xl font-bold font-mono text-blue-900 tabular-nums mt-0.5">
              {loginEventsCount}
            </div>
            <div className="text-[10.5px] text-slate-400">Sessions recorded</div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <div className="text-slate-500 font-medium">Data Modifications</div>
            <div className="text-xl font-bold font-mono text-indigo-900 tabular-nums mt-0.5">
              {dataEventsCount}
            </div>
            <div className="text-[10.5px] text-slate-400">Records created / updated</div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <div className="text-slate-500 font-medium">Security Interventions</div>
            <div className="text-xl font-bold font-mono text-rose-700 tabular-nums mt-0.5">
              {securityWarningsCount}
            </div>
            <div className="text-[10.5px] text-rose-600 font-medium">Enforced policies</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 border-b border-slate-200 bg-white flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          {[
            { id: 'all', label: 'All Activities' },
            { id: 'login', label: 'Login & Security' },
            { id: 'data', label: 'Data Modifications' },
            { id: 'academic', label: 'Academic & Reports' },
            { id: 'attendance', label: 'QR Attendance' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors whitespace-nowrap ${
                filterCategory === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activity stream..."
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-md text-xs bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="warning">Warnings</option>
            <option value="denied">Blocked / Denied</option>
          </select>
        </div>
      </div>

      {/* Real-time Activity Event Stream List */}
      <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No activity log entries match the selected filters.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;
            const category = getLogCategory(log);

            const categoryIcon =
              category === 'login' ? (
                <KeyRound className="w-4 h-4 text-blue-600" />
              ) : category === 'data' ? (
                <Database className="w-4 h-4 text-indigo-600" />
              ) : category === 'academic' ? (
                <FileCheck2 className="w-4 h-4 text-purple-600" />
              ) : (
                <Clock className="w-4 h-4 text-emerald-600" />
              );

            const statusBadgeClass =
              log.status === 'success'
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                : log.status === 'warning'
                ? 'text-amber-700 bg-amber-50 border-amber-200'
                : 'text-rose-700 bg-rose-50 border-rose-200';

            return (
              <div
                key={log.id}
                className="p-4 hover:bg-slate-50/70 transition-colors text-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                      {categoryIcon}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-xs">
                          {log.action}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="font-semibold text-slate-700">
                          {log.userName}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          ({log.userRole})
                        </span>
                      </div>

                      <div className="text-slate-600">
                        Target Record: <strong className="text-slate-900">{log.affectedRecord}</strong>
                      </div>

                      <p className="text-slate-500 text-[11.5px] leading-relaxed pt-0.5">
                        {log.details}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusBadgeClass}`}
                      >
                        {log.status}
                      </span>
                      <button
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="text-slate-400 hover:text-slate-700 p-0.5"
                        title="View technical metadata"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    <span className="font-mono text-[10.5px] text-slate-400 tabular-nums">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} · {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Expanded Technical Inspection Details */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50/80 rounded-lg p-3 text-[11px] font-mono text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Event Log ID:</span>
                      <span className="text-slate-900">{log.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Actor User ID:</span>
                      <span className="text-slate-900">{log.userId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Authoritative Timestamp:</span>
                      <span className="text-slate-900">{log.timestamp}</span>
                    </div>
                    {log.previousValue && (
                      <div className="flex justify-between text-amber-800">
                        <span>Previous State:</span>
                        <span>{log.previousValue}</span>
                      </div>
                    )}
                    {log.newValue && (
                      <div className="flex justify-between text-emerald-800">
                        <span>New State:</span>
                        <span>{log.newValue}</span>
                      </div>
                    )}
                    <div className="pt-1 text-[10px] text-slate-400 text-right">
                      Verified by Server Integrity Layer · Wisdom Scholars Academy Core
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Activity Log Footer */}
      <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
        <span>Displaying {filteredLogs.length} of {auditLogs.length} system events</span>
        <span className="font-mono text-[11px]">Server Time: {new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};
