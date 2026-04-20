<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black bg-opacity-50" @click="$emit('cancel')"></div>
        <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ title }}</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">{{ message }}</p>
          <div class="flex justify-end space-x-3">
            <button @click="$emit('cancel')" class="btn-secondary">取消</button>
            <button @click="$emit('confirm')" class="btn-danger">确认删除</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: {
    type: String,
    default: '确认删除'
  },
  message: {
    type: String,
    default: '确定要删除这个模板吗？此操作无法撤销。'
  }
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.btn-danger {
  @apply bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200;
}
</style>
