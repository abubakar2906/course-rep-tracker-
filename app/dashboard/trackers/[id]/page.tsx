"use client"

import * as React from "react"
import { Users, FileText, ArrowLeft, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Student } from "@/types/student"
import type { TrackerType } from "@/types/tracker"

import { mockStudents } from "@/types/mockData"

interface TrackerStats {
	total: number
	percentage: number
	present?: number
	submitted?: number
}

interface Tracker {
	type: TrackerType
	title: string
	course: string
	description: string
	icon: React.ElementType
	stats: TrackerStats
}

const getMockTracker = (id: string): Tracker | undefined => {
	const trackers: Record<string, Tracker> = {
		attendance: {
			type: "attendance",
			title: "Week 1 Lecture",
			course: "CSC 101",
			description: "Introduction to Computer Science",
			icon: Users,
			stats: {
				total: mockStudents.length,
				present: 0,
				percentage: 0,
			},
		},
		assignments: {
			type: "assignment",
			title: "Assignment 1",
			course: "CSC 101",
			description: "Basic Programming Concepts",
			icon: FileText,
			stats: {
				total: mockStudents.length,
				submitted: 0,
				percentage: 0,
			},
		},
	}
	return trackers[id]
}

export default function TrackerDetailPage({ params }: { params: Promise<{ id: string }> }) {
	// First, unwrap the params using React.use()
	const resolvedParams = React.use(params)

	// Get the tracker - check if it exists before initializing state
	const tracker = getMockTracker(resolvedParams.id)

	// Handle invalid tracker IDs - following the pattern from student profile page
	if (!tracker) {
		notFound()
	}

	// Then use the tracker in your state initialization
	const [trackerState, setTracker] = React.useState(tracker)
	const [markedStudents, setMarkedStudents] = React.useState<number[]>([])

	const handleToggleStudent = (studentId: number) => {
		setMarkedStudents((prev) => {
			const newMarkedStudents = prev.includes(studentId)
				? prev.filter((id) => id !== studentId)
				: [...prev, studentId]

			// Update tracker stats
			const totalStudents = mockStudents.length
			const markedCount = newMarkedStudents.length
			// Calculate percentage with proper handling for edge cases
			const percentage = totalStudents > 0 
				? Math.round((markedCount / totalStudents) * 100)
				: 0

			setTracker((current) => ({
				...current,
				stats: {
					total: totalStudents,
					percentage,
					...(current.type === "attendance"
						? { present: markedCount }
						: { submitted: markedCount }
					),
				},
			}))

			return newMarkedStudents
		})
	}

	const handleSaveChanges = () => {
		// Here you would typically save the changes to your backend
		alert(`Changes saved! ${markedStudents.length} students ${
			trackerState.type === "attendance" ? "marked present" : "marked as submitted"
		}`)
	}

	const Icon = trackerState.type === "attendance" ? Users : FileText

	// Compute percentage from actual stats to ensure correlation
	// This ensures the progress bar always matches the displayed numbers
	const computedPercentage = React.useMemo(() => {
		const total = trackerState.stats.total
		const count = trackerState.type === "attendance" 
			? (trackerState.stats.present ?? 0)
			: (trackerState.stats.submitted ?? 0)
		
		if (total === 0) return 0
		return Math.round((count / total) * 100)
	}, [trackerState.stats.total, trackerState.stats.present, trackerState.stats.submitted, trackerState.type])

	// Use computed percentage to ensure it always matches the displayed ratio
	const displayPercentage = computedPercentage

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Link href="/dashboard/trackers">
					<Button variant="ghost" size="icon">
						<ArrowLeft className="h-5 w-5" />
					</Button>
				</Link>
				<div>
					<h1 className="text-2xl font-bold">{trackerState.course}</h1>
					<p className="text-muted-foreground">{trackerState.title}</p>
				</div>
			</div>

			<Card className="p-6">
				<div className="flex items-center gap-4 mb-6">
					<div className="p-2 bg-secondary rounded-full">
						<Icon className="h-5 w-5" />
					</div>
					<div>
						<h2 className="font-semibold">
							{trackerState.type === "attendance" ? "Attendance Tracker" : "Assignment Tracker"}
						</h2>
						<p className="text-sm text-muted-foreground">{trackerState.description}</p>
					</div>
				</div>

				<div className="space-y-4">
					<div>
						<div className="flex justify-between mb-2">
							<span className="text-sm text-muted-foreground">Completion</span>
							<span className="text-sm font-medium">{displayPercentage}%</span>
						</div>
						<div className="h-2 bg-secondary rounded-full overflow-hidden">
							<div
								className="h-full bg-primary transition-all duration-300"
								style={{ width: `${displayPercentage}%` }}
							/>
						</div>
					</div>

					<div className="pt-4 border-t">
						<dl className="grid grid-cols-2 gap-4">
							<div>
								<dt className="text-sm text-muted-foreground">Total Students</dt>
								<dd className="text-2xl font-bold">{trackerState.stats.total}</dd>
							</div>
							<div>
								<dt className="text-sm text-muted-foreground">
									{trackerState.type === "attendance" ? "Present" : "Submitted"}
								</dt>
								<dd className="text-2xl font-bold">
									{trackerState.type === "attendance" ? trackerState.stats.present : trackerState.stats.submitted}
								</dd>
							</div>
						</dl>
					</div>
				</div>

				{/* Student List */}
				<div className="mt-6">
					<h3 className="text-lg font-semibold mb-4">Student List</h3>
					<div className="space-y-4">
						{mockStudents.map((student) => (
							<div
								key={student.id}
								className="flex items-center justify-between p-3 hover:bg-secondary rounded-lg transition-colors"
							>
								<div className="flex items-center space-x-3">
									<Checkbox
										checked={markedStudents.includes(student.id)}
										onCheckedChange={() => handleToggleStudent(student.id)}
										id={`student-${student.id}`}
									/>
									<div>
										<label
											htmlFor={`student-${student.id}`}
											className="font-medium cursor-pointer"
										>
											{student.name}
										</label>
										<p className="text-sm text-muted-foreground">{student.matricNumber}</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									{markedStudents.includes(student.id) ? (
										<span className="text-sm text-green-600 flex items-center gap-1">
											<Check size={16} />
											{trackerState.type === "attendance" ? "Present" : "Submitted"}
										</span>
									) : (
										<span className="text-sm text-red-600 flex items-center gap-1">
											<X size={16} />
											{trackerState.type === "attendance" ? "Absent" : "Not Submitted"}
										</span>
									)}
								</div>
							</div>
						))}
					</div>

					{/* Save Button */}
					<div className="mt-6 flex justify-end">
						<Button
							className="w-full sm:w-auto"
							onClick={handleSaveChanges}
						>
							Save Changes
						</Button>
					</div>
				</div>
			</Card>
		</div>
	)
}
