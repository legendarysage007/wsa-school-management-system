export type UserRole = 'superadmin' | 'admin' | 'teacher' | 'headteacher' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  staffId?: string;
  avatarUrl?: string;
  assignedClassIds?: string[]; // for teachers
  assignedSubjectIds?: string[]; // for teachers
  linkedStudentIds?: string[]; // for parents
  title?: string; // e.g. "Mr.", "Mrs.", "Dr.", "Rev."
  status: 'active' | 'suspended';
  lastLoginAt?: string;
}

export interface DeviceSession {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  deviceId: string;
  deviceName: string;
  ipAddress: string;
  createdAt: string;
  lastActiveAt: string;
  isActive: boolean;
}

export interface SchoolInfo {
  name: string;
  tagline: string;
  location: string;
  city: string;
  country: string;
  gpsAddress: string;
  email: string;
  phone: string;
  logoUrl: string;
  bannerUrl: string;
  headteacherName: string;
  motto: string;
}

export interface AcademicYear {
  id: string;
  name: string; // e.g., "2026/2027"
  isCurrent: boolean;
  terms: Term[];
}

export interface Term {
  id: string;
  academicYearId: string;
  name: string; // "Term 1", "Term 2", "Term 3"
  isCurrent: boolean;
  startDate: string;
  endDate: string;
  nextTermBegins?: string;
}

export interface SchoolClass {
  id: string;
  name: string; // e.g., "Creche", "Nursery 1", "KG 2", "Basic 4", "JHS 2"
  level: 'creche' | 'nursery' | 'kindergarten' | 'primary' | 'jhs';
  academicYearId: string;
  termId: string;
  classTeacherId?: string;
  roomNumber?: string;
  capacity?: number;
}

export interface Subject {
  id: string;
  name: string; // "Mathematics", "Integrated Science", "English Language"
  code: string; // "MATH", "SCI", "ENG"
  category: 'core' | 'elective' | 'creative';
  applicableLevels: Array<'creche' | 'nursery' | 'kindergarten' | 'primary' | 'jhs'>;
}

export interface Student {
  id: string;
  studentIdNumber: string; // e.g., "WSA/2026/042"
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  photoUrl: string;
  hometown: string;
  residentialAddress: string;
  gpsAddress: string; // e.g. "GW-0412-9821"
  classId: string;
  enrollmentStatus: 'enrolled' | 'alumni' | 'withdrawn';
  enrollmentDate: string;
  
  // Parent/Guardian info
  parentName: string;
  parentPhone: string;
  parentRelationship: 'Father' | 'Mother' | 'Guardian';
  parentAddress: string;
  parentOccupation: string;
  emergencyContact: string;
  parentPhotoUrl?: string;
  parentUserId?: string;
}

export type AssessmentStatus = 'upcoming' | 'current' | 'completed';

export interface Assessment {
  id: string;
  title: string;
  academicYearId: string;
  termId: string;
  classId: string;
  subjectId: string;
  startDate: string;
  endDate: string;
  assessmentType: 'mid_term' | 'terminal_exam' | 'class_test' | 'project';
  maxScore: number;
  weightPercentage: number;
  status: AssessmentStatus;
  instructions?: string;
  createdAt: string;
}

export type CalendarEventType = 'term_dates' | 'exam_period' | 'holiday' | 'pta_meeting' | 'activity';

export interface AcademicCalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  eventType: CalendarEventType;
  termId?: string;
  academicYearId?: string;
  audience: 'all' | 'staff' | 'parents' | 'students';
  description: string;
  isPublished: boolean;
  createdById?: string;
}

export interface GradingScaleItem {
  grade: string; // "1" / "A+", "2" / "A", etc.
  minScore: number;
  maxScore: number;
  remark: string; // "Excellent", "Higher", "Credit", "Pass", "Fail"
}

export interface GradingConfig {
  classScoreWeight: number; // e.g. 30 (%) or 40
  examScoreWeight: number;  // e.g. 70 (%) or 60
  gradingSystemName: string; // "Ghana BECE 9-point scale" or "Standard Alpha (A-F)"
  scale: GradingScaleItem[];
}

export interface SubjectScore {
  subjectId: string;
  subjectName: string;
  classScore: number; // out of classScoreWeight
  examScore: number;  // out of examScoreWeight
  totalScore: number; // classScore + examScore
  grade: string;      // computed
  remark: string;
  subjectPosition?: number;
}

export interface TerminalReport {
  id: string;
  studentId: string;
  classId: string;
  academicYearId: string;
  termId: string;
  scores: SubjectScore[];
  overallTotal: number;
  overallAverage: number;
  overallPosition: number;
  classSize: number;
  attendanceDaysPresent: number;
  attendanceTotalDays: number;
  conduct: string;
  interestAndAttitude: string;
  teacherComment: string;
  teacherId?: string;
  headteacherComment: string;
  headteacherApprovedAt?: string;
  status: 'draft' | 'submitted' | 'approved' | 'published';
  publishedAt?: string;
  updatedAt: string;
}

export interface DynamicAttendanceToken {
  token: string;
  sessionId: string;
  generatedAt: number; // server timestamp ms
  expiresAt: number;   // 2 minutes later
}

export interface AttendanceSession {
  id: string;
  title: string;
  sessionType: 'daily_staff' | 'staff_meeting' | 'pta_meeting' | 'workshop' | 'official_event';
  date: string;
  startTime: string; // "07:00"
  endTime: string;   // "17:00"
  status: 'active' | 'closed';
  currentToken: DynamicAttendanceToken;
  createdById: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  sessionTitle: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'sign_in' | 'sign_out';
  serverTimestamp: string; // ISO string from server
  deviceInfo: string;
  verificationToken: string;
  notes?: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  audience: 'all' | 'parents' | 'staff' | 'students';
  category: 'academic' | 'meeting' | 'holiday' | 'extracurricular';
  isPublished: boolean;
  createdAt: string;
}

export interface SchoolAnnouncement {
  id: string;
  title: string;
  content: string;
  priority: 'normal' | 'important' | 'urgent';
  targetAudience: 'all' | 'parents' | 'staff';
  isArchived: boolean;
  publishedAt: string;
  publishedBy: string;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  affectedRecord: string;
  details: string;
  timestamp: string;
  previousValue?: string;
  newValue?: string;
  status: 'success' | 'warning' | 'denied';
}
