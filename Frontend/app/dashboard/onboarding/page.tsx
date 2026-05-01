'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, ArrowLeft, Check, Search, BookOpen, Users, GraduationCap } from 'lucide-react';

const LEVELS = ['LEVEL_100', 'LEVEL_200', 'LEVEL_300', 'LEVEL_400', 'LEVEL_500'];
const LEVEL_LABELS: Record<string, string> = {
  LEVEL_100: '100 Level', LEVEL_200: '200 Level', LEVEL_300: '300 Level',
  LEVEL_400: '400 Level', LEVEL_500: '500 Level',
};

export default function OnboardingPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth() as any;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1 profile fields
  const [profile, setProfile] = useState({ faculty: '', department: '', role: '', phone: '', matricNumber: '' });

  // Course Rep: cohort + students + course search
  const [cohort, setCohort] = useState({ faculty: '', department: '', program: '', level: 'LEVEL_100' });
  const [cohortId, setCohortId] = useState('');
  const [students, setStudents] = useState([{ fullName: '', matricNumber: '', gender: 'MALE' }]);
  const [courseSearch, setCourseSearch] = useState('');
  const [foundCourse, setFoundCourse] = useState<any>(null);
  const [linkedCourseIds, setLinkedCourseIds] = useState<string[]>([]);

  // Lecturer: course creation
  const [courses, setCourses] = useState([{ code: '', name: '', semester: '' }]);

  // Student: cohort browsing
  const [allCohorts, setAllCohorts] = useState<any[]>([]);
  const [cohortFilter, setCohortFilter] = useState({ faculty: '', department: '', level: '' });
  const [selectedCohortId, setSelectedCohortId] = useState('');

  const setErr = (msg: string) => { setError(msg); setTimeout(() => setError(''), 4000); };

  // ─── Step 1: Role selection & basic profile ───
  const handleStep1 = async () => {
    if (!profile.role) return setErr('Please select a role');
    if (!profile.faculty || !profile.department) return setErr('Please fill in Faculty and Department');

    setLoading(true);
    try {
      const res = await api.updateProfile(profile);
      if (!res.success) return setErr(res.error || 'Failed to update profile');

      if (profile.role === 'student') {
        // Load all cohorts for browsing
        setLoading(true);
        try {
          const res = await api.getAllCohorts();
          if (res.success) setAllCohorts(res.data);
          setStep(2);
        } catch { setErr('Failed to load cohorts'); }
        finally { setLoading(false); }
      } else if (profile.role === 'lecturer') {
        setStep(2); // Create courses
      } else if (profile.role === 'course_rep') {
        // Pre-fill cohort from profile
        setCohort(c => ({ ...c, faculty: profile.faculty, department: profile.department }));
        setStep(2); // Create cohort
      }
    } catch { setErr('Failed to save profile'); }
    finally { setLoading(false); }
  };

  // ─── Course Rep Step 2: Create Cohort ───
  const handleRepStep2 = async () => {
    if (!cohort.program || !cohort.level) return setErr('Please fill in all cohort details');
    setLoading(true);
    try {
      const res = await api.createCohort({
        faculty: cohort.faculty || profile.faculty,
        department: cohort.department || profile.department,
        program: cohort.program,
        level: cohort.level
      });
      if (!res.success) return setErr(res.error || 'Failed to create cohort');
      setCohortId(res.data.id);
      setStep(3); // Add students
    } catch { setErr('Failed to create cohort'); }
    finally { setLoading(false); }
  };

  // ─── Course Rep Step 3: Add Students ───
  const addStudentRow = () => setStudents([...students, { fullName: '', matricNumber: '', gender: 'MALE' }]);
  const removeStudentRow = (i: number) => students.length > 1 && setStudents(students.filter((_, idx) => idx !== i));
  const updateStudent = (i: number, field: string, value: string) => {
    const updated = [...students];
    updated[i] = { ...updated[i], [field]: value };
    setStudents(updated);
  };

  const handleRepStep3 = async () => {
    const valid = students.filter(s => s.fullName && s.matricNumber);
    if (valid.length === 0) return setErr('Please add at least one student');
    setLoading(true);
    try {
      await Promise.all(valid.map(s => api.createStudent({ ...s, cohortId })));
      setStep(4); // Link courses
    } catch { setErr('Failed to add students'); }
    finally { setLoading(false); }
  };

  // ─── Course Rep Step 4: Link Courses ───
  const handleSearchCourse = async () => {
    if (!courseSearch.trim()) return;
    setLoading(true);
    try {
      const res = await api.findCourseByCode(courseSearch.trim().toUpperCase());
      if (res.success) setFoundCourse(res.data);
      else { setFoundCourse(null); setErr('Course not found. Ask the Lecturer to create it first.'); }
    } catch { setErr('Search failed'); }
    finally { setLoading(false); }
  };

  const handleLinkCourse = async () => {
    if (!foundCourse) return;
    if (linkedCourseIds.includes(foundCourse.id)) { setFoundCourse(null); setCourseSearch(''); return; }
    setLoading(true);
    try {
      const res = await api.linkCourseToCohort(cohortId, foundCourse.id);
      if (res.success) {
        setLinkedCourseIds([...linkedCourseIds, foundCourse.id]);
        setFoundCourse(null);
        setCourseSearch('');
      } else setErr(res.error || 'Failed to link course');
    } catch { setErr('Failed to link course'); }
    finally { setLoading(false); }
  };

  const handleRepFinish = async () => {
    await refreshUser?.();
    router.push('/dashboard');
  };

  // ─── Lecturer Step 2: Create Courses ───
  const addCourseRow = () => setCourses([...courses, { code: '', name: '', semester: '' }]);
  const updateCourse = (i: number, field: string, value: string) => {
    const updated = [...courses];
    updated[i] = { ...updated[i], [field]: value };
    setCourses(updated);
  };

  const handleLecturerFinish = async () => {
    const valid = courses.filter(c => c.code && c.name);
    if (valid.length === 0) return setErr('Please add at least one course');
    setLoading(true);
    try {
      await Promise.all(valid.map(c => api.createCourse(c)));
      await refreshUser?.();
      router.push('/dashboard');
    } catch { setErr('Failed to create courses'); }
    finally { setLoading(false); }
  };

  const totalSteps = profile.role === 'course_rep' ? 4 : profile.role === 'lecturer' ? 2 : profile.role === 'student' ? 2 : 1;

  // Student cohort filtering
  const filteredCohorts = allCohorts.filter((c: any) => {
    if (cohortFilter.faculty && !c.faculty.toLowerCase().includes(cohortFilter.faculty.toLowerCase())) return false;
    if (cohortFilter.department && !c.department.toLowerCase().includes(cohortFilter.department.toLowerCase())) return false;
    if (cohortFilter.level && c.level !== cohortFilter.level) return false;
    return true;
  });

  const handleStudentJoin = async () => {
    if (!selectedCohortId) return setErr('Please select a cohort to join');
    setLoading(true);
    try {
      const res = await api.joinCohort(selectedCohortId);
      if (!res.success) return setErr(res.error || 'Failed to join cohort');
      await refreshUser?.();
      router.push('/dashboard');
    } catch { setErr('Failed to join cohort'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round((step / totalSteps) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
            {error}
          </div>
        )}

        {/* ── Step 1: Profile & Role ── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Welcome, {user?.name}! 👋</h2>
              <p className="text-muted-foreground text-sm">Let's set up your profile to connect you with your institution.</p>
            </div>

            {/* Role cards */}
            <div>
              <Label className="mb-3 block">I am a...</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'student', label: 'Student', icon: GraduationCap, desc: 'View my attendance & grades' },
                  { value: 'course_rep', label: 'Course Rep', icon: Users, desc: 'Manage my cohort & track class' },
                  { value: 'lecturer', label: 'Lecturer', desc: 'Manage my courses & cohorts', icon: BookOpen },
                ].map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setProfile(p => ({ ...p, role: r.value }))}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                      profile.role === r.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <r.icon className={`h-6 w-6 ${profile.role === r.value ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-semibold">{r.label}</span>
                    <span className="text-xs text-muted-foreground">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="faculty">Faculty *</Label>
                <Input id="faculty" value={profile.faculty} onChange={e => setProfile(p => ({ ...p, faculty: e.target.value }))} placeholder="e.g. Faculty of Computing" />
              </div>
              <div>
                <Label htmlFor="department">Department *</Label>
                <Input id="department" value={profile.department} onChange={e => setProfile(p => ({ ...p, department: e.target.value }))} placeholder="e.g. Computer Science" />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="e.g. +234 800 000 0000" />
            </div>

            {profile.role === 'student' && (
              <div>
                <Label htmlFor="matricNumber">Matriculation Number *</Label>
                <Input id="matricNumber" value={profile.matricNumber} onChange={e => setProfile(p => ({ ...p, matricNumber: e.target.value }))} placeholder="e.g. 19/SCI01/045" />
                <p className="text-xs text-muted-foreground mt-1">This will automatically link your account to your Course Rep's records.</p>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={handleStep1} disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]">
                {loading ? 'Saving...' : 'Next'}
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* ── Student Step 2: Join a Cohort ── */}
        {step === 2 && profile.role === 'student' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Join Your Cohort</h2>
              <p className="text-muted-foreground text-sm">Find the cohort that matches your class year and programme. You'll be able to view all courses, trackers, and announcements for that cohort.</p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Filter by Faculty</Label>
                <Input
                  value={cohortFilter.faculty}
                  onChange={e => setCohortFilter(f => ({ ...f, faculty: e.target.value }))}
                  placeholder="e.g. Computing"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Filter by Department</Label>
                <Input
                  value={cohortFilter.department}
                  onChange={e => setCohortFilter(f => ({ ...f, department: e.target.value }))}
                  placeholder="e.g. Comp. Science"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Filter by Level</Label>
                <Select value={cohortFilter.level} onValueChange={v => setCohortFilter(f => ({ ...f, level: v === 'ALL' ? '' : v }))}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="All Levels" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Levels</SelectItem>
                    {LEVELS.map(l => <SelectItem key={l} value={l}>{LEVEL_LABELS[l]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Cohort list */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredCohorts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8 border rounded-xl border-dashed">
                  No cohorts found. Try adjusting your filters or ask your Course Rep to set up their cohort first.
                </p>
              ) : (
                filteredCohorts.map((c: any) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCohortId(c.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedCohortId === c.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-foreground">{c.program}</p>
                        <p className="text-sm text-muted-foreground">{LEVEL_LABELS[c.level]} • {c.department}</p>
                        <p className="text-xs text-muted-foreground mt-1">Rep: {c.courseRep?.name} • {c._count?.courses ?? 0} courses • {c._count?.students ?? 0} students</p>
                      </div>
                      {selectedCohortId === c.id && (
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">Selected</span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}><ArrowLeft className="mr-2" size={16} /> Back</Button>
              <Button onClick={handleStudentJoin} disabled={loading || !selectedCohortId}>
                {loading ? 'Joining...' : 'Join Cohort'} <Check className="ml-2" size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* ── Course Rep Step 2: Create Cohort ── */}
        {step === 2 && profile.role === 'course_rep' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Define Your Cohort</h2>
              <p className="text-muted-foreground text-sm">Your cohort identifies the specific group of students you represent.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Program / Course of Study *</Label>
                <Input value={cohort.program} onChange={e => setCohort(c => ({ ...c, program: e.target.value }))} placeholder="e.g. Cybersecurity, Software Engineering" />
              </div>
              <div>
                <Label>Level *</Label>
                <Select value={cohort.level} onValueChange={v => setCohort(c => ({ ...c, level: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LEVELS.map(l => <SelectItem key={l} value={l}>{LEVEL_LABELS[l]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Department</Label>
                <Input value={cohort.department || profile.department} onChange={e => setCohort(c => ({ ...c, department: e.target.value }))} placeholder="e.g. Computer Science" />
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}><ArrowLeft className="mr-2" size={16} /> Back</Button>
              <Button onClick={handleRepStep2} disabled={loading}>
                {loading ? 'Creating...' : 'Next: Add Students'} <ArrowRight className="ml-2" size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* ── Lecturer Step 2: Create Courses ── */}
        {step === 2 && profile.role === 'lecturer' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Add Your Courses</h2>
              <p className="text-muted-foreground text-sm">Add the courses you teach. Course Reps will search for these by code to link their cohorts.</p>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {courses.map((course, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 p-3 border rounded-lg">
                  <div>
                    <Label className="text-xs">Course Code *</Label>
                    <Input value={course.code} onChange={e => updateCourse(i, 'code', e.target.value)} placeholder="CYB401" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Course Name *</Label>
                    <Input value={course.name} onChange={e => updateCourse(i, 'name', e.target.value)} placeholder="Introduction to Cybersecurity" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Semester</Label>
                    <Input value={course.semester} onChange={e => updateCourse(i, 'semester', e.target.value)} placeholder="Fall 2024" className="mt-1" />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" onClick={addCourseRow} className="w-full">+ Add Another Course</Button>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}><ArrowLeft className="mr-2" size={16} /> Back</Button>
              <Button onClick={handleLecturerFinish} disabled={loading}>
                {loading ? 'Creating...' : 'Finish Setup'} <Check className="ml-2" size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* ── Course Rep Step 3: Add Students ── */}
        {step === 3 && profile.role === 'course_rep' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Add Your Students</h2>
              <p className="text-muted-foreground text-sm">Add students in your cohort. They'll link to their records using their matric number.</p>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {students.map((student, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input placeholder="Full Name" value={student.fullName} onChange={e => updateStudent(i, 'fullName', e.target.value)} />
                  <Input placeholder="Matric No." value={student.matricNumber} onChange={e => updateStudent(i, 'matricNumber', e.target.value)} className="w-40" />
                  <Select value={student.gender} onValueChange={v => updateStudent(i, 'gender', v)}>
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {students.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeStudentRow(i)} className="shrink-0 text-destructive hover:text-destructive">×</Button>
                  )}
                </div>
              ))}
            </div>
            <Button variant="outline" onClick={addStudentRow} className="w-full">+ Add Another Student</Button>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)}><ArrowLeft className="mr-2" size={16} /> Back</Button>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setStep(4)}>Skip for now</Button>
                <Button onClick={handleRepStep3} disabled={loading}>
                  {loading ? 'Saving...' : 'Next: Link Courses'} <ArrowRight className="ml-2" size={16} />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── Course Rep Step 4: Link Courses ── */}
        {step === 4 && profile.role === 'course_rep' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Link Your Courses</h2>
              <p className="text-muted-foreground text-sm">Search for courses by their code (e.g. CYB401). These must be created by Lecturers first.</p>
            </div>

            <div className="flex gap-2">
              <Input
                value={courseSearch}
                onChange={e => setCourseSearch(e.target.value)}
                placeholder="Enter course code, e.g. CYB401"
                onKeyDown={e => e.key === 'Enter' && handleSearchCourse()}
              />
              <Button variant="outline" onClick={handleSearchCourse} disabled={loading}>
                <Search size={16} className="mr-2" /> Search
              </Button>
            </div>

            {foundCourse && (
              <div className="p-4 border-2 border-primary/50 rounded-xl bg-primary/5 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{foundCourse.code}</p>
                  <p className="text-sm text-muted-foreground">{foundCourse.name} • Lecturer: {foundCourse.lecturer?.name}</p>
                </div>
                <Button size="sm" onClick={handleLinkCourse} disabled={loading}>
                  {linkedCourseIds.includes(foundCourse.id) ? '✓ Linked' : 'Link Course'}
                </Button>
              </div>
            )}

            {linkedCourseIds.length > 0 && (
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  ✓ {linkedCourseIds.length} course{linkedCourseIds.length > 1 ? 's' : ''} linked to your cohort
                </p>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(3)}><ArrowLeft className="mr-2" size={16} /> Back</Button>
              <Button onClick={handleRepFinish} disabled={loading}>
                {linkedCourseIds.length === 0 ? 'Skip for now' : 'Finish Setup'}
                <Check className="ml-2" size={16} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}