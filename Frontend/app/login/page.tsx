'use client';

import Link from "next/link"
import { Chrome } from "lucide-react"

export default function LoginPage() {
const handleGoogleLogin = () => {
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
};

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
            <p className="text-muted-foreground">Sign in with your university account</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-3 border border-gray-300 transition"
            >
              <Chrome className="h-5 w-5" />
              Continue with Google
            </button>

            <div className="text-center text-sm text-muted-foreground">
              Sign in with your university Gmail account
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}