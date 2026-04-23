<template>
  <div class="card p-6 cursor-pointer hover:shadow-lg transition-all duration-300" @click="$emit('select', template)">
    <div class="flex items-start justify-between mb-3">
      <h3 class="font-semibold text-gray-900 dark:text-white text-balance">
        {{ template.title }}
      </h3>
      <button
        class="text-gray-400 hover:text-yellow-500 transition-colors"
        @click.stop="$emit('toggleFavorite', template.id)"
      >
        <i :class="template.isFavorite ? 'fas fa-star text-yellow-500' : 'far fa-star'"></i>
      </button>
    </div>

    <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
      {{ template.description }}
    </p>

    <div class="flex items-center justify-between">
      <div class="flex flex-wrap gap-1">
        <span v-for="tag in template.tags.slice(0, 2)" :key="tag" class="tag text-xs">
          {{ tag }}
        </span>
        <span v-if="template.tags.length > 2" class="tag text-xs"> +{{ template.tags.length - 2 }} </span>
      </div>
      <span class="text-xs text-gray-500 dark:text-gray-400"> {{ template.usageCount }} 次使用 </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  template: Object
})

defineEmits(['select', 'toggleFavorite'])
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
