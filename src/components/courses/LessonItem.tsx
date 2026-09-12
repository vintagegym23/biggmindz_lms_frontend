import React, { useRef, useState } from 'react';
import { ChevronUp, ChevronDown, Trash2, Pencil, PlayCircle, Save, X, UploadCloud, Loader2, Clock } from 'lucide-react';
import { Lesson, LessonUpdateInput } from '../../types';
import { uploadApi } from '../../api/uploadApi';
import { formatDurationMinutes } from '../../api/format';
import { extractErrorMessage } from '../../api/client';

interface LessonItemProps {
  lesson: Lesson;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (updates: LessonUpdateInput) => void;
  onDelete: () => void;
  onMove: (direction: 'up' | 'down') => void;
}

/** Loads a video just far enough to read its real length, without playing or downloading the whole file. */
function probeVideoDurationMinutes(url: string): Promise<number | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    let settled = false;
    const finish = (result: number | null) => {
      if (settled) return;
      settled = true;
      video.removeAttribute('src');
      video.load();
      resolve(result);
    };
    video.onloadedmetadata = () => finish(Number.isFinite(video.duration) && video.duration > 0 ? video.duration / 60 : null);
    video.onerror = () => finish(null);
    setTimeout(() => finish(null), 8000);
    video.src = url;
  });
}

export const LessonItem: React.FC<LessonItemProps> = ({ lesson, isFirst, isLast, onUpdate, onDelete, onMove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(lesson.title);
  const [videoUrl, setVideoUrl] = useState(lesson.videoUrl || '');
  const [videoAssetId, setVideoAssetId] = useState<string | undefined>(undefined);
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>(lesson.videoUrl ? lesson.durationMinutes : undefined);
  const [description, setDescription] = useState(lesson.description);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [probing, setProbing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadError(null);
    setUploadProgress(0);
    try {
      const result = await uploadApi.uploadFile(file, 'lesson-videos', 'VIDEO', setUploadProgress);
      setVideoUrl(result.secureUrl);
      setVideoAssetId(result.assetId);
      setDurationMinutes(result.durationSeconds ? result.durationSeconds / 60 : undefined);
    } catch (err) {
      setUploadError(extractErrorMessage(err));
    } finally {
      setUploadProgress(null);
    }
  };

  const handleVideoUrlBlur = async () => {
    if (!videoUrl || videoUrl === lesson.videoUrl) return;
    setProbing(true);
    const minutes = await probeVideoDurationMinutes(videoUrl);
    setDurationMinutes(minutes ?? undefined);
    setProbing(false);
  };

  const handleSave = () => {
    const originalUrl = lesson.videoUrl || '';
    let videoField: { videoUrl?: string; videoAssetId?: string | null; durationMinutes?: number } = {};
    if (videoAssetId) {
      videoField = { videoAssetId, durationMinutes: durationMinutes ?? 0 };
    } else if (videoUrl !== originalUrl) {
      videoField = videoUrl ? { videoUrl, durationMinutes: durationMinutes ?? 0 } : { videoAssetId: null, durationMinutes: 0 };
    }
    onUpdate({ title, description, ...videoField });
    setIsEditing(false);
  };

  const durationLabel = probing
    ? 'Detecting duration…'
    : durationMinutes !== undefined
    ? formatDurationMinutes(durationMinutes)
    : videoUrl
    ? 'Duration unknown — could not read this video'
    : 'No video attached';

  if (isEditing) {
    return (
      <div className="p-3 rounded-xl border border-amber-500/40 bg-slate-950/70 space-y-2.5">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Lesson title"
          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
        />

        <input
          value={videoUrl}
          onChange={(e) => {
            setVideoUrl(e.target.value);
            setVideoAssetId(undefined);
          }}
          onBlur={handleVideoUrlBlur}
          placeholder="Paste a direct video URL"
          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
        />

        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleFileSelected} />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadProgress !== null}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:text-white hover:border-amber-500/50 disabled:opacity-60"
          >
            {uploadProgress !== null ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading… {uploadProgress}%
              </>
            ) : (
              <>
                <UploadCloud className="h-3.5 w-3.5" /> Upload Video File
              </>
            )}
          </button>
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="h-3 w-3" />
            {durationLabel}
          </span>
        </div>
        {uploadError && <p className="text-[11px] text-red-400">{uploadError}</p>}

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Lesson description"
          rows={2}
          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
        />
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => setIsEditing(false)} className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:text-white">
            <X className="h-3 w-3" /> Cancel
          </button>
          <button onClick={handleSave} className="flex items-center gap-1 rounded-lg bg-amber-500 hover:bg-amber-400 px-3 py-1.5 text-[11px] font-bold text-slate-950">
            <Save className="h-3 w-3" /> Save Lesson
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-950/50 group">
      <div className="flex items-center gap-2.5 min-w-0">
        <PlayCircle className="h-4 w-4 text-slate-500 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-200 truncate">{lesson.title}</p>
          <p className="text-[10px] text-slate-500">{lesson.duration}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button disabled={isFirst} onClick={() => onMove('up')} className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20">
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
        <button disabled={isLast} onClick={() => onMove('down')} className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20">
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => setIsEditing(true)} className="p-1 rounded text-slate-500 hover:text-amber-400">
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button onClick={onDelete} className="p-1 rounded text-slate-500 hover:text-red-400">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
