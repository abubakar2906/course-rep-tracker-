"use client"

import Link from "next/link"
import {
  motion, useMotionValue, useTransform, AnimatePresence,
  useInView, useSpring
} from "framer-motion"
import { useRef, useState, useEffect } from "react"
import {
  BookOpenCheck, ArrowRight, CheckCircle2, Users,
  BookOpen, ClipboardList, BarChart3, ListChecks
} from "lucide-react"
import { Button } from "@/components/ui/button"

/* ─────────────────────────────── TILT CARD ─────────────────────────────── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 300, damping: 30 })

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ──────────────────────────── ROLE CYCLER ──────────────────────────────── */
const ROLES = [
  { label: "Course Reps",   color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { label: "Lecturers",     color: "text-purple-400", bg: "bg-purple-400/10" },
  { label: "Students",      color: "text-blue-400",   bg: "bg-blue-400/10" },
]

function RoleCycler() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % ROLES.length), 2200)
    return () => clearInterval(t)
  }, [])

  return (
    <span className="inline-flex items-center overflow-hidden h-[1.1em] relative" style={{ minWidth: "10ch" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%",   opacity: 1 }}
          exit={{   y: "-100%", opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          className={`${ROLES[idx].color} font-extrabold inline-block`}
        >
          {ROLES[idx].label}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/* ──────────────────────────────── MARQUEE ──────────────────────────────── */
const MARQUEE_ITEMS = [
  "Attendance Tracking", "Assignment Logs", "Cohort Management",
  "Course Updates", "Real-time Records", "Student Roster",
  "Tracker Sessions", "Progress Stats", "Role-based Access",
]

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div className="overflow-hidden border-y border-border py-4 select-none">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="flex gap-8 whitespace-nowrap w-max"
      >
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
            <span className="w-1 h-1 rounded-full bg-yellow-400 inline-block" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ─────────────────────────── MOCK PREVIEW CARD ─────────────────────────── */
function MockPreview() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
      {/* shadow glow */}
      <div className="absolute -inset-4 bg-yellow-400/5 rounded-3xl blur-xl" />

      <div className="relative bg-card border border-border rounded-2xl p-5 w-full max-w-sm shadow-2xl space-y-4">
        {/* header */}
        <div className="flex items-center gap-3 pb-3 border-b border-border">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">AF</div>
          <div>
            <p className="text-sm font-semibold text-foreground">Amira Fatima</p>
            <p className="text-xs text-muted-foreground">🎓 Course Rep · Nursing 500L</p>
          </div>
        </div>

        {/* stat row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { n: "47",  label: "Students", c: "text-blue-400" },
            { n: "3",   label: "Courses",  c: "text-purple-400" },
            { n: "12",  label: "Sessions", c: "text-green-400" },
          ].map(s => (
            <div key={s.label} className="bg-secondary/40 rounded-xl p-2.5 text-center">
              <p className={`text-lg font-bold ${s.c}`}>{s.n}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* tracker rows */}
        <div className="space-y-2">
          {[
            { name: "Week 3 Attendance", code: "MCB 501", count: 47, type: "ATTENDANCE" },
            { name: "Assignment 2 Log",  code: "PUH 301", count: 42, type: "ASSIGNMENT" },
          ].map(t => (
            <div key={t.name} className="flex items-center justify-between bg-secondary/30 rounded-xl px-3 py-2.5">
              <div>
                <p className="text-xs font-medium text-foreground">{t.name}</p>
                <p className="text-[10px] text-muted-foreground font-mono">{t.code}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                t.type === "ATTENDANCE"
                  ? "bg-green-950 text-green-400"
                  : "bg-orange-950 text-orange-400"
              }`}>
                {t.count} records
              </span>
            </div>
          ))}
        </div>

        {/* animated progress bar */}
        <div>
          <div className="flex justify-between mb-1.5">
            <p className="text-[10px] text-muted-foreground">Semester completion</p>
            <p className="text-[10px] font-semibold text-yellow-400">68%</p>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "68%" }}
              transition={{ duration: 1.4, delay: 0.6, ease: "easeOut" }}
              className="h-full bg-yellow-400 rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ──────────────────────────── BENTO CELL ──────────────────────────────── */
function BentoCell({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ────────────────────────────── STEP ROW ──────────────────────────────── */
function Step({ n, title, desc, delay }: { n: string; title: string; desc: string; delay: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group flex items-start gap-5 py-5 border-b border-border last:border-0"
    >
      <span className="text-6xl font-black text-muted-foreground/10 group-hover:text-yellow-400/20 transition-colors duration-500 leading-none shrink-0 select-none font-mono w-14 text-right">
        {n}
      </span>
      <div className="pt-1">
        <p className="font-semibold text-foreground mb-1">{title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════ PAGE ═══════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <BookOpenCheck className="h-5 w-5 text-foreground" />
            <span className="text-lg font-bold text-foreground tracking-tight">CourseFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm">
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold text-sm px-4">
                Get started →
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* Left copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground border border-border rounded-full px-3 py-1 mb-8"
            >
              <CheckCircle2 size={11} className="text-yellow-400" />
              Attendance · Assignments · Cohorts
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight text-foreground mb-6"
            >
              Built for<br />
              <RoleCycler />
              <br />who mean it.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-base text-muted-foreground max-w-md leading-relaxed mb-10"
            >
              CourseFlow is the single workspace where lecturers teach,
              course reps organise, and students stay in the loop.
              No spreadsheets. No group chats. One platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="flex flex-wrap gap-3"
            >
              <Link href="/register">
                <Button className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold px-6 text-sm h-11">
                  Create free account
                  <ArrowRight size={15} className="ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="border-border text-muted-foreground hover:text-foreground px-6 text-sm h-11">
                  Sign into existing account
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right: mock dashboard preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <MockPreview />
          </motion.div>
        </div>
      </section>

      {/* ── Marquee ───────────────────────────────────────────────────── */}
      <Marquee />

      {/* ── Bento Grid ────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">

          <BentoCell className="mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-yellow-400 mb-2">What you get</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Everything in one grid.
            </h2>
          </BentoCell>

          {/* rows 1+2 unified — required for row-span-2 to work across both rows */}
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 mb-4">

            {/* Wide top card — col-span-2, row 1 */}
            <BentoCell delay={0} className="md:col-span-2">
              <TiltCard className="h-full">
                <div className="bg-card border border-border rounded-2xl p-7 h-full min-h-[220px] flex flex-col justify-between group hover:border-yellow-400/30 transition-colors duration-300">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-green-950 flex items-center justify-center mb-5">
                      <CheckCircle2 size={18} className="text-green-400" />
                    </div>
                    <p className="text-xl font-bold text-foreground mb-2">Attendance in one tap</p>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                      Open a session, flip toggles, done. Every record is timestamped, stored, and retrievable — no paper, no chaos.
                    </p>
                  </div>
                  <div className="flex gap-2 mt-6">
                    {["Present", "Absent", "Late"].map((s, i) => (
                      <span key={s} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                        i === 0 ? "bg-green-950 text-green-400 border-green-800"
                        : i === 1 ? "bg-red-950 text-red-400 border-red-900"
                        : "bg-yellow-950 text-yellow-400 border-yellow-900"
                      }`}>{s}</span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </BentoCell>

            {/* Tall role card — col-span-1, row-span-2 */}
            <BentoCell delay={0.07} className="md:row-span-2">
              <TiltCard className="h-full">
                <div className="bg-card border border-border rounded-2xl p-7 h-full flex flex-col gap-6 hover:border-border/80 transition-colors duration-300">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">Who it's for</p>
                    <p className="text-2xl font-bold text-foreground leading-snug">3 roles.<br />One platform.</p>
                  </div>

                  <div className="flex-1 flex flex-col gap-3">
                    {[
                      { emoji: "🎓", role: "Course Reps", color: "bg-yellow-950 text-yellow-400 border-yellow-800/50", desc: "Track, manage, organise" },
                      { emoji: "👨‍🏫", role: "Lecturers",   color: "bg-purple-950 text-purple-400 border-purple-800/50", desc: "Teach, post, oversee" },
                      { emoji: "📚", role: "Students",   color: "bg-blue-950 text-blue-400 border-blue-800/50",   desc: "Stay informed, on track" },
                    ].map((r, i) => (
                      <motion.div
                        key={r.role}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                        className={`border rounded-xl px-4 py-3 flex items-center gap-3 ${r.color}`}
                      >
                        <span className="text-xl">{r.emoji}</span>
                        <div>
                          <p className="text-xs font-semibold">{r.role}</p>
                          <p className="text-[10px] opacity-70">{r.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Every user sees only what's relevant to their role.
                  </p>
                </div>
              </TiltCard>
            </BentoCell>

            {/* Two smaller cards — col-span-2, row 2 — sit directly below the wide card */}
            <BentoCell delay={0.1} className="md:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                {[
                  { icon: ClipboardList, label: "Assignment Logs", desc: "Who submitted, who didn't — at a glance.", color: "bg-orange-950 text-orange-400" },
                  { icon: BookOpen,      label: "Course Linking",   desc: "Tie courses to cohorts across semesters.", color: "bg-purple-950 text-purple-400" },
                ].map((f, i) => (
                  <BentoCell key={f.label} delay={0.1 + i * 0.05}>
                    <TiltCard className="h-full">
                      <div className="bg-card border border-border rounded-2xl p-6 h-full flex flex-col gap-4 hover:border-border/80 transition-colors">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${f.color}`}>
                          <f.icon size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground mb-1">{f.label}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                        </div>
                      </div>
                    </TiltCard>
                  </BentoCell>
                ))}
              </div>
            </BentoCell>

          </div>

          {/* row 3: full-width stat strip */}
          <BentoCell delay={0.14}>
            <div className="bg-card border border-border rounded-2xl px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-border">
              {[
                { icon: Users,       label: "Bulk student import",  sub: "Add whole cohorts at once"          },
                { icon: BarChart3,   label: "Visual progress stats", sub: "Completion rates, attendance trends" },
                { icon: ListChecks,  label: "Named tracker sessions",sub: "Revisit any session any time"        },
                { icon: BookOpenCheck, label: "Clean, focused UI",   sub: "No clutter, no learning curve"      },
              ].map((f, i) => (
                <div key={f.label} className="flex flex-col gap-2 pl-6 first:pl-0">
                  <f.icon size={18} className="text-yellow-400" />
                  <p className="text-sm font-semibold text-foreground">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.sub}</p>
                </div>
              ))}
            </div>
          </BentoCell>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section className="py-24 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-yellow-400 mb-3">Process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              From zero to<br />tracking in minutes.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No onboarding maze. Pick your role, set up your space, and start doing real work immediately.
            </p>
          </div>

          <div>
            <Step n="01" title="Register & pick your role" desc="Lecturer, Course Rep, or Student — each unlocks a purpose-built dashboard." delay={0} />
            <Step n="02" title="Create or join a cohort"   desc="Course Reps define the cohort (program, level, dept). Students and lecturers link in." delay={0.06} />
            <Step n="03" title="Add students in bulk"      desc="Use the spreadsheet-style importer to get your whole class in under a minute." delay={0.12} />
            <Step n="04" title="Open a tracker & go"       desc="Name the session, mark attendance or submissions, and every record is saved instantly." delay={0.18} />
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* dot grid via inline style — matches card aesthetic */}
            <div
              className="relative overflow-hidden bg-card border border-border rounded-2xl px-10 py-16 text-center"
              style={{
                backgroundImage: "radial-gradient(circle, hsl(0 0% 30%) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            >
              {/* overlay to fade the dots at edges */}
              <div className="absolute inset-0 bg-gradient-to-b from-card/60 via-transparent to-card/60 pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
                  <BookOpenCheck size={26} className="text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                    Your class deserves better.
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
                    Stop wrestling with spreadsheets and group chats.
                    CourseFlow keeps everything in one clean, fast workspace.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/register">
                    <Button className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold px-8 h-11 text-sm">
                      Create your account — it's free
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="border-border text-muted-foreground hover:text-foreground h-11 text-sm px-6">
                      Already have one? Sign in
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center text-sm text-muted-foreground flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <BookOpenCheck size={15} className="text-foreground" />
            <span className="font-semibold text-foreground">CourseFlow</span>
          </div>
          <p>&copy; {new Date().getFullYear()} CourseFlow. Built for academic life.</p>
        </div>
      </footer>
    </div>
  )
}