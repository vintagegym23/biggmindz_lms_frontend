import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  ShieldCheck, 
  ExternalLink, 
  Clock, 
  User, 
  Printer, 
  Sparkles,
  ArrowRight,
  Check,
  Building
} from 'lucide-react';
import { SOPDocument, User as UserType } from '../../types';

interface SOPViewerProps {
  sops: SOPDocument[];
  currentUser: UserType;
  selectedSOPId?: string;
  onSignOffSOP: (sopId: string) => void;
}

export const SOPViewer: React.FC<SOPViewerProps> = ({
  sops,
  currentUser,
  selectedSOPId,
  onSignOffSOP
}) => {
  const [activeSOPId, setActiveSOPId] = useState<string | undefined>(() => {
    if (selectedSOPId && sops.some(s => s.id === selectedSOPId)) return selectedSOPId;
    return sops[0]?.id;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  const activeSOP = sops.find(s => s.id === activeSOPId);

  if (!activeSOP) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Building className="h-4 w-4" />
              <span>BiggMinds Solutions • Operational Quality</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Company Standard Operating Procedures (SOPs)
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 py-16 text-center">
          <FileText className="h-10 w-10 text-slate-600" />
          <p className="text-sm font-semibold text-slate-400">No SOPs have been published yet</p>
          <p className="text-xs text-slate-600 max-w-sm">Ask an admin to add company SOPs — they'll show up here for review and sign-off.</p>
        </div>
      </div>
    );
  }

  const isCurrentSOPSigned = activeSOP.signedOffBy.includes(currentUser.id);

  const toggleStep = (stepId: string) => {
    setCheckedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const filteredSOPs = sops.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Building className="h-4 w-4" />
            <span>BiggMinds Solutions • Operational Quality</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Company Standard Operating Procedures (SOPs)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Official technical checklists, file structures, export bitrates, and client delivery protocols.
          </p>
        </div>

        {/* Global Compliance Stat */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3">
          <ShieldCheck className="h-6 w-6 text-emerald-400" />
          <div>
            <div className="text-xs font-bold text-white">Your Compliance Status</div>
            <div className="text-[11px] text-emerald-400 font-semibold">
              {sops.filter(s => s.signedOffBy.includes(currentUser.id)).length} of {sops.length} SOPs Acknowledged
            </div>
          </div>
        </div>
      </div>

      {/* Two column layout: List on left, active SOP on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: SOP Directory List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code (e.g. SOP-VID-01)..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            {filteredSOPs.map((sop) => {
              const isSelected = activeSOP.id === sop.id;
              const isSigned = sop.signedOffBy.includes(currentUser.id);
              return (
                <div
                  key={sop.id}
                  onClick={() => setActiveSOPId(sop.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'border-amber-500/80 bg-slate-900 shadow-md shadow-amber-500/5'
                      : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {sop.code}
                    </span>
                    {isSigned ? (
                      <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" /> Signed
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" /> Pending
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-white leading-snug">
                    {sop.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span>{sop.department}</span>
                    <span>{sop.version}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active SOP Document Detail & Interactive Checklist (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 space-y-6">
          
          {/* Top Doc Meta */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  {activeSOP.code}
                </span>
                <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                  {activeSOP.department}
                </span>
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded-lg">
                  {activeSOP.version}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {activeSOP.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                <span>Owner: <strong className="text-slate-300">{activeSOP.owner}</strong></span>
                <span>•</span>
                <span>Last Updated: <strong className="text-slate-300">{activeSOP.lastUpdated}</strong></span>
              </div>
            </div>

            {/* Print button */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors self-start"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print SOP</span>
            </button>
          </div>

          {/* Purpose & Scope */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                1. Purpose & Objective
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeSOP.purpose}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                2. Scope & Applicability
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeSOP.scope}
              </p>
            </div>
          </div>

          {/* Required Software */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Required Applications & Tooling
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              {activeSOP.softwareRequired.map((sw) => (
                <span
                  key={sw}
                  className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-mono font-medium text-slate-200 border border-slate-700"
                >
                  {sw}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Step-by-Step Checklist */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">
                  3. Execution Checklist & Verification Protocol
                </h4>
                <p className="text-xs text-slate-400">
                  Follow each step sequentially on your editing terminal and check off as verified.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {activeSOP.checklist.map((step) => {
                const isChecked = checkedSteps[step.id] || false;
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isChecked
                        ? 'border-emerald-500/50 bg-emerald-950/10'
                        : 'border-slate-800 bg-slate-950/40 hover:bg-slate-900'
                    }`}
                  >
                    <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-colors ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold'
                        : 'border-slate-600 bg-slate-900'
                    }`}>
                      {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-amber-400">
                          Step {step.stepNumber}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${
                        isChecked ? 'text-slate-300' : 'text-slate-200 font-medium'
                      }`}>
                        {step.instruction}
                      </p>
                      {step.criticalNote && (
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-400/90 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                          <span><strong>Critical:</strong> {step.criticalNote}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Official Sign-off Footer */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-white">
                Trainee Compliance & Legal Acknowledgment
              </h5>
              <p className="text-xs text-slate-400 max-w-md">
                By signing off, you confirm you have read, understood, and agreed to adhere to this standard operating procedure on all BiggMinds Solutions deliverables.
              </p>
            </div>

            {isCurrentSOPSigned ? (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-4 py-2.5 text-xs font-bold text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                <span>Signed & Acknowledged</span>
              </div>
            ) : (
              <button
                id={`signoff-sop-btn-${activeSOP.id}`}
                onClick={() => onSignOffSOP(activeSOP.id)}
                className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Sign-Off & Confirm Protocol</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
