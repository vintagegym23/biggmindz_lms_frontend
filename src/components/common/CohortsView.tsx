import React from 'react';
import { Radio, Calendar, Users, ExternalLink, Clock, Sparkles } from 'lucide-react';
import { CohortSession } from '../../types';

interface CohortsViewProps {
  cohorts: CohortSession[];
}

export const CohortsView: React.FC<CohortsViewProps> = ({ cohorts }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Radio className="h-4 w-4 animate-pulse text-red-500" />
            <span>Interactive Mentorship</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Live Cohort Reviews & Office Hours
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Join BiggMinds creative directors and senior editors for live cut teardowns, grading, and Q&A.
          </p>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cohorts.map((cohort) => (
          <div
            key={cohort.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-5 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {cohort.track}
                </span>
                <h3 className="text-lg font-bold text-white leading-snug mt-1.5">
                  {cohort.title}
                </h3>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                <Radio className="h-3 w-3 animate-ping" /> Live
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-amber-400" />
                <span>{cohort.dateTime}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-sky-400" />
                <span>{cohort.attendeesCount} enrolled</span>
              </div>
            </div>

            {/* Host info */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <img
                src={cohort.hostAvatar}
                alt={cohort.hostName}
                className="h-8 w-8 rounded-full object-cover border border-slate-700"
              />
              <div className="text-xs">
                <p className="font-bold text-slate-200">Hosted by {cohort.hostName}</p>
                <p className="text-[11px] text-slate-400">Head of Creative Direction</p>
              </div>
            </div>

            {/* Agenda */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Session Agenda
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {cohort.agenda.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={cohort.meetLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 text-xs font-bold shadow-md shadow-amber-500/10 transition-colors"
            >
              <span>Join Google Meet Room</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        ))}
      </div>

    </div>
  );
};
