"use client"

import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import {
  BookOpenCheck, Users, FileText, BookOpen, BarChart3,
  ArrowRight, GraduationCap, Presentation, ClipboardList,
  CheckCircle2, ChevronRight, ListChecks
} from "lucide-react"
import { Button } from "@/components/ui/button"

/* ─── animation helpers ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08 }
  }),
}

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── page ───────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <BookOpenCheck className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">CourseFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section className="pt-36 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-card border border-border text-xs font-medium text-muted-foreground"
          >
            <CheckCircle2 size={12} className="text-yellow-400" />
            Attendance · Assignments · Courses — all in one place
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-foreground mb-6"
          >
            Your complete{" "}
            <span className="text-yellow-400">academic hub</span>
            <br />for every role.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            CourseFlow connects Lecturers, Course Reps, and Students in one
            clean workspace. Track attendance, manage assignments, and keep
            your cohort organized — effortlessly.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/register">
              <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold px-8 text-base">
                Create your account
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-border text-muted-foreground hover:text-foreground px-8 text-base">
                Sign into existing account
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stat strip ── */}
      <AnimatedSection className="border-y border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-3 gap-4 text-center">
          {[
            { value: "3 Roles", label: "Lecturers, Reps & Students" },
            { value: "Real-time", label: "Attendance & submissions" },
            { value: "Zero setup", label: "Start tracking in minutes" },
          ].map((s, i) => (
            <motion.div key={i} variants={fadeUp} custom={i}>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ── Who it's for ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-3">Built for everyone</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold">One platform, three roles</motion.h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Presentation,
                role: "Lecturers",
                emoji: "👨‍🏫",
                color: "bg-purple-950 text-purple-300",
                accent: "border-purple-800/60",
                points: ["Create & manage courses", "Post official announcements", "View overall cohort stats"],
              },
              {
                icon: Users,
                role: "Course Reps",
                emoji: "🎓",
                color: "bg-blue-950 text-blue-300",
                accent: "border-yellow-500/40 shadow-[0_0_0_1px_rgba(234,179,8,.15)]",
                featured: true,
                points: ["Track attendance sessions", "Log assignment submissions", "Manage your full cohort"],
              },
              {
                icon: GraduationCap,
                role: "Students",
                emoji: "📚",
                color: "bg-green-950 text-green-300",
                accent: "border-green-800/60",
                points: ["View personal attendance", "See all course updates", "Monitor your own progress"],
              },
            ].map((card, i) => (
              <motion.div
                key={card.role}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`bg-card border rounded-2xl p-7 flex flex-col gap-5 ${card.accent}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base ${card.color}`}>
                    {card.emoji}
                  </div>
                  <span className="font-semibold text-lg text-foreground">{card.role}</span>
                  {card.featured && (
                    <span className="ml-auto text-xs bg-yellow-400/10 text-yellow-400 font-medium px-2 py-0.5 rounded-full border border-yellow-400/20">
                      Core role
                    </span>
                  )}
                </div>
                <ul className="space-y-2.5">
                  {card.points.map(pt => (
                    <li key={pt} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ChevronRight size={14} className="text-muted-foreground/50 shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-4 bg-card/40 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-3">Features</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold">Everything you need</motion.h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: CheckCircle2, label: "Attendance Tracking", desc: "Mark presence for every lecture in seconds. Filter by date and export when you need it.", color: "bg-green-950 text-green-400" },
              { icon: ClipboardList,  label: "Assignment Logs",    desc: "A clear record of who submitted what — no more chasing students for paperwork.", color: "bg-orange-950 text-orange-400" },
              { icon: BookOpen,       label: "Course Management",  desc: "Link courses to your cohort, add semester info, and post updates from one screen.", color: "bg-purple-950 text-purple-400" },
              { icon: Users,          label: "Cohort & Students",  desc: "Bulk-add students, organise by program and level, and keep records tidy.", color: "bg-blue-950 text-blue-400" },
              { icon: BarChart3,      label: "Progress Overview",  desc: "See completion rates at a glance — attendance streaks and submission stats built in.", color: "bg-pink-950 text-pink-400" },
              { icon: ListChecks,     label: "Tracker Sessions",   desc: "Each attendance or assignment check is a discrete, named session you can revisit any time.", color: "bg-yellow-950 text-yellow-400" },
            ].map((f, i) => (
              <motion.div
                key={f.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.5}
                whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-border/80 hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.color}`}>
                  <f.icon size={18} />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">{f.label}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-3">How it works</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold">Up and running in minutes</motion.h2>
          </AnimatedSection>

          <div className="flex flex-col gap-4">
            {[
              { step: "01", title: "Create your account", desc: "Register and pick your role — Lecturer, Course Rep, or Student." },
              { step: "02", title: "Set up your cohort", desc: "Course Reps create or join a cohort and link their courses to it." },
              { step: "03", title: "Add your students", desc: "Import or manually add students to the cohort roster in bulk." },
              { step: "04", title: "Start tracking", desc: "Open a tracker session, mark attendance or assignments, and you're done." },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="bg-card border border-border rounded-2xl px-6 py-5 flex items-start gap-5"
              >
                <span className="text-2xl font-extrabold text-muted-foreground/30 mt-0.5 shrink-0 font-mono">{s.step}</span>
                <div>
                  <p className="font-semibold text-foreground mb-1">{s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 border-t border-border">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-card border border-border rounded-2xl p-10 flex flex-col items-center gap-6">
            <BookOpenCheck size={36} className="text-yellow-400" />
            <h2 className="text-3xl font-bold text-foreground">Ready to get started?</h2>
            <p className="text-muted-foreground">
              Join CourseFlow and keep your class running like clockwork.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold px-10 text-base">
                Create your account
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 bg-background">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpenCheck size={16} className="text-foreground" />
            <span className="font-semibold text-foreground">CourseFlow</span>
          </div>
          <p>&copy; {new Date().getFullYear()} CourseFlow. The academic hub for every role.</p>
        </div>
      </footer>
    </div>
  )
}