import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Moon,
  Sun,
  User,
  Shield,
  Trash2,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Switch } from '../components/ui/switch'
import { Label } from '../components/ui/label'
import { Skeleton } from '../components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog'
import { useApp } from '../context/AppContext'
import { cn } from '../lib/utils'

function SettingsSection({ title, description, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default function Settings() {
  const {
    theme,
    setTheme,
    role,
    setRole,
    clearAllTransactions,
    resetDemoData,
    transactions,
  } = useApp()

  const [loading, setLoading] = useState(true)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    toast.success(`Theme changed to ${newTheme} mode`)
  }

  const handleRoleToggle = () => {
    const newRole = role === 'admin' ? 'viewer' : 'admin'
    setRole(newRole)
    toast.success(`Role changed to ${newRole}`)
  }

  const handleClearTransactions = () => {
    clearAllTransactions()
    setClearDialogOpen(false)
    toast.success('All transactions cleared')
  }

  const handleResetData = () => {
    resetDemoData()
    setResetDialogOpen(false)
    toast.success('Demo data has been reset')
  }

  if (loading) {
    return <SettingsSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your preferences and application settings
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-6">
        {/* Role Settings */}
        <SettingsSection
          title="User Role"
          description="Switch between admin and viewer modes to test different permissions"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-4">
                <div className={cn(
                  'p-3 rounded-xl',
                  role === 'admin' 
                    ? 'bg-primary/10 text-primary' 
                    : 'bg-muted text-muted-foreground'
                )}>
                  {role === 'admin' ? (
                    <Shield className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Current Role: <span className="capitalize">{role}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {role === 'admin'
                      ? 'Full access to add, edit, and delete transactions'
                      : 'View-only access to transactions and insights'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="role-switch" className="text-sm text-muted-foreground">
                  Viewer
                </Label>
                <Switch
                  id="role-switch"
                  checked={role === 'admin'}
                  onCheckedChange={handleRoleToggle}
                />
                <Label htmlFor="role-switch" className="text-sm text-muted-foreground">
                  Admin
                </Label>
              </div>
            </div>

            {/* Role capabilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={cn(
                'p-4 rounded-lg border',
                role === 'admin' 
                  ? 'border-primary/20 bg-primary/5' 
                  : 'border-border bg-muted/30'
              )}>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Admin Capabilities</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Add new transactions</li>
                  <li>• Edit existing transactions</li>
                  <li>• Delete transactions</li>
                  <li>• View all data and insights</li>
                </ul>
              </div>
              <div className={cn(
                'p-4 rounded-lg border',
                role === 'viewer' 
                  ? 'border-primary/20 bg-primary/5' 
                  : 'border-border bg-muted/30'
              )}>
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">Viewer Capabilities</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• View all transactions</li>
                  <li>• View dashboard and charts</li>
                  <li>• View insights and recommendations</li>
                  <li>• Filter and search data</li>
                </ul>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Theme Settings */}
        <SettingsSection
          title="Appearance"
          description="Customize how the application looks on your device"
        >
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-4">
              <div className={cn(
                'p-3 rounded-xl',
                theme === 'dark' 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-[var(--warning)]/10 text-[var(--warning)]'
              )}>
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Theme: <span className="capitalize">{theme}</span> Mode
                </p>
                <p className="text-sm text-muted-foreground">
                  {theme === 'dark'
                    ? 'Dark theme is easier on the eyes in low light'
                    : 'Light theme provides better visibility in bright environments'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch
                id="theme-switch"
                checked={theme === 'dark'}
                onCheckedChange={handleThemeToggle}
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </SettingsSection>

        {/* Data Management */}
        <SettingsSection
          title="Data Management"
          description="Manage your transaction data"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-destructive/10 text-destructive">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Clear All Transactions</p>
                  <p className="text-sm text-muted-foreground">
                    Remove all {transactions.length} transactions from your account
                  </p>
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={() => setClearDialogOpen(true)}
                disabled={transactions.length === 0}
              >
                Clear All
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Reset Demo Data</p>
                  <p className="text-sm text-muted-foreground">
                    Replace current data with fresh demo transactions
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setResetDialogOpen(true)}>
                Reset Data
              </Button>
            </div>
          </div>
        </SettingsSection>
      </div>

      {/* Clear Confirmation Dialog */}
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Clear All Transactions
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete all transactions? This action cannot
              be undone and you will lose all your transaction history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setClearDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearTransactions}>
              Yes, Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Reset Demo Data
            </DialogTitle>
            <DialogDescription>
              This will replace all your current transactions with fresh demo data.
              Your current data will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetData}>Yes, Reset Data</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
