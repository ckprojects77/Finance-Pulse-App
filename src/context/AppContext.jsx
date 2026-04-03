import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { defaultTransactions, generateDemoTransactions } from '../data/demoData'
import { generateId } from '../lib/utils'

const AppContext = createContext(null)

const STORAGE_KEYS = {
  TRANSACTIONS: 'finance_transactions',
  THEME: 'finance_theme',
  ROLE: 'finance_role',
}

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)
    return stored ? JSON.parse(stored) : defaultTransactions
  })
  
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME)
    return stored || 'dark'
  })
  
  const [role, setRole] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ROLE)
    return stored || 'admin'
  })
  
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date',
    sortOrder: 'desc',
  })

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role)
  }, [role])

  // Transaction operations
  const addTransaction = useCallback((transaction) => {
    const newTransaction = {
      ...transaction,
      id: generateId(),
    }
    setTransactions(prev => [newTransaction, ...prev])
  }, [])

  const updateTransaction = useCallback((id, updates) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    )
  }, [])

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }, [])

  const clearAllTransactions = useCallback(() => {
    setTransactions([])
  }, [])

  const resetDemoData = useCallback(() => {
    setTransactions(generateDemoTransactions())
  }, [])

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    let result = [...transactions]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        t =>
          t.description.toLowerCase().includes(searchLower) ||
          t.category.toLowerCase().includes(searchLower)
      )
    }

    // Type filter
    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type)
    }

    // Category filter
    if (filters.category !== 'all') {
      result = result.filter(t => t.category === filters.category)
    }

    // Date filters
    if (filters.dateFrom) {
      result = result.filter(t => t.date >= filters.dateFrom)
    }
    if (filters.dateTo) {
      result = result.filter(t => t.date <= filters.dateTo)
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0
      if (filters.sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date)
      } else if (filters.sortBy === 'amount') {
        comparison = a.amount - b.amount
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison
    })

    return result
  }, [transactions, filters])

  // Statistics
  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    const balance = income - expenses

    // Calculate percentage changes (mock for demo)
    const balanceChange = 12.5
    const incomeChange = 8.2
    const expenseChange = -3.4

    return {
      balance,
      income,
      expenses,
      balanceChange,
      incomeChange,
      expenseChange,
    }
  }, [transactions])

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const breakdown = {}
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        breakdown[t.category] = (breakdown[t.category] || 0) + t.amount
      })
    return Object.entries(breakdown)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  // Balance trend (last 7 days)
  const balanceTrend = useMemo(() => {
    const days = 7
    const trend = []
    const now = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayTransactions = transactions.filter(t => t.date <= dateStr)
      const income = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      const expenses = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      trend.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        balance: income - expenses,
      })
    }

    return trend
  }, [transactions])

  const isAdmin = role === 'admin'

  const value = {
    // State
    transactions,
    filteredTransactions,
    theme,
    role,
    isAdmin,
    filters,
    stats,
    categoryBreakdown,
    balanceTrend,
    
    // Actions
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAllTransactions,
    resetDemoData,
    setTheme,
    setRole,
    setFilters,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
