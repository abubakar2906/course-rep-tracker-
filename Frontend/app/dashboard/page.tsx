'use client';

import { useAuth } from "@/contexts/AuthContext"
import { CourseRepDashboard } from "@/components/dashboards/CourseRepDashboard"
import { LecturerDashboard } from "@/components/dashboards/LecturerDashboard"
import { StudentDashboard } from "@/components/dashboards/StudentDashboard"


export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading Dashboard...</p>
      </div>
    );
  }

  if (user.role === 'course_rep') {
    return <CourseRepDashboard />;
  }

  if (user.role === 'lecturer') {
    return <LecturerDashboard />;
  }

  if (user.role === 'student') {
    return <StudentDashboard />;
  }



  // Fallback (e.g., if somehow they bypass onboarding)
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <p className="text-lg font-medium text-foreground mb-2">Setup Required</p>
        <p className="text-muted-foreground">Please complete onboarding to access your dashboard.</p>
      </div>
    </div>
  );
}