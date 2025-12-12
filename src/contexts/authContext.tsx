"use client"

import React from "react"
import { createContext, useContext, useState, useEffect } from "react"


const AuthContext = createContext(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
export function AuthProvider({ children, initialUser }) {
  const [user, setUser] = useState(initialUser)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include", headers: {
          "Content-Type": "application/json"
        } })
        if (!res.ok) {
          setUser(null)
        } else {
          const data = await res.json()
          console.log("AuthContext:",data)
          setUser(data)
        }
      } catch (error) {
        console.error("Error getting User data:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}