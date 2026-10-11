import type { ExperimentModule } from '../engine/types'

/**
 * 学科元数据表。
 * 顶部标签页 / 左侧侧边栏 / 首页 / 学科列表页共用，保证四个学科的顺序与命名一致。
 * 未来新增实验只需在实验模块上标注对应的 category id，即可自动归类。
 */
export interface Category {
  id: string
  name: string
  icon: string
  blurb: string
}

export const CATEGORIES: Category[] = [
  { id: 'inorganic', name: '无机化学', icon: '🧪', blurb: '元素及其化合物的制备、性质与物理化学参数测定' },
  { id: 'organic', name: '有机化学', icon: '⚗️', blurb: '有机物的制备、分离与表征' },
  { id: 'analytical', name: '分析化学', icon: '🔬', blurb: '定量分析与仪器分析方法' },
  { id: 'physical', name: '物理化学', icon: '⚖️', blurb: '热力学、动力学等物理化学参数测定' },
]

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
)

/** 取某学科下的所有实验模块（保持 MODULES 原生顺序）。 */
export function modulesByCategory(modules: ExperimentModule[], catId: string): ExperimentModule[] {
  return modules.filter((m) => m.category === catId)
}

/** 是否有可用的学科 id。 */
export function isCategory(catId: string): boolean {
  return catId in CATEGORY_MAP
}
