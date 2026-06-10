import { useMetalPrices } from '@/hooks/useMetalPrices'
import { HeroSection } from '@/sections/HeroSection'
import { PriceCardsSection } from '@/sections/PriceCardsSection'
import { ConverterSection } from '@/sections/ConverterSection'
import { ChartSection } from '@/sections/ChartSection'
import { RefreshCw } from 'lucide-react'

function App() {
  const { goldData, silverData, lastUpdate, usdCnyRate } = useMetalPrices()

  const londonGold = goldData.find((g) => g.symbol === 'XAU/USD')!
  const comexSilver = silverData.find((s) => s.symbol === 'SI')!
  const shGold = goldData.find((g) => g.symbol === 'AU9999')!
  const shSilver = silverData.find((s) => s.symbol === 'AG(T+D)')!

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        {/* Hero Section */}
        <HeroSection
          goldPrice={londonGold.price}
          goldChange={londonGold.change}
          goldChangePercent={londonGold.changePercent}
          silverPrice={comexSilver.price}
          silverChange={comexSilver.change}
          silverChangePercent={comexSilver.changePercent}
          lastUpdate={lastUpdate}
          usdCnyRate={usdCnyRate}
        />

        {/* 走势图表 */}
        <div className="my-10">
          <ChartSection
            goldPriceCny={shGold.price}
            silverPriceCny={shSilver.price}
          />
        </div>

        {/* Divider */}
        <div className="my-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900 px-4 py-1.5 text-xs text-gray-400 transition-all hover:border-gray-600 hover:text-gray-200"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            刷新数据
          </button>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
        </div>

        {/* Price Cards */}
        <div className="mb-10">
          <PriceCardsSection goldData={goldData} silverData={silverData} />
        </div>

        {/* Converter */}
        <div className="mb-10">
          <ConverterSection
            goldPricePerOz={londonGold.price}
            silverPricePerOz={comexSilver.price}
            usdCnyRate={usdCnyRate}
            goldPriceCnyPerGram={shGold.price}
            silverPriceCnyPerGram={shSilver.price}
          />
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-800 pt-6 text-center">
          <p className="text-xs text-gray-600">
            数据来源：COMEX / 伦敦金 / 上海黄金交易所 | 走势图数据来自华安黄金ETF(518880) / 国投白银LOF(161226) | 仅供参考，不构成投资建议
          </p>
          <p className="mt-1 text-xs text-gray-700">
            &copy; 2026 实时金银价格追踪 | Powered by WorkBuddy
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
