<template>
  <div class="card p-6 mb-8">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <button @click="$emit('back')" class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="返回">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedTemplate.title }}</h2>
      </div>
      <div class="flex space-x-3">
        <button @click="$emit('edit', selectedTemplate)" class="btn-secondary">编辑</button>
        <button @click="handleCopy" class="btn-primary">
          <i class="fas fa-copy mr-2"></i>复制提示词
        </button>
      </div>
    </div>

    <div v-if="selectedTemplate.variables && selectedTemplate.variables.length > 0" class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">填写变量</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="variable in selectedTemplate.variables" :key="variable.name" class="card p-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ variable.label || variable.name }}
          </label>

          <input
            v-if="variable.type === 'text' || variable.type === 'number'"
            v-model="variableValues[variable.name]"
            :type="variable.type"
            class="input-field"
            :placeholder="`请输入${variable.label || variable.name}`"
          >

          <select
            v-else-if="variable.type === 'select'"
            v-model="variableValues[variable.name]"
            class="input-field"
          >
            <option value="">请选择</option>
            <option v-for="option in variable.options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">预览</h3>
      <div class="card p-4 bg-gray-50 dark:bg-gray-800">
        <pre class="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{{ generatedPrompt }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  selectedTemplate: Object
})

const emit = defineEmits(['edit', 'copy', 'back'])

const variableValues = ref({})

const generatedPrompt = computed(() => {
  if (!props.selectedTemplate || !props.selectedTemplate.content) return ''

  let prompt = props.selectedTemplate.content

  Object.keys(variableValues.value).forEach(key => {
    const value = variableValues.value[key] || ''
    const regex = new RegExp(`{{${key}}}`, 'g')
    prompt = prompt.replace(regex, value)
  })

  return prompt
})

watch(() => props.selectedTemplate, (template) => {
  variableValues.value = {}
  if (template && template.variables) {
    template.variables.forEach(variable => {
      variableValues.value[variable.name] = ''
    })
  }
}, { immediate: true })

const handleCopy = () => {
  emit('copy', generatedPrompt.value)
}
</script>
