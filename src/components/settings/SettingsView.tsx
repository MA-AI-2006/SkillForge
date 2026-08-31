import React, { useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Target,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { CareerRole, SkillForgeState } from '../../types';
import { CAREER_ROLES } from '../../data/careerRoles';
import { exportStateAsJSON, importStateFromJSON, resetState } from '../../services/storageService';

interface SettingsViewProps {
  state: SkillForgeState;
  onStateChange: (newState: SkillForgeState) => void;
  onRoleChange: (role: CareerRole) => void;
  onToggleExampleMode: () => void;
  isExampleMode: boolean;
  onNavigate: (tab: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  state,
  onStateChange,
  onRoleChange,
  onToggleExampleMode,
  isExampleMode,
  onNavigate
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = () => {
    const jsonStr = exportStateAsJSON(state);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillForge_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const newState = importStateFromJSON(text);
        onStateChange(newState);
        setImportStatus('Successfully imported SkillForge profile and assessment history!');
        setTimeout(() => setImportStatus(null), 4000);
      } catch (err) {
        setImportStatus('Invalid backup file. Please provide a valid SkillForge JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    const emptyState = resetState();
    onStateChange(emptyState);
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Settings className="w-5 h-5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Application Preferences & Data
          </span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          Settings & Local Data Management
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          SkillForge stores all your profile information, assessment submissions, and coach conversations privately in your browser.
        </p>
      </div>

      {importStatus && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Target Career Track Selector */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900">
          Target Career Specialization
        </h3>
        <p className="text-xs text-slate-500">
          Changing your target track updates your benchmark competencies, roadmap, and recommended practical simulations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {CAREER_ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => onRoleChange(role.name)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                state.profile.targetRole === role.name
                  ? 'bg-indigo-50/70 border-indigo-600 text-indigo-900 font-bold shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 font-medium'
              }`}
            >
              <div className="text-xs font-bold mb-1">{role.name}</div>
              <div className="text-[10px] text-slate-400">{role.badge}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Demonstration / Example Profile Toggle */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Interactive Example Candidate Profile
            </h3>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Preview SkillForge populated with realistic candidate data for <strong>Alex Carter</strong> (AI/ML Engineer track with completed practical assessment).
          </p>
        </div>

        <button
          onClick={onToggleExampleMode}
          className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 cursor-pointer whitespace-nowrap transition-colors"
        >
          {isExampleMode ? 'Exit Example Mode' : 'Load Example Profile'}
        </button>
      </div>

      {/* Data Backup & Export / Import */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900">
          Data Export & Portability
        </h3>
        <p className="text-xs text-slate-500">
          Download your complete profile, verified skill evidence, and assessment history as a portable JSON file.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export SkillForge Data (JSON)</span>
          </button>

          <label className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs shadow-2xs cursor-pointer flex items-center gap-2 transition-colors">
            <Upload className="w-4 h-4 text-indigo-600" />
            <span>Import Data Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleImport(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone: Reset State */}
      <div className="bg-rose-50/50 border border-rose-200/80 rounded-3xl p-6 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-rose-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>Reset Application Data</span>
        </h3>
        <p className="text-xs text-rose-700 leading-relaxed">
          This will permanently delete all your local profile fields, uploaded resume analysis, and completed practical assessments.
        </p>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
        >
          Reset All Data
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Confirm Reset?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to clear your local data? This action cannot be undone unless you have exported a JSON backup.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
