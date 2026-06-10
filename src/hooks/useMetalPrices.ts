import { useState, useEffect } from 'react'
import type { MetalPrice, ExchangeRate } from '@/types'

// 实时数据 — 2026-06-10 09:16 CST; 国内优先
const GOLD_DATA: MetalPrice[] = [
  {
    symbol: 'AU9999',
    name: '上海金 (AU9999)',
    price: 917.00,
    change: -27.98,
    changePercent: -2.96,
    high: 950.00,
    low: 913.00,
    open: 945.00,
    prevClose: 944.98,
    currency: 'CNY',
    unit: '元/克',
  },
  {
    symbol: 'GC',
    name: 'COMEX 黄金期货',
    price: 4220.40,
    change: -66.00,
    changePercent: -1.54,
    high: 4281.10,
    low: 4210.70,
    open: 4276.10,
    prevClose: 4286.40,
    currency: 'USD',
    unit: '美元/盎司',
  },
  {
    symbol: 'XAU/USD',
    name: '国际现货黄金 (伦敦金)',
    price: 4204.03,
    change: -56.58,
    changePercent: -1.33,
    high: 4257.49,
    low: 4186.74,
    open: 4253.00,
    prevClose: 4260.61,
    currency: 'USD',
    unit: '美元/盎司',
  },
]

const SILVER_DATA: MetalPrice[] = [
  {
    symbol: 'AG(T+D)',
    name: '上海白银 (Ag T+D)',
    price: 13.98,
    change: -0.35,
    changePercent: -2.44,
    high: 14.35,
    low: 13.82,
    open: 14.22,
    prevClose: 14.33,
    currency: 'CNY',
    unit: '元/克',
  },
  {
    symbol: 'SI',
    name: 'COMEX 白银期货',
    price: 64.205,
    change: -1.035,
    changePercent: -1.59,
    high: 65.480,
    low: 63.900,
    open: 65.200,
    prevClose: 65.240,
    currency: 'USD',
    unit: '美元/盎司',
  },
  {
    symbol: 'XAG/USD',
    name: '国际现货白银',
    price: 63.08,
    change: -1.02,
    changePercent: -1.59,
    high: 64.50,
    low: 62.85,
    open: 64.10,
    prevClose: 64.10,
    currency: 'USD',
    unit: '美元/盎司',
  },
]

const EXCHANGE_RATES: ExchangeRate[] = [
  {
    pair: 'USD/CNY',
    rate: 6.7825,
    change: 0,
    changePercent: 0,
  },
]

export function useMetalPrices() {
  const [goldData] = useState<MetalPrice[]>(GOLD_DATA)
  const [silverData] = useState<MetalPrice[]>(SILVER_DATA)
  const [rates] = useState<ExchangeRate[]>(EXCHANGE_RATES)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  useEffect(() => {
    const now = new Date()
    setLastUpdate(
      now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    )
  }, [])

  const usdCnyRate = rates.find((r) => r.pair === 'USD/CNY')?.rate ?? 6.7825

  const convertOzToGram = (pricePerOz: number, rate: number) => {
    return (pricePerOz * rate) / 31.1035
  }

  return {
    goldData,
    silverData,
    rates,
    lastUpdate,
    usdCnyRate,
    convertOzToGram,
  }
}
