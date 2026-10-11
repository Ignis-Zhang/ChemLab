import type { ExperimentModule } from '../engine/types'

/**
 * 实验 2（教材第5章 实验3）：由废铁屑制备莫尔盐（reference/lab2.pdf）。
 *
 * 原理：
 *   铁屑与稀硫酸反应得硫酸亚铁，再与硫酸铵复盐结晶得莫尔盐：
 *     Fe + H₂SO₄(稀) → FeSO₄ + H₂↑
 *     FeSO₄ + (NH₄)₂SO₄ + 6H₂O → (NH₄)₂SO₄·FeSO₄·6H₂O
 * 铁屑含 As/P/S 杂质，反应产生 AsH₃、PH₃、H₂S 等有毒气体，须在通风橱中进行。
 *
 * 数据处理链条（教材步骤 2、3）：
 *   初始铁屑 − 残留铁屑（残渣烘干称重）= 已反应铁屑用量
 *   → 由 1:1 化学计量推 n(Fe)、生成的 FeSO₄、所需 (NH₄)₂SO₄ 与理论莫尔盐产量
 *   → 产率 = 实际产品质量 / 理论产量 × 100%。
 */
export const mohr: ExperimentModule = {
  id: 'mohr',
  category: 'inorganic',
  title: '由废铁屑制备莫尔盐',
  objective:
    '铁屑与稀硫酸反应制得硫酸亚铁，再与硫酸铵复盐结晶得莫尔盐(硫酸亚铁铵)。输入初始铁屑、残留铁屑与实际产品质量，自动推算已反应铁屑、生成的硫酸亚铁、(NH₄)₂SO₄ 需用量与理论产量，并计算产率。',
  brief: [
    '反应：Fe + H₂SO₄(稀) → FeSO₄ + H₂↑',
    '       FeSO₄ + (NH₄)₂SO₄ + 6H₂O → (NH₄)₂SO₄·FeSO₄·6H₂O',
    '1. 铁屑用饱和 Na₂CO₃ 除油污、加热 3–4 min，倾析去碱液、蒸馏水洗净',
    '2. 铁屑 + 25 mL 3 mol/L H₂SO₄，65 ℃ 水浴搅拌至仅剩少量气泡（约 40 min），pH<3，趁热减压过滤，残渣烘干称重',
    '3. 按生成的硫酸亚铁推算 (NH₄)₂SO₄ 用量，水浴溶解(<60 ℃)、冷却结晶、减压抽滤、乙醇洗涤',
    '4. 称重实际产品，与理论莫尔盐产量比较计算产率',
  ].join('\n'),
  prerequisite:
    '本实验须在通风橱中进行（铁屑含 As/P/S 杂质，与稀硫酸反应会产生 AsH₃、PH₃、H₂S 等有毒气体）；反应时应不断搅拌以防局部过热、避免硫酸亚铁晶体过早析出。',
  meta: {
    references: {
      '莫尔盐': '硫酸亚铁铵 (NH₄)₂SO₄·FeSO₄·6H₂O，浅绿色单斜晶体，易溶于水、难溶于乙醇',
      '反应①': 'Fe + H₂SO₄(稀) → FeSO₄ + H₂↑',
      '反应②': 'FeSO₄ + (NH₄)₂SO₄ + 6H₂O → (NH₄)₂SO₄·FeSO₄·6H₂O',
    },
  },
  constants: {
    M_Fe: 55.845, // 相对原子质量 Fe
    M_FeSO4: 151.908, // 硫酸亚铁 FeSO₄
    M_AS: 132.14, // 硫酸铵 (NH₄)₂SO₄
    M_Mohr: 392.14, // 莫尔盐 (NH₄)₂SO₄·FeSO₄·6H₂O
    yield_max: 110, // 产率合理上限（%），用于提醒可能的杂质/含水
  },
  units: { pressure: 'kPa', volume: 'mL', temperature: '°C', mass: 'g' },

  inputs: [
    // —— 铁屑净化与硫酸亚铁制备 ——
    {
      id: 'm_fe_initial',
      label: '铁屑质量',
      unit: 'g',
      type: 'number',
      step: 0.01,
      group: 'fe',
      groupLabel: '铁屑净化与硫酸亚铁制备',
      range: { min: 0, max: 8 },
      hint: '饱和 Na₂CO₃ 除油污、水洗净后称重（教材称取约 4 g）',
    },
    {
      id: 'm_fe_residue',
      label: '残留铁屑质量',
      unit: 'g',
      type: 'number',
      step: 0.01,
      group: 'fe',
      groupLabel: '铁屑净化与硫酸亚铁制备',
      range: { min: 0, max: 8 },
      hint: '趁热减压过滤后，残留铁屑用滤纸吸干、烘干称重',
    },
    // —— 莫尔盐制备与称量 ——
    {
      id: 'm_product',
      label: '实际莫尔盐产品质量',
      unit: 'g',
      type: 'number',
      step: 0.01,
      group: 'product',
      groupLabel: '莫尔盐制备与称量',
      range: { min: 0, max: 60 },
      hint: '减压抽滤、少量无水乙醇洗涤、干燥后称得的晶体质量',
    },
  ],

  derived: [
    // 已反应铁屑用量 = 初始 − 残留
    { id: 'm_fe_reacted', label: '已反应铁屑 (g)', expression: (c) => c.inputs.m_fe_initial - c.inputs.m_fe_residue },
    // 铁的物质的量（Fe → FeSO₄ → 莫尔盐 均 1:1）
    { id: 'n_fe', label: '铁物质的量 (mol)', expression: (c) => c.derived.m_fe_reacted / c.constants.M_Fe },
    // 生成的硫酸亚铁质量（步骤 2 产物）
    { id: 'm_feso4', label: '生成硫酸亚铁 (g)', expression: (c) => c.derived.n_fe * c.constants.M_FeSO4 },
    // 步骤 3 所需硫酸铵用量
    { id: 'm_as_needed', label: '需用硫酸铵 (g)', expression: (c) => c.derived.n_fe * c.constants.M_AS },
    // 理论莫尔盐产量
    { id: 'm_mohr_theo', label: '理论莫尔盐产量 (g)', expression: (c) => c.derived.n_fe * c.constants.M_Mohr },
    // 产率
    { id: 'yield_pct', label: '产率 (%)', expression: (c) => (c.inputs.m_product / c.derived.m_mohr_theo) * 100 },
  ],

  results: [
    { id: 'm_fe_reacted', label: '已反应铁屑', unit: 'g', dp: 2 },
    { id: 'm_feso4', label: '生成硫酸亚铁', unit: 'g', dp: 2 },
    { id: 'm_as_needed', label: '需用硫酸铵(理论)', unit: 'g', dp: 2 },
    { id: 'm_mohr_theo', label: '理论莫尔盐产量', unit: 'g', dp: 2 },
    { id: 'yield_pct', label: '产率', unit: '%', dp: 1, kind: 'percentage' },
  ],

  validations: [
    {
      id: 'initial_positive',
      severity: 'error',
      check: (c) => ({ ok: c.inputs.m_fe_initial >= 0, message: '洗净铁屑质量必须为正，请核对称量数据。' }),
    },
    {
      id: 'residue_nonneg_le_initial',
      severity: 'error',
      check: (c) => {
        const init = c.inputs.m_fe_initial
        const res = c.inputs.m_fe_residue
        if (res < 0) return { ok: false, message: '残留铁屑质量不能为负，请核对称量数据。' }
        if (Number.isFinite(init) && res > init) {
          return { ok: false, message: '残留铁屑质量不能大于初始铁屑质量，请检查是否称重有误。' }
        }
        return { ok: true }
      },
    },
    {
      id: 'product_positive',
      severity: 'error',
      check: (c) => ({ ok: c.inputs.m_product >= 0, message: '实际产品质量必须为正，请核对称量数据。' }),
    },
    {
      id: 'reaction_extent',
      severity: 'info',
      alwaysShow: true,
      check: (c) => {
        const reacted = c.derived.m_fe_reacted
        const init = c.inputs.m_fe_initial
        if (!Number.isFinite(reacted) || !Number.isFinite(init) || init === 0) {
          return { ok: true, message: '输入完整数据后将自动显示已反应铁屑用量及其占初始铁屑的比例。' }
        }
        const frac = reacted / init
        const ok = frac >= 0.7
        return {
          ok,
          message: `已反应铁屑 ${reacted.toFixed(3)} g，占初始铁屑 ${(frac * 100).toFixed(1)}%${ok ? '，反应较充分。' : '，偏低——可能有大量铁屑未反应（酸量不足或反应时间不够）。'}`,
        }
      },
    },
    {
      id: 'yield_range',
      severity: 'warning',
      check: (c) => {
        const y = c.derived.yield_pct
        if (!Number.isFinite(y)) return { ok: false, message: '输入未完整，尚无法计算产率。' }
        if (y > c.constants.yield_max) {
          return { ok: false, message: `产率 ${y.toFixed(1)}% 超过合理上限，产品可能含杂质或未充分干燥。` }
        }
        if (y > 100) {
          return { ok: false, message: `产率 ${y.toFixed(1)}% 略超 100%，可能含杂质或水分，请核对。` }
        }
        return { ok: true }
      },
    },
    {
      id: 'yield_low',
      severity: 'warning',
      alwaysShow: true,
      check: (c) => {
        const y = c.derived.yield_pct
        if (!Number.isFinite(y)) return { ok: true }
        return {
          ok: y >= 60,
          message: y < 60
            ? `产率 ${y.toFixed(1)}% 偏低，可能有产物损失（洗涤/转移/析晶不完全）。`
            : `产率 ${y.toFixed(1)}%，合格。`,
        }
      },
    },
  ],
}
