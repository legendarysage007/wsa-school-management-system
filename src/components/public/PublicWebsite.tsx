import React from 'react';
import { SchoolInfo, SchoolEvent, SchoolAnnouncement } from '../../types';
import {
  BookOpen,
  Shield,
  Award,
  Users,
  Calendar,
  ArrowRight,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Bus,
  Cpu,
  GraduationCap,
  HeartPulse,
  Lock,
  ChevronRight
} from 'lucide-react';

interface Props {
  schoolInfo: SchoolInfo;
  events: SchoolEvent[];
  announcements: SchoolAnnouncement[];
  onOpenPortal: () => void;
}

export const PublicWebsite: React.FC<Props> = ({
  schoolInfo,
  events,
  announcements,
  onOpenPortal
}) => {
  const publishedAnnouncements = announcements.filter((a) => !a.isArchived).slice(0, 3);
  const upcomingEvents = events.filter((e) => e.isPublished).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Notification Strip */}
      <div className="bg-blue-950 text-white text-xs py-2 px-4 border-b border-blue-900">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-200">
              {schoolInfo.name} · 2026/2027 Academic Session Enrolment & First Term Active
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span>East Legon Hills, Accra</span>
            <span>·</span>
            <span className="font-mono">{schoolInfo.phone}</span>
          </div>
        </div>
      </div>

      {/* Website Navigation Header */}
      <header className="bg-white/95 backdrop-blur-xs border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={schoolInfo.logoUrl}
              alt="Wisdom Scholars Academy Seal"
              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shadow-2xs"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-blue-950 font-display block">
                {schoolInfo.name}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Accra, Ghana · Creche to JHS 3 Comprehensive Basic Education
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="#divisions"
              className="text-xs font-semibold text-slate-600 hover:text-blue-950 hidden md:inline-block transition-colors"
            >
              Academic Divisions
            </a>
            <a
              href="#facilities"
              className="text-xs font-semibold text-slate-600 hover:text-blue-950 hidden md:inline-block transition-colors"
            >
              Campus & Facilities
            </a>
            <a
              href="#admissions"
              className="text-xs font-semibold text-slate-600 hover:text-blue-950 hidden md:inline-block transition-colors"
            >
              Admissions
            </a>

            {/* Primary Action Button - Never "Launch school portal" */}
            <button
              onClick={onOpenPortal}
              className="px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-2 group"
            >
              <Lock className="w-3.5 h-3.5 text-blue-200" />
              <span>Sign In to School Portal</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        {/* Campus background with contrast scrim */}
        <div className="absolute inset-0 z-0 bg-slate-950">
          <img
            src={schoolInfo.bannerUrl}
            alt="Wisdom Scholars Academy Modern Campus"
            className="w-full h-full object-cover opacity-30 filter brightness-90"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/60" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-20 sm:py-28">
          <div className="flex items-center gap-3.5 mb-6">
            <img
              src={schoolInfo.logoUrl}
              alt="Wisdom Scholars Academy Crest"
              className="w-14 h-14 rounded-lg object-cover shadow-lg border border-amber-400/30"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
                Ghana Education Service & NaCCA Accredited
              </span>
              <div className="text-sm text-slate-300 font-medium">East Legon Hills, Greater Accra, Ghana</div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display max-w-3xl leading-tight">
            Nurturing Moral Excellence, Intellectual Curiosity & Servant Leadership.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Wisdom Scholars Academy offers a transformative basic education journey from Creche to JHS 3, integrating the Ghanaian National Curriculum with British Cambridge foundations, hands-on STEM, and holistic character formation.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenPortal}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-md transition-all flex items-center gap-2 group text-sm sm:text-base"
            >
              <span>Access Academy Portal (Parents & Staff)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#admissions"
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg backdrop-blur-xs transition-colors text-sm flex items-center gap-1.5"
            >
              <span>Admissions & Enrollment</span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </a>
          </div>

          {/* Key Metric Highlights */}
          <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-slate-300 text-xs sm:text-sm">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-display tabular-nums">Creche – JHS 3</div>
              <div className="text-slate-400 mt-1">Unified Basic Education Continuum</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-display tabular-nums">100% BECE</div>
              <div className="text-slate-400 mt-1">Distinction Track Record</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-display tabular-nums">STEM & Coding</div>
              <div className="text-slate-400 mt-1">Robotics & Modern ICT Labs</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-display tabular-nums">Verified Reports</div>
              <div className="text-slate-400 mt-1">Transparent Digital Assessment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Academic Continuum */}
      <section id="divisions" className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-8 w-full">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-wider text-blue-900 font-bold">
            Curriculum Pathways & Age Tiers
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 font-display">
            The Wisdom Scholars Learning Continuum
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Every child experiences a developmentally calibrated environment combining intellectual rigour, creative arts, and moral discipline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Stage 1 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">Stage 01 · Early Years</div>
              <h3 className="text-lg font-bold text-slate-900 font-display">Creche & Nursery</h3>
              <p className="text-xs text-slate-500 mt-1">Ages 1 to 3 Years</p>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Warm, secure, sensory-rich foundational care. Focus on phonemic awareness, speech development, gross and fine motor skills, and toilet training in hygienic suites.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-rose-900">
              ✓ Montessori-inspired learning manipulatives
            </div>
          </div>

          {/* Stage 2 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Stage 02 · Pre-School</div>
              <h3 className="text-lg font-bold text-slate-900 font-display">Kindergarten (KG 1 & 2)</h3>
              <p className="text-xs text-slate-500 mt-1">Ages 4 to 5 Years</p>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Structured early literacy, numeracy concepts, interactive storytelling, guided play, and social emotional maturity taught by seasoned childhood specialists.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-amber-900">
              ✓ Jolly Phonics & Singapore Math foundation
            </div>
          </div>

          {/* Stage 3 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Stage 03 · Primary Tier</div>
              <h3 className="text-lg font-bold text-slate-900 font-display">Primary (Basic 1 to 6)</h3>
              <p className="text-xs text-slate-500 mt-1">Ages 6 to 11 Years</p>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Comprehensive mastery of Mathematics, English, Integrated Science, Computing, Social Studies, Ghanaian Language (Twi/Ga), French, and Creative Arts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-blue-900">
              ✓ NaCCA standards & Cambridge assessments
            </div>
          </div>

          {/* Stage 4 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">Stage 04 · JHS Department</div>
              <h3 className="text-lg font-bold text-slate-900 font-display">Junior High (JHS 1 to 3)</h3>
              <p className="text-xs text-slate-500 mt-1">Ages 12 to 14 Years</p>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Rigorous preparation for BECE distinction, advanced STEM laboratory practice, leadership projects, debate tournaments, and Category A Senior High School placement.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-900">
              ✓ Intensive mock exams & career coaching
            </div>
          </div>
        </div>
      </section>

      {/* World-Class Campus Facilities */}
      <section id="facilities" className="bg-slate-100/70 py-16 sm:py-20 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
              Infrastructure & Safety
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 font-display">
              A Safe, Modern & Inspiring Campus
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Situated in the quiet, scenic residential setting of East Legon Hills, equipped with state-of-the-art facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-900 rounded-lg shrink-0">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">STEM & Computer Science Lab</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Individual desktop terminals, high-speed fiber internet, and robotics learning kits for learners from Basic 1 through JHS 3.
                </p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-lg shrink-0">
                <Bus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">Dedicated School Bus Transit</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Door-to-door and central stop bus service covering East Legon Hills, Ashaley Botwe, Adenta, Oyarifa, and School Junction.
                </p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="p-3 bg-amber-50 text-amber-900 rounded-lg shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">Gated Perimeter & CCTV Security</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  24/7 security personnel, monitored access gates, dynamic QR visitor passes, and full CCTV surveillance coverage.
                </p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="p-3 bg-rose-50 text-rose-900 rounded-lg shrink-0">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">School Infirmary & Registered Nurse</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  On-site health bay staffed throughout school hours with qualified health personnel for prompt care and wellness checks.
                </p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="p-3 bg-purple-50 text-purple-900 rounded-lg shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">Modern Library & Resource Center</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Rich collection of curated African and international literature, encyclopedias, reference texts, and cozy reading nooks.
                </p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-900 rounded-lg shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">Sports Arena & Creative Arts Center</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Multi-purpose synthetic courts for basketball, football, volleyball, athletics, plus dedicated music and art studios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admissions Process */}
      <section id="admissions" className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-8 w-full">
        <div className="bg-blue-950 text-white rounded-2xl p-8 sm:p-12 shadow-lg">
          <div className="max-w-2xl mb-10">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
              Joining Wisdom Scholars Academy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display mt-1">
              Admissions Open for All Grades
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              We welcome prospective learners from Creche through JHS 3 throughout the academic year. Follow our simple 3-step admission journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xs">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-sm mb-3">
                1
              </div>
              <h3 className="text-base font-bold text-white font-display">Application & Tour</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Obtain the official admission dossier from our East Legon Hills campus or request information via email. Schedule a guided campus tour.
              </p>
            </div>

            <div className="p-5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xs">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-sm mb-3">
                2
              </div>
              <h3 className="text-base font-bold text-white font-display">Diagnostic Assessment</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Learners complete a gentle diagnostic assessment in Literacy and Numeracy to ensure accurate placement within their developmental cohort.
              </p>
            </div>

            <div className="p-5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xs">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-sm mb-3">
                3
              </div>
              <h3 className="text-base font-bold text-white font-display">Enrolment & Onboarding</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Receive the formal admission letter, school uniform pack, and credentials to access your child's personalized digital portal.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-300">
              Admissions Helpline: <strong className="text-white font-mono">{schoolInfo.phone}</strong> · Email:{' '}
              <strong className="text-white">{schoolInfo.email}</strong>
            </div>

            <button
              onClick={onOpenPortal}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-2 transition-colors"
            >
              <span>Enrolled Families · Access School Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Announcements & Upcoming Academic Dates */}
      <section className="bg-slate-100/60 py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Announcements */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                    Official Communications
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 font-display mt-0.5">
                    School Announcements
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {publishedAnnouncements.map((ann) => (
                  <div key={ann.id} className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-slate-700">{ann.publishedBy}</span>
                      <span>{new Date(ann.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900">{ann.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ann.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                    Academy Calendar
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 font-display mt-0.5">
                    Upcoming Events & Dates
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {upcomingEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs flex items-start gap-3"
                  >
                    <div className="p-2.5 bg-blue-50 text-blue-900 rounded-md shrink-0 text-center min-w-[50px]">
                      <div className="text-[10px] uppercase font-bold text-blue-700">
                        {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                      </div>
                      <div className="text-base font-extrabold text-blue-950 font-display">
                        {new Date(evt.date).getDate()}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{evt.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{evt.description}</p>
                      <div className="mt-2 text-[11px] text-slate-500 flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {evt.time}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {evt.location}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-3">
              <img
                src={schoolInfo.logoUrl}
                alt="Crest"
                className="w-6 h-6 rounded-xs"
                referrerPolicy="no-referrer"
              />
              <span>{schoolInfo.name}</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Motto: <strong className="text-slate-200">{schoolInfo.motto}</strong>
            </p>
            <p className="mt-2 text-slate-400">
              {schoolInfo.location}, {schoolInfo.city}, {schoolInfo.country}
            </p>
            <p className="text-slate-400">Ghana Post GPS: {schoolInfo.gpsAddress}</p>
          </div>

          <div>
            <div className="text-white font-semibold mb-3">Campus Contact & Enquiries</div>
            <p className="flex items-center gap-1.5 mb-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{schoolInfo.phone}</span>
            </p>
            <p className="flex items-center gap-1.5 mb-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{schoolInfo.email}</span>
            </p>
            <p className="mt-2">Headteacher: {schoolInfo.headteacherName}</p>
          </div>

          <div>
            <div className="text-white font-semibold mb-3">Official Academy Portal</div>
            <p className="text-slate-400 mb-3 leading-relaxed">
              Unified digital access for Administrators, Teachers, Headteachers, and Parents of Wisdom Scholars Academy.
            </p>
            <button
              onClick={onOpenPortal}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-md transition-colors text-xs inline-flex items-center gap-1.5 shadow-xs"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In to School Portal</span>
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-8 pt-6 border-t border-slate-800 text-center text-slate-500">
          © {new Date().getFullYear()} {schoolInfo.name}, East Legon Hills, Accra, Ghana. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
