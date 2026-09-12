import React from 'react';
import { CheckCircle, Clock, AlertCircle, MinusCircle } from 'lucide-react';
import { Submission } from '../../types';

interface SubmissionStatusBadgeProps {
  status: Submission['status'] | 'not_submitted';
  className?: string;
}

const CONFIG: Record<string, { label: string; classes: string; Icon: React.ComponentType<{ className?: string }> }> = {
  approved: {
    label: 'Approved',
    classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Icon: CheckCircle
  },
  pending_review: {
    label: 'In Review',
    classes: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Icon: Clock
  },
  needs_revision: {
    label: 'Revision Required',
    classes: 'bg-red-500/15 text-red-400 border-red-500/30',
    Icon: AlertCircle
  },
  not_submitted: {
    label: 'Not Submitted',
    classes: 'bg-slate-800 text-slate-400 border-slate-700',
    Icon: MinusCircle
  }
};

export const SubmissionStatusBadge: React.FC<SubmissionStatusBadgeProps> = ({ status, className = '' }) => {
  const config = CONFIG[status] ?? CONFIG.not_submitted;
  const { Icon } = config;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border ${config.classes} ${className}`}
    >
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </span>
  );
};
