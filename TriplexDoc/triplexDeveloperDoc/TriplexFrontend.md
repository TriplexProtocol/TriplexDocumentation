# TriplexFrontend 项目索引

TriplexFrontend 是 TriplexPro 生态系统的用户界面项目，提供用户与系统交互的网页界面，使用 Next.js 和 React 开发。

## 项目结构

### 核心目录

- **web/** - 主要的 Web 应用目录
  - **app/** - Next.js 应用路由和页面
  - **components/** - React 组件
  - **hooks/** - 自定义 React hooks
  - **lib/** - 工具库和辅助函数

- **packages/** - 共享包和组件库

### 配置文件

- `turbo.json` (22行) - Turborepo 配置
- `tsconfig.json` (5行) - TypeScript 编译配置
- `pnpm-workspace.yaml` (4行) - PNPM 工作区配置
- `package.json` (23行) - 项目依赖和脚本

## 主要功能

1. **用户界面** - 提供友好的用户交互界面
2. **资产管理** - 显示和管理用户资产
3. **金库操作** - 资产存取和金库交互
4. **图表展示** - 价格和收益数据可视化
5. **账户管理** - 用户账户信息和设置

## 技术栈

- Next.js - React 框架
- TypeScript - 类型安全的 JavaScript
- Tailwind CSS - 样式工具
- pnpm - 包管理器
- Turborepo - 单体仓库管理工具

## web 应用结构

- **web/components/** - UI 组件库
  - 按钮、输入框、导航栏等通用组件
  - 页面特定组件，如资产卡片、金库列表等
  
- **web/hooks/** - 应用逻辑钩子
  - 区块链交互钩子
  - 数据获取钩子
  - 状态管理钩子
  
- **web/lib/** - 工具函数
  - API 交互函数
  - 数据转换函数
  - 合约交互函数

## 应用路由

- `/` - 首页，显示总览信息
- `/assets` - 资产管理页面
- `/vaults` - 金库管理页面
- `/account` - 用户账户页面
- `/dashboard` - 用户仪表盘

## 集成点

- 与 Triplex 智能合约的集成 - 通过 Web3 API 交互
- 与 Synthetix 生态系统的集成 - 显示 Synthetix 相关数据
- 与钱包提供商的集成 - 支持多种区块链钱包

## 开发和部署

- 使用 `pnpm install` 安装依赖
- 使用 `pnpm dev` 运行开发服务器
- 使用 `pnpm build` 构建生产版本
- 使用 `pnpm test` 运行测试

## 响应式设计

界面支持多种设备尺寸，从手机到桌面都能提供良好的用户体验。 