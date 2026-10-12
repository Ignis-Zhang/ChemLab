<script setup lang="ts">
import type { InputField } from '../engine/types'

defineProps<{ field: InputField }>()
const modelValue = defineModel<number | null>()

/** 将标签中的 _X 或字母后数字转为下标 HTML */
function formatLabel(label: string): string {
  return label
    // m_A, m_1, V_始 → m<sub>A</sub>, m<sub>1</sub>, V<sub>始</sub>
    .replace(/_([^\s_])/g, '<sub>$1</sub>')
    // V1, V2 → V<sub>1</sub>, V<sub>2</sub> (括号内字母后跟数字)
    .replace(/\(([A-Za-z]+)(\d+)\)/g, '($1<sub>$2</sub>)')
}
</script>

<template>
  <div class="field">
    <label class="field-label" :for="field.id">
      <span v-html="formatLabel(field.label)"></span><span v-if="field.unit" class="field-unit">（{{ field.unit }}）</span>
    </label>
    <input
      :id="field.id"
      v-model.number="modelValue"
      class="field-input"
      type="number"
      :step="field.step ?? 'any'"
      :min="field.min"
      :max="field.max"
      :placeholder="field.placeholder ?? field.default != null ? String(field.default) : ''"
    />
    <p v-if="field.hint" class="field-hint">{{ field.hint }}</p>
  </div>
</template>
