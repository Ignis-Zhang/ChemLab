import type { EvalContext, ExperimentModule } from '../engine/types'
import { H2O_VAPOR_PRESSURE_TABLE } from '../lib/vaporPressure'

/**
 * 实验 15：金属镁相对原子量的测定（教材 第7章 实验15，reference/Lab1.pdf）。
 *
 * 原理：Mg + H₂SO₄(稀) → MgSO₄ + H₂↑
 * 用分析天平直接称取三份镁条，排水集气测 H₂ 体积，
 * 由理想气体定律（氢分压 = 大气压 − 室温饱和水蒸气压）求 n(H₂)，
 * 由化学计量 n(Mg)=n(H₂)，得 Ar = m/n；三份平行取平均值并与理论值 24.305 比较。
 *
 * 约定：读数时须使水平管与量气管内液面保持同一水平（故无液面差静压校正）。
 * 单位：内部用 atm / L / K，R = 0.08206 atm·L·mol⁻¹·K⁻¹；输入压强为 kPa。
 */
export const magnesium: ExperimentModule = {
  id: 'magnesium',
  category: 'inorganic',
  title: '金属镁相对原子量的测定',
  objective:
    '镁与过量稀硫酸反应置换出氢，用排水集气测 H₂ 体积，依理想气体定律求镁物质的量，从而测定镁的相对原子量；三份平行取均值并与理论值 24.305 比较。',
  brief: [
    '反应：Mg + H₂SO₄(稀) → MgSO₄ + H₂↑',
    '1. 打磨镁条去除氧化膜，分析天平直接称取三份（每份约 0.0250–0.0350 g）',
    '2. 每份分三次实验：量气管以排水集气记录 H₂ 体积 V(H₂) = V2 − V1',
    '3. 记录温度 T、大气压 P；读取时水平管与量气管液面保持同一水平',
    '4. H₂ 分压 P(H₂) = P − P(水)；由理想气体定律求 n(H₂)，得 Ar = m / n',
    '5. 三份 Ar 取平均，与理论值 24.305 比较计算相对误差',
  ].join('\n'),
  prerequisite:
    '本实验使用稀硫酸（2 mol/L）与镁条反应，反应前须打磨镁条去除表面氧化膜；氢气的量气管内水面收集，故氢分压需扣除室温饱和水蒸气压。',
  meta: {
    theoretical: { Ar_Mg_theo: 24.305 },
    references: { 'Ar(Mg)': 'IUPAC 相对原子质量：24.305' },
  },
  constants: {
    R_atm_L: 0.08206, // atm·L·mol⁻¹·K⁻¹
    kPa_per_atm: 101.325,
    stoich_Mg_to_H2: 1, // 1 mol Mg → 1 mol H₂
  },
  tables: {
    h2o: H2O_VAPOR_PRESSURE_TABLE,
  },
  units: { pressure: 'kPa', volume: 'mL', temperature: '°C', mass: 'g' },

  inputs: [
    // —— 共享参数（三份实验共用） ——
    {
      id: 'T',
      label: '水浴温度 (T)',
      unit: '°C',
      type: 'number',
      step: 0.01,
      range: { min: 10, max: 35 },
      hint: '室温附近；用于查室温下的饱和水蒸气压',
      group: 'common',
    },
    {
      id: 'P_atm',
      label: '大气压 (P)',
      unit: 'kPa',
      type: 'number',
      step: 0.1,
      default: 101.325,
      range: { min: 95, max: 106 },
      hint: '由气压计读取',
      group: 'common',
    },
    // —— 第 1 组 ——
    {
      id: 'm_A',
      label: '镁条质量 (m_1)',
      unit: 'g',
      type: 'number',
      step: 0.0001,
      range: { min: 0.025, max: 0.035 },
      hint: '分析天平直接称取；镁条须打磨去除氧化膜后再称',
      group: 'A',
    },
    {
      id: 'V1_A',
      label: '量管初始读数 (V_始)',
      unit: 'mL',
      type: 'number',
      step: 0.01,
      range: { min: 0, max: 100 },
      group: 'A',
    },
    {
      id: 'V2_A',
      label: '量管最终读数 (V_终)',
      unit: 'mL',
      type: 'number',
      step: 0.01,
      range: { min: 0, max: 100 },
      hint: '读取时水平管与量气管内液面保持同一水平',
      group: 'A',
    },
    // —— 第 2 组 ——
    {
      id: 'm_B',
      label: '镁条质量 (m_2)',
      unit: 'g',
      type: 'number',
      step: 0.0001,
      range: { min: 0.025, max: 0.035 },
      hint: '分析天平直接称取；镁条须打磨去除氧化膜后再称',
      group: 'B',
    },
    {
      id: 'V1_B',
      label: '量管初始读数 (V_始)',
      unit: 'mL',
      type: 'number',
      step: 0.01,
      range: { min: 0, max: 100 },
      group: 'B',
    },
    {
      id: 'V2_B',
      label: '量管最终读数 (V_终)',
      unit: 'mL',
      type: 'number',
      step: 0.01,
      range: { min: 0, max: 100 },
      hint: '读取时水平管与量气管内液面保持同一水平',
      group: 'B',
    },
    // —— 第 3 组 ——
    {
      id: 'm_C',
      label: '镁条质量 (m_3)',
      unit: 'g',
      type: 'number',
      step: 0.0001,
      range: { min: 0.025, max: 0.035 },
      hint: '分析天平直接称取；镁条须打磨去除氧化膜后再称',
      group: 'C',
    },
    {
      id: 'V1_C',
      label: '量管初始读数 (V_始)',
      unit: 'mL',
      type: 'number',
      step: 0.01,
      range: { min: 0, max: 100 },
      group: 'C',
    },
    {
      id: 'V2_C',
      label: '量管最终读数 (V_终)',
      unit: 'mL',
      type: 'number',
      step: 0.01,
      range: { min: 0, max: 100 },
      hint: '读取时水平管与量气管内液面保持同一水平',
      group: 'C',
    },
  ],

  derived: [
    // 公共换算
    { id: 'T_K', label: '温度 (K)', expression: (c) => c.inputs.T + 273.15 },
    { id: 'P_H2O_kPa', label: '水蒸气压 (kPa)', expression: (c) => c.helpers.interp(c.tables.h2o, c.inputs.T) },
    { id: 'P_H2O_atm', label: '水蒸气压 (atm)', expression: (c) => c.derived.P_H2O_kPa / c.constants.kPa_per_atm },
    { id: 'P_gas_atm', label: '气体压强 (atm)', expression: (c) => c.inputs.P_atm / c.constants.kPa_per_atm },
    // 第 1 组
    { id: 'V_H2_A', label: 'H₂ 体积 1 (mL)', expression: (c) => c.inputs.V2_A - c.inputs.V1_A },
    { id: 'V_H2_L_A', label: 'H₂ 体积 1 (L)', expression: (c) => c.derived.V_H2_A / 1000 },
    { id: 'n_H2_A', label: 'H₂ 物质的量 1', expression: (c) => (c.derived.P_gas_atm - c.derived.P_H2O_atm) * c.derived.V_H2_L_A / (c.constants.R_atm_L * c.derived.T_K) },
    { id: 'n_Mg_A', label: 'Mg 物质的量 1', expression: (c) => c.derived.n_H2_A / c.constants.stoich_Mg_to_H2 },
    { id: 'Ar_A', label: '相对原子质量 1', expression: (c) => c.inputs.m_A / c.derived.n_Mg_A },
    // 第 2 组
    { id: 'V_H2_B', label: 'H₂ 体积 2 (mL)', expression: (c) => c.inputs.V2_B - c.inputs.V1_B },
    { id: 'V_H2_L_B', label: 'H₂ 体积 2 (L)', expression: (c) => c.derived.V_H2_B / 1000 },
    { id: 'n_H2_B', label: 'H₂ 物质的量 2', expression: (c) => (c.derived.P_gas_atm - c.derived.P_H2O_atm) * c.derived.V_H2_L_B / (c.constants.R_atm_L * c.derived.T_K) },
    { id: 'n_Mg_B', label: 'Mg 物质的量 2', expression: (c) => c.derived.n_H2_B / c.constants.stoich_Mg_to_H2 },
    { id: 'Ar_B', label: '相对原子质量 2', expression: (c) => c.inputs.m_B / c.derived.n_Mg_B },
    // 第 3 组
    { id: 'V_H2_C', label: 'H₂ 体积 3 (mL)', expression: (c) => c.inputs.V2_C - c.inputs.V1_C },
    { id: 'V_H2_L_C', label: 'H₂ 体积 3 (L)', expression: (c) => c.derived.V_H2_C / 1000 },
    { id: 'n_H2_C', label: 'H₂ 物质的量 3', expression: (c) => (c.derived.P_gas_atm - c.derived.P_H2O_atm) * c.derived.V_H2_L_C / (c.constants.R_atm_L * c.derived.T_K) },
    { id: 'n_Mg_C', label: 'Mg 物质的量 3', expression: (c) => c.derived.n_H2_C / c.constants.stoich_Mg_to_H2 },
    { id: 'Ar_C', label: '相对原子质量 3', expression: (c) => c.inputs.m_C / c.derived.n_Mg_C },
    // 汇总
    { id: 'Ar_avg', label: '相对原子质量平均', expression: (c) => (c.derived.Ar_A + c.derived.Ar_B + c.derived.Ar_C) / 3 },
    { id: 'Ar_avg_rel_err', label: '平均相对误差 (%)', expression: (c) => (c.derived.Ar_avg - c.constants.Ar_Mg_theo) / c.constants.Ar_Mg_theo * 100 },
  ],

  results: [
    { id: 'Ar_A', label: 'Ar_1 测定值', unit: '', sigFigs: 3 },
    { id: 'Ar_B', label: 'Ar_2 测定值', unit: '', sigFigs: 3 },
    { id: 'Ar_C', label: 'Ar_3 测定值', unit: '', sigFigs: 3 },
    { id: 'Ar_avg', label: 'Ar 平均值', unit: '', sigFigs: 3 },
    { id: 'Ar_avg_rel_err', label: '平均相对误差', unit: '%', dp: 2, kind: 'percentage' },
  ],

  validations: [
    // —— 质量为正 / 体积为正 / 质量合理区间（三份） ——
    ...[...'ABC'].flatMap((g) => [
      {
        id: `mass_positive_${g}`,
        severity: 'error' as const,
        check: (c: EvalContext) => ({ ok: c.inputs[`m_${g}`] >= 0, message: `镁条质量 m(${g}) 必须为正，请检查称量数据。` }),
      },
      {
        id: `V_positive_${g}`,
        severity: 'error' as const,
        check: (c: EvalContext) => ({ ok: c.inputs[`V2_${g}`] - c.inputs[`V1_${g}`] >= 0, message: `H₂ 体积 V2−V1 (${g}) 必须为正，请确认量管读数方向。` }),
      },
      {
        id: `m_reasonable_${g}`,
        severity: 'warning' as const,
        alwaysShow: true,
        check: (c: EvalContext) => {
          const m = c.inputs[`m_${g}`]
          if (!Number.isFinite(m)) return { ok: true }
          return {
            ok: m >= 0.025 && m <= 0.035,
            message: `镁条质量 (${g}) 应为约 0.0250–0.0350 g，当前 ${m.toFixed(4)} g${m < 0.025 ? '偏小' : '偏大'}，请核对。`,
          }
        },
      },
    ]),
    // —— Ar_avg 合理范围 ——
    {
      id: 'Ar_avg_range',
      severity: 'warning',
      check: (c) => {
        const Ar = c.derived.Ar_avg
        if (!Number.isFinite(Ar)) return { ok: false, message: '输入未完整，尚无法计算 Ar 平均值。' }
        return {
          ok: Ar >= 22 && Ar <= 27,
          message: `Ar 平均值 = ${Ar.toFixed(3)} 超出合理范围 22–27，可能存在气泡、漏气或读数误差。`,
        }
      },
    },
    // —— 三份一致性（相对极差） ——
    {
      id: 'Ar_each_spread',
      severity: 'warning',
      check: (c) => {
        const vals = [c.derived.Ar_A, c.derived.Ar_B, c.derived.Ar_C].filter(Number.isFinite)
        if (vals.length < 3) return { ok: true }
        const max = Math.max(...vals)
        const min = Math.min(...vals)
        const avg = (max + min) / 2
        if (avg === 0) return { ok: true }
        const spread = (max - min) / avg
        return {
          ok: spread < 0.05,
          message: `三份 Ar 差异较大（相对极差 ${(spread * 100).toFixed(1)}%），请检查是否有漏气、气泡混入或读数误差。`,
        }
      },
    },
    // —— 每份 H₂ 体积合理 ——
    ...[...'ABC'].map((g) => ({
      id: `volume_reasonable_${g}`,
      severity: 'warning' as const,
      check: (c: EvalContext) => {
        const V = c.derived[`V_H2_${g}`]
        if (!Number.isFinite(V) || V <= 0) return { ok: true }
        return {
          ok: V >= 20 && V <= 40,
          message: `H₂ 体积 (${g}) = ${V.toFixed(2)} mL 偏离正常范围 20–40 mL，请核对量管读数。`,
        }
      },
    })),
    // —— 理论值对比（含思考题反馈） ——
    {
      id: 'theo_compare_avg',
      severity: 'info',
      alwaysShow: true,
      check: (c) => {
        const rel = c.derived.Ar_avg_rel_err
        return {
          ok: true,
          message: Number.isFinite(rel)
            ? `理论 Ar(Mg) = 24.305，三份平均相对误差 ${rel.toFixed(2)}%。注意：氧化膜未擦净或读数未同一水平会引入系统误差，未冷却至室温读数会使 H₂ 体积偏大、Ar 偏低。`
            : '输入完整数据后自动显示三份平均相对误差。',
        }
      },
    },
  ],
}
