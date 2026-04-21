const STORAGE_KEY = 'weiprompt-templates'

export function useStorage() {
  const save = (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('保存到 localStorage 失败:', e)
    }
  }

  const load = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return null

      const parsed = JSON.parse(saved)

      if (!Array.isArray(parsed)) {
        console.warn('localStorage 数据格式不正确，期望数组')
        return null
      }

      const isValid = parsed.every(
        (item) =>
          item &&
          typeof item.id === 'number' &&
          typeof item.title === 'string' &&
          typeof item.category === 'string' &&
          typeof item.content === 'string'
      )

      if (!isValid) {
        console.warn('localStorage 数据验证失败，存在无效模板')
        return null
      }

      return parsed
    } catch (e) {
      console.error('从 localStorage 读取失败:', e)
      return null
    }
  }

  return { save, load }
}
