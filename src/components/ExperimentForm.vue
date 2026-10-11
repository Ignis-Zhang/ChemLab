<script setup lang="ts">
import { computed, watch } from 'vue'
import type { InputField } from '../engine/types'
import { getModule } from '../engine/registry'
import { useExperiment } from '../composables/useExperiment'
import { setToc } from '../state/toc'
import FieldInput from './FieldInput.vue'

const props = defineProps<{ id: string }>()

const module = computed(() => getModule(props.id))
const { inputValues, output } = useExperiment(module.value!)


/** 按 InputField.group 把字段分组，并插入分组小标题项，供模板统一渲染。 */
const groupedInputs = computed(() => {
  const items: Array<{ type: 'heading'; group: string } | { type: 'field'; field: InputField }> = []
  let prevGroup: string | undefined
  for (const f of module.value?.inputs ?? []) {
    if (f.group && f.group !== prevGroup) {
      items.push({
        type: 'heading',
        group: f.groupLabel ?? (f.group === 'common' ? '共享参数' : `第 ${f.group} 份`),
      })
      prevGroup = f.group
    }
    items.push({ type: 'field', field: f })
  }
  return items
})

// 页内目录：固定章节 + 实时结果速览
watch(
  [module, output],
  () => {
    if (!module.value) return setToc([])
    setToc([
      { text: '实验原理与流程', target: 'sec-brief' },
      { text: '原始数据输入', target: 'sec-inputs' },
      { text: '计算结果', target: 'sec-results' },
      ...module.value.results.map((r) => ({
        text: `${r.label}: ${output.value.results[r.id]?.display ?? '—'}`,
        kind: 'result' as const,
      })),
    ])
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <div v-if="module" class="content">
    <p class="content-meta">
      <router-link to="/">← 返回实验列表</router-link>
    </p>
    <h1 class="content-title">{{ module.title }}</h1>

    <!-- 实验说明：admonition 提示框 -->
    <div id="sec-brief" class="admonition admonition-tip">
      <div class="admonition-title">实验原理与流程</div>
      <div class="brief-lines">
        <p v-for="(line, i) in (module.brief?.split('\n') ?? [])" :key="i">{{ line }}</p>
      </div>
    </div>
    <p v-if="module.prerequisite" class="prereq">{{ module.prerequisite }}</p>

    <!-- 输入区 -->
    <section id="sec-inputs" class="block">
      <h2 class="block-title">原始数据输入</h2>
      <div class="fields-grid">
        <template v-for="item in groupedInputs" :key="item.type === 'field' ? item.field.id : item.group">
          <h3 v-if="item.type === 'heading'" class="group-title">{{ item.group }}</h3>
          <FieldInput
            v-else
            :field="item.field"
            v-model="inputValues[item.field.id]"
          />
        </template>
      </div>
    </section>

    <!-- 实时结果 -->
    <section id="sec-results" class="block">
      <h2 class="block-title">计算结果（实时）</h2>
      <div class="results-grid">
        <div v-for="r in module.results" :key="r.id" class="result-cell">
          <div class="result-label">{{ r.label }}</div>
          <div class="result-value">
            <span class="num">{{ output.results[r.id]?.display ?? '—' }}</span>
            <span v-if="r.unit" class="result-unit">{{ r.unit }}</span>
          </div>
        </div>
      </div>
      <div v-if="module.meta?.references" class="references">
        <p v-for="(ref, key) in module.meta.references" :key="key">
          <b>{{ key }}</b>：{{ ref }}
        </p>
      </div>
    </section>
  </div>
</template>
