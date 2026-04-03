import { useState } from 'react'
import { Toaster } from 'sonner'
import { AppProvider } from './context/AppContext'
import { Sidebar } from './components/layout/Sidebar'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Insights from './pages/Insights'
import Settings from './pages/Settings'

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'transactions':
        return <Transactions />
      case 'insights':
        return <Insights />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8">
       <div className="max-w-7xl mx-auto animate-fade-in rounded-xl bg-card/60 backdrop-blur-md shadow-lg p-4 lg:p-6 border border-border">
       
          {renderPage()}
        </div>
      </main>
      <Toaster 
  position="bottom-right"
  richColors
  closeButton
        toastOptions={{
          style: {
            background: 'var(--card)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
        }}
      />
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
