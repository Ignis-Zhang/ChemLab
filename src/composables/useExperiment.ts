import { computed, reactive } from 'vue'
import type { ExperimentModule } from '../engine/types'
import { evaluateModule } from '../engine/evaluate'

/**
 * 将纯求值函数绑定到 Vue 响应式系统中的组合式函数。
 * inputValues 使用 reactive，output 用 computed 包裹 evaluateModule，
 * Vue 自动跟踪字段级依赖实现实时重算。
 */
export function useExperiment(module: ExperimentModule) {
  // 表单模型：key = 输入字段 id
  const inputValues = reactive<Record<string, number | null>>({})
  for (const f of module.inputs) {
    inputValues[f.id] = f.default ?? null
  }

  // 仅保留合法有限数，过滤 null / NaN / Infinity
  const sanitized = computed<Record<string, number>>(() => {
    const out: Record<string, number> = {}
    for (const id of Object.keys(inputValues)) {
      const v = inputValues[id]
      if (v != null && Number.isFinite(v)) out[id] = v
    }
    return out
  })

  // 实时重算（纯函数 + computed）
  const output = computed(() => evaluateModule(module, sanitized.value))

  return { module, inputValues, output }
}
