import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '../composables/useStorage.js'
import { CATEGORIES } from '../constants/categories.js'
import { DEFAULT_TEMPLATES } from '../constants/defaultTemplates.js'
import { generateId } from '../utils/idGenerator.js'

export const useTemplateStore = defineStore('template', () => {
  const { save: saveToStorage, load: loadFromStorage } = useStorage()

  const templates = ref([])
  const selectedTemplate = ref(null)
  const editingTemplate = ref(null)
  const selectedCategory = ref('all')
  const searchQuery = ref('')
  const categories = ref(CATEGORIES.map((c) => ({ ...c })))
  const showDeleteConfirm = ref(false)
  const deleteTargetId = ref(null)

  const filteredTemplates = computed(() => {
    let filtered = templates.value

    if (selectedCategory.value !== 'all') {
      filtered = filtered.filter((template) => template.category === selectedCategory.value)
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(
        (template) =>
          template.title.toLowerCase().includes(query) ||
          (template.description || '').toLowerCase().includes(query) ||
          (template.tags || []).some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  })

  function init() {
    const saved = loadFromStorage()
    if (saved) {
      templates.value = saved
    } else {
      templates.value = JSON.parse(JSON.stringify(DEFAULT_TEMPLATES))
      const result = saveToStorage(templates.value)
      if (!result.success) {
        console.warn(result.error)
      }
    }
    updateCategoryCounts()
  }

  function updateCategoryCounts() {
    categories.value.forEach((category) => {
      if (category.id === 'all') {
        category.count = templates.value.length
      } else {
        category.count = templates.value.filter((t) => t.category === category.id).length
      }
    })
  }

  function selectCategory(categoryId) {
    selectedCategory.value = categoryId
  }

  function selectTemplate(template) {
    const targetTemplate = templates.value.find((t) => t.id === template.id)
    if (targetTemplate) {
      targetTemplate.usageCount = (targetTemplate.usageCount || 0) + 1
      const result = saveToStorage(templates.value)
      if (!result.success) {
        targetTemplate.usageCount -= 1
      }
    }
    selectedTemplate.value = targetTemplate || template
    editingTemplate.value = null
  }

  function editTemplate(template) {
    editingTemplate.value = JSON.parse(JSON.stringify(template))
    selectedTemplate.value = null
  }

  function createNewTemplate() {
    editingTemplate.value = {
      id: null,
      title: '',
      description: '',
      category: 'writing',
      content: '',
      variables: [],
      tags: [],
      usageCount: 0,
      isFavorite: false
    }
    selectedTemplate.value = null
  }

  function cancelEdit() {
    editingTemplate.value = null
  }

  function saveTemplate(template) {
    if (!template.title.trim()) {
      return { success: false, message: '请输入模板标题', type: 'warning' }
    }

    if (!template.content.trim()) {
      return { success: false, message: '请输入模板内容', type: 'warning' }
    }

    const previous = template.id ? templates.value.find((t) => t.id === template.id) : null
    const snapshot = previous ? { ...previous } : null

    if (!template.id) {
      template.id = generateId()
      template.tags = ['自定义']
      templates.value.push(template)
    } else {
      const index = templates.value.findIndex((t) => t.id === template.id)
      if (index !== -1) {
        templates.value[index] = template
      }
    }

    const result = saveToStorage(templates.value)
    if (!result.success) {
      if (snapshot) {
        const index = templates.value.findIndex((t) => t.id === snapshot.id)
        if (index !== -1) templates.value[index] = snapshot
      } else {
        const index = templates.value.indexOf(template)
        if (index !== -1) templates.value.splice(index, 1)
      }
      updateCategoryCounts()
      return { success: false, message: result.error, type: 'error' }
    }

    updateCategoryCounts()
    editingTemplate.value = null
    return { success: true, message: '模板保存成功', type: 'success' }
  }

  function confirmDelete(id) {
    deleteTargetId.value = id
    showDeleteConfirm.value = true
  }

  function executeDelete() {
    let success = true
    let error = ''
    if (deleteTargetId.value) {
      const index = templates.value.findIndex((t) => t.id === deleteTargetId.value)
      if (index !== -1) {
        const [removed] = templates.value.splice(index, 1)
        const result = saveToStorage(templates.value)
        if (result.success) {
          updateCategoryCounts()
        } else {
          templates.value.splice(index, 0, removed)
          success = false
          error = result.error
        }
      }
    }
    showDeleteConfirm.value = false
    deleteTargetId.value = null
    if (success) {
      editingTemplate.value = null
      selectedTemplate.value = null
    }
    return { success, error }
  }

  function toggleFavorite(templateId) {
    const template = templates.value.find((t) => t.id === templateId)
    if (template) {
      template.isFavorite = !template.isFavorite
      const result = saveToStorage(templates.value)
      if (!result.success) {
        template.isFavorite = !template.isFavorite
      }
    }
  }

  function goHome() {
    selectedTemplate.value = null
    editingTemplate.value = null
  }

  function setSearchQuery(query) {
    searchQuery.value = query
  }

  function setTemplates(newTemplates) {
    const previous = templates.value
    templates.value = newTemplates
    const result = saveToStorage(templates.value)
    if (!result.success) {
      templates.value = previous
      return result
    }
    updateCategoryCounts()
    return result
  }

  return {
    templates,
    selectedTemplate,
    editingTemplate,
    selectedCategory,
    searchQuery,
    categories,
    showDeleteConfirm,
    deleteTargetId,
    filteredTemplates,
    init,
    selectCategory,
    selectTemplate,
    editTemplate,
    createNewTemplate,
    cancelEdit,
    saveTemplate,
    confirmDelete,
    executeDelete,
    toggleFavorite,
    goHome,
    setSearchQuery,
    setTemplates,
    updateCategoryCounts
  }
})
