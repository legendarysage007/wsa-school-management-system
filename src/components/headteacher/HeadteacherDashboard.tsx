import React, { useState } from 'react';
import {
  User,
  Student,
  SchoolClass,
  TerminalReport,
  AttendanceSession,
  SchoolEvent,
  SchoolAnnouncement,
  SchoolInfo,
  AcademicCalendarEvent,
  GradingConfig,
  Assessment
} from '../../types';
import { schoolStore } from '../../services/store';
import { AcademicCalendarView } from '../calendar/AcademicCalendarView';
import { printStudentReportCard } from '../../utils/printReportCard';
import {
  Award,
  CheckCircle2,
  FileCheck,
  Eye,
  Send,
  MessageSquare,
  Users,
  Calendar,
  Layers,
  Check,
  X,
  Printer,
  Sparkles,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface Props {
  activeUser: User | null;
  students: Student[];
  classes: SchoolClass[];
  reports: TerminalReport[];
  sessions: AttendanceSession[];
  events: SchoolEvent[];
  announcements: SchoolAnnouncement[];
  schoolInfo: SchoolInfo;
  calendarEvents?: AcademicCalendarEvent[];
  assessments?: Assessment[];
  gradingConfig?: GradingConfig;
  onOpenStudentProfile: (student: Student) => void;
}

export const HeadteacherDashboard: React.FC<Props> = ({
  activeUser,
  students,
  classes,
  reports,
  sessions,
  events,
  announcements,
  schoolInfo,
  calendarEvents = [],
  assessments = [],
  gradingConfig,
  onOpenStudentProfile
}) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'assessments' | 'calendar' | 'published' | 'attendance_notices'>('reports');
  const [assessmentFilter, setAssessmentFilter] = useState<'all' | 'current' | 'upcoming' | 'completed'>('all');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [headteacherComment, setHeadteacherComment] = useState<string>(
    'Exemplary intellectual diligence and moral leadership. Promoted with honours.'
  );
  const [approvalSuccess, setApprovalSuccess] = useState<string | null>(null);

  const pendingReports = reports.filter((r) => r.status === 'submitted' || r.status === 'draft');
  const publishedReports = reports.filter((r) => r.status === 'published' || r.status === 'approved');

  const selectedReport = reports.find((r) => r.id === selectedReportId);
  const selectedStudent = selectedReport ? students.find((s) => s.id === selectedReport.studentId) : null;
  const selectedClass = selectedReport ? classes.find((c) => c.id === selectedReport.classId) : null;

  const handleApproveReport = (publishImmediately: boolean) => {
    if (!selectedReportId) return;

    schoolStore.reviewAndApproveReport(selectedReportId, headteacherComment, publishImmediately);

    setApprovalSuccess(
      publishImmediately
        ? 'Report approved and published! Parents can now view it.'
        : 'Report approved successfully.'
    );

    setSelectedReportId(null);
    setTimeout(() => setApprovalSuccess(null), 4000);
  };

  const handlePrintReport = (report: TerminalReport) => {
    const student = students.find((s) => s.id === report.studentId);
    if (!student) return;
    const schoolClass = classes.find((c) => c.id === report.classId);
    printStudentReportCard({
      report,
      student,
      schoolClass,
      schoolInfo,
      gradingConfig: gradingConfig || schoolStore.getState().gradingConfig
    });
  };

  return (
    <div className="space-y-6">
      {/* Headteacher Welcome Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-purple-900">
            Headteacher Academic Oversight Workspace
          </span>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-0.5">
            Good morning, {activeUser?.name || 'Headteacher'} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Wisdom Scholars Academy · Academic Performance, Report Approvals & Character Remarks
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-500">Signatory Authority</div>
            <div className="text-xs font-bold text-slate-900">{schoolInfo.headteacherName}</div>
          </div>
        </div>
      </div>

      {approvalSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{approvalSuccess}</span>
        </div>
      )}

      {/* School Academic KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500">Pending Review</div>
          <div className="text-2xl font-bold text-amber-700 font-display tabular-nums mt-1">
            {pendingReports.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Awaiting headteacher signature</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500">Published to Parents</div>
          <div className="text-2xl font-bold text-emerald-700 font-display tabular-nums mt-1">
            {publishedReports.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Official terminal reports</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500">Academic Milestones</div>
          <div className="text-2xl font-bold text-purple-900 font-display tabular-nums mt-1">
            {calendarEvents.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Term dates & exam windows</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500">Scholars Enrolled</div>
          <div className="text-2xl font-bold text-blue-900 font-display tabular-nums mt-1">
            {students.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Creche through JHS 3</div>
        </div>
      </div>

      {/* Headteacher Workspace Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'reports', label: `REPORTS FOR REVIEW (${pendingReports.length})` },
          { id: 'assessments', label: `ASSESSMENTS & EXAMS (${assessments.length})` },
          { id: 'calendar', label: `SHARED ACADEMIC CALENDAR (${calendarEvents.length})` },
          { id: 'published', label: `PUBLISHED ARCHIVE (${publishedReports.length})` },
          { id: 'attendance_notices', label: `STAFF ATTENDANCE & NOTICES` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-2.5 px-3 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-purple-950 border-b-2 border-purple-900 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: REPORTS AWAITING REVIEW & APPROVAL */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Terminal Reports Awaiting Headteacher Review ({pendingReports.length})
              </h3>
              <p className="text-xs text-slate-500">
                Teachers have completed score entry. Review performance, enter Headteacher's Comment, and approve.
              </p>
            </div>
          </div>

          {pendingReports.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200 text-xs text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <div className="font-semibold text-slate-800">You're all caught up!</div>
              <div className="text-slate-500 mt-0.5">No reports waiting for review at this time.</div>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Scholar</th>
                    <th className="py-2.5 px-4">Class</th>
                    <th className="py-2.5 px-4 text-right">Overall Total</th>
                    <th className="py-2.5 px-4 text-right">Average</th>
                    <th className="py-2.5 px-4">Teacher's Remark</th>
                    <th className="py-2.5 px-4 text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingReports.map((rep) => {
                    const st = students.find((s) => s.id === rep.studentId);
                    const cls = classes.find((c) => c.id === rep.classId);
                    return (
                      <tr key={rep.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={st?.photoUrl}
                              alt={st?.fullName}
                              className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-semibold text-slate-900">{st?.fullName}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{st?.studentIdNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{cls?.name}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-blue-900 tabular-nums">
                          {rep.overallTotal}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-700 tabular-nums">
                          {rep.overallAverage}%
                        </td>
                        <td className="py-3 px-4 text-slate-500 max-w-xs truncate italic">
                          "{rep.teacherComment}"
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedReportId(rep.id);
                              setHeadteacherComment(
                                rep.headteacherComment ||
                                  'Commendable academic effort and leadership. Keep up the high standard.'
                              );
                            }}
                            className="px-3 py-1.5 bg-purple-900 hover:bg-purple-950 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
                          >
                            Review & Comment
                          </button>
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

      {/* TAB 1.5: ASSESSMENTS & EXAMINATIONS REGISTRY (CURRENT, PAST, FUTURE) */}
      {activeTab === 'assessments' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Academy Assessment & Examination System
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Headteacher oversight of ongoing continuous assessment, historical examination archives, and future exam timetables.
              </p>
            </div>

            <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
              {(['all', 'current', 'upcoming', 'completed'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setAssessmentFilter(filter)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${
                    assessmentFilter === filter
                      ? 'bg-purple-950 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter === 'completed' ? 'Past Archive' : filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {assessments
              .filter((a) => (assessmentFilter === 'all' ? true : a.status === assessmentFilter))
              .map((asm) => {
                const asmClass = classes.find((c) => c.id === asm.classId);
                const classStudents = students.filter((s) => s.classId === asm.classId);

                return (
                  <div
                    key={asm.id}
                    className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-colors"
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
                          <span className="text-xs font-bold text-purple-950">
                            {asmClass?.name || 'All Classes'}
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
                            className="p-2 bg-slate-50 hover:bg-purple-50/50 rounded-lg border border-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
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

      {/* TAB 2: SHARED ACADEMIC CALENDAR VIEW */}
      {activeTab === 'calendar' && (
        <AcademicCalendarView
          events={calendarEvents}
          userRole="headteacher"
          canManage={true}
        />
      )}

      {/* TAB 3: PUBLISHED REPORTS ARCHIVE */}
      {activeTab === 'published' && (
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Published Official Terminal Reports ({publishedReports.length})
            </h3>
            <p className="text-xs text-slate-500">
              Approved reports currently accessible to parents via the Parent Portal and ready for print-to-PDF generation.
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Scholar</th>
                  <th className="py-2.5 px-4">Class</th>
                  <th className="py-2.5 px-4 text-right">Average</th>
                  <th className="py-2.5 px-4 text-right">Position</th>
                  <th className="py-2.5 px-4">Headteacher Remark</th>
                  <th className="py-2.5 px-4 text-right">Print Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {publishedReports.map((rep) => {
                  const st = students.find((s) => s.id === rep.studentId);
                  const cls = classes.find((c) => c.id === rep.classId);
                  return (
                    <tr key={rep.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={st?.photoUrl}
                            alt={st?.fullName}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-semibold text-slate-900">{st?.fullName}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{st?.studentIdNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{cls?.name}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-blue-900 tabular-nums">
                        {rep.overallAverage}%
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700 tabular-nums">
                        #{rep.overallPosition} / {rep.classSize}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate italic">
                        "{rep.headteacherComment || 'Approved with distinction.'}"
                      </td>
                      <td className="py-3 px-4 text-right flex items-center justify-end gap-1.5">
                        {st && (
                          <button
                            onClick={() => onOpenStudentProfile(st)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                            title="View Student Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handlePrintReport(rep)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1 transition-colors"
                          title="Print to PDF"
                        >
                          <Printer className="w-3 h-3 text-slate-500" />
                          <span>Print PDF</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: STAFF ATTENDANCE & NOTICES */}
      {activeTab === 'attendance_notices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 font-display">Daily Staff Attendance Overview</h3>
            <p className="text-xs text-slate-500">
              Real-time attendance tokens generated via the dynamic 2-minute QR protocol.
            </p>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
              {sessions.map((ses) => (
                <div key={ses.id} className="p-3 text-xs flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 block">{ses.title}</strong>
                    <span className="text-slate-500">{ses.startTime} - {ses.endTime}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      ses.status === 'active'
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {ses.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 font-display">School Notices & Communication</h3>
            <p className="text-xs text-slate-500">Published official bulletins and parent announcements.</p>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900">{ann.title}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(ann.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-2">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REVIEW & APPROVAL MODAL */}
      {selectedReport && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-purple-900 tracking-wider">
                  Headteacher Review & Publication
                </span>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  {selectedStudent.fullName} · {selectedClass?.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReportId(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg text-center">
                <div>
                  <div className="text-slate-500">Overall Average</div>
                  <div className="text-xl font-bold font-display text-blue-900">
                    {selectedReport.overallAverage}%
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Class Position</div>
                  <div className="text-xl font-bold font-display text-slate-900">
                    #{selectedReport.overallPosition} / {selectedReport.classSize}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Attendance</div>
                  <div className="text-xl font-bold font-display text-emerald-800">
                    {selectedReport.attendanceDaysPresent} / {selectedReport.attendanceTotalDays}
                  </div>
                </div>
              </div>

              {/* Subject Scores Preview */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-2 px-3">Subject</th>
                      <th className="py-2 px-3 text-right">Class</th>
                      <th className="py-2 px-3 text-right">Exam</th>
                      <th className="py-2 px-3 text-right">Total</th>
                      <th className="py-2 px-3 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedReport.scores.map((s) => (
                      <tr key={s.subjectId}>
                        <td className="py-1.5 px-3 font-medium">{s.subjectName}</td>
                        <td className="py-1.5 px-3 text-right font-mono">{s.classScore}</td>
                        <td className="py-1.5 px-3 text-right font-mono">{s.examScore}</td>
                        <td className="py-1.5 px-3 text-right font-mono font-bold text-blue-900">
                          {s.totalScore}
                        </td>
                        <td className="py-1.5 px-3 text-center font-mono font-bold">{s.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Class Teacher Comment */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-700 block mb-0.5">Teacher's Comment:</span>
                <p className="text-slate-600 italic">"{selectedReport.teacherComment}"</p>
              </div>

              {/* Headteacher's Comment Input */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Headteacher's Assessment & Final Comment *
                </label>
                <textarea
                  rows={3}
                  value={headteacherComment}
                  onChange={(e) => setHeadteacherComment(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-purple-600 focus:outline-none"
                  placeholder="Enter official headteacher assessment..."
                />
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedReportId(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={() => handleApproveReport(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-semibold transition-colors"
              >
                Approve Only
              </button>

              <button
                onClick={() => handleApproveReport(true)}
                className="px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-md text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve & Publish to Parent</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

