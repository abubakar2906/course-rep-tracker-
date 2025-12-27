import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  Users,
  FileText,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

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

// --- Mock Data ---
const summaryCardsData: SummaryCardProps[] = [
  {
    title: "Attendance",
    value: "87%",
    description: "Average attendance",
    icon: Users,
    iconBgColor: "bg-blue-100 dark:bg-blue-900",
    barPercentage: 87,
    barColor: "bg-blue-500",
    link: "/dashboard/trackers/attendance",
    linkText: "View Attendance",
  },
  {
    title: "Assignments",
    value: "12",
    description: "Active assignments",
    icon: FileText,
    iconBgColor: "bg-green-100 dark:bg-green-900",
    barPercentage: 75,
    barColor: "bg-green-500",
    link: "/dashboard/trackers/assignments",
    linkText: "View Assignments",
  },
]

const recentActivityData: ActivityItemProps[] = [
  {
    id: "1",
    userInitials: "SJ",
    userName: "Sarah Johnson",
    action: "updated attendance for",
    target: "CSC 101",
    timestamp: "15 mins ago",
    avatarColor: "bg-primary",
  },
  {
    id: "2",
    userInitials: "SJ",
    userName: "Sarah Johnson",
    action: "added new assignment for",
    target: "CSC 101",
    timestamp: "1 hour ago",
    avatarColor: "bg-primary",
  },
]

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
          {recentActivityData.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <ActivityItem {...activity} />
              {index < recentActivityData.length - 1 && <Separator />}
            </React.Fragment>
          ))}
          {recentActivityData.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
          )}
        </div>
      </DashboardSection>
    </div>
  )
}
