<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { MODULES } from '../engine/registry'
import { CATEGORIES, modulesByCategory, isCategory } from '../lib/categories'
import { searchQuery, matchesSearch } from '../state/search'
import { tocEntries } from '../state/toc'

const route = useRoute()

// 某学科下、过搜索词的实验模块
const visibleIn = (catId: string) =>
  modulesByCategory(MODULES, catId).filter((m) =>
    matchesSearch(`${m.title} ${m.objective}`, searchQuery.value),
  )

const isActive = (id: string) =>
  route.name === 'experiment' && route.params.id === id

const isHome = computed(() => route.name === 'home')

// 顶栏"学科"tab 高亮：学科页取其 id，实验页取其归属学科
const activeCategory = computed(() => {
  if (route.name === 'category') return String(route.params.id)
  if (route.name === 'experiment') {
    return MODULES.find((m) => m.id === route.params.id)?.category
  }
  return undefined
})

// 侧边栏学科分组：进入某学科（学科页/实验页）时仅展示该学科的实验；
// 无学科上下文（首页/关于）时不在侧边栏放实验目录。
const sidebarCategories = computed(() =>
  activeCategory.value && isCategory(activeCategory.value)
    ? CATEGORIES.filter((c) => c.id === activeCategory.value)
    : [],
)
</script>

<template>
  <div class="site">
    <!-- 顶栏 -->
    <header class="md-header">
      <div class="md-header-inner">
        <div class="brand">
          <span class="brand-title">化学实验助手</span>
          <span class="brand-sub">Chem Lab Assistant</span>
        </div>
        <nav class="md-tabs">
          <router-link to="/" class="md-tab" :class="{ active: isHome }">首页</router-link>
          <router-link
            v-for="c in CATEGORIES"
            :key="c.id"
            :to="`/category/${c.id}`"
            class="md-tab"
            :class="{ active: activeCategory === c.id }"
          >{{ c.name }}</router-link>
          <router-link to="/about" class="md-tab" :class="{ active: route.name === 'about' }">关于</router-link>
        </nav>
        <div class="header-search">
          <input
            v-model="searchQuery"
            type="search"
            class="search-input"
            placeholder="搜索实验… (Search)"
            aria-label="搜索实验"
          />
        </div>
      </div>
    </header>

    <div class="md-body">
      <!-- 左侧导航 -->
      <aside class="md-sidebar">
        <nav class="md-nav">
          <router-link to="/" class="nav-link" :class="{ active: isHome }">
            首页
          </router-link>

          <div v-for="c in sidebarCategories" :key="c.id" class="nav-section">
            <div class="nav-expand nav-expand-static">
              <span class="nav-caret open">▸</span>
              {{ c.name }}
            </div>

            <div class="nav-children">
              <router-link
                v-for="(m, i) in visibleIn(c.id)"
                :key="m.id"
                :to="`/experiments/${m.id}`"
                class="nav-link"
                :class="{ active: isActive(m.id) }"
              >
                <span class="nav-experiment-index">实验 {{ i + 1 }}</span>
                <span class="nav-experiment-title">{{ m.title }}</span>
              </router-link>
              <p v-if="visibleIn(c.id).length === 0" class="nav-empty">暂无实验</p>
            </div>
          </div>
        </nav>
      </aside>

      <!-- 主内容 -->
      <main class="md-content">
        <slot />
      </main>

      <!-- 右侧目录（页内目录） -->
      <aside class="md-toc">
        <template v-if="tocEntries.length">
          <div class="toc-title">本页目录</div>
          <ul class="toc-list">
            <li v-for="(e, i) in tocEntries" :key="i" class="toc-item" :class="'toc-kind-' + (e.kind ?? 'section')">
              <a v-if="e.target" :href="`#${e.target}`">{{ e.text }}</a>
              <span v-else>{{ e.text }}</span>
            </li>
          </ul>
        </template>
      </aside>
    </div>

    <!-- 页脚 -->
    <footer class="md-footer">
      <div class="md-footer-inner">
        <span>Copyright © 化学实验助手</span>
      </div>
    </footer>
  </div>
</template>
