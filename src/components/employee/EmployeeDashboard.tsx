import React from 'react';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Award, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  AlertCircle,
  Video,
  ChevronRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { Course, SOPDocument, User, Submission, CohortSession } from '../../types';

interface EmployeeDashboardProps {
  currentUser: User;
  courses: Course[];
  sops: SOPDocument[];
  submissions: Submission[];
  cohorts: CohortSession[];
  onOpenCourse: (courseId: string, lessonId?: string) => void;
  onOpenSOP: (sopId: string) => void;
  onNavigateTo: (view: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  currentUser,
  courses,
  sops,
  submissions,
  cohorts,
  onOpenCourse,
  onOpenSOP,
  onNavigateTo
}) => {
  // Active course in progress
  const activeCourse = courses.find(c => c.id === 'course-vid-01') || courses[0];
  const activeLesson = activeCourse.modules[0]?.lessons[1] || activeCourse.modules[0]?.lessons[0];

  // Calculate stats
  const completedCount = currentUser.completedCourses.length;
  const totalCourses = courses.length;
  const progressPercent = Math.round((completedCount / totalCourses) * 100) || 35;
  const signedSOPsCount = sops.filter(s => s.signedOffBy.includes(currentUser.id)).length;

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Trainee Hero Greeting */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>BiggMinds Onboarding Track • Q3 Cohort</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, {currentUser.name}! 👋
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              You are currently advancing through your <span className="text-slate-200 font-semibold">{currentUser.department}</span> curriculum. Master your editing timeline, internal SOP standards, and earn your official BiggMinds accreditation.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-xl font-extrabold text-amber-400 font-mono">68%</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Curriculum</div>
            </div>
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-xl font-extrabold text-emerald-400 font-mono">{signedSOPsCount}/{sops.length}</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">SOPs Signed</div>
            </div>
            <div className="text-center px-3">
              <div className="text-xl font-extrabold text-sky-400 font-mono">92/100</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Avg Review</div>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Learning Spotlight */}
      <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-slate-900/90 to-slate-950 p-6 shadow-xl relative">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0 h-16 w-24 sm:h-20 sm:w-32 rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
              <img 
                src={activeCourse.thumbnail} 
                alt={activeCourse.title} 
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                <Play className="h-6 w-6 text-amber-400 fill-amber-400" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  In Progress • {activeCourse.category.replace('_', ' ')}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {activeLesson.duration}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {activeLesson.title}
              </h2>
              <p className="text-xs text-slate-400 line-clamp-1">
                From course: <span className="text-slate-200 font-medium">{activeCourse.title}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              id="resume-learning-btn"
              onClick={() => onOpenCourse(activeCourse.id, activeLesson.id)}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 text-sm font-bold shadow-lg shadow-amber-500/20 transition-all transform active:scale-95"
            >
              <Play className="h-4 w-4 fill-slate-950" />
              <span>Resume Lesson</span>
            </button>
            <button
              onClick={() => onOpenCourse(activeCourse.id)}
              className="rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-3 text-sm font-semibold transition-colors"
            >
              View Syllabus
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Assigned Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-bold text-white">Your Assigned Training Curricula</h2>
              <p className="text-xs text-slate-400">Core tracks configured for your job profile</p>
            </div>
            <button
              onClick={() => onNavigateTo('courses')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Browse all ({courses.length})
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.slice(0, 4).map((course) => {
              const isCompleted = currentUser.completedCourses.includes(course.id);
              return (
                <div
                  key={course.id}
                  onClick={() => onOpenCourse(course.id)}
                  className="group rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-amber-500/50 hover:bg-slate-900 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative h-32 w-full rounded-lg overflow-hidden bg-slate-800">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          course.level === 'Beginner' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : course.level === 'Intermediate' 
                              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' 
                              : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        }`}>
                          {course.level}
                        </span>
                      </div>
                      {isCompleted && (
                        <div className="absolute top-2 right-2 bg-emerald-500 text-slate-950 rounded-full p-1 shadow">
                          <CheckCircle className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {course.summary}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      <span>{course.durationHours.toFixed(1)} hrs</span>
                      <span>•</span>
                      <span>{course.totalLessons} lessons</span>
                    </div>
                    <span className="font-semibold text-amber-400 group-hover:translate-x-0.5 transition-transform">
                      {isCompleted ? 'Review' : 'Open'} →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Assignment Review / Feedback Showcase */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Latest Tutor Feedback & Reviews</h3>
              </div>
              <button
                onClick={() => onNavigateTo('assignments')}
                className="text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                View all submissions
              </button>
            </div>

            {submissions.filter(s => s.review).map((sub) => (
              <div key={sub.id} className="rounded-xl border border-slate-800/90 bg-slate-900 p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{sub.assignmentTitle}</h4>
                    <p className="text-[11px] text-slate-400">{sub.courseTitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-xs font-mono font-bold text-emerald-400">
                      Score: {sub.review?.score}/100
                    </span>
                    <span className="rounded-lg bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                      Passed
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                  "{sub.review?.generalNotes}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <div className="flex items-center gap-2">
                    <img 
                      src={sub.review?.reviewerAvatar} 
                      alt={sub.review?.reviewerName} 
                      className="h-5 w-5 rounded-full object-cover" 
                    />
                    <span className="text-slate-400 font-medium">Reviewed by {sub.review?.reviewerName}</span>
                  </div>
                  <span>{sub.review?.reviewedAt}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right 1 Col: Company SOP Checklists & Cohorts */}
        <div className="space-y-6">
          
          {/* Mandatory SOPs Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Company SOPs & Standards</h3>
                <p className="text-xs text-slate-400">Mandatory operating guidelines</p>
              </div>
              <button
                onClick={() => onNavigateTo('sops')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300"
              >
                All SOPs
              </button>
            </div>

            <div className="space-y-2.5">
              {sops.map((sop) => {
                const isSigned = sop.signedOffBy.includes(currentUser.id);
                return (
                  <div
                    key={sop.id}
                    onClick={() => onOpenSOP(sop.id)}
                    className="p-3 rounded-xl border border-slate-800/80 bg-slate-900 hover:border-slate-700 cursor-pointer transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        {sop.code}
                      </span>
                      {isSigned ? (
                        <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Signed
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> Acknowledgment Req.
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-200 line-clamp-1">
                      {sop.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {sop.checklist.length} verification steps • {sop.version}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Live Cohorts */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-red-400" />
                <h3 className="text-sm font-bold text-white">Upcoming Live Workshops</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Live Q&A
              </span>
            </div>

            <div className="space-y-3">
              {cohorts.map((cohort) => (
                <div key={cohort.id} className="p-3 rounded-xl border border-slate-800 bg-slate-900 space-y-2">
                  <h4 className="text-xs font-bold text-slate-200 leading-snug">
                    {cohort.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{cohort.dateTime}</span>
                    <span className="text-amber-400">{cohort.attendeesCount} enrolled</span>
                  </div>
                  <a
                    href={cohort.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 py-1.5 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    <span>Join Google Meet</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
