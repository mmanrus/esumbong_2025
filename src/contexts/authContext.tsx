"use client"

import { createContext,ReactNode, useContext, useState, useEffect } from "react"

export type User = {
  id: string
  fullname: string
  email: string
  type: string
}

type AuthContextType = {
  user: User | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

type AuthProviderProps = {
  children: ReactNode,
  initialUser: User | null
}

export function AuthProvider({ children, initialUser } :AuthProviderProps ) {
  const [user, setUser] = useState(initialUser)
  if (!user) {
    const getUser = async () => await fetch('/api/me', {

    })
  }

  console.log("User log from authcontext:", user)
  return (
    <AuthContext.Provider value={{  user }}>
      {children}
    </AuthContext.Provider>
  )
}
