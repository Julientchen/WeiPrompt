# WeiPrompt 代码改进文档

**文档版本**：v1.0  
**创建日期**：2026-04-22  
**项目路径**：d:\Codelab\Prompt1

---

## 📋 目录

1. [改进优先级总览](#-改进优先级总览)
2. [🔴 高优先级问题 - 立即修复](#-高优先级问题---立即修复)
3. [🟡 中优先级问题 - 近期修复](#-中优先级问题---近期修复)
4. [🟢 低优先级问题 - 按需修复](#-低优先级问题---按需修复)
5. [修复执行计划](#-修复执行计划)
6. [验证清单](#-验证清单)

---

## 📊 改进优先级总览

| 优先级 | 问题数量 | 预计工时 |
|--------|----------|----------|
| 🔴 高 | 2 | 1-2 小时 |
| 🟡 中 | 3 | 6-10 小时 |
| 🟢 低 | 3 | 6-10 小时 |

---

## 🔴 高优先级问题 - 立即修复

### 问题 1: TemplateEditor 直接修改 Prop

**严重程度**：高  
**问题位置**：`src/components/TemplateEditor.vue`

#### 问题描述

TemplateEditor 组件中直接修改 prop，违反 Vue 的单向数据流原则：

```javascript
const addVariable = () => {
  if (!props.editingTemplate.variables) {
    props.editingTemplate.variables = []  // ❌ 直接修改 prop
  }
  props.editingTemplate.variables.push({  // ❌ 直接修改 prop
    name: `var${props.editingTemplate.variables.length + 1}`,
    label: '',
    type: 'text',
    options: []
  })
}

const removeVariable = (index) => {
  props.editingTemplate.variables.splice(index, 1)  // ❌ 直接修改 prop
}

const addOption = (variable) => {
  if (!variable.options) {
    variable.options = []  // ❌ 直接修改 prop
  }
  variable.options.push({ value: '', label: '' })  // ❌ 直接修改 prop
}

const removeOption = (variable, index) => {
  variable.options.splice(index, 1)  // ❌ 直接修改 prop
}
```

#### 风险

- 违反 Vue 单向数据流原则
- 状态变化难以追踪
- 可能导致意外的副作用
- 难以调试

#### 修复方案

在组件内部创建本地 ref，保存时再 emit：

```javascript
const localTemplate = ref(JSON.parse(JSON.stringify(props.editingTemplate)))

watch(() => props.editingTemplate, (newVal) => {
  localTemplate.value = JSON.parse(JSON.stringify(newVal))
}, { immediate: true })

const addVariable = () => {
  if (!localTemplate.value.variables) {
    localTemplate.value.variables = []
  }
  localTemplate.value.variables.push({
    name: `var${localTemplate.value.variables.length + 1}`,
    label: '',
    type: 'text',
    options: []
  })
}

const handleSave = () => {
  emit('save', toRaw(localTemplate.value))
}
```

#### 验收标准

- [ ] 组件内部使用本地 ref 管理状态
- [ ] 不直接修改 prop
- [ ] 所有功能正常工作
- [ ] 编辑状态正确同步

---

### 问题 2: TemplateEditor 分类硬编码

**严重程度**：高  
**问题位置**：`src/components/TemplateEditor.vue:28-33`

#### 问题描述

分类选项硬编码在组件中，与 `categories.js` 中的定义重复：

```vue
<select v-model="editingTemplate.category" class="input-field">
  <option value="writing">内容创作</option>
  <option value="coding">编程开发</option>
  <option value="learning">学习辅助</option>
  <option value="business">商业分析</option>
</select>
```

#### 风险

- 代码重复，维护困难
- 添加新分类时需要修改多处
- 容易出现不一致

#### 修复方案

从 `categories.js` 导入并动态渲染：

```javascript
import { CATEGORIES } from '../constants/categories.js'

const availableCategories = computed(() => 
  CATEGORIES.filter(c => c.id !== 'all')
)
```

```vue
<select v-model="localTemplate.category" class="input-field">
  <option 
    v-for="category in availableCategories" 
    :key="category.id" 
    :value="category.id"
  >
    {{ category.name }}
  </option>
</select>
```

#### 验收标准

- [ ] 分类从 `categories.js` 导入
- [ ] 没有硬编码的分类选项
- [ ] 分类显示正确

---

## 🟡 中优先级问题 - 近期修复

### 问题 3: 缺少 ESLint 和 Prettier

**严重程度**：中  
**问题位置**：项目根目录

#### 问题描述

项目没有配置代码规范检查工具：
- 没有 ESLint
- 没有 Prettier
- 没有 Git Hooks

#### 风险

- 代码风格不一致
- 潜在的代码质量问题难以发现
- 团队协作困难

#### 修复方案

1. 安装依赖：

```bash
npm install -D eslint eslint-plugin-vue prettier eslint-config-prettier eslint-plugin-prettier husky lint-staged
```

2. 创建配置文件：
   - `.eslintrc.js`
   - `.prettierrc`
   - `.eslintignore`

3. 配置 Git Hooks

#### 验收标准

- [ ] ESLint 配置完成
- [ ] Prettier 配置完成
- [ ] `npm run lint` 可以正常运行
- [ ] 现有代码通过 lint 检查

---

### 问题 4: 缺少状态管理（Pinia）

**严重程度**：中  
**问题位置**：`src/App.vue`

#### 问题描述

所有状态都在 App.vue 中管理：
- 没有统一的状态管理
- 状态传递复杂
- 难以进行状态持久化和调试

#### 修复方案

1. 安装 Pinia：

```bash
npm install pinia
```

2. 创建 Store：
   - `src/stores/useTemplateStore.js`

3. 迁移状态到 Store

#### 验收标准

- [ ] Pinia 配置完成
- [ ] 模板状态迁移到 Store
- [ ] 所有功能正常工作
- [ ] 代码更清晰易读

---

### 问题 5: 缺少基础单元测试

**严重程度**：中  
**问题位置**：整个项目

#### 问题描述

项目没有任何测试代码，特别是核心逻辑没有测试覆盖。

#### 修复方案

1. 安装 Vitest：

```bash
npm install -D vitest @vue/test-utils happy-dom
```

2. 创建测试文件：
   - `src/composables/__tests__/useStorage.test.js`
   - `src/composables/__tests__/useImportExport.test.js`

3. 编写测试用例

#### 验收标准

- [ ] Vitest 配置完成
- [ ] `useStorage.js` 有测试覆盖
- [ ] `useImportExport.js` 有测试覆盖
- [ ] `npm run test` 可以正常运行

---

## 🟢 低优先级问题 - 按需修复

### 问题 6: localStorage 容量限制

**严重程度**：低  
**问题位置**：`src/composables/useStorage.js`

#### 问题描述

localStorage 容量有限（约 5MB），大量模板时可能不够用。

#### 修复方案

升级到 IndexedDB，可以使用 `localForage` 库简化开发：

```bash
npm install localforage
```

#### 验收标准

- [ ] 使用 IndexedDB 替代 localStorage
- [ ] 数据迁移逻辑完善
- [ ] 所有功能正常工作

---

### 问题 7: 移动端体验优化

**严重程度**：低  
**问题位置**：整个项目

#### 问题描述

当前有基础响应式设计，但移动端体验可以进一步优化：
- 侧边栏在移动端可以折叠
- 触摸交互优化
- 字体大小调整

#### 修复方案

1. 添加移动端专用布局
2. 优化触摸交互
3. 添加响应式断点

#### 验收标准

- [ ] 移动端布局美观
- [ ] 触摸交互流畅
- [ ] 在小屏幕设备上正常使用

---

### 问题 8: 大量模板时的性能优化

**严重程度**：低  
**问题位置**：模板列表

#### 问题描述

当模板数量很多时（>100），页面可能出现卡顿。

#### 修复方案

1. 添加虚拟滚动（使用 `vue-virtual-scroller`）
2. 搜索防抖
3. 懒加载组件

#### 验收标准

- [ ] 虚拟滚动实现
- [ ] 大量模板时页面流畅
- [ ] 搜索体验良好

---

## 📅 修复执行计划

### 第一阶段（立即执行 - 1-2 小时）

```
第 1 步 ──►  问题 1 (TemplateEditor prop 修改)  ──►  1 小时
  │
  ▼
第 2 步 ──►  问题 2 (分类去重)  ──►  30 分钟
```

### 第二阶段（近期执行 - 1-2 天）

```
第 3 步 ──►  问题 3 (ESLint + Prettier)  ──►  2 小时
  │
  ▼
第 4 步 ──►  问题 4 (Pinia 状态管理)  ──►  4-6 小时
  │
  ▼
第 5 步 ──►  问题 5 (单元测试)  ──►  4-6 小时
```

### 第三阶段（按需执行）

```
第 6 步 ──►  问题 6 (IndexedDB)  ──►  按需
  │
  ▼
第 7 步 ──►  问题 7 (移动端优化)  ──►  按需
  │
  ▼
第 8 步 ──►  问题 8 (性能优化)  ──►  按需
```

---

## ✅ 验证清单

修复完成后必须验证：

- [ ] 项目可以正常 `npm run dev`
- [ ] 项目可以正常 `npm run build`
- [ ] 明暗主题切换正常
- [ ] 新建模板功能正常
- [ ] 编辑模板功能正常
- [ ] 变量添加/删除功能正常
- [ ] 预览和变量替换正常
- [ ] 复制到剪贴板正常
- [ ] 搜索过滤功能正常
- [ ] 分类筛选功能正常
- [ ] 分类计数显示正确
- [ ] 收藏功能正常
- [ ] 模板删除功能正常
- [ ] 导入/导出功能正常
- [ ] localStorage 数据持久化正常

---

## 📝 备注

- 修复时请保持现有的代码风格和命名约定
- 使用 Vue 3 Composition API + `<script setup>`
- Tailwind CSS 类名遵循现有模式
- 确保暗色模式适配完整
- 每次修复后运行验证清单

---

**文档维护者**：开发团队  
**最后更新**：2026-04-22
