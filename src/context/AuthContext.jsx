import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiFetch, getApiBase, getStoredToken, setStoredToken } from '../lib/api'
import { DEMO_SESSION_KEY, isDemoMode } from '../config/demoMode'
import { authClient } from '../lib/auth'

const AuthContext = createContext(null)

function readDemoUser() {
  if (!isDemoMode()) return null
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY)
    if (!raw) return null
    const { email } = JSON.parse(raw)
    if (!email || typeof email !== 'string') return null
    return { id: 'demo-user', email, name: 'Demo shopper' }
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readDemoUser())
  const [loading, setLoading] = useState(() => {
    if (isDemoMode()) return false
    return !!(getStoredToken() && getApiBase())
  })

  const refreshUser = useCallback(async () => {
    if (isDemoMode()) {
      setUser(readDemoUser())
      setLoading(false)
      return
    }

    // Try Neon Auth first
    try {
      const { data } = await authClient.getSession()
      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name || data.user.email,
          role: data.user.role || 'user',
          isSubscriber: data.user.isSubscriber || false,
        })
        setLoading(false)
        return
      }
    } catch (err) {
      console.warn('Neon Auth session check failed, falling back to legacy API:', err)
    }

    const token = getStoredToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const res = await apiFetch('/api/users/me')
      if (res.success && res.data) {
        setUser({
          id: res.data.id,
          email: res.data.email,
          name: res.data.profile?.firstName
            ? `${res.data.profile.firstName} ${res.data.profile.lastName || ''}`.trim()
            : res.data.email,
          role: res.data.role,
          isSubscriber: res.data.isSubscriber || false,
        })
      } else {
        setStoredToken('')
        setUser(null)
      }
    } catch (err) {
      console.error('Failed to restore session:', err)
      setStoredToken('')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = useCallback(async (email, password, rememberMe = true) => {
    if (isDemoMode()) {
      const e = String(email || '').trim()
      if (!e) throw new Error('Email is required.')
      if (!password || String(password).length < 4) {
        throw new Error('Use at least 4 characters for the demo password.')
      }
      const u = { id: 'demo-user', email: e, name: 'Demo shopper' }
      if (rememberMe) {
        localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ email: e }))
      } else {
        sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ email: e }))
      }
      setUser(u)
      return { data: { user: u, token: 'demo' } }
    }
    
    // Try Neon Auth Login
    try {
      const result = await authClient.signIn.email({ email, password })
      if (result.data?.user) {
        const u = {
          id: result.data.user.id,
          email: result.data.user.email,
          name: result.data.user.name || result.data.user.email,
          role: result.data.user.role || 'user',
          isSubscriber: result.data.user.isSubscriber || false,
        }
        setUser(u)
        return { data: { user: u } }
      }
    } catch (err) {
      console.warn('Neon Auth login failed, falling back to legacy API:', err)
    }

    // Fallback to Legacy API Login
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    if (res.success && res.data) {
      setStoredToken(res.data.token)
      const u = {
        id: res.data.user.id,
        email: res.data.user.email,
        name: res.data.user.profile?.firstName
          ? `${res.data.user.profile.firstName} ${res.data.user.profile.lastName || ''}`.trim()
          : res.data.user.email,
        role: res.data.user.role,
        isSubscriber: res.data.isSubscriber || false,
      }
      setUser(u)
      return { data: { user: u, token: res.data.token } }
    }
    
    throw new Error(res.message || 'Login failed. Please check your credentials.')
  }, [])

  const register = useCallback(async ({ email, password, firstName, lastName, phone, rememberMe = true }) => {
    if (isDemoMode()) {
      const e = String(email || '').trim()
      if (!e) throw new Error('Email is required.')
      if (!password || String(password).length < 8) {
        throw new Error('Password must be at least 8 characters.')
      }
      const u = { id: 'demo-user', email: e, name: `${firstName} ${lastName}`.trim() || 'Demo shopper' }
      if (rememberMe) {
        localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ email: e }))
      } else {
        sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ email: e }))
      }
      setUser(u)
      return { data: { user: u, token: 'demo' } }
    }
    
    // Try Neon Auth Register
    let neonAuthResult = null
    try {
      neonAuthResult = await authClient.signUp.email({ 
        email, 
        password, 
        name: `${firstName || ''} ${lastName || ''}`.trim() || email 
      })

      if (neonAuthResult.data?.user) {
        const u = {
          id: neonAuthResult.data.user.id,
          email: neonAuthResult.data.user.email,
          name: neonAuthResult.data.user.name || neonAuthResult.data.user.email,
          role: neonAuthResult.data.user.role || 'user',
          isSubscriber: false,
        }
        setUser(u)
        return { data: { user: u } }
      }
    } catch (err) {
      console.warn('Neon Auth registration failed, trying legacy API:', err)
    }

    // Fallback to Legacy API Register
    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, firstName, lastName, phone }),
      })

      if (res.success && res.data) {
        setStoredToken(res.data.token)
        const u = {
          id: res.data.user.id,
          email: res.data.user.email,
          name: `${firstName || ''} ${lastName || ''}`.trim() || res.data.user.email,
          role: res.data.user.role,
          isSubscriber: res.data.isSubscriber || false,
        }
        setUser(u)
        return { data: { user: u, token: res.data.token } }
      }
    } catch (err) {
      // If legacy fails, we throw the legacy error message
      throw err
    }

    // If we reach here, both failed but didn't throw
    throw new Error(neonAuthResult?.error?.message || 'Registration failed')
  }, [])

  const logout = useCallback(async () => {
    if (isDemoMode()) {
      localStorage.removeItem(DEMO_SESSION_KEY)
      sessionStorage.removeItem(DEMO_SESSION_KEY)
      setUser(null)
      return
    }
    await authClient.signOut().catch(() => {})
    setStoredToken('')
    setUser(null)
  }, [])

  const resetPassword = useCallback(async (email) => {
    // Neon Auth supports password reset
    const result = await authClient.forgetPassword({ 
      email, 
      redirectTo: window.location.origin + '/reset-password' 
    })
    if (result.error) throw new Error(result.error.message)
    return result
  }, [])

  const completeResetPassword = useCallback(async (newPassword) => {
    const result = await authClient.resetPassword({ newPassword })
    if (result.error) throw new Error(result.error.message)
    return result
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin' || user?.email === 'gideonogunu@gmail.com' || (isDemoMode() && user?.email === 'admin@example.com'),
      isSubscriber: !!user?.isSubscriber,
      refreshUser,
      login,
      register,
      logout,
      resetPassword,
      completeResetPassword,
    }),
    [user, loading, refreshUser, login, register, logout, resetPassword, completeResetPassword]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
