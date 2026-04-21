<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <HeaderBar
      v-model:searchQuery="searchQuery"
      :isDark="isDark"
      @toggleTheme="toggleTheme"
      @createNewTemplate="createNewTemplate"
      @export="handleExport"
      @import="handleImport"
      @goHome="goHome"
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <TemplateEditor
        v-if="editingTemplate"
        :editingTemplate="editingTemplate"
        @save="saveTemplate"
        @cancel="cancelEdit"
        @delete="confirmDelete"
        @back="goHome"
      />

      <TemplatePreview
        v-else-if="selectedTemplate"
        :selectedTemplate="selectedTemplate"
        @edit="editTemplate"
        @copy="copyToClipboard"
        @back="goHome"
      />

      <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <CategorySidebar
          :categories="categories"
          :selectedCategory="selectedCategory"
          :popularTags="popularTags"
          @selectCategory="selectCategory"
        />

        <div class="lg:col-span-3">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <TemplateCard
              v-for="template in filteredTemplates"
              :key="template.id"
              :template="template"
              @select="selectTemplate"
              @toggleFavorite="toggleFavorite"
            />
          </div>

          <div
            v-if="filteredTemplates.length === 0"
            class="text-center py-12"
          >
            <i class="fas fa-inbox text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <p class="text-gray-500 dark:text-gray-400">暂无模板，点击"新建模板"开始创建</p>
          </div>
        </div>
      </div>
    </main>

    <ToastNotification :toast="toast" />

    <ConfirmDialog
      :show="showDeleteConfirm"
      @confirm="executeDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import HeaderBar from './components/HeaderBar.vue'
import CategorySidebar from './components/CategorySidebar.vue'
import TemplateCard from './components/TemplateCard.vue'
import TemplateEditor from './components/TemplateEditor.vue'
import TemplatePreview from './components/TemplatePreview.vue'
import ToastNotification from './components/ToastNotification.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import { useStorage } from './composables/useStorage.js'
import { useToast } from './composables/useToast.js'
import { useImportExport } from './composables/useImportExport.js'
import { CATEGORIES, POPULAR_TAGS } from './constants/categories.js'
import { DEFAULT_TEMPLATES } from './constants/defaultTemplates.js'

const isDark = useDark()
const toggleTheme = useToggle(isDark)

const { save: saveToStorage, load: loadFromStorage } = useStorage()
const { toast, showToast } = useToast()
const { exportTemplates, importTemplates, mergeTemplates } = useImportExport()

const searchQuery = ref('')
const categories = ref(CATEGORIES.map(c => ({ ...c })))
const selectedCategory = ref('all')
const popularTags = ref([...POPULAR_TAGS])
const templates = ref([])
const selectedTemplate = ref(null)
const editingTemplate = ref(null)
const showDeleteConfirm = ref(false)
const deleteTargetId = ref(null)

const filteredTemplates = computed(() => {
  let filtered = templates.value

  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(template => template.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(template =>
      template.title.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      template.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return filtered
})

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
}

const selectTemplate = (template) => {
  selectedTemplate.value = template
  editingTemplate.value = null
  template.usageCount = (template.usageCount || 0) + 1
  saveToStorage(templates.value)
}

const editTemplate = (template) => {
  editingTemplate.value = JSON.parse(JSON.stringify(template))
  selectedTemplate.value = null
}

const createNewTemplate = () => {
  editingTemplate.value = {
    id: null,
    title: '',
    description: '',
    category: 'writing',
    content: '',
    variables: [],
    tags: [],
    usageCount: 0,
    isFavorite: false
  }
  selectedTemplate.value = null
}

const cancelEdit = () => {
  editingTemplate.value = null
}

const saveTemplate = (template) => {
  if (!template.title.trim()) {
    showToast('请输入模板标题', 'warning')
    return
  }

  if (!template.content.trim()) {
    showToast('请输入模板内容', 'warning')
    return
  }

  if (!template.id) {
    template.id = Date.now()
    template.tags = ['自定义']
    templates.value.push(template)
  } else {
    const index = templates.value.findIndex(t => t.id === template.id)
    if (index !== -1) {
      templates.value[index] = template
    }
  }

  saveToStorage(templates.value)
  updateCategoryCounts()
  editingTemplate.value = null
  showToast('模板保存成功')
}

const confirmDelete = (id) => {
  deleteTargetId.value = id
  showDeleteConfirm.value = true
}

const executeDelete = () => {
  if (deleteTargetId.value) {
    const index = templates.value.findIndex(t => t.id === deleteTargetId.value)
    if (index !== -1) {
      templates.value.splice(index, 1)
      saveToStorage(templates.value)
      updateCategoryCounts()
      showToast('模板已删除')
    }
  }
  showDeleteConfirm.value = false
  deleteTargetId.value = null
  editingTemplate.value = null
  selectedTemplate.value = null
}

const toggleFavorite = (templateId) => {
  const template = templates.value.find(t => t.id === templateId)
  if (template) {
    template.isFavorite = !template.isFavorite
    saveToStorage(templates.value)
  }
}

const goHome = () => {
  selectedTemplate.value = null
  editingTemplate.value = null
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showToast('已复制到剪贴板！')
  } catch (err) {
    console.error('复制失败:', err)
    showToast('复制失败，请手动复制', 'error')
  }
}

const updateCategoryCounts = () => {
  categories.value.forEach(category => {
    if (category.id === 'all') {
      category.count = templates.value.length
    } else {
      category.count = templates.value.filter(t => t.category === category.id).length
    }
  })
}

const handleExport = () => {
  if (templates.value.length === 0) {
    showToast('没有可导出的模板', 'warning')
    return
  }
  const result = exportTemplates(templates.value)
  if (result.success) {
    showToast(`成功导出 ${result.count} 个模板`)
  }
}

const handleImport = async (file) => {
  try {
    const result = await importTemplates(file)
    const merged = mergeTemplates(templates.value, result.templates, 'merge')
    templates.value = merged
    saveToStorage(templates.value)
    updateCategoryCounts()
    showToast(`成功导入 ${result.count} 个模板`)
  } catch (err) {
    showToast(err.message, 'error')
  }
}

onMounted(() => {
  const saved = loadFromStorage()
  if (saved) {
    templates.value = saved
  } else {
    templates.value = JSON.parse(JSON.stringify(DEFAULT_TEMPLATES))
    saveToStorage(templates.value)
  }
  updateCategoryCounts()
})
</script>
