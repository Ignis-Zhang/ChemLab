import type { LookupTable } from '../engine/types'

/**
 * 水饱和蒸气压查表（0–30 °C，1 °C 步长）。
 * 数据来源：CRC Handbook of Chemistry and Physics / steam tables。
 * 单位：kPa。25 °C 时 ≈ 3.169 kPa ≈ 23.76 mmHg。
 */
export const H2O_VAPOR_PRESSURE_KPA: Array<[number, number]> = [
  [0, 0.611], [5, 0.872], [10, 1.228], [11, 1.312], [12, 1.402],
  [13, 1.497], [14, 1.598], [15, 1.705], [16, 1.818], [17, 1.938],
  [18, 2.064], [19, 2.197], [20, 2.339], [21, 2.488], [22, 2.644],
  [23, 2.809], [24, 2.984], [25, 3.169], [26, 3.363], [27, 3.567],
  [28, 3.781], [29, 4.005], [30, 4.242],
]

/** 以查表形式暴露给引擎。 */
export const H2O_VAPOR_PRESSURE_TABLE: LookupTable = {
  kind: 'vapor-pressure-water',
  unit: 'kPa',
  points: H2O_VAPOR_PRESSURE_KPA,
}

/** 便利函数：按温度(°C)查饱和水蒸气压(kPa)，线性插值。 */
export function h2oVaporPressureKpa(t: number): number {
  const pts = H2O_VAPOR_PRESSURE_KPA
  if (pts.length === 0) return 0
  if (t <= pts[0][0]) return pts[0][1]
  if (t >= pts[pts.length - 1][0]) return pts[pts.length - 1][1]
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i]
    const [x1, y1] = pts[i + 1]
    if (t >= x0 && t <= x1) {
      const r = (t - x0) / (x1 - x0)
      return y0 + r * (y1 - y0)
    }
  }
  return pts[pts.length - 1][1]
}
