import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
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
            <h1 className="text-2xl font-bold text-foreground mb-2">Course Rep Tracker</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          {/* Coming Soon Banner */}
          <div className="mb-6 p-3 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-800 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Coming Soon</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Authentication is not yet implemented. Click below to access the dashboard for demo purposes.
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your.email@university.edu"
                disabled
                className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-muted-foreground cursor-not-allowed opacity-60"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Link href="#" className="text-sm text-primary hover:underline pointer-events-none opacity-50">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                disabled
                className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-muted-foreground cursor-not-allowed opacity-60"
              />
            </div>

            <div>
              <Link
                href="/dashboard"
                className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-lg flex items-center justify-center hover:bg-primary/90 transition"
              >
                Continue to Dashboard (Demo)
              </Link>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
