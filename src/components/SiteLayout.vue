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
        <router-link to="/" class="brand">
          <svg class="brand-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="2"/>
            <ellipse cx="12" cy="12" rx="10" ry="4"/>
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
          </svg>
          <span class="brand-title">化学实验助手</span>
          <span class="brand-sub">Chem Lab Assistant</span>
        </router-link>
        <div class="header-right">
          <div class="header-search">
            <input
              v-model="searchQuery"
              type="search"
              class="search-input"
              placeholder="搜索实验…"
              aria-label="搜索实验"
            />
          </div>
          <a href="https://github.com/Ignis-Zhang/ChemLab" target="_blank" class="github-link" title="GitHub 仓库">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>
      </div>
      <nav class="md-tabs">
        <div class="md-tabs-inner">
          <router-link to="/" class="md-tab" :class="{ active: isHome }">首页</router-link>
          <router-link
            v-for="c in CATEGORIES"
            :key="c.id"
            :to="`/category/${c.id}`"
            class="md-tab"
            :class="{ active: activeCategory === c.id }"
          >{{ c.name }}</router-link>
          <router-link to="/about" class="md-tab" :class="{ active: route.name === 'about' }">关于</router-link>
        </div>
      </nav>
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
