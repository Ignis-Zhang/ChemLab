<script setup lang="ts">
import type { InputField } from '../engine/types'

defineProps<{ field: InputField }>()
const modelValue = defineModel<number | null>()
</script>

<template>
  <div class="field">
    <label class="field-label" :for="field.id">
      {{ field.label }}<span v-if="field.unit" class="field-unit">（{{ field.unit }}）</span>
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
