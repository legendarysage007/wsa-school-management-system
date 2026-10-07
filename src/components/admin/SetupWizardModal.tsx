import React, { useState } from 'react';
import { SchoolInfo } from '../../types';
import { schoolStore } from '../../services/store';
import { X, Check, ArrowRight, ArrowLeft, School, Calendar, BookOpen, Users, CheckCircle2, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentInfo: SchoolInfo;
  onCompleted: () => void;
}

export const SetupWizardModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentInfo,
  onCompleted
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 7;

  // Step 1: School Info
  const [schoolName, setSchoolName] = useState(currentInfo.name);
  const [motto, setMotto] = useState(currentInfo.motto);
  const [location, setLocation] = useState(currentInfo.location);
  const [gpsAddress, setGpsAddress] = useState(currentInfo.gpsAddress);
  const [phone, setPhone] = useState(currentInfo.phone);

  // Step 2: Academic Year
  const [academicYearName, setAcademicYearName] = useState('2026/2027');
  const [currentTerm, setCurrentTerm] = useState('Term 1');

  // Step 3: Classes check
  const [classesConfirmed, setClassesConfirmed] = useState(true);

  // Step 4: Subjects check
  const [subjectsConfirmed, setSubjectsConfirmed] = useState(true);

  // Step 5: Staff
  const [headteacherName, setHeadteacherName] = useState(currentInfo.headteacherName);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finalize
      schoolStore.completeSetupWizard({
        schoolInfo: {
          name: schoolName,
          motto,
          location,
          gpsAddress,
          phone,
          headteacherName
        },
        academicYearName,
        classesToAdd: [],
        subjectsToAdd: []
      });
      onCompleted();
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepTitles = [
    'School Information',
    'Academic Year & Term',
    'Classes Structure',
    'Curriculum Subjects',
    'Leadership & Staff',
    'Verification & Review',
    'School Ready'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Step indicator */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-blue-900">
              School Setup Wizard · Step {currentStep} of {totalSteps}
            </span>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display mt-0.5">
            {stepTitles[currentStep - 1]}
          </h3>

          {/* Stepper bar */}
          <div className="grid grid-cols-7 gap-1.5 mt-3">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx + 1 < currentStep
                    ? 'bg-emerald-600'
                    : idx + 1 === currentStep
                    ? 'bg-blue-900'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Contents */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Configure your school's core identity details for official documents, report cards, and parent notifications.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">School Name</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">School Motto</label>
                <input
                  type="text"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ghana Post GPS</label>
                  <input
                    type="text"
                    value={gpsAddress}
                    onChange={(e) => setGpsAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Define the primary academic session and active teaching term.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Year</label>
                <input
                  type="text"
                  value={academicYearName}
                  onChange={(e) => setAcademicYearName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  placeholder="2026/2027"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Active Term</label>
                <select
                  value={currentTerm}
                  onChange={(e) => setCurrentTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="Term 1">Term 1 (September – December)</option>
                  <option value="Term 2">Term 2 (January – April)</option>
                  <option value="Term 3">Term 3 (May – July)</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Wisdom Scholars Academy runs a unified Ghanaian progression from Creche through JHS 3:
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
                <div className="font-semibold text-slate-800">Pre-configured Classes:</div>
                <div className="text-slate-600 leading-relaxed">
                  Creche · Nursery 1 & 2 · Kindergarten 1 & 2 · Basic 1 through Basic 6 · JHS 1 through JHS 3.
                </div>
                <div className="text-[11px] text-emerald-700 pt-1 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>14 progressive class cohorts ready.</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Standard NaCCA / Basic Education curriculum subjects:
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                <div className="font-semibold text-slate-800">Core & Elective Subjects:</div>
                <div className="text-slate-600">
                  Mathematics · English Language · Integrated Science · Social Studies · Computing (ICT) · Ghanaian Language (Twi) · Religious & Moral Education (RME) · Creative Arts & Design · Physical Education.
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Verify leadership and reporting signatories:
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Headteacher Name</label>
                <input
                  type="text"
                  value={headteacherName}
                  onChange={(e) => setHeadteacherName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Signs official terminal report cards and publishes approved comments.
                </p>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                <div className="font-bold text-slate-900 border-b border-slate-200 pb-2">
                  Setup Summary
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">School:</span>
                  <span className="font-medium text-slate-900">{schoolName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-medium text-slate-900">{location} ({gpsAddress})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Academic Year:</span>
                  <span className="font-medium font-mono text-slate-900">{academicYearName} · {currentTerm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Headteacher:</span>
                  <span className="font-medium text-slate-900">{headteacherName}</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="text-base font-bold text-slate-900 font-display">
                Wisdom Scholars Academy Is Ready!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                All classes, subjects, grading configurations, and role workspaces are fully activated.
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          {currentStep > 1 && currentStep < totalSteps ? (
            <button
              onClick={handleBack}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>{currentStep === totalSteps ? 'Complete Setup' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
