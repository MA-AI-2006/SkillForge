import React, { useState } from 'react';
import {
  UserCheck,
  GraduationCap,
  Briefcase,
  Layers,
  FolderGit2,
  Award,
  Link,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Save,
  Sparkles,
  ExternalLink,
  Code2
} from 'lucide-react';
import { CareerRole, ExperienceLevel, ProjectItem, SkillForgeState, UserProfile, UserSkill } from '../../types';
import { CAREER_ROLES } from '../../data/careerRoles';
import { calculateProfileCompleteness } from '../../services/readinessEngine';

interface ProfileViewProps {
  state: SkillForgeState;
  onUpdateProfile: (profile: UserProfile) => void;
  onUpdateSkills: (skills: UserSkill[]) => void;
  onUpdateProjects: (projects: ProjectItem[]) => void;
  onNavigate: (tab: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  state,
  onUpdateProfile,
  onUpdateSkills,
  onUpdateProjects,
  onNavigate
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [profileData, setProfileData] = useState<UserProfile>(state.profile);
  const [skillsList, setSkillsList] = useState<UserSkill[]>(state.skills);
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(state.projects);

  // New project form modal/inline state
  const [newProject, setNewProject] = useState<Partial<ProjectItem>>({
    name: '',
    description: '',
    role: '',
    technologies: [],
    githubUrl: '',
    liveUrl: ''
  });
  const [techInput, setTechInput] = useState('');
  const [certInput, setCertInput] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<any>('Languages');
  const [newSkillLevel, setNewSkillLevel] = useState(5);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const completeness = calculateProfileCompleteness(profileData, skillsList.length, projectsList.length);

  const handleProfileFieldChange = (field: keyof UserProfile, value: any) => {
    const updated = {
      ...profileData,
      [field]: value,
      updatedAt: new Date().toISOString()
    };
    setProfileData(updated);
    onUpdateProfile(updated);
  };

  const handleSaveAll = () => {
    onUpdateProfile(profileData);
    onUpdateSkills(skillsList);
    onUpdateProjects(projectsList);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddProject = () => {
    if (!newProject.name || !newProject.description) return;
    const projectToAdd: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      role: newProject.role || 'Developer',
      technologies: newProject.technologies || [],
      githubUrl: newProject.githubUrl || undefined,
      liveUrl: newProject.liveUrl || undefined,
      addedAt: new Date().toISOString()
    };
    const updated = [...projectsList, projectToAdd];
    setProjectsList(updated);
    onUpdateProjects(updated);
    setNewProject({ name: '', description: '', role: '', technologies: [], githubUrl: '', liveUrl: '' });
  };

  const handleRemoveProject = (id: string) => {
    const updated = projectsList.filter((p) => p.id !== id);
    setProjectsList(updated);
    onUpdateProjects(updated);
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    if (skillsList.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) return;

    const skill: UserSkill = {
      name: newSkillName.trim(),
      category: newSkillCategory,
      currentLevel: newSkillLevel,
      requiredLevel: 7,
      confidence: 'medium',
      evidence: [
        {
          source: 'self_assessment',
          description: `Self-reported proficiency of ${newSkillLevel}/10 during profile setup.`,
          date: new Date().toISOString().split('T')[0]
        }
      ]
    };
    const updated = [...skillsList, skill];
    setSkillsList(updated);
    onUpdateSkills(updated);
    setNewSkillName('');
  };

  const handleRemoveSkill = (name: string) => {
    const updated = skillsList.filter((s) => s.name !== name);
    setSkillsList(updated);
    onUpdateSkills(updated);
  };

  const handleAddCert = () => {
    if (!certInput.trim()) return;
    const current = profileData.certifications || [];
    if (!current.includes(certInput.trim())) {
      handleProfileFieldChange('certifications', [...current, certInput.trim()]);
    }
    setCertInput('');
  };

  const handleRemoveCert = (cert: string) => {
    const current = profileData.certifications || [];
    handleProfileFieldChange('certifications', current.filter((c) => c !== cert));
  };

  const steps = [
    { num: 1, title: 'Background', icon: GraduationCap },
    { num: 2, title: 'Goals & Target', icon: Briefcase },
    { num: 3, title: 'Skills Inventory', icon: Layers },
    { num: 4, title: 'Portfolio Projects', icon: FolderGit2 },
    { num: 5, title: 'Certifications', icon: Award }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Completeness Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <UserCheck className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Candidate Profile Builder
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Professional Profile
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Build your real verified foundation. Every field strengthens your deterministic job readiness score.
          </p>
        </div>

        {/* Completeness Gauge */}
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/70 rounded-2xl p-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="#e2e8f0" strokeWidth="4" fill="none" />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#6366f1"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 20}
                strokeDashoffset={2 * Math.PI * 20 * (1 - completeness / 100)}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute text-xs font-bold text-slate-900">{completeness}%</span>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Profile Completeness</div>
            <div className="text-xs font-bold text-slate-800">
              {completeness >= 80 ? 'Ready for Benchmark' : 'Missing Evidence'}
            </div>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved and synchronized to local storage!</span>
        </div>
      )}

      {/* Step Navigation Bar */}
      <div className="grid grid-cols-5 gap-2 bg-white border border-slate-200/80 rounded-2xl p-2 shadow-2xs">
        {steps.map((st) => {
          const Icon = st.icon;
          const isActive = activeStep === st.num;
          return (
            <button
              key={st.num}
              onClick={() => setActiveStep(st.num)}
              className={`p-2.5 rounded-xl text-center flex flex-col sm:flex-row items-center justify-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/60 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="text-xs hidden sm:inline">{st.title}</span>
            </button>
          );
        })}
      </div>

      {/* Step Contents */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xs space-y-6">
        {/* STEP 1: BACKGROUND */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Personal Background & Education</h2>
              <p className="text-xs text-slate-500">Enter your official name, contact email, and educational background.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleProfileFieldChange('name', e.target.value)}
                  placeholder="e.g. Alex Carter"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={profileData.email || ''}
                  onChange={(e) => handleProfileFieldChange('email', e.target.value)}
                  placeholder="alex.carter@university.edu"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Highest Degree / Degree Program</label>
                <input
                  type="text"
                  value={profileData.degree || profileData.education}
                  onChange={(e) => {
                    handleProfileFieldChange('degree', e.target.value);
                    handleProfileFieldChange('education', e.target.value);
                  }}
                  placeholder="e.g. B.S. in Computer Science"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">University / College</label>
                <input
                  type="text"
                  value={profileData.university || ''}
                  onChange={(e) => handleProfileFieldChange('university', e.target.value)}
                  placeholder="e.g. University of Washington"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Graduation Year</label>
                <input
                  type="text"
                  value={profileData.graduationYear || ''}
                  onChange={(e) => handleProfileFieldChange('graduationYear', e.target.value)}
                  placeholder="e.g. 2025"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: GOALS & TARGET */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Career Goals & Specialization</h2>
              <p className="text-xs text-slate-500">Define your target role so SkillForge can benchmark against real senior expectations.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Career Role</label>
                <select
                  value={profileData.targetRole || ''}
                  onChange={(e) => handleProfileFieldChange('targetRole', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-500 bg-white"
                >
                  <option value="" disabled>Select Target Career Track</option>
                  {CAREER_ROLES.map((r) => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Experience Level</label>
                <select
                  value={profileData.experienceLevel || 'Recent Graduate'}
                  onChange={(e) => handleProfileFieldChange('experienceLevel', e.target.value as ExperienceLevel)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-500 bg-white"
                >
                  <option value="Student">Student (Currently Enrolled)</option>
                  <option value="Recent Graduate">Recent Graduate (0-1 yrs)</option>
                  <option value="Early Career (1-3 years)">Early Career (1-3 yrs)</option>
                  <option value="Career Transitioner">Career Transitioner</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Professional Bio / Elevator Pitch</label>
                <textarea
                  rows={3}
                  value={profileData.bio || ''}
                  onChange={(e) => handleProfileFieldChange('bio', e.target.value)}
                  placeholder="Summary of your technical interests, focus areas, and engineering background..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Long-Term Career Objective</label>
                <textarea
                  rows={2}
                  value={profileData.careerGoals || ''}
                  onChange={(e) => handleProfileFieldChange('careerGoals', e.target.value)}
                  placeholder="e.g. Lead real-time ML systems in production cloud environments..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SKILLS INVENTORY */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Technical Skills & Self-Rating</h2>
              <p className="text-xs text-slate-500">List languages, frameworks, databases, and DevOps tools you've used.</p>
            </div>

            {/* Add Skill Row */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="text-xs font-bold text-slate-800">Add a Technical Skill</div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Python, Docker, SQL"
                  className="sm:col-span-2 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-hidden"
                />
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-hidden"
                >
                  <option value="Languages">Languages</option>
                  <option value="Frameworks">Frameworks</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Databases">Databases</option>
                  <option value="Core Concepts">Core Concepts</option>
                  <option value="Security & Ops">Security & Ops</option>
                </select>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-medium">Lvl: {newSkillLevel}/10</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(parseInt(e.target.value))}
                    className="flex-1 accent-indigo-600"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Current Skills List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tracked Skills ({skillsList.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {skillsList.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-2xs"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900">{skill.name}</div>
                      <div className="text-[10px] text-slate-500">{skill.category} • Level {skill.currentLevel}/10</div>
                    </div>
                    <button
                      onClick={() => handleRemoveSkill(skill.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PROJECTS */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Portfolio & Technical Projects</h2>
              <p className="text-xs text-slate-500">Provide evidence of your practical engineering work.</p>
            </div>

            {/* Add Project Form */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Add Project
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Project Name (e.g. AI Code Reviewer)"
                  value={newProject.name || ''}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-hidden"
                />
                <input
                  type="text"
                  placeholder="Your Role (e.g. Lead Backend Developer)"
                  value={newProject.role || ''}
                  onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-hidden"
                />
                <div className="sm:col-span-2">
                  <textarea
                    rows={2}
                    placeholder="Project description, architecture, and what you built..."
                    value={newProject.description || ''}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-hidden"
                  />
                </div>
                <input
                  type="url"
                  placeholder="GitHub Repository URL (optional)"
                  value={newProject.githubUrl || ''}
                  onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-hidden"
                />
                <input
                  type="url"
                  placeholder="Live Demo URL (optional)"
                  value={newProject.liveUrl || ''}
                  onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={handleAddProject}
                  disabled={!newProject.name || !newProject.description}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save Project to Portfolio
                </button>
              </div>
            </div>

            {/* Saved Projects */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Logged Projects ({projectsList.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectsList.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{proj.name}</h4>
                        <span className="text-[11px] font-semibold text-indigo-600">{proj.role}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveProject(proj.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                    <div className="flex items-center gap-3 pt-2 text-xs font-semibold text-indigo-600">
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                          <Code2 className="w-3.5 h-3.5" /> Repository
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                          <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: CERTIFICATIONS & LINKS */}
        {activeStep === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Certifications & Web Profiles</h2>
              <p className="text-xs text-slate-500">Attach industry credentials, LinkedIn, and GitHub links.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Profile</label>
                <input
                  type="url"
                  value={profileData.linkedinUrl || ''}
                  onChange={(e) => handleProfileFieldChange('linkedinUrl', e.target.value)}
                  placeholder="https://linkedin.com/in/yourname"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Profile</label>
                <input
                  type="url"
                  value={profileData.githubUrl || ''}
                  onChange={(e) => handleProfileFieldChange('githubUrl', e.target.value)}
                  placeholder="https://github.com/yourhandle"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-3">
                <label className="block text-xs font-bold text-slate-700">Add Certification / Credential</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    placeholder="e.g. AWS Certified Cloud Practitioner"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
                  />
                  <button
                    onClick={handleAddCert}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {(profileData.certifications || []).map((cert) => (
                    <span
                      key={cert}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold flex items-center gap-2"
                    >
                      <Award className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{cert}</span>
                      <button
                        onClick={() => handleRemoveCert(cert)}
                        className="text-indigo-400 hover:text-indigo-700 cursor-pointer ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
            disabled={activeStep === 1}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>

            {activeStep < 5 ? (
              <button
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('overview')}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
              >
                Go to Dashboard <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
