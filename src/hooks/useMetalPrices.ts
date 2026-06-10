import { useState, useEffect, useCallback, useRef } from 'react'
import type { MetalPrice } from '@/types'
import { fetchAllPrices, type AllPrices, usdOzToCnyGram } from '@/services/api'
import { appendRealtimePoint, type RealtimePoint } from '@/services/realtimeData'
import { buildLiveMetalPrice } from '@/services/metalPrice'
import { goldMinute, silverMinute } from '@/data/minuteData'

const OZ_TO_GRAM = 31.1035
const REFRESH_INTERVAL = 60_000 // 1分钟刷新
const REALTIME_WINDOW = 120

export function useMetalPrices() {
  const [livePrices, setLivePrices] = useState<AllPrices | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [sourceUpdatedAt, setSourceUpdatedAt] = useState<string>('')
  const [goldRealtime, setGoldRealtime] = useState<RealtimePoint[]>(goldMinute)
  const [silverRealtime, setSilverRealtime] = useState<RealtimePoint[]>(silverMinute)
  const livePricesRef = useRef<AllPrices | null>(null)
  const prevPricesRef = useRef<AllPrices | null>(null)

  const fetchPrices = useCallback(async () => {
    setRefreshing(true)
    try {
      const data = await fetchAllPrices()
      prevPricesRef.current = livePricesRef.current
      livePricesRef.current = data
      setLivePrices(data)
      setError(null)
      const sourceDate = new Date(data.updatedAt)
      setSourceUpdatedAt(sourceDate.toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      }))
      const now = new Date()
      setLastUpdate(now.toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      }))
      setGoldRealtime((points) => appendRealtimePoint(points, data.goldCny, sourceDate, REALTIME_WINDOW))
      setSilverRealtime((points) => appendRealtimePoint(points, data.silverCny, sourceDate, REALTIME_WINDOW))
    } catch (e) {
      setError((e as Error).message)
      console.warn('Live price fetch failed, using fallback:', e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchPrices()
    const timer = setInterval(fetchPrices, REFRESH_INTERVAL)
    return () => clearInterval(timer)
  }, [fetchPrices])

  // 计算实时价格数据
  const usdCny = livePrices?.usdCny ?? 6.7825
  const prev = prevPricesRef.current

  const goldCnyGram = livePrices?.goldCny ?? usdOzToCnyGram(4204.03, usdCny)
  const silverCnyGram = livePrices?.silverCny ?? usdOzToCnyGram(63.08, usdCny)
  const goldUsd = livePrices?.goldUsd ?? 4204.03
  const silverUsd = livePrices?.silverUsd ?? 63.08

  const prevGoldUsd = prev?.goldUsd ?? goldUsd
  const prevSilverUsd = prev?.silverUsd ?? silverUsd
  const prevGoldCny = prev?.goldCny ?? goldCnyGram
  const prevSilverCny = prev?.silverCny ?? silverCnyGram

  // 国内优先排序
  const goldData: MetalPrice[] = [
    buildLiveMetalPrice({ symbol: 'AU9999', name: '上海金 (AU9999)', price: goldCnyGram, previousPrice: prevGoldCny, currency: 'CNY', unit: '元/克' }),
    buildLiveMetalPrice({ symbol: 'GC', name: 'COMEX 黄金期货', price: goldUsd, previousPrice: prevGoldUsd, currency: 'USD', unit: '美元/盎司' }),
    buildLiveMetalPrice({ symbol: 'XAU/USD', name: '国际现货黄金 (伦敦金)', price: goldUsd, previousPrice: prevGoldUsd, currency: 'USD', unit: '美元/盎司' }),
  ]

  const silverData: MetalPrice[] = [
    buildLiveMetalPrice({ symbol: 'AG(T+D)', name: '上海白银 (Ag T+D)', price: silverCnyGram, previousPrice: prevSilverCny, currency: 'CNY', unit: '元/克' }),
    buildLiveMetalPrice({ symbol: 'SI', name: 'COMEX 白银期货', price: silverUsd, previousPrice: prevSilverUsd, currency: 'USD', unit: '美元/盎司' }),
    buildLiveMetalPrice({ symbol: 'XAG/USD', name: '国际现货白银', price: silverUsd, previousPrice: prevSilverUsd, currency: 'USD', unit: '美元/盎司' }),
  ]

  return {
    goldData,
    silverData,
    lastUpdate,
    sourceUpdatedAt,
    usdCny,
    loading,
    refreshing,
    error,
    live: !!livePrices,
    goldRealtime,
    silverRealtime,
    refreshPrices: fetchPrices,
    convertOzToGram: (pricePerOz: number) => (pricePerOz * usdCny) / OZ_TO_GRAM,
  }
}
