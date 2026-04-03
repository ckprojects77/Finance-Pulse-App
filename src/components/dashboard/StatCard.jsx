import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { formatCurrency, formatPercent, cn } from '../../lib/utils'

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  type = 'currency'
}) {
  const isPositive = change >= 0

  const formattedValue =
    type === 'currency' ? formatCurrency(value) : value

  return (
    <Card className="group relative overflow-hidden border border-border/60 bg-background/60 backdrop-blur-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">

      {/* subtle gradient glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

      <CardContent className="p-5 relative">

        <div className="flex items-start justify-between">

          {/* LEFT */}
          <div className="flex-1">

            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>

            <h3 className="text-2xl font-semibold mt-2 tracking-tight text-foreground">
              {formattedValue}
            </h3>

            {/* CHANGE CHIP */}
            <div
              className={cn(
                'inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full text-xs font-medium border',
                isPositive
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                  : 'bg-red-500/10 text-red-600 border-red-500/20'
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}

              <span>{formatPercent(change)}</span>

              <span className="text-muted-foreground font-normal">
                vs last month
              </span>
            </div>

          </div>

          {/* ICON */}
          <div className="relative">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
              <Icon className="h-5 w-5" />
            </div>

            {/* soft glow ring */}
            <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl opacity-0 group-hover:opacity-60 transition" />
          </div>

        </div>

      </CardContent>
    </Card>
  )
}