import { ref } from 'vue'

export function useToast() {
  const toast = ref({
    show: false,
    message: '',
    type: 'success'
  })

  let timer = null

  const showToast = (message, type = 'success') => {
    toast.value = { show: true, message, type }

    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      toast.value.show = false
      timer = null
    }, 2000)
  }

  const clearToast = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    toast.value.show = false
  }

  return { toast, showToast, clearToast }
}
