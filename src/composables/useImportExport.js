import { ref } from 'vue'
import { generateId } from '../utils/idGenerator.js'

const EXPORT_VERSION = '1.0'

export function useImportExport() {
  const isImporting = ref(false)

  const exportTemplates = (templates) => {
    const data = {
      version: EXPORT_VERSION,
      exportDate: new Date().toISOString(),
      appName: 'WeiPrompt',
      templates: templates.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        category: t.category,
        content: t.content,
        variables: t.variables || [],
        tags: t.tags || [],
        usageCount: t.usageCount || 0,
        isFavorite: t.isFavorite || false
      }))
    }

    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    const dateStr = new Date().toISOString().slice(0, 10)
    link.href = url
    link.download = `weiprompt-templates-${dateStr}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return { success: true, count: templates.length }
  }

  const validateImportData = (data) => {
    if (!data || typeof data !== 'object') {
      return { valid: false, error: '无效的文件格式' }
    }

    if (!data.templates || !Array.isArray(data.templates)) {
      return { valid: false, error: '文件中未找到模板数据' }
    }

    if (data.templates.length === 0) {
      return { valid: false, error: '文件中没有模板' }
    }

    for (let i = 0; i < data.templates.length; i++) {
      const t = data.templates[i]
      if (!t || typeof t.title !== 'string' || !t.title.trim()) {
        return { valid: false, error: `第 ${i + 1} 个模板标题无效` }
      }
      if (typeof t.content !== 'string' || !t.content.trim()) {
        return { valid: false, error: `模板"${t.title}"内容无效` }
      }
    }

    return { valid: true }
  }

  const importTemplates = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('未选择文件'))
        return
      }

      if (!file.name.endsWith('.json')) {
        reject(new Error('请选择 JSON 文件'))
        return
      }

      isImporting.value = true

      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          const validation = validateImportData(data)

          if (!validation.valid) {
            isImporting.value = false
            reject(new Error(validation.error))
            return
          }

          const templates = data.templates.map((t) => ({
            id: t.id || generateId(),
            title: t.title,
            description: t.description || '',
            category: t.category || 'writing',
            content: t.content,
            variables: Array.isArray(t.variables) ? t.variables : [],
            tags: Array.isArray(t.tags) ? t.tags : [],
            usageCount: typeof t.usageCount === 'number' ? t.usageCount : 0,
            isFavorite: !!t.isFavorite
          }))

          isImporting.value = false
          resolve({ templates, count: templates.length })
        } catch {
          isImporting.value = false
          reject(new Error('文件解析失败，请检查文件格式'))
        }
      }

      reader.onerror = () => {
        isImporting.value = false
        reject(new Error('文件读取失败'))
      }

      reader.readAsText(file)
    })
  }

  const mergeTemplates = (existingTemplates, importedTemplates, mode = 'merge') => {
    if (mode === 'replace') {
      return importedTemplates.map((t) => ({
        ...t,
        id: generateId()
      }))
    }

    const existingIds = new Set(existingTemplates.map((t) => t.id))
    const existingTitles = new Set(existingTemplates.map((t) => t.title))
    const result = [...existingTemplates]

    for (const t of importedTemplates) {
      const hasDuplicateId = existingIds.has(t.id)
      const hasDuplicateTitle = existingTitles.has(t.title)

      if (hasDuplicateId || hasDuplicateTitle) {
        result.push({
          ...t,
          id: generateId(),
          title: hasDuplicateTitle ? t.title + ' (导入)' : t.title
        })
      } else {
        result.push(t)
      }
    }

    return result
  }

  return {
    isImporting,
    exportTemplates,
    importTemplates,
    mergeTemplates
  }
}
