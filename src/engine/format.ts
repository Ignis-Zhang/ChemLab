import type { ResultField } from './types'

/**
 * 数值格式化：支持固定小数位 (dp) 或有效数字 (sigFigs) 两种模式。
 */

export function roundTo(value: number, dp: number): number {
  const factor = 10 ** dp
  return Math.round(value * factor) / factor
}

/** 保留 N 位有效数字，返回字符串（去掉多余末尾零）。 */
export function toSigFigs(value: number, sigFigs: number): string {
  if (!Number.isFinite(value)) return '—'
  if (value === 0) return (0).toPrecision(sigFigs)
  return String(Number(value.toPrecision(sigFigs)))
}

/** 按 ResultField 配置格式化一个数值。 */
export function formatDisplay(value: number, field: ResultField): string {
  if (!Number.isFinite(value)) return '—'
  if (field.sigFigs !== undefined) {
    return toSigFigs(value, field.sigFigs)
  }
  if (field.dp !== undefined) {
    return value.toFixed(field.dp)
  }
  // 未指定则保留合理精度
  return roundTo(value, 3).toString()
}
