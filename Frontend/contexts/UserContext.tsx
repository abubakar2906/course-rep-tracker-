"use client"

import * as React from "react"
import { defaultUser, type User } from "@/types/user"

interface UserContextType {
  user: User
  updateUser: (userData: User) => void
}

const UserContext = React.createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User>(defaultUser)

  const updateUser = React.useCallback((userData: User) => {
    setUser(userData)
  }, [])

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

