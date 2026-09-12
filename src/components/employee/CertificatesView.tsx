import React from 'react';
import { Award, ShieldCheck, CheckCircle2, Sparkles, ExternalLink, Download } from 'lucide-react';
import { Course, User } from '../../types';

interface CertificatesViewProps {
  currentUser: User;
  courses: Course[];
  onOpenCertificate: (course: Course) => void;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({
  currentUser,
  courses,
  onOpenCertificate
}) => {
  const completedCoursesList = courses.filter(c => currentUser.completedCourses.includes(c.id));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="h-4 w-4" />
            <span>Accreditations & Badges</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
            My Certifications & Skill Badges
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Verified credentials issued by BiggMinds Solutions upon completion of practical milestone cuts and SOP exams.
          </p>
        </div>
      </div>

      {/* Earned Badges Showcase */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Earned Competency Badges
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {currentUser.badges.map((badge, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-amber-500/30 bg-slate-950/70 text-center space-y-2 hover:border-amber-500/60 transition-colors"
            >
              <div className="h-10 w-10 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Award className="h-5 w-5 text-amber-400" />
              </div>
              <h4 className="text-xs font-bold text-white">{badge}</h4>
              <p className="text-[10px] text-slate-400">Verified by Tutor Board</p>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Certificates */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-bold text-white">Official Course Certifications</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {completedCoursesList.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    Certified & Verified
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    BMS-2026-CERT
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {course.summary}
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                  <span>Instructor: <strong className="text-slate-200">{course.instructor.name}</strong></span>
                  <span>•</span>
                  <span>Grade: <strong className="text-emerald-400">92% Honors</strong></span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Credential Active</span>
                </div>

                <button
                  onClick={() => onOpenCertificate(course)}
                  className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 text-xs font-bold shadow transition-colors"
                >
                  <Award className="h-3.5 w-3.5" />
                  <span>Inspect Certificate</span>
                </button>
              </div>
            </div>
          ))}

          {completedCoursesList.length === 0 && (
            <div className="col-span-2 p-8 rounded-2xl border border-slate-800 bg-slate-900/40 text-center space-y-2">
              <Award className="h-8 w-8 text-slate-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">No course certificates unlocked yet</h4>
              <p className="text-xs text-slate-400">Complete all lessons and pass the final quiz to earn your verified credential.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
