import { describe, it, expect, beforeEach } from 'vitest'
import { useStorage } from '../useStorage.js'

describe('useStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should save and load templates', () => {
    const { save, load } = useStorage()
    const data = [
      {
        id: 1,
        title: '测试模板',
        category: 'writing',
        content: '测试内容',
        description: '',
        variables: [],
        tags: [],
        usageCount: 0,
        isFavorite: false
      }
    ]

    save(data)
    const loaded = load()

    expect(loaded).toEqual(data)
  })

  it('should return null when no data exists', () => {
    const { load } = useStorage()
    const loaded = load()

    expect(loaded).toBeNull()
  })

  it('should return null for invalid JSON', () => {
    localStorage.setItem('weiprompt-templates', 'not-json')
    const { load } = useStorage()
    const loaded = load()

    expect(loaded).toBeNull()
  })

  it('should return null for non-array data', () => {
    localStorage.setItem('weiprompt-templates', JSON.stringify({ foo: 'bar' }))
    const { load } = useStorage()
    const loaded = load()

    expect(loaded).toBeNull()
  })

  it('should return null for invalid template schema', () => {
    localStorage.setItem('weiprompt-templates', JSON.stringify([{ id: 'not-number', title: 123 }]))
    const { load } = useStorage()
    const loaded = load()

    expect(loaded).toBeNull()
  })

  it('should handle save errors gracefully', () => {
    const { save } = useStorage()

    expect(() => save(undefined)).not.toThrow()
  })
})
