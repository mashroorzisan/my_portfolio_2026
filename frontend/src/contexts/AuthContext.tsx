import { createContext, useContext, useState, ReactNode } from 'react'
import { login as apiLogin } from '../api/client'

interface AuthCtx {
  token: string | null
  isAdmin: boolean
  signIn: (username: string, password: string) => Promise<void>
  signOut: () => void
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('admin_token')
  )

  const signIn = async (username: string, password: string) => {
    const data = await apiLogin({ username, password })
    localStorage.setItem('admin_token', data.access_token)
    setToken(data.access_token)
  }

  const signOut = () => {
    localStorage.removeItem('admin_token')
    setToken(null)
  }

  return (
    <Ctx.Provider value={{ token, isAdmin: !!token, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
