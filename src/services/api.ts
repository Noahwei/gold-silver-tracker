// 实时金价/银价 API 服务

const GOLD_API = 'https://api.gold-api.com/price/XAU'
const SILVER_API = 'https://api.gold-api.com/price/XAG'
const FOREX_API = 'https://api.exchangerate-api.com/v4/latest/USD'

const OZ_TO_GRAM = 31.1035

export interface LivePrice {
  price: number       // 美元/盎司
  updatedAt: string   // ISO 时间
}

export interface LiveForex {
  usdCny: number      // USD/CNY 汇率
  updatedAt: string
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function fetchGoldPrice(): Promise<LivePrice> {
  const data = await fetchJson<{ price: number; updatedAt: string }>(GOLD_API)
  return { price: data.price, updatedAt: data.updatedAt }
}

export async function fetchSilverPrice(): Promise<LivePrice> {
  const data = await fetchJson<{ price: number; updatedAt: string }>(SILVER_API)
  return { price: data.price, updatedAt: data.updatedAt }
}

export async function fetchForex(): Promise<LiveForex> {
  const data = await fetchJson<{ rates: { CNY: number }; date: string }>(FOREX_API)
  return { usdCny: data.rates.CNY, updatedAt: data.date }
}

/** USD/oz → CNY/g */
export function usdOzToCnyGram(usdPerOz: number, usdCny: number): number {
  return (usdPerOz * usdCny) / OZ_TO_GRAM
}

export interface AllPrices {
  // 国际
  goldUsd: number
  silverUsd: number
  // 国内（换算）
  goldCny: number
  silverCny: number
  // 汇率
  usdCny: number
  // 时间
  updatedAt: string
  forexUpdatedAt: string
}

export async function fetchAllPrices(): Promise<AllPrices> {
  const [gold, silver, forex] = await Promise.all([
    fetchGoldPrice(),
    fetchSilverPrice(),
    fetchForex(),
  ])
  return {
    goldUsd: gold.price,
    silverUsd: silver.price,
    goldCny: usdOzToCnyGram(gold.price, forex.usdCny),
    silverCny: usdOzToCnyGram(silver.price, forex.usdCny),
    usdCny: forex.usdCny,
    updatedAt: gold.updatedAt,
    forexUpdatedAt: forex.updatedAt,
  }
}
