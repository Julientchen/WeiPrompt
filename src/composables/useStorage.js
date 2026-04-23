const STORAGE_KEY = 'weiprompt-templates'
const DATA_VERSION = 1

export function useStorage() {
  const save = (data) => {
    try {
      const payload = {
        version: DATA_VERSION,
        data
      }
      const serialized = JSON.stringify(payload)
      localStorage.setItem(STORAGE_KEY, serialized)
      return { success: true }
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        console.error('localStorage 存储空间不足')
        return { success: false, error: '存储空间不足，请删除一些模板后重试' }
      }
      console.error('保存到 localStorage 失败:', e)
      return { success: false, error: '保存失败，请重试' }
    }
  }

  const load = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return null

      const parsed = JSON.parse(saved)

      let templates = null

      if (parsed && typeof parsed === 'object' && 'version' in parsed && Array.isArray(parsed.data)) {
        templates = parsed.data
      } else if (Array.isArray(parsed)) {
        templates = parsed
      } else {
        console.warn('localStorage 数据格式不正确')
        return null
      }

      const isValid = templates.every(
        (item) =>
          item &&
          (typeof item.id === 'number' || typeof item.id === 'string') &&
          typeof item.title === 'string' &&
          typeof item.category === 'string' &&
          typeof item.content === 'string'
      )

      if (!isValid) {
        console.warn('localStorage 数据验证失败，存在无效模板')
        return null
      }

      return templates
    } catch (e) {
      console.error('从 localStorage 读取失败:', e)
      return null
    }
  }

  return { save, load }
}
