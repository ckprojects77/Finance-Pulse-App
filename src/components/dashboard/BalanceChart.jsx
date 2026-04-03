import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { formatCurrency } from '../../lib/utils'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-md">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-semibold text-foreground">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  )
}

export function BalanceChart({ data = [] }) {
  return (
    <Card className="h-full">

      {/* HEADER */}
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Balance Trend
        </CardTitle>
      </CardHeader>

      {/* BODY */}
      <CardContent>
        <div className="h-[320px] w-full">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={data}>

              {/* GRID */}
              <CartesianGrid
                stroke="var(--border)"
                strokeOpacity={0.4}
                vertical={false}
              />

              {/* X AXIS */}
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="var(--muted-foreground)"
              />

              {/* Y AXIS */}
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="var(--muted-foreground)"
                tickFormatter={(value) =>
                  `$${(value / 1000).toFixed(0)}k`
                }
              />

              {/* TOOLTIP */}
              <Tooltip content={<CustomTooltip />} />

              {/* LINE */}
              <Line
                type="monotone"
                dataKey="balance"
                stroke="var(--primary)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: 'var(--primary)',
                }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>
      </CardContent>

    </Card>
  )
}