import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Users, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Search,
  Sparkles
} from 'lucide-react';
import { SOPDocument, TraineeProgress } from '../../types';

interface SOPManagerProps {
  sops: SOPDocument[];
  trainees: TraineeProgress[];
  onOpenSOP: (sopId: string) => void;
}

export const SOPManager: React.FC<SOPManagerProps> = ({
  sops,
  trainees,
  onOpenSOP
}) => {
  const [search, setSearch] = useState('');

  const totalTrainees = trainees.length || 1;

  const filtered = sops.filter(s =>
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Operational Quality & Compliance</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Company SOP Governance & Acknowledgment
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor sign-off rates across editing bays, ensure legal compliance, and update standard operating procedures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by code or title..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 py-16 text-center">
          <FileText className="h-10 w-10 text-slate-600" />
          <p className="text-sm font-semibold text-slate-400">
            {sops.length === 0 ? 'No SOPs have been published yet' : 'No SOPs match your search'}
          </p>
        </div>
      )}

      {/* Grid of SOPs with compliance meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((sop) => {
          const signedCount = sop.signedOffBy.length;
          const compliancePercent = Math.min(100, Math.round((signedCount / totalTrainees) * 100));

          return (
            <div
              key={sop.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {sop.code}
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {sop.version}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1 leading-snug">
                    {sop.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Dept: <span className="text-slate-200 font-medium">{sop.department}</span> • Owner: {sop.owner}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    {compliancePercent}%
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase">Signed Off</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all"
                  style={{ width: `${compliancePercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-slate-500" />
                  <span>{signedCount} of {totalTrainees} employees acknowledged</span>
                </div>
                <button
                  onClick={() => onOpenSOP(sop.id)}
                  className="text-amber-400 hover:text-amber-300 font-semibold"
                >
                  Inspect SOP & Steps →
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
