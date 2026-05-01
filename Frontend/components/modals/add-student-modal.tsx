"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface AddStudentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (student: any) => void
  cohorts: any[]
}

const levels = [
  { value: "LEVEL_100", label: "100" },
  { value: "LEVEL_200", label: "200" },
  { value: "LEVEL_300", label: "300" },
  { value: "LEVEL_400", label: "400" },
  { value: "LEVEL_500", label: "500" },
]

export function AddStudentModal({ isOpen, onClose, onSubmit, cohorts }: AddStudentModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    matricNumber: "",
    cohortId: "",
    gender: "MALE",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      fullName: "",
      matricNumber: "",
      cohortId: "",
      gender: "MALE",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="matricNumber">Matric Number</Label>
            <Input
              id="matricNumber"
              value={formData.matricNumber}
              onChange={(e) => setFormData({ ...formData, matricNumber: e.target.value })}
              placeholder="CSC/2021/001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cohort">Cohort</Label>
            <Select
              value={formData.cohortId}
              onValueChange={(value) => setFormData({ ...formData, cohortId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cohort" />
              </SelectTrigger>
              <SelectContent>
                {cohorts.map((cohort) => (
                  <SelectItem key={cohort.id} value={cohort.id}>
                    {cohort.program} ({cohort.level.replace('LEVEL_', '')} Level)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value })}
              className="flex space-x-4"
              required
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="MALE" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="FEMALE" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Student</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}