import React, { useState, useEffect } from 'react';
import { schoolStore, AppState } from './services/store';
import { UserRole, Student, AttendanceSession, User } from './types';
import { TopBar } from './components/layout/TopBar';
import { SuperadminPreviewBanner } from './components/common/SuperadminPreviewBanner';
import { RoleSwitcherModal } from './components/common/RoleSwitcherModal';
import { PublicWebsite } from './components/public/PublicWebsite';
import { SuperadminDashboard } from './components/superadmin/SuperadminDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { HeadteacherDashboard } from './components/headteacher/HeadteacherDashboard';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { StudentProfileModal } from './components/admin/StudentProfileModal';
import { DynamicQRSessionModal } from './components/attendance/DynamicQRSessionModal';
import { SetupWizardModal } from './components/admin/SetupWizardModal';
import { GradingConfigModal } from './components/admin/GradingConfigModal';

export default function App() {
  const [state, setState] = useState<AppState>(schoolStore.getState());
  const [activeUser, setActiveUser] = useState<User | null>(schoolStore.getActiveUser());
  const [previewRole, setPreviewRole] = useState<UserRole | null>(schoolStore.getPreviewRole());
  const [currentView, setCurrentView] = useState<'portal' | 'website'>('portal');

  // Interactive Modals
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState<boolean>(false);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [activeQRSession, setActiveQRSession] = useState<AttendanceSession | null>(null);
  const [isSetupWizardOpen, setIsSetupWizardOpen] = useState<boolean>(false);
  const [isGradingConfigOpen, setIsGradingConfigOpen] = useState<boolean>(false);

  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  // Subscribe to central reactive store
  useEffect(() => {
    const unsubscribe = schoolStore.subscribe(() => {
      setState(schoolStore.getState());
      setActiveUser(schoolStore.getActiveUser());
      setPreviewRole(schoolStore.getPreviewRole());
    });
    return () => unsubscribe();
  }, []);

  const effectiveRole: UserRole = schoolStore.getEffectiveRole();

  const handleSelectUser = (user: User) => {
    const result = schoolStore.setActiveUser(user.id);
    if (!result.success && result.error) {
      setNotification({ message: result.error, type: 'error' });
      setTimeout(() => setNotification(null), 4000);
    } else {
      setNotification({ message: `Switched view to ${user.name} (${user.role})`, type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handlePreviewRoleSelect = (role: UserRole | null) => {
    schoolStore.setPreviewRole(role);
    setPreviewRole(role);
  };

  const handleExitPreview = () => {
    schoolStore.setPreviewRole(null);
    setPreviewRole(null);
  };

  const handleSignOut = () => {
    schoolStore.signOut();
    setCurrentView('website');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Sticky Superadmin Preview Banner (If viewing workspace as another role) */}
      <SuperadminPreviewBanner
        previewRole={previewRole}
        onExitPreview={handleExitPreview}
      />

      {/* Top Bar with Top Bar Contract */}
      <TopBar
        schoolInfo={state.schoolInfo}
        activeUser={activeUser}
        effectiveRole={effectiveRole}
        previewRole={previewRole}
        currentView={currentView}
        onSwitchWorkspaceClick={() => {
          if (activeUser?.role === 'superadmin') {
            setIsRoleSwitcherOpen(true);
          }
        }}
        onToggleWebsite={() => setCurrentView((prev) => (prev === 'portal' ? 'website' : 'portal'))}
        onSignOut={handleSignOut}
      />

      {/* Floating System Notification Toast */}
      {notification && (
        <div className="fixed top-16 right-4 sm:right-8 z-50 animate-in fade-in slide-in-from-top-2">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg border text-xs font-semibold flex items-center gap-2 ${
              notification.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 w-full">
        {currentView === 'website' ? (
          <PublicWebsite
            schoolInfo={state.schoolInfo}
            events={state.events}
            announcements={state.announcements}
            onOpenPortal={() => setCurrentView('portal')}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Superadmin Workspace */}
            {effectiveRole === 'superadmin' && (
              <SuperadminDashboard
                activeUser={activeUser}
                users={state.users}
                deviceSessions={state.deviceSessions}
                auditLogs={state.auditLogs}
                students={state.students}
                classes={state.classes}
                reports={state.reports}
                sessions={state.attendanceSessions}
                schoolInfo={state.schoolInfo}
                assessments={state.assessments}
                onOpenSetupWizard={() => setIsSetupWizardOpen(true)}
                onOpenGradingConfig={() => setIsGradingConfigOpen(true)}
                onSwitchPreviewRole={(role) => handlePreviewRoleSelect(role)}
              />
            )}

            {/* Administrator Workspace */}
            {effectiveRole === 'admin' && (
              <AdminDashboard
                activeUser={activeUser}
                students={state.students}
                classes={state.classes}
                subjects={state.subjects}
                reports={state.reports}
                sessions={state.attendanceSessions}
                events={state.events}
                announcements={state.announcements}
                academicYears={state.academicYears}
                schoolInfo={state.schoolInfo}
                gradingConfig={state.gradingConfig}
                calendarEvents={state.calendarEvents}
                assessments={state.assessments}
                onOpenStudentProfile={(st) => setSelectedStudentForProfile(st)}
                onOpenDynamicQRSession={(ses) => setActiveQRSession(ses)}
                onOpenGradingConfig={() => setIsGradingConfigOpen(true)}
              />
            )}

            {/* Teacher Workspace */}
            {effectiveRole === 'teacher' && (
              <TeacherDashboard
                activeUser={activeUser}
                classes={state.classes}
                subjects={state.subjects}
                students={state.students}
                reports={state.reports}
                sessions={state.attendanceSessions}
                gradingConfig={state.gradingConfig}
                assessments={state.assessments}
                onOpenDynamicQRSession={(ses) => setActiveQRSession(ses)}
              />
            )}

            {/* Headteacher Workspace */}
            {effectiveRole === 'headteacher' && (
              <HeadteacherDashboard
                activeUser={activeUser}
                students={state.students}
                classes={state.classes}
                reports={state.reports}
                sessions={state.attendanceSessions}
                events={state.events}
                announcements={state.announcements}
                schoolInfo={state.schoolInfo}
                calendarEvents={state.calendarEvents}
                assessments={state.assessments}
                gradingConfig={state.gradingConfig}
                onOpenStudentProfile={(st) => setSelectedStudentForProfile(st)}
              />
            )}

            {/* Parent Workspace */}
            {effectiveRole === 'parent' && (
              <ParentDashboard
                activeUser={activeUser}
                students={state.students}
                classes={state.classes}
                reports={state.reports}
                events={state.events}
                announcements={state.announcements}
                schoolInfo={state.schoolInfo}
                gradingConfig={state.gradingConfig}
                assessments={state.assessments}
                calendarEvents={state.calendarEvents}
              />
            )}
          </div>
        )}
      </main>

      {/* Global Modals */}

      {/* 1. Switch Role & Workspace Modal */}
      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
        users={state.users}
        activeUser={activeUser}
        effectiveRole={effectiveRole}
        previewRole={previewRole}
        onUserSelected={handleSelectUser}
        onPreviewRoleSelected={handlePreviewRoleSelect}
      />

      {/* 2. Centralized Student Profile (Single Source of Truth) */}
      <StudentProfileModal
        isOpen={selectedStudentForProfile !== null}
        onClose={() => setSelectedStudentForProfile(null)}
        student={selectedStudentForProfile}
        classes={state.classes}
        reports={state.reports}
        schoolInfo={state.schoolInfo}
        gradingConfig={state.gradingConfig}
      />

      {/* 3. Dynamic 2-Minute QR Attendance Session & Staff Verification */}
      <DynamicQRSessionModal
        isOpen={activeQRSession !== null}
        onClose={() => setActiveQRSession(null)}
        session={activeQRSession}
        records={state.attendanceRecords}
        activeUser={activeUser}
        onAttendanceRecorded={() => setState(schoolStore.getState())}
      />

      {/* 4. 7-Step School Setup Wizard */}
      <SetupWizardModal
        isOpen={isSetupWizardOpen}
        onClose={() => setIsSetupWizardOpen(false)}
        currentInfo={state.schoolInfo}
        onCompleted={() => setState(schoolStore.getState())}
      />

      {/* 5. Self-Service Grading Config Modal */}
      <GradingConfigModal
        isOpen={isGradingConfigOpen}
        onClose={() => setIsGradingConfigOpen(false)}
        config={state.gradingConfig}
        onSave={() => setState(schoolStore.getState())}
      />
    </div>
  );
}
