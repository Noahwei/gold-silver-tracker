import { useState, useMemo } from 'react'
import { ArrowRightLeft } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface ConverterSectionProps {
  goldPricePerOz: number
  silverPricePerOz: number
  usdCnyRate: number
  goldPriceCnyPerGram: number
  silverPriceCnyPerGram: number
}

const OZ_TO_GRAM = 31.1035
const GRAM_TO_OZ = 1 / OZ_TO_GRAM

type ConvertMode = 'usd_per_oz' | 'cny_per_gram' | 'value'

export function ConverterSection({
  goldPricePerOz,
  silverPricePerOz,
  usdCnyRate,
  goldPriceCnyPerGram,
  silverPriceCnyPerGram,
}: ConverterSectionProps) {
  const [mode, setMode] = useState<ConvertMode>('usd_per_oz')
  const [inputValue, setInputValue] = useState<string>('1')

  const results = useMemo(() => {
    const val = parseFloat(inputValue) || 0

    if (mode === 'usd_per_oz') {
      return {
        gold: [
          { label: '美元/盎司', value: goldPricePerOz, format: 'usd' },
          { label: '人民币/盎司', value: goldPricePerOz * usdCnyRate, format: 'cny' },
          { label: '人民币/克', value: goldPriceCnyPerGram, format: 'cny' },
          { label: '美元/克', value: goldPricePerOz * GRAM_TO_OZ, format: 'usd' },
        ],
        silver: [
          { label: '美元/盎司', value: silverPricePerOz, format: 'usd' },
          { label: '人民币/盎司', value: silverPricePerOz * usdCnyRate, format: 'cny' },
          { label: '人民币/克', value: silverPriceCnyPerGram, format: 'cny' },
          { label: '美元/克', value: silverPricePerOz * GRAM_TO_OZ, format: 'usd' },
        ],
      }
    } else if (mode === 'cny_per_gram') {
      return {
        gold: [
          { label: '人民币/克', value: goldPriceCnyPerGram, format: 'cny' },
          { label: '美元/盎司', value: goldPriceCnyPerGram * OZ_TO_GRAM / usdCnyRate, format: 'usd' },
          { label: '人民币/盎司', value: goldPriceCnyPerGram * OZ_TO_GRAM, format: 'cny' },
          { label: '美元/克', value: goldPriceCnyPerGram / usdCnyRate, format: 'usd' },
        ],
        silver: [
          { label: '人民币/克', value: silverPriceCnyPerGram, format: 'cny' },
          { label: '美元/盎司', value: silverPriceCnyPerGram * OZ_TO_GRAM / usdCnyRate, format: 'usd' },
          { label: '人民币/盎司', value: silverPriceCnyPerGram * OZ_TO_GRAM, format: 'cny' },
          { label: '美元/克', value: silverPriceCnyPerGram / usdCnyRate, format: 'usd' },
        ],
      }
    } else {
      return {
        gold: [
          { label: '等于黄金', value: val / (goldPriceCnyPerGram || 1), format: 'mass' },
          { label: '等于白银', value: val / (silverPriceCnyPerGram || 1), format: 'mass' },
          { label: '黄金盎司', value: val / (goldPricePerOz * usdCnyRate), format: 'mass_oz' },
          { label: '白银盎司', value: val / (silverPricePerOz * usdCnyRate), format: 'mass_oz' },
        ],
        silver: [],
      }
    }
  }, [mode, goldPricePerOz, silverPricePerOz, usdCnyRate, goldPriceCnyPerGram, silverPriceCnyPerGram, inputValue])

  function formatVal(value: number, format: string): string {
    if (format === 'usd') return `$ ${value.toFixed(2)}`
    if (format === 'cny') return `¥ ${value.toFixed(2)}`
    if (format === 'mass') return `${value.toFixed(2)} 克`
    if (format === 'mass_oz') return `${value.toFixed(4)} 盎司`
    return value.toFixed(2)
  }

  const tabs: { key: ConvertMode; label: string }[] = [
    { key: 'usd_per_oz', label: '盎司价格换算' },
    { key: 'cny_per_gram', label: '克价换算' },
    { key: 'value', label: '金额换算' },
  ]

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <ArrowRightLeft className="h-5 w-5 text-gray-400" />
        <h2 className="text-xl font-bold text-gray-200">价格换算</h2>
      </div>

      <Card className="border-gray-800 bg-gray-900/60">
        <CardHeader className="pb-2">
          <div className="flex gap-1 rounded-lg bg-gray-800/50 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setMode(tab.key)}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  mode === tab.key
                    ? 'bg-gray-700 text-gray-100 shadow'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {mode === 'value' ? (
            <div className="mb-6">
              <label className="mb-2 block text-sm text-gray-400">输入人民币金额</label>
              <div className="flex items-center gap-2">
                <span className="text-lg text-gray-400">¥</span>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="输入金额"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2.5 text-lg text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20"
                />
              </div>
            </div>
          ) : null}

          {mode !== 'value' ? (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Gold */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-yellow-400">
                  <span className="h-2 w-2 rounded-full bg-yellow-400" />
                  黄金
                </h3>
                <div className="space-y-2">
                  {results.gold.map((item, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-gray-800/30 px-4 py-2.5">
                      <span className="text-sm text-gray-400">{item.label}</span>
                      <span className="font-mono text-sm font-semibold text-gray-100">
                        {formatVal(item.value, item.format)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Silver */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <span className="h-2 w-2 rounded-full bg-gray-300" />
                  白银
                </h3>
                <div className="space-y-2">
                  {results.silver.map((item, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-gray-800/30 px-4 py-2.5">
                      <span className="text-sm text-gray-400">{item.label}</span>
                      <span className="font-mono text-sm font-semibold text-gray-100">
                        {formatVal(item.value, item.format)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {results.gold.map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-gray-800/30 px-4 py-3">
                  <span className="text-sm text-gray-400">
                    ¥{parseFloat(inputValue || '0').toLocaleString()} {item.label}
                  </span>
                  <span className="font-mono text-base font-semibold text-yellow-400">
                    {formatVal(item.value, item.format)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Exchange rate note */}
          <div className="mt-4 border-t border-gray-800 pt-3">
            <p className="text-xs text-gray-500">
              * 汇率基准：USD/CNY = {usdCnyRate.toFixed(4)} | 1盎司 = 31.1035克
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
