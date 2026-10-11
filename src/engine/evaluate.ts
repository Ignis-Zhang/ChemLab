import type {
  EngineOutput,
  ExperimentModule,
  EngineHelpers,
  EvalContext,
} from './types'
import { formatDisplay } from './format'

export const defaultHelpers: EngineHelpers = {
  /** 线性插值函数：tables>0 用首点，超出末点用末点。 */
  interp(table, x) {
    const pts = table.points
    if (pts.length === 0) return 0
    if (x <= pts[0][0]) return pts[0][1]
    if (x >= pts[pts.length - 1][0]) return pts[pts.length - 1][1]
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i]
      const [x1, y1] = pts[i + 1]
      if (x >= x0 && x <= x1) {
        const t = (x - x0) / (x1 - x0)
        return y0 + t * (y1 - y0)
      }
    }
    return pts[pts.length - 1][1]
  },
}

/**
 * 纯求值函数：按依赖顺序执行整个推导链，格式化结果，运行校验规则。
 * 不含任何副作用，可由 Vue computed 包裹以获得实时重算。
 */
export function evaluateModule(
  module: ExperimentModule,
  rawInputs: Record<string, number>,
  helpers: EngineHelpers = defaultHelpers,
): EngineOutput {
  const constants = { ...module.constants, ...module.meta?.theoretical }
  const ctx: EvalContext = {
    inputs: rawInputs,
    derived: {},
    constants,
    tables: module.tables ?? {},
    helpers,
  }

  // 1. 按声明顺序计算推导链
  for (const f of module.derived) {
    try {
      ctx.derived[f.id] = Number(f.expression(ctx))
    } catch {
      ctx.derived[f.id] = NaN
    }
  }

  // 2. 格式化结果
  const results: EngineOutput['results'] = {}
  for (const r of module.results) {
    const value = ctx.derived[r.id]
    results[r.id] = { value, display: formatDisplay(value, r) }
  }

  // 3. 跑校验规则
  const validations: EngineOutput['validations'] = []
  for (const rule of module.validations) {
    let out: { ok: boolean; message?: string }
    try {
      out = rule.check(ctx)
    } catch {
      out = { ok: true }
    }
    if (!out.ok && out.message) {
      validations.push({ ruleId: rule.id, severity: rule.severity, message: out.message })
    } else if (out.ok && rule.alwaysShow && out.message) {
      validations.push({ ruleId: rule.id, severity: rule.severity, message: out.message })
    }
  }

  return { derived: ctx.derived, results, validations, constants }
}
