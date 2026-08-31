import React, { useState } from 'react';
import {
  Layers,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  CheckSquare,
  Sparkles,
  Info,
  Plus,
  Trash2,
  TrendingUp,
  X,
  Target
} from 'lucide-react';
import { SkillCategory, SkillForgeState, UserSkill } from '../../types';
import { computeSkillGaps } from '../../services/readinessEngine';
import { CAREER_ROLES } from '../../data/careerRoles';

interface SkillsViewProps {
  state: SkillForgeState;
  onUpdateSkills: (skills: UserSkill[]) => void;
  onNavigate: (tab: string, extraData?: any) => void;
}

export const SkillsView: React.FC<SkillsViewProps> = ({
  state,
  onUpdateSkills,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSkillDetail, setActiveSkillDetail] = useState<UserSkill | null>(null);

  // Quick Add Skill Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('Languages');
  const [newSkillLevel, setNewSkillLevel] = useState(6);

  const targetRoleName = state.profile.targetRole || 'AI / ML Engineer';
  const roleConfig = CAREER_ROLES.find((r) => r.name === targetRoleName);

  const skillGaps = computeSkillGaps(state.skills, targetRoleName);

  const categories: string[] = ['all', 'Languages', 'Frameworks', 'Infrastructure', 'Databases', 'Core Concepts', 'Security & Ops'];

  const filteredGaps = skillGaps.filter((g) => {
    const matchesCategory = selectedCategory === 'all' || g.category === selectedCategory;
    const matchesQuery = g.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleAddCustomSkill = () => {
    if (!newSkillName.trim()) return;
    const existing = state.skills.find((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase());
    if (existing) return;

    const newSkill: UserSkill = {
      name: newSkillName.trim(),
      category: newSkillCategory,
      currentLevel: newSkillLevel,
      requiredLevel: 7,
      confidence: 'medium',
      evidence: [
        {
          source: 'self_assessment',
          description: `Self-reported proficiency of ${newSkillLevel}/10.`,
          date: new Date().toISOString().split('T')[0]
        }
      ]
    };

    onUpdateSkills([...state.skills, newSkill]);
    setNewSkillName('');
    setIsAddModalOpen(false);
  };

  const handleRemoveSkill = (name: string) => {
    onUpdateSkills(state.skills.filter((s) => s.name !== name));
    if (activeSkillDetail?.name === name) {
      setActiveSkillDetail(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Layers className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Verified Technical Matrix
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Skills & Competency Benchmarking
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Tracking your demonstrated skill levels against benchmark expectations for <strong className="text-slate-800">{targetRoleName}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Main Grid: Skills Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGaps.map((item) => {
          const userSkill = state.skills.find((s) => s.name.toLowerCase() === item.name.toLowerCase());
          const isVerified = userSkill?.evidence && userSkill.evidence.length > 0;
          const confidence = userSkill?.confidence || 'low';

          return (
            <div
              key={item.name}
              onClick={() => {
                if (userSkill) setActiveSkillDetail(userSkill);
              }}
              className={`bg-white border rounded-3xl p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer ${
                activeSkillDetail?.name === item.name
                  ? 'border-indigo-500 ring-2 ring-indigo-500/10'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{item.name}</h3>
                  <span className="text-[10px] font-medium text-slate-400">{item.category}</span>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  item.isStrength
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : item.isGap
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {item.isStrength ? 'Verified Strength' : item.isGap ? `Gap (-${item.gap})` : 'Target Met'}
                </span>
              </div>

              {/* Skill Levels Visual Bar */}
              <div className="space-y-1.5 my-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    Current: <strong className="text-slate-800">{item.currentLevel} / 10</strong>
                  </span>
                  <span className="text-slate-500 font-medium">
                    Target: <strong className="text-indigo-600">{item.requiredLevel} / 10</strong>
                  </span>
                </div>

                <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.isStrength
                        ? 'bg-emerald-500'
                        : item.isGap
                        ? 'bg-amber-500'
                        : 'bg-indigo-600'
                    }`}
                    style={{ width: `${Math.min(100, (item.currentLevel / 10) * 100)}%` }}
                  />
                  {/* Required level marker line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-indigo-900 z-10"
                    style={{ left: `${(item.requiredLevel / 10) * 100}%` }}
                    title={`Required: ${item.requiredLevel}/10`}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">
                  Evidence: <strong className="text-slate-700">{userSkill?.evidence?.length || 0} sources</strong>
                </span>
                <span className="font-semibold text-indigo-600 hover:text-indigo-800">
                  Inspect provenance →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredGaps.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 space-y-3">
          <Layers className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm">No skills found matching your search.</p>
        </div>
      )}

      {/* Skill Detail Slide-over / Modal */}
      {activeSkillDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 lg:p-8 shadow-xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {activeSkillDetail.category}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                  {activeSkillDetail.name}
                </h2>
              </div>
              <button
                onClick={() => setActiveSkillDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Assessed Level</span>
                <span className="text-xl font-black text-slate-900">
                  {activeSkillDetail.currentLevel} / 10
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Confidence Level</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  activeSkillDetail.confidence === 'high'
                    ? 'bg-emerald-100 text-emerald-800'
                    : activeSkillDetail.confidence === 'medium'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {activeSkillDetail.confidence.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Evidence Provenance Chain */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Verified Evidence Chain ({activeSkillDetail.evidence.length})
              </h3>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {activeSkillDetail.evidence.map((ev, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-600 uppercase text-[10px]">
                        Source: {ev.source.replace('_', ' ')}
                      </span>
                      {ev.date && <span className="text-slate-400 text-[10px]">{ev.date}</span>}
                    </div>
                    <p className="text-slate-700">{ev.description}</p>
                    {ev.scoreImpact !== undefined && (
                      <span className="text-[10px] font-semibold text-emerald-600 block">
                        Demonstrated Score: {ev.scoreImpact}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleRemoveSkill(activeSkillDetail.name)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
              >
                Remove Skill
              </button>

              <button
                onClick={() => {
                  setActiveSkillDetail(null);
                  onNavigate('assessments');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Take Verification Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Skill Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Add Technical Skill</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. PyTorch, Kubernetes, Go"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden bg-white"
                >
                  <option value="Languages">Languages</option>
                  <option value="Frameworks">Frameworks</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Databases">Databases</option>
                  <option value="Core Concepts">Core Concepts</option>
                  <option value="Security & Ops">Security & Ops</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Initial Proficiency Level</span>
                  <span className="text-indigo-600">{newSkillLevel} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomSkill}
                disabled={!newSkillName.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold cursor-pointer"
              >
                Add to Inventory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
