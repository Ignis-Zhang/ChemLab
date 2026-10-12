<script setup lang="ts">
import { onUnmounted } from 'vue'
import { setToc } from '../state/toc'

setToc([
  { text: '关于本站', target: 'sec-about' },
  { text: '技术栈', target: 'sec-stack' },
  { text: '使用说明', target: 'sec-usage' },
])
onUnmounted(() => setToc([]))
</script>

<template>
  <div class="content">
    <p class="content-meta">
      <router-link to="/">← 返回实验列表</router-link>
    </p>
    <h1 class="content-title">关于本站</h1>

    <details id="sec-about" class="admonition admonition-tip">
      <summary class="admonition-title">关于本站</summary>
      <p>
        本站辅助<b>无机化学实验</b>课程教学：学生在实验中记录原始数据后，按每个实验固定的
        数据处理流程<b>即时</b>获得最终结果与异常反馈——发现问题时可及时调整，无需等实验结束后才发现异常。
      </p>
    </details>

    <section id="sec-stack" class="block">
      <h2 class="block-title">技术栈</h2>
      <ul>
        <li><b>Vue 3 + Vite + TypeScript</b> — 前端框架与构建</li>
        <li><b>配置驱动的实验引擎</b> — 添加新实验只需新增配置文件，无需改 UI 或路由</li>
        <li><b>Material 风格 UI</b> — 三段式布局（顶部导航 / 左侧导航树 / 右侧页内目录）</li>
      </ul>
    </section>

    <section id="sec-usage" class="block">
      <h2 class="block-title">使用说明</h2>
      <ul>
        <li>进入「实验」页或在首页点击实验卡片，填写原始数据即实时得到计算结果。</li>
        <li>左侧「实验」分组可折叠，列出本站包含的所有实验模块。</li>
        <li>右侧「本页目录」提供页内锚点导航。</li>
      </ul>
    </section>
  </div>
</template>
