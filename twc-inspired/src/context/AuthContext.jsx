import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiFetch, getApiBase, getStoredToken, setStoredToken } from '../lib/api'
import { DEMO_SESSION_KEY, isDemoMode } from '../config/demoMode'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, setPersistence, browserLocalPersistence, browserSessionPersistence, updateProfile } from 'firebase/auth'

// Use the initialized auth from our local config
import { auth } from '../config/firebase'

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
    }
  }, [])

  useEffect(() => {
    if (isDemoMode()) {
      refreshUser()
      return
    }
    
    // Listen for Firebase Auth state changes
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken()
          setStoredToken(token)
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
          })
        } else {
          setStoredToken('')
          setUser(null)
        }
        setLoading(false)
      })
      return () => unsubscribe()
    })
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
    // Firebase login
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence)
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const token = await userCredential.user.getIdToken()
    setStoredToken(token)
    const u = { id: userCredential.user.uid, email: userCredential.user.email, name: userCredential.user.displayName }
    setUser(u)
    return { data: { user: u, token } }
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
    
    // Firebase register
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    const displayName = `${firstName} ${lastName}`.trim()
    if (displayName) {
      await updateProfile(userCredential.user, { displayName })
    }
    // Note: Firebase standard auth doesn't have a direct 'phone' field without Phone Auth integration,
    // so we handle what we can on the profile. In a real app we'd save phone to Firestore.

    const token = await userCredential.user.getIdToken()
    setStoredToken(token)
    const u = { id: userCredential.user.uid, email: userCredential.user.email, name: displayName || userCredential.user.displayName }
    setUser(u)
    return { data: { user: u, token } }
  }, [])

  const logout = useCallback(() => {
    if (isDemoMode()) {
      localStorage.removeItem(DEMO_SESSION_KEY)
      setUser(null)
      return
    }
    setStoredToken('')
    setUser(null)
  }, [])

  const resetPassword = useCallback(async (email) => {
    if (isDemoMode()) {
      throw new Error('Password reset is not available in demo mode.')
    }
    await sendPasswordResetEmail(auth, email)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      refreshUser,
      login,
      register,
      logout,
      resetPassword,
    }),
    [user, loading, refreshUser, login, register, logout, resetPassword]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
