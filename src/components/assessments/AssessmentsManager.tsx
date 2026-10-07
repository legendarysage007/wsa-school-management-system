import React, { useState } from 'react';
import {
  Assessment,
  AssessmentStatus,
  SchoolClass,
  Subject,
  Student,
  TerminalReport,
  UserRole,
  GradingConfig
} from '../../types';
import { schoolStore } from '../../services/store';
import {
  FileText,
  Clock,
  Calendar,
  CheckCircle2,
  Plus,
  X,
  Check,
  Search,
  Users,
  Award,
  BookOpen,
  ArrowRight,
  Lock
} from 'lucide-react';

interface Props {
  assessments: Assessment[];
  classes: SchoolClass[];
  subjects: Subject[];
  students: Student[];
  reports: TerminalReport[];
  userRole: UserRole;
  canCreateAssessment: boolean;
  onEnterScores?: (classId: string, subjectId: string) => void;
  onInspectStudent?: (student: Student) => void;
}

export const AssessmentsManager: React.FC<Props> = ({
  assessments,
  classes,
  subjects,
  students,
  reports,
  userRole,
  canCreateAssessment,
  onEnterScores,
  onInspectStudent
}) => {
  const [temporalTab, setTemporalTab] = useState<AssessmentStatus>('current');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);

  // Form state for scheduling new assessment
  const [newTitle, setNewTitle] = useState('');
  const [newClassId, setNewClassId] = useState(classes[0]?.id || 'cls_jhs2');
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || 'sub_math');
  const [newStartDate, setNewStartDate] = useState('2026-10-15');
  const [newEndDate, setNewEndDate] = useState('2026-10-25');
  const [newType, setNewType] = useState<Assessment['assessmentType']>('mid_term');
  const [newMaxScore, setNewMaxScore] = useState<number>(30);
  const [newWeight, setNewWeight] = useState<number>(30);
  const [newInstructions, setNewInstructions] = useState('');

  // Selected assessment for student photo roster preview
  const [inspectingAssessmentId, setInspectingAssessmentId] = useState<string | null>(null);

  // Filter assessments by temporal state (Current, Upcoming, Past)
  const filteredAssessments = assessments.filter((a) => {
    if (temporalTab === 'current') return a.status === 'current';
    if (temporalTab === 'upcoming') return a.status === 'upcoming';
    if (temporalTab === 'completed') return a.status === 'completed';
    return true;
  });

  const handleSaveAssessment = () => {
    if (!newTitle.trim()) return;

    schoolStore.addAssessment({
      title: newTitle.trim(),
      academicYearId: 'ay_2026_2027',
      termId: 't_2026_1',
      classId: newClassId,
      subjectId: newSubjectId,
      startDate: newStartDate,
      endDate: newEndDate,
      assessmentType: newType,
      maxScore: newMaxScore,
      weightPercentage: newWeight,
      instructions: newInstructions || 'Official continuous assessment evaluation.'
    });

    setIsScheduleModalOpen(false);
    setNewTitle('');
    setNewInstructions('');
  };

  const currentCount = assessments.filter((a) => a.status === 'current').length;
  const upcomingCount = assessments.filter((a) => a.status === 'upcoming').length;
  const completedCount = assessments.filter((a) => a.status === 'completed').length;

  const inspectingAssessment = assessments.find((a) => a.id === inspectingAssessmentId);
  const inspectingClassStudents = inspectingAssessment
    ? students.filter((s) => s.classId === inspectingAssessment.classId)
    : [];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/70">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-purple-100 text-purple-900 rounded-md">
                <BookOpen className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-950">
                Academic Evaluation Engine
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-mono">
                Temporal Horizon: Current · Past · Future
              </span>
            </div>
            <h2 className="text-lg font-bold font-display text-slate-900 mt-1">
              Assessment Management System
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Scheduled examinations and continuous assessment tests organized by temporal state with prominent student photo rosters.
            </p>
          </div>

          {canCreateAssessment && (
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="px-3.5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Assessment</span>
            </button>
          )}
        </div>

        {/* 3-State Temporal Selector Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-200 text-xs font-semibold">
          {[
            {
              id: 'current' as const,
              label: `CURRENT ASSESSMENTS (${currentCount})`,
              badge: 'Active Now',
              desc: 'Continuous assessments open for score entry'
            },
            {
              id: 'upcoming' as const,
              label: `UPCOMING ASSESSMENTS (${upcomingCount})`,
              badge: 'Scheduled',
              desc: 'Future examination and project windows'
            },
            {
              id: 'completed' as const,
              label: `PAST ASSESSMENTS (${completedCount})`,
              badge: 'Historical',
              desc: 'Completed assessments and terminal records'
            }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setTemporalTab(tab.id);
                setInspectingAssessmentId(null);
              }}
              className={`pb-2.5 px-3 transition-colors text-left flex items-center gap-2 ${
                temporalTab === tab.id
                  ? 'text-blue-950 border-b-2 border-blue-900 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Assessment Cards Grid */}
      <div className="p-6">
        {filteredAssessments.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
            No assessments in this category currently.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAssessments.map((asm) => {
              const cls = classes.find((c) => c.id === asm.classId);
              const sub = subjects.find((s) => s.id === asm.subjectId);
              const classCount = students.filter((s) => s.classId === asm.classId).length;

              const statusBadgeClass =
                asm.status === 'current'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : asm.status === 'upcoming'
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200';

              return (
                <div
                  key={asm.id}
                  className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusBadgeClass}`}
                      >
                        {asm.status}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Weight: {asm.weightPercentage}% (Max {asm.maxScore})
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 font-display">
                      {asm.title}
                    </h3>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">Class:</span>
                        <span>{cls?.name || 'Assigned Class'}</span>
                        <span>·</span>
                        <span className="font-semibold text-slate-800">Subject:</span>
                        <span className="text-blue-900 font-bold">{sub?.name || 'All Core'}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 pt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{asm.startDate} to {asm.endDate}</span>
                      </div>
                    </div>

                    {asm.instructions && (
                      <p className="text-xs text-slate-500 italic line-clamp-2 pt-1">
                        "{asm.instructions}"
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setInspectingAssessmentId(asm.id)}
                      className="text-xs font-semibold text-slate-700 hover:text-slate-950 flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>View Scholars with Photos ({classCount})</span>
                    </button>

                    {asm.status === 'current' && onEnterScores && (
                      <button
                        onClick={() => onEnterScores(asm.classId, asm.subjectId)}
                        className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-md text-xs font-semibold shadow-2xs flex items-center gap-1 transition-colors"
                      >
                        <span>Enter Scores</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Student Photo Roster Modal */}
      {inspectingAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[88vh]">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-blue-900 tracking-wider">
                  Assessment Student Identification Roster
                </span>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  {inspectingAssessment.title} · {classes.find((c) => c.id === inspectingAssessment.classId)?.name}
                </h3>
              </div>
              <button
                onClick={() => setInspectingAssessmentId(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3">
              <p className="text-xs text-slate-600">
                Scholars enrolled for this assessment. Photos are provided for immediate identification during score entry and verification:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {inspectingClassStudents.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => {
                      if (onInspectStudent) {
                        onInspectStudent(st);
                        setInspectingAssessmentId(null);
                      }
                    }}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3 hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <img
                      src={st.photoUrl}
                      alt={st.fullName}
                      className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-900">{st.fullName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{st.studentIdNumber}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold uppercase mt-0.5">
                        {st.enrollmentStatus}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setInspectingAssessmentId(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Assessment Modal (Administrator) */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-blue-900 tracking-wider">
                  Assessment Scheduler
                </span>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Create Assessment Event
                </h3>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assessment Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Term 1 Mathematics Mid-Term Test"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class</label>
                  <select
                    value={newClassId}
                    onChange={(e) => setNewClassId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={newSubjectId}
                    onChange={(e) => setNewSubjectId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="mid_term">Mid-Term Assessment</option>
                    <option value="terminal_exam">Terminal Examination</option>
                    <option value="class_test">Continuous Class Test</option>
                    <option value="project">Project Work</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Weight (%)</label>
                  <input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Evaluation Instructions
                </label>
                <textarea
                  rows={2}
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  placeholder="Instructions for teachers and scholars..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssessment}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Assessment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
