export interface RealtimePoint {
  time: string
  price: number
}

export interface DailyPricePoint {
  date: string
  price: number
  open: number
  high: number
  low: number
  volume: number
}

const DEFAULT_REALTIME_WINDOW = 120

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Shanghai',
  }).format(date)
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Shanghai',
  }).format(date)
}

export function appendRealtimePoint(
  points: RealtimePoint[],
  price: number,
  updatedAt: Date,
  maxPoints = DEFAULT_REALTIME_WINDOW,
): RealtimePoint[] {
  const time = formatTime(updatedAt)
  const nextPoint = { time, price }
  const next =
    points.at(-1)?.time === time
      ? [...points.slice(0, -1), nextPoint]
      : [...points, nextPoint]

  return next.slice(-maxPoints)
}

export function mergeLatestDailyPrice<T extends DailyPricePoint>(
  dailyData: T[],
  livePrice: number,
  updatedAt: Date,
): T[] {
  const date = formatDate(updatedAt)
  const currentIndex = dailyData.findIndex((point) => point.date === date)

  if (currentIndex === -1) {
    return [
      ...dailyData,
      {
        date,
        price: livePrice,
        open: livePrice,
        high: livePrice,
        low: livePrice,
        volume: 0,
      } as T,
    ]
  }

  return dailyData.map((point, index) => {
    if (index !== currentIndex) return point

    return {
      ...point,
      price: livePrice,
      high: Math.max(point.high, livePrice),
      low: Math.min(point.low, livePrice),
    }
  })
}
