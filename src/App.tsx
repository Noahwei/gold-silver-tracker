import { useMetalPrices } from '@/hooks/useMetalPrices'
import { HeroSection } from '@/sections/HeroSection'
import { PriceCardsSection } from '@/sections/PriceCardsSection'
import { ConverterSection } from '@/sections/ConverterSection'
import { ChartSection } from '@/sections/ChartSection'

function App() {
  const {
    goldData,
    silverData,
    lastUpdate,
    sourceUpdatedAt,
    usdCny,
    refreshing,
    goldRealtime,
    silverRealtime,
    refreshPrices,
  } = useMetalPrices()

  const londonGold = goldData.find((g) => g.symbol === 'XAU/USD')!
  const comexSilver = silverData.find((s) => s.symbol === 'SI')!
  const shGold = goldData.find((g) => g.symbol === 'AU9999')!
  const shSilver = silverData.find((s) => s.symbol === 'AG(T+D)')!

  const handleRefresh = () => {
    void refreshPrices()
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        {/* Hero Section — 国内价格默认置顶 */}
        <HeroSection
          goldPriceCny={shGold.price}
          goldChangeCny={shGold.change}
          goldChangePercentCny={shGold.changePercent}
          silverPriceCny={shSilver.price}
          silverChangeCny={shSilver.change}
          silverChangePercentCny={shSilver.changePercent}
          goldPriceUsd={londonGold.price}
          goldChangeUsd={londonGold.change}
          goldChangePercentUsd={londonGold.changePercent}
          silverPriceUsd={comexSilver.price}
          silverChangeUsd={comexSilver.change}
          silverChangePercentUsd={comexSilver.changePercent}
          lastUpdate={lastUpdate}
          usdCnyRate={usdCny}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />

        {/* 走势图表 */}
        <div className="my-10">
          <ChartSection
            goldPriceCny={shGold.price}
            silverPriceCny={shSilver.price}
            goldRealtime={goldRealtime}
            silverRealtime={silverRealtime}
          />
        </div>

        <div className="my-10">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
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
            usdCnyRate={usdCny}
            goldPriceCnyPerGram={shGold.price}
            silverPriceCnyPerGram={shSilver.price}
          />
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-800 pt-6 text-center">
          <p className="text-xs text-gray-600">
            数据来源：Gold API 实时现货金银价 / USD-CNY 汇率 | 最新源时间：{sourceUpdatedAt || lastUpdate || '加载中'} | 仅供参考，不构成投资建议
          </p>
          <p className="mt-1 text-xs text-gray-700">
            &copy; 2026 实时金银价格追踪
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
