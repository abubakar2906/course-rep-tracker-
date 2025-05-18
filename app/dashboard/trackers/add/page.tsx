"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"

export default function AddTrackerPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the tracker data to a database
    console.log("Tracker data:", formData)
    // Redirect to trackers list
    window.location.href = "/dashboard/trackers"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/trackers" className="mr-3 p-2 rounded-full hover:bg-gray-200">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold">Add New Tracker</h1>
      </div>

      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Tracker Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Attendance Tracker"
                className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-foreground">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                placeholder="Describe the purpose of this tracker"
                className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Link
              href="/dashboard/trackers"
              className="px-6 py-3 rounded-lg border border-border text-foreground mr-2 hover:bg-secondary transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition flex items-center"
            >
              <Save size={18} className="mr-2" />
              Save Tracker
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
