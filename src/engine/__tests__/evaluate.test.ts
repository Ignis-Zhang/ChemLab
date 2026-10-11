import { describe, it, expect } from 'vitest'
import { evaluateModule } from '../evaluate'
import { magnesium } from '../../experiments/magnesium'
import { h2oVaporPressureKpa } from '../../lib/vaporPressure'

/**
 * 标准算例（三份平行）：T = 25.0 ℃，P = 101.325 kPa。
 * 三份镁质量 0.0250/0.0300/0.0350 g，V1/V2 依理想气体定律反推，使各组 Ar ≈ 24.305。
 * 读数在水平管与量气管液面同一水平进行（无液面差校正）。
 */
const INPUTS = {
  T: 25.0, // °C → 298.15 K
  P_atm: 101.325, // kPa
  // A：m=0.0250 g → V_H2 = 25.98 mL
  m_A: 0.025,
  V1_A: 22.0,
  V2_A: 47.98,
  // B：m=0.0300 g → V_H2 = 31.17 mL
  m_B: 0.03,
  V1_B: 20.0,
  V2_B: 51.17,
  // C：m=0.0350 g → V_H2 = 36.37 mL
  m_C: 0.035,
  V1_C: 18.0,
  V2_C: 54.37,
}

describe('镁实验引擎求值（三份平行）', () => {
  const out = evaluateModule(magnesium, INPUTS)
  const C = out.constants
  const d = out.derived

  it('温度与体积换算正确', () => {
    expect(d.T_K).toBeCloseTo(298.15, 6)
    expect(d.V_H2_A).toBeCloseTo(25.98, 6)
    expect(d.V_H2_B).toBeCloseTo(31.17, 6)
    expect(d.V_H2_C).toBeCloseTo(36.37, 6)
    expect(d.V_H2_L_A).toBeCloseTo(0.02598, 8)
  })

  it('气体压强无液面差校正：P_gas = P_atm', () => {
    expect(d.P_H2O_kPa).toBeCloseTo(h2oVaporPressureKpa(25.0), 6)
    expect(d.P_H2O_atm).toBeCloseTo(d.P_H2O_kPa / C.kPa_per_atm, 6)
    // 无 h 液面差校正，气体压即大气压
    expect(d.P_gas_atm).toBeCloseTo(101.325 / C.kPa_per_atm, 6)
    expect(d.P_gas_atm).toBeCloseTo(1.0, 6)
  })

  it('氢分压与理想气体定律求 n(H₂)（端到端）', () => {
    const pH2 = d.P_gas_atm - d.P_H2O_atm
    const expected_nA = pH2 * (25.98 / 1000) / (C.R_atm_L * 298.15)
    expect(d.n_H2_A).toBeCloseTo(expected_nA, 10)
    expect(d.n_H2_A).toBeGreaterThan(0.0009)
    expect(d.n_H2_A).toBeLessThan(0.0012)
  })

  it('三份 Ar 均接近理论值 24.305', () => {
    expect(d.n_Mg_A).toBeCloseTo(d.n_H2_A, 12)
    expect(d.Ar_A).toBeCloseTo(INPUTS.m_A / d.n_H2_A, 8)
    expect(d.Ar_B).toBeCloseTo(INPUTS.m_B / d.n_H2_B, 8)
    expect(d.Ar_A).toBeCloseTo(24.305, 2)
    expect(d.Ar_B).toBeCloseTo(24.305, 2)
    expect(d.Ar_C).toBeCloseTo(24.305, 2)
  })

  it('Ar 平均值与相对误差正确', () => {
    expect(d.Ar_avg).toBeCloseTo((d.Ar_A + d.Ar_B + d.Ar_C) / 3, 8)
    const rel = (d.Ar_avg - C.Ar_Mg_theo) / C.Ar_Mg_theo * 100
    expect(d.Ar_avg_rel_err).toBeCloseTo(rel, 8)
    expect(d.Ar_avg).toBeCloseTo(24.305, 3)
    expect(Math.abs(d.Ar_avg_rel_err)).toBeLessThan(0.01)
  })

  it('结果显示格式化：sigFigs 与相对误差 dp', () => {
    expect(out.results.Ar_avg.display).not.toBe('—')
    const str = out.results.Ar_avg.display
    const cleaned = str.replace('.', '').replace('-', '')
    // sigFigs:3 → 最多 3 位有效数字
    expect(cleaned.length).toBeLessThanOrEqual(3)
    // Ar_avg_rel_err 用 dp:2
    expect(out.results.Ar_avg_rel_err.display).toMatch(/^-?\d+\.\d{2}$/)
  })
})

describe('镁实验缺输入', () => {
  it('三份不完整时不崩溃，显示占位符', () => {
    const out = evaluateModule(magnesium, { T: 25, P_atm: 101.325 })
    expect(out).toBeTruthy()
    expect(out.results.Ar_avg.display).toBe('—')
    expect(out.derived.Ar_avg).toBeNaN()
  })
})
