'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Users, TrendingUp, ArrowRight, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

function StatCard({ title, value, subtitle, icon: Icon, color = 'bg-primary/10 text-primary' }: any) {
  return (
    <div className="bg-card rounded-2xl border p-5 flex items-start gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm font-medium text-foreground">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function ProgressBar({ value, color = 'bg-primary' }: { value: number; color?: string }) {
  return (
    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

function getAttendanceColor(pct: number) {
  if (pct >= 75) return 'bg-green-500';
  if (pct >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
}

export function LecturerDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [trackers, setTrackers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, trackersRes] = await Promise.all([
        api.getCourses(),
        api.getTrackers()
      ]);
      
      if (coursesRes.success) setCourses(coursesRes.data);
      if (trackersRes.success) setTrackers(trackersRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><p className="text-muted-foreground">Loading...</p></div>;

  const totalCohorts = courses.reduce((acc: number, c: any) => acc + (c.cohorts?.length ?? 0), 0);
  const totalStudents = courses.reduce((acc: number, c: any) =>
    acc + (c.cohorts?.reduce((s: number, cohort: any) => s + (cohort._count?.students ?? 0), 0) ?? 0), 0);

  // Compute global attendance across all courses
  const totalTrackers = trackers.length;

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-primary to-primary/70 rounded-2xl p-6 text-primary-foreground">
        <p className="text-sm opacity-80 mb-1">Welcome back</p>
        <h2 className="text-2xl font-bold">{user?.name}</h2>
        <p className="text-sm opacity-80 mt-1">{user?.faculty} · {user?.department}</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Courses" value={courses.length} subtitle="Courses you teach" icon={BookOpen} color="bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400" />
        <StatCard title="Cohorts Enrolled" value={totalCohorts} subtitle="Across all courses" icon={Users} color="bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400" />
        <StatCard title="Tracking Sessions" value={totalTrackers} subtitle="Attendance & assignments" icon={TrendingUp} color="bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400" />
      </div>

      {/* Courses Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Classes I Teach</h3>
        {courses.length === 0 ? (
          <div className="bg-card rounded-2xl border p-8 text-center text-muted-foreground">
            No courses yet. Add your courses in your profile.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course: any) => {
              const cohortStudentTotal = course.cohorts?.reduce((s: number, c: any) => s + (c._count?.students ?? 0), 0) ?? 0;
              const courseTrackers = trackers.filter((t: any) => t.course?.id === course.id);
              const attendanceSessions = courseTrackers.filter((t: any) => t.type === 'ATTENDANCE').length;
              const assignmentSessions = courseTrackers.filter((t: any) => t.type === 'ASSIGNMENT').length;

              return (
                <Link href={`/dashboard/courses/${course.id}`} key={course.id}
                  className="bg-card rounded-2xl border p-5 flex flex-col gap-4 hover:border-primary/50 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-md">{course.code}</span>
                        {course.updates?.length > 0 && <Bell size={14} className="text-yellow-500" />}
                      </div>
                      <h4 className="font-semibold text-foreground">{course.name}</h4>
                      {course.semester && <p className="text-xs text-muted-foreground">{course.semester}</p>}
                    </div>
                    <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                  </div>

                  {/* Cohorts */}
                  <div className="flex flex-wrap gap-2">
                    {course.cohorts?.map((cohort: any) => (
                      <span key={cohort.id} className="text-xs bg-secondary px-2 py-1 rounded-full">
                        {cohort.courseRep?.name} · {cohort._count?.students ?? 0} students
                      </span>
                    ))}
                    {!course.cohorts?.length && (
                      <span className="text-xs text-muted-foreground">No cohorts enrolled yet</span>
                    )}
                  </div>

                  {/* Tracker summary */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Attendance Sessions</p>
                      <p className="text-lg font-bold">{attendanceSessions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Assignment Trackers</p>
                      <p className="text-lg font-bold">{assignmentSessions}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent updates feed */}
      {courses.some((c: any) => c.updates?.length > 0) && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Course Updates</h3>
          <div className="bg-card rounded-2xl border divide-y">
            {courses.flatMap((c: any) =>
              (c.updates ?? []).map((u: any) => ({ ...u, courseCode: c.code }))
            ).slice(0, 5).map((u: any) => (
              <div key={u.id} className="px-5 py-3 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {u.courseCode?.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm text-foreground">{u.content}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{u.courseCode} · {new Date(u.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
