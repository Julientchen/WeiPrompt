export const DEFAULT_TEMPLATES = [
  {
    id: 1,
    title: '文章大纲生成器',
    description: '根据主题自动生成文章大纲结构',
    category: 'writing',
    content:
      '请为"{{topic}}"这个主题生成一个详细的文章大纲，要求：\n1. 包含引言、正文、结论三部分\n2. 正文部分至少包含3个主要论点\n3. 每个论点下要有2-3个支持点\n4. 大纲要逻辑清晰，层次分明\n5. 适合{{audience}}阅读',
    variables: [
      { name: 'topic', label: '文章主题', type: 'text' },
      {
        name: 'audience',
        label: '目标读者',
        type: 'select',
        options: [
          { value: '普通读者', label: '普通读者' },
          { value: '专业人士', label: '专业人士' },
          { value: '学生群体', label: '学生群体' },
          { value: '企业用户', label: '企业用户' }
        ]
      }
    ],
    tags: ['内容创作', '大纲', '结构化'],
    usageCount: 0,
    isFavorite: true
  },
  {
    id: 2,
    title: '创意写作助手',
    description: '激发创意灵感，辅助故事创作',
    category: 'writing',
    content:
      '请基于以下元素创作一个{{genre}}故事：\n\n主题：{{theme}}\n主角：{{protagonist}}\n冲突：{{conflict}}\n\n要求：\n1. 故事要有起承转合\n2. 人物形象鲜明\n3. 情节引人入胜\n4. 字数约{{wordCount}}字',
    variables: [
      {
        name: 'genre',
        label: '故事类型',
        type: 'select',
        options: [
          { value: '奇幻', label: '奇幻' },
          { value: '科幻', label: '科幻' },
          { value: '悬疑', label: '悬疑' },
          { value: '爱情', label: '爱情' },
          { value: '现实', label: '现实' }
        ]
      },
      { name: 'theme', label: '故事主题', type: 'text' },
      { name: 'protagonist', label: '主角设定', type: 'text' },
      { name: 'conflict', label: '主要冲突', type: 'text' },
      {
        name: 'wordCount',
        label: '字数要求',
        type: 'select',
        options: [
          { value: '500', label: '500字' },
          { value: '1000', label: '1000字' },
          { value: '2000', label: '2000字' },
          { value: '5000', label: '5000字' }
        ]
      }
    ],
    tags: ['创意写作', '故事创作', '灵感'],
    usageCount: 0,
    isFavorite: true
  },
  {
    id: 3,
    title: '营销文案优化',
    description: '优化营销文案，提升转化率',
    category: 'writing',
    content:
      '请优化以下营销文案，使其更具吸引力和转化力：\n\n产品：{{product}}\n目标客户：{{target}}\n核心卖点：{{sellingPoint}}\n\n原文案：{{originalText}}\n\n优化要求：\n1. 突出产品价值\n2. 激发购买欲望\n3. 适合{{platform}}平台发布\n4. 保持简洁有力',
    variables: [
      { name: 'product', label: '产品名称', type: 'text' },
      { name: 'target', label: '目标客户', type: 'text' },
      { name: 'sellingPoint', label: '核心卖点', type: 'text' },
      { name: 'originalText', label: '原文案', type: 'text' },
      {
        name: 'platform',
        label: '发布平台',
        type: 'select',
        options: [
          { value: '微信公众号', label: '微信公众号' },
          { value: '小红书', label: '小红书' },
          { value: '抖音', label: '抖音' },
          { value: '微博', label: '微博' },
          { value: '电商平台', label: '电商平台' }
        ]
      }
    ],
    tags: ['营销文案', '优化', '转化率'],
    usageCount: 0,
    isFavorite: false
  },
  {
    id: 4,
    title: '代码审查助手',
    description: '帮助审查代码质量，提供改进建议',
    category: 'coding',
    content:
      '请帮我审查以下{{language}}代码的质量，重点关注：\n1. 代码规范性和可读性\n2. 潜在的性能问题\n3. 安全漏洞\n4. 最佳实践遵循情况\n5. {{specificFocus}}方面的优化\n\n代码：{{code}}\n\n请提供具体的改进建议。',
    variables: [
      {
        name: 'language',
        label: '编程语言',
        type: 'select',
        options: [
          { value: 'JavaScript', label: 'JavaScript' },
          { value: 'Python', label: 'Python' },
          { value: 'Java', label: 'Java' },
          { value: 'C++', label: 'C++' },
          { value: 'Go', label: 'Go' }
        ]
      },
      { name: 'specificFocus', label: '重点关注', type: 'text' },
      { name: 'code', label: '代码内容', type: 'text' }
    ],
    tags: ['代码审查', '质量检查', '最佳实践'],
    usageCount: 0,
    isFavorite: true
  },
  {
    id: 5,
    title: 'API文档生成',
    description: '根据代码生成API接口文档',
    category: 'coding',
    content:
      '请为以下{{language}}代码生成API文档：\n\n接口功能：{{function}}\n请求方法：{{method}}\n参数说明：{{parameters}}\n返回格式：{{responseFormat}}\n\n代码：{{code}}\n\n文档要求：\n1. 包含接口说明、参数说明、返回值说明\n2. 提供使用示例\n3. 错误码说明\n4. 版本信息',
    variables: [
      {
        name: 'language',
        label: '编程语言',
        type: 'select',
        options: [
          { value: 'JavaScript', label: 'JavaScript' },
          { value: 'Python', label: 'Python' },
          { value: 'Java', label: 'Java' }
        ]
      },
      { name: 'function', label: '接口功能', type: 'text' },
      {
        name: 'method',
        label: '请求方法',
        type: 'select',
        options: [
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
          { value: 'DELETE', label: 'DELETE' }
        ]
      },
      { name: 'parameters', label: '参数说明', type: 'text' },
      { name: 'responseFormat', label: '返回格式', type: 'text' },
      { name: 'code', label: '相关代码', type: 'text' }
    ],
    tags: ['API文档', '开发', '接口'],
    usageCount: 0,
    isFavorite: false
  },
  {
    id: 6,
    title: '错误调试助手',
    description: '帮助分析和解决编程错误',
    category: 'coding',
    content:
      '遇到以下{{language}}错误，请帮我分析原因并提供解决方案：\n\n错误信息：{{errorMessage}}\n相关代码：{{code}}\n运行环境：{{environment}}\n\n请分析：\n1. 错误产生的原因\n2. 可能的解决方案\n3. 预防措施\n4. 相关的最佳实践',
    variables: [
      {
        name: 'language',
        label: '编程语言',
        type: 'select',
        options: [
          { value: 'JavaScript', label: 'JavaScript' },
          { value: 'Python', label: 'Python' },
          { value: 'Java', label: 'Java' }
        ]
      },
      { name: 'errorMessage', label: '错误信息', type: 'text' },
      { name: 'code', label: '相关代码', type: 'text' },
      { name: 'environment', label: '运行环境', type: 'text' }
    ],
    tags: ['错误调试', '问题解决', '编程'],
    usageCount: 0,
    isFavorite: false
  },
  {
    id: 7,
    title: '学习计划制定',
    description: '帮助制定个性化的学习计划和时间安排',
    category: 'learning',
    content:
      '请帮我制定一个{{subject}}的学习计划：\n\n学习目标：{{goal}}\n当前水平：{{currentLevel}}\n可用时间：{{availableTime}}/天\n学习期限：{{deadline}}\n\n要求：\n1. 分阶段制定学习内容\n2. 包含具体的学习方法\n3. 设置阶段性目标\n4. 提供学习资源建议',
    variables: [
      { name: 'subject', label: '学习科目', type: 'text' },
      { name: 'goal', label: '学习目标', type: 'text' },
      {
        name: 'currentLevel',
        label: '当前水平',
        type: 'select',
        options: [
          { value: '零基础', label: '零基础' },
          { value: '入门', label: '入门' },
          { value: '中级', label: '中级' },
          { value: '高级', label: '高级' }
        ]
      },
      {
        name: 'availableTime',
        label: '每日学习时间',
        type: 'select',
        options: [
          { value: '1小时', label: '1小时' },
          { value: '2小时', label: '2小时' },
          { value: '3小时', label: '3小时' },
          { value: '4小时以上', label: '4小时以上' }
        ]
      },
      { name: 'deadline', label: '学习期限', type: 'text' }
    ],
    tags: ['学习计划', '时间管理', '个性化'],
    usageCount: 0,
    isFavorite: true
  },
  {
    id: 8,
    title: '知识点总结',
    description: '帮助整理和总结学习知识点',
    category: 'learning',
    content:
      '请帮我总结{{topic}}这个知识点：\n\n核心概念：{{concept}}\n重点内容：{{keyPoints}}\n应用场景：{{application}}\n\n总结要求：\n1. 结构清晰，层次分明\n2. 包含定义、特点、应用\n3. 提供记忆技巧\n4. 举例说明',
    variables: [
      { name: 'topic', label: '知识点主题', type: 'text' },
      { name: 'concept', label: '核心概念', type: 'text' },
      { name: 'keyPoints', label: '重点内容', type: 'text' },
      { name: 'application', label: '应用场景', type: 'text' }
    ],
    tags: ['知识点', '总结', '学习'],
    usageCount: 0,
    isFavorite: false
  },
  {
    id: 9,
    title: '市场分析报告',
    description: '生成专业的市场分析报告',
    category: 'business',
    content:
      '请帮我分析{{industry}}行业的市场情况：\n\n分析维度：{{dimensions}}\n目标市场：{{targetMarket}}\n竞争对手：{{competitors}}\n时间范围：{{timeRange}}\n\n报告要求：\n1. 市场规模和增长趋势\n2. 竞争格局分析\n3. 用户需求洞察\n4. 机会和挑战分析\n5. 战略建议',
    variables: [
      { name: 'industry', label: '行业领域', type: 'text' },
      { name: 'dimensions', label: '分析维度', type: 'text' },
      { name: 'targetMarket', label: '目标市场', type: 'text' },
      { name: 'competitors', label: '主要竞争对手', type: 'text' },
      { name: 'timeRange', label: '时间范围', type: 'text' }
    ],
    tags: ['市场分析', '商业', '报告'],
    usageCount: 0,
    isFavorite: false
  },
  {
    id: 10,
    title: '产品需求文档',
    description: '生成标准的产品需求文档框架',
    category: 'business',
    content:
      '请帮我撰写{{product}}的产品需求文档：\n\n产品概述：{{overview}}\n目标用户：{{targetUsers}}\n核心功能：{{coreFeatures}}\n业务价值：{{businessValue}}\n\n文档结构：\n1. 产品背景和目标\n2. 用户画像和需求分析\n3. 功能规格说明\n4. 非功能性需求\n5. 项目时间规划',
    variables: [
      { name: 'product', label: '产品名称', type: 'text' },
      { name: 'overview', label: '产品概述', type: 'text' },
      { name: 'targetUsers', label: '目标用户', type: 'text' },
      { name: 'coreFeatures', label: '核心功能', type: 'text' },
      { name: 'businessValue', label: '业务价值', type: 'text' }
    ],
    tags: ['产品文档', '需求分析', '商业'],
    usageCount: 0,
    isFavorite: false
  }
]
