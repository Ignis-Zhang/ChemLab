import { describe, it, expect } from 'vitest'
import {
  CATEGORY_MAP,
  CATEGORIES,
  modulesByCategory,
  isCategory,
} from '../../lib/categories'
import { MODULES } from '../registry'

describe('学科分类表（categories）', () => {
  it('CATEGORIES 覆盖四个学科，id 唯一', () => {
    const ids = CATEGORIES.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toContain('inorganic')
    expect(ids).toContain('organic')
    expect(ids).toContain('analytical')
    expect(ids).toContain('physical')
  })

  it('CATEGORY_MAP 为 4 个学科各提供一个条目', () => {
    expect(Object.keys(CATEGORY_MAP)).toHaveLength(4)
    expect(CATEGORY_MAP['inorganic']?.name).toBe('无机化学')
    expect(CATEGORY_MAP['physical']?.name).toBe('物理化学')
  })

  it('isCategory 判定学科 id 与无关字符串', () => {
    expect(isCategory('inorganic')).toBe(true)
    expect(isCategory('physical')).toBe(true)
    expect(isCategory('xx')).toBe(false)
    expect(isCategory('')).toBe(false)
  })
})

describe('模块按学科归组（modulesByCategory）', () => {
  it('当前实验模块总数 = 2，且全部属于无机化学', () => {
    expect(MODULES).toHaveLength(2)
    const inorganic = modulesByCategory(MODULES, 'inorganic')
    const ids = inorganic.map((m) => m.id)
    expect(ids).toContain('magnesium')
    expect(ids).toContain('mohr')
    expect(ids).toHaveLength(2)
  })

  it('镁 / 莫尔盐模块都标注了 category: inorganic', () => {
    for (const m of MODULES) {
      expect(m.category).toBe('inorganic')
    }
  })

  it('无实验的学科返回空数组，不崩溃', () => {
    expect(modulesByCategory(MODULES, 'organic')).toHaveLength(0)
    expect(modulesByCategory(MODULES, 'analytical')).toHaveLength(0)
    expect(modulesByCategory(MODULES, 'physical')).toHaveLength(0)
  })

  it('保持 MODULES 原生顺序', () => {
    const inorganic = modulesByCategory(MODULES, 'inorganic')
    expect(inorganic.map((m) => m.id)).toEqual(['magnesium', 'mohr'])
  })
})
