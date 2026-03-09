'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';

interface StudentRow {
  id: string;
  fullName: string;
  matricNumber: string;
  level: 'LEVEL_100' | 'LEVEL_200' | 'LEVEL_300' | 'LEVEL_400' | 'LEVEL_500';
  gender: 'MALE' | 'FEMALE';
}

interface OnboardingModalProps {
  onComplete: () => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [students, setStudents] = useState<StudentRow[]>([
    { id: '1', fullName: '', matricNumber: '', level: 'LEVEL_100', gender: 'MALE' }
  ]);
  const [loading, setLoading] = useState(false);

  const addRow = () => {
    setStudents([...students, { 
      id: Date.now().toString(), 
      fullName: '', 
      matricNumber: '', 
      level: 'LEVEL_100', 
      gender: 'MALE' 
    }]);
  };

  const removeRow = (id: string) => {
    if (students.length > 1) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const updateRow = (id: string, field: keyof StudentRow, value: any) => {
    setStudents(students.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Create all students
      await Promise.all(
        students
          .filter(s => s.fullName && s.matricNumber) // Only submit filled rows
          .map(s => api.createStudent({
            fullName: s.fullName,
            matricNumber: s.matricNumber,
            level: s.level,
            gender: s.gender
          }))
      );
      onComplete();
    } catch (error) {
      alert('Failed to add students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Welcome! Add Your Students</h2>
          <p className="text-muted-foreground mt-1">Add students to your class to start tracking</p>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 text-sm font-semibold text-foreground">Full Name</th>
                  <th className="text-left p-2 text-sm font-semibold text-foreground">Matric Number</th>
                  <th className="text-left p-2 text-sm font-semibold text-foreground">Level</th>
                  <th className="text-left p-2 text-sm font-semibold text-foreground">Gender</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-border">
                    <td className="p-2">
                      <input
                        type="text"
                        value={student.fullName}
                        onChange={(e) => updateRow(student.id, 'fullName', e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={student.matricNumber}
                        onChange={(e) => updateRow(student.id, 'matricNumber', e.target.value)}
                        placeholder="CSC/2021/001"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={student.level}
                        onChange={(e) => updateRow(student.id, 'level', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                      >
                        <option value="LEVEL_100">100</option>
                        <option value="LEVEL_200">200</option>
                        <option value="LEVEL_300">300</option>
                        <option value="LEVEL_400">400</option>
                        <option value="LEVEL_500">500</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        value={student.gender}
                        onChange={(e) => updateRow(student.id, 'gender', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => removeRow(student.id)}
                        disabled={students.length === 1}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={addRow}
            className="mt-4 flex items-center gap-2 text-primary hover:underline"
          >
            <Plus size={16} />
            Add Another Student
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex justify-end gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading || students.every(s => !s.fullName || !s.matricNumber)}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Students'}
          </button>
        </div>
      </div>
    </div>
  );
}