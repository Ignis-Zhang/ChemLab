<script setup lang="ts">
import { onUnmounted } from 'vue'
import type { ExperimentModule } from '../engine/types'
import { MODULES } from '../engine/registry'
import { CATEGORIES, modulesByCategory } from '../lib/categories'
import { searchQuery, matchesSearch } from '../state/search'
import { setToc } from '../state/toc'

/** 搜索框命中学科名时，该学科整段保留展示。 */
const hitCategory = (catId: string): boolean => {
  const catName = CATEGORIES.find((c) => c.id === catId)?.name ?? ''
  return !searchQuery.value || matchesSearch(catName, searchQuery.value)
}

/** 每个学科下、过搜索词的实验模块（搜索命中学科名也保留该学科整体展示）。 */
const visibleIn = (catId: string): ExperimentModule[] =>
  modulesByCategory(MODULES, catId).filter((m) =>
    matchesSearch(`${m.title} ${m.objective}`, searchQuery.value),
  )

setToc([{ text: '项目说明' }, { text: '实验学科' }])
onUnmounted(() => setToc([]))
</script>

<template>
  <div class="content">
    <h1 class="content-title">无机化学实验数据处理</h1>
    <p class="content-meta">课程辅助工具 · 输入实验原始数据即时得到结果与反馈</p>

    <div id="sec-note" class="admonition admonition-note">
      <div class="admonition-title">说明</div>
      <p>
        同学们在实验时会记录许多原始数据，但要得到最终结果往往需要较复杂的计算，
        且实验结束后若结果异常也无法重做。本网站针对每个实验固定其数据处理流程，
        输入原始数据后即可<b>即时</b>获得最终结果与异常反馈——发现问题时可及时调整。
      </p>
      <p class="admonition-fine">纯前端静态站点：数据仅在浏览器本地计算，不上传服务器。</p>
    </div>

    <div v-for="c in CATEGORIES" :key="c.id" class="block">
      <h2 class="block-title">{{ c.icon }} {{ c.name }}</h2>
      <template v-if="hitCategory(c.id) && visibleIn(c.id).length">
        <div class="module-grid">
          <router-link
            v-for="(m, i) in visibleIn(c.id)"
            :key="m.id"
            :to="`/experiments/${m.id}`"
            class="module-card"
          >
            <div class="module-card-head">
              <span class="module-badge">实验 {{ i + 1 }}</span>
              <span class="module-arrow">→</span>
            </div>
            <h3 class="module-card-title">{{ m.title }}</h3>
            <p class="module-card-objective">{{ m.objective }}</p>
          </router-link>
        </div>
      </template>
      <p v-else-if="searchQuery" class="no-results">暂无匹配实验</p>
      <p v-else class="no-results">暂无实验，敬请期待。</p>
    </div>
  </div>
</template>
