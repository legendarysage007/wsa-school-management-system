import React from 'react';
import { User, UserRole } from '../../types';
import { X, Check, ShieldCheck, UserCheck, GraduationCap, School, HeartHandshake, Eye, AlertOctagon, Lock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  activeUser: User | null;
  effectiveRole: UserRole;
  previewRole: UserRole | null;
  onUserSelected: (user: User) => void;
  onPreviewRoleSelected: (role: UserRole | null) => void;
}

export const RoleSwitcherModal: React.FC<Props> = ({
  isOpen,
  onClose,
  users,
  activeUser,
  effectiveRole,
  previewRole,
  onUserSelected,
  onPreviewRoleSelected
}) => {
  if (!isOpen) return null;

  const isSuperadminLoggedIn = activeUser?.role === 'superadmin';

  const roleIcons: Record<UserRole, React.ReactNode> = {
    superadmin: <ShieldCheck className="w-5 h-5 text-indigo-600" />,
    admin: <School className="w-5 h-5 text-blue-600" />,
    teacher: <GraduationCap className="w-5 h-5 text-emerald-600" />,
    headteacher: <UserCheck className="w-5 h-5 text-purple-600" />,
    parent: <HeartHandshake className="w-5 h-5 text-rose-600" />
  };

  const previewOptions: { role: UserRole; label: string; desc: string }[] = [
    { role: 'admin', label: 'Administrator Workspace', desc: 'Manage students, classes, subjects, reports, dynamic QR' },
    { role: 'teacher', label: 'Teacher / Staff Workspace', desc: 'Score entry, my classes, class attendance, QR scan' },
    { role: 'headteacher', label: 'Headteacher Workspace', desc: 'Review & approve reports, comments, academic metrics' },
    { role: 'parent', label: 'Parent Portal Preview', desc: 'Read-only view of child report card, events, notice board' }
  ];

  // If not superadmin: Enforce "apart from superadmin, no one can switch to other portals"
  if (!isSuperadminLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden p-6 space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">
            Portal Switching Restricted
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Apart from the <strong>Superadmin</strong>, users are restricted strictly to their assigned portal. You do not have permission to switch to other role workspaces.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Return to My Workspace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-900">
              <ShieldCheck className="w-4 h-4 text-indigo-700" />
              <span>Superadmin Portal Delegation</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display mt-0.5">
              Switch Workspace / Impersonate View
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Authenticated as: <strong className="text-slate-800">{activeUser?.name}</strong> ({activeUser?.role})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section 1: Superadmin Instant Role Preview (Without Logging Out) */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-amber-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Live Preview (No Logout Required)
              </h4>
            </div>
            <p className="text-xs text-amber-800 mb-3">
              Inspect how the platform looks and operates for staff and parents without switching accounts. You remain authenticated as Superadmin.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {previewOptions.map((opt) => {
                const isCurrentPreview = previewRole === opt.role;
                return (
                  <button
                    key={opt.role}
                    onClick={() => {
                      onPreviewRoleSelected(opt.role);
                      onClose();
                    }}
                    className={`text-left p-3 rounded-lg border text-xs transition-all flex items-start justify-between ${
                      isCurrentPreview
                        ? 'border-amber-600 bg-amber-100/70 text-amber-950 font-semibold ring-1 ring-amber-500'
                        : 'border-amber-200/60 bg-white hover:bg-amber-50/80 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{opt.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{opt.desc}</div>
                    </div>
                    {isCurrentPreview && <Check className="w-4 h-4 text-amber-700 shrink-0 ml-1.5 mt-0.5" />}
                  </button>
                );
              })}
            </div>

            {previewRole && (
              <button
                onClick={() => {
                  onPreviewRoleSelected(null);
                  onClose();
                }}
                className="mt-3 text-xs text-amber-900 underline hover:text-amber-950 font-medium"
              >
                Clear preview & return to Superadmin workspace
              </button>
            )}
          </div>

          {/* Section 2: Authenticate As Different Preset User */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Superadmin Account Switcher
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Switch primary login to test authentic role permissions and device policies:
            </p>

            <div className="space-y-2">
              {users.map((u) => {
                const isActive = activeUser?.id === u.id && !previewRole;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      onUserSelected(u);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                      isActive
                        ? 'border-blue-600 bg-blue-50/50 text-blue-950 ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-slate-100 shrink-0">
                        {roleIcons[u.role] || <UserCheck className="w-5 h-5 text-slate-600" />}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                          <span>{u.name}</span>
                          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                            {u.role}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {u.title ? `${u.title} · ` : ''}{u.email}
                          {u.staffId ? ` · ID: ${u.staffId}` : ''}
                        </div>
                      </div>
                    </div>
                    {isActive && <Check className="w-5 h-5 text-blue-600 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
