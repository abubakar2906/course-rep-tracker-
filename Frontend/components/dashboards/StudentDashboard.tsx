'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, GraduationCap, ArrowRight, Bell, AlertCircle, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.getMyDashboardData();
      if (res.success) {
        setData(res.data);
      } else {
        setError(res.error || 'Failed to load dashboard data');
      }
    } catch (e) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><p className="text-muted-foreground">Loading your dashboard...</p></div>;

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Cohort Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          You haven't joined a cohort yet. Please log out and complete your onboarding to select and join your class cohort.
        </p>
      </div>
    );
  }

  const cohort = data;
  const courses = cohort?.courses || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6 md:items-end">
          <div>
            <p className="text-sm font-medium opacity-80 mb-1 tracking-wider uppercase">Student Portal</p>
            <h2 className="text-3xl font-bold mb-2">{user?.name}</h2>
            <div className="flex flex-wrap gap-3 text-sm opacity-90 font-medium">
              <span className="bg-black/20 px-3 py-1 rounded-lg backdrop-blur-sm">{cohort?.program}</span>
              <span className="bg-black/20 px-3 py-1 rounded-lg backdrop-blur-sm">{cohort?.level?.replace('LEVEL_', '')}L</span>
              <span className="bg-black/20 px-3 py-1 rounded-lg backdrop-blur-sm">{cohort?.department}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Courses */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <GraduationCap className="text-primary" size={24} /> My Courses
          </h3>
          
          {!courses.length ? (
             <div className="bg-card rounded-3xl border border-dashed border-border/60 p-8 text-center">
               <p className="text-muted-foreground">Your cohort is not linked to any courses yet.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map((course: any) => {
                const courseTrackers = course.trackers || [];
                
                return (
                  <Link href={`/dashboard/courses/${course.id}`} key={course.id}
                    className="bg-card border rounded-3xl p-5 hover:border-primary/50 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2 py-1 rounded-md">{course.code}</span>
                        <h4 className="font-bold text-foreground mt-2 line-clamp-1 group-hover:text-primary transition-colors">{course.name}</h4>
                        <p className="text-xs font-medium text-muted-foreground mt-1">👨‍🏫 {course.lecturer?.name}</p>
                      </div>
                      <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    
                    <div className="bg-secondary/40 rounded-xl p-3 flex justify-between items-center">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trackers</span>
                      <span className="text-sm font-bold text-foreground">{courseTrackers.length}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Recent Updates */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Bell className="text-yellow-500" size={24} /> Announcements
          </h3>
          
          <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
            {(() => {
              const allUpdates = courses.flatMap((c: any) => 
                (c.updates || []).map((u: any) => ({ ...u, courseCode: c.code }))
              ).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

              if (allUpdates.length === 0) {
                return (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No recent announcements.
                  </div>
                );
              }

              return (
                <div className="divide-y divide-border/50">
                  {allUpdates.slice(0, 5).map((u: any) => (
                    <div key={u.id} className="p-5 hover:bg-secondary/20 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md uppercase tracking-wider">{u.courseCode}</span>
                        <span className="text-xs font-medium text-muted-foreground opacity-70">
                          {new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{u.content}</p>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
