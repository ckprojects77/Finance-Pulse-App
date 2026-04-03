import { useState, useEffect, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  AlertCircle,
  Lightbulb,
  Calendar,
  DollarSign,
  ShoppingBag,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'
import { useApp } from '../context/AppContext'
import { formatCurrency, cn } from '../lib/utils'

function InsightCard({ icon: Icon, title, value, subtitle, trend, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-[var(--success)]/10 text-[var(--success)]',
    warning: 'bg-[var(--warning)]/10 text-[var(--warning)]',
    destructive: 'bg-destructive/10 text-destructive',
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={cn('p-3 rounded-xl', colorClasses[color])}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend !== undefined && (
              <div className={cn(
                'flex items-center gap-1 mt-2 text-sm',
                trend >= 0 ? 'text-[var(--success)]' : 'text-destructive'
              )}>
                {trend >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{Math.abs(trend).toFixed(1)}% vs last month</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RecommendationCard({ icon: Icon, title, description, type = 'info' }) {
  const typeClasses = {
    info: 'border-primary/20 bg-primary/5',
    warning: 'border-[var(--warning)]/20 bg-[var(--warning)]/5',
    success: 'border-[var(--success)]/20 bg-[var(--success)]/5',
  }

  const iconClasses = {
    info: 'text-primary',
    warning: 'text-[var(--warning)]',
    success: 'text-[var(--success)]',
  }

  return (
    <Card className={cn('border', typeClasses[type])}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', iconClasses[type])} />
          <div>
            <p className="font-medium text-foreground">{title}</p>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function InsightsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[400px] rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default function Insights() {
  const { transactions, stats, categoryBreakdown } = useApp()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  // Calculate insights
  const insights = useMemo(() => {
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()

    // Get this month's transactions
    const thisMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date)
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear
    })

    const thisMonthExpenses = thisMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const thisMonthIncome = thisMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    // Get days in month with transactions
    const daysWithExpenses = new Set(
      transactions
        .filter((t) => t.type === 'expense')
        .map((t) => t.date)
    ).size

    const avgDailyExpense = daysWithExpenses > 0
      ? stats.expenses / daysWithExpenses
      : 0

    // Highest spending category
    const highestCategory = categoryBreakdown[0] || { name: 'N/A', value: 0 }

    // Monthly comparison data
    const monthlyData = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now)
      date.setMonth(date.getMonth() - i)
      const month = date.getMonth()
      const year = date.getFullYear()

      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date)
        return tDate.getMonth() === month && tDate.getFullYear() === year
      })

      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

      const expenses = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      monthlyData.push({
        name: date.toLocaleDateString('en-US', { month: 'short' }),
        income,
        expenses,
      })
    }

    // Recent activity
    const recentTransactions = transactions.slice(0, 5)

    return {
      thisMonthIncome,
      thisMonthExpenses,
      avgDailyExpense,
      highestCategory,
      monthlyData,
      recentTransactions,
      totalSavings: stats.balance,
    }
  }, [transactions, stats, categoryBreakdown])

  // Generate recommendations
  const recommendations = useMemo(() => {
    const recs = []

    if (insights.highestCategory.value > 0) {
      const percentOfExpenses = (insights.highestCategory.value / stats.expenses * 100).toFixed(0)
      recs.push({
        icon: ShoppingBag,
        title: `${insights.highestCategory.name} is your top expense`,
        description: `You spent ${formatCurrency(insights.highestCategory.value)} on ${insights.highestCategory.name}, which is ${percentOfExpenses}% of your total expenses.`,
        type: 'warning',
      })
    }

    if (insights.totalSavings > 0) {
      recs.push({
        icon: PiggyBank,
        title: 'Great job saving!',
        description: `You have ${formatCurrency(insights.totalSavings)} in savings. Consider investing a portion for better returns.`,
        type: 'success',
      })
    } else {
      recs.push({
        icon: AlertCircle,
        title: 'Negative balance alert',
        description: 'Your expenses exceed your income. Try to reduce non-essential spending.',
        type: 'warning',
      })
    }

    if (insights.avgDailyExpense > 100) {
      recs.push({
        icon: Lightbulb,
        title: 'Consider budgeting',
        description: `Your average daily expense is ${formatCurrency(insights.avgDailyExpense)}. Setting a daily budget might help reduce spending.`,
        type: 'info',
      })
    }

    recs.push({
      icon: Calendar,
      title: 'Review your subscriptions',
      description: 'Check your recurring expenses and cancel any unused subscriptions to save money.',
      type: 'info',
    })

    return recs
  }, [insights, stats])

  if (loading) {
    return <InsightsSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Insights</h1>
        <p className="text-muted-foreground mt-1">
          Analyze your spending patterns and get personalized recommendations
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InsightCard
          icon={ShoppingBag}
          title="Highest Spending Category"
          value={insights.highestCategory.name}
          subtitle={formatCurrency(insights.highestCategory.value)}
          color="warning"
        />
        <InsightCard
          icon={DollarSign}
          title="Average Daily Expense"
          value={formatCurrency(insights.avgDailyExpense)}
          subtitle="Based on total expenses"
          color="primary"
        />
        <InsightCard
          icon={PiggyBank}
          title="Total Savings"
          value={formatCurrency(insights.totalSavings)}
          subtitle="Income - Expenses"
          color={insights.totalSavings >= 0 ? 'success' : 'destructive'}
        />
        <InsightCard
          icon={TrendingUp}
          title="This Month Income"
          value={formatCurrency(insights.thisMonthIncome)}
          subtitle={`Expenses: ${formatCurrency(insights.thisMonthExpenses)}`}
          color="success"
        />
      </div>

      {/* Monthly Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insights.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="var(--chart-2)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="var(--chart-1)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, index) => (
            <RecommendationCard
              key={index}
              icon={rec.icon}
              title={rec.title}
              description={rec.description}
              type={rec.type}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {insights.recentTransactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No recent transactions
            </p>
          ) : (
            <div className="space-y-4">
              {insights.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'font-semibold',
                      transaction.type === 'income'
                        ? 'text-[var(--success)]'
                        : 'text-destructive'
                    )}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
