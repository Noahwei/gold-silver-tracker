export interface MetalPrice {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  high?: number
  low?: number
  open?: number
  prevClose?: number
  currency: string
  unit: string
}

export interface ExchangeRate {
  pair: string
  rate: number
  change: number
  changePercent: number
}
