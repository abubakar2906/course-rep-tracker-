'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Plus, ChevronRight, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import Link from 'next/link';

function calculatePercentage(records: any[], status: string): { completed: number; total: number; percentage: number } {
  const total = records?.length || 0;
  const completed = (records || []).filter((r: any) => r.status === status).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percentage };
}

export default function CourseHubPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updateText, setUpdateText] = useState('');
  const [posting, setPosting] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'cohorts' | 'trackers'>('feed');

  const courseId = params.id as string;

  useEffect(() => { fetchCourse(); }, [courseId]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await api.getCourse(courseId);
      if (res.success) setCourse(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handlePostUpdate = async () => {
    if (!updateText.trim()) return;
    setPosting(true);
    try {
      const res = await api.createCourseUpdate(courseId, updateText.trim());
      if (res.success) { setUpdateText(''); fetchCourse(); }
    } catch (e) { console.error(e); }
    finally { setPosting(false); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><p className="text-muted-foreground">Loading course hub...</p></div>;
  if (!course) return <div className="flex items-center justify-center min-h-[400px]"><p className="text-muted-foreground">Course not found.</p></div>;

  const isLecturerOrRep = user?.role === 'lecturer' || user?.role === 'course_rep';
  const totalStudents = (course.cohorts ?? []).reduce((s: number, c: any) => s + (c.students?.length ?? 0), 0);
  const attendanceTrackers = (course.trackers ?? []).filter((t: any) => t.type === 'ATTENDANCE');
  const assignmentTrackers = (course.trackers ?? []).filter((t: any) => t.type === 'ASSIGNMENT');

  let avgAttendance = 0;
  if (attendanceTrackers.length > 0) {
    let totalPct = 0;
    attendanceTrackers.forEach((t: any) => {
      totalPct += calculatePercentage(t.records || [], 'PRESENT').percentage;
    });
    avgAttendance = Math.round(totalPct / attendanceTrackers.length);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} /> Back
      </Button>

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary opacity-20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono font-bold bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg tracking-wider">{course.code}</span>
              {course.semester && <span className="text-xs font-medium bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">{course.semester}</span>}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{course.name}</h1>
            <div className="flex items-center gap-4 text-sm opacity-80">
              <span className="flex items-center gap-1.5">👨‍🏫 {course.lecturer?.name ?? 'No lecturer'}</span>
              <span className="flex items-center gap-1.5">👥 {totalStudents} Students</span>
              <span className="flex items-center gap-1.5">🏫 {course.cohorts?.length ?? 0} Cohorts</span>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center min-w-[140px] border border-white/10">
            <p className="text-4xl font-bold text-yellow-400">{attendanceTrackers.length}</p>
            <p className="text-xs font-medium opacity-90 mt-1 uppercase tracking-wide">Sessions</p>
          </div>
        </div>
      </div>

      {/* Course Analytics (Lecturers Only) */}
      {user?.role === 'lecturer' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-1 uppercase tracking-wider">Avg Attendance</p>
              <p className="text-3xl font-black text-blue-700 dark:text-blue-300">{avgAttendance}%</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users size={24} />
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-bold mb-1 uppercase tracking-wider">Active Cohorts</p>
              <p className="text-3xl font-black text-purple-700 dark:text-purple-300">{course.cohorts?.length ?? 0}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Users size={24} />
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-green-600 dark:text-green-400 font-bold mb-1 uppercase tracking-wider">Assignments</p>
              <p className="text-3xl font-black text-green-700 dark:text-green-300">{assignmentTrackers.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <FileText size={24} />
            </div>
          </div>
        </div>
      )}

      {/* Post Update (Lecturers and Course Reps) */}
      {isLecturerOrRep && (
        <div className="bg-card border rounded-2xl p-4 flex gap-4 items-center shadow-sm">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0 shadow-inner">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 flex flex-col sm:flex-row gap-3">
            <Input
              className="bg-secondary/50 border-transparent focus-visible:ring-1 text-base py-5"
              value={updateText}
              onChange={e => setUpdateText(e.target.value)}
              placeholder={user?.role === 'lecturer' ? 'Post a course-wide announcement...' : 'Share an update with your cohort...'}
              onKeyDown={e => e.key === 'Enter' && handlePostUpdate()}
            />
            <Button className="py-5 sm:px-6 shadow-sm" onClick={handlePostUpdate} disabled={posting || !updateText.trim()}>
              <Send size={16} className="mr-2" /> Post
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 bg-secondary/50 p-1.5 rounded-2xl">
        {(['feed', 'cohorts', 'trackers'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${activeTab === tab ? 'bg-background shadow-md text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'}`}>
            {tab === 'feed' ? '📢 Announcements' : tab === 'cohorts' ? '👥 Cohorts' : '📋 Trackers'}
          </button>
        ))}
      </div>

      <div className="pb-10">
        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div className="space-y-4">
            {!course.updates?.length ? (
              <div className="bg-card rounded-3xl border border-dashed border-border/60 p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <Send className="text-muted-foreground opacity-50" size={24} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">No Announcements Yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {isLecturerOrRep ? 'Be the first to post an update or share resources with the class.' : 'Check back later for course announcements.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {course.updates.map((update: any) => (
                  <div key={update.id} className="bg-card border rounded-3xl p-5 sm:p-6 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold shrink-0 ${update.author?.role === 'lecturer' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'}`}>
                      {update.author?.name?.charAt(0)}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-base font-bold text-foreground">{update.author?.name}</p>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${update.author?.role === 'lecturer' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'}`}>
                          {update.author?.role === 'lecturer' ? 'Lecturer' : 'Course Rep'}
                        </span>
                      </div>
                      <p className="text-foreground leading-relaxed">{update.content}</p>
                      <p className="text-xs font-medium text-muted-foreground mt-4 opacity-70 uppercase tracking-wider">{new Date(update.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cohorts Tab */}
        {activeTab === 'cohorts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!course.cohorts?.length ? (
              <div className="md:col-span-2 bg-card rounded-3xl border border-dashed border-border/60 p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <Users className="text-muted-foreground opacity-50" size={24} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">No Cohorts Enrolled</h3>
                <p className="text-sm text-muted-foreground max-w-sm">Course Reps need to link their cohorts to this course before they appear here.</p>
              </div>
            ) : (
              course.cohorts.map((cohort: any) => (
                <div key={cohort.id} className="bg-card border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-bold text-lg text-foreground tracking-tight">{cohort.program}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold bg-secondary px-2 py-1 rounded-md">{cohort.level?.replace('LEVEL_', '')}L</span>
                        <span className="text-xs font-medium text-muted-foreground">{cohort.department}</span>
                      </div>
                    </div>
                    <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-center">
                      <p className="text-xl font-black leading-none">{cohort.students?.length ?? 0}</p>
                    </div>
                  </div>
                  
                  <div className="bg-secondary/40 rounded-xl p-3 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-card shadow-sm flex items-center justify-center text-xs font-bold shrink-0">
                      {cohort.courseRep?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">Course Rep</p>
                      <p className="text-sm font-bold text-foreground">{cohort.courseRep?.name}</p>
                    </div>
                  </div>

                  <details className="group">
                    <summary className="list-none flex items-center justify-between text-sm font-semibold text-primary cursor-pointer hover:opacity-80 transition-opacity bg-primary/5 p-3 rounded-xl">
                      View Student List
                      <ChevronRight size={16} className="transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="mt-2 space-y-1 max-h-48 overflow-y-auto px-1 py-2 custom-scrollbar">
                      {(cohort.students ?? []).map((student: any) => (
                        <div key={student.id} className="flex items-center justify-between py-2 border-b last:border-0 border-border/50">
                          <p className="text-sm font-medium">{student.fullName}</p>
                          <p className="text-xs font-mono font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">{student.matricNumber}</p>
                        </div>
                      ))}
                      {(!cohort.students || cohort.students.length === 0) && (
                        <p className="text-xs text-muted-foreground text-center py-2">No students added yet.</p>
                      )}
                    </div>
                  </details>
                </div>
              ))
            )}
          </div>
        )}

        {/* Trackers Tab */}
        {activeTab === 'trackers' && (
          <div className="space-y-6">
            {user?.role === 'course_rep' && (
              <Link href={`/dashboard/trackers/add?courseId=${course.id}`} className="flex items-center justify-center gap-2 bg-yellow-300 hover:bg-yellow-400 text-gray-900 rounded-2xl py-4 font-bold transition-all shadow-sm hover:shadow-md active:scale-[0.98]">
                <Plus size={18} /> Create New Tracking Session
              </Link>
            )}

            {!course.trackers?.length ? (
              <div className="bg-card rounded-3xl border border-dashed border-border/60 p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <FileText className="text-muted-foreground opacity-50" size={24} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">No Tracking Sessions</h3>
                <p className="text-sm text-muted-foreground max-w-sm">Course Reps can create attendance and assignment trackers for this course.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Attendance Group */}
                {attendanceTrackers.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg">
                        <Users size={18} />
                      </div>
                      Attendance Sessions ({attendanceTrackers.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {attendanceTrackers.map((tracker: any) => {
                        const { completed, total, percentage } = calculatePercentage(tracker.records || [], 'PRESENT');
                        return (
                          <Link href={`/dashboard/trackers/${tracker.id}`} key={tracker.id}
                            className="bg-card border rounded-2xl p-5 hover:border-blue-500/30 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{tracker.name}</p>
                                <p className="text-xs font-medium text-muted-foreground mt-1 opacity-70 uppercase tracking-wider">{new Date(tracker.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                              </div>
                              <ChevronRight size={18} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </div>
                            
                            <div className="bg-secondary/50 rounded-xl p-3">
                              <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-muted-foreground">{completed} / {total} Present</span>
                                <span className={percentage >= 75 ? 'text-green-600 dark:text-green-400' : percentage >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}>{percentage}%</span>
                              </div>
                              <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${percentage >= 75 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${percentage}%` }} />
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Assignment Group */}
                {assignmentTrackers.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2 pt-2 border-t border-border/50">
                      <div className="p-1.5 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-lg">
                        <FileText size={18} />
                      </div>
                      Assignment Trackers ({assignmentTrackers.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {assignmentTrackers.map((tracker: any) => {
                        const { completed, total, percentage } = calculatePercentage(tracker.records || [], 'SUBMITTED');
                        return (
                          <Link href={`/dashboard/trackers/${tracker.id}`} key={tracker.id}
                            className="bg-card border rounded-2xl p-5 hover:border-green-500/30 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-bold text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{tracker.name}</p>
                                <p className="text-xs font-medium text-muted-foreground mt-1 opacity-70 uppercase tracking-wider">{new Date(tracker.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                              </div>
                              <ChevronRight size={18} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </div>
                            
                            <div className="bg-secondary/50 rounded-xl p-3">
                              <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-muted-foreground">{completed} / {total} Submitted</span>
                                <span className={percentage >= 75 ? 'text-green-600 dark:text-green-400' : percentage >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}>{percentage}%</span>
                              </div>
                              <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${percentage >= 75 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${percentage}%` }} />
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}