import { ref } from 'vue'

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

let timer = null

export function useToast() {
  const showToast = (message, type = 'success') => {
    toast.value = { show: true, message, type }

    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      toast.value.show = false
    }, 2000)
  }

  return { toast, showToast }
}
