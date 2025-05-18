import * as React from "react" // Added React import
import Link from "next/link"
import {
  ArrowRight,
  Users,
  DollarSign,
  MessageSquare,
  FileText,
  Settings,
  PlusCircle,
  ListChecks,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button" // Assuming you have a Button component
import { Separator } from "@/components/ui/separator" // Assuming you have a Separator component

// --- Data Types ---

/**
 * Represents the data for a summary card on the dashboard.
 */
type SummaryCardProps = {
  title: string
  value: string
  description: string
  icon: React.ElementType // Lucide icon component
  iconBgColor?: string // Optional background color for the icon container
  barPercentage?: number // For the small progress bar
  barColor?: string // Color for the progress bar, defaults to primary
  link?: string
  linkText?: string
}

/**
 * Represents an item in the recent activity feed.
 */
type ActivityItemProps = {
  id: string
  userInitials: string // e.g., "SJ" for Sarah Johnson
  userName: string
  action: string // e.g., "updated student profile for"
  target?: string // e.g., "John Doe"
  timestamp: string // e.g., "2 hours ago"
  avatarColor?: string // Background color for avatar placeholder
}

/**
 * Represents a quick link item.
 */
type QuickLinkProps = {
  id: string
  label: string
  href: string
  icon: React.ElementType
}

// --- Mock Data (In a real app, this would come from an API) ---

const summaryCardsData: SummaryCardProps[] = [
  {
    title: "Attendance",
    value: "87%",
    description: "Average attendance",
    icon: Users,
    iconBgColor: "bg-blue-100 dark:bg-blue-900",
    barPercentage: 87,
    barColor: "bg-blue-500",
    link: "/dashboard/trackers/attendance", // Example link
    linkText: "View Attendance",
  },
  {
    title: "Fees Collected",
    value: "65%",
    description: "Payment rate",
    icon: DollarSign,
    iconBgColor: "bg-green-100 dark:bg-green-900",
    barPercentage: 65,
    barColor: "bg-green-500",
    link: "/dashboard/trackers/fees", // Example link
    linkText: "View Fee Status",
  },
  {
    title: "Open Complaints",
    value: "8",
    description: "Awaiting resolution",
    icon: MessageSquare,
    iconBgColor: "bg-red-100 dark:bg-red-900",
    // No bar for this one, or could represent something else
    link: "/dashboard/trackers/complaints", // Example link
    linkText: "Manage Complaints",
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
    userInitials: "AD",
    userName: "Admin",
    action: "resolved complaint #1023",
    timestamp: "1 hour ago",
    avatarColor: "bg-yellow-500",
  },
  {
    id: "3",
    userInitials: "SJ",
    userName: "Sarah Johnson",
    action: "added new student",
    target: "Michael Brown",
    timestamp: "3 hours ago",
    avatarColor: "bg-primary",
  },
  {
    id: "4",
    userInitials: "LR",
    userName: "Lecturer A",
    action: "posted new announcement for",
    target: "All Students",
    timestamp: "Yesterday",
    avatarColor: "bg-indigo-500",
  },
]

const quickLinksData: QuickLinkProps[] = [
  { id: "1", label: "Add New Student", href: "/dashboard/students/add", icon: UserPlus },
  { id: "2", label: "Create New Tracker", href: "/dashboard/trackers/add", icon: PlusCircle },
  { id: "3", label: "Manage Tasks", href: "/dashboard/tasks", icon: ListChecks },
  { id: "4", label: "Account Settings", href: "/dashboard/profile", icon: Settings },
]


// --- Sub-Components (Ideally in separate files) ---

/**
 * DashboardSummaryCard component displays key metrics.
 */
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

/**
 * ActivityItem component for displaying a single activity in the feed.
 */
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

/**
 * QuickLinkItem component for displaying a quick action link.
 */
const QuickLinkItem: React.FC<QuickLinkProps> = ({ label, href, icon: Icon }) => {
  return (
    <Link href={href} passHref legacyBehavior>
      <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
        <Icon size={18} className="mr-3 shrink-0 text-primary" />
        <span className="text-sm font-medium text-foreground">{label}</span>
      </Button>
    </Link>
  )
}

/**
 * DashboardSection component to wrap content sections with a title.
 */
const DashboardSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = "" }) => (
  <div className={`bg-card rounded-xl shadow-sm p-5 ${className}`}>
    <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
    {children}
  </div>
);

// --- Main Dashboard Page Component ---

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Summary Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {summaryCardsData.map((card) => (
          <DashboardSummaryCard key={card.title} {...card} />
        ))}
      </div>

      {/* Main Content Area: Recent Activity and Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Activity Section */}
        <DashboardSection title="Recent Activity" className="lg:col-span-2">
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

        {/* Quick Links Section */}
        <DashboardSection title="Quick Links">
          <div className="space-y-3">
            {quickLinksData.map((link) => (
              <QuickLinkItem key={link.id} {...link} />
            ))}
            {quickLinksData.length === 0 && (
               <p className="text-sm text-muted-foreground text-center py-4">No quick links available.</p>
            )}
          </div>
        </DashboardSection>
      </div>
    </div>
  )
}
