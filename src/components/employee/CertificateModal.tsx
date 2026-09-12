import React from 'react';
import { X, Award, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { Course, User } from '../../types';

interface CertificateModalProps {
  course: Course;
  currentUser: User;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  course,
  currentUser,
  onClose
}) => {
  const certificateId = `BMS-${course.slug.toUpperCase().slice(0, 8)}-${Math.floor(1000 + Math.random() * 9000)}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Top actions */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>Verified Credential • BiggMinds Academy</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* The Certificate Artboard */}
        <div 
          id="printable-certificate"
          className="relative rounded-2xl border-4 border-double border-amber-500/40 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-8 sm:p-12 text-center space-y-6 shadow-2xl overflow-hidden"
        >
          {/* Subtle Guilloche / Watermark Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

          {/* Top Badge */}
          <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
            <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center">
                <Award className="h-7 w-7 text-amber-400" />
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400">
                BiggMinds Solutions
              </h4>
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Internal Academy of Creative & Growth Excellence
              </p>
            </div>
          </div>

          {/* Certificate Main Title */}
          <div className="relative z-10 space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-white">
              Certificate of Completion
            </h2>
            <p className="text-xs text-slate-400 italic">
              This credential certifies that
            </p>
          </div>

          {/* Trainee Name */}
          <div className="relative z-10 py-1 border-b-2 border-amber-500/40 max-w-md mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-amber-300 font-heading">
              {currentUser.name}
            </h3>
          </div>

          <p className="relative z-10 text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
            has successfully fulfilled all course requirements, demonstrated proficiency in operational SOPs, and passed the official examination for:
          </p>

          {/* Course Name */}
          <div className="relative z-10 py-1">
            <h4 className="text-lg sm:text-xl font-bold text-white max-w-xl mx-auto">
              {course.title}
            </h4>
            <p className="text-xs font-mono text-amber-400/80 mt-1">
              Category: {course.category.replace('_', ' ').toUpperCase()}
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="relative z-10 grid grid-cols-2 gap-8 pt-8 border-t border-slate-800 max-w-lg mx-auto text-center">
            <div className="space-y-1">
              <div className="font-heading text-sm font-bold text-slate-200">
                {course.instructor.name}
              </div>
              <div className="text-[10px] text-slate-400">
                {course.instructor.role}
              </div>
              <div className="text-[9px] font-mono text-slate-500">
                Lead Examiner
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-heading text-sm font-bold text-slate-200">
                {currentDate}
              </div>
              <div className="text-[10px] text-slate-400">
                Date of Accreditation
              </div>
              <div className="text-[9px] font-mono text-amber-500">
                ID: {certificateId}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
