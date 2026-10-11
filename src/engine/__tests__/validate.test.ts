import { describe, it, expect } from 'vitest'
import { evaluateModule } from '../evaluate'
import { magnesium } from '../../experiments/magnesium'

const GOOD = {
  T: 25.0,
  P_atm: 101.325,
  m_A: 0.025, V1_A: 22.0, V2_A: 47.98,
  m_B: 0.03, V1_B: 20.0, V2_B: 51.17,
  m_C: 0.035, V1_C: 18.0, V2_C: 54.37,
}

const msgBy = (out: ReturnType<typeof evaluateModule>) =>
  new Map(out.validations.map((v) => [v.ruleId, v]))

describe('镁实验校验规则（三份平行）', () => {
  it('负质量触发 error', () => {
    const out = evaluateModule(magnesium, { ...GOOD, m_A: -0.02 })
    const m = msgBy(out)
    expect(m.get('mass_positive_A')?.severity).toBe('error')
  })

  it('负体积触发 error', () => {
    const out = evaluateModule(magnesium, { ...GOOD, V1_B: 60, V2_B: 50 })
    const m = msgBy(out)
    expect(m.get('V_positive_B')?.severity).toBe('error')
  })

  it('良好数据通过 Ar_avg_range 与 Ar_each_spread', () => {
    const out = evaluateModule(magnesium, GOOD)
    const m = msgBy(out)
    expect(m.get('Ar_avg_range')).toBeUndefined()
    expect(m.get('Ar_each_spread')).toBeUndefined()
  })

  it('异常 Ar 平均值触发 warning', () => {
    // 放大 C 的镁质量使 Ar_C 明显偏大，拖动 Ar_avg 超界
    const out = evaluateModule(magnesium, { ...GOOD, m_C: 0.05 })
    const m = msgBy(out)
    expect(m.get('Ar_avg_range')?.severity).toBe('warning')
  })

  it('三份差异过大触发 Ar_each_spread warning', () => {
    // 让 C 组 Ar 大幅偏离（把 C 的体积改小 → Ar 明显偏大）
    const out = evaluateModule(magnesium, { ...GOOD, V2_C: 30 })
    const m = msgBy(out)
    expect(m.get('Ar_each_spread')?.severity).toBe('warning')
  })

  it('质量超出合理区间触发 m_reasonable warning', () => {
    const out = evaluateModule(magnesium, { ...GOOD, m_A: 0.05 })
    const m = msgBy(out)
    expect(m.get('m_reasonable_A')?.severity).toBe('warning')
  })

  it('缺输入给出友好提示且不崩溃', () => {
    const out = evaluateModule(magnesium, { T: 25, P_atm: 101.325 })
    const m = msgBy(out)
    expect(m.get('Ar_avg_range')?.message).toContain('输入未完整')
  })

  it('理论对比信息始终展示', () => {
    const outEmpty = evaluateModule(magnesium, {})
    expect(msgBy(outEmpty).get('theo_compare_avg')?.severity).toBe('info')

    const outFull = evaluateModule(magnesium, GOOD)
    const info = msgBy(outFull).get('theo_compare_avg')
    expect(info?.message).toContain('相对误差')
    expect(info?.message).toContain('%')
  })
})
