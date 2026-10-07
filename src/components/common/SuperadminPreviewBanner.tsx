import React from 'react';
import { UserRole } from '../../types';
import { schoolStore } from '../../services/store';
import { Eye, X, ShieldAlert } from 'lucide-react';

interface Props {
  previewRole: UserRole | null;
  onExitPreview: () => void;
}

export const SuperadminPreviewBanner: React.FC<Props> = ({ previewRole, onExitPreview }) => {
  if (!previewRole) return null;

  const roleLabels: Record<UserRole, string> = {
    superadmin: 'Superadmin',
    admin: 'Administrator',
    teacher: 'Teacher / Staff',
    headteacher: 'Headteacher',
    parent: 'Parent'
  };

  return (
    <div className="bg-amber-600 text-amber-50 px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2.5 truncate">
        <Eye className="w-4 h-4 shrink-0 text-amber-200" />
        <span className="font-semibold text-white">Preview Mode Active:</span>
        <span className="truncate">
          Viewing workspace as <strong className="text-white underline">{roleLabels[previewRole]}</strong>.
          Controlled preview for troubleshooting & testing.
        </span>
      </div>
      <button
        onClick={onExitPreview}
        className="inline-flex items-center gap-1 px-3 py-1 bg-white text-amber-950 font-semibold text-xs rounded-md shadow-sm hover:bg-amber-50 transition-colors shrink-0 ml-3"
      >
        <X className="w-3.5 h-3.5" />
        <span>Exit Preview</span>
      </button>
    </div>
  );
};
