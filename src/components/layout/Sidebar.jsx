import { useState } from 'react'
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Wallet
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ currentPage, setCurrentPage }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavClick = (id) => {
    setCurrentPage(id)
    setMobileOpen(false)
  }

  return (
    <>
      {/* MOBILE BUTTON */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">

          {/* LOGO */}
          <div
            className={cn(
              'flex items-center h-16 px-4 border-b border-sidebar-border',
              collapsed ? 'justify-center' : 'gap-3'
            )}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
              <Wallet className="h-5 w-5 text-primary" />
            </div>

            {!collapsed && (
              <span className="font-semibold text-lg tracking-tight">
                Finance Pulse
              </span>
            )}
          </div>

          {/* NAV */}
          <nav className="flex-1 py-6 px-3">
            <ul className="space-y-1">

              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = currentPage === item.id

                return (
                  <li key={item.id}>

                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={cn(
                        'relative flex items-center w-full rounded-lg transition-all duration-200',
                        collapsed ? 'justify-center py-3' : 'gap-3 px-4 py-3',

                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                      )}
                    >

                      {/* ACTIVE INDICATOR BAR */}
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-primary" />
                      )}

                      <Icon className="h-5 w-5 flex-shrink-0" />

                      {!collapsed && (
                        <span className="text-sm">{item.label}</span>
                      )}

                    </button>

                  </li>
                )
              })}

            </ul>
          </nav>

          {/* COLLAPSE */}
          <div className="p-3 border-t border-sidebar-border hidden lg:block">

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'w-full text-muted-foreground hover:text-foreground',
                collapsed ? 'justify-center' : 'justify-start'
              )}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="ml-2">Collapse</span>
                </>
              )}
            </Button>

          </div>

        </div>
      </aside>

      {/* SPACER */}
      <div
        className={cn(
          'hidden lg:block transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      />
    </>
  )
}