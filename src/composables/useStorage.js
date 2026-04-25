const STORAGE_KEY = 'weiprompt-templates'
const STORAGE_KEY_BACKUP = 'weiprompt-user-data'
const DATA_VERSION = 1

export function useStorage() {
  const validateTemplates = (templates) => {
    if (!Array.isArray(templates)) return false
    return templates.every(
      (item) =>
        item &&
        (typeof item.id === 'number' || typeof item.id === 'string') &&
        typeof item.title === 'string' &&
        typeof item.category === 'string' &&
        typeof item.content === 'string'
    )
  }

  const parseTemplates = (parsed) => {
    if (parsed && typeof parsed === 'object' && 'version' in parsed && Array.isArray(parsed.data)) {
      return parsed.data
    } else if (Array.isArray(parsed)) {
      return parsed
    }
    return null
  }

  const save = (data) => {
    try {
      const payload = {
        version: DATA_VERSION,
        timestamp: Date.now(),
        data
      }
      const serialized = JSON.stringify(payload)

      localStorage.setItem(STORAGE_KEY, serialized)
      localStorage.setItem(STORAGE_KEY_BACKUP, serialized)

      return { success: true }
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        console.error('localStorage 存储空间不足')
        return { success: false, error: '存储空间不足，请删除一些模板后重试' }
      }
      console.error('保存失败:', e)
      return { success: false, error: '保存失败，请重试' }
    }
  }

  const load = () => {
    try {
      const sources = [localStorage.getItem(STORAGE_KEY), localStorage.getItem(STORAGE_KEY_BACKUP)].filter(Boolean)

      for (let i = 0; i < sources.length; i++) {
        try {
          const parsed = JSON.parse(sources[i])
          const templates = parseTemplates(parsed)
          if (templates && validateTemplates(templates)) {
            if (i > 0) {
              console.log('✅ 数据已自动从备份恢复')
              localStorage.setItem(STORAGE_KEY, sources[i])
            }
            return templates
          }
        } catch (e) {
          console.debug('数据解析失败，尝试下一个数据源:', e)
        }
      }

      return null
    } catch (e) {
      console.error('读取失败:', e)
      return null
    }
  }

  return { save, load }
}
