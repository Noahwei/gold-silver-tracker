import { useState, useMemo } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import type { KlinePoint } from '@/data/kline'
import { goldKline, silverKline, filterKlineByDays } from '@/data/kline'
import { BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

type Period = 'realtime' | '1m' | '3m'

interface ChartSectionProps {
  goldPriceCny: number
  silverPriceCny: number
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function formatFullDate(dateStr: string): string {
  return dateStr
}

function CustomTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="text-xs text-gray-400 mb-1">{formatFullDate(label)}</p>
      <p className="text-sm font-mono font-semibold text-yellow-400">
        ¥{payload[0].value.toFixed(2)} <span className="text-xs text-gray-400">{unit}</span>
      </p>
    </div>
  )
}

function MetalChart({
  title,
  data,
  unit,
  color,
}: {
  title: string
  data: KlinePoint[]
  unit: string
  color: string
}) {
  const [period, setPeriod] = useState<Period>('realtime')

  const chartData = useMemo(() => {
    if (period === 'realtime') return data.slice(-14) // last ~2 weeks
    if (period === '1m') return filterKlineByDays(data, 30)
    if (period === '3m') return data // all data is ~90 days
    return data
  }, [period, data])

  const sortedData = useMemo(() => [...chartData].sort((a, b) => a.date.localeCompare(b.date)), [chartData])

  const tabs: { key: Period; label: string }[] = [
    { key: 'realtime', label: '实时' },
    { key: '1m', label: '近一月' },
    { key: '3m', label: '近三月' },
  ]

  const currentPrice = data[0]?.price ?? 0
  const firstPrice = sortedData[0]?.price ?? currentPrice
  const change = currentPrice - firstPrice
  const changePercent = firstPrice ? ((change / firstPrice) * 100) : 0
  const isUp = change >= 0

  // Calculate min/max for Y axis with some padding
  const prices = sortedData.map((d) => d.price)
  const yMin = Math.min(...prices) * 0.95
  const yMax = Math.max(...prices) * 1.05

  return (
    <Card className="border-gray-800 bg-gray-900/60">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-bold font-mono text-gray-100">
                ¥{currentPrice.toFixed(2)}
              </span>
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${isUp ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                {isUp ? '+' : ''}{changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
          {/* Period tabs */}
          <div className="flex gap-1 rounded-lg bg-gray-800/50 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setPeriod(tab.key)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  period === tab.key
                    ? 'bg-gray-700 text-gray-100 shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={sortedData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#4b5563"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[yMin, yMax]}
              stroke="#4b5563"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v.toFixed(1)}
              width={50}
            />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${title})`}
              dot={false}
              activeDot={{ r: 4, stroke: color, strokeWidth: 2, fill: '#111827' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function ChartSection({ goldPriceCny, silverPriceCny }: ChartSectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-gray-400" />
        <h2 className="text-xl font-bold text-gray-200">走势图表</h2>
        <span className="text-xs text-gray-500 ml-2">国内金 ¥{goldPriceCny.toFixed(0)}/g · 国内银 ¥{silverPriceCny.toFixed(2)}/g</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <MetalChart
          title="国内金价走势"
          data={goldKline}
          unit="元/克"
          color="#f59e0b"
        />
        <MetalChart
          title="国内银价走势"
          data={silverKline}
          unit="元/克"
          color="#9ca3af"
        />
      </div>
    </section>
  )
}
