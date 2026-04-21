import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '../composables/useStorage.js'
import { useToast } from '../composables/useToast.js'
import { CATEGORIES } from '../constants/categories.js'
import { DEFAULT_TEMPLATES } from '../constants/defaultTemplates.js'

export const useTemplateStore = defineStore('template', () => {
  const { save: saveToStorage, load: loadFromStorage } = useStorage()
  const { showToast } = useToast()

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
          template.description.toLowerCase().includes(query) ||
          template.tags.some((tag) => tag.toLowerCase().includes(query))
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
      saveToStorage(templates.value)
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
    selectedTemplate.value = template
    editingTemplate.value = null
    template.usageCount = (template.usageCount || 0) + 1
    saveToStorage(templates.value)
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
      showToast('请输入模板标题', 'warning')
      return false
    }

    if (!template.content.trim()) {
      showToast('请输入模板内容', 'warning')
      return false
    }

    if (!template.id) {
      template.id = Date.now()
      template.tags = ['自定义']
      templates.value.push(template)
    } else {
      const index = templates.value.findIndex((t) => t.id === template.id)
      if (index !== -1) {
        templates.value[index] = template
      }
    }

    saveToStorage(templates.value)
    updateCategoryCounts()
    editingTemplate.value = null
    showToast('模板保存成功')
    return true
  }

  function confirmDelete(id) {
    deleteTargetId.value = id
    showDeleteConfirm.value = true
  }

  function executeDelete() {
    if (deleteTargetId.value) {
      const index = templates.value.findIndex((t) => t.id === deleteTargetId.value)
      if (index !== -1) {
        templates.value.splice(index, 1)
        saveToStorage(templates.value)
        updateCategoryCounts()
        showToast('模板已删除')
      }
    }
    showDeleteConfirm.value = false
    deleteTargetId.value = null
    editingTemplate.value = null
    selectedTemplate.value = null
  }

  function toggleFavorite(templateId) {
    const template = templates.value.find((t) => t.id === templateId)
    if (template) {
      template.isFavorite = !template.isFavorite
      saveToStorage(templates.value)
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
    templates.value = newTemplates
    saveToStorage(templates.value)
    updateCategoryCounts()
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
