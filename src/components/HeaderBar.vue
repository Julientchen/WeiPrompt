<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <button @click="$emit('goHome')" class="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <i class="fas fa-comment-dots text-white text-sm"></i>
          </div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">WeiPrompt</h1>
          <span class="text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 py-1 rounded-full">Beta</span>
        </button>

        <div class="flex-1 max-w-md mx-8">
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              :value="searchQuery"
              @input="$emit('update:searchQuery', $event.target.value)"
              type="text"
              placeholder="搜索模板..."
              class="input-field pl-10 pr-4"
            >
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <div class="relative" ref="menuRef">
            <button
              @click="showMenu = !showMenu"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="导入/导出"
            >
              <i class="fas fa-ellipsis-v"></i>
            </button>

            <Transition name="dropdown">
              <div
                v-if="showMenu"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
              >
                <button
                  @click="handleExport"
                  class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <i class="fas fa-file-export text-primary-500"></i>
                  <span>导出模板</span>
                </button>
                <button
                  @click="handleImport"
                  class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <i class="fas fa-file-import text-green-500"></i>
                  <span>导入模板</span>
                </button>
              </div>
            </Transition>
          </div>

          <button
            @click="$emit('toggleTheme')"
            class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
          >
            <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>

          <button @click="$emit('createNewTemplate')" class="btn-primary">
            <i class="fas fa-plus mr-2"></i>
            新建模板
          </button>
        </div>
      </div>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      accept=".json"
      class="hidden"
      @change="onFileSelected"
    >
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  searchQuery: String,
  isDark: Boolean
})

const emit = defineEmits(['update:searchQuery', 'toggleTheme', 'createNewTemplate', 'export', 'import', 'goHome'])

const showMenu = ref(false)
const menuRef = ref(null)
const fileInputRef = ref(null)

const handleClickOutside = (e) => {
  if (menuRef.value && !menuRef.value.contains(e.target)) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleExport = () => {
  showMenu.value = false
  emit('export')
}

const handleImport = () => {
  showMenu.value = false
  fileInputRef.value?.click()
}

const onFileSelected = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    emit('import', file)
    e.target.value = ''
  }
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
