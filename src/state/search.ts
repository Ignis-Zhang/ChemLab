import { ref } from 'vue'

/**
 * 全局搜索词状态：页头搜索框与实验列表（侧边栏 / 首页卡片）共享，
 * 通过 query 过滤展示的实验模块，模拟 MkDocs 的全站搜索交互。
 */
export const searchQuery = ref('')

/** 极简中文分词过滤：拆成连续子串，任一命中即可。 */
export function matchesSearch(searchable: string, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return searchable.toLowerCase().includes(q)
}
