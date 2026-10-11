import type { ExperimentModule } from './types'
import { magnesium } from '../experiments/magnesium'
import { mohr } from '../experiments/mohr'

/**
 * 实验模块注册表。
 * 新增实验 = 新增配置文件 + 在此数组追加一项；无需改动组件/路由/引擎。
 */
export const MODULES: ExperimentModule[] = [magnesium, mohr]

const byId = new Map(MODULES.map((m) => [m.id, m]))

export const getModule = (id: string): ExperimentModule | undefined => byId.get(id)
