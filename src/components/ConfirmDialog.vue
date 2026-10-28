<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black bg-opacity-50" @click="$emit('cancel')"></div>
        <div
          class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-sm w-full mx-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          <h3 id="confirm-dialog-title" class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">{{ message }}</p>
          <div class="flex justify-end space-x-3">
            <button class="btn-secondary" @click="$emit('cancel')">取消</button>
            <button ref="confirmButtonRef" class="btn-danger" @click="$emit('confirm')">确认删除</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue'

const props = defineProps({
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

const emit = defineEmits(['confirm', 'cancel'])

const confirmButtonRef = ref(null)

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    emit('cancel')
  }
}

watch(
  () => props.show,
  (show) => {
    if (show) {
      window.addEventListener('keydown', handleKeydown)
      nextTick(() => confirmButtonRef.value?.focus())
    } else {
      window.removeEventListener('keydown', handleKeydown)
    }
  }
)

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
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
</style>
