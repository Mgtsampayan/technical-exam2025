"use client"

import type React from "react"
import { createContext, useState, useContext } from "react"

interface User {
  username: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => void
  logout: () => void
  signup: (username: string, password: string) => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [users, setUsers] = useState<User[]>([{ username: "user", password: "password" }])
  const [error, setError] = useState<string | null>(null)

  const login = (username: string, password: string) => {
    const user = users.find(u => u.username === username && u.password === password)
    if (user) {
      setIsAuthenticated(true)
      setError(null)
    } else {
      setError("Invalid credentials")
    }
  }

  const signup = (username: string, password: string) => {
    if (users.some(u => u.username === username)) {
      setError("Username already exists")
      return
    }
    setUsers([...users, { username, password }])
    setError("Registration successful! Please login.")
  }

  const logout = () => {
    setIsAuthenticated(false)
    setError(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, signup, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

