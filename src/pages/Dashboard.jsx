import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { StatCard } from '../components/dashboard/StatCard'
import { BalanceChart } from '../components/dashboard/BalanceChart'
import { SpendingChart } from '../components/dashboard/SpendingChart'
import { Skeleton } from '../components/ui/skeleton'
import { useState, useEffect } from 'react'

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-7 w-44 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Skeleton className="h-[360px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[360px] rounded-xl" />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { stats, balanceTrend, categoryBreakdown } = useApp()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <DashboardSkeleton />

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back! Here’s your financial overview.
          </p>
        </div>

        <div className="text-xs md:text-sm text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-md w-fit">
          Live financial data
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Total Balance"
          value={stats.balance}
          change={stats.balanceChange}
          icon={Wallet}
        />
        <StatCard
          title="Total Income"
          value={stats.income}
          change={stats.incomeChange}
          icon={TrendingUp}
        />
        <StatCard
          title="Total Expenses"
          value={stats.expenses}
          change={stats.expenseChange}
          icon={TrendingDown}
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <div className="lg:col-span-2 bg-card rounded-xl border p-4">
          <BalanceChart data={balanceTrend} />
        </div>

        <div className="bg-card rounded-xl border p-4">
          <SpendingChart data={categoryBreakdown} />
        </div>

      </div>

    </div>
  )
}