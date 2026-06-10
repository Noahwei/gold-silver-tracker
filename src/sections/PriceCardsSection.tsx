import type { MetalPrice } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PriceCardsSectionProps {
  goldData: MetalPrice[]
  silverData: MetalPrice[]
}

function formatPrice(price: number, currency: string): string {
  const symbol = currency === 'CNY' ? '¥' : '$'
  if (price >= 1000) {
    return `${symbol}${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return `${symbol}${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}`
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`text-sm font-mono ${highlight ? 'text-yellow-400 font-semibold' : 'text-gray-200'}`}>
        {value}
      </span>
    </div>
  )
}

function MetalCard({ metal, variant }: { metal: MetalPrice; variant: 'gold' | 'silver' }) {
  const isUp = metal.change > 0
  const isDown = metal.change < 0
  const changeColor = isUp ? 'text-red-400' : isDown ? 'text-green-400' : 'text-gray-400'
  const accentColor = variant === 'gold' ? 'border-yellow-500/30' : 'border-gray-500/30'
  const headerBg = variant === 'gold' ? 'from-yellow-500/10' : 'from-gray-500/10'

  return (
    <Card className={`overflow-hidden border bg-gray-900/60 ${accentColor} transition-all hover:border-opacity-50`}>
      <CardHeader className={`bg-gradient-to-r ${headerBg} to-transparent pb-3`}>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${variant === 'gold' ? 'bg-yellow-400' : 'bg-gray-300'}`} />
          <span className="text-xs font-medium text-gray-400">{metal.symbol}</span>
        </div>
        <CardTitle className="text-base text-gray-100">{metal.name}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4">
          <div className="text-2xl font-bold text-gray-100">
            {formatPrice(metal.price, metal.currency)}
          </div>
          <div className={`mt-1 flex items-center gap-1 text-sm ${changeColor}`}>
            <span>{isUp ? '+' : ''}{formatPrice(metal.change, metal.currency)}</span>
            <span>({isUp ? '+' : ''}{metal.changePercent.toFixed(2)}%)</span>
          </div>
        </div>
        <div className="space-y-0.5 border-t border-gray-800 pt-3">
          <DetailRow label="今开" value={formatPrice(metal.open, metal.currency)} />
          <DetailRow label="最高" value={formatPrice(metal.high, metal.currency)} />
          <DetailRow label="最低" value={formatPrice(metal.low, metal.currency)} />
          <DetailRow label="昨收" value={formatPrice(metal.prevClose, metal.currency)} />
          <DetailRow label="单位" value={metal.unit} />
        </div>
      </CardContent>
    </Card>
  )
}

export function PriceCardsSection({ goldData, silverData }: PriceCardsSectionProps) {
  return (
    <section className="space-y-8">
      {/* Gold Section */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-2xl">🪙</span>
          <h2 className="text-xl font-bold text-yellow-400">黄金 Gold</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {goldData.map((metal) => (
            <MetalCard key={metal.symbol} metal={metal} variant="gold" />
          ))}
        </div>
      </div>

      {/* Silver Section */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-2xl">🥈</span>
          <h2 className="text-xl font-bold text-gray-300">白银 Silver</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {silverData.map((metal) => (
            <MetalCard key={metal.symbol} metal={metal} variant="silver" />
          ))}
        </div>
      </div>
    </section>
  )
}
