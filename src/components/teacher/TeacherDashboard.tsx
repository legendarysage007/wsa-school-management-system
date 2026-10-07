import React, { useState } from 'react';
import {
  User,
  Student,
  SchoolClass,
  Subject,
  TerminalReport,
  AttendanceSession,
  GradingConfig,
  Assessment
} from '../../types';
import { schoolStore } from '../../services/store';
import {
  BookOpen,
  CheckCircle2,
  Users,
  Clock,
  QrCode,
  ArrowRight,
  Save,
  Check,
  Award,
  AlertCircle,
  Plus,
  Calendar,
  CalendarCheck,
  History,
  FileCheck2,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

interface Props {
  activeUser: User | null;
  classes: SchoolClass[];
  subjects: Subject[];
  students: Student[];
  reports: TerminalReport[];
  sessions: AttendanceSession[];
  gradingConfig: GradingConfig;
  assessments?: Assessment[];
  onOpenDynamicQRSession: (session: AttendanceSession) => void;
}

export const TeacherDashboard: React.FC<Props> = ({
  activeUser,
  classes,
  subjects,
  students,
  reports,
  sessions,
  gradingConfig,
  assessments = [],
  onOpenDynamicQRSession
}) => {
  // Assigned classes: if teacher has assignedClassIds use them, otherwise fallback to JHS 2 / JHS 3 or first classes
  const assignedClassIds = activeUser?.assignedClassIds || ['cls_jhs2', 'cls_jhs3'];
  const teacherClasses = classes.filter((c) => assignedClassIds.includes(c.id));
  const activeClass = teacherClasses[0] || classes[0];

  // Assigned subjects: math and science or all subjects
  const assignedSubjectIds = activeUser?.assignedSubjectIds || ['sub_math', 'sub_sci'];
  const teacherSubjects = subjects.filter((s) => assignedSubjectIds.includes(s.id));
  const activeSubject = teacherSubjects[0] || subjects[0];

  // Primary Workspace Tab Navigation
  const [workspaceTab, setWorkspaceTab] = useState<'score_entry' | 'assessment_system' | 'attendance'>('score_entry');

  // Workflow state: Step 1 (Class) -> Step 2 (Subject) -> Step 3 (Scores & Comment) -> Done!
  const [selectedClassId, setSelectedClassId] = useState<string>(activeClass?.id || 'cls_jhs2');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(activeSubject?.id || 'sub_math');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  // Assessment System Sub-tab: current, past, future
  const [assessmentFilter, setAssessmentFilter] = useState<'current' | 'past' | 'future'>('current');
  const [isNewAssessmentModalOpen, setIsNewAssessmentModalOpen] = useState<boolean>(false);
  const [newAssessmentTitle, setNewAssessmentTitle] = useState<string>('');
  const [newAssessmentType, setNewAssessmentType] = useState<Assessment['assessmentType']>('mid_term');
  const [newAssessmentMaxScore, setNewAssessmentMaxScore] = useState<number>(30);
  const [newAssessmentWeight, setNewAssessmentWeight] = useState<number>(30);
  const [newAssessmentStartDate, setNewAssessmentStartDate] = useState<string>('2026-11-02');
  const [newAssessmentEndDate, setNewAssessmentEndDate] = useState<string>('2026-11-06');
  const [newAssessmentInstructions, setNewAssessmentInstructions] = useState<string>('');

  // Score Entry Inputs for the selected student
  const [classScoreInput, setClassScoreInput] = useState<number>(26);
  const [examScoreInput, setExamScoreInput] = useState<number>(62);
  const [teacherCommentInput, setTeacherCommentInput] = useState<string>(
    'Demonstrates consistent diligence and analytical thinking in lessons.'
  );
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Quick Daily Student Attendance checklist
  const [studentAttendanceMap, setStudentAttendanceMap] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  const currentClassStudents = students.filter((s) => s.classId === selectedClassId);
  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);
  const activeStudent = students.find((s) => s.id === selectedStudentId);

  // Initialize selected student
  React.useEffect(() => {
    if (currentClassStudents.length > 0 && (!selectedStudentId || !currentClassStudents.some((s) => s.id === selectedStudentId))) {
      handleSelectStudent(currentClassStudents[0].id);
    }
  }, [selectedClassId, currentClassStudents]);

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setSaveSuccessMessage(null);

    // Load existing scores if already saved
    const existingReport = reports.find(
      (r) =>
        r.studentId === studentId &&
        r.academicYearId === 'ay_2026_2027' &&
        r.termId === 't_2026_1'
    );

    if (existingReport) {
      const subScore = existingReport.scores.find((s) => s.subjectId === selectedSubjectId);
      if (subScore) {
        setClassScoreInput(subScore.classScore);
        setExamScoreInput(subScore.examScore);
      } else {
        setClassScoreInput(25);
        setExamScoreInput(58);
      }
      setTeacherCommentInput(existingReport.teacherComment || 'Making steady progress in class.');
    } else {
      setClassScoreInput(25);
      setExamScoreInput(58);
      setTeacherCommentInput('Shows positive attitude and regular participation in class activities.');
    }
  };

  const handleSaveScores = () => {
    if (!selectedStudentId || !selectedSubject) return;

    // Get existing report or start fresh
    const existingReport = reports.find(
      (r) =>
        r.studentId === selectedStudentId &&
        r.academicYearId === 'ay_2026_2027' &&
        r.termId === 't_2026_1'
    );

    let subjectScoresList = existingReport ? [...existingReport.scores] : [];

    const existingSubIndex = subjectScoresList.findIndex((s) => s.subjectId === selectedSubjectId);
    const total = classScoreInput + examScoreInput;
    const { grade, remark } = schoolStore.getState().gradingConfig
      ? { grade: total >= 80 ? '1' : total >= 70 ? '2' : total >= 65 ? '3' : '4', remark: 'Credit / Good' }
      : { grade: '1', remark: 'Good' };

    const newScoreObj = {
      subjectId: selectedSubjectId,
      subjectName: selectedSubject.name,
      classScore: classScoreInput,
      examScore: examScoreInput,
      totalScore: total,
      grade,
      remark
    };

    if (existingSubIndex >= 0) {
      subjectScoresList[existingSubIndex] = newScoreObj;
    } else {
      subjectScoresList.push(newScoreObj);
    }

    schoolStore.saveSubjectScores(
      selectedStudentId,
      selectedClassId,
      subjectScoresList,
      teacherCommentInput
    );

    const targetStudent = students.find((s) => s.id === selectedStudentId);
    setSaveSuccessMessage(`Successfully saved ${selectedSubject.name} scores for ${targetStudent?.fullName}!`);
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssessmentTitle.trim()) return;

    schoolStore.addAssessment({
      title: newAssessmentTitle.trim(),
      academicYearId: 'ay_2026_2027',
      termId: 't_2026_1',
      classId: selectedClassId,
      subjectId: selectedSubjectId,
      startDate: newAssessmentStartDate,
      endDate: newAssessmentEndDate,
      assessmentType: newAssessmentType,
      maxScore: Number(newAssessmentMaxScore),
      weightPercentage: Number(newAssessmentWeight),
      instructions: newAssessmentInstructions.trim()
    });

    setIsNewAssessmentModalOpen(false);
    setNewAssessmentTitle('');
    setNewAssessmentInstructions('');
  };

  const handleSaveClassAttendance = () => {
    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 3000);
  };

  // Filter assessments based on current filter and class
  const classAssessments = assessments.filter((a) => {
    const matchClass = !a.classId || a.classId === selectedClassId || a.classId.startsWith('cls_jhs');
    if (assessmentFilter === 'current') return matchClass && a.status === 'current';
    if (assessmentFilter === 'past') return matchClass && a.status === 'completed';
    return matchClass && a.status === 'upcoming';
  });

  return (
    <div className="space-y-6">
      {/* Welcome & Teacher Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
            Wisdom Scholars Academy · Faculty Workspace
          </span>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-0.5">
            Good morning, {activeUser?.name || 'Teacher'} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visual Scholar Identification · Continuous Assessment, Past & Upcoming Exam System · Classroom Attendance
          </p>
        </div>
      </div>

      {/* Primary Workspace Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-6 pt-3 rounded-t-xl overflow-x-auto">
        <button
          onClick={() => setWorkspaceTab('score_entry')}
          className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
            workspaceTab === 'score_entry'
              ? 'border-blue-900 text-blue-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-blue-800" />
          <span>1. Continuous Score Entry</span>
        </button>

        <button
          onClick={() => setWorkspaceTab('assessment_system')}
          className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
            workspaceTab === 'assessment_system'
              ? 'border-blue-900 text-blue-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4 text-amber-700" />
          <span>2. Assessments & Exams System ({assessments.length})</span>
        </button>

        <button
          onClick={() => setWorkspaceTab('attendance')}
          className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
            workspaceTab === 'attendance'
              ? 'border-blue-900 text-blue-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-700" />
          <span>3. Daily Attendance Register</span>
        </button>
      </div>

      {/* TAB 1: 3-STEP SCORE ENTRY WORKFLOW WITH VISUAL SCHOLAR IDENTIFICATION */}
      {workspaceTab === 'score_entry' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 shadow-xs overflow-hidden">
          {/* Breadcrumb Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="text-blue-900 font-bold uppercase tracking-wider">Workflow:</span>
              <span className="text-slate-400">Step 1: Class</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-400">Step 2: Subject</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-900 font-bold">Step 3: Scholar Photo & Score Entry</span>
            </div>

            <span className="text-xs font-mono text-slate-500">
              Weights: Class ({gradingConfig.classScoreWeight}%) · Exam ({gradingConfig.examScoreWeight}%)
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* STEP 1: Select My Class */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Step 1: Select Class
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {teacherClasses.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                      selectedClassId === cls.id
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cls.name}
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: Select My Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Step 2: Select Subject
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {teacherSubjects.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubjectId(sub.id);
                      if (selectedStudentId) handleSelectStudent(selectedStudentId);
                    }}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                      selectedSubjectId === sub.id
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 3: Student Selection with Photo & Instant Score Entry */}
            <div className="pt-4 border-t border-slate-200">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Step 3: Scholar Identification & Score Entry · {selectedClass?.name} ({selectedSubject?.name})
              </label>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Scholar Roster with Photos for Easy Identification */}
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
                  <div className="px-3.5 py-2.5 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Select Scholar ({currentClassStudents.length})</span>
                    <span className="text-[10px] text-slate-500 font-normal">Photos Enabled</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                    {currentClassStudents.length === 0 ? (
                      <div className="p-8 text-center text-slate-500">
                        <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        <p className="text-xs font-semibold text-slate-700">No Scholars Enrolled</p>
                        <p className="text-[11px] text-slate-500 mt-1">This class currently has zero registered learners in the school directory.</p>
                      </div>
                    ) : (
                      currentClassStudents.map((st) => {
                        const isSelected = selectedStudentId === st.id;
                        const report = reports.find(
                          (r) =>
                            r.studentId === st.id &&
                            r.academicYearId === 'ay_2026_2027' &&
                            r.termId === 't_2026_1'
                        );
                        const hasSubjectScore = report?.scores.some((s) => s.subjectId === selectedSubjectId);

                        return (
                          <button
                            key={st.id}
                            onClick={() => handleSelectStudent(st.id)}
                            className={`w-full px-3.5 py-2.5 text-left text-xs transition-colors flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-blue-50 text-blue-950 font-bold border-l-4 border-blue-900'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {/* Scholar Photo for Easy Identification */}
                              {st.photoUrl ? (
                                <img
                                  src={st.photoUrl}
                                  alt={st.fullName}
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0 shadow-2xs"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-blue-900 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                                  {st.fullName.charAt(0)}
                                </div>
                              )}
                              <div>
                                <div className="font-semibold text-slate-900">{st.fullName}</div>
                                <div className="text-[11px] font-mono text-slate-500">{st.studentIdNumber}</div>
                              </div>
                            </div>

                            {hasSubjectScore ? (
                              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5 shrink-0 bg-emerald-50 px-2 py-0.5 rounded">
                                <Check className="w-3 h-3" />
                                <span>Entered</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 shrink-0">Pending</span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Active Scholar Card with Large Photo & Score Input */}
                <div className="lg:col-span-2 p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  {saveSuccessMessage && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-lg flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{saveSuccessMessage}</span>
                    </div>
                  )}

                  {/* Active Scholar Banner with Photo */}
                  {activeStudent ? (
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-3.5">
                        {activeStudent.photoUrl ? (
                          <img
                            src={activeStudent.photoUrl}
                            alt={activeStudent.fullName}
                            className="w-14 h-14 rounded-xl object-cover border-2 border-slate-300 shadow-xs"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-blue-900 text-white font-bold flex items-center justify-center text-xl shadow-xs">
                            {activeStudent.fullName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="text-xs text-slate-500 font-medium">Active Scholar:</div>
                          <div className="text-base font-bold text-slate-900 font-display">
                            {activeStudent.fullName}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">
                            ID: {activeStudent.studentIdNumber} · Class: {selectedClass?.name}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-slate-500">Subject:</div>
                        <div className="text-xs font-bold text-blue-900">{selectedSubject?.name}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500 bg-white rounded-lg border border-dashed border-slate-300">
                      <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-700">No Scholar Selected</p>
                      <p className="text-[11px] text-slate-400 mt-1">Select an enrolled scholar from the roster to enter continuous assessment scores.</p>
                    </div>
                  )}

                  {/* Score Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Class Continuous Score (Max {gradingConfig.classScoreWeight})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={gradingConfig.classScoreWeight}
                        value={classScoreInput}
                        onChange={(e) =>
                          setClassScoreInput(
                            Math.min(gradingConfig.classScoreWeight, Math.max(0, Number(e.target.value)))
                          )
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono font-bold focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Terminal Exam Score (Max {gradingConfig.examScoreWeight})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={gradingConfig.examScoreWeight}
                        value={examScoreInput}
                        onChange={(e) =>
                          setExamScoreInput(
                            Math.min(gradingConfig.examScoreWeight, Math.max(0, Number(e.target.value)))
                          )
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono font-bold focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
                      />
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                      <div className="text-[11px] text-slate-500 font-semibold uppercase">Total Score / 100</div>
                      <div className="text-2xl font-bold font-display text-blue-900 tabular-nums">
                        {classScoreInput + examScoreInput}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Teacher's Terminal Comment & Feedback
                    </label>
                    <textarea
                      rows={2}
                      value={teacherCommentInput}
                      onChange={(e) => setTeacherCommentInput(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none"
                      placeholder="Enter professional academic assessment and conduct remark..."
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleSaveScores}
                      className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>SAVE SCORES (DONE)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CURRENT, PAST & FUTURE ASSESSMENT REPORT SYSTEM */}
      {workspaceTab === 'assessment_system' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Continuous Assessment & Exam Registry · {selectedClass?.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Track current classroom tests, historical past term exams, and upcoming scheduled assessment timetables.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
                <button
                  onClick={() => setAssessmentFilter('current')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                    assessmentFilter === 'current'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Current Tests</span>
                </button>

                <button
                  onClick={() => setAssessmentFilter('future')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                    assessmentFilter === 'future'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Future Scheduled</span>
                </button>

                <button
                  onClick={() => setAssessmentFilter('past')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                    assessmentFilter === 'past'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Past Exams Archive</span>
                </button>
              </div>

              <button
                onClick={() => setIsNewAssessmentModalOpen(true)}
                className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule New Assessment</span>
              </button>
            </div>
          </div>

          {/* Assessment List */}
          <div className="space-y-4">
            {classAssessments.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No {assessmentFilter} assessments found for this grade</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Click 'Schedule New Assessment' above to add continuous tests or terminal examinations.
                </p>
              </div>
            ) : (
              classAssessments.map((asm) => (
                <div
                  key={asm.id}
                  className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors space-y-3"
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
                        <span className="text-xs font-semibold text-blue-900">
                          {subjects.find((s) => s.id === asm.subjectId)?.name || 'Subject'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 font-display mt-1">{asm.title}</h3>
                      <p className="text-xs text-slate-600 mt-0.5">{asm.instructions}</p>
                    </div>

                    <div className="text-right shrink-0 text-xs text-slate-500 flex sm:flex-col items-center sm:items-end gap-1">
                      <div>
                        Max Score: <strong className="text-slate-900">{asm.maxScore}</strong> · Weight: <strong className="text-slate-900">{asm.weightPercentage}%</strong>
                      </div>
                      <div className="font-mono text-slate-600">
                        {asm.startDate} to {asm.endDate}
                      </div>
                    </div>
                  </div>

                  {/* Scholars in this class with their pictures and performance preview */}
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Class Roster & Visual Identification ({currentClassStudents.length} Scholars)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {currentClassStudents.map((st) => (
                        <div
                          key={st.id}
                          className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2 text-xs"
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
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DAILY ATTENDANCE REGISTER WITH STUDENT PHOTOS */}
      {workspaceTab === 'attendance' && (
        <div className="bg-white rounded-b-xl p-6 border border-t-0 border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Daily Class Attendance Register · {selectedClass?.name}
              </h3>
              <p className="text-xs text-slate-500">
                Mark attendance with visual scholar verification. Directly updates student terminal reports.
              </p>
            </div>

            <button
              onClick={handleSaveClassAttendance}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{attendanceSaved ? 'Attendance Register Saved!' : 'Save Attendance Register'}</span>
            </button>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Scholar Photo & Name</th>
                  <th className="py-2.5 px-4 font-semibold">Student ID</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentClassStudents.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-500">
                      <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-700">No Scholars Enrolled in {selectedClass?.name}</p>
                      <p className="text-[11px] text-slate-500 mt-1">Enroll learners via the Administrator portal to take daily classroom attendance.</p>
                    </td>
                  </tr>
                ) : (
                  currentClassStudents.map((st) => {
                    const currentStatus = studentAttendanceMap[st.id] || 'present';
                    return (
                      <tr key={st.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-3">
                            {st.photoUrl ? (
                              <img
                                src={st.photoUrl}
                                alt={st.fullName}
                                className="w-8 h-8 rounded-lg object-cover border border-slate-200 shadow-2xs"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-blue-900 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                                {st.fullName.charAt(0)}
                              </div>
                            )}
                            <span className="font-semibold text-slate-900">{st.fullName}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-500">{st.studentIdNumber}</td>
                        <td className="py-2.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1 bg-slate-100 p-0.5 rounded-md">
                            {(['present', 'late', 'absent'] as const).map((status) => (
                              <button
                                key={status}
                                onClick={() =>
                                  setStudentAttendanceMap((prev) => ({ ...prev, [st.id]: status }))
                                }
                                className={`px-3 py-1 rounded text-[11px] font-semibold capitalize transition-colors ${
                                  currentStatus === status
                                    ? status === 'present'
                                      ? 'bg-emerald-600 text-white'
                                      : status === 'late'
                                      ? 'bg-amber-600 text-white'
                                      : 'bg-rose-600 text-white'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: SCHEDULE NEW ASSESSMENT */}
      {isNewAssessmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold font-display">Schedule Assessment or Examination</h3>
              <button
                onClick={() => setIsNewAssessmentModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssessment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assessment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid-Term Algebra & Plane Geometry Test"
                  value={newAssessmentTitle}
                  onChange={(e) => setNewAssessmentTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={newAssessmentType}
                    onChange={(e) => setNewAssessmentType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="mid_term">Mid-Term Assessment</option>
                    <option value="terminal_exam">Terminal Examination</option>
                    <option value="class_test">Class Test / Quiz</option>
                    <option value="project">Project / Practical</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Weight (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newAssessmentWeight}
                    onChange={(e) => setNewAssessmentWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newAssessmentStartDate}
                    onChange={(e) => setNewAssessmentStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newAssessmentEndDate}
                    onChange={(e) => setNewAssessmentEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Syllabus & Instructions</label>
                <textarea
                  rows={3}
                  placeholder="Topics covered, allowed materials, venue instructions..."
                  value={newAssessmentInstructions}
                  onChange={(e) => setNewAssessmentInstructions(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewAssessmentModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-lg"
                >
                  Schedule Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
