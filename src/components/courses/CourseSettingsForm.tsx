import React from 'react';
import { Clock } from 'lucide-react';
import { Course, TrackCategory } from '../../types';
import { formatDurationMinutes } from '../../api/format';

interface CourseSettingsFormProps {
  course: Course;
  onChange: (updates: Partial<Course>) => void;
}

export const CourseSettingsForm: React.FC<CourseSettingsFormProps> = ({ course, onChange }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
      <h3 className="text-sm font-bold text-white">Course Information</h3>

      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1.5">Course Title *</label>
        <input
          type="text"
          value={course.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">Category</label>
          <select
            value={course.category}
            onChange={(e) => onChange({ category: e.target.value as TrackCategory })}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="video_editing">Video Editing</option>
            <option value="advanced_video_editing">Advanced Video Editing</option>
            <option value="digital_marketing">Digital Marketing</option>
            <option value="social_media">Social Media</option>
            <option value="youtube_marketing">YouTube Marketing</option>
            <option value="company_sops">Company SOPs</option>
            <option value="creative_workflows">Creative Workflows</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">Difficulty</label>
          <select
            value={course.level}
            onChange={(e) => onChange({ level: e.target.value as Course['level'] })}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Mastery">Mastery</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1.5">Description</label>
        <textarea
          rows={3}
          value={course.summary}
          onChange={(e) => onChange({ summary: e.target.value })}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">Total Duration</label>
          <div className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2 text-xs text-slate-300 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
            <span>{formatDurationMinutes(course.durationHours * 60)}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Calculated automatically from lesson video lengths.</p>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">Software (comma separated)</label>
          <input
            type="text"
            value={course.software.join(', ')}
            onChange={(e) => onChange({ software: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1.5">Cover Thumbnail URL</label>
        <div className="flex items-center gap-3">
          {course.thumbnail && (
            <img src={course.thumbnail} alt="" className="h-12 w-16 rounded-lg object-cover border border-slate-800 flex-shrink-0" />
          )}
          <input
            type="url"
            value={course.thumbnail}
            onChange={(e) => onChange({ thumbnail: e.target.value })}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
