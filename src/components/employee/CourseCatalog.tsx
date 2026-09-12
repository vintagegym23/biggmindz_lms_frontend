import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  BookOpen, 
  CheckCircle, 
  Sparkles, 
  Layers, 
  Play,
  ArrowRight,
  ShieldAlert,
  Code
} from 'lucide-react';
import { Course, TrackCategory, User } from '../../types';

interface CourseCatalogProps {
  courses: Course[];
  currentUser: User;
  onOpenCourse: (courseId: string) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  courses,
  currentUser,
  onOpenCourse
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Curricula' },
    { id: 'company_sops', label: 'Company SOPs' },
    { id: 'video_editing', label: 'Video Editing' },
    { id: 'advanced_video_editing', label: 'Advanced Editing' },
    { id: 'youtube_marketing', label: 'YouTube Growth' },
    { id: 'digital_marketing', label: 'Digital Marketing' },
    { id: 'social_media', label: 'Social & Short-Form' }
  ];

  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced', 'Mastery'];

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchCategory = selectedCategory === 'all' || course.category === selectedCategory;
      const matchLevel = selectedLevel === 'all' || course.level === selectedLevel;
      const matchSearch = searchFilter === '' || 
        course.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        course.summary.toLowerCase().includes(searchFilter.toLowerCase()) ||
        course.software.some(s => s.toLowerCase().includes(searchFilter.toLowerCase()));
      return matchCategory && matchLevel && matchSearch;
    });
  }, [courses, selectedCategory, selectedLevel, searchFilter]);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="h-4 w-4" />
            <span>BiggMinds Training Academy</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Internal Training Curricula
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Standardized modules, practical project briefs, and technical SOP certifications.
          </p>
        </div>

        {/* Search input in catalog */}
        <div className="w-full md:w-72 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search topics, software..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/15'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Level Filters & Results count */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-500">Skill Level:</span>
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`capitalize px-2 py-0.5 rounded-md transition-colors ${
                selectedLevel === lvl 
                  ? 'bg-slate-800 text-amber-300 font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div>
          Showing <span className="font-bold text-slate-200">{filteredCourses.length}</span> track{filteredCourses.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isCompleted = currentUser.completedCourses.includes(course.id);
          return (
            <div
              key={course.id}
              className="group rounded-2xl border border-slate-800/80 bg-slate-900/60 overflow-hidden hover:border-amber-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail & Badges */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="rounded-lg bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/30">
                      {course.category.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className={`rounded-lg px-2.5 py-1 text-[10px] font-bold backdrop-blur-md ${
                      course.level === 'Beginner'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                        : course.level === 'Intermediate'
                          ? 'bg-sky-950/80 text-sky-400 border border-sky-500/30'
                          : 'bg-purple-950/80 text-purple-400 border border-purple-500/30'
                    }`}>
                      {course.level}
                    </span>
                  </div>

                  {isCompleted && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-md text-[10px] font-bold">
                      <CheckCircle className="h-3 w-3" /> Certified Completed
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="font-heading text-base font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {course.summary}
                  </p>

                  {/* Software Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {course.software.map((sw) => (
                      <span
                        key={sw}
                        className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700/50"
                      >
                        {sw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0 border-t border-slate-800/60 mt-4">
                <div className="flex items-center justify-between pt-4 mb-4 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="h-6 w-6 rounded-full object-cover border border-slate-700"
                    />
                    <span className="truncate max-w-[110px] font-medium text-slate-300">
                      {course.instructor.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    <span>{course.durationHours.toFixed(1)} hrs</span>
                    <span>•</span>
                    <span>{course.totalLessons} lessons</span>
                  </div>
                </div>

                <button
                  id={`open-course-btn-${course.id}`}
                  onClick={() => onOpenCourse(course.id)}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10'
                  }`}
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>{isCompleted ? 'Review Curriculum' : 'Enter Classroom'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
