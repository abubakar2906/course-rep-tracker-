'use client';

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowRight,
  Users,
  FileText,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"

// --- Data Types ---
type SummaryCardProps = {
  title: string
  value: string
  description: string
  icon: React.ElementType
  iconBgColor?: string
  barPercentage?: number
  barColor?: string
  link?: string
  linkText?: string
}

type ActivityItemProps = {
  id: string
  userInitials: string
  userName: string
  action: string
  target?: string
  timestamp: string
  avatarColor?: string
}

// --- Sub-Components ---
const DashboardSummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  iconBgColor = "bg-accent",
  barPercentage,
  barColor = "bg-primary",
  link,
  linkText = "View Details",
}) => {
  return (
    <div className="bg-card rounded-xl shadow-sm p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-foreground">{title}</h3>
          <div className={`p-2 rounded-full ${iconBgColor}`}>
            <Icon size={18} className="text-foreground/80" />
          </div>
        </div>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
      </div>
      <div>
        {barPercentage !== undefined && (
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden my-2">
            <div
              className={`${barColor} h-full rounded-full`}
              style={{ width: `${barPercentage}%` }}
            />
          </div>
        )}
        {link && (
          <Link href={link} className="text-sm text-primary hover:underline flex items-center mt-2">
            {linkText}
            <ArrowRight size={14} className="ml-1" />
          </Link>
        )}
      </div>
    </div>
  )
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  userInitials,
  userName,
  action,
  target,
  timestamp,
  avatarColor = "bg-secondary",
}) => {
  return (
    <div className="flex items-start space-x-3 py-3">
      <div className={`w-9 h-9 rounded-full ${avatarColor} flex items-center justify-center text-sm font-medium text-primary-foreground shrink-0`}>
        {userInitials}
      </div>
      <div className="flex-1">
        <p className="text-sm text-foreground">
          <span className="font-medium">{userName}</span> {action}{" "}
          {target && <span className="font-medium text-primary">{target}</span>}
        </p>
        <p className="text-xs text-muted-foreground">{timestamp}</p>
      </div>
    </div>
  )
}

const DashboardSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = "" }) => (
  <div className={`bg-card rounded-xl shadow-sm p-5 ${className}`}>
    <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
    {children}
  </div>
)

// --- Main Dashboard Page Component ---
export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [trackers, setTrackers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const [studentsRes, coursesRes] = await Promise.all([
        api.getStudents(),
        api.getCourses(),
      ]);

      // If user has no students AND no courses, redirect to onboarding
      if (studentsRes.success && coursesRes.success) {
        if (studentsRes.data.length === 0 && coursesRes.data.length === 0) {
          router.push('/dashboard/onboarding');
          return;
        }
      }

      // Otherwise continue with normal flow
      fetchData();
    } catch (error) {
      console.error('Failed to check onboarding:', error);
      fetchData();
    }
  };

  const fetchData = async () => {
    try {
      const [studentsRes, trackersRes] = await Promise.all([
        api.getStudents(),
        api.getTrackers(),
      ]);

      if (studentsRes.success) {
        setStudents(studentsRes.data);
      }

      if (trackersRes.success) {
        setTrackers(trackersRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Calculate real stats
  const attendanceTrackers = trackers.filter((t: any) => t.type === 'ATTENDANCE');
  const assignmentTrackers = trackers.filter((t: any) => t.type === 'ASSIGNMENT');

  const summaryCardsData: SummaryCardProps[] = [
    {
      title: "Students",
      value: students.length.toString(),
      description: "Total students",
      icon: Users,
      iconBgColor: "bg-blue-100 dark:bg-blue-900",
      link: "/dashboard/students",
      linkText: "Manage Students",
    },
    {
      title: "Trackers",
      value: trackers.length.toString(),
      description: `${attendanceTrackers.length} attendance, ${assignmentTrackers.length} assignments`,
      icon: FileText,
      iconBgColor: "bg-green-100 dark:bg-green-900",
      link: "/dashboard/trackers",
      linkText: "View Trackers",
    },
  ];

  // Recent activity from trackers (latest 5)
  const recentActivityData: ActivityItemProps[] = trackers
    .slice(0, 5)
    .map((tracker: any) => ({
      id: tracker.id,
      userInitials: user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U',
      userName: user?.name || 'User',
      action: `created ${tracker.type.toLowerCase()} tracker`,
      target: tracker.name,
      timestamp: new Date(tracker.createdAt).toLocaleDateString(),
      avatarColor: "bg-primary",
    }));

  return (
    <div className="space-y-6">
      {/* Summary Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {summaryCardsData.map((card) => (
          <DashboardSummaryCard key={card.title} {...card} />
        ))}
      </div>

      {/* Recent Activity Section */}
      <DashboardSection title="Recent Activity">
        <div className="space-y-1">
          {recentActivityData.length > 0 ? (
            recentActivityData.map((activity, index) => (
              <React.Fragment key={activity.id}>
                <ActivityItem {...activity} />
                {index < recentActivityData.length - 1 && <Separator />}
              </React.Fragment>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
          )}
        </div>
      </DashboardSection>
    </div>
  )
}