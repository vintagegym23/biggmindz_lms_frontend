import React, { useMemo, useRef, useState } from 'react';
import {
  Play,
  Pause,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Send,
  ArrowLeft
} from 'lucide-react';
import { Submission, User } from '../../types';
import { SubmissionStatusBadge } from '../common/SubmissionStatusBadge';

interface VideoReviewWorkspaceProps {
  submission: Submission;
  versionHistory: Submission[];
  currentReviewer: User;
  onBack: () => void;
  onSubmitReview: (submissionId: string, review: {
    score: number;
    passed: boolean;
    generalNotes: string;
    timestampFeedback: { timestamp: string; comment: string }[];
  }) => void;
}

const parseTimestamp = (ts: string): number => {
  const parts = ts.split(':').map((p) => parseInt(p, 10) || 0);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
};

const formatSeconds = (sec: number): string => {
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const VideoReviewWorkspace: React.FC<VideoReviewWorkspaceProps> = ({
  submission,
  versionHistory,
  currentReviewer,
  onBack,
  onSubmitReview
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [score, setScore] = useState(submission.review?.score ?? 85);
  const [passed, setPassed] = useState(submission.review?.passed ?? true);
  const [generalNotes, setGeneralNotes] = useState(submission.review?.generalNotes ?? '');
  const [timestampFeedback, setTimestampFeedback] = useState<{ timestamp: string; comment: string }[]>(
    submission.review?.timestampFeedback ?? []
  );
  const [newComment, setNewComment] = useState('');

  const videoUrl = submission.videoUrl;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const seekTo = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const handleAddCommentAtCurrentTime = () => {
    if (!newComment.trim()) return;
    setTimestampFeedback((prev) => [...prev, { timestamp: formatSeconds(currentTime), comment: newComment.trim() }]);
    setNewComment('');
  };

  const handleRemoveComment = (idx: number) => {
    setTimestampFeedback((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    if (!generalNotes.trim()) {
      alert('Please provide overall feedback before submitting.');
      return;
    }
    onSubmitReview(submission.id, { score, passed, generalNotes, timestampFeedback });
  };

  const markers = useMemo(() => {
    if (!duration) return [];
    return timestampFeedback.map((fb) => ({
      ...fb,
      percent: Math.min(100, (parseTimestamp(fb.timestamp) / duration) * 100)
    }));
  }, [timestampFeedback, duration]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white">
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Submissions</span>
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-mono font-bold text-amber-400 uppercase">{submission.courseTitle}</span>
          <h1 className="text-xl font-bold text-white mt-1">{submission.assignmentTitle}</h1>
          <div className="flex items-center gap-2 mt-1.5">
            <img src={submission.userAvatar} alt={submission.userName} className="h-6 w-6 rounded-full border border-slate-700 object-cover" />
            <span className="text-xs text-slate-300 font-semibold">{submission.userName}</span>
            <span className="text-xs text-slate-500">• {submission.submittedAt}</span>
          </div>
        </div>
        <SubmissionStatusBadge status={submission.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video + timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative w-full bg-black aspect-video rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
            {videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  playsInline
                />
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-2xl hover:scale-110 transition-transform"
                  >
                    <Play className="h-6 w-6 fill-slate-950 ml-0.5" />
                  </button>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-500">No video available for this submission.</p>
            )}
          </div>

          {/* Timeline with markers */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="text-slate-300 hover:text-amber-400">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <span className="text-[11px] font-mono text-slate-400 flex-shrink-0">
                {formatSeconds(currentTime)} / {formatSeconds(duration)}
              </span>
              <div className="relative flex-1 h-2">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => seekTo(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 relative z-10"
                />
                {markers.map((m, idx) => (
                  <div
                    key={idx}
                    title={`${m.timestamp}: ${m.comment}`}
                    onClick={() => seekTo(parseTimestamp(m.timestamp))}
                    className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-amber-400 border border-slate-950 cursor-pointer z-0"
                    style={{ left: `${m.percent}%` }}
                  />
                ))}
              </div>
            </div>
            <a
              href={submission.projectUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-200"
            >
              <span>Open original deliverable link</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Timestamp comments list */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Timestamped Notes</h4>
            <div className="space-y-2">
              {timestampFeedback.map((fb, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-800 bg-slate-950 text-xs">
                  <button onClick={() => seekTo(parseTimestamp(fb.timestamp))} className="flex items-center gap-2 text-left">
                    <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded hover:bg-amber-500/20">
                      {fb.timestamp}
                    </span>
                    <span className="text-slate-200">{fb.comment}</span>
                  </button>
                  <button onClick={() => handleRemoveComment(idx)} className="text-slate-500 hover:text-red-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {timestampFeedback.length === 0 && <p className="text-xs text-slate-500">No timestamped notes yet. Play the video and add one below.</p>}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1.5 rounded border border-amber-500/20 flex-shrink-0">
                {formatSeconds(currentTime)}
              </span>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCommentAtCurrentTime()}
                placeholder="Add a note at the current timestamp..."
                className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
              <button onClick={handleAddCommentAtCurrentTime} className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-bold text-amber-400 flex items-center gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: grading + history */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Grading</h4>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">Score</label>
                <span className="font-mono text-lg font-bold text-amber-400">{score}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={score}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setScore(val);
                  setPassed(val >= 80);
                }}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPassed(true)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                  passed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Approve</span>
              </button>
              <button
                onClick={() => setPassed(false)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                  !passed ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Revise</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Overall Feedback *</label>
              <textarea
                rows={4}
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                placeholder="Comprehensive feedback and action items..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 text-xs font-bold shadow-lg shadow-amber-500/20"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{submission.review ? 'Update Grade' : 'Publish Grade & Notify'}</span>
            </button>
          </div>

          {versionHistory.length > 1 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Submission History</h4>
              {versionHistory.map((v, idx) => (
                <div key={v.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/50 border border-slate-800/60">
                  <span className="font-mono font-bold text-slate-300">v{idx + 1}</span>
                  <SubmissionStatusBadge status={v.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
