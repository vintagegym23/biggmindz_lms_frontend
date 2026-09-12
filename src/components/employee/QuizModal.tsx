import React, { useState } from 'react';
import {
  X,
  Award,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Course } from '../../types';
import { quizApi, QuizAttemptResult } from '../../api/quizApi';

interface QuizModalProps {
  course: Course;
  onClose: () => void;
  onPassed: (courseId: string) => void;
  onViewCertificate: (course: Course) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  course,
  onClose,
  onPassed,
  onViewCertificate
}) => {
  const quiz = course.quiz;
  if (!quiz) return null;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<QuizAttemptResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const questions = quiz.questions;
  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (optIndex: number) => {
    if (result) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optIndex
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Grading happens server-side — the client never held the answer key,
      // so the score/pass state and per-question explanations only exist
      // once this call comes back.
      const graded = await quizApi.submitAttempt(quiz.id, selectedAnswers);
      setResult(graded);
      if (graded.passed) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        onPassed(course.id);
      }
    } catch {
      setSubmitError('Could not submit your quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setResult(null);
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">

        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">{quiz.title}</h2>
              <p className="text-xs text-slate-400">{course.title} • Pass Mark: {quiz.passingScore}%</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results Screen */}
        {result ? (
          <div className="space-y-6 text-center py-4">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 border-2 border-amber-500 shadow-xl mx-auto">
              {result.passed ? (
                <Sparkles className="h-10 w-10 text-amber-400" />
              ) : (
                <RotateCcw className="h-10 w-10 text-slate-400" />
              )}
            </div>

            <div className="space-y-2">
              <div className="text-3xl font-extrabold text-white font-mono">
                {result.score}%
              </div>
              <h3 className="text-xl font-bold text-white">
                {result.passed ? 'Congratulations! Accreditation Passed' : 'Score Below Passing Threshold'}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {result.passed
                  ? 'You have successfully proven mastery of the required concepts and standard operating procedures.'
                  : `You needed at least ${quiz.passingScore}% to earn the official BiggMinds certification. Review the explanations below and try again.`}
              </p>
            </div>

            {/* Answer Explanations Review */}
            <div className="space-y-3 text-left pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Detailed Question Review
              </h4>
              {result.questions.map((q, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border ${
                    q.isCorrect
                      ? 'border-emerald-500/30 bg-emerald-950/10'
                      : 'border-red-500/30 bg-red-950/10'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {q.isCorrect ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-200">
                        {idx + 1}. {q.question}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Correct: <strong className="text-emerald-300">{q.options[q.correctIndex]}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400 italic">
                        Rationale: {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-3 pt-4">
              {result.passed ? (
                <>
                  <button
                    onClick={() => {
                      onClose();
                      onViewCertificate(course);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-2.5 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all"
                  >
                    <Award className="h-4 w-4" />
                    <span>View Official Certificate</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    Close
                  </button>
                </>
              ) : (
                <button
                  onClick={handleRetake}
                  className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-2.5 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Retake Assessment</span>
                </button>
              )}
            </div>

          </div>
        ) : (
          /* Active Question Step */
          <div className="space-y-6">

            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-amber-400 font-bold">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span>All questions required</span>
            </div>

            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-medium">{opt}</span>
                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500'
                        : 'border-slate-600'
                    }`}>
                      {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {submitError && (
              <p className="text-xs text-red-400 text-center">{submitError}</p>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Next Question</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  disabled={Object.keys(selectedAnswers).length < questions.length || isSubmitting}
                  onClick={handleSubmit}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2 text-xs font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{isSubmitting ? 'Submitting…' : 'Submit & Finish'}</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
