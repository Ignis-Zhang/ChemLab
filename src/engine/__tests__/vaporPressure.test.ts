import { describe, it, expect } from 'vitest'
import { h2oVaporPressureKpa, H2O_VAPOR_PRESSURE_KPA } from '../../lib/vaporPressure'

describe('水的饱和蒸气压查表', () => {
  it('返回已知端点值', () => {
    expect(h2oVaporPressureKpa(0)).toBeCloseTo(0.611, 3)
    expect(h2oVaporPressureKpa(25)).toBeCloseTo(3.169, 3)
    expect(h2oVaporPressureKpa(30)).toBeCloseTo(4.242, 3)
  })

  it('端点之外用边界值（外推夹取）', () => {
    expect(h2oVaporPressureKpa(-5)).toBeCloseTo(0.611, 3)
    expect(h2oVaporPressureKpa(40)).toBeCloseTo(4.242, 3)
  })

  it('在相邻点之间线性插值', () => {
    // 20°C 2.339, 21°C 2.488
    expect(h2oVaporPressureKpa(20.5)).toBeGreaterThan(2.339)
    expect(h2oVaporPressureKpa(20.5)).toBeLessThan(2.488)
    expect(h2oVaporPressureKpa(20.5)).toBeCloseTo((2.339 + 2.488) / 2, 3)
  })

  it('表点单调递增', () => {
    for (let i = 1; i < H2O_VAPOR_PRESSURE_KPA.length; i++) {
      expect(H2O_VAPOR_PRESSURE_KPA[i][1]).toBeGreaterThan(H2O_VAPOR_PRESSURE_KPA[i - 1][1])
    }
  })
})
