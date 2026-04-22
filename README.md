<div align="center">

# WeiPrompt

✨ 智能提示词生成与管理工具

[![Vue](https://img.shields.io/badge/Vue-3.3.4-brightgreen.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.5-blue.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.0-cyan.svg)](https://tailwindcss.com/)
[![Pinia](https://img.shields.io/badge/Pinia-3.0.4-yellow.svg)](https://pinia.vuejs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

[功能特性](#-功能特性) •
[快速开始](#-快速开始) •
[使用指南](#-使用指南) •
[技术架构](#-技术架构) •
[开发计划](#-开发计划) •
[贡献指南](#-贡献指南)

</div>

---

## 📖 项目简介

WeiPrompt 是一款轻量级、高效的个人提示词模板管理工具，专为提升 AI 对话效率而设计。无论您是内容创作者、开发者、学生还是商业分析师，WeiPrompt 都能帮助您系统化地管理和复用高质量的提示词模板。

> 💡 **为什么选择 WeiPrompt？**
> - 开箱即用，无需注册
> - 数据安全，本地存储
> - 分类清晰，易于管理
> - 支持变量，灵活定制

## ✨ 功能特性

| 功能 | 描述 |
|------|------|
| 📂 **模板分类管理** | 内容创作、编程开发、学习辅助、商业分析四大分类 |
| 🔄 **变量动态生成** | 支持文本、下拉选择等多种变量类型 |
| ⭐ **模板收藏** | 一键标记常用模板，快速访问 |
| 🔍 **智能搜索** | 关键词搜索、分类筛选，快速定位 |
| 📤📥 **导入导出** | 轻松备份和分享模板库 |
| 🌓 **主题切换** | 深色/浅色模式，护眼全天侯 |
| 💾 **本地存储** | 数据存储在本地，无需网络 |
| 📱 **响应式设计** | 完美适配桌面和移动设备 |

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装与运行

```bash
# 克隆项目
git clone https://github.com/your-username/weiprompt.git
cd weiprompt

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

访问 `http://localhost:5173` 即可开始使用。

## 📖 使用指南

### 1. 创建模板

1. 点击顶部「新建模板」按钮
2. 填写标题、描述和内容
3. 添加自定义变量（支持文本和下拉选择）
4. 选择分类和标签
5. 保存即可

### 2. 使用模板变量

在模板内容中使用 `{{变量名}}` 语法定义占位符，例如：

```
请为"{{topic}}"这个主题生成一篇文章...
```

预览时变量会自动转换为输入框，填入内容后即可生成最终的提示词。

### 3. 分类与搜索

- **分类筛选**：左侧边栏选择分类查看
- **关键词搜索**：顶部搜索框输入关键词
- **收藏筛选**：点击星标图标仅显示收藏模板

### 4. 数据管理

- **导出**：点击顶部导出按钮，下载 JSON 格式备份
- **导入**：点击导入按钮，选择备份文件恢复数据

## 🏗️ 技术架构

### 技术栈

| 层级 | 技术选型 |
|------|----------|
| 前端框架 | Vue 3.3.4 + Composition API |
| 构建工具 | Vite 4.4.5 |
| 样式框架 | Tailwind CSS 3.3.0 |
| 状态管理 | Pinia 3.0.4 |
| 工具库 | @vueuse/core 10.1.2 |
| 代码规范 | ESLint 10.2.1 + Prettier 3.8.3 |
| 测试框架 | Vitest 4.1.5 |

### 项目结构

```
src/
├── components/          # 组件目录
│   ├── HeaderBar.vue        # 顶部导航栏
│   ├── CategorySidebar.vue  # 分类侧边栏
│   ├── TemplateCard.vue     # 模板卡片
│   ├── TemplateEditor.vue   # 模板编辑器
│   ├── TemplatePreview.vue  # 模板预览器
│   ├── ToastNotification.vue # 消息提示
│   └── ConfirmDialog.vue    # 确认对话框
├── composables/         # 组合式函数
│   ├── useStorage.js        # 本地存储
│   ├── useImportExport.js   # 导入导出
│   └── useToast.js          # 消息提示
├── constants/           # 常量定义
│   ├── categories.js        # 分类定义
│   └── defaultTemplates.js  # 默认模板
├── stores/              # Pinia 状态管理
│   └── useTemplateStore.js  # 模板状态
├── App.vue              # 根组件
├── main.js              # 入口文件
└── style.css            # 全局样式
```

### 核心模块说明

- **useStorage.js** - 封装 localStorage 操作，支持数据持久化
- **useImportExport.js** - 处理模板的导入导出逻辑
- **useTemplateStore.js** - 统一管理模板状态，包括增删改查、搜索筛选等

## 🧪 开发与测试

```bash
# 代码检查
npm run lint

# 自动修复代码风格
npm run lint:fix

# 运行测试
npm run test

# 监听模式运行测试
npm run test:watch
```

## 🗺️ 开发计划

### 阶段一：增强版（进行中）

- [x] Pinia 状态管理集成
- [x] ESLint + Prettier 代码规范
- [x] Vitest 单元测试
- [ ] IndexedDB 大数据存储
- [ ] PWA 离线支持
- [ ] 移动端体验优化

### 阶段二：云化版（规划中）

- [ ] 用户注册登录
- [ ] 云端数据同步
- [ ] 模板分享链接
- [ ] 多设备无缝体验

### 阶段三：平台版（规划中）

- [ ] 模板社区广场
- [ ] 评分评论系统
- [ ] 创作者主页
- [ ] 团队协作空间

### 阶段四：AI 增强版（规划中）

- [ ] 智能模板推荐
- [ ] 提示词自动优化
- [ ] AI 辅助模板生成
- [ ] 主流 AI 平台一键集成

## 🤝 贡献指南

我们欢迎任何形式的贡献！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 代码规范

- 使用 Vue 3 Composition API + `<script setup>`
- 遵循 ESLint 和 Prettier 规范
- 组件名使用 PascalCase
- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下优秀项目：

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Pinia](https://pinia.vuejs.org/) - Vue 状态管理库
- [Font Awesome](https://fontawesome.com/) - 图标库

---

<div align="center">

**如果这个项目对您有帮助，请给一个 ⭐ Star！**

Made with ❤️ by WeiPrompt Team

</div>
