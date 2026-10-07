import React, { useState } from 'react';
import { TerminalReport, Student, SchoolClass, SchoolInfo, GradingConfig } from '../../types';
import { printStudentReportCard } from '../../utils/printReportCard';
import { Printer, Download, X, CheckCircle2, ShieldCheck, Award, Calendar, FileText, ArrowLeft } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  report: TerminalReport | null;
  student: Student | null;
  schoolClass?: SchoolClass;
  schoolInfo: SchoolInfo;
  gradingConfig: GradingConfig;
  userRole?: 'parent' | 'headteacher' | 'admin' | 'teacher' | 'superadmin';
  onApprove?: (reportId: string, headteacherComment: string) => void;
}

export const ReportCardPreview: React.FC<Props> = ({
  isOpen,
  onClose,
  report,
  student,
  schoolClass,
  schoolInfo,
  gradingConfig,
  userRole = 'parent',
  onApprove
}) => {
  const [headteacherRemarkInput, setHeadteacherRemarkInput] = useState<string>(
    report?.headteacherComment || 'Exemplary intellectual diligence and moral discipline. Promoted with honours.'
  );
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  if (!isOpen || !report || !student) return null;

  const attendancePercent =
    report.attendanceTotalDays > 0
      ? Math.round((report.attendanceDaysPresent / report.attendanceTotalDays) * 100)
      : 100;

  const handlePrint = () => {
    setIsPrinting(true);
    printStudentReportCard({
      report,
      student,
      schoolClass,
      schoolInfo,
      gradingConfig
    });
    setTimeout(() => {
      setIsPrinting(false);
    }, 1200);
  };

  const handleApproveAndPublish = () => {
    if (onApprove && report) {
      setIsApproving(true);
      onApprove(report.id, headteacherRemarkInput);
      setTimeout(() => {
        setIsApproving(false);
        onClose();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-4xl overflow-hidden flex flex-col max-h-[96vh]">
        {/* Top Control Bar - Strictly Hidden in Print Media Query */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 no-print border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-600/30 text-blue-300 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 font-display block">
                Official Report Card · Physical Distribution Print Preview
              </span>
              <span className="text-[11px] text-slate-300">
                A4 Portrait Layout · Adheres to @media print CSS rules for clean offline printing
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Headteacher Approval Quick Action in Preview */}
            {userRole === 'headteacher' && report.status === 'submitted' && onApprove && (
              <button
                onClick={handleApproveAndPublish}
                disabled={isApproving}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isApproving ? 'Approving...' : 'Approve & Publish'}</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="px-4 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded-md text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isPrinting ? 'Printing...' : 'Print / Save PDF (A4)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-5 flex-1 bg-slate-100/50">
          <div className="print-report-container max-w-[800px] mx-auto bg-white p-6 sm:p-8 border-2 border-slate-900 shadow-sm text-slate-900 font-sans">
            {/* Header: School Official Seal & Metadata */}
            <div className="text-center border-b-2 border-slate-900 pb-4 mb-4">
              <div className="flex items-center justify-center gap-4 mb-2">
                <img
                  src={schoolInfo.logoUrl}
                  alt="Wisdom Scholars Academy Seal"
                  className="w-16 h-16 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase font-display leading-tight">
                {schoolInfo.name}
              </h1>

              <div className="text-xs font-medium text-slate-700 mt-1">
                {schoolInfo.location}, {schoolInfo.city}, Ghana · GPS: {schoolInfo.gpsAddress}
              </div>

              <div className="text-[11px] text-slate-600 italic mt-0.5">
                Motto: <strong className="text-slate-900 font-semibold uppercase font-sans">"{schoolInfo.motto}"</strong> · Tel: {schoolInfo.phone} · Email: {schoolInfo.email}
              </div>

              <div className="mt-3 inline-block bg-slate-900 text-white px-4 py-1 rounded text-xs font-extrabold uppercase tracking-widest font-display">
                Continuous Assessment & Terminal Examination Report
              </div>
            </div>

            {/* Student Bio Strip */}
            <div className="border border-slate-300 rounded-lg p-3 bg-slate-50/70 mb-4 print-break-inside-avoid">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {student.photoUrl ? (
                  <img
                    src={student.photoUrl}
                    alt={student.fullName}
                    className="w-16 h-16 rounded-md object-cover border border-slate-300 shadow-2xs shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-md bg-blue-900 text-white font-extrabold text-xl flex items-center justify-center shrink-0">
                    {student.fullName.charAt(0)}
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-1 text-xs w-full">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Name of Scholar</span>
                    <strong className="text-slate-950 font-bold text-sm">{student.fullName}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Student ID Number</span>
                    <strong className="text-slate-900 font-mono font-bold">{student.studentIdNumber}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Class / Grade</span>
                    <strong className="text-slate-900">{schoolClass?.name || 'Class Assigned'}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Academic Session & Term</span>
                    <strong className="text-slate-900">
                      {report.academicYearId === 'ay_2026_2027' ? '2026/2027 Session' : 'Prior Session'} · Term 1
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Class Enrollment</span>
                    <strong className="text-slate-900">{report.classSize} Scholars</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Overall Position</span>
                    <strong className="text-blue-900 font-extrabold text-sm">
                      #{report.overallPosition} <span className="text-[10px] text-slate-500 font-normal">of {report.classSize}</span>
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Term Attendance</span>
                    <strong className="text-slate-900">
                      {report.attendanceDaysPresent} / {report.attendanceTotalDays} Days ({attendancePercent}%)
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Report Status</span>
                    <strong className="text-emerald-700 font-bold uppercase text-[11px]">
                      {report.status}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Performance Table */}
            <div className="mb-4 print-break-inside-avoid">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Continuous Assessment & Exam Results</span>
                <span className="text-[10px] font-mono font-normal text-slate-500">
                  Class Weight: {gradingConfig.classScoreWeight}% · Exam Weight: {gradingConfig.examScoreWeight}%
                </span>
              </div>

              <div className="border border-slate-900 rounded overflow-hidden">
                <table className="print-table w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-900">
                    <tr>
                      <th className="py-2 px-3 border-r border-slate-300">Subject</th>
                      <th className="py-2 px-3 text-right border-r border-slate-300">
                        Class Score ({gradingConfig.classScoreWeight}%)
                      </th>
                      <th className="py-2 px-3 text-right border-r border-slate-300">
                        Exam Score ({gradingConfig.examScoreWeight}%)
                      </th>
                      <th className="py-2 px-3 text-right border-r border-slate-300 font-bold">
                        Total (100%)
                      </th>
                      <th className="py-2 px-3 text-center border-r border-slate-300">Grade</th>
                      <th className="py-2 px-3">Remark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {report.scores.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-slate-500 italic">
                          No subject scores entered yet for this terminal report.
                        </td>
                      </tr>
                    ) : (
                      report.scores.map((sc) => (
                        <tr key={sc.subjectId}>
                          <td className="py-1.5 px-3 font-semibold text-slate-900 border-r border-slate-200">
                            {sc.subjectName}
                          </td>
                          <td className="py-1.5 px-3 text-right font-mono text-slate-700 border-r border-slate-200">
                            {sc.classScore}
                          </td>
                          <td className="py-1.5 px-3 text-right font-mono text-slate-700 border-r border-slate-200">
                            {sc.examScore}
                          </td>
                          <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-950 border-r border-slate-200 tabular-nums">
                            {sc.totalScore}
                          </td>
                          <td className="py-1.5 px-3 text-center font-mono font-extrabold text-slate-900 border-r border-slate-200">
                            {sc.grade}
                          </td>
                          <td className="py-1.5 px-3 text-slate-700">{sc.remark}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance Aggregate Metrics */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-300 rounded mb-4 text-center text-xs print-break-inside-avoid">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Overall Aggregate Total</span>
                <span className="text-base font-black text-slate-900 font-display tabular-nums">
                  {report.overallTotal}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Overall Term Average</span>
                <span className="text-base font-black text-slate-900 font-display tabular-nums">
                  {report.overallAverage}%
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Rank in Class</span>
                <span className="text-base font-black text-blue-900 font-display">
                  #{report.overallPosition} / {report.classSize}
                </span>
              </div>
            </div>

            {/* Remarks Section */}
            <div className="space-y-2.5 text-xs mb-5 print-break-inside-avoid">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="font-bold text-slate-800 text-[11px] block mb-0.5">Conduct & Character:</span>
                <p className="text-slate-700">
                  {report.conduct || 'Respectful, orderly, and demonstrates commendable moral standard.'}
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="font-bold text-slate-800 text-[11px] block mb-0.5">Class Teacher's Remark:</span>
                <p className="text-slate-700 italic">
                  "{report.teacherComment || 'Satisfactory academic performance and steady classroom progress.'}"
                </p>
              </div>

              <div className="p-2.5 bg-blue-50/50 border border-blue-200 rounded">
                <span className="font-bold text-blue-900 text-[11px] block mb-0.5">Headteacher's Assessment:</span>
                {userRole === 'headteacher' && report.status === 'submitted' ? (
                  <textarea
                    rows={2}
                    value={headteacherRemarkInput}
                    onChange={(e) => setHeadteacherRemarkInput(e.target.value)}
                    className="w-full px-2 py-1 border border-blue-300 rounded text-xs bg-white focus:outline-none"
                    placeholder="Enter official headteacher comment..."
                  />
                ) : (
                  <p className="text-blue-950 italic">
                    "{report.headteacherComment || headteacherRemarkInput}"
                  </p>
                )}
              </div>
            </div>

            {/* Official Signatures & Seal Verification Block */}
            <div className="pt-4 border-t-2 border-slate-900 grid grid-cols-3 gap-4 text-center text-xs print-break-inside-avoid">
              <div className="flex flex-col justify-end">
                <div className="border-b border-slate-400 h-8 mb-1"></div>
                <span className="font-semibold text-slate-800 text-[11px]">Class Teacher Signature</span>
                <span className="text-[10px] text-slate-500">Date: _______________</span>
              </div>

              <div className="flex flex-col items-center justify-center p-2 border border-dashed border-slate-300 rounded bg-slate-50/50">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Official Stamp</span>
                <div className="w-12 h-12 rounded-full border-2 border-slate-300 border-dashed flex items-center justify-center text-[9px] text-slate-400 font-bold my-1">
                  SEAL
                </div>
                <span className="text-[10px] text-slate-500">Registrar / Academic Office</span>
              </div>

              <div className="flex flex-col justify-end">
                <div className="border-b border-slate-400 h-8 mb-1"></div>
                <span className="font-semibold text-slate-800 text-[11px]">{schoolInfo.headteacherName}</span>
                <span className="text-[10px] text-slate-500">Headteacher Signature</span>
              </div>
            </div>

            {/* Next Term Reopening Strip */}
            <div className="mt-4 pt-2 border-t border-slate-200 text-center text-[10px] text-slate-500">
              Next Term Resumes: <strong className="text-slate-800">Tuesday, 12th January 2027</strong> · Prompt fee clearance ensures uninterrupted academic participation.
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer - Hidden in Print */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between no-print">
          <span className="text-xs text-slate-500">
            Wisdom Scholars Academy · Official Continuous Assessment System
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print to PDF</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
