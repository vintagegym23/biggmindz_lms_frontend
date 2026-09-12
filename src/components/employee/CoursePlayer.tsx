import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  CheckCircle2, 
  Circle, 
  Download, 
  FileText, 
  Award, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Share2, 
  BookOpen, 
  Layers, 
  ExternalLink,
  HelpCircle,
  Clock,
  ArrowLeft,
  VideoOff
} from 'lucide-react';
import { Course, Lesson, SOPDocument } from '../../types';

interface CoursePlayerProps {
  course: Course;
  initialLessonId?: string;
  sops: SOPDocument[];
  onOpenSOP: (sopId: string) => void;
  onOpenQuiz: (course: Course) => void;
  onOpenAssignment: (assignmentId: string) => void;
  onBack: () => void;
  onMarkLessonCompleted: (courseId: string, lessonId: string) => void;
  onLessonChange?: (lessonId: string) => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  initialLessonId,
  sops,
  onOpenSOP,
  onOpenQuiz,
  onOpenAssignment,
  onBack,
  onMarkLessonCompleted,
  onLessonChange
}) => {
  // Find initial lesson
  const allLessons = course.modules.flatMap(m => m.lessons);
  const [activeLesson, setActiveLesson] = useState<Lesson>(() => {
    if (initialLessonId) {
      const found = allLessons.find(l => l.id === initialLessonId);
      if (found) return found;
    }
    return allLessons[0];
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'notes' | 'sop'>('overview');
  const [showSidebar, setShowSidebar] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync video time
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 100);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = parseFloat(e.target.value);
    setCurrentTime(target);
    if (videoRef.current) {
      videoRef.current.currentTime = target;
    }
  };

  const selectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    onLessonChange?.(lesson.id);
  };

  const handleCompleteAndNext = () => {
    onMarkLessonCompleted(course.id, activeLesson.id);
    const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id);
    if (currentIndex < allLessons.length - 1) {
      selectLesson(allLessons[currentIndex + 1]);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-slate-950">
      
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Curricula</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider hidden sm:inline">
            {course.category.replace('_', ' ')}
          </span>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
            {course.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {course.quiz && (
            <button
              onClick={() => onOpenQuiz(course)}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors"
            >
              <Award className="h-3.5 w-3.5" />
              <span>Take Final Quiz</span>
            </button>
          )}

          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
          >
            {showSidebar ? 'Hide Syllabus' : 'Show Syllabus'}
          </button>
        </div>
      </div>

      {/* Main Classroom Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left / Center Video Stage & Lesson Details */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          
          {/* Video Player Box */}
          <div className="relative w-full bg-black aspect-video max-h-[68vh] flex items-center justify-center group">
            {activeLesson.videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={activeLesson.videoUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleCompleteAndNext}
                  className="w-full h-full object-contain"
                  playsInline
                />

                {/* Top Watermark Badge */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 pointer-events-none">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs font-bold text-white">BiggMinds Masterclass</span>
                  <span className="text-[10px] text-slate-400">1080p 60fps</span>
                </div>

                {/* Center Big Play Button (when paused) */}
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute z-20 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-2xl hover:scale-110 transition-transform"
                  >
                    <Play className="h-7 w-7 fill-slate-950 ml-1" />
                  </button>
                )}

                {/* Custom Bottom Control Bar */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">

                  {/* Scrub bar */}
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />

                  <div className="flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-3">
                      <button onClick={togglePlay} className="hover:text-amber-400">
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </button>
                      <button onClick={toggleMute} className="hover:text-amber-400">
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </button>
                      <span className="font-mono text-[11px] text-slate-300">
                        {formatSeconds(currentTime)} / {formatSeconds(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono">Speed:</span>
                      {[1, 1.25, 1.5, 2].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSpeedChange(s)}
                          className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold transition-colors ${
                            playbackSpeed === s
                              ? 'bg-amber-500 text-slate-950'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <VideoOff className="h-10 w-10" />
                <p className="text-sm font-semibold text-slate-400">No video attached to this lesson yet</p>
                <p className="text-xs text-slate-600">Ask an admin or tutor to add a video in Course Builder.</p>
              </div>
            )}
          </div>

          {/* Lesson Actions & Tabbed Content */}
          <div className="p-6 space-y-6 max-w-5xl">
            
            {/* Header / Next lesson button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    CURRENT LESSON
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {activeLesson.duration}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {activeLesson.title}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  id="complete-and-next-btn"
                  onClick={handleCompleteAndNext}
                  className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 text-xs font-bold shadow-md shadow-amber-500/10 transition-all"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Mark Complete & Next</span>
                </button>
              </div>
            </div>

            {/* Lesson Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-slate-800 text-amber-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Overview & Brief
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'resources'
                    ? 'bg-slate-800 text-amber-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Raw Assets & Presets</span>
                {activeLesson.resources && (
                  <span className="bg-amber-500/20 text-amber-400 text-[10px] px-1.5 py-0.2 rounded-full">
                    {activeLesson.resources.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === 'notes'
                    ? 'bg-slate-800 text-amber-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tactical Notes
              </button>
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed">
                  <p>{activeLesson.description}</p>
                </div>

                {/* Assignment Trigger (if attached) */}
                {activeLesson.assignmentId && (
                  <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/20 to-slate-900 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                        <Award className="h-4 w-4" />
                        <span>Practical Milestone Assignment</span>
                      </div>
                      <h4 className="text-base font-bold text-white">
                        Cut a High-Retention 30-Second Commercial Hook
                      </h4>
                      <p className="text-xs text-slate-400">
                        Submit your Frame.io or Drive link for personalized tutor feedback.
                      </p>
                    </div>
                    <button
                      onClick={() => onOpenAssignment(activeLesson.assignmentId!)}
                      className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 text-xs font-bold shadow transition-colors whitespace-nowrap"
                    >
                      Open Assignment Brief
                    </button>
                  </div>
                )}

                {/* Referenced Company SOPs */}
                {course.sopsReferenced.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Mandatory BiggMinds SOPs for this Module
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {course.sopsReferenced.map((code) => {
                        const sop = sops.find(s => s.code === code);
                        if (!sop) return null;
                        return (
                          <div
                            key={sop.id}
                            onClick={() => onOpenSOP(sop.id)}
                            className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 cursor-pointer transition-colors space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-bold text-amber-400">
                                {sop.code}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {sop.version}
                              </span>
                            </div>
                            <h5 className="text-xs font-bold text-slate-200">
                              {sop.title}
                            </h5>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Resources */}
            {activeTab === 'resources' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  Official project files, raw camera cards, sound design starter packs, and LUTs for this lesson.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeLesson.resources?.map((res) => (
                    <div
                      key={res.id}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-400 uppercase">
                            {res.type}
                          </span>
                          {res.size && (
                            <span className="text-[11px] text-slate-500">{res.size}</span>
                          )}
                        </div>
                        <h5 className="text-xs font-bold text-slate-200">{res.title}</h5>
                      </div>

                      <button
                        onClick={() => alert(`Downloading asset: ${res.title}`)}
                        className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors"
                      >
                        <Download className="h-3.5 w-3.5 text-amber-400" />
                        <span>Download</span>
                      </button>
                    </div>
                  )) || (
                    <p className="text-xs text-slate-500">No external downloads required for this specific theory lesson.</p>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Core Technical Rules & Benchmarks
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {activeLesson.notes?.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                        <span>{note}</span>
                      </li>
                    )) || (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                          <span>Always match sound riser velocity to camera motion velocity.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                          <span>Never let dialogue peak above -6dB on the master audio meter.</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Syllabus Drawer */}
        {showSidebar && (
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/50 p-4 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Course Syllabus ({allLessons.length} lessons)
              </h3>
              <span className="text-xs font-mono font-bold text-amber-400">
                {Math.round((allLessons.filter(l => l.completed).length / allLessons.length) * 100)}% done
              </span>
            </div>

            <div className="space-y-4">
              {course.modules.map((module, modIdx) => (
                <div key={module.id} className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 px-1">
                    {module.title}
                  </h4>

                  <div className="space-y-1">
                    {module.lessons.map((lesson) => {
                      const isActive = activeLesson.id === lesson.id;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => selectLesson(lesson)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                            isActive
                              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                              : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800/60'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {lesson.completed ? (
                              <CheckCircle2 className={`h-4 w-4 mt-0.5 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
                            ) : (
                              <Circle className={`h-4 w-4 mt-0.5 ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
                            )}
                            <div className="space-y-0.5">
                              <p className="text-xs leading-snug line-clamp-1">{lesson.title}</p>
                              <p className={`text-[10px] ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>
                                {lesson.duration}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
