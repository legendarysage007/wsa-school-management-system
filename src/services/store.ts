import {
  User,
  SchoolInfo,
  AcademicYear,
  SchoolClass,
  Subject,
  Student,
  GradingConfig,
  TerminalReport,
  AttendanceSession,
  AttendanceRecord,
  SchoolEvent,
  SchoolAnnouncement,
  AuditLogItem,
  DeviceSession,
  UserRole,
  DynamicAttendanceToken,
  SubjectScore,
  Assessment,
  AcademicCalendarEvent
} from '../types';

import ACADEMY_LOGO from '../assets/images/wisdom_scholars_logo_1791369310472.jpg';
import CAMPUS_IMAGE from '../assets/images/campus_banner_1791142302649.jpg';

const STORAGE_KEY = 'wsa_school_portal_data_v4_clean';
const SESSION_USER_KEY = 'wsa_active_user_session';
const PREVIEW_ROLE_KEY = 'wsa_preview_role_override';
const DEVICE_ID_KEY = 'wsa_client_device_id';

export function getDeviceId(): string {
  let devId = localStorage.getItem(DEVICE_ID_KEY);
  if (!devId) {
    devId = 'dev_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    localStorage.setItem(DEVICE_ID_KEY, devId);
  }
  return devId;
}

// Automatically evaluate assessment status based on current date
export function computeAssessmentStatus(startDate: string, endDate: string): 'upcoming' | 'current' | 'completed' {
  const today = new Date().toISOString().split('T')[0];
  if (today < startDate) return 'upcoming';
  if (today > endDate) return 'completed';
  return 'current';
}

// Server-side authoritative timestamp (simulated official school server clock)
export function getServerTime(): Date {
  return new Date();
}

export function getServerISOString(): string {
  return getServerTime().toISOString();
}

// Generate dynamic 2-minute attendance token
export function generate2MinToken(sessionId: string): DynamicAttendanceToken {
  const now = Date.now();
  const tokenString = 'WSA-QR-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + (now % 100000);
  return {
    token: tokenString,
    sessionId,
    generatedAt: now,
    expiresAt: now + 2 * 60 * 1000 // 120,000ms = 2 mins
  };
}

export interface AppState {
  schoolInfo: SchoolInfo;
  academicYears: AcademicYear[];
  currentAcademicYearId: string;
  currentTermId: string;
  classes: SchoolClass[];
  subjects: Subject[];
  students: Student[];
  gradingConfig: GradingConfig;
  reports: TerminalReport[];
  assessments: Assessment[];
  calendarEvents: AcademicCalendarEvent[];
  attendanceSessions: AttendanceSession[];
  attendanceRecords: AttendanceRecord[];
  events: SchoolEvent[];
  announcements: SchoolAnnouncement[];
  users: User[];
  deviceSessions: DeviceSession[];
  auditLogs: AuditLogItem[];
}

const DEFAULT_USERS: User[] = [
  {
    id: 'usr_superadmin_1',
    name: 'Dr. Kwabena Mensah',
    email: 'superadmin@wisdomscholars.edu.gh',
    role: 'superadmin',
    phone: '+233 24 411 2233',
    staffId: 'WSA-DIR-001',
    title: 'Director',
    status: 'active',
    lastLoginAt: new Date().toISOString()
  },
  {
    id: 'usr_admin_1',
    name: 'Mrs. Grace Boateng',
    email: 'admin@wisdomscholars.edu.gh',
    role: 'admin',
    phone: '+233 20 890 1234',
    staffId: 'WSA-ADM-002',
    title: 'Administrator',
    status: 'active',
    lastLoginAt: new Date().toISOString()
  },
  {
    id: 'usr_headteacher_1',
    name: 'Rev. Dr. Joseph Osei',
    email: 'headteacher@wisdomscholars.edu.gh',
    role: 'headteacher',
    phone: '+233 24 555 7890',
    staffId: 'WSA-HDT-003',
    title: 'Headteacher',
    status: 'active',
    lastLoginAt: new Date().toISOString()
  },
  {
    id: 'usr_teacher_1',
    name: 'Mr. Samuel Owusu',
    email: 's.owusu@wisdomscholars.edu.gh',
    role: 'teacher',
    phone: '+233 50 123 4567',
    staffId: 'WSA-TCH-014',
    title: 'Senior Teacher',
    assignedClassIds: ['cls_jhs2', 'cls_jhs3'],
    assignedSubjectIds: ['sub_math', 'sub_sci'],
    status: 'active',
    lastLoginAt: new Date().toISOString()
  },
  {
    id: 'usr_teacher_2',
    name: 'Ms. Lydia Asante',
    email: 'l.asante@wisdomscholars.edu.gh',
    role: 'teacher',
    phone: '+233 27 987 6543',
    staffId: 'WSA-TCH-021',
    title: 'Primary Teacher',
    assignedClassIds: ['cls_b4', 'cls_b5'],
    assignedSubjectIds: ['sub_eng', 'sub_soc'],
    status: 'active',
    lastLoginAt: new Date().toISOString()
  },
  {
    id: 'usr_parent_1',
    name: 'Mr. Kofi Mensah',
    email: 'kofi.mensah@gmail.com',
    role: 'parent',
    phone: '+233 24 333 4455',
    linkedStudentIds: [],
    title: 'Parent',
    status: 'active',
    lastLoginAt: new Date().toISOString()
  },
  {
    id: 'usr_parent_2',
    name: 'Mrs. Akua Donkor',
    email: 'akua.donkor@yahoo.com',
    role: 'parent',
    phone: '+233 20 666 7788',
    linkedStudentIds: [],
    title: 'Guardian',
    status: 'active',
    lastLoginAt: new Date().toISOString()
  }
];

const DEFAULT_SCHOOL_INFO: SchoolInfo = {
  name: 'Wisdom Scholars Academy',
  tagline: 'Moulding Future Leaders of Ghana and the World',
  location: 'East Legon Hills, Greater Accra',
  city: 'Accra',
  country: 'Ghana',
  gpsAddress: 'GD-182-4910',
  email: 'info@wisdomscholars.edu.gh',
  phone: '+233 (0) 30 294 8831',
  logoUrl: ACADEMY_LOGO,
  bannerUrl: CAMPUS_IMAGE,
  headteacherName: 'Rev. Dr. Joseph Osei',
  motto: 'Excellence, Wisdom & Integrity'
};

const DEFAULT_ACADEMIC_YEARS: AcademicYear[] = [
  {
    id: 'ay_2026_2027',
    name: '2026/2027',
    isCurrent: true,
    terms: [
      {
        id: 't_2026_1',
        academicYearId: 'ay_2026_2027',
        name: 'Term 1',
        isCurrent: true,
        startDate: '2026-09-08',
        endDate: '2026-12-18',
        nextTermBegins: '2027-01-12'
      },
      {
        id: 't_2026_2',
        academicYearId: 'ay_2026_2027',
        name: 'Term 2',
        isCurrent: false,
        startDate: '2027-01-12',
        endDate: '2027-04-09',
        nextTermBegins: '2027-05-04'
      },
      {
        id: 't_2026_3',
        academicYearId: 'ay_2026_2027',
        name: 'Term 3',
        isCurrent: false,
        startDate: '2027-05-04',
        endDate: '2027-07-30',
        nextTermBegins: '2027-09-07'
      }
    ]
  },
  {
    id: 'ay_2027_2028',
    name: '2027/2028',
    isCurrent: false,
    terms: [
      {
        id: 't_2027_1',
        academicYearId: 'ay_2027_2028',
        name: 'Term 1',
        isCurrent: false,
        startDate: '2027-09-07',
        endDate: '2027-12-17'
      }
    ]
  }
];

const DEFAULT_CLASSES: SchoolClass[] = [
  { id: 'cls_creche', name: 'Creche', level: 'creche', academicYearId: 'ay_2026_2027', termId: 't_2026_1', roomNumber: 'Block A - 01', capacity: 20 },
  { id: 'cls_nur1', name: 'Nursery 1', level: 'nursery', academicYearId: 'ay_2026_2027', termId: 't_2026_1', roomNumber: 'Block A - 02', capacity: 25 },
  { id: 'cls_nur2', name: 'Nursery 2', level: 'nursery', academicYearId: 'ay_2026_2027', termId: 't_2026_1', roomNumber: 'Block A - 03', capacity: 25 },
  { id: 'cls_kg1', name: 'Kindergarten 1', level: 'kindergarten', academicYearId: 'ay_2026_2027', termId: 't_2026_1', roomNumber: 'Block A - 04', capacity: 28 },
  { id: 'cls_kg2', name: 'Kindergarten 2', level: 'kindergarten', academicYearId: 'ay_2026_2027', termId: 't_2026_1', roomNumber: 'Block A - 05', capacity: 30 },
  { id: 'cls_b1', name: 'Basic 1', level: 'primary', academicYearId: 'ay_2026_2027', termId: 't_2026_1', roomNumber: 'Block B - 01', capacity: 32 },
  { id: 'cls_b2', name: 'Basic 2', level: 'primary', academicYearId: 'ay_2026_2027', termId: 't_2026_1', roomNumber: 'Block B - 02', capacity: 32 },
  { id: 'cls_b3', name: 'Basic 3', level: 'primary', academicYearId: 'ay_2026_2027', termId: 't_2026_1', roomNumber: 'Block B - 03', capacity: 32 },
  { id: 'cls_b4', name: 'Basic 4', level: 'primary', academicYearId: 'ay_2026_2027', termId: 't_2026_1', classTeacherId: 'usr_teacher_2', roomNumber: 'Block B - 04', capacity: 32 },
  { id: 'cls_b5', name: 'Basic 5', level: 'primary', academicYearId: 'ay_2026_2027', termId: 't_2026_1', roomNumber: 'Block B - 05', capacity: 32 },
  { id: 'cls_b6', name: 'Basic 6', level: 'primary', academicYearId: 'ay_2026_2027', termId: 't_2026_1', roomNumber: 'Block B - 06', capacity: 32 },
  { id: 'cls_jhs1', name: 'JHS 1', level: 'jhs', academicYearId: 'ay_2026_2027', termId: 't_2026_1', roomNumber: 'Block C - 01', capacity: 35 },
  { id: 'cls_jhs2', name: 'JHS 2', level: 'jhs', academicYearId: 'ay_2026_2027', termId: 't_2026_1', classTeacherId: 'usr_teacher_1', roomNumber: 'Block C - 02', capacity: 35 },
  { id: 'cls_jhs3', name: 'JHS 3', level: 'jhs', academicYearId: 'ay_2026_2027', termId: 't_2026_1', classTeacherId: 'usr_teacher_1', roomNumber: 'Block C - 03', capacity: 35 }
];

const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'sub_math', name: 'Mathematics', code: 'MATH', category: 'core', applicableLevels: ['primary', 'jhs'] },
  { id: 'sub_eng', name: 'English Language', code: 'ENG', category: 'core', applicableLevels: ['nursery', 'kindergarten', 'primary', 'jhs'] },
  { id: 'sub_sci', name: 'Integrated Science', code: 'SCI', category: 'core', applicableLevels: ['primary', 'jhs'] },
  { id: 'sub_soc', name: 'Social Studies', code: 'SOC', category: 'core', applicableLevels: ['primary', 'jhs'] },
  { id: 'sub_ict', name: 'Computing / ICT', code: 'COMP', category: 'core', applicableLevels: ['primary', 'jhs'] },
  { id: 'sub_ghl', name: 'Ghanaian Language (Twi)', code: 'GHL', category: 'elective', applicableLevels: ['primary', 'jhs'] },
  { id: 'sub_rme', name: 'Religious & Moral Education (RME)', code: 'RME', category: 'core', applicableLevels: ['primary', 'jhs'] },
  { id: 'sub_cad', name: 'Creative Arts & Design', code: 'CAD', category: 'creative', applicableLevels: ['creche', 'nursery', 'kindergarten', 'primary', 'jhs'] },
  { id: 'sub_phe', name: 'Physical & Health Education', code: 'PHE', category: 'elective', applicableLevels: ['primary', 'jhs'] }
];

const DEFAULT_STUDENTS: Student[] = [];

const DEFAULT_GRADING_CONFIG: GradingConfig = {
  classScoreWeight: 30,
  examScoreWeight: 70,
  gradingSystemName: 'Ghana Basic Education 9-Point Scale (BECE Standard)',
  scale: [
    { grade: '1', minScore: 80, maxScore: 100, remark: 'Highest / Excellent' },
    { grade: '2', minScore: 70, maxScore: 79, remark: 'Higher / Very Good' },
    { grade: '3', minScore: 65, maxScore: 69, remark: 'High / Good' },
    { grade: '4', minScore: 60, maxScore: 64, remark: 'High Average / Credit' },
    { grade: '5', minScore: 55, maxScore: 59, remark: 'Average / Credit' },
    { grade: '6', minScore: 50, maxScore: 54, remark: 'Low Average / Pass' },
    { grade: '7', minScore: 45, maxScore: 49, remark: 'Lower / Pass' },
    { grade: '8', minScore: 40, maxScore: 44, remark: 'Lowest / Weak Pass' },
    { grade: '9', minScore: 0, maxScore: 39, remark: 'Fail' }
  ]
};

export function calculateGrade(score: number, config: GradingConfig): { grade: string; remark: string } {
  const rounded = Math.round(score);
  for (const item of config.scale) {
    if (rounded >= item.minScore && rounded <= item.maxScore) {
      return { grade: item.grade, remark: item.remark };
    }
  }
  return { grade: '9', remark: 'Fail' };
}

const DEFAULT_REPORTS: TerminalReport[] = [];

const DEFAULT_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  {
    id: 'ses_morning_today',
    title: 'Staff Daily Morning Attendance',
    sessionType: 'daily_staff',
    date: '2026-10-04',
    startTime: '07:00',
    endTime: '17:30',
    status: 'active',
    currentToken: generate2MinToken('ses_morning_today'),
    createdById: 'usr_admin_1',
    createdAt: '2026-10-04T06:50:00Z'
  },
  {
    id: 'ses_pta_meeting_term1',
    title: 'PTA General Assembly & Academic Showcase',
    sessionType: 'pta_meeting',
    date: '2026-10-10',
    startTime: '09:00',
    endTime: '13:00',
    status: 'active',
    currentToken: generate2MinToken('ses_pta_meeting_term1'),
    createdById: 'usr_admin_1',
    createdAt: '2026-10-03T11:00:00Z'
  }
];

const DEFAULT_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'att_rec_1',
    sessionId: 'ses_morning_today',
    sessionTitle: 'Staff Daily Morning Attendance',
    userId: 'usr_teacher_1',
    userName: 'Mr. Samuel Owusu',
    userRole: 'teacher',
    action: 'sign_in',
    serverTimestamp: '2026-10-04T07:28:15Z',
    deviceInfo: 'Staff Mobile (Mozilla/5.0 - Pixel)',
    verificationToken: 'WSA-QR-9A82F1-14022',
    notes: 'On time'
  },
  {
    id: 'att_rec_2',
    sessionId: 'ses_morning_today',
    sessionTitle: 'Staff Daily Morning Attendance',
    userId: 'usr_teacher_2',
    userName: 'Ms. Lydia Asante',
    userRole: 'teacher',
    action: 'sign_in',
    serverTimestamp: '2026-10-04T07:34:42Z',
    deviceInfo: 'Staff Mobile (Mozilla/5.0 - iPhone)',
    verificationToken: 'WSA-QR-3B71A9-14024',
    notes: 'On time'
  }
];

const DEFAULT_EVENTS: SchoolEvent[] = [
  {
    id: 'evt_pta_general',
    title: 'First Term PTA General Assembly',
    date: '2026-10-10',
    time: '09:00 AM - 12:30 PM',
    location: 'Main School Auditorium & Quadrangle',
    description: 'Discussion of school development plans, academic progress reviews, and election of PTA executives. All parents are warmly encouraged to attend.',
    audience: 'all',
    category: 'meeting',
    isPublished: true,
    createdAt: '2026-09-20T10:00:00Z'
  },
  {
    id: 'evt_mid_term_exams',
    title: 'Term 1 Mid-Term Assessments',
    date: '2026-10-26',
    time: '08:30 AM - 02:30 PM',
    location: 'All Classrooms (Creche to JHS 3)',
    description: 'Mid-term continuous assessment tests across core and elective subjects. Revision timetables have been handed to learners.',
    audience: 'all',
    category: 'academic',
    isPublished: true,
    createdAt: '2026-09-25T14:00:00Z'
  },
  {
    id: 'evt_speech_day',
    title: 'Annual Speech & Prize Giving Day',
    date: '2026-12-11',
    time: '10:00 AM - 03:00 PM',
    location: 'Wisdom Scholars Academy Sports Arena',
    description: 'Celebrating high academic distinction, sports achievements, and leadership across all departments.',
    audience: 'all',
    category: 'extracurricular',
    isPublished: true,
    createdAt: '2026-09-28T09:00:00Z'
  }
];

const DEFAULT_ASSESSMENTS: Assessment[] = [
  // --- CURRENT / PRESENT ASSESSMENTS ---
  {
    id: 'asm_midterm_term1',
    title: 'Term 1 Mid-Term Continuous Assessment (Mathematics)',
    academicYearId: 'ay_2026_2027',
    termId: 't_2026_1',
    classId: 'cls_jhs2',
    subjectId: 'sub_math',
    startDate: '2026-10-01',
    endDate: '2026-10-28',
    assessmentType: 'mid_term',
    maxScore: 30,
    weightPercentage: 30,
    status: 'current',
    instructions: 'Continuous assessment evaluation covering algebra, plane geometry, and statistics (Weeks 1 to 6).',
    createdAt: '2026-09-20T08:00:00Z'
  },
  {
    id: 'asm_midterm_sci',
    title: 'Term 1 Science Practical & Continuous Test',
    academicYearId: 'ay_2026_2027',
    termId: 't_2026_1',
    classId: 'cls_jhs2',
    subjectId: 'sub_sci',
    startDate: '2026-10-01',
    endDate: '2026-10-28',
    assessmentType: 'mid_term',
    maxScore: 30,
    weightPercentage: 30,
    status: 'current',
    instructions: 'Integrated Science lab evaluation on density, matter, and respiration with mid-term theory test.',
    createdAt: '2026-09-20T08:00:00Z'
  },
  {
    id: 'asm_midterm_b4_math',
    title: 'Basic 4 Mid-Term Numeracy & Multiplication Mastery',
    academicYearId: 'ay_2026_2027',
    termId: 't_2026_1',
    classId: 'cls_b4',
    subjectId: 'sub_math',
    startDate: '2026-10-05',
    endDate: '2026-10-28',
    assessmentType: 'mid_term',
    maxScore: 30,
    weightPercentage: 30,
    status: 'current',
    instructions: 'Class test on place values, fractions, mental math speed, and word problem solutions.',
    createdAt: '2026-09-22T08:00:00Z'
  },
  {
    id: 'asm_midterm_b4_eng',
    title: 'Basic 4 English Reading Fluency & Grammar Quiz',
    academicYearId: 'ay_2026_2027',
    termId: 't_2026_1',
    classId: 'cls_b4',
    subjectId: 'sub_eng',
    startDate: '2026-10-05',
    endDate: '2026-10-28',
    assessmentType: 'class_test',
    maxScore: 20,
    weightPercentage: 20,
    status: 'current',
    instructions: 'Continuous oral reading assessment, punctuation exercises, and creative sentence formation.',
    createdAt: '2026-09-22T08:00:00Z'
  },
  {
    id: 'asm_midterm_jhs_ict',
    title: 'JHS 2 Computing / ICT Practical Algorithms Evaluation',
    academicYearId: 'ay_2026_2027',
    termId: 't_2026_1',
    classId: 'cls_jhs2',
    subjectId: 'sub_ict',
    startDate: '2026-10-08',
    endDate: '2026-10-29',
    assessmentType: 'class_test',
    maxScore: 25,
    weightPercentage: 25,
    status: 'current',
    instructions: 'Hands-on computer laboratory test: flowchart design, typing speed, and presentation software.',
    createdAt: '2026-09-25T09:00:00Z'
  },

  // --- FUTURE / UPCOMING SCHEDULED ASSESSMENTS ---
  {
    id: 'asm_stem_project',
    title: 'Term 1 STEM & Computing Innovation Showcase Project',
    academicYearId: 'ay_2026_2027',
    termId: 't_2026_1',
    classId: 'cls_jhs2',
    subjectId: 'sub_ict',
    startDate: '2026-11-16',
    endDate: '2026-11-20',
    assessmentType: 'project',
    maxScore: 20,
    weightPercentage: 20,
    status: 'upcoming',
    instructions: 'Collaborative student robotics and software presentation. Evaluated on creativity, technical design, and presentation.',
    createdAt: '2026-09-25T10:00:00Z'
  },
  {
    id: 'asm_french_oral',
    title: 'Term 1 French Oral & Listening Comprehension Examination',
    academicYearId: 'ay_2026_2027',
    termId: 't_2026_1',
    classId: 'cls_jhs2',
    subjectId: 'sub_ghl',
    startDate: '2026-11-23',
    endDate: '2026-11-27',
    assessmentType: 'mid_term',
    maxScore: 20,
    weightPercentage: 20,
    status: 'upcoming',
    instructions: 'Oral dialogue and listening comprehension assessment held in the language lab.',
    createdAt: '2026-09-26T11:00:00Z'
  },
  {
    id: 'asm_terminal_exam_t1',
    title: 'End of Term 1 Comprehensive Terminal Examination (All Subjects)',
    academicYearId: 'ay_2026_2027',
    termId: 't_2026_1',
    classId: 'cls_jhs2',
    subjectId: 'sub_math',
    startDate: '2026-12-07',
    endDate: '2026-12-15',
    assessmentType: 'terminal_exam',
    maxScore: 70,
    weightPercentage: 70,
    status: 'upcoming',
    instructions: 'Standardized end-of-term examinations across all NaCCA curriculum areas. Formal seated examination halls.',
    createdAt: '2026-09-28T09:00:00Z'
  },
  {
    id: 'asm_mock_bece_1',
    title: 'Mock BECE Examination Series 1 (JHS 3 Special Cohort)',
    academicYearId: 'ay_2026_2027',
    termId: 't_2026_2',
    classId: 'cls_jhs3',
    subjectId: 'sub_math',
    startDate: '2027-01-18',
    endDate: '2027-01-22',
    assessmentType: 'terminal_exam',
    maxScore: 100,
    weightPercentage: 100,
    status: 'upcoming',
    instructions: 'Full WAEC-standard simulation examination with timed objective and essay papers for BECE candidates.',
    createdAt: '2026-09-30T10:00:00Z'
  },
  {
    id: 'asm_midterm_term2',
    title: 'Term 2 Diagnostic & Mid-Term Assessment',
    academicYearId: 'ay_2026_2027',
    termId: 't_2026_2',
    classId: 'cls_jhs2',
    subjectId: 'sub_math',
    startDate: '2027-02-22',
    endDate: '2027-02-26',
    assessmentType: 'mid_term',
    maxScore: 30,
    weightPercentage: 30,
    status: 'upcoming',
    instructions: 'Second term continuous assessment battery across all primary and junior high grades.',
    createdAt: '2026-10-01T08:00:00Z'
  },
  {
    id: 'asm_terminal_exam_t2',
    title: 'End of Term 2 Terminal Examination',
    academicYearId: 'ay_2026_2027',
    termId: 't_2026_2',
    classId: 'cls_jhs2',
    subjectId: 'sub_math',
    startDate: '2027-04-05',
    endDate: '2027-04-14',
    assessmentType: 'terminal_exam',
    maxScore: 70,
    weightPercentage: 70,
    status: 'upcoming',
    instructions: 'Comprehensive Term 2 assessment and preparation for final promotional term.',
    createdAt: '2026-10-01T08:00:00Z'
  },
  {
    id: 'asm_promo_exam_t3',
    title: 'Annual Promotional Examination (2026/2027 Academic Year)',
    academicYearId: 'ay_2026_2027',
    termId: 't_2026_3',
    classId: 'cls_jhs2',
    subjectId: 'sub_math',
    startDate: '2027-07-12',
    endDate: '2027-07-21',
    assessmentType: 'terminal_exam',
    maxScore: 70,
    weightPercentage: 70,
    status: 'upcoming',
    instructions: 'Cumulative end-of-year promotional examination determining placement for the next academic tier.',
    createdAt: '2026-10-01T08:00:00Z'
  },

  // --- PAST / COMPLETED ASSESSMENTS ---
  {
    id: 'asm_past_promo_2026',
    title: 'Term 3 Annual Promotional Examination (2025/2026 Session)',
    academicYearId: 'ay_2025_2026',
    termId: 't_2025_3',
    classId: 'cls_jhs1',
    subjectId: 'sub_math',
    startDate: '2026-07-13',
    endDate: '2026-07-22',
    assessmentType: 'terminal_exam',
    maxScore: 100,
    weightPercentage: 100,
    status: 'completed',
    instructions: 'Final promotional examination from JHS 1 to JHS 2 with official gazetted results.',
    createdAt: '2026-07-01T08:00:00Z'
  },
  {
    id: 'asm_past_midterm_2026',
    title: 'Term 2 Mid-Year Examination (2025/2026 Session)',
    academicYearId: 'ay_2025_2026',
    termId: 't_2025_2',
    classId: 'cls_jhs1',
    subjectId: 'sub_math',
    startDate: '2026-03-23',
    endDate: '2026-03-31',
    assessmentType: 'terminal_exam',
    maxScore: 100,
    weightPercentage: 100,
    status: 'completed',
    instructions: 'Term 2 terminal testing across core subjects with parent consultation reviews.',
    createdAt: '2026-03-10T08:00:00Z'
  },
  {
    id: 'asm_past_term1_2025',
    title: 'Term 1 Terminal Examination (2025/2026 Session)',
    academicYearId: 'ay_2025_2026',
    termId: 't_2025_1',
    classId: 'cls_jhs1',
    subjectId: 'sub_math',
    startDate: '2025-12-08',
    endDate: '2025-12-16',
    assessmentType: 'terminal_exam',
    maxScore: 100,
    weightPercentage: 100,
    status: 'completed',
    instructions: 'First term standardized examinations with published transcript cards.',
    createdAt: '2025-11-20T08:00:00Z'
  }
];

const DEFAULT_CALENDAR_EVENTS: AcademicCalendarEvent[] = [
  {
    id: 'cal_term1_dates',
    title: 'Term 1 Teaching Session Resumption',
    startDate: '2026-09-08',
    endDate: '2026-12-18',
    eventType: 'term_dates',
    academicYearId: 'ay_2026_2027',
    termId: 't_2026_1',
    audience: 'all',
    description: '15-week academic instruction and continuous assessment term.',
    isPublished: true
  },
  {
    id: 'cal_nkrumah_day',
    title: 'Kwame Nkrumah Memorial Day (Statutory Holiday)',
    startDate: '2026-09-21',
    endDate: '2026-09-21',
    eventType: 'holiday',
    audience: 'all',
    description: 'Public holiday across Ghana. School closed.',
    isPublished: true
  },
  {
    id: 'cal_pta_general',
    title: 'First Term PTA General Assembly & Academic Showcase',
    startDate: '2026-10-10',
    endDate: '2026-10-10',
    eventType: 'pta_meeting',
    audience: 'parents',
    description: 'Auditorium meeting with parent body on academy infrastructure and term progress.',
    isPublished: true
  },
  {
    id: 'cal_midterm_exams',
    title: 'Term 1 Mid-Term Assessments (Continuous Assessment Period)',
    startDate: '2026-10-26',
    endDate: '2026-10-30',
    eventType: 'exam_period',
    audience: 'all',
    description: 'Mid-term written tests across all subjects for Creche through JHS 3.',
    isPublished: true
  },
  {
    id: 'cal_midterm_break',
    title: 'Term 1 Mid-Term Holiday Break',
    startDate: '2026-10-30',
    endDate: '2026-11-02',
    eventType: 'holiday',
    audience: 'all',
    description: 'Short restorative break for scholars and teaching staff.',
    isPublished: true
  },
  {
    id: 'cal_farmers_day',
    title: "National Farmer's Day (Ghana Public Holiday)",
    startDate: '2026-12-04',
    endDate: '2026-12-04',
    eventType: 'holiday',
    audience: 'all',
    description: 'Statutory national holiday in honour of Ghanaian farmers and fishers.',
    isPublished: true
  },
  {
    id: 'cal_terminal_exams',
    title: 'Term 1 End-of-Term Examination Period',
    startDate: '2026-12-07',
    endDate: '2026-12-15',
    eventType: 'exam_period',
    audience: 'all',
    description: 'Main 70% weighted terminal examinations for official terminal reports.',
    isPublished: true
  },
  {
    id: 'cal_speech_prize',
    title: 'Annual Speech & Prize Giving Day',
    startDate: '2026-12-16',
    endDate: '2026-12-16',
    eventType: 'activity',
    audience: 'all',
    description: 'Celebrating academic distinction, sports achievements, and leadership awards.',
    isPublished: true
  },
  {
    id: 'cal_vacation_day',
    title: 'Official Vacation & Terminal Report Collection',
    startDate: '2026-12-18',
    endDate: '2026-12-18',
    eventType: 'term_dates',
    audience: 'all',
    description: 'Reports published to parents. End of Term 1.',
    isPublished: true
  },
  {
    id: 'cal_christmas_vacation',
    title: 'Christmas & New Year Vacation Period',
    startDate: '2026-12-19',
    endDate: '2027-01-11',
    eventType: 'holiday',
    audience: 'all',
    description: 'Festive season school holiday for all learners and staff.',
    isPublished: true
  },
  {
    id: 'cal_term2_resumption',
    title: 'Term 2 Academic Session Resumption',
    startDate: '2027-01-12',
    endDate: '2027-04-09',
    eventType: 'term_dates',
    audience: 'all',
    description: 'Reopening for Second Term 2026/2027 academic session.',
    isPublished: true
  }
];

const DEFAULT_ANNOUNCEMENTS: SchoolAnnouncement[] = [
  {
    id: 'ann_midterm_prep',
    title: 'Preparation for Mid-Term Assessments & Project Submissions',
    content: 'All parents are kindly reminded that project work and continuous assessment exercises for Basic 1 through JHS 3 are due on Friday, October 23. Teachers will assist learners during designated prep periods.',
    priority: 'important',
    targetAudience: 'parents',
    isArchived: false,
    publishedAt: '2026-10-02T08:30:00Z',
    publishedBy: 'Mrs. Grace Boateng (Admin)'
  },
  {
    id: 'ann_pta_reminder',
    title: 'Notice: First Term PTA Meeting This Saturday',
    content: 'The Management and Board of Wisdom Scholars Academy invite all esteemed parents and guardians to our First Term PTA Meeting on Saturday, October 10 at 9:00 AM prompt. Agenda includes academic reports review and student security updates.',
    priority: 'urgent',
    targetAudience: 'all',
    isArchived: false,
    publishedAt: '2026-10-03T12:00:00Z',
    publishedBy: 'Rev. Dr. Joseph Osei (Headteacher)'
  },
  {
    id: 'ann_staff_workshop',
    title: 'Staff Workshop on Cambridge & NaCCA Curriculum Alignment',
    content: 'All teaching staff are scheduled for a mandatory pedagogical refresher on Friday from 3:30 PM to 5:00 PM in the ICT Innovation Centre.',
    priority: 'normal',
    targetAudience: 'staff',
    isArchived: false,
    publishedAt: '2026-10-01T16:00:00Z',
    publishedBy: 'Dr. Kwabena Mensah (Director)'
  }
];

const DEFAULT_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log_seed_1',
    userId: 'usr_superadmin_1',
    userName: 'Dr. Kwabena Mensah',
    userRole: 'superadmin',
    action: 'System Initialized',
    affectedRecord: 'Wisdom Scholars Academy Portal',
    details: 'Initial database configured with academic years, subjects, and roles.',
    timestamp: '2026-09-08T06:00:00Z',
    status: 'success'
  },
  {
    id: 'log_seed_2',
    userId: 'usr_admin_1',
    userName: 'Mrs. Grace Boateng',
    userRole: 'admin',
    action: 'Grading Scale Configured',
    affectedRecord: 'Ghana Basic Education 9-Point Scale',
    details: 'Configured continuous assessment (30%) and terminal exam (70%) weights.',
    timestamp: '2026-09-10T09:14:00Z',
    status: 'success'
  },
  {
    id: 'log_seed_3',
    userId: 'usr_headteacher_1',
    userName: 'Rev. Dr. Joseph Osei',
    userRole: 'headteacher',
    action: 'Academic Calendar Approved',
    affectedRecord: 'Term 1 2026/2027 Milestone Dates',
    details: 'Approved academic schedule, mid-term assessments and statutory holidays.',
    timestamp: '2026-09-20T08:00:00Z',
    status: 'success'
  },
  {
    id: 'log_seed_4',
    userId: 'usr_admin_1',
    userName: 'Mrs. Grace Boateng',
    userRole: 'admin',
    action: 'Attendance Engine Activated',
    affectedRecord: 'Dynamic 2-Minute QR Attendance',
    details: 'Initialized token generator for school assembly and event check-in.',
    timestamp: '2026-10-04T06:50:00Z',
    status: 'success'
  }
];

class SchoolDataStore {
  private state: AppState;
  private listeners: Set<() => void> = new Set();
  private tokenInterval: any = null;

  constructor() {
    this.state = this.loadState();
    this.startTokenRefresher();
  }

  private loadState(): AppState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure structure has required keys
        if (parsed && parsed.students && parsed.classes && parsed.users) {
          // Robust asset migration: ensure logoUrl and bannerUrl never break on bundled output
          if (!parsed.schoolInfo || !parsed.schoolInfo.logoUrl || parsed.schoolInfo.logoUrl.startsWith('/src/') || parsed.schoolInfo.logoUrl.includes('school_crest')) {
            parsed.schoolInfo = {
              ...(parsed.schoolInfo || DEFAULT_SCHOOL_INFO),
              logoUrl: ACADEMY_LOGO,
              bannerUrl: CAMPUS_IMAGE
            };
          }
          if (typeof parsed.schoolInfo.logoUrl === 'string' && (parsed.schoolInfo.logoUrl.includes('/src/assets/') || parsed.schoolInfo.logoUrl.includes('school_crest'))) {
            parsed.schoolInfo.logoUrl = ACADEMY_LOGO;
          }
          if (typeof parsed.schoolInfo.bannerUrl === 'string' && parsed.schoolInfo.bannerUrl.includes('/src/assets/')) {
            parsed.schoolInfo.bannerUrl = CAMPUS_IMAGE;
          }

          if (!Array.isArray(parsed.students)) {
            parsed.students = [];
          }
          if (!Array.isArray(parsed.reports)) {
            parsed.reports = [];
          }

          if (!parsed.assessments || parsed.assessments.length === 0) {
            parsed.assessments = DEFAULT_ASSESSMENTS;
          }
          if (!parsed.calendarEvents || parsed.calendarEvents.length === 0) {
            parsed.calendarEvents = DEFAULT_CALENDAR_EVENTS;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading stored school data:', e);
    }

    const initialState: AppState = {
      schoolInfo: DEFAULT_SCHOOL_INFO,
      academicYears: DEFAULT_ACADEMIC_YEARS,
      currentAcademicYearId: 'ay_2026_2027',
      currentTermId: 't_2026_1',
      classes: DEFAULT_CLASSES,
      subjects: DEFAULT_SUBJECTS,
      students: DEFAULT_STUDENTS,
      gradingConfig: DEFAULT_GRADING_CONFIG,
      reports: DEFAULT_REPORTS,
      assessments: DEFAULT_ASSESSMENTS,
      calendarEvents: DEFAULT_CALENDAR_EVENTS,
      attendanceSessions: DEFAULT_ATTENDANCE_SESSIONS,
      attendanceRecords: DEFAULT_ATTENDANCE_RECORDS,
      events: DEFAULT_EVENTS,
      announcements: DEFAULT_ANNOUNCEMENTS,
      users: DEFAULT_USERS,
      deviceSessions: [
        {
          id: 'devsess_1',
          userId: 'usr_superadmin_1',
          userName: 'Dr. Kwabena Mensah',
          role: 'superadmin',
          deviceId: 'device_desktop_dir',
          deviceName: 'Admin Workstation (Chrome macOS)',
          ipAddress: '102.176.65.12',
          createdAt: '2026-10-04T06:00:00Z',
          lastActiveAt: new Date().toISOString(),
          isActive: true
        }
      ],
      auditLogs: DEFAULT_AUDIT_LOGS
    };

    this.saveToStorage(initialState);
    return initialState;
  }

  private saveToStorage(state: AppState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save school data to storage:', e);
    }
  }

  private notify() {
    this.saveToStorage(this.state);
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getState(): AppState {
    return this.state;
  }

  // Auto-refresh attendance tokens every 2 minutes
  private startTokenRefresher() {
    if (this.tokenInterval) clearInterval(this.tokenInterval);
    this.tokenInterval = setInterval(() => {
      let changed = false;
      const now = Date.now();
      const updatedSessions = this.state.attendanceSessions.map((session) => {
        if (session.status === 'active' && (!session.currentToken || now >= session.currentToken.expiresAt)) {
          changed = true;
          return {
            ...session,
            currentToken: generate2MinToken(session.id)
          };
        }
        return session;
      });

      if (changed) {
        this.state = {
          ...this.state,
          attendanceSessions: updatedSessions
        };
        this.notify();
      }
    }, 5000); // Check every 5 seconds for smooth token expiration handling
  }

  // --- Session & Impersonation Management ---
  public getActiveUser(): User | null {
    try {
      const stored = localStorage.getItem(SESSION_USER_KEY);
      if (stored) {
        const found = this.state.users.find((u) => u.id === stored);
        if (found) return found;
      }
    } catch (e) {
      console.error('Error getting active user:', e);
    }
    // Default to Superadmin for initial friction-free access
    return this.state.users[0] || null;
  }

  public setActiveUser(userId: string, requestedDeviceId?: string): { success: boolean; error?: string } {
    const user = this.state.users.find((u) => u.id === userId);
    if (!user) return { success: false, error: 'User not found' };

    const currentLoggedInUser = this.getActiveUser();
    // STRICT RULE: Apart from superadmin, no one can switch to other portals or user accounts
    if (currentLoggedInUser && currentLoggedInUser.role !== 'superadmin' && currentLoggedInUser.id !== userId) {
      this.logAudit({
        userId: currentLoggedInUser.id,
        userName: currentLoggedInUser.name,
        userRole: currentLoggedInUser.role,
        action: 'Portal Switch Attempt Denied',
        affectedRecord: `Target: ${user.name} (${user.role})`,
        details: 'Access denied: Apart from the Superadmin, users cannot switch to other portals or accounts.',
        status: 'denied'
      });
      return {
        success: false,
        error: 'Access denied: Apart from the Superadmin, users cannot switch to other portals.'
      };
    }

    const deviceId = requestedDeviceId || getDeviceId();

    // ORDINARY STAFF DEVICE RESTRICTION:
    // "Default policy: ONE ACTIVE DEVICE/SESSION PER ORDINARY STAFF ACCOUNT.
    // If an ordinary staff account attempts to log in on another device while an active session exists:
    // SHOW: 'This account is already active on another device.'"
    if (user.role === 'teacher') {
      const existingActiveSession = this.state.deviceSessions.find(
        (s) => s.userId === user.id && s.isActive && s.deviceId !== deviceId
      );
      if (existingActiveSession) {
        this.logAudit({
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          action: 'Login Blocked (Device Restriction)',
          affectedRecord: `Device: ${deviceId}`,
          details: `Attempted login while active session exists on device ${existingActiveSession.deviceName} (${existingActiveSession.deviceId})`,
          status: 'denied'
        });
        return {
          success: false,
          error: 'This account is already active on another device. Please sign out from your other device or ask an administrator to reset your session.'
        };
      }
    }

    // Register/update device session
    const existingIndex = this.state.deviceSessions.findIndex(
      (s) => s.userId === user.id && s.deviceId === deviceId
    );

    const now = getServerISOString();
    let updatedSessions = [...this.state.deviceSessions];

    if (existingIndex >= 0) {
      updatedSessions[existingIndex] = {
        ...updatedSessions[existingIndex],
        lastActiveAt: now,
        isActive: true
      };
    } else {
      updatedSessions.push({
        id: 'sess_' + Math.random().toString(36).substring(2, 9),
        userId: user.id,
        userName: user.name,
        role: user.role,
        deviceId: deviceId,
        deviceName: navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop Browser',
        ipAddress: '102.176.65.' + (Math.floor(Math.random() * 50) + 10),
        createdAt: now,
        lastActiveAt: now,
        isActive: true
      });
    }

    localStorage.setItem(SESSION_USER_KEY, userId);

    // If superadmin switches users, reset role preview
    localStorage.removeItem(PREVIEW_ROLE_KEY);

    this.state = {
      ...this.state,
      deviceSessions: updatedSessions
    };

    this.logAudit({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'User Logged In',
      affectedRecord: `Session on device ${deviceId}`,
      details: `${user.name} (${user.role}) authenticated successfully.`,
      status: 'success'
    });

    this.notify();
    return { success: true };
  }

  // Terminate device session (admin recovery or user logout)
  public terminateDeviceSession(sessionId: string) {
    const session = this.state.deviceSessions.find((s) => s.id === sessionId);
    if (!session) return;

    this.state = {
      ...this.state,
      deviceSessions: this.state.deviceSessions.map((s) =>
        s.id === sessionId ? { ...s, isActive: false } : s
      )
    };

    this.logAudit({
      userId: this.getActiveUser()?.id || 'sys',
      userName: this.getActiveUser()?.name || 'System',
      userRole: this.getActiveUser()?.role || 'superadmin',
      action: 'Session Terminated',
      affectedRecord: `Session ${sessionId} for ${session.userName}`,
      details: `Revoked active device session (${session.deviceName}).`,
      status: 'warning'
    });

    this.notify();
  }

  // Explicit user sign out
  public signOut(): void {
    const currentUser = this.getActiveUser();
    const deviceId = getDeviceId();
    if (currentUser) {
      this.state = {
        ...this.state,
        deviceSessions: this.state.deviceSessions.map((s) =>
          s.userId === currentUser.id && s.deviceId === deviceId
            ? { ...s, isActive: false }
            : s
        )
      };
      this.logAudit({
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        action: 'User Signed Out',
        affectedRecord: `Session on device ${deviceId}`,
        details: `${currentUser.name} (${currentUser.role}) signed out of portal.`,
        status: 'warning'
      });
    }
    localStorage.removeItem(SESSION_USER_KEY);
    localStorage.removeItem(PREVIEW_ROLE_KEY);
    this.notify();
  }

  // --- Superadmin Impersonation / Preview ---
  public canSwitchPortals(): boolean {
    const active = this.getActiveUser();
    return active?.role === 'superadmin';
  }

  public getPreviewRole(): UserRole | null {
    const active = this.getActiveUser();
    if (active?.role !== 'superadmin') return null;
    return (localStorage.getItem(PREVIEW_ROLE_KEY) as UserRole) || null;
  }

  public setPreviewRole(role: UserRole | null) {
    const active = this.getActiveUser();
    // Rule: apart from superadmin, no one can switch to other portals
    if (active?.role !== 'superadmin') {
      console.warn('Unauthorized: Only Superadmin can switch or preview other portals.');
      localStorage.removeItem(PREVIEW_ROLE_KEY);
      this.notify();
      return;
    }

    if (role) {
      localStorage.setItem(PREVIEW_ROLE_KEY, role);
    } else {
      localStorage.removeItem(PREVIEW_ROLE_KEY);
    }
    this.notify();
  }

  // Effective role considering preview mode
  public getEffectiveRole(): UserRole {
    const active = this.getActiveUser();
    if (!active) return 'parent';
    if (active.role === 'superadmin') {
      const preview = this.getPreviewRole();
      if (preview) return preview;
    }
    return active.role;
  }

  // --- Audit Logging ---
  public logAudit(item: Omit<AuditLogItem, 'id' | 'timestamp'>) {
    const newItem: AuditLogItem = {
      id: 'log_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: getServerISOString(),
      ...item
    };
    this.state = {
      ...this.state,
      auditLogs: [newItem, ...this.state.auditLogs]
    };
    this.saveToStorage(this.state);
  }

  // --- Student Management ---
  public addStudent(studentData: Omit<Student, 'id' | 'studentIdNumber' | 'enrollmentDate'>): Student {
    const count = this.state.students.length + 1;
    const studentIdNumber = `WSA/2026/${count.toString().padStart(3, '0')}`;
    const newStudent: Student = {
      ...studentData,
      id: 'stu_' + Math.random().toString(36).substring(2, 9),
      studentIdNumber,
      enrollmentDate: getServerISOString().split('T')[0]
    };

    this.state = {
      ...this.state,
      students: [newStudent, ...this.state.students]
    };

    const currentUser = this.getActiveUser();
    this.logAudit({
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Administrator',
      userRole: currentUser?.role || 'admin',
      action: 'Add Student',
      affectedRecord: `${newStudent.fullName} (${newStudent.studentIdNumber})`,
      details: `Enrolled into class ID ${newStudent.classId} with parent ${newStudent.parentName}.`,
      status: 'success'
    });

    this.notify();
    return newStudent;
  }

  public updateStudent(id: string, updates: Partial<Student>): boolean {
    const existing = this.state.students.find((s) => s.id === id);
    if (!existing) return false;

    this.state = {
      ...this.state,
      students: this.state.students.map((s) => (s.id === id ? { ...s, ...updates } : s))
    };

    const currentUser = this.getActiveUser();
    this.logAudit({
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Administrator',
      userRole: currentUser?.role || 'admin',
      action: 'Update Student Profile',
      affectedRecord: `${existing.fullName} (${existing.studentIdNumber})`,
      details: `Updated fields: ${Object.keys(updates).join(', ')}`,
      status: 'success'
    });

    this.notify();
    return true;
  }

  // --- Classes & Subjects Management (Self-Service) ---
  public addClass(classData: Omit<SchoolClass, 'id'>): SchoolClass {
    const newClass: SchoolClass = {
      ...classData,
      id: 'cls_' + Math.random().toString(36).substring(2, 8)
    };

    this.state = {
      ...this.state,
      classes: [...this.state.classes, newClass]
    };

    const currentUser = this.getActiveUser();
    this.logAudit({
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Administrator',
      userRole: currentUser?.role || 'admin',
      action: 'Add Class',
      affectedRecord: newClass.name,
      details: `Added class ${newClass.name} under ${newClass.level} level.`,
      status: 'success'
    });

    this.notify();
    return newClass;
  }

  public addSubject(subjectData: Omit<Subject, 'id'>): Subject {
    const newSubject: Subject = {
      ...subjectData,
      id: 'sub_' + Math.random().toString(36).substring(2, 8)
    };

    this.state = {
      ...this.state,
      subjects: [...this.state.subjects, newSubject]
    };

    const currentUser = this.getActiveUser();
    this.logAudit({
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Administrator',
      userRole: currentUser?.role || 'admin',
      action: 'Add Subject',
      affectedRecord: `${newSubject.name} (${newSubject.code})`,
      details: `Self-service subject creation by school administrator.`,
      status: 'success'
    });

    this.notify();
    return newSubject;
  }

  public addAcademicYear(name: string): AcademicYear {
    const newYear: AcademicYear = {
      id: 'ay_' + Math.random().toString(36).substring(2, 8),
      name,
      isCurrent: false,
      terms: [
        {
          id: 't_' + Math.random().toString(36).substring(2, 8),
          academicYearId: '',
          name: 'Term 1',
          isCurrent: false,
          startDate: '2027-09-01',
          endDate: '2027-12-15'
        }
      ]
    };
    newYear.terms[0].academicYearId = newYear.id;

    this.state = {
      ...this.state,
      academicYears: [...this.state.academicYears, newYear]
    };

    const currentUser = this.getActiveUser();
    this.logAudit({
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Administrator',
      userRole: currentUser?.role || 'admin',
      action: 'Add Academic Year',
      affectedRecord: name,
      details: `Added academic year ${name} without developer assistance.`,
      status: 'success'
    });

    this.notify();
    return newYear;
  }

  public addStaffUser(userData: Omit<User, 'id' | 'status'>): User {
    const newUser: User = {
      ...userData,
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      status: 'active',
      lastLoginAt: getServerISOString()
    };

    this.state = {
      ...this.state,
      users: [...this.state.users, newUser]
    };

    const currentUser = this.getActiveUser();
    this.logAudit({
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Administrator',
      userRole: currentUser?.role || 'admin',
      action: 'Add Staff Member',
      affectedRecord: `${newUser.name} (${newUser.role})`,
      details: `Created new staff account with ID ${newUser.staffId || newUser.id}.`,
      status: 'success'
    });

    this.notify();
    return newUser;
  }

  // --- Academic Scoring & Report Cards ---
  public saveSubjectScores(
    studentId: string,
    classId: string,
    subjectScores: SubjectScore[],
    teacherComment?: string
  ): TerminalReport {
    const existingIndex = this.state.reports.findIndex(
      (r) =>
        r.studentId === studentId &&
        r.academicYearId === this.state.currentAcademicYearId &&
        r.termId === this.state.currentTermId
    );

    const currentUser = this.getActiveUser();
    const student = this.state.students.find((s) => s.id === studentId);
    const classStudents = this.state.students.filter((s) => s.classId === classId);

    // Compute totals and grades based on grading config
    const updatedScores = subjectScores.map((score) => {
      const total = Math.min(100, Math.max(0, score.classScore + score.examScore));
      const { grade, remark } = calculateGrade(total, this.state.gradingConfig);
      return {
        ...score,
        totalScore: total,
        grade,
        remark
      };
    });

    const overallTotal = updatedScores.reduce((acc, s) => acc + s.totalScore, 0);
    const overallAverage = updatedScores.length > 0 ? Number((overallTotal / updatedScores.length).toFixed(1)) : 0;

    let targetReport: TerminalReport;

    if (existingIndex >= 0) {
      const prev = this.state.reports[existingIndex];
      targetReport = {
        ...prev,
        scores: updatedScores,
        overallTotal,
        overallAverage,
        teacherComment: teacherComment !== undefined ? teacherComment : prev.teacherComment,
        teacherId: currentUser?.id,
        updatedAt: getServerISOString()
      };
      const updatedReports = [...this.state.reports];
      updatedReports[existingIndex] = targetReport;
      this.state = { ...this.state, reports: updatedReports };
    } else {
      targetReport = {
        id: 'rep_' + Math.random().toString(36).substring(2, 9),
        studentId,
        classId,
        academicYearId: this.state.currentAcademicYearId,
        termId: this.state.currentTermId,
        scores: updatedScores,
        overallTotal,
        overallAverage,
        overallPosition: 1,
        classSize: classStudents.length,
        attendanceDaysPresent: 56,
        attendanceTotalDays: 60,
        conduct: 'Courteous and well-behaved.',
        interestAndAttitude: 'Participative and attentive.',
        teacherComment: teacherComment || 'Making steady progress in class activities.',
        teacherId: currentUser?.id,
        headteacherComment: '',
        status: 'submitted',
        updatedAt: getServerISOString()
      };
      this.state = {
        ...this.state,
        reports: [targetReport, ...this.state.reports]
      };
    }

    this.recalculateClassPositions(classId);

    this.logAudit({
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Teacher',
      userRole: currentUser?.role || 'teacher',
      action: 'Enter Academic Scores',
      affectedRecord: `${student?.fullName || studentId} (${classId})`,
      details: `Saved ${updatedScores.length} subject scores. Overall total: ${overallTotal}, average: ${overallAverage}%`,
      status: 'success'
    });

    this.notify();
    return targetReport;
  }

  // Recalculate rank position for all students in class
  private recalculateClassPositions(classId: string) {
    const classReports = this.state.reports.filter(
      (r) =>
        r.classId === classId &&
        r.academicYearId === this.state.currentAcademicYearId &&
        r.termId === this.state.currentTermId
    );

    // Sort descending by overallTotal
    const sorted = [...classReports].sort((a, b) => b.overallTotal - a.overallTotal);

    const positionMap = new Map<string, number>();
    sorted.forEach((r, idx) => {
      positionMap.set(r.id, idx + 1);
    });

    this.state = {
      ...this.state,
      reports: this.state.reports.map((r) => {
        if (positionMap.has(r.id)) {
          return { ...r, overallPosition: positionMap.get(r.id)! };
        }
        return r;
      })
    };
  }

  // Headteacher Review & Approval
  public reviewAndApproveReport(
    reportId: string,
    headteacherComment: string,
    publishImmediately: boolean
  ): boolean {
    const existing = this.state.reports.find((r) => r.id === reportId);
    if (!existing) return false;

    const currentUser = this.getActiveUser();
    const now = getServerISOString();
    const newStatus = publishImmediately ? 'published' : 'approved';

    this.state = {
      ...this.state,
      reports: this.state.reports.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            headteacherComment,
            headteacherApprovedAt: now,
            status: newStatus,
            publishedAt: publishImmediately ? now : r.publishedAt,
            updatedAt: now
          };
        }
        return r;
      })
    };

    const student = this.state.students.find((s) => s.id === existing.studentId);
    this.logAudit({
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Headteacher',
      userRole: currentUser?.role || 'headteacher',
      action: publishImmediately ? 'Publish Academic Report' : 'Approve Academic Report',
      affectedRecord: `Report: ${student?.fullName || existing.studentId}`,
      details: `Headteacher added comment: "${headteacherComment.substring(0, 40)}..." and set status to ${newStatus}.`,
      status: 'success'
    });

    this.notify();
    return true;
  }

  public publishReport(reportId: string): boolean {
    const existing = this.state.reports.find((r) => r.id === reportId);
    if (!existing) return false;

    const currentUser = this.getActiveUser();
    const now = getServerISOString();

    this.state = {
      ...this.state,
      reports: this.state.reports.map((r) =>
        r.id === reportId ? { ...r, status: 'published', publishedAt: now, updatedAt: now } : r
      )
    };

    const student = this.state.students.find((s) => s.id === existing.studentId);
    this.logAudit({
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Administrator',
      userRole: currentUser?.role || 'admin',
      action: 'Publish Academic Report',
      affectedRecord: `Report: ${student?.fullName || existing.studentId}`,
      details: 'Report published. Parent is now authorized to view.',
      status: 'success'
    });

    this.notify();
    return true;
  }

  // --- Dynamic Attendance Session Management ---
  // CRITICAL SECURITY RULE: ONLY Superadmin and Administrator can create QR attendance sessions!
  public createAttendanceSession(
    title: string,
    sessionType: AttendanceSession['sessionType'],
    startTime: string,
    endTime: string
  ): AttendanceSession {
    const currentUser = this.getActiveUser();

    // SERVER-SIDE AUTHORIZATION BOUNDARY
    if (!currentUser || (currentUser.role !== 'superadmin' && currentUser.role !== 'admin')) {
      this.logAudit({
        userId: currentUser?.id || 'unauthorized',
        userName: currentUser?.name || 'Unauthorized User',
        userRole: currentUser?.role || 'parent',
        action: 'Unauthorized QR Session Creation Blocked',
        affectedRecord: title,
        details: `Server rejected unauthorized attempt to create dynamic QR attendance session by role '${currentUser?.role}'.`,
        status: 'denied'
      });
      throw new Error("SERVER-SIDE ACCESS DENIED: Only Superadmin and Administrator are authorized to create QR attendance sessions.");
    }

    const id = 'ses_' + Math.random().toString(36).substring(2, 9);
    const newSession: AttendanceSession = {
      id,
      title,
      sessionType,
      date: getServerISOString().split('T')[0],
      startTime,
      endTime,
      status: 'active',
      currentToken: generate2MinToken(id),
      createdById: currentUser.id,
      createdAt: getServerISOString()
    };

    this.state = {
      ...this.state,
      attendanceSessions: [newSession, ...this.state.attendanceSessions]
    };

    this.logAudit({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'Create Attendance Session',
      affectedRecord: title,
      details: `Generated session (${sessionType}) with dynamic 2-min short-lived QR codes.`,
      status: 'success'
    });

    this.notify();
    return newSession;
  }

  // --- Assessment Scheduling & Temporal Management (Current, Upcoming, Past) ---
  public addAssessment(assessmentData: Omit<Assessment, 'id' | 'createdAt' | 'status'>): Assessment {
    const status = computeAssessmentStatus(assessmentData.startDate, assessmentData.endDate);
    const newAssessment: Assessment = {
      ...assessmentData,
      id: 'asm_' + Math.random().toString(36).substring(2, 9),
      status,
      createdAt: getServerISOString()
    };

    this.state = {
      ...this.state,
      assessments: [newAssessment, ...this.state.assessments]
    };

    const currentUser = this.getActiveUser();
    this.logAudit({
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Administrator',
      userRole: currentUser?.role || 'admin',
      action: 'Schedule Assessment',
      affectedRecord: newAssessment.title,
      details: `Created assessment for class ID ${newAssessment.classId} (${newAssessment.startDate} to ${newAssessment.endDate}, Status: ${status}).`,
      status: 'success'
    });

    this.notify();
    return newAssessment;
  }

  public updateAssessment(id: string, updates: Partial<Assessment>): boolean {
    const existing = this.state.assessments.find((a) => a.id === id);
    if (!existing) return false;

    this.state = {
      ...this.state,
      assessments: this.state.assessments.map((a) => {
        if (a.id === id) {
          const updated = { ...a, ...updates };
          updated.status = computeAssessmentStatus(updated.startDate, updated.endDate);
          return updated;
        }
        return a;
      })
    };

    const currentUser = this.getActiveUser();
    this.logAudit({
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Administrator',
      userRole: currentUser?.role || 'admin',
      action: 'Update Assessment Schedule',
      affectedRecord: existing.title,
      details: `Updated assessment fields: ${Object.keys(updates).join(', ')}`,
      status: 'success'
    });

    this.notify();
    return true;
  }

  // --- Shared Academic Calendar Management ---
  public addCalendarEvent(eventData: Omit<AcademicCalendarEvent, 'id'>): AcademicCalendarEvent {
    const newEvent: AcademicCalendarEvent = {
      ...eventData,
      id: 'cal_' + Math.random().toString(36).substring(2, 9)
    };

    this.state = {
      ...this.state,
      calendarEvents: [...this.state.calendarEvents, newEvent]
    };

    const currentUser = this.getActiveUser();
    this.logAudit({
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Administrator',
      userRole: currentUser?.role || 'admin',
      action: 'Add Academic Calendar Milestone',
      affectedRecord: newEvent.title,
      details: `Scheduled milestone (${newEvent.eventType}): ${newEvent.startDate} to ${newEvent.endDate}.`,
      status: 'success'
    });

    this.notify();
    return newEvent;
  }

  public deleteCalendarEvent(id: string): boolean {
    const existing = this.state.calendarEvents.find((e) => e.id === id);
    if (!existing) return false;

    this.state = {
      ...this.state,
      calendarEvents: this.state.calendarEvents.filter((e) => e.id !== id)
    };

    const currentUser = this.getActiveUser();
    this.logAudit({
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Administrator',
      userRole: currentUser?.role || 'admin',
      action: 'Delete Calendar Milestone',
      affectedRecord: existing.title,
      details: `Removed calendar milestone: ${existing.title}.`,
      status: 'warning'
    });

    this.notify();
    return true;
  }

  // --- Photo Upload Handlers for Students and Guardians ---
  public updateStudentPhoto(studentId: string, photoUrl: string): boolean {
    const existing = this.state.students.find((s) => s.id === studentId);
    if (!existing) return false;

    this.state = {
      ...this.state,
      students: this.state.students.map((s) => (s.id === studentId ? { ...s, photoUrl } : s))
    };

    const currentUser = this.getActiveUser();
    this.logAudit({
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Administrator',
      userRole: currentUser?.role || 'admin',
      action: 'Upload Student Profile Photo',
      affectedRecord: `${existing.fullName} (${existing.studentIdNumber})`,
      details: 'Updated official student profile portrait.',
      status: 'success'
    });

    this.notify();
    return true;
  }

  public updateGuardianPhoto(studentId: string, parentPhotoUrl: string): boolean {
    const existing = this.state.students.find((s) => s.id === studentId);
    if (!existing) return false;

    this.state = {
      ...this.state,
      students: this.state.students.map((s) => (s.id === studentId ? { ...s, parentPhotoUrl } : s))
    };

    const currentUser = this.getActiveUser();
    this.logAudit({
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Administrator',
      userRole: currentUser?.role || 'admin',
      action: 'Upload Guardian Profile Photo',
      affectedRecord: `Guardian of ${existing.fullName} (${existing.parentName})`,
      details: 'Updated official parent/guardian photograph.',
      status: 'success'
    });

    this.notify();
    return true;
  }

  public refreshSessionToken(sessionId: string): DynamicAttendanceToken | null {
    const session = this.state.attendanceSessions.find((s) => s.id === sessionId);
    if (!session || session.status !== 'active') return null;

    const newToken = generate2MinToken(sessionId);
    this.state = {
      ...this.state,
      attendanceSessions: this.state.attendanceSessions.map((s) =>
        s.id === sessionId ? { ...s, currentToken: newToken } : s
      )
    };
    this.notify();
    return newToken;
  }

  // Server-Side QR Attendance Validation:
  // "The official time MUST be generated server-side. Do NOT trust the user's device clock.
  // Validate authenticated user, user role, active attendance session, QR/token validity,
  // token expiry, duplicate sign-ins."
  public recordStaffAttendance(
    scannedTokenString: string,
    action: 'sign_in' | 'sign_out'
  ): { success: boolean; message: string; record?: AttendanceRecord } {
    const currentUser = this.getActiveUser();
    if (!currentUser) {
      return { success: false, message: 'Authentication required. Please sign in.' };
    }

    const now = Date.now();
    const serverTimestamp = getServerISOString();

    // 1. Locate session corresponding to token
    const session = this.state.attendanceSessions.find(
      (s) => s.currentToken && s.currentToken.token === scannedTokenString
    );

    if (!session) {
      this.logAudit({
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        action: 'Attendance Failed (Invalid Token)',
        affectedRecord: scannedTokenString,
        details: 'Scanned token does not match any current active session token.',
        status: 'denied'
      });
      return {
        success: false,
        message: 'This attendance code has expired or is invalid. Please scan the current QR code on the school display.'
      };
    }

    // 2. Validate session is active
    if (session.status !== 'active') {
      return { success: false, message: 'This attendance session has been closed.' };
    }

    // 3. Validate 2-minute token expiration
    if (now > session.currentToken.expiresAt) {
      return {
        success: false,
        message: 'This attendance code has expired. Please scan the refreshed QR code.'
      };
    }

    // 4. Duplicate sign-in / order validation
    const existingRecordsForSession = this.state.attendanceRecords.filter(
      (r) => r.sessionId === session.id && r.userId === currentUser.id
    );

    const hasSignedIn = existingRecordsForSession.some((r) => r.action === 'sign_in');
    const hasSignedOut = existingRecordsForSession.some((r) => r.action === 'sign_out');

    if (action === 'sign_in' && hasSignedIn) {
      return {
        success: false,
        message: 'You have already signed in for this attendance session today.'
      };
    }

    if (action === 'sign_out') {
      if (!hasSignedIn) {
        return {
          success: false,
          message: 'You must sign in before you can record sign-out attendance.'
        };
      }
      if (hasSignedOut) {
        return {
          success: false,
          message: 'You have already recorded sign-out for this attendance session.'
        };
      }
    }

    // 5. Record verified attendance with authoritative server timestamp
    const newRecord: AttendanceRecord = {
      id: 'att_' + Math.random().toString(36).substring(2, 9),
      sessionId: session.id,
      sessionTitle: session.title,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      serverTimestamp,
      deviceInfo: navigator.userAgent.substring(0, 60),
      verificationToken: scannedTokenString,
      notes: action === 'sign_in' ? 'Verified on-site sign-in' : 'Verified sign-out'
    };

    this.state = {
      ...this.state,
      attendanceRecords: [newRecord, ...this.state.attendanceRecords]
    };

    this.logAudit({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: action === 'sign_in' ? 'Staff Sign In' : 'Staff Sign Out',
      affectedRecord: `${session.title} (${currentUser.name})`,
      details: `Server recorded timestamp: ${new Date(serverTimestamp).toLocaleTimeString()}. Verified with dynamic token.`,
      status: 'success'
    });

    this.notify();
    return {
      success: true,
      message: `Successfully recorded ${action === 'sign_in' ? 'Sign In' : 'Sign Out'} at ${new Date(serverTimestamp).toLocaleTimeString()}.`,
      record: newRecord
    };
  }

  // --- Events & Announcements ---
  public createEvent(eventData: Omit<SchoolEvent, 'id' | 'createdAt'>): SchoolEvent {
    const newEvent: SchoolEvent = {
      ...eventData,
      id: 'evt_' + Math.random().toString(36).substring(2, 8),
      createdAt: getServerISOString()
    };

    this.state = {
      ...this.state,
      events: [newEvent, ...this.state.events]
    };

    const currentUser = this.getActiveUser();
    this.logAudit({
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Administrator',
      userRole: currentUser?.role || 'admin',
      action: 'Create School Event',
      affectedRecord: newEvent.title,
      details: `Scheduled for ${newEvent.date} at ${newEvent.location}. Audience: ${newEvent.audience}.`,
      status: 'success'
    });

    this.notify();
    return newEvent;
  }

  public createAnnouncement(
    announcementData: Omit<SchoolAnnouncement, 'id' | 'publishedAt'>
  ): SchoolAnnouncement {
    const newAnn: SchoolAnnouncement = {
      ...announcementData,
      id: 'ann_' + Math.random().toString(36).substring(2, 8),
      publishedAt: getServerISOString()
    };

    this.state = {
      ...this.state,
      announcements: [newAnn, ...this.state.announcements]
    };

    const currentUser = this.getActiveUser();
    this.logAudit({
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Administrator',
      userRole: currentUser?.role || 'admin',
      action: 'Publish Announcement',
      affectedRecord: newAnn.title,
      details: `Priority: ${newAnn.priority}, Audience: ${newAnn.targetAudience}.`,
      status: 'success'
    });

    this.notify();
    return newAnn;
  }

  // --- Grading Scheme Configuration ---
  public updateGradingConfig(config: GradingConfig): void {
    const oldConfigName = this.state.gradingConfig.gradingSystemName;
    this.state = {
      ...this.state,
      gradingConfig: config
    };

    const currentUser = this.getActiveUser();
    this.logAudit({
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Administrator',
      userRole: currentUser?.role || 'admin',
      action: 'Update Grading Configuration',
      affectedRecord: config.gradingSystemName,
      details: `Class score weight: ${config.classScoreWeight}%, Exam score weight: ${config.examScoreWeight}%.`,
      previousValue: oldConfigName,
      newValue: config.gradingSystemName,
      status: 'success'
    });

    this.notify();
  }

  // --- School Setup Wizard Bulk Completion ---
  public completeSetupWizard(updates: {
    schoolInfo: Partial<SchoolInfo>;
    academicYearName: string;
    classesToAdd: string[];
    subjectsToAdd: string[];
  }) {
    let academicYears = [...this.state.academicYears];
    let currentYearId = this.state.currentAcademicYearId;

    if (updates.academicYearName && updates.academicYearName !== this.state.academicYears[0]?.name) {
      const newYearId = 'ay_' + Math.random().toString(36).substring(2, 7);
      academicYears.push({
        id: newYearId,
        name: updates.academicYearName,
        isCurrent: true,
        terms: [
          {
            id: 't_' + Math.random().toString(36).substring(2, 7),
            academicYearId: newYearId,
            name: 'Term 1',
            isCurrent: true,
            startDate: '2026-09-08',
            endDate: '2026-12-18'
          }
        ]
      });
      currentYearId = newYearId;
    }

    this.state = {
      ...this.state,
      schoolInfo: { ...this.state.schoolInfo, ...updates.schoolInfo },
      academicYears,
      currentAcademicYearId: currentYearId
    };

    const currentUser = this.getActiveUser();
    this.logAudit({
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Administrator',
      userRole: currentUser?.role || 'superadmin',
      action: 'School Setup Wizard Completed',
      affectedRecord: this.state.schoolInfo.name,
      details: 'Updated school configurations via 7-step wizard.',
      status: 'success'
    });

    this.notify();
  }

  // Reset to initial demo state
  public resetToFactoryDemo() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_USER_KEY);
    localStorage.removeItem(PREVIEW_ROLE_KEY);
    this.state = this.loadState();
    this.notify();
  }
}

export const schoolStore = new SchoolDataStore();
