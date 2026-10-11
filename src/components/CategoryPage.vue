<script setup lang="ts">
import { computed, onUnmounted } from 'vue'
import { MODULES } from '../engine/registry'
import { CATEGORY_MAP, modulesByCategory } from '../lib/categories'
import { searchQuery, matchesSearch } from '../state/search'
import { setToc } from '../state/toc'

const props = defineProps<{ id: string }>()

const category = computed(() => CATEGORY_MAP[props.id])
const visible = computed(() =>
  modulesByCategory(MODULES, props.id).filter((m) =>
    matchesSearch(`${m.title} ${m.objective}`, searchQuery.value),
  ),
)

setToc([{ text: '学科简介', target: 'sec-intro' }, { text: '实验列表', target: 'sec-modules' }])
onUnmounted(() => setToc([]))
</script>

<template>
  <div v-if="category" class="content">
    <p class="content-meta">
      <router-link to="/">← 返回首页</router-link>
    </p>

    <section id="sec-intro">
      <h1 class="content-title">{{ category.icon }} {{ category.name }}</h1>
      <p class="content-meta">{{ category.blurb }}</p>
    </section>

    <div class="admonition admonition-note">
      <div class="admonition-title">说明</div>
      <p>
        本站针对每个实验固定其数据处理流程，输入原始数据后即可<b>即时</b>获得最终结果与异常反馈。
      </p>
      <p class="admonition-fine">纯前端静态站点：数据仅在浏览器本地计算，不上传服务器。</p>
    </div>

    <section id="sec-modules" class="block">
      <h2 class="block-title">{{ category.name }} · 实验列表</h2>
      <div v-if="visible.length" class="module-grid">
        <router-link
          v-for="(m, i) in visible"
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
      <p v-else class="no-results">
        <template v-if="searchQuery">没有与「{{ searchQuery }}」匹配的实验。</template>
        <template v-else>暂无实验，敬请期待。</template>
      </p>
    </section>
  </div>
</template>
