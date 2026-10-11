import { readonly, ref } from 'vue'

export interface TocEntry {
  text: string
  /** 可选：锚点 id */
  target?: string
  kind?: 'result' | 'section'
}

/**
 * 页内目录（右侧栏）状态：由各页面发布，SiteLayout 负责渲染。
 * 模拟 MkDocs Material 的"页内目录"（On this page）效果。
 */
const entries = ref<TocEntry[]>([])

export const tocEntries = readonly(entries)

export function setToc(list: TocEntry[]) {
  entries.value = list
}

export function clearToc() {
  entries.value = []
}
