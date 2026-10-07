import React, { useState } from 'react';
import {
  User,
  Student,
  SchoolClass,
  Subject,
  TerminalReport,
  AttendanceSession,
  SchoolEvent,
  SchoolAnnouncement,
  AcademicYear,
  GradingConfig,
  SchoolInfo,
  AcademicCalendarEvent,
  Assessment
} from '../../types';
import { schoolStore } from '../../services/store';
import { AcademicCalendarView } from '../calendar/AcademicCalendarView';
import {
  UserPlus,
  Search,
  Filter,
  Layers,
  BookOpen,
  Calendar,
  Bell,
  QrCode,
  CheckCircle2,
  FileCheck,
  Eye,
  Plus,
  X,
  Sliders,
  Sparkles,
  Phone,
  Clock,
  ArrowRight
} from 'lucide-react';

interface Props {
  activeUser: User | null;
  students: Student[];
  classes: SchoolClass[];
  subjects: Subject[];
  reports: TerminalReport[];
  sessions: AttendanceSession[];
  events: SchoolEvent[];
  announcements: SchoolAnnouncement[];
  academicYears: AcademicYear[];
  schoolInfo: SchoolInfo;
  gradingConfig: GradingConfig;
  calendarEvents?: AcademicCalendarEvent[];
  assessments?: Assessment[];
  onOpenStudentProfile: (student: Student) => void;
  onOpenDynamicQRSession: (session: AttendanceSession) => void;
  onOpenGradingConfig: () => void;
}

export const AdminDashboard: React.FC<Props> = ({
  activeUser,
  students,
  classes,
  subjects,
  reports,
  sessions,
  events,
  announcements,
  academicYears,
  schoolInfo,
  gradingConfig,
  calendarEvents = [],
  assessments = [],
  onOpenStudentProfile,
  onOpenDynamicQRSession,
  onOpenGradingConfig
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'classes_subjects' | 'assessments' | 'attendance' | 'reports' | 'events_announcements' | 'calendar'>('students');
  const [assessmentFilter, setAssessmentFilter] = useState<'all' | 'current' | 'upcoming' | 'completed'>('all');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  // Modals state
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isCreateAnnouncementOpen, setIsCreateAnnouncementOpen] = useState(false);
  const [isAddAcademicYearOpen, setIsAddAcademicYearOpen] = useState(false);

  // Add Student 3-Step Form State
  const [studentStep, setStudentStep] = useState<1 | 2 | 3>(1);
  const [newStudentFullName, setNewStudentFullName] = useState('');
  const [newStudentDOB, setNewStudentDOB] = useState('2014-06-15');
  const [newStudentGender, setNewStudentGender] = useState<'male' | 'female'>('male');
  const [newStudentHometown, setNewStudentHometown] = useState('Accra, Greater Accra');
  const [newStudentAddress, setNewStudentAddress] = useState('East Legon Hills, Accra');
  const [newStudentGPS, setNewStudentGPS] = useState('GD-210-4491');
  const [newStudentParentName, setNewStudentParentName] = useState('');
  const [newStudentParentPhone, setNewStudentParentPhone] = useState('+233 ');
  const [newStudentParentRel, setNewStudentParentRel] = useState<'Father' | 'Mother' | 'Guardian'>('Father');
  const [newStudentParentOccupation, setNewStudentParentOccupation] = useState('Business Executive');
  const [newStudentClassId, setNewStudentClassId] = useState(classes[0]?.id || 'cls_jhs2');

  // Add Class Form State
  const [newClassName, setNewClassName] = useState('');
  const [newClassLevel, setNewClassLevel] = useState<SchoolClass['level']>('jhs');
  const [newClassRoom, setNewClassRoom] = useState('Block C - 04');

  // Add Subject Form State
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');

  // Add Staff Form State
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('+233 ');
  const [newStaffRole, setNewStaffRole] = useState<'teacher' | 'admin'>('teacher');
  const [newStaffTitle, setNewStaffTitle] = useState('Teacher');

  // Create Dynamic Session Form State
  const [newSessionTitle, setNewSessionTitle] = useState('PTA Executive Emergency Meeting');
  const [newSessionType, setNewSessionType] = useState<AttendanceSession['sessionType']>('staff_meeting');
  const [newSessionStartTime, setNewSessionStartTime] = useState('08:00');
  const [newSessionEndTime, setNewSessionEndTime] = useState('17:00');

  // Create Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-10-15');
  const [newEventTime, setNewEventTime] = useState('09:00 AM');
  const [newEventLocation, setNewEventLocation] = useState('School Quadrangle');
  const [newEventDesc, setNewEventDesc] = useState('');

  // Create Announcement Form State
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnPriority, setNewAnnPriority] = useState<'normal' | 'important' | 'urgent'>('important');

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentIdNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parentPhone.includes(searchTerm);

    const matchesClass = classFilter === 'all' || s.classId === classFilter;
    return matchesSearch && matchesClass;
  });

  // Handlers
  const handleSaveStudent = () => {
    schoolStore.addStudent({
      fullName: newStudentFullName || 'New Scholar',
      dateOfBirth: newStudentDOB,
      gender: newStudentGender,
      photoUrl: '/src/assets/images/student_avatar_1791142313577.jpg',
      hometown: newStudentHometown,
      residentialAddress: newStudentAddress,
      gpsAddress: newStudentGPS,
      classId: newStudentClassId,
      enrollmentStatus: 'enrolled',
      parentName: newStudentParentName || 'Parent Guardian',
      parentPhone: newStudentParentPhone,
      parentRelationship: newStudentParentRel,
      parentAddress: newStudentAddress,
      parentOccupation: newStudentParentOccupation,
      emergencyContact: newStudentParentPhone
    });

    setIsAddStudentOpen(false);
    setStudentStep(1);
    setNewStudentFullName('');
  };

  const handleSaveClass = () => {
    if (!newClassName.trim()) return;
    schoolStore.addClass({
      name: newClassName.trim(),
      level: newClassLevel,
      academicYearId: 'ay_2026_2027',
      termId: 't_2026_1',
      roomNumber: newClassRoom,
      capacity: 35
    });
    setNewClassName('');
    setIsAddClassOpen(false);
  };

  const handleSaveSubject = () => {
    if (!newSubjectName.trim()) return;
    schoolStore.addSubject({
      name: newSubjectName.trim(),
      code: newSubjectCode.trim() || newSubjectName.substring(0, 4).toUpperCase(),
      category: 'core',
      applicableLevels: ['primary', 'jhs']
    });
    setNewSubjectName('');
    setNewSubjectCode('');
    setIsAddSubjectOpen(false);
  };

  const handleSaveStaff = () => {
    if (!newStaffName.trim() || !newStaffEmail.trim()) return;
    schoolStore.addStaffUser({
      name: newStaffName.trim(),
      email: newStaffEmail.trim(),
      phone: newStaffPhone,
      role: newStaffRole,
      title: newStaffTitle,
      staffId: `WSA-${newStaffRole === 'teacher' ? 'TCH' : 'ADM'}-${Math.floor(Math.random() * 800 + 100)}`
    });
    setNewStaffName('');
    setNewStaffEmail('');
    setIsAddStaffOpen(false);
  };

  const handleSaveSession = () => {
    const session = schoolStore.createAttendanceSession(
      newSessionTitle,
      newSessionType,
      newSessionStartTime,
      newSessionEndTime
    );
    setIsCreateSessionOpen(false);
    onOpenDynamicQRSession(session);
  };

  const handleSaveEvent = () => {
    if (!newEventTitle.trim()) return;
    schoolStore.createEvent({
      title: newEventTitle.trim(),
      date: newEventDate,
      time: newEventTime,
      location: newEventLocation,
      description: newEventDesc || 'Official Wisdom Scholars Academy event.',
      audience: 'all',
      category: 'academic',
      isPublished: true
    });
    setNewEventTitle('');
    setNewEventDesc('');
    setIsCreateEventOpen(false);
  };

  const handleSaveAnnouncement = () => {
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;
    schoolStore.createAnnouncement({
      title: newAnnTitle.trim(),
      content: newAnnContent.trim(),
      priority: newAnnPriority,
      targetAudience: 'all',
      isArchived: false,
      publishedBy: `${activeUser?.name || 'Administrator'} (Admin)`
    });
    setNewAnnTitle('');
    setNewAnnContent('');
    setIsCreateAnnouncementOpen(false);
  };

  const pendingReports = reports.filter((r) => r.status === 'submitted' || r.status === 'approved');

  return (
    <div className="space-y-6">
      {/* Human Greeting & Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-blue-900">
            School Administration Portal
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-0.5">
            Good morning, {activeUser?.name || 'Administrator'} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Wisdom Scholars Academy · 2026/2027 Academic Year · Term 1 (Active)
          </p>
        </div>

        {/* Essential Quick Actions (Step 1 -> Step 2 -> Step 3 -> Done) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setStudentStep(1);
              setIsAddStudentOpen(true);
            }}
            className="px-3.5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>

          <button
            onClick={() => setIsCreateSessionOpen(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Dynamic QR Session</span>
          </button>

          <button
            onClick={() => setIsAddClassOpen(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Add Class</span>
          </button>

          <button
            onClick={onOpenGradingConfig}
            className="px-3 py-2 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Grading Rules</span>
          </button>
        </div>
      </div>

      {/* Operational Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500">Enrolled Scholars</div>
          <div className="text-2xl font-bold text-slate-900 font-display tabular-nums mt-1">
            {students.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Creche through JHS 3</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500">Classes Configured</div>
          <div className="text-2xl font-bold text-slate-900 font-display tabular-nums mt-1">
            {classes.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Self-service editable</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500">Reports Awaiting Review</div>
          <div className="text-2xl font-bold text-amber-700 font-display tabular-nums mt-1">
            {pendingReports.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Ready for Headteacher</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500">Active QR Sessions</div>
          <div className="text-2xl font-bold text-emerald-700 font-display tabular-nums mt-1">
            {sessions.filter((s) => s.status === 'active').length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">2-min token rotation</div>
        </div>
      </div>

      {/* Navigation Tabs (Unboxed & Clean) */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
        {[
          { id: 'students', label: `STUDENTS DIRECTORY (${students.length})` },
          { id: 'classes_subjects', label: `CLASSES & CURRICULUM (${classes.length})` },
          { id: 'assessments', label: `ASSESSMENTS & EXAMS (${assessments.length})` },
          { id: 'calendar', label: `ACADEMIC CALENDAR (${calendarEvents.length})` },
          { id: 'attendance', label: `DYNAMIC QR ATTENDANCE (${sessions.length})` },
          { id: 'reports', label: `TERMINAL REPORTS (${reports.length})` },
          { id: 'events_announcements', label: `EVENTS & NOTICES (${events.length + announcements.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-2.5 px-2 transition-colors ${
              activeTab === tab.id
                ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. STUDENTS TAB */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by student name, ID, or parent phone..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 focus:outline-none"
              >
                <option value="all">All Classes (Creche to JHS 3)</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setStudentStep(1);
                  setIsAddStudentOpen(true);
                }}
                className="px-3 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Student</span>
              </button>
            </div>
          </div>

          {/* Students Directory Table */}
          {filteredStudents.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-200 space-y-3">
              <p className="text-xs text-slate-500">No students match your search criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setClassFilter('all');
                }}
                className="px-3 py-1.5 text-xs text-blue-900 font-semibold underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Scholar</th>
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Parent / Guardian</th>
                    <th className="py-3 px-4">Ghana Post GPS</th>
                    <th className="py-3 px-4 text-right">Central Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((st) => {
                    const stClass = classes.find((c) => c.id === st.classId);
                    return (
                      <tr
                        key={st.id}
                        onClick={() => onOpenStudentProfile(st)}
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={st.photoUrl}
                              alt={st.fullName}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-semibold text-slate-900">{st.fullName}</div>
                              <div className="text-[11px] text-slate-500 capitalize">{st.gender}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-600 tabular-nums">
                          {st.studentIdNumber}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-800">{stClass?.name || 'Assigned'}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-slate-900 font-medium">{st.parentName}</div>
                          <div className="text-[11px] font-mono text-slate-500">{st.parentPhone}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">{st.gpsAddress}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-900 group-hover:underline">
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Profile</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 2. CLASSES & SUBJECTS TAB (Self-Service) */}
      {activeTab === 'classes_subjects' && (
        <div className="space-y-6">
          {/* Classes Grid */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  School Class Structure (Creche to JHS 3)
                </h3>
                <p className="text-xs text-slate-500">
                  Total {classes.length} active classes. Administrators can add or rename classes without developers.
                </p>
              </div>

              <button
                onClick={() => setIsAddClassOpen(true)}
                className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Class</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {classes.map((cls) => {
                const count = students.filter((s) => s.classId === cls.id).length;
                return (
                  <div
                    key={cls.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-400 transition-colors"
                  >
                    <div className="text-xs font-bold text-slate-900 truncate">{cls.name}</div>
                    <div className="text-[11px] text-slate-500 uppercase mt-0.5">{cls.level}</div>
                    <div className="mt-2 text-xs font-mono font-semibold text-blue-900 tabular-nums">
                      {count} Scholars
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Curriculum Subjects
                </h3>
                <p className="text-xs text-slate-500">
                  Core, elective and creative learning areas under the NaCCA framework.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddStaffOpen(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Teacher / Staff</span>
                </button>

                <button
                  onClick={() => setIsAddSubjectOpen(true)}
                  className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Subject</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {subjects.map((sub) => (
                <div key={sub.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs text-slate-900">{sub.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{sub.code} · {sub.category}</div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. ATTENDANCE SESSIONS TAB */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">Dynamic 2-Minute QR Attendance Sessions</h3>
              <p className="text-xs text-slate-500">
                Create dynamic QR attendance sessions for daily staff check-in, workshops, and PTA meetings.
              </p>
            </div>

            <button
              onClick={() => setIsCreateSessionOpen(true)}
              className="px-3.5 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Dynamic Session</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sessions.map((ses) => (
              <div
                key={ses.id}
                className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                      {ses.sessionType.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Active 2-Min QR
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 font-display">{ses.title}</h4>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span>Date: {ses.date}</span>
                    <span>·</span>
                    <span>Hours: {ses.startTime} – {ses.endTime}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-slate-400">
                    Token: {ses.currentToken?.token?.substring(0, 14)}...
                  </div>

                  <button
                    onClick={() => onOpenDynamicQRSession(ses)}
                    className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Display Dynamic QR</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. REPORTS TAB */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">Academic Terminal Reports</h3>
              <p className="text-xs text-slate-500">
                Review scores entered by teachers, track approval status, and publish to parents.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Scholar</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4 text-right">Overall Total</th>
                  <th className="py-3 px-4 text-right">Average</th>
                  <th className="py-3 px-4 text-center">Class Rank</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((rep) => {
                  const student = students.find((s) => s.id === rep.studentId);
                  const stClass = classes.find((c) => c.id === rep.classId);
                  return (
                    <tr key={rep.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-900">{student?.fullName}</td>
                      <td className="py-3 px-4 text-slate-600">{stClass?.name}</td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-blue-900">
                        {rep.overallTotal}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                        {rep.overallAverage}%
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-800 tabular-nums">
                        #{rep.overallPosition} of {rep.classSize}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            rep.status === 'published'
                              ? 'text-emerald-700'
                              : rep.status === 'approved'
                              ? 'text-blue-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {rep.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              if (student) onOpenStudentProfile(student);
                            }}
                            className="px-2 py-1 text-slate-600 hover:text-slate-900 font-semibold"
                          >
                            Inspect
                          </button>
                          {rep.status !== 'published' && (
                            <button
                              onClick={() => schoolStore.publishReport(rep.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md transition-colors"
                            >
                              Publish to Parent
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. EVENTS & NOTICES TAB */}
      {activeTab === 'events_announcements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Announcements */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">School Announcements</h3>
                <p className="text-xs text-slate-500">Visible to parents and teaching staff.</p>
              </div>
              <button
                onClick={() => setIsCreateAnnouncementOpen(true)}
                className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Notice</span>
              </button>
            </div>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">{ann.publishedBy}</span>
                    <span>{new Date(ann.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">{ann.title}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Events */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">School Events</h3>
                <p className="text-xs text-slate-500">Academic calendar milestones & meetings.</p>
              </div>
              <button
                onClick={() => setIsCreateEventOpen(true)}
                className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Event</span>
              </button>
            </div>

            <div className="space-y-3">
              {events.map((evt) => (
                <div key={evt.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{evt.title}</span>
                    <span className="text-[11px] font-mono text-blue-900 font-bold">{evt.date}</span>
                  </div>
                  <p className="text-xs text-slate-600">{evt.description}</p>
                  <div className="text-[11px] text-slate-500 pt-1">
                    {evt.time} · {evt.location}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2.5 ASSESSMENTS & EXAMINATIONS MANAGEMENT TAB */}
      {activeTab === 'assessments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Academic Assessments & Examinations Registry
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized monitoring of ongoing classroom continuous assessment, historical promotional archives, and upcoming examination milestones.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
                {(['all', 'current', 'upcoming', 'completed'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setAssessmentFilter(filter)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${
                      assessmentFilter === filter
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {filter === 'completed' ? 'Past Archive' : filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {assessments
              .filter((a) => (assessmentFilter === 'all' ? true : a.status === assessmentFilter))
              .map((asm) => {
                const asmClass = classes.find((c) => c.id === asm.classId);
                const asmSubject = subjects.find((s) => s.id === asm.subjectId);
                const classStudents = students.filter((s) => s.classId === asm.classId);

                return (
                  <div
                    key={asm.id}
                    className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              asm.status === 'current'
                                ? 'bg-emerald-100 text-emerald-800'
                                : asm.status === 'upcoming'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {asm.status} · {asm.assessmentType.replace('_', ' ')}
                          </span>
                          <span className="text-xs font-bold text-blue-900">
                            {asmClass?.name || 'Class Grade'} · {asmSubject?.name || 'Subject'}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 font-display mt-1">{asm.title}</h4>
                        <p className="text-xs text-slate-600 mt-0.5">{asm.instructions}</p>
                      </div>

                      <div className="text-right shrink-0 text-xs text-slate-500">
                        <div>
                          Max Score: <strong className="text-slate-900">{asm.maxScore}</strong> · Weight: <strong className="text-slate-900">{asm.weightPercentage}%</strong>
                        </div>
                        <div className="font-mono text-slate-600 mt-0.5">
                          {asm.startDate} to {asm.endDate}
                        </div>
                      </div>
                    </div>

                    {/* Class Roster with Student Photos for Easy Identification */}
                    <div className="pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Enrolled Scholars ({classStudents.length}) · Visual Identification
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {classStudents.map((st) => (
                          <div
                            key={st.id}
                            onClick={() => onOpenStudentProfile(st)}
                            className="p-2 bg-slate-50 hover:bg-blue-50/50 rounded-lg border border-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <img
                              src={st.photoUrl}
                              alt={st.fullName}
                              className="w-7 h-7 rounded-md object-cover border border-slate-300 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="truncate">
                              <span className="font-medium text-slate-900 truncate block text-[11px]">
                                {st.fullName.split(' ')[0]}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {st.studentIdNumber.split('/').pop()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 6. SHARED ACADEMIC CALENDAR TAB */}
      {activeTab === 'calendar' && (
        <AcademicCalendarView
          events={calendarEvents}
          userRole="admin"
          canManage={true}
        />
      )}

      {/* --- ADD STUDENT 3-STEP MODAL ("STEP 1 -> STEP 2 -> STEP 3 -> DONE") --- */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-blue-900 tracking-wider">
                  Guided Workflow · Step {studentStep} of 3
                </span>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  {studentStep === 1
                    ? 'Step 1: Student Personal Details'
                    : studentStep === 2
                    ? 'Step 2: Parent / Guardian Information'
                    : 'Step 3: Class Enrollment Assignment'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddStudentOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {studentStep === 1 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name of Student *
                    </label>
                    <input
                      type="text"
                      value={newStudentFullName}
                      onChange={(e) => setNewStudentFullName(e.target.value)}
                      placeholder="e.g. Yaw Boakye"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={newStudentDOB}
                        onChange={(e) => setNewStudentDOB(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Gender
                      </label>
                      <select
                        value={newStudentGender}
                        onChange={(e) => setNewStudentGender(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hometown & Region
                    </label>
                    <input
                      type="text"
                      value={newStudentHometown}
                      onChange={(e) => setNewStudentHometown(e.target.value)}
                      placeholder="e.g. Kumasi, Ashanti Region"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ghana Post GPS Digital Address
                    </label>
                    <input
                      type="text"
                      value={newStudentGPS}
                      onChange={(e) => setNewStudentGPS(e.target.value)}
                      placeholder="e.g. GD-210-4491"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {studentStep === 2 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Parent / Guardian Full Name *
                    </label>
                    <input
                      type="text"
                      value={newStudentParentName}
                      onChange={(e) => setNewStudentParentName(e.target.value)}
                      placeholder="e.g. Mr. Edward Boakye"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Telephone Number *
                      </label>
                      <input
                        type="tel"
                        value={newStudentParentPhone}
                        onChange={(e) => setNewStudentParentPhone(e.target.value)}
                        placeholder="+233 24 000 0000"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Relationship
                      </label>
                      <select
                        value={newStudentParentRel}
                        onChange={(e) => setNewStudentParentRel(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Guardian">Guardian</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Occupation
                    </label>
                    <input
                      type="text"
                      value={newStudentParentOccupation}
                      onChange={(e) => setNewStudentParentOccupation(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              {studentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Assign Class Cohort (Creche to JHS 3)
                    </label>
                    <select
                      value={newStudentClassId}
                      onChange={(e) => setNewStudentClassId(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs bg-white font-medium"
                    >
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} ({cls.level.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900 space-y-1">
                    <span className="font-bold block">Summary of New Enrollment:</span>
                    <div>Student: <strong>{newStudentFullName || 'Scholar'}</strong></div>
                    <div>Parent: <strong>{newStudentParentName || 'Guardian'}</strong> ({newStudentParentPhone})</div>
                    <div>Cohort: <strong>{classes.find((c) => c.id === newStudentClassId)?.name}</strong></div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              {studentStep > 1 ? (
                <button
                  onClick={() => setStudentStep((prev) => (prev - 1) as any)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {studentStep < 3 ? (
                <button
                  onClick={() => setStudentStep((prev) => (prev + 1) as any)}
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSaveStudent}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Enroll Student (Done)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- ADD CLASS MODAL (Self-service) --- */}
      {isAddClassOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-display">Add School Class</h3>
              <button onClick={() => setIsAddClassOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Class Name</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g. Basic 6 B or JHS 3"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Level Group</label>
                <select
                  value={newClassLevel}
                  onChange={(e) => setNewClassLevel(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="creche">Creche</option>
                  <option value="nursery">Nursery</option>
                  <option value="kindergarten">Kindergarten</option>
                  <option value="primary">Primary (Basic 1-6)</option>
                  <option value="jhs">Junior High (JHS 1-3)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Room / Block</label>
                <input
                  type="text"
                  value={newClassRoom}
                  onChange={(e) => setNewClassRoom(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAddClassOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveClass}
                className="px-4 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-md text-xs font-semibold"
              >
                Create Class
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD SUBJECT MODAL (Self-service) --- */}
      {isAddSubjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-display">Add Subject</h3>
              <button onClick={() => setIsAddSubjectOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="e.g. French Language or Robotics"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Code</label>
                <input
                  type="text"
                  value={newSubjectCode}
                  onChange={(e) => setNewSubjectCode(e.target.value)}
                  placeholder="e.g. FRN"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAddSubjectOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSubject}
                className="px-4 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-md text-xs font-semibold"
              >
                Save Subject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD STAFF MODAL --- */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-display">Add Staff Member</h3>
              <button onClick={() => setIsAddStaffOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="e.g. Mr. Patrick Kwakye"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  placeholder="p.kwakye@wisdomscholars.edu.gh"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value as any)}
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="teacher">Teacher</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newStaffTitle}
                    onChange={(e) => setNewStaffTitle(e.target.value)}
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAddStaffOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStaff}
                className="px-4 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-md text-xs font-semibold"
              >
                Add Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CREATE ATTENDANCE SESSION MODAL --- */}
      {isCreateSessionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-display">New Attendance Session</h3>
              <button onClick={() => setIsCreateSessionOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Session Title</label>
                <input
                  type="text"
                  value={newSessionTitle}
                  onChange={(e) => setNewSessionTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                <select
                  value={newSessionType}
                  onChange={(e) => setNewSessionType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="daily_staff">Daily Staff Attendance</option>
                  <option value="staff_meeting">Staff Meeting</option>
                  <option value="pta_meeting">PTA Meeting</option>
                  <option value="workshop">Workshop & Training</option>
                  <option value="official_event">Official School Gathering</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newSessionStartTime}
                    onChange={(e) => setNewSessionStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newSessionEndTime}
                    onChange={(e) => setNewSessionEndTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCreateSessionOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSession}
                className="px-4 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-md text-xs font-semibold flex items-center gap-1"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Activate Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CREATE EVENT MODAL --- */}
      {isCreateEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-display">Create Event</h3>
              <button onClick={() => setIsCreateEventOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Event Title</label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Science & Computing Fair"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    placeholder="09:00 AM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCreateEventOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEvent}
                className="px-4 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-md text-xs font-semibold"
              >
                Publish Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CREATE ANNOUNCEMENT MODAL --- */}
      {isCreateAnnouncementOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-display">Create Announcement</h3>
              <button onClick={() => setIsCreateAnnouncementOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Title</label>
                <input
                  type="text"
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  placeholder="e.g. Mid-term Assessment Timetable"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Content</label>
                <textarea
                  value={newAnnContent}
                  onChange={(e) => setNewAnnContent(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                <select
                  value={newAnnPriority}
                  onChange={(e) => setNewAnnPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCreateAnnouncementOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAnnouncement}
                className="px-4 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-md text-xs font-semibold"
              >
                Publish Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
