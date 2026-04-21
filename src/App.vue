<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <HeaderBar
      v-model:searchQuery="store.searchQuery"
      :isDark="isDark"
      @toggleTheme="toggleTheme"
      @createNewTemplate="store.createNewTemplate"
      @export="handleExport"
      @import="handleImport"
      @goHome="store.goHome"
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <TemplateEditor
        v-if="store.editingTemplate"
        :editingTemplate="store.editingTemplate"
        @save="store.saveTemplate"
        @cancel="store.cancelEdit"
        @delete="store.confirmDelete"
        @back="store.goHome"
      />

      <TemplatePreview
        v-else-if="store.selectedTemplate"
        :selectedTemplate="store.selectedTemplate"
        @edit="store.editTemplate"
        @copy="copyToClipboard"
        @back="store.goHome"
      />

      <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <CategorySidebar
          :categories="store.categories"
          :selectedCategory="store.selectedCategory"
          :popularTags="popularTags"
          @selectCategory="store.selectCategory"
        />

        <div class="lg:col-span-3">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <TemplateCard
              v-for="template in store.filteredTemplates"
              :key="template.id"
              :template="template"
              @select="store.selectTemplate"
              @toggleFavorite="store.toggleFavorite"
            />
          </div>

          <div v-if="store.filteredTemplates.length === 0" class="text-center py-12">
            <i class="fas fa-inbox text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <p class="text-gray-500 dark:text-gray-400">暂无模板，点击"新建模板"开始创建</p>
          </div>
        </div>
      </div>
    </main>

    <ToastNotification :toast="toast" />

    <ConfirmDialog
      :show="store.showDeleteConfirm"
      @confirm="store.executeDelete"
      @cancel="store.showDeleteConfirm = false"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { useTemplateStore } from './stores/useTemplateStore.js'
import { useToast } from './composables/useToast.js'
import { useImportExport } from './composables/useImportExport.js'
import { POPULAR_TAGS } from './constants/categories.js'
import HeaderBar from './components/HeaderBar.vue'
import CategorySidebar from './components/CategorySidebar.vue'
import TemplateCard from './components/TemplateCard.vue'
import TemplateEditor from './components/TemplateEditor.vue'
import TemplatePreview from './components/TemplatePreview.vue'
import ToastNotification from './components/ToastNotification.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'

const isDark = useDark()
const toggleTheme = useToggle(isDark)

const store = useTemplateStore()
const { toast, showToast } = useToast()
const { exportTemplates, importTemplates, mergeTemplates } = useImportExport()

const popularTags = POPULAR_TAGS

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showToast('已复制到剪贴板！')
  } catch (err) {
    console.error('复制失败:', err)
    showToast('复制失败，请手动复制', 'error')
  }
}

const handleExport = () => {
  if (store.templates.length === 0) {
    showToast('没有可导出的模板', 'warning')
    return
  }
  const result = exportTemplates(store.templates)
  if (result.success) {
    showToast(`成功导出 ${result.count} 个模板`)
  }
}

const handleImport = async (file) => {
  try {
    const result = await importTemplates(file)
    const merged = mergeTemplates(store.templates, result.templates, 'merge')
    store.setTemplates(merged)
    showToast(`成功导入 ${result.count} 个模板`)
  } catch (err) {
    showToast(err.message, 'error')
  }
}

onMounted(() => {
  store.init()
})
</script>
