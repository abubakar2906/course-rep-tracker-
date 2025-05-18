import Link from "next/link"
import { Users, DollarSign, MessageSquare, ChevronRight, BarChart, Plus } from "lucide-react"

// Mock tracker data
const trackers = [
  {
    id: "attendance",
    name: "Attendance Tracker",
    description: "Track student attendance for classes and events",
    icon: Users,
    color: "blue",
    stats: {
      total: 120,
      completed: 98,
      percentage: 82,
    },
  },
  {
    id: "fees",
    name: "Fee Tracker",
    description: "Monitor student fee payments and dues",
    icon: DollarSign,
    color: "green",
    stats: {
      total: 120,
      completed: 78,
      percentage: 65,
    },
  },
  {
    id: "complaints",
    name: "Complaint Log",
    description: "Record and manage student complaints and issues",
    icon: MessageSquare,
    color: "red",
    stats: {
      total: 120,
      active: 12,
      resolved: 24,
      percentage: 67,
    },
  },
]

export default function TrackersPage() {
  return (
    <div className="space-y-4 p-1">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Trackers</h1>
        <Link
          href="/dashboard/trackers/add"
          className="px-4 py-2 rounded-lg bg-yellow-300 text-gray-800 font-medium hover:bg-yellow-400 transition flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add Tracker
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trackers.map((tracker) => (
          <Link
            key={tracker.id}
            href={`/dashboard/trackers/${tracker.id}`}
            className="bg-card rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className={`p-4 bg-secondary border-b border-border`}>
              <div className="flex items-center justify-between">
                <div className={`p-2 bg-accent rounded-full`}>
                  <tracker.icon size={20} className={`text-foreground`} />
                </div>
                <BarChart size={18} className="text-muted-foreground" />
              </div>
              <h2 className="text-lg font-medium mt-3">{tracker.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{tracker.description}</p>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Completion</span>
                <span className="text-sm font-medium">{tracker.stats.percentage}%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full bg-primary`} style={{ width: `${tracker.stats.percentage}%` }}></div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  {tracker.id === "complaints"
                    ? `${tracker.stats.active} active / ${tracker.stats.resolved} resolved`
                    : `${tracker.stats.completed} / ${tracker.stats.total} students`}
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
