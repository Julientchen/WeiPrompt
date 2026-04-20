<template>
  <Transition name="toast">
    <div
      v-if="toast.show"
      class="fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50"
      :class="toastClass"
    >
      <i :class="iconClass" class="mr-2"></i>
      {{ toast.message }}
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  toast: Object
})

const toastClass = computed(() => {
  switch (props.toast.type) {
    case 'error':
      return 'bg-red-500 text-white'
    case 'warning':
      return 'bg-orange-500 text-white'
    default:
      return 'bg-green-500 text-white'
  }
})

const iconClass = computed(() => {
  switch (props.toast.type) {
    case 'error':
      return 'fas fa-exclamation-circle'
    case 'warning':
      return 'fas fa-exclamation-triangle'
    default:
      return 'fas fa-check'
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
