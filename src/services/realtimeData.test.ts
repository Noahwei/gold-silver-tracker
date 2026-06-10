import assert from 'node:assert/strict'
import test from 'node:test'
import {
  appendRealtimePoint,
  mergeLatestDailyPrice,
  type RealtimePoint,
  type DailyPricePoint,
} from './realtimeData.ts'

test('appendRealtimePoint replaces the current minute instead of duplicating it', () => {
  const points: RealtimePoint[] = [
    { time: '11:40', price: 920.1 },
    { time: '11:41', price: 920.4 },
  ]

  const next = appendRealtimePoint(points, 921.2, new Date('2026-06-10T03:41:45Z'), 5)

  assert.deepEqual(next, [
    { time: '11:40', price: 920.1 },
    { time: '11:41', price: 921.2 },
  ])
})

test('appendRealtimePoint keeps only the requested latest window', () => {
  const points: RealtimePoint[] = [
    { time: '11:38', price: 919.8 },
    { time: '11:39', price: 920.0 },
    { time: '11:40', price: 920.1 },
  ]

  const next = appendRealtimePoint(points, 921.2, new Date('2026-06-10T03:41:00Z'), 3)

  assert.deepEqual(next, [
    { time: '11:39', price: 920.0 },
    { time: '11:40', price: 920.1 },
    { time: '11:41', price: 921.2 },
  ])
})

test('mergeLatestDailyPrice replaces today with the live price and preserves history', () => {
  const daily: DailyPricePoint[] = [
    { date: '2026-06-09', price: 949.24, open: 949.24, high: 953.45, low: 948.18, volume: 2870005 },
    { date: '2026-06-10', price: 917.0, open: 920.79, high: 921.32, low: 916.68, volume: 1039441 },
  ]

  const next = mergeLatestDailyPrice(daily, 911.5, new Date('2026-06-10T03:45:00Z'))

  assert.deepEqual(next, [
    { date: '2026-06-09', price: 949.24, open: 949.24, high: 953.45, low: 948.18, volume: 2870005 },
    { date: '2026-06-10', price: 911.5, open: 920.79, high: 921.32, low: 911.5, volume: 1039441 },
  ])
})
