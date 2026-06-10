// 分时数据（1分钟间隔）— 2026-06-10 盘内数据
// 黄金基于华安黄金ETF(518880)，白银基于国投白银LOF(161226)
// 已转换为元/克：黄金 ×105.35，白银 ×7.43

export interface MinutePoint {
  time: string  // "HH:MM" 格式
  price: number
}

export const goldMinute: MinutePoint[] = [
  { time: '09:55', price: 918.27 },
  { time: '09:56', price: 917.95 },
  { time: '09:57', price: 917.95 },
  { time: '09:58', price: 918.06 },
  { time: '09:59', price: 917.43 },
  { time: '10:00', price: 917.64 },
  { time: '10:01', price: 918.06 },
  { time: '10:02', price: 917.95 },
  { time: '10:03', price: 917.95 },
  { time: '10:04', price: 917.21 },
  { time: '10:05', price: 917.53 },
  { time: '10:06', price: 916.58 },
  { time: '10:07', price: 916.05 },
  { time: '10:08', price: 916.05 },
  { time: '10:09', price: 916.05 },
  { time: '10:10', price: 915.95 },
  { time: '10:11', price: 915.74 },
  { time: '10:12', price: 916.69 },
  { time: '10:13', price: 916.58 },
  { time: '10:14', price: 916.79 },
  { time: '10:15', price: 916.27 },
  { time: '10:16', price: 916.27 },
  { time: '10:17', price: 916.27 },
  { time: '10:18', price: 916.27 },
  { time: '10:19', price: 916.16 },
  { time: '10:20', price: 915.63 },
  { time: '10:21', price: 916.05 },
  { time: '10:22', price: 916.16 },
  { time: '10:23', price: 916.27 },
  { time: '10:24', price: 916.27 },
];

export const silverMinute: MinutePoint[] = [
  { time: '09:55', price: 13.99 },
  { time: '09:56', price: 14.00 },
  { time: '09:57', price: 14.02 },
  { time: '09:58', price: 14.03 },
  { time: '09:59', price: 14.01 },
  { time: '10:00', price: 14.01 },
  { time: '10:01', price: 14.00 },
  { time: '10:02', price: 13.99 },
  { time: '10:03', price: 13.99 },
  { time: '10:04', price: 13.99 },
  { time: '10:05', price: 14.00 },
  { time: '10:06', price: 13.98 },
  { time: '10:07', price: 13.99 },
  { time: '10:08', price: 13.96 },
  { time: '10:09', price: 13.96 },
  { time: '10:10', price: 13.94 },
  { time: '10:11', price: 13.95 },
  { time: '10:12', price: 13.95 },
  { time: '10:13', price: 13.97 },
  { time: '10:14', price: 13.98 },
  { time: '10:15', price: 13.97 },
  { time: '10:16', price: 13.95 },
  { time: '10:17', price: 13.97 },
  { time: '10:18', price: 13.95 },
  { time: '10:19', price: 13.96 },
  { time: '10:20', price: 13.90 },
  { time: '10:21', price: 13.93 },
  { time: '10:22', price: 13.94 },
  { time: '10:23', price: 13.95 },
  { time: '10:24', price: 13.95 },
];

export function lastMinutePoints(data: MinutePoint[], count: number): MinutePoint[] {
  return data.slice(-count)
}
