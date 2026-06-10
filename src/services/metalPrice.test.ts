import assert from 'node:assert/strict'
import test from 'node:test'
import { buildLiveMetalPrice } from './metalPrice.ts'

test('buildLiveMetalPrice does not invent OHLC values when source data is unavailable', () => {
  const metal = buildLiveMetalPrice({
    symbol: 'XAU/USD',
    name: '国际现货黄金 (伦敦金)',
    price: 4180.6,
    previousPrice: 4178.1,
    currency: 'USD',
    unit: '美元/盎司',
  })

  assert.equal(metal.open, undefined)
  assert.equal(metal.high, undefined)
  assert.equal(metal.low, undefined)
  assert.equal(metal.prevClose, undefined)
  assert.equal(metal.change, 2.5)
  assert.equal(Number(metal.changePercent.toFixed(4)), 0.0598)
})
