import { RefreshCw, TrendingDown, TrendingUp, Minus } from 'lucide-react'

interface PriceTickerProps {
  label: string
  price: number
  change: number
  changePercent: number
  currency: string
  unit: string
  variant: 'gold' | 'silver'
}

function formatPrice(price: number, currency: string): string {
  const symbol = currency === 'CNY' ? '¥' : '$'
  if (price >= 1000) {
    return `${symbol}${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return `${symbol}${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function PriceTicker({ label, price, change, changePercent, currency, unit, variant }: PriceTickerProps) {
  const isUp = change > 0
  const isDown = change < 0
  const changeColor = isUp ? 'text-red-400' : isDown ? 'text-green-400' : 'text-gray-400'
  const changeBg = isUp ? 'bg-red-500/10' : isDown ? 'bg-green-500/10' : 'bg-gray-500/10'
  const borderColor = variant === 'gold' ? 'border-yellow-500/20' : 'border-gray-400/20'
  const glowColor = variant === 'gold' ? 'shadow-yellow-500/5' : 'shadow-gray-400/5'

  return (
    <div className={`relative rounded-2xl border ${borderColor} bg-gray-900/50 p-6 backdrop-blur-sm transition-all hover:scale-[1.02] hover:${glowColor}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-400">{label}</span>
        <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${changeBg} ${changeColor}`}>
          {isUp ? <TrendingUp className="h-3.5 w-3.5" /> : isDown ? <TrendingDown className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
          <span>{isUp ? '+' : ''}{changePercent.toFixed(2)}%</span>
        </div>
      </div>
      <div className="mb-1">
        <span className={`text-4xl font-bold tracking-tight ${variant === 'gold' ? 'text-yellow-400' : 'text-gray-200'}`}>
          {formatPrice(price, currency)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm ${changeColor}`}>
          {isUp ? '+' : ''}{formatPrice(Math.abs(change), currency)}
        </span>
        <span className="text-xs text-gray-500">{unit}</span>
      </div>
    </div>
  )
}

interface HeroSectionProps {
  // 国内金价
  goldPriceCny: number
  goldChangeCny: number
  goldChangePercentCny: number
  // 国内银价
  silverPriceCny: number
  silverChangeCny: number
  silverChangePercentCny: number
  // 国际金价 (美元/盎司)
  goldPriceUsd: number
  goldChangeUsd: number
  goldChangePercentUsd: number
  // 国际银价 (美元/盎司)
  silverPriceUsd: number
  silverChangeUsd: number
  silverChangePercentUsd: number
  lastUpdate: string
  usdCnyRate: number
  refreshing: boolean
  onRefresh: () => void
}

export function HeroSection({
  goldPriceCny, goldChangeCny, goldChangePercentCny,
  silverPriceCny, silverChangeCny, silverChangePercentCny,
  goldPriceUsd, goldChangeUsd, goldChangePercentUsd,
  silverPriceUsd, silverChangeUsd, silverChangePercentUsd,
  lastUpdate, usdCnyRate, refreshing, onRefresh,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-yellow-900/20 p-8 md:p-12">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-yellow-500/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gray-400/5 blur-3xl" />

      <div className="relative">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-gray-200 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              实时金银价格
            </h1>
            <p className="mt-1 text-sm text-gray-400">国内 & 国际贵金属实时行情</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-xs text-gray-400">
              USD/CNY <span className="font-mono font-semibold text-gray-200">{usdCnyRate.toFixed(4)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-xs text-gray-400">
              更新于 <span className="font-mono text-gray-200">{lastUpdate}</span>
              <button
                type="button"
                onClick={onRefresh}
                disabled={refreshing}
                className="ml-1 inline-flex h-6 items-center gap-1 rounded-md border border-gray-700 bg-gray-900 px-2 text-xs text-gray-400 transition-all hover:border-gray-600 hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={refreshing ? '刷新中' : '刷新数据'}
              >
                <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? '刷新中' : '刷新'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 国内价格（首位） */}
        <div className="grid gap-6 md:grid-cols-2 mb-4">
          <PriceTicker
            label="国内金价 (AU9999)"
            price={goldPriceCny}
            change={goldChangeCny}
            changePercent={goldChangePercentCny}
            currency="CNY"
            unit="元/克"
            variant="gold"
          />
          <PriceTicker
            label="国内银价 (Ag T+D)"
            price={silverPriceCny}
            change={silverChangeCny}
            changePercent={silverChangePercentCny}
            currency="CNY"
            unit="元/克"
            variant="silver"
          />
        </div>

        {/* 国际价格 */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900/30 px-5 py-3">
            <span className="text-xs text-gray-500">国际金</span>
            <span className="font-mono font-semibold text-gray-300">${goldPriceUsd.toFixed(2)}</span>
            <span className={`text-xs ${goldChangeUsd >= 0 ? 'text-red-400' : 'text-green-400'}`}>
              {goldChangeUsd >= 0 ? '+' : ''}{goldChangePercentUsd.toFixed(2)}%
            </span>
            <span className="text-xs text-gray-600">美元/盎司</span>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900/30 px-5 py-3">
            <span className="text-xs text-gray-500">国际银</span>
            <span className="font-mono font-semibold text-gray-300">${silverPriceUsd.toFixed(2)}</span>
            <span className={`text-xs ${silverChangeUsd >= 0 ? 'text-red-400' : 'text-green-400'}`}>
              {silverChangeUsd >= 0 ? '+' : ''}{silverChangePercentUsd.toFixed(2)}%
            </span>
            <span className="text-xs text-gray-600">美元/盎司</span>
          </div>
        </div>
      </div>
    </section>
  )
}
