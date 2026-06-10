import type { MetalPrice } from '@/types'

interface BuildLiveMetalPriceInput {
  symbol: string
  name: string
  price: number
  previousPrice: number
  currency: string
  unit: string
}

export function buildLiveMetalPrice({
  symbol,
  name,
  price,
  previousPrice,
  currency,
  unit,
}: BuildLiveMetalPriceInput): MetalPrice {
  const change = price - previousPrice
  const changePercent = previousPrice ? (change / previousPrice) * 100 : 0

  return {
    symbol,
    name,
    price,
    change,
    changePercent,
    currency,
    unit,
  }
}
