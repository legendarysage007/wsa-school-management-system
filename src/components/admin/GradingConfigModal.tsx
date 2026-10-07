import React, { useState } from 'react';
import { GradingConfig, GradingScaleItem } from '../../types';
import { schoolStore } from '../../services/store';
import { X, Check, Plus, Trash2, Sliders, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: GradingConfig;
  onSave: () => void;
}

export const GradingConfigModal: React.FC<Props> = ({ isOpen, onClose, config, onSave }) => {
  const [classWeight, setClassWeight] = useState<number>(config.classScoreWeight);
  const [examWeight, setExamWeight] = useState<number>(config.examScoreWeight);
  const [systemName, setSystemName] = useState<string>(config.gradingSystemName);
  const [scale, setScale] = useState<GradingScaleItem[]>(config.scale);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleWeightChange = (newClassWeight: number) => {
    setClassWeight(newClassWeight);
    setExamWeight(100 - newClassWeight);
  };

  const handleScaleItemChange = (index: number, field: keyof GradingScaleItem, value: any) => {
    const updated = [...scale];
    updated[index] = { ...updated[index], [field]: value };
    setScale(updated);
  };

  const handleAddScaleItem = () => {
    setScale([
      ...scale,
      { grade: 'New', minScore: 0, maxScore: 30, remark: 'Pass' }
    ]);
  };

  const handleRemoveScaleItem = (index: number) => {
    if (scale.length <= 2) {
      setError('At least two grading scale tiers are required.');
      return;
    }
    setScale(scale.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (classWeight + examWeight !== 100) {
      setError('Class Score and Exam Score weights must sum to 100%.');
      return;
    }

    schoolStore.updateGradingConfig({
      classScoreWeight: classWeight,
      examScoreWeight: examWeight,
      gradingSystemName: systemName,
      scale
    });

    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-blue-900">
              Self-Service Academic Configuration
            </span>
            <h3 className="text-base font-bold text-slate-900 font-display mt-0.5">
              Grading & Score Calculation Rules
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-lg border border-rose-200">
              {error}
            </div>
          )}

          {/* System Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Grading Framework Name
            </label>
            <input
              type="text"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
              placeholder="e.g. Ghana Basic Education 9-Point Scale"
            />
          </div>

          {/* Score Weights (Class % vs Exam %) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">
                Continuous Assessment vs Examination Weights
              </span>
              <span className="text-xs font-mono font-bold text-blue-900">
                Class: {classWeight}% · Exam: {examWeight}% (Total: 100%)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Class Score Weight (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={classWeight}
                  onChange={(e) => handleWeightChange(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Exam Score Weight (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={examWeight}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-600 cursor-not-allowed"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Standard Ghana Basic / NaCCA guideline is 30% Class Continuous Assessment (exercises, projects, tests) and 70% Terminal Examination.
            </p>
          </div>

          {/* Grade Scale Bands */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Grade Boundaries & Remarks</h4>
                <p className="text-[11px] text-slate-500">
                  Scores calculated out of 100 will automatically map to these grades.
                </p>
              </div>
              <button
                onClick={handleAddScaleItem}
                className="px-2.5 py-1 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Tier</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="py-2 px-3 font-semibold">Grade</th>
                    <th className="py-2 px-3 font-semibold">Min Score</th>
                    <th className="py-2 px-3 font-semibold">Max Score</th>
                    <th className="py-2 px-3 font-semibold">Remark</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scale.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-1.5 px-3">
                        <input
                          type="text"
                          value={item.grade}
                          onChange={(e) => handleScaleItemChange(idx, 'grade', e.target.value)}
                          className="w-16 px-2 py-1 border border-slate-300 rounded text-xs font-bold text-slate-900"
                        />
                      </td>
                      <td className="py-1.5 px-3">
                        <input
                          type="number"
                          value={item.minScore}
                          onChange={(e) => handleScaleItemChange(idx, 'minScore', Number(e.target.value))}
                          className="w-16 px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                        />
                      </td>
                      <td className="py-1.5 px-3">
                        <input
                          type="number"
                          value={item.maxScore}
                          onChange={(e) => handleScaleItemChange(idx, 'maxScore', Number(e.target.value))}
                          className="w-16 px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                        />
                      </td>
                      <td className="py-1.5 px-3">
                        <input
                          type="text"
                          value={item.remark}
                          onChange={(e) => handleScaleItemChange(idx, 'remark', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-300 rounded text-xs text-slate-700"
                        />
                      </td>
                      <td className="py-1.5 px-3 text-right">
                        <button
                          onClick={() => handleRemoveScaleItem(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Grading Rules</span>
          </button>
        </div>
      </div>
    </div>
  );
};
