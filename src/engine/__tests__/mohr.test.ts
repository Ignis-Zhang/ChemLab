import { describe, it, expect } from 'vitest'
import { evaluateModule } from '../evaluate'
import { mohr } from '../../experiments/mohr'

// 示例数据：铁屑 4.00 g，残留 0.50 g → 已反应 3.50 g；实际产品 18.4 g
const GOOD = {
  m_fe_initial: 4.0,
  m_fe_residue: 0.5,
  m_product: 18.4,
}

const theo = (3.5 / mohr.constants.M_Fe) * mohr.constants.M_Mohr // 理论莫尔盐质量

const msgBy = (out: ReturnType<typeof evaluateModule>) =>
  new Map(out.validations.map((v) => [v.ruleId, v]))

describe('莫尔盐实验引擎求值（自动推算链条）', () => {
  const out = evaluateModule(mohr, GOOD)
  const d = out.derived

  it('已反应铁屑 = 初始 − 残留', () => {
    expect(d.m_fe_reacted).toBeCloseTo(3.5, 8)
  })

  it('n(Fe) = m(Fe) / M(Fe)', () => {
    expect(d.n_fe).toBeCloseTo(3.5 / mohr.constants.M_Fe, 8)
  })

  it('生成硫酸亚铁 = n(Fe) × M(FeSO₄)', () => {
    expect(d.m_feso4).toBeCloseTo(d.n_fe * mohr.constants.M_FeSO4, 8)
  })

  it('需用硫酸铵 = n(Fe) × M((NH₄)₂SO₄)', () => {
    expect(d.m_as_needed).toBeCloseTo(d.n_fe * mohr.constants.M_AS, 8)
  })

  it('理论莫尔盐产量 = n(Fe) × M(莫尔盐)', () => {
    expect(d.m_mohr_theo).toBeCloseTo((3.5 / mohr.constants.M_Fe) * mohr.constants.M_Mohr, 8)
    expect(d.m_mohr_theo).toBeCloseTo(theo, 8)
  })

  it('产率 = 实际 / 理论 × 100', () => {
    expect(d.yield_pct).toBeCloseTo((18.4 / theo) * 100, 8)
  })

  it('结果显示格式化：产率 dp:1', () => {
    expect(out.results.yield_pct.display).toMatch(/^\d+\.\d$/)
  })

  it('缺输入不崩溃，显示占位符', () => {
    const o = evaluateModule(mohr, {})
    expect(o.results.m_mohr_theo.display).toBe('—')
    expect(o.results.yield_pct.display).toBe('—')
    expect(o.derived.yield_pct).toBeNaN()
  })
})

describe('莫尔盐实验校验规则', () => {
  it('负初始铁屑触发 error', () => {
    const out = evaluateModule(mohr, { ...GOOD, m_fe_initial: -1 })
    expect(msgBy(out).get('initial_positive')?.severity).toBe('error')
  })

  it('残留铁屑为负触发 error', () => {
    const out = evaluateModule(mohr, { ...GOOD, m_fe_residue: -1 })
    expect(msgBy(out).get('residue_nonneg_le_initial')?.severity).toBe('error')
  })

  it('残留铁屑大于初始铁屑触发 error', () => {
    const out = evaluateModule(mohr, { ...GOOD, m_fe_residue: 5 })
    expect(msgBy(out).get('residue_nonneg_le_initial')?.severity).toBe('error')
  })

  it('负实际产品质量触发 error', () => {
    const out = evaluateModule(mohr, { ...GOOD, m_product: -1 })
    expect(msgBy(out).get('product_positive')?.severity).toBe('error')
  })

  it('产率超 110% 触发 yield_range warning', () => {
    const out = evaluateModule(mohr, { ...GOOD, m_product: theo * 1.2 })
    expect(msgBy(out).get('yield_range')?.severity).toBe('warning')
  })

  it('产率低于 60% 触发 yield_low warning', () => {
    const out = evaluateModule(mohr, { ...GOOD, m_product: theo * 0.5 })
    expect(msgBy(out).get('yield_low')?.severity).toBe('warning')
  })

  it('良好数据产率正常，yield_low 显示合格', () => {
    const out = evaluateModule(mohr, GOOD)
    const m = msgBy(out)
    expect(m.get('yield_range')).toBeUndefined()
    expect(m.get('yield_low')?.message).toContain('合格')
  })
})
