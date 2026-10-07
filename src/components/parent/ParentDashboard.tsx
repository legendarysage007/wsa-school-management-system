import React, { useState } from 'react';
import {
  User,
  Student,
  SchoolClass,
  TerminalReport,
  SchoolEvent,
  SchoolAnnouncement,
  SchoolInfo,
  GradingConfig,
  Assessment,
  AcademicCalendarEvent
} from '../../types';
import { printStudentReportCard } from '../../utils/printReportCard';
import { ReportCardPreview } from '../reports/ReportCardPreview';
import {
  FileText,
  Calendar,
  Bell,
  Printer,
  X,
  Award,
  Clock,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowRight,
  Download,
  History,
  Sparkles,
  TrendingUp,
  FileCheck2,
  ChevronRight,
  CalendarCheck
} from 'lucide-react';

interface Props {
  activeUser: User | null;
  students: Student[];
  classes: SchoolClass[];
  reports: TerminalReport[];
  assessments?: Assessment[];
  calendarEvents?: AcademicCalendarEvent[];
  events: SchoolEvent[];
  announcements: SchoolAnnouncement[];
  schoolInfo: SchoolInfo;
  gradingConfig: GradingConfig;
}

export const ParentDashboard: React.FC<Props> = ({
  activeUser,
  students,
  classes,
  reports,
  assessments = [],
  calendarEvents = [],
  events,
  announcements,
  schoolInfo,
  gradingConfig
}) => {
  const [selectedChildReport, setSelectedChildReport] = useState<TerminalReport | null>(null);
  const [examTab, setExamTab] = useState<'current' | 'past' | 'future'>('current');
  const [activeChildId, setActiveChildId] = useState<string>('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);

  // Security enforcement: A parent ONLY sees their linked children!
  const parentId = activeUser?.id;
  const linkedStudentIds = activeUser?.linkedStudentIds || [];

  // Match children by linkedStudentIds or parentUserId or parent name
  const myChildren = students.filter((s) => {
    if (linkedStudentIds.length > 0 && linkedStudentIds.includes(s.id)) return true;
    if (s.parentUserId === parentId) return true;
    if (
      activeUser?.name &&
      s.parentName &&
      s.parentName.toLowerCase().includes(
        activeUser.name.toLowerCase().replace('mr. ', '').replace('mrs. ', '').replace('dr. ', '')
      )
    ) {
      return true;
    }
    return false;
  });

  const visibleChildren = myChildren.length > 0 ? myChildren : (students.length > 0 ? [students[0]] : []);

  // Active selected child
  const currentChild =
    visibleChildren.find((c) => c.id === activeChildId) || visibleChildren[0] || null;

  const getChildClass = (classId: string) => classes.find((c) => c.id === classId);
  const currentChildClass = currentChild ? getChildClass(currentChild.classId) : undefined;

  // Filter reports for the active child
  const childReports = reports.filter(
    (r) => r.studentId === currentChild?.id && r.status === 'published'
  );

  // Current (active session) report
  const currentTermReport = childReports.find(
    (r) => r.academicYearId === 'ay_2026_2027' && r.termId === 't_2026_1'
  );

  // Past term reports (archive)
  const pastReports = childReports.filter(
    (r) => !(r.academicYearId === 'ay_2026_2027' && r.termId === 't_2026_1')
  );

  // Future / upcoming assessments for this child's class
  const upcomingAssessments = assessments.filter(
    (a) =>
      a.status === 'upcoming' &&
      (!a.classId || a.classId === currentChild?.classId || a.classId.startsWith('cls_jhs'))
  );

  // Current continuous assessment tests
  const currentAssessments = assessments.filter(
    (a) =>
      a.status === 'current' &&
      (!a.classId || a.classId === currentChild?.classId || a.classId.startsWith('cls_jhs'))
  );

  const publishedAnnouncements = announcements.filter((a) => !a.isArchived).slice(0, 3);
  const publishedEvents = events.filter((e) => e.isPublished).slice(0, 3);

  const handlePrint = (reportToPrint?: TerminalReport) => {
    const report = reportToPrint || selectedChildReport || currentTermReport;
    if (!report || !currentChild) return;
    setIsGeneratingPDF(true);

    const targetChild = students.find((s) => s.id === report.studentId) || currentChild;
    const targetClass = getChildClass(report.classId) || currentChildClass;

    printStudentReportCard({
      report,
      student: targetChild,
      schoolClass: targetClass,
      schoolInfo,
      gradingConfig
    });

    setTimeout(() => {
      setIsGeneratingPDF(false);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Friendly Parent Welcome Header */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-rose-800">
            Wisdom Scholars Academy · Parent Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1">
            Welcome, {activeUser?.name || 'Esteemed Parent'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Monitor continuous assessments, historical academic records, and upcoming examination milestones for your children.
          </p>
        </div>

        {/* Children Quick Switcher if parent has multiple children */}
        {visibleChildren.length > 1 && (
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 shrink-0">
            <span className="text-xs font-semibold text-slate-500 pl-2">Select Child:</span>
            {visibleChildren.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveChildId(ch.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  (currentChild?.id === ch.id)
                    ? 'bg-blue-900 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <img
                  src={ch.photoUrl}
                  alt={ch.fullName}
                  className="w-5 h-5 rounded-full object-cover border border-white/50"
                  referrerPolicy="no-referrer"
                />
                <span>{ch.fullName.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SELECTED CHILD PROFILE BANNER WITH PHOTO */}
      {!currentChild ? (
        <div className="bg-white rounded-xl p-12 text-center border border-dashed border-slate-300 space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-900 mx-auto flex items-center justify-center">
            <Award className="w-8 h-8 text-blue-800" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900 font-display">No Enrolled Scholars Linked Yet</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Your Parent Portal account is active. When Wisdom Scholars Academy registers your child or assigns them to your portal, their continuous assessment scores, terminal reports, and attendance records will appear here automatically.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              {currentChild.photoUrl ? (
                <img
                  src={currentChild.photoUrl}
                  alt={currentChild.fullName}
                  className="w-20 h-20 rounded-xl object-cover border-2 border-slate-200 shadow-sm"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-blue-900 text-white font-black text-2xl flex items-center justify-center shadow-sm">
                  {currentChild.fullName.charAt(0)}
                </div>
              )}
              <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 font-display">
                  {currentChild.fullName}
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                  {currentChild.enrollmentStatus}
                </span>
              </div>

              <div className="text-xs font-medium text-slate-600 mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="font-semibold text-blue-950 font-display">
                  {currentChildClass?.name || 'Assigned Class'}
                </span>
                <span>·</span>
                <span className="font-mono text-slate-500">ID: {currentChild.studentIdNumber}</span>
                <span>·</span>
                <span>Enrolled: {currentChild.enrollmentDate}</span>
              </div>

              <div className="text-[11px] text-slate-500 mt-1">
                Class Teacher:{' '}
                <strong className="text-slate-800">
                  {currentChildClass?.name.includes('JHS') ? 'Mr. Samuel Owusu' : 'Ms. Lydia Asante'}
                </strong>{' '}
                · Room: {currentChildClass?.roomNumber || 'Block A'}
              </div>
            </div>
          </div>

          {currentTermReport && (
            <div className="text-right flex flex-col sm:items-end gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-4 justify-center sm:justify-end bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div>
                  <div className="text-[11px] text-slate-500">Term 1 Rank</div>
                  <div className="text-base font-bold text-blue-950 font-display">
                    #{currentTermReport.overallPosition} <span className="text-xs font-normal text-slate-500">of {currentTermReport.classSize}</span>
                  </div>
                </div>
                <div className="border-l border-slate-200 pl-4">
                  <div className="text-[11px] text-slate-500">Term Average</div>
                  <div className="text-base font-bold text-emerald-800 font-display tabular-nums">
                    {currentTermReport.overallAverage}%
                  </div>
                </div>
              </div>

              <button
                onClick={() => handlePrint(currentTermReport)}
                disabled={isGeneratingPDF}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isGeneratingPDF ? 'Preparing PDF...' : 'Download / Print Report (PDF)'}</span>
              </button>
            </div>
          )}
        </div>

      {/* CORE FEATURE: CURRENT, PAST AND FUTURE EXAMS REPORT SYSTEM */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Navigation Tabs for Exams System */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-900" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 font-display">
              Exams & Academic Assessments System
            </span>
          </div>

          <div className="inline-flex rounded-lg bg-slate-200/70 p-1">
            <button
              onClick={() => setExamTab('current')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                examTab === 'current'
                  ? 'bg-white text-blue-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-blue-700" />
              <span>Current Term (2026/2027)</span>
            </button>

            <button
              onClick={() => setExamTab('past')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                examTab === 'past'
                  ? 'bg-white text-blue-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5 text-amber-700" />
              <span>Past Exams Archive ({pastReports.length})</span>
            </button>

            <button
              onClick={() => setExamTab('future')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                examTab === 'future'
                  ? 'bg-white text-blue-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Upcoming Exam Roadmap ({upcomingAssessments.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: CURRENT TERM EXAMS & OFFICIAL REPORT CARD */}
        {examTab === 'current' && (
          <div className="p-6 space-y-6">
            {currentTermReport ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                  <div>
                    <span className="text-[11px] uppercase font-bold tracking-wider text-blue-900">
                      Official 2026/2027 Session · Term 1 Continuous Assessment & Examination
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      Terminal Report Card for {currentChild?.fullName}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Verified and approved by {schoolInfo.headteacherName} (Headteacher).
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedChildReport(currentTermReport)}
                      className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Full Report Card</span>
                    </button>

                    <button
                      onClick={() => handlePrint(currentTermReport)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5"
                      title="Print or save as PDF"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print to PDF</span>
                    </button>
                  </div>
                </div>

                {/* Subject Performance Breakdown Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Subject Scores & Continuous Assessment</span>
                    <span className="font-mono text-slate-500 font-normal">
                      Weights: Class ({gradingConfig.classScoreWeight}%) · Exam ({gradingConfig.examScoreWeight}%)
                    </span>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold">Subject</th>
                        <th className="py-2.5 px-4 text-right font-semibold">Class Score ({gradingConfig.classScoreWeight}%)</th>
                        <th className="py-2.5 px-4 text-right font-semibold">Exam Score ({gradingConfig.examScoreWeight}%)</th>
                        <th className="py-2.5 px-4 text-right font-semibold">Total (100%)</th>
                        <th className="py-2.5 px-4 text-center font-semibold">Grade</th>
                        <th className="py-2.5 px-4 font-semibold">Remark</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentTermReport.scores.map((sc) => (
                        <tr key={sc.subjectId} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-4 font-semibold text-slate-900">{sc.subjectName}</td>
                          <td className="py-2.5 px-4 text-right font-mono text-slate-700">{sc.classScore}</td>
                          <td className="py-2.5 px-4 text-right font-mono text-slate-700">{sc.examScore}</td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-blue-950 tabular-nums">
                            {sc.totalScore}
                          </td>
                          <td className="py-2.5 px-4 text-center font-mono font-extrabold text-slate-900">
                            {sc.grade}
                          </td>
                          <td className="py-2.5 px-4 text-slate-600">{sc.remark}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Overall Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg text-center text-xs">
                  <div>
                    <span className="text-slate-500 block">Class Position:</span>
                    <strong className="text-base font-bold text-blue-900 font-display">
                      #{currentTermReport.overallPosition} of {currentTermReport.classSize}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Term Average:</span>
                    <strong className="text-base font-bold text-slate-900 font-display">
                      {currentTermReport.overallAverage}%
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Attendance Rate:</span>
                    <strong className="text-base font-bold text-emerald-800 font-display">
                      {currentTermReport.attendanceDaysPresent} / {currentTermReport.attendanceTotalDays} Days
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Conduct & Discipline:</span>
                    <strong className="text-xs font-semibold text-slate-800">
                      {currentTermReport.conduct.split(',')[0]}
                    </strong>
                  </div>
                </div>

                {/* Comments Strip */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">Class Teacher's Observation:</span>
                    <p className="text-slate-700 italic">"{currentTermReport.teacherComment}"</p>
                  </div>
                  <div className="p-3.5 bg-blue-50/50 rounded-lg border border-blue-200">
                    <span className="font-bold text-blue-900 block mb-1">Headteacher's Final Remark:</span>
                    <p className="text-blue-950 italic">"{currentTermReport.headteacherComment}"</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <Lock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-900">Term 1 Final Report Is Being Processed</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Class scores are currently being moderated by teachers. Once reviewed and signed by the Headteacher, your child's published terminal report will appear here automatically.
                </p>
              </div>
            )}

            {/* Ongoing Continuous Assessments for Term 1 */}
            {currentAssessments.length > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Ongoing Continuous Assessment Milestones (Term 1)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentAssessments.map((ca) => (
                    <div key={ca.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{ca.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                          Active Now
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{ca.instructions}</p>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
                        <span>Max Score: <strong>{ca.maxScore}</strong></span>
                        <span>·</span>
                        <span>Weight: <strong>{ca.weightPercentage}%</strong></span>
                        <span>·</span>
                        <span>Ends: {ca.endDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PAST EXAMS & REPORTS ARCHIVE */}
        {examTab === 'past' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Historical Academic Reports Archive · {currentChild?.fullName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review historical terminal examination transcripts and track growth over previous terms.
                </p>
              </div>
            </div>

            {pastReports.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <History className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-900">No Prior Term Records on File</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Historical reports from previous sessions will be archived here once terms conclude.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pastReports.map((pRep) => {
                  const repClass = getChildClass(pRep.classId);
                  return (
                    <div
                      key={pRep.id}
                      className="p-5 bg-slate-50/60 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                            {pRep.academicYearId === 'ay_2025_2026' ? '2025/2026 Session' : 'Prior Session'} · {pRep.termId === 't_2025_3' ? 'Term 3 Promotional Exam' : 'Term 2 Mid-Year Exam'}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                            Archived & Verified
                          </span>
                        </div>
                        <div className="text-base font-bold text-slate-900 font-display">
                          {repClass?.name || 'Class Grade'} · Terminal Examination Report
                        </div>
                        <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                          <span>Class Position: <strong className="text-slate-900">#{pRep.overallPosition}</strong> of {pRep.classSize}</span>
                          <span>·</span>
                          <span>Term Average: <strong className="text-emerald-800 tabular-nums">{pRep.overallAverage}%</strong></span>
                          <span>·</span>
                          <span>Total Score: <strong className="text-slate-900 tabular-nums">{pRep.overallTotal}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setSelectedChildReport(pRep)}
                          className="px-3.5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Transcript</span>
                        </button>

                        <button
                          onClick={() => handlePrint(pRep)}
                          className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FUTURE / UPCOMING EXAM ROADMAP & TIMETABLE */}
        {examTab === 'future' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Upcoming Examination Schedule & Revision Roadmap
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Prepare ahead for upcoming mid-term tests, project presentations, and terminal exam dates.
              </p>
            </div>

            <div className="space-y-3">
              {upcomingAssessments.map((ua) => (
                <div
                  key={ua.id}
                  className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 bg-blue-50 text-blue-900 rounded-lg shrink-0 text-center min-w-[54px]">
                      <div className="text-[10px] uppercase font-bold text-blue-700">
                        {new Date(ua.startDate).toLocaleString('default', { month: 'short' })}
                      </div>
                      <div className="text-base font-extrabold text-blue-950 font-display">
                        {new Date(ua.startDate).getDate()}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-amber-100 text-amber-900">
                          {ua.assessmentType.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {ua.startDate} to {ua.endDate}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 font-display mt-0.5">{ua.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ua.instructions}</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-1 shrink-0 text-xs text-slate-500 border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto">
                    <div>
                      Weight: <strong className="text-slate-900">{ua.weightPercentage}%</strong> · Max Score: <strong className="text-slate-900">{ua.maxScore}</strong>
                    </div>
                    <span className="text-[11px] text-blue-800 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Syllabus revision active</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Parent Preparation Tips Box */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-1.5">
              <span className="font-bold uppercase tracking-wider text-[11px] text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Guidance for Wisdom Scholars Parents</span>
              </span>
              <p className="leading-relaxed">
                Terminal examinations account for {gradingConfig.examScoreWeight}% of final report grading. Ensure children have a quiet home study area, review past test papers, and maintain restful sleep routines during examination periods.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )}

      {/* SCHOOL ANNOUNCEMENTS & CALENDAR DATES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* School Updates */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-900" />
            <h3 className="text-sm font-bold text-slate-900 font-display">School Communications</h3>
          </div>

          <div className="space-y-3">
            {publishedAnnouncements.map((ann) => (
              <div key={ann.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">{ann.publishedBy}</span>
                  <span>{new Date(ann.publishedAt).toLocaleDateString()}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{ann.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-900" />
            <h3 className="text-sm font-bold text-slate-900 font-display">Upcoming Academy Dates</h3>
          </div>

          <div className="space-y-3">
            {publishedEvents.map((evt) => (
              <div key={evt.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-blue-900 rounded-md shrink-0 text-center min-w-[44px]">
                  <div className="text-[10px] uppercase font-bold text-blue-700">
                    {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                  </div>
                  <div className="text-sm font-extrabold text-blue-950 font-display">
                    {new Date(evt.date).getDate()}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{evt.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{evt.description}</p>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                    <span>{evt.time}</span>
                    <span>·</span>
                    <span>{evt.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OFFICIAL PHYSICAL DISTRIBUTION REPORT CARD PREVIEW (@media print) */}
      <ReportCardPreview
        isOpen={Boolean(selectedChildReport)}
        onClose={() => setSelectedChildReport(null)}
        report={selectedChildReport}
        student={students.find((s) => s.id === selectedChildReport?.studentId) || currentChild}
        schoolClass={selectedChildReport ? getChildClass(selectedChildReport.classId) : currentChildClass}
        schoolInfo={schoolInfo}
        gradingConfig={gradingConfig}
        userRole="parent"
      />
    </div>
  );
};
