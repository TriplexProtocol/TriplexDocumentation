# TriplexDoc 项目索引

TriplexDoc 是 TriplexPro 生态系统的文档项目，提供整个系统的技术文档、用户指南和项目索引，使用 Next.js 和 Nextra 构建。

## 项目结构

### 核心目录

- **app/** - Next.js 应用代码
  
- **content/** - 文档内容文件
  
- **public/** - 静态资源文件

- **synthetix-docs/** - Synthetix 相关文档

- **TriplexWorkSpace/** - 工作空间项目索引文件夹

- **nextra-remote-filepaths/** - Nextra 扩展组件

### 配置文件

- `package.json` (41行) - 项目依赖和脚本
- `tsconfig.json` (32行) - TypeScript 配置
- `next.config.ts` (95行) - Next.js 配置
- `vercel.json` (4行) - Vercel 部署配置
- `postcss.config.js` (7行) - PostCSS 配置

## 主要功能

1. **技术文档** - 提供系统各组件的技术说明
2. **用户指南** - 为用户提供使用说明
3. **API 文档** - 描述系统 API 接口
4. **项目索引** - 提供各个子项目的结构和功能索引
5. **开发指南** - 为开发者提供贡献指南

## 技术栈

- Next.js - React 框架
- Nextra - 文档网站框架
- TypeScript - 类型安全的 JavaScript
- MDX - Markdown 扩展
- TailwindCSS - 样式框架

## 文档结构

### 主要章节

- **介绍** - 项目概述和背景
- **入门指南** - 快速上手教程
- **核心概念** - 系统基本概念和术语
- **组件文档** - 各个组件的详细文档
- **API 参考** - API 接口说明
- **教程** - 常见使用场景教程
- **常见问题** - FAQ 和故障排除

### 特殊章节

- **工作空间索引** - 各子项目的结构和功能说明
- **Synthetix 文档** - Synthetix 相关文档
- **开发者文档** - 面向开发者的技术文档

## 文档生成和部署

- 使用 MDX 编写文档内容
- 使用 Nextra 转换为交互式网站
- 通过 Vercel 部署和托管

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 文档更新流程

1. 创建或编辑 content/ 目录下的 MDX 文件
2. 本地预览更改
3. 提交更改到仓库
4. Vercel 自动部署最新版本

## 多语言支持

文档支持多种语言：

- 英文 (默认)
- 中文
- 其他语言 (计划中)

## 交互式元素

- 代码示例 (带语法高亮)
- 交互式教程
- API 请求示例
- 响应式设计支持各种设备

## 与项目的关系

TriplexDoc 项目是整个 TriplexPro 生态系统的知识中心，提供了:

- 各个子项目的详细说明
- 系统间的集成指南
- 用户和开发者文档
- 项目结构和功能索引 