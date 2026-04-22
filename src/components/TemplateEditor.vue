<template>
  <div class="card p-6 mb-8">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <button
          class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="返回"
          @click="$emit('back')"
        >
          <i class="fas fa-arrow-left"></i>
        </button>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ localTemplate.id ? '编辑模板' : '新建模板' }}
        </h2>
      </div>
      <div class="flex space-x-3">
        <button v-if="localTemplate.id" class="btn-danger" @click="$emit('delete', localTemplate.id)">
          <i class="fas fa-trash mr-1"></i>删除
        </button>
        <button class="btn-secondary" @click="$emit('cancel')">取消</button>
        <button class="btn-primary" @click="handleSave">保存</button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">模板标题</label>
        <input v-model="localTemplate.title" class="input-field" placeholder="输入模板标题" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">分类</label>
        <select v-model="localTemplate.category" class="input-field">
          <option v-for="category in availableCategories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">模板描述</label>
      <textarea
        v-model="localTemplate.description"
        class="input-field h-20"
        placeholder="描述模板的用途和使用场景"
      ></textarea>
    </div>

    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">变量定义</h3>
        <button class="btn-secondary text-sm" @click="addVariable"><i class="fas fa-plus mr-1"></i>添加变量</button>
      </div>

      <div v-for="(variable, index) in localTemplate.variables" :key="index" class="card p-4 mb-3">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">变量名</label>
            <input v-model="variable.name" class="input-field text-sm" placeholder="如：topic" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">标签</label>
            <input v-model="variable.label" class="input-field text-sm" placeholder="如：主题" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">类型</label>
            <select v-model="variable.type" class="input-field text-sm">
              <option value="text">文本输入</option>
              <option value="select">下拉选择</option>
              <option value="number">数字</option>
            </select>
          </div>
        </div>

        <div v-if="variable.type === 'select'" class="mt-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">选项</label>
          <div v-for="(option, optIndex) in variable.options" :key="optIndex" class="flex items-center space-x-2 mb-2">
            <input v-model="option.value" class="input-field text-sm flex-1" placeholder="选项值" />
            <input v-model="option.label" class="input-field text-sm flex-1" placeholder="显示标签" />
            <button class="text-red-500 hover:text-red-700" @click="removeOption(variable, optIndex)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <button class="btn-secondary text-xs" @click="addOption(variable)">添加选项</button>
        </div>

        <div class="flex justify-end mt-3">
          <button class="text-red-500 hover:text-red-700 text-sm" @click="removeVariable(index)">
            <i class="fas fa-trash mr-1"></i>删除变量
          </button>
        </div>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" v-pre>
        模板内容（使用 {{变量名}} 格式插入变量）
      </label>
      <textarea
        ref="contentTextarea"
        v-model="localTemplate.content"
        class="input-field font-mono text-sm auto-resize-textarea"
        placeholder="请输入模板内容，使用 {{变量名}} 的格式插入变量"
        @input="autoResize"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, toRaw, nextTick, onMounted } from 'vue'
import { CATEGORIES } from '../constants/categories.js'

const props = defineProps({
  editingTemplate: Object
})

const emit = defineEmits(['save', 'cancel', 'delete', 'back'])

const localTemplate = ref({})
const contentTextarea = ref(null)

const availableCategories = computed(() => CATEGORIES.filter((c) => c.id !== 'all'))

const autoResize = () => {
  const textarea = contentTextarea.value
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = Math.max(textarea.scrollHeight, 160) + 'px'
  }
}

watch(
  () => props.editingTemplate,
  (newVal) => {
    localTemplate.value = JSON.parse(JSON.stringify(newVal))
    nextTick(() => {
      autoResize()
    })
  },
  { immediate: true }
)

onMounted(() => {
  nextTick(() => {
    autoResize()
  })
})

const handleSave = () => {
  emit('save', toRaw(localTemplate.value))
}

const addVariable = () => {
  if (!localTemplate.value.variables) {
    localTemplate.value.variables = []
  }
  localTemplate.value.variables.push({
    name: 'var_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    label: '',
    type: 'text',
    options: []
  })
}

const removeVariable = (index) => {
  localTemplate.value.variables.splice(index, 1)
}

const addOption = (variable) => {
  if (!variable.options) {
    variable.options = []
  }
  variable.options.push({ value: '', label: '' })
}

const removeOption = (variable, index) => {
  variable.options.splice(index, 1)
}
</script>

<style scoped>
.btn-danger {
  background-color: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.auto-resize-textarea {
  min-height: 160px;
  transition: height 0.2s ease-in-out;
  overflow-y: hidden;
}
</style>
