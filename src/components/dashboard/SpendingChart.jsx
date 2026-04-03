import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { formatCurrency } from '../../lib/utils'

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  '#6366f1',
  '#14b8a6',
  '#f97316',
]

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-popover border border-border rounded-md px-3 py-2 shadow-md">
      <p className="text-sm font-medium text-foreground">
        {payload[0].name}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  )
}

export function SpendingChart({ data = [] }) {
  const chartData = data.slice(0, 8)

  if (!chartData.length) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Spending by Category
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="h-[320px] flex items-center justify-center text-sm text-muted-foreground">
            No spending data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">

      {/* HEADER */}
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Spending by Category
        </CardTitle>
      </CardHeader>

      {/* BODY */}
      <CardContent>

        <div className="h-[320px] w-full">

          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              {/* TOOLTIP */}
              <Tooltip content={<CustomTooltip />} />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* CUSTOM LEGEND */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
          {chartData.slice(0, 5).map((entry, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor:
                    COLORS[index % COLORS.length],
                }}
              />
              <span>{entry.name}</span>
            </div>
          ))}
        </div>

      </CardContent>

    </Card>
  )
}