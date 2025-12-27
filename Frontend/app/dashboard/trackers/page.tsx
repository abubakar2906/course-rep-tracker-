import Link from "next/link"
import { Users, FileText, BarChart, Plus, ChevronRight } from "lucide-react"
import { mockStudents } from "@/types/mockData"

// Helper function to calculate percentage ensuring correlation
function calculatePercentage(completed: number, total: number): number {
	if (total === 0) return 0
	return Math.round((completed / total) * 100)
}

// Mock tracker data - using mockStudents.length for consistency with detail page
const trackers = [
	{
		id: "attendance",
		name: "Attendance Tracker",
		description: "Track student attendance for classes and events",
		icon: Users,
		color: "blue",
		stats: {
			total: mockStudents.length,
			completed: 0, // Starts at 0, matches detail page initial state
		},
	},
	{
		id: "assignments",
		name: "Assignment Tracker",
		description: "Monitor student assignments and submissions",
		icon: FileText,
		color: "green",
		stats: {
			total: mockStudents.length,
			completed: 0, // Starts at 0, matches detail page initial state
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
					className="flex items-center rounded-lg bg-yellow-300 px-4 py-2 text-gray-800 transition hover:bg-yellow-400"
				>
					<Plus className="mr-1" size={18} />
					Add Tracker
				</Link>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{trackers.map((tracker) => (
					<Link
						key={tracker.id}
						href={`/dashboard/trackers/${tracker.id}`}
						className="group block overflow-hidden rounded-xl bg-card shadow-sm transition-shadow hover:shadow-md"
					>
						<div className={`border-b border-border bg-secondary p-4`}>
							<div className="flex items-center justify-between">
								<div className={`rounded-full bg-accent p-2`}>
									<tracker.icon className={`text-foreground`} size={20} />
								</div>
								<BarChart className="text-muted-foreground" size={18} />
							</div>
							<h2 className="mt-3 text-lg font-medium">{tracker.name}</h2>
							<p className="mt-1 text-sm text-muted-foreground">
								{tracker.description}
							</p>
						</div>

					<div className="p-4">
						{(() => {
							// Calculate percentage dynamically to ensure it always matches the ratio
							const percentage = calculatePercentage(
								tracker.stats.completed,
								tracker.stats.total
							)
							return (
								<>
									<div className="mb-2 flex items-center justify-between">
										<span className="text-sm text-muted-foreground">
											Completion
										</span>
										<span className="text-sm font-medium">
											{percentage}%
										</span>
									</div>
									<div className="h-2 rounded-full bg-secondary overflow-hidden w-full">
										<div
											className={`h-full bg-primary`}
											style={{
												width: `${percentage}%`,
											}}
										></div>
									</div>
								</>
							)
						})()}

							<div className="mt-4 flex items-center justify-between">
								<div className="text-sm text-muted-foreground">
									{`${tracker.stats.completed} / ${tracker.stats.total} students`}
								</div>
								<ChevronRight className="text-muted-foreground" size={16} />
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}
