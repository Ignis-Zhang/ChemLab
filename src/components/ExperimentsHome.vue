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
    <h1 class="content-title">化学实验助手</h1>

    <details id="sec-note" class="admonition admonition-note" open>
      <summary class="admonition-title">说明</summary>
      <p>
        同学们在实验时会记录许多原始数据，但要得到最终结果往往需要较复杂的计算，
        且实验结束后若结果异常也无法重做。本网站针对每个实验固定其数据处理流程，
        输入原始数据后即可<b>即时</b>获得最终结果与异常反馈——发现问题时可及时调整。
      </p>
    </details>

    <div v-for="c in CATEGORIES" :key="c.id" class="block">
      <h2 class="block-title">
        {{ c.name }}
        <router-link :to="`/category/${c.id}`" class="block-more">更多 →</router-link>
      </h2>
      <template v-if="hitCategory(c.id) && visibleIn(c.id).length">
        <div class="module-list">
          <div
            v-for="(m, i) in visibleIn(c.id)"
            :key="m.id"
            class="module-item"
          >
            <span class="module-num">{{ i + 1 }}.</span>
            <router-link :to="`/experiments/${m.id}`" class="module-link">{{ m.title }}</router-link>
          </div>
          <div class="module-item module-dots">
            <router-link :to="`/category/${c.id}`" class="dots-link">······</router-link>
          </div>
        </div>
      </template>
      <p v-else-if="searchQuery" class="no-results">暂无匹配实验</p>
      <p v-else class="no-results">暂无实验，敬请期待。</p>
    </div>
  </div>
</template>
