import Link from "next/link"
import { BookOpenCheck, Users, FileText, BookOpen, BarChart3, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <BookOpenCheck className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">CourseRep</span>
            </div>
            <Link href="/login">
              <Button className="bg-yellow-300 text-gray-800 hover:bg-yellow-400">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            CourseRep Tracker
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Simplify Student Attendance & Assignments
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            The complete solution for course representatives to track attendance, 
            manage assignments, and organize everything by course—all in one place.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-yellow-300 text-gray-800 hover:bg-yellow-400 text-lg px-8 py-6">
              Login with Google
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Users}
              title="Track Attendance"
              description="Easily mark student attendance for lectures and sessions with just a few clicks."
            />
            <FeatureCard
              icon={FileText}
              title="Manage Assignments"
              description="Keep track of assignment submissions and monitor completion rates."
            />
            <FeatureCard
              icon={BookOpen}
              title="Organize by Course"
              description="Group all trackers by course for clean organization and easy access."
            />
            <FeatureCard
              icon={Users}
              title="Bulk Student Management"
              description="Add multiple students at once with our spreadsheet-style interface."
            />
            <FeatureCard
              icon={BarChart3}
              title="Real-time Progress"
              description="View completion rates and track progress with visual charts and stats."
            />
            <FeatureCard
              icon={BookOpenCheck}
              title="Simple & Intuitive"
              description="Clean, modern interface designed specifically for course reps."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Sign in with your Google account and start tracking in minutes.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-yellow-300 text-gray-800 hover:bg-yellow-400 text-lg px-8 py-6">
              Login with Google
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2026 CourseRep Tracker. Built for course representatives.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="bg-yellow-100 dark:bg-yellow-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        <Icon className="text-yellow-600 dark:text-yellow-300" size={24} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  )
}