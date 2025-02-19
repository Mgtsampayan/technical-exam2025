"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"

interface User {
  username: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean
  currentUser: string | null
  login: (username: string, password: string) => void
  logout: () => void
  signup: (username: string, password: string) => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true'
  })
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('currentUser')
  })
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users')
    return savedUsers ? JSON.parse(savedUsers) : [{ username: "user", password: "password" }]
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString())
  }, [isAuthenticated])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', currentUser)
    } else {
      localStorage.removeItem('currentUser')
    }
  }, [currentUser])

  const login = (username: string, password: string) => {
    const user = users.find(u => u.username === username && u.password === password)
    if (user) {
      setIsAuthenticated(true)
      setCurrentUser(username)
      setError(null)
    } else {
      setError("Invalid credentials")
    }
  }

  const signup = (username: string, password: string) => {
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (users.some(u => u.username === username)) {
      setError("Username already exists")
      return
    }

    setUsers([...users, { username, password }])
    setError("Registration successful! Please login.")
  }

  const logout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setError(null)
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      currentUser, 
      login, 
      logout, 
      signup, 
      error 
    }}>
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

