"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpenCheck, Users, FileText, BookOpen, BarChart3, ArrowRight, GraduationCap, Presentation, Sparkles, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 -left-1/4 w-[150%] h-[100vh] bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[50%] h-[50vh] bg-gradient-to-tl from-cyan-900/20 to-transparent blur-[120px] -z-10 pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="bg-gradient-to-br from-indigo-500 to-cyan-400 p-1.5 rounded-lg">
                <BookOpenCheck className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-cyan-300">
                CourseFlow
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link href="/login">
                <Button className="bg-white/10 text-white hover:bg-white/20 border border-white/10 backdrop-blur-sm transition-all duration-300">
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 flex items-center justify-center min-h-[90vh]">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
              <Sparkles size={16} />
              <span>The next generation academic hub</span>
            </div>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
            The unified hub for your <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
              academic journey.
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            CourseFlow seamlessly connects Lecturers, Course Reps, and Students. 
            Track attendance, manage assignments, and stay organized—all in one place.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-indigo-900/50 transition-all duration-300 hover:scale-105">
                Get Started for Free
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 text-lg px-8 py-6 rounded-xl transition-all duration-300">
                Log into existing account
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Personas Section */}
      <section className="py-24 px-4 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Built for Everyone</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">No matter your role, CourseFlow provides the tools you need to succeed.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Lecturer Card */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-cyan-500/20" />
              <div className="bg-cyan-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Presentation className="text-cyan-400" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Lecturers</h3>
              <p className="text-slate-400 mb-6">Create courses, post centralized updates, and oversee class progress effortlessly.</p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-cyan-400" /> Manage multiple courses</li>
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-cyan-400" /> Post official announcements</li>
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-cyan-400" /> Monitor overall class stats</li>
              </ul>
            </motion.div>

            {/* Course Rep Card */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-8 relative overflow-hidden group shadow-[0_0_30px_-10px_rgba(99,102,241,0.2)]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-indigo-500/20" />
              <div className="bg-indigo-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Users className="text-indigo-400" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Course Reps</h3>
              <p className="text-slate-400 mb-6">The heroes of the classroom. Track attendance, manage assignments, and organize cohorts.</p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-indigo-400" /> Instant attendance tracking</li>
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-indigo-400" /> Assignment submission logs</li>
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-indigo-400" /> Bulk student management</li>
              </ul>
            </motion.div>

            {/* Student Card */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-purple-500/20" />
              <div className="bg-purple-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <GraduationCap className="text-purple-400" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Students</h3>
              <p className="text-slate-400 mb-6">Stay on top of your academic life. View your records, updates, and track your standing.</p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-purple-400" /> View personal attendance</li>
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-purple-400" /> Never miss a course update</li>
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-purple-400" /> Monitor your progress</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Core Features</h2>
            <p className="text-slate-400 text-lg">Everything you need to keep the class running smoothly.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Users}
              title="Attendance Tracking"
              description="Mark student attendance for lectures instantly. Export to spreadsheets when needed."
              colorClass="text-blue-400"
              bgClass="bg-blue-400/10"
            />
            <FeatureCard
              icon={FileText}
              title="Assignment Logs"
              description="Keep a centralized log of who submitted what, and when. No more lost papers."
              colorClass="text-emerald-400"
              bgClass="bg-emerald-400/10"
            />
            <FeatureCard
              icon={BookOpen}
              title="Cohort Management"
              description="Group students by their exact program, department, and academic level."
              colorClass="text-amber-400"
              bgClass="bg-amber-400/10"
            />
            <FeatureCard
              icon={BarChart3}
              title="Visual Analytics"
              description="Beautiful charts that show completion rates, attendance streaks, and more."
              colorClass="text-purple-400"
              bgClass="bg-purple-400/10"
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Secure Access"
              description="Role-based permissions ensure that only authorized users can modify sensitive records."
              colorClass="text-rose-400"
              bgClass="bg-rose-400/10"
            />
            <FeatureCard
              icon={BookOpenCheck}
              title="Seamless UI"
              description="A clean, dark-themed interface built for speed and ease of use on any device."
              colorClass="text-cyan-400"
              bgClass="bg-cyan-400/10"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/40 -z-10" />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to streamline your academic workflow?
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join CourseFlow today and experience the easiest way to manage courses, cohorts, and students.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-200 text-lg px-10 py-6 rounded-xl shadow-xl shadow-white/10 transition-all hover:scale-105">
              Create an Account Now
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <BookOpenCheck size={18} className="text-indigo-400" />
            <span className="font-semibold text-slate-300">CourseFlow</span>
          </div>
          <p>&copy; {new Date().getFullYear()} CourseFlow. The unified academic hub.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, colorClass, bgClass }: { icon: any, title: string, description: string, colorClass: string, bgClass: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 transition-all hover:bg-slate-900 hover:border-slate-700"
    >
      <div className={`${bgClass} w-12 h-12 rounded-lg flex items-center justify-center mb-5`}>
        <Icon className={colorClass} size={24} />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-slate-200">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  )
}