import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Abstract background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-card rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground">Register as a course representative</p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your.email@university.edu"
                className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="department" className="text-sm font-medium text-foreground">
                Department
              </label>
              <input
                id="department"
                type="text"
                placeholder="Computer Science"
                className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-foreground">
                I agree to the{" "}
                <Link href="#" className="text-primary hover:underline">
                  Terms and Conditions
                </Link>
              </label>
            </div>

            <div>
              <Link
                href="/dashboard"
                className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-lg flex items-center justify-center hover:bg-primary/90 transition"
              >
                Create Account
              </Link>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
