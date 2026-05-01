'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, BookOpen, ClipboardList, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

function StatCard({ title, value, subtitle, icon: Icon, color }: any) {
  return (
    <div className="bg-card rounded-2xl border p-5 flex items-start gap-4">
      <div className={`p-3 rounded-xl ${color}`}><Icon size={20} /></div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm font-medium text-foreground">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

export function CourseRepDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [trackers, setTrackers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, trackersRes, coursesRes, cohortsRes] = await Promise.all([
        api.getStudents(),
        api.getTrackers(),
        api.getCourses(),
        api.getMyCohorts(),
      ]);
      if (studentsRes.success) setStudents(studentsRes.data);
      if (trackersRes.success) setTrackers(trackersRes.data);
      if (coursesRes.success) setCourses(coursesRes.data);
      if (cohortsRes.success) setCohorts(cohortsRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><p className="text-muted-foreground">Loading...</p></div>;

  const attendanceTrackers = trackers.filter((t: any) => t.type === 'ATTENDANCE');
  const assignmentTrackers = trackers.filter((t: any) => t.type === 'ASSIGNMENT');
  const cohort = cohorts[0];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white">
        <p className="text-sm opacity-80 mb-1">Course Representative</p>
        <h2 className="text-2xl font-bold">{user?.name}</h2>
        {cohort && (
          <p className="text-sm opacity-80 mt-1">
            {cohort.program} · {cohort.level?.replace('LEVEL_', '')}L · {cohort.department}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Students" value={students.length} subtitle="In your cohort" icon={Users} color="bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400" />
        <StatCard title="Courses" value={courses.length} subtitle="Linked to cohort" icon={BookOpen} color="bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400" />
        <StatCard title="Attendance" value={attendanceTrackers.length} subtitle="Sessions tracked" icon={CheckCircle2} color="bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400" />
        <StatCard title="Assignments" value={assignmentTrackers.length} subtitle="Tracked" icon={ClipboardList} color="bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/dashboard/students" className="group bg-card border rounded-2xl p-5 flex items-center justify-between hover:border-primary/50 hover:shadow-md transition-all">
          <div>
            <p className="font-semibold text-foreground">Manage Students</p>
            <p className="text-sm text-muted-foreground">{students.length} students in your cohort</p>
          </div>
          <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
        <Link href="/dashboard/trackers" className="group bg-card border rounded-2xl p-5 flex items-center justify-between hover:border-primary/50 hover:shadow-md transition-all">
          <div>
            <p className="font-semibold text-foreground">Take Attendance</p>
            <p className="text-sm text-muted-foreground">Create a new tracking session</p>
          </div>
          <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      </div>

      {/* Courses */}
      <div>
        <h3 className="text-lg font-semibold mb-4">My Courses</h3>
        {courses.length === 0 ? (
          <div className="bg-card rounded-2xl border p-8 text-center text-muted-foreground text-sm">
            No courses linked yet. Search for courses by code in your profile or onboarding.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.map((course: any) => (
              <Link href={`/dashboard/courses/${course.id}`} key={course.id}
                className="group bg-card border rounded-2xl p-5 flex items-center justify-between hover:border-primary/50 hover:shadow-sm transition-all">
                <div>
                  <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-md">{course.code}</span>
                  <p className="font-medium text-foreground mt-2">{course.name}</p>
                  <p className="text-xs text-muted-foreground">by {course.lecturer?.name ?? 'Unknown'}</p>
                </div>
                <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Trackers */}
      {trackers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Tracking Sessions</h3>
          <div className="bg-card rounded-2xl border divide-y">
            {trackers.slice(0, 5).map((t: any) => (
              <Link href={`/dashboard/trackers/${t.id}`} key={t.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-accent/50 transition-colors group">
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.course?.code} · {t.type} · {new Date(t.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${t.type === 'ATTENDANCE' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'}`}>
                    {t._count?.records ?? 0} records
                  </span>
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
