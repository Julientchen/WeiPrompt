import { describe, it, expect } from 'vitest'
import { useImportExport } from '../useImportExport.js'

describe('useImportExport', () => {
  const { exportTemplates, importTemplates, mergeTemplates } = useImportExport()

  describe('exportTemplates', () => {
    it('should return success with template count', () => {
      const templates = [
        {
          id: 1,
          title: '测试',
          description: '描述',
          category: 'writing',
          content: '内容',
          variables: [],
          tags: ['标签'],
          usageCount: 5,
          isFavorite: true
        }
      ]

      const result = exportTemplates(templates)

      expect(result.success).toBe(true)
      expect(result.count).toBe(1)
    })
  })

  describe('importTemplates', () => {
    it('should reject non-JSON files', async () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' })

      await expect(importTemplates(file)).rejects.toThrow('请选择 JSON 文件')
    })

    it('should reject invalid JSON content', async () => {
      const file = new File(['not json'], 'test.json', { type: 'application/json' })

      await expect(importTemplates(file)).rejects.toThrow('文件解析失败')
    })

    it('should reject data without templates array', async () => {
      const data = JSON.stringify({ version: '1.0' })
      const file = new File([data], 'test.json', { type: 'application/json' })

      await expect(importTemplates(file)).rejects.toThrow('文件中未找到模板数据')
    })

    it('should reject empty templates array', async () => {
      const data = JSON.stringify({ templates: [] })
      const file = new File([data], 'test.json', { type: 'application/json' })

      await expect(importTemplates(file)).rejects.toThrow('文件中没有模板')
    })

    it('should reject templates with invalid title', async () => {
      const data = JSON.stringify({ templates: [{ title: '', content: 'test' }] })
      const file = new File([data], 'test.json', { type: 'application/json' })

      await expect(importTemplates(file)).rejects.toThrow('模板标题无效')
    })

    it('should successfully import valid templates', async () => {
      const templates = [
        {
          id: 1,
          title: '有效模板',
          content: '有效内容',
          description: '描述',
          category: 'coding',
          variables: [{ name: 'var1', label: '变量', type: 'text' }],
          tags: ['标签'],
          usageCount: 10,
          isFavorite: false
        }
      ]
      const data = JSON.stringify({ version: '1.0', templates })
      const file = new File([data], 'test.json', { type: 'application/json' })

      const result = await importTemplates(file)

      expect(result.count).toBe(1)
      expect(result.templates[0].title).toBe('有效模板')
    })
  })

  describe('mergeTemplates', () => {
    it('should replace all templates in replace mode', () => {
      const existing = [{ id: 1, title: '旧' }]
      const imported = [{ id: 1, title: '新' }]

      const result = mergeTemplates(existing, imported, 'replace')

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('新')
      expect(result[0].id).not.toBe(1)
    })

    it('should merge templates without duplicates', () => {
      const existing = [{ id: 1, title: '旧模板' }]
      const imported = [{ id: 2, title: '新模板' }]

      const result = mergeTemplates(existing, imported, 'merge')

      expect(result).toHaveLength(2)
    })

    it('should rename duplicate templates in merge mode', () => {
      const existing = [{ id: 1, title: '同名' }]
      const imported = [{ id: 2, title: '同名' }]

      const result = mergeTemplates(existing, imported, 'merge')

      expect(result).toHaveLength(2)
      expect(result[1].title).toBe('同名 (导入)')
    })
  })
})
