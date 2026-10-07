import React, { useState } from 'react';
import { Student, SchoolClass, TerminalReport, SchoolInfo, GradingConfig } from '../../types';
import { schoolStore } from '../../services/store';
import { printStudentReportCard } from '../../utils/printReportCard';
import { X, User, Phone, MapPin, Calendar, Award, CheckCircle2, FileText, Printer, Shield, Clock, Download, FileDown } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  classes: SchoolClass[];
  reports: TerminalReport[];
  schoolInfo: SchoolInfo;
  gradingConfig: GradingConfig;
}

export const StudentProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  student,
  classes,
  reports,
  schoolInfo,
  gradingConfig
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'academic' | 'attendance' | 'parent' | 'conduct'>('overview');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);

  if (!isOpen || !student) return null;

  const studentClass = classes.find((c) => c.id === student.classId);
  const studentReports = reports.filter((r) => r.studentId === student.id);
  const latestReport = studentReports[0];

  /**
   * Client-side Generate PDF utility for student report cards.
   * Adheres strictly to the defined print media query styles in index.css (A4, print-color-adjust, page breaks)
   * for professional offline distribution.
   */
  const handleGeneratePDF = (reportToPrint?: TerminalReport) => {
    const target = reportToPrint || latestReport;
    if (!target) return;
    setIsGeneratingPDF(true);

    printStudentReportCard({
      report: target,
      student,
      schoolClass: studentClass,
      schoolInfo,
      gradingConfig
    });

    setTimeout(() => {
      setIsGeneratingPDF(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Profile Section */}
        <div className="p-6 bg-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors no-print"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={student.photoUrl}
              alt={student.fullName}
              className="w-20 h-20 rounded-xl object-cover border-2 border-slate-700 shadow-md"
              referrerPolicy="no-referrer"
            />
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold font-display text-white">{student.fullName}</h2>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-400">
                  {student.enrollmentStatus}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <span className="font-mono font-medium">{student.studentIdNumber}</span>
                <span>·</span>
                <span className="font-semibold text-amber-300">{studentClass?.name || 'Class Assigned'}</span>
                <span>·</span>
                <span>{student.gender === 'male' ? 'Male' : 'Female'}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Enrolled: {student.enrollmentDate} · Single Source of Truth Profile
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Unboxed, clean) */}
          <div className="flex items-center gap-6 mt-6 border-t border-slate-800 pt-3 text-xs overflow-x-auto no-print">
            {[
              { id: 'overview', label: 'OVERVIEW' },
              { id: 'academic', label: 'ACADEMIC & REPORTS' },
              { id: 'attendance', label: 'ATTENDANCE' },
              { id: 'parent', label: 'PARENT / GUARDIAN' },
              { id: 'conduct', label: 'CONDUCT & REMARKS' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-1 font-semibold tracking-wider transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Personal Details
                </h4>
                <div className="text-xs space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date of Birth:</span>
                    <span className="font-medium text-slate-900">{student.dateOfBirth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hometown & Region:</span>
                    <span className="font-medium text-slate-900">{student.hometown}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gender:</span>
                    <span className="font-medium capitalize text-slate-900">{student.gender}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Location & Residence
                </h4>
                <div className="text-xs space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Residential Address:</span>
                    <span className="font-medium text-slate-900 text-right">{student.residentialAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ghana Post GPS:</span>
                    <span className="font-mono font-bold text-blue-900">{student.gpsAddress}</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 p-4 bg-white rounded-lg border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Academic Progress Quick View
                </h4>
                {latestReport ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <div className="text-slate-500">Term Average</div>
                      <div className="text-lg font-bold text-slate-900 font-display tabular-nums">
                        {latestReport.overallAverage}%
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Class Position</div>
                      <div className="text-lg font-bold text-blue-900 font-display tabular-nums">
                        #{latestReport.overallPosition} / {latestReport.classSize}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Attendance</div>
                      <div className="text-lg font-bold text-emerald-800 font-display tabular-nums">
                        {latestReport.attendanceDaysPresent} / {latestReport.attendanceTotalDays}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Report Status</div>
                      <div className="text-xs font-bold uppercase tracking-wider mt-1 text-emerald-700">
                        {latestReport.status}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No terminal scores entered for this student yet.</p>
                )}
              </div>
            </div>
          )}

          {/* ACADEMIC & REPORTS TAB */}
          {activeTab === 'academic' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between no-print">
                <span className="text-xs text-slate-500">
                  Showing official terminal report cards for {student.fullName}
                </span>
                {latestReport && (
                  <button
                    onClick={() => handleGeneratePDF()}
                    disabled={isGeneratingPDF}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-950 rounded-md transition-colors shadow-xs"
                    title="Generate PDF for offline distribution using official print styles"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isGeneratingPDF ? 'Generating PDF...' : 'Generate PDF (Offline Distribution)'}</span>
                  </button>
                )}
              </div>

              {studentReports.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-lg border border-dashed border-slate-200">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-medium">No terminal reports recorded yet.</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Teaching staff can enter scores under the Teacher workspace.
                  </p>
                </div>
              ) : (
                studentReports.map((report) => (
                  <div key={report.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
                    {/* Report Header for printing/viewing */}
                    <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                          Wisdom Scholars Academy · Official Terminal Report
                        </div>
                        <div className="text-base font-bold text-slate-900 font-display mt-0.5">
                          {studentClass?.name} · 2026/2027 Academic Session (Term 1)
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1.5">
                        <div className="text-xs font-mono font-bold text-slate-900">
                          Overall Position: #{report.overallPosition} of {report.classSize}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Average: <strong className="text-slate-800">{report.overallAverage}%</strong> · Total: {report.overallTotal}
                        </div>
                        <button
                          onClick={() => handleGeneratePDF(report)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded flex items-center gap-1 transition-colors no-print"
                          title="Generate PDF for this terminal report"
                        >
                          <FileDown className="w-3 h-3 text-blue-700" />
                          <span>Generate PDF</span>
                        </button>
                      </div>
                    </div>

                    {/* Scores Table */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                          <tr>
                            <th className="py-2.5 px-3 font-semibold">Subject</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Class Score ({gradingConfig.classScoreWeight}%)</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Exam Score ({gradingConfig.examScoreWeight}%)</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Total (100%)</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Grade</th>
                            <th className="py-2.5 px-3 font-semibold">Remark</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {report.scores.map((sc) => (
                            <tr key={sc.subjectId} className="hover:bg-slate-50/50">
                              <td className="py-2 px-3 font-medium text-slate-900">{sc.subjectName}</td>
                              <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-700">{sc.classScore}</td>
                              <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-700">{sc.examScore}</td>
                              <td className="py-2 px-3 text-right font-mono font-bold tabular-nums text-blue-900">{sc.totalScore}</td>
                              <td className="py-2 px-3 text-center font-mono font-extrabold text-slate-900">{sc.grade}</td>
                              <td className="py-2 px-3 text-slate-600">{sc.remark}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Remarks Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="font-semibold text-slate-800 mb-1">Class Teacher's Comment:</div>
                        <p className="text-slate-600 italic">"{report.teacherComment || 'Satisfactory'}"</p>
                      </div>

                      <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100">
                        <div className="font-semibold text-blue-900 mb-1">Headteacher's Assessment:</div>
                        <p className="text-blue-950 italic">"{report.headteacherComment || 'Approved'}"</p>
                        <div className="text-[10px] text-blue-700 mt-1 font-medium">
                          Signed: {schoolInfo.headteacherName}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ATTENDANCE TAB */}
          {activeTab === 'attendance' && (
            <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Student Attendance Record (Term 1)
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500">Days Present</div>
                  <div className="text-2xl font-bold text-emerald-700 font-display tabular-nums mt-1">
                    {latestReport ? latestReport.attendanceDaysPresent : 56}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500">Total School Days</div>
                  <div className="text-2xl font-bold text-slate-700 font-display tabular-nums mt-1">
                    {latestReport ? latestReport.attendanceTotalDays : 60}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500">Attendance Rate</div>
                  <div className="text-2xl font-bold text-blue-900 font-display tabular-nums mt-1">
                    {latestReport
                      ? Math.round((latestReport.attendanceDaysPresent / latestReport.attendanceTotalDays) * 100)
                      : 93}
                    %
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Regular attendance and punctuality are integral to student performance at Wisdom Scholars Academy.
              </p>
            </div>
          )}

          {/* PARENT / GUARDIAN TAB */}
          {activeTab === 'parent' && (
            <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Primary Parent / Guardian Contact
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500">Full Name:</span>
                  <div className="font-semibold text-slate-900 mt-0.5">{student.parentName}</div>
                </div>
                <div>
                  <span className="text-slate-500">Relationship:</span>
                  <div className="font-medium text-slate-900 mt-0.5">{student.parentRelationship}</div>
                </div>
                <div>
                  <span className="text-slate-500">Telephone / WhatsApp:</span>
                  <div className="font-mono font-bold text-blue-900 mt-0.5">{student.parentPhone}</div>
                </div>
                <div>
                  <span className="text-slate-500">Occupation:</span>
                  <div className="font-medium text-slate-900 mt-0.5">{student.parentOccupation}</div>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500">Emergency Secondary Contact:</span>
                  <div className="font-medium text-slate-800 mt-0.5">{student.emergencyContact}</div>
                </div>
              </div>
            </div>
          )}

          {/* CONDUCT TAB */}
          {activeTab === 'conduct' && (
            <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-4 text-xs">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Conduct & Character Assessment
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="font-semibold text-slate-800 block mb-1">General Conduct:</span>
                  <p className="text-slate-600">
                    {latestReport?.conduct || 'Respectful, obedient, and demonstrates high discipline.'}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="font-semibold text-slate-800 block mb-1">Interest & Attitude to Learning:</span>
                  <p className="text-slate-600">
                    {latestReport?.interestAndAttitude || 'Actively contributes to discussions and submits assignments promptly.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
