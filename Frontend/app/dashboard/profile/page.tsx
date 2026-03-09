"use client"

import * as React from "react"
import { Mail, Phone, MapPin, User, Edit2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [isEditing, setIsEditing] = React.useState(false)

  const [editedData, setEditedData] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    role: user?.role || '',
    office: user?.office || '',
    about: user?.about || '',
  })

  React.useEffect(() => {
    if (user) {
      setEditedData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        role: user.role || '',
        office: user.office || '',
        about: user.about || '',
      })
    }
  }, [user])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (user) {
      setEditedData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        role: user.role || '',
        office: user.office || '',
        about: user.about || '',
      })
    }
  }

  const handleSave = () => {
    // TODO: Implement API call to update user profile
    setIsEditing(false)
    alert("Profile updated! (API integration coming soon)")
  }

  const handleChange = (field: string, value: string) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Not logged in</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Profile</h1>
        {!isEditing ? (
          <Button onClick={handleEdit} variant="outline" size="sm">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        <div className="bg-accent h-32 relative" />

        <div className="px-6 pb-6">
          <div className="flex flex-col items-center -mt-16">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-card bg-card mb-4 flex items-center justify-center">
              <User size={64} className="text-foreground" />
            </div>

            {isEditing ? (
              <div className="w-full max-w-md space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editedData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={editedData.department}
                    onChange={(e) => handleChange("department", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={editedData.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.role}</p>
                <p className="text-sm text-muted-foreground mt-1">{user.department} Department</p>
              </>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center">
              <div className="p-2 bg-accent rounded-full mr-3">
                <Mail size={18} className="text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="p-2 bg-accent rounded-full mr-3">
                <Phone size={18} className="text-foreground" />
              </div>
              {isEditing ? (
                <div className="flex-1">
                  <Label htmlFor="phone" className="text-sm text-muted-foreground">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={editedData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="mt-1"
                  />
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{user.phone || 'Not set'}</p>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <div className="p-2 bg-accent rounded-full mr-3">
                <MapPin size={18} className="text-foreground" />
              </div>
              {isEditing ? (
                <div className="flex-1">
                  <Label htmlFor="office" className="text-sm text-muted-foreground">Office</Label>
                  <Input
                    id="office"
                    value={editedData.office}
                    onChange={(e) => handleChange("office", e.target.value)}
                    className="mt-1"
                  />
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground">Office</p>
                  <p className="font-medium">{user.office || 'Not set'}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-medium mb-2">About</h3>
            {isEditing ? (
              <Textarea
                id="about"
                value={editedData.about}
                onChange={(e) => handleChange("about", e.target.value)}
                rows={4}
                className="resize-none"
              />
            ) : (
              <p className="text-muted-foreground">{user.about || 'No description yet.'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}