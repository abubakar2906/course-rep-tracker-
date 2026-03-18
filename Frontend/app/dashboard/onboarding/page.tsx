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
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Profile (optional)
  const [profile, setProfile] = useState({
    department: '',
    role: '',
    phone: '',
  });

  // Step 2: Students
  const [students, setStudents] = useState([
    { fullName: '', matricNumber: '', level: 'LEVEL_100', gender: 'MALE' }
  ]);

  // Step 3: Course
  const [course, setCourse] = useState({
    code: '',
    name: '',
    semester: '',
  });

  const addStudentRow = () => {
    setStudents([...students, { fullName: '', matricNumber: '', level: 'LEVEL_100', gender: 'MALE' }]);
  };

  const removeStudentRow = (index: number) => {
    if (students.length > 1) {
      setStudents(students.filter((_, i) => i !== index));
    }
  };

  const updateStudent = (index: number, field: string, value: string) => {
    const updated = [...students];
    updated[index] = { ...updated[index], [field]: value };
    setStudents(updated);
  };

  const handleStep1Next = () => {
    setStep(2);
  };

  const handleStep2Next = async () => {
    // Validate at least one student
    const validStudents = students.filter(s => s.fullName && s.matricNumber);
    if (validStudents.length === 0) {
      alert('Please add at least one student');
      return;
    }

    setLoading(true);
    try {
      // Create students
      await Promise.all(
        validStudents.map(student => api.createStudent(student))
      );
      setStep(3);
    } catch (error) {
      alert('Failed to create students');
    } finally {
      setLoading(false);
    }
  };

  const handleStep3Complete = async () => {
    if (!course.code || !course.name) {
      alert('Please fill in course code and name');
      return;
    }

    setLoading(true);
    try {
      await api.createCourse(course);
      router.push('/dashboard');
    } catch (error) {
      alert('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {step} of 3</span>
            <span className="text-sm text-muted-foreground">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Profile */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome, {user?.name}! 👋</h2>
              <p className="text-muted-foreground">
                Let's set up your profile (optional - you can skip this)
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={profile.department}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  placeholder="e.g. Computer Science"
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  placeholder="e.g. Course Representative"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="e.g. +234 800 000 0000"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={handleSkip}>
                Skip
              </Button>
              <Button onClick={handleStep1Next} className="bg-yellow-300 text-gray-800 hover:bg-yellow-400">
                Next
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Students */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Add Your Students</h2>
              <p className="text-muted-foreground">
                Add students you'll be tracking. You can add more later.
              </p>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {students.map((student, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Input
                    placeholder="Full Name"
                    value={student.fullName}
                    onChange={(e) => updateStudent(index, 'fullName', e.target.value)}
                  />
                  <Input
                    placeholder="Matric Number"
                    value={student.matricNumber}
                    onChange={(e) => updateStudent(index, 'matricNumber', e.target.value)}
                  />
                  <Select
                    value={student.level}
                    onValueChange={(value) => updateStudent(index, 'level', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LEVEL_100">100</SelectItem>
                      <SelectItem value="LEVEL_200">200</SelectItem>
                      <SelectItem value="LEVEL_300">300</SelectItem>
                      <SelectItem value="LEVEL_400">400</SelectItem>
                      <SelectItem value="LEVEL_500">500</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={student.gender}
                    onValueChange={(value) => updateStudent(index, 'gender', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {students.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStudentRow(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={addStudentRow} className="w-full">
              + Add Another Student
            </Button>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2" size={16} />
                Back
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleSkip}>
                  Skip
                </Button>
                <Button
                  onClick={handleStep2Next}
                  disabled={loading}
                  className="bg-yellow-300 text-gray-800 hover:bg-yellow-400"
                >
                  {loading ? 'Saving...' : 'Next'}
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Course */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Create Your First Course</h2>
              <p className="text-muted-foreground">
                Create a course to start tracking attendance and assignments.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="code">Course Code *</Label>
                <Input
                  id="code"
                  value={course.code}
                  onChange={(e) => setCourse({ ...course, code: e.target.value })}
                  placeholder="e.g. CSC 101"
                />
              </div>

              <div>
                <Label htmlFor="name">Course Name *</Label>
                <Input
                  id="name"
                  value={course.name}
                  onChange={(e) => setCourse({ ...course, name: e.target.value })}
                  placeholder="e.g. Introduction to Computer Science"
                />
              </div>

              <div>
                <Label htmlFor="semester">Semester (Optional)</Label>
                <Input
                  id="semester"
                  value={course.semester}
                  onChange={(e) => setCourse({ ...course, semester: e.target.value })}
                  placeholder="e.g. Fall 2024"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-2" size={16} />
                Back
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                  Skip
                </Button>
                <Button
                  onClick={handleStep3Complete}
                  disabled={loading}
                  className="bg-yellow-300 text-gray-800 hover:bg-yellow-400"
                >
                  {loading ? 'Creating...' : 'Complete'}
                  <Check className="ml-2" size={16} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}