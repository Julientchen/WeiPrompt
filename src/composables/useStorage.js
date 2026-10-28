const STORAGE_KEY = 'weiprompt-templates'
const STORAGE_KEY_BACKUP = 'weiprompt-user-data'
const DATA_VERSION = 2

export function useStorage() {
  const isValidTemplate = (template) =>
    template &&
    (typeof template.id === 'number' || typeof template.id === 'string') &&
    typeof template.title === 'string' &&
    template.title.trim() !== ''

  const normalizeTemplate = (template) => ({
    ...template,
    description: typeof template.description === 'string' ? template.description : '',
    category: typeof template.category === 'string' && template.category ? template.category : 'writing',
    content: typeof template.content === 'string' ? template.content : '',
    variables: Array.isArray(template.variables)
      ? template.variables.filter((variable) => variable && typeof variable.name === 'string')
      : [],
    tags: Array.isArray(template.tags) ? template.tags.filter((tag) => typeof tag === 'string') : [],
    usageCount: Number.isFinite(template.usageCount) ? template.usageCount : 0,
    isFavorite: Boolean(template.isFavorite)
  })

  const normalizeTemplates = (templates) => {
    if (!Array.isArray(templates)) return null
    if (templates.length === 0) return []
    const normalized = templates.filter(isValidTemplate).map(normalizeTemplate)
    return normalized.length > 0 ? normalized : null
  }

  const parseTemplates = (parsed) => {
    if (Array.isArray(parsed)) {
      return { templates: parsed, version: 0 }
    }
    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.data)) {
      return { templates: parsed.data, version: Number(parsed.version) || 0 }
    }
    return null
  }

  const save = (data) => {
    try {
      if (!Array.isArray(data)) {
        return { success: false, error: '数据格式无效' }
      }

      const payload = {
        version: DATA_VERSION,
        timestamp: Date.now(),
        data
      }
      const serialized = JSON.stringify(payload)

      localStorage.setItem(STORAGE_KEY, serialized)

      try {
        localStorage.setItem(STORAGE_KEY_BACKUP, serialized)
      } catch (e) {
        console.warn('备份写入失败:', e)
      }

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
          const result = parseTemplates(parsed)
          const templates = result ? normalizeTemplates(result.templates) : null
          if (!templates) continue

          if (i > 0) {
            console.log('✅ 数据已自动从备份恢复')
            try {
              localStorage.setItem(STORAGE_KEY, sources[i])
            } catch (e) {
              console.warn('备份数据回写失败:', e)
            }
          }

          if (result.version < DATA_VERSION) {
            save(templates)
          }

          return templates
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
