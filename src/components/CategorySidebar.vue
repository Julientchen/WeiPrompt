<template>
  <aside class="lg:col-span-1">
    <div class="card p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">模板分类</h2>

      <div class="space-y-2">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="[
            'w-full text-left px-3 py-2 rounded-lg transition-colors',
            selectedCategory === category.id
              ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
          @click="$emit('selectCategory', category.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <i :class="category.icon" class="w-4 text-center"></i>
              <span>{{ category.name }}</span>
            </div>
            <span class="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
              {{ category.count }}
            </span>
          </div>
        </button>
      </div>

      <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">热门标签</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in popularTags"
            :key="tag"
            class="tag cursor-pointer hover:bg-primary-200 dark:hover:bg-primary-800"
            @click="$emit('searchTag', tag)"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  categories: Array,
  selectedCategory: String,
  popularTags: Array
})

defineEmits(['selectCategory', 'searchTag'])
</script>
