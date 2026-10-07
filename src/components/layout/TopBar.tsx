import React from 'react';
import { User, UserRole, SchoolInfo } from '../../types';
import { Users, LogOut, Globe, ShieldCheck } from 'lucide-react';

interface Props {
  schoolInfo: SchoolInfo;
  activeUser: User | null;
  effectiveRole: UserRole;
  previewRole: UserRole | null;
  currentView: 'portal' | 'website';
  onSwitchWorkspaceClick: () => void;
  onToggleWebsite: () => void;
  onSignOut: () => void;
}

export const TopBar: React.FC<Props> = ({
  schoolInfo,
  activeUser,
  effectiveRole,
  previewRole,
  currentView,
  onSwitchWorkspaceClick,
  onToggleWebsite,
  onSignOut
}) => {
  const roleDisplayNames: Record<UserRole, string> = {
    superadmin: 'Superadmin',
    admin: 'Administrator',
    teacher: 'Teacher',
    headteacher: 'Headteacher',
    parent: 'Parent'
  };

  const isSuperadmin = activeUser?.role === 'superadmin';

  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-slate-200 bg-white/95 backdrop-blur-xs sticky top-0 z-40">
      {/* Zone 1: Brand Zone - Single text element wordmark with school crest */}
      <div className="flex items-center gap-3">
        <img
          src={schoolInfo.logoUrl}
          alt="Wisdom Scholars Academy Seal"
          className="w-8 h-8 rounded-md object-cover shadow-2xs border border-slate-100"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="text-left">
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 font-display">
            Wisdom Scholars Academy
          </span>
          <span className="hidden sm:inline-block ml-2 text-[11px] text-slate-500 font-medium tracking-normal">
            Accra, Ghana · Creche to JHS 3
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links (Clean text without pills) */}
      <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600">
        <span className="text-blue-950 font-bold tracking-wide flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Official Academy Portal</span>
        </span>

        <span className="text-slate-300">|</span>

        <span className="text-slate-500 text-xs flex items-center gap-1.5">
          <span>Active Role:</span>
          <strong className="text-slate-800 uppercase tracking-wide">{roleDisplayNames[effectiveRole]}</strong>
          {previewRole && <span className="text-amber-700 font-semibold ml-1">(Preview Mode)</span>}
        </span>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* RULE: Apart from superadmin, no one can switch to other portals */}
        {isSuperadmin ? (
          <button
            onClick={onSwitchWorkspaceClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-950 rounded-md shadow-xs transition-colors whitespace-nowrap"
            title="Superadmin Multi-Workspace Control"
          >
            <Users className="w-3.5 h-3.5 text-blue-200" />
            <span>Switch Workspace</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-700 hidden sm:inline">
              {activeUser?.name}
            </span>
            <button
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
