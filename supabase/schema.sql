-- WISDOM SCHOLARS ACADEMY - PRODUCTION SUPABASE DATABASE SCHEMA
-- Features: Normalized relational tables, Row-Level Security (RLS) policies,
-- RBAC enforcement, server-side dynamic QR validations, and audit trails.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('superadmin', 'admin', 'teacher', 'headteacher', 'parent');
CREATE TYPE level_group AS ENUM ('creche', 'nursery', 'kindergarten', 'primary', 'jhs');
CREATE TYPE assessment_status AS ENUM ('upcoming', 'current', 'completed', 'archived');
CREATE TYPE attendance_action AS ENUM ('sign_in', 'sign_out');
CREATE TYPE report_status AS ENUM ('draft', 'submitted', 'approved', 'published');

-- 3. SCHOOLS TABLE
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    tagline TEXT,
    motto TEXT NOT NULL,
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Ghana',
    gps_address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    logo_url TEXT,
    headteacher_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'parent',
    phone TEXT,
    staff_id TEXT,
    title TEXT,
    avatar_url TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ACADEMIC YEARS & TERMS
CREATE TABLE IF NOT EXISTS public.academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE, -- e.g. '2026/2027'
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.terms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- 'Term 1', 'Term 2', 'Term 3'
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    next_term_begins DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CLASSES (Creche through JHS 3)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    level level_group NOT NULL,
    room_number TEXT,
    capacity INT DEFAULT 35,
    class_teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. SUBJECTS
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL DEFAULT 'core',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. GUARDIANS / PARENTS
CREATE TABLE IF NOT EXISTS public.guardians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    phone TEXT NOT NULL,
    residential_address TEXT NOT NULL,
    gps_address TEXT,
    occupation TEXT,
    emergency_contact TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. STUDENTS
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id_number TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT NOT NULL,
    photo_url TEXT,
    hometown TEXT,
    residential_address TEXT NOT NULL,
    gps_address TEXT NOT NULL,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE RESTRICT,
    enrollment_status TEXT NOT NULL DEFAULT 'enrolled',
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    primary_guardian_id UUID REFERENCES public.guardians(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. ASSESSMENTS (Current, Past, and Future temporal model)
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id),
    term_id UUID NOT NULL REFERENCES public.terms(id),
    class_id UUID NOT NULL REFERENCES public.classes(id),
    subject_id UUID NOT NULL REFERENCES public.subjects(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    assessment_type TEXT NOT NULL DEFAULT 'continuous_assessment', -- 'class_test', 'mid_term', 'terminal_exam', 'project'
    max_score NUMERIC(5, 2) NOT NULL DEFAULT 100,
    weight_percentage NUMERIC(5, 2) NOT NULL DEFAULT 30,
    status assessment_status NOT NULL DEFAULT 'upcoming',
    instructions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. ASSESSMENT RESULTS
CREATE TABLE IF NOT EXISTS public.assessment_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    score_obtained NUMERIC(5, 2) NOT NULL,
    teacher_id UUID REFERENCES public.profiles(id),
    teacher_remark TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(assessment_id, student_id)
);

-- 12. TERMINAL REPORTS (Official digital report card with publication workflow)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id),
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id),
    term_id UUID NOT NULL REFERENCES public.terms(id),
    overall_total NUMERIC(7, 2) NOT NULL,
    overall_average NUMERIC(5, 2) NOT NULL,
    overall_position INT NOT NULL,
    class_size INT NOT NULL,
    attendance_present INT NOT NULL DEFAULT 0,
    attendance_total INT NOT NULL DEFAULT 0,
    conduct TEXT,
    interest_and_attitude TEXT,
    teacher_comment TEXT,
    teacher_id UUID REFERENCES public.profiles(id),
    headteacher_comment TEXT,
    headteacher_approved_at TIMESTAMPTZ,
    status report_status NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, term_id)
);

-- 13. DYNAMIC ATTENDANCE SESSIONS & TOKENS
-- CRITICAL SECURITY RULE: ONLY Superadmin and Administrator can create sessions!
CREATE TABLE IF NOT EXISTS public.attendance_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    session_type TEXT NOT NULL, -- 'daily_staff', 'staff_meeting', 'pta_meeting', 'workshop', 'official_event'
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    current_token TEXT NOT NULL,
    token_generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    token_expires_at TIMESTAMPTZ NOT NULL, -- Valid for 2 minutes
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    action attendance_action NOT NULL,
    server_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verification_token TEXT NOT NULL,
    device_info TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(session_id, user_id, action) -- Prevent duplicate sign-in or duplicate sign-out
);

-- 14. ACADEMIC CALENDAR & MILESTONES (Shared Admin & Headteacher view)
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    event_type TEXT NOT NULL, -- 'term_dates', 'exam_period', 'holiday', 'pta_meeting', 'activity'
    audience TEXT NOT NULL DEFAULT 'all', -- 'all', 'staff', 'parents', 'students'
    description TEXT,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'normal', -- 'normal', 'important', 'urgent'
    target_audience TEXT NOT NULL DEFAULT 'all',
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    published_by_id UUID REFERENCES public.profiles(id),
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. DEVICE SESSIONS (Single active device enforcement for staff)
CREATE TABLE IF NOT EXISTS public.device_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    device_name TEXT,
    ip_address TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. TAMPER-RESISTANT AUDIT LOG
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id),
    user_name TEXT NOT NULL,
    user_role user_role NOT NULL,
    action TEXT NOT NULL,
    affected_record TEXT NOT NULL,
    details TEXT NOT NULL,
    previous_value JSONB,
    new_value JSONB,
    status TEXT NOT NULL DEFAULT 'success',
    server_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 18. ROW LEVEL SECURITY (RLS) POLICIES
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check role
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- SUPERADMIN & ADMIN: Full operational access
CREATE POLICY "Superadmin and admin full access to schools"
  ON public.schools FOR ALL
  USING (get_auth_role() IN ('superadmin', 'admin'));

CREATE POLICY "Public read-only for school info"
  ON public.schools FOR SELECT
  USING (true);

-- STUDENTS: Parents can only select their own linked children
CREATE POLICY "Parents view only their children"
  ON public.students FOR SELECT
  USING (
    get_auth_role() IN ('superadmin', 'admin', 'headteacher')
    OR (get_auth_role() = 'parent' AND primary_guardian_id IN (
      SELECT id FROM public.guardians WHERE user_id = auth.uid()
    ))
    OR (get_auth_role() = 'teacher' AND class_id IN (
      SELECT id FROM public.classes WHERE class_teacher_id = auth.uid()
    ))
  );

-- ASSESSMENTS & REPORTS:
-- Parents can only view published reports of their children
CREATE POLICY "Parents read only published reports"
  ON public.reports FOR SELECT
  USING (
    get_auth_role() IN ('superadmin', 'admin', 'headteacher')
    OR (get_auth_role() = 'teacher' AND class_id IN (
      SELECT id FROM public.classes WHERE class_teacher_id = auth.uid()
    ))
    OR (get_auth_role() = 'parent' AND status = 'published' AND student_id IN (
      SELECT id FROM public.students WHERE primary_guardian_id IN (
        SELECT id FROM public.guardians WHERE user_id = auth.uid()
      )
    ))
  );

-- ATTENDANCE SESSIONS:
-- CRITICAL SECURITY RULE: ONLY Superadmin and Administrator can INSERT or UPDATE attendance sessions
CREATE POLICY "Only admin and superadmin create attendance sessions"
  ON public.attendance_sessions FOR INSERT
  WITH CHECK (get_auth_role() IN ('superadmin', 'admin'));

CREATE POLICY "Staff view active sessions to scan"
  ON public.attendance_sessions FOR SELECT
  USING (status = 'active' OR get_auth_role() IN ('superadmin', 'admin'));

-- AUDIT LOGS: Read-only for Superadmin
CREATE POLICY "Superadmin audit log view"
  ON public.audit_logs FOR SELECT
  USING (get_auth_role() = 'superadmin');
