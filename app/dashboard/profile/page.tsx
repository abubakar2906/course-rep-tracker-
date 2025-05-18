import { Mail, Phone, MapPin, Edit, User } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Profile</h1>

      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        <div className="bg-accent h-32 relative">
          <button className="absolute top-4 right-4 p-2 bg-secondary rounded-full shadow-sm">
            <Edit size={16} className="text-foreground" />
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col items-center -mt-16">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-card bg-card mb-4 flex items-center justify-center">
              <User size={64} className="text-foreground" />
            </div>

            <h2 className="text-2xl font-bold">Sarah Johnson</h2>
            <p className="text-muted-foreground">Course Representative</p>
            <p className="text-sm text-muted-foreground mt-1">Computer Science Department</p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center">
              <div className="p-2 bg-accent rounded-full mr-3">
                <Mail size={18} className="text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">sarah.johnson@university.edu</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="p-2 bg-accent rounded-full mr-3">
                <Phone size={18} className="text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="p-2 bg-accent rounded-full mr-3">
                <MapPin size={18} className="text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">Computer Science, Building C, Room 305</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-medium mb-2">About</h3>
            <p className="text-muted-foreground">
              Course Representative for Computer Science Department, responsible for tracking student attendance, fee
              collection, and addressing student complaints. Working to improve communication between students and
              faculty.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
