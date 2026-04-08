import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'tobin_ekh_cart'

function loadCart() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      raw = localStorage.getItem('vitawell_cart')
      if (raw) {
        localStorage.setItem(STORAGE_KEY, raw)
        localStorage.removeItem('vitawell_cart')
      }
    }
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveCart(lines) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(loadCart)

  const persist = useCallback((next) => {
    setLines(next)
    saveCart(next)
  }, [])

  const addItem = useCallback(
    (item, quantity = 1) => {
      const qty = Math.max(1, Math.min(99, Number(quantity) || 1))
      setLines((prev) => {
        const i = prev.findIndex((l) => l.id === item.id)
        let next
        if (i >= 0) {
          next = [...prev]
          const merged = Math.min(99, next[i].quantity + qty)
          next[i] = { ...next[i], quantity: merged }
        } else {
          next = [...prev, { ...item, quantity: qty }]
        }
        saveCart(next)
        return next
      })
    },
    []
  )

  const setQuantity = useCallback((id, quantity) => {
    const qty = Math.max(1, Math.min(99, Number(quantity) || 1))
    setLines((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, quantity: qty } : l))
      saveCart(next)
      return next
    })
  }, [])

  const removeLine = useCallback((id) => {
    setLines((prev) => {
      const next = prev.filter((l) => l.id !== id)
      saveCart(next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    persist([])
  }, [persist])

  const total = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [lines]
  )

  const count = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines])

  const value = useMemo(
    () => ({
      lines,
      addItem,
      setQuantity,
      removeLine,
      clear,
      total,
      count,
    }),
    [lines, addItem, setQuantity, removeLine, clear, total, count]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
