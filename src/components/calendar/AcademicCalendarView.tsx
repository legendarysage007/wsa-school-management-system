import React, { useState } from 'react';
import { AcademicCalendarEvent, CalendarEventType, UserRole } from '../../types';
import { schoolStore } from '../../services/store';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  X,
  Check,
  Tag,
  Filter,
  AlertCircle,
  Flag,
  Sparkles,
  BookOpen,
  Trash2
} from 'lucide-react';

interface Props {
  events: AcademicCalendarEvent[];
  userRole: UserRole;
  canManage: boolean;
}

export const AcademicCalendarView: React.FC<Props> = ({
  events,
  userRole,
  canManage
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [isAddEventOpen, setIsAddEventOpen] = useState<boolean>(false);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newStartDate, setNewStartDate] = useState('2026-10-26');
  const [newEndDate, setNewEndDate] = useState('2026-10-30');
  const [newType, setNewType] = useState<CalendarEventType>('exam_period');
  const [newAudience, setNewAudience] = useState<'all' | 'staff' | 'parents' | 'students'>('all');
  const [newDesc, setNewDesc] = useState('');

  const typeConfig: Record<
    CalendarEventType,
    { label: string; bg: string; text: string; border: string }
  > = {
    term_dates: {
      label: 'Term Dates',
      bg: 'bg-blue-50',
      text: 'text-blue-900',
      border: 'border-blue-200'
    },
    exam_period: {
      label: 'Examination Period',
      bg: 'bg-purple-50',
      text: 'text-purple-900',
      border: 'border-purple-200'
    },
    holiday: {
      label: 'Holiday / Break',
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-200'
    },
    pta_meeting: {
      label: 'PTA & Assembly',
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      border: 'border-emerald-200'
    },
    activity: {
      label: 'School Activity',
      bg: 'bg-indigo-50',
      text: 'text-indigo-900',
      border: 'border-indigo-200'
    }
  };

  const filteredEvents = events
    .filter((e) => filterType === 'all' || e.eventType === filterType)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const handleSaveEvent = () => {
    if (!newTitle.trim()) return;

    schoolStore.addCalendarEvent({
      title: newTitle.trim(),
      startDate: newStartDate,
      endDate: newEndDate,
      eventType: newType,
      audience: newAudience,
      description: newDesc || `${newTitle} scheduled on the official academic calendar.`,
      isPublished: true
    });

    setIsAddEventOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  // Compute upcoming milestone count
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingCount = events.filter((e) => e.endDate >= todayStr).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/70">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-900 rounded-md">
                <CalendarIcon className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-950">
                Official School Master Schedule
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-mono">
                2026/2027 Academic Session
              </span>
            </div>
            <h2 className="text-lg font-bold font-display text-slate-900 mt-1">
              Shared Academic Calendar
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Synchronized term schedules, examination windows, and statutory holidays accessible to Administration and Leadership.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {canManage && (
              <button
                onClick={() => setIsAddEventOpen(true)}
                className="px-3.5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Milestone</span>
              </button>
            )}
          </div>
        </div>

        {/* Milestone Summary Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-200 text-xs">
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <div className="text-slate-500 font-medium">Total Milestones</div>
            <div className="text-xl font-bold font-mono text-slate-900 tabular-nums mt-0.5">
              {events.length}
            </div>
            <div className="text-[10.5px] text-slate-400">Published dates</div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <div className="text-slate-500 font-medium">Exam Windows</div>
            <div className="text-xl font-bold font-mono text-purple-900 tabular-nums mt-0.5">
              {events.filter((e) => e.eventType === 'exam_period').length}
            </div>
            <div className="text-[10.5px] text-slate-400">Mid-term & terminal</div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <div className="text-slate-500 font-medium">School Holidays</div>
            <div className="text-xl font-bold font-mono text-amber-800 tabular-nums mt-0.5">
              {events.filter((e) => e.eventType === 'holiday').length}
            </div>
            <div className="text-[10.5px] text-slate-400">Ghana public & breaks</div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <div className="text-slate-500 font-medium">Remaining This Term</div>
            <div className="text-xl font-bold font-mono text-emerald-800 tabular-nums mt-0.5">
              {upcomingCount}
            </div>
            <div className="text-[10.5px] text-emerald-700 font-medium">Active horizon</div>
          </div>
        </div>
      </div>

      {/* Filter Category Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-white flex items-center gap-1.5 overflow-x-auto text-xs">
        {[
          { id: 'all', label: 'All Dates' },
          { id: 'term_dates', label: 'Term Dates & Resumptions' },
          { id: 'exam_period', label: 'Examination Windows' },
          { id: 'holiday', label: 'Holidays & Breaks' },
          { id: 'pta_meeting', label: 'PTA Meetings' },
          { id: 'activity', label: 'School Gatherings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors whitespace-nowrap ${
              filterType === tab.id
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline List of Events */}
      <div className="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No calendar milestones found for this filter.
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const cfg = typeConfig[evt.eventType] || typeConfig.activity;
            const isMultiDay = evt.startDate !== evt.endDate;

            const startObj = new Date(evt.startDate);
            const monthName = startObj.toLocaleString('default', { month: 'short' });
            const dayNum = startObj.getDate();

            const isPast = evt.endDate < todayStr;
            const isCurrent = evt.startDate <= todayStr && evt.endDate >= todayStr;

            return (
              <div
                key={evt.id}
                className={`p-4 transition-colors flex items-start justify-between gap-4 ${
                  isCurrent ? 'bg-blue-50/40' : 'hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Calendar Date Block */}
                  <div className="p-2.5 bg-slate-100 rounded-lg text-center min-w-[56px] border border-slate-200 shrink-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {monthName}
                    </div>
                    <div className="text-base font-extrabold font-display text-slate-900 tabular-nums">
                      {dayNum}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                      >
                        {cfg.label}
                      </span>

                      {isCurrent && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Active Now
                        </span>
                      )}

                      {isPast && (
                        <span className="text-[10px] font-semibold text-slate-400">
                          Past Milestone
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      {evt.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="text-[11px] font-mono text-slate-500 pt-0.5 flex items-center gap-2">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>
                        {evt.startDate}
                        {isMultiDay ? ` → ${evt.endDate}` : ''}
                      </span>
                      <span>·</span>
                      <span className="capitalize">Audience: {evt.audience}</span>
                    </div>
                  </div>
                </div>

                {canManage && (
                  <button
                    onClick={() => schoolStore.deleteCalendarEvent(evt.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors shrink-0"
                    title="Delete milestone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Milestone Modal for Administrators */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-blue-900 tracking-wider">
                  Master Schedule Entry
                </span>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Add Academic Calendar Milestone
                </h3>
              </div>
              <button
                onClick={() => setIsAddEventOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Term 1 End-of-Term Examinations"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Milestone Category *
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="term_dates">Term Dates & Resumption</option>
                  <option value="exam_period">Examination Period</option>
                  <option value="holiday">School / Public Holiday</option>
                  <option value="pta_meeting">PTA Meeting / Assembly</option>
                  <option value="activity">School Gathering / Activity</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Audience
                </label>
                <select
                  value={newAudience}
                  onChange={(e) => setNewAudience(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="all">Entire Academy Community</option>
                  <option value="staff">Staff & Faculty Only</option>
                  <option value="parents">Parents & Guardians</option>
                  <option value="students">Learners / Scholars</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description & Instructions
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Official instructions or description..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsAddEventOpen(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEvent}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Milestone</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
