import React from 'react';

interface BarDatum {
  label: string;
  value: number;
}

interface SimpleBarChartProps {
  data: BarDatum[];
  suffix?: string;
  color?: string;
}

/**
 * Minimal, dependency-free horizontal bar chart. Kept intentionally
 * simple for the MVP — swap for a proper charting library later if
 * richer interaction (tooltips, zoom) is needed.
 */
export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, suffix = '', color = 'bg-amber-500' }) => {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-3">
      {data.map((d, index) => (
        <div key={`${index}-${d.label}`} className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-300 font-medium truncate max-w-[70%]">{d.label}</span>
            <span className="font-mono font-bold text-slate-200">{d.value}{suffix}</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className={`${color} h-full rounded-full transition-all`} style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
      {data.length === 0 && <p className="text-xs text-slate-500">No data yet.</p>}
    </div>
  );
};
