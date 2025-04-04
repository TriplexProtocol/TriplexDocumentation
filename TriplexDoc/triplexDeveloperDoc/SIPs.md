# SIPs 项目索引

SIPs (Synthetix Improvement Proposals) 是 TriplexPro 生态系统中的 Synthetix 改进提案项目，记录并管理协议的治理和技术提案。

## 项目结构

### 核心目录

- **content/** - 提案内容
  - **sips/** - Synthetix 改进提案
  - **sccp/** - Synthetix 配置变更提案
  - **stps/** - Synthetix 技术提案
  - **srs/** - Synthetix 请求提案

- **src/** - 网站源代码

- **static/** - 静态资源

- **ci/** - 持续集成配置

### 模板文件

- `sip-x.md` (82行) - SIP 提案模板
- `sccp-x.md` (42行) - SCCP 提案模板
- `stp-x.md` (63行) - STP 提案模板
- `sr-x.md` (63行) - SR 提案模板

### 配置文件

- `package.json` (55行) - 项目依赖和脚本
- `gatsby-config.js` (59行) - Gatsby 网站配置
- `gatsby-node.js` (138行) - Gatsby 节点 API 配置
- `tailwind.config.js` (15行) - Tailwind CSS 配置

## 主要功能

1. **提案管理** - 记录和管理各类提案
2. **文档托管** - 提供提案的在线文档
3. **版本追踪** - 跟踪提案的变更历史
4. **状态跟踪** - 记录提案的当前状态
5. **参考文献** - 提供技术和治理参考资料

## 提案类型

### SIP (Synthetix Improvement Proposal)

Synthetix 改进提案，用于提议对协议进行重大更改，包括：
- 核心协议变更
- 新功能添加
- 架构调整
- 重大机制变更

### SCCP (Synthetix Configuration Change Proposal)

Synthetix 配置变更提案，用于更改协议参数，如：
- 费率调整
- 抵押率变更
- 奖励分配调整
- 其他不需要代码变更的配置修改

### STP (Synthetix Technical Proposal)

Synthetix 技术提案，关注技术实现细节：
- 技术规范
- 架构设计
- 实现方案
- 技术标准

### SR (Synthetix Request)

Synthetix 请求提案，用于社区成员请求功能或变更：
- 功能请求
- 问题修复请求
- 用户体验改进
- 新资产添加请求

## 提案流程

1. **草案** - 初始提案创建
2. **讨论** - 社区讨论和反馈
3. **审核** - 核心贡献者审核
4. **投票** - 社区投票（如适用）
5. **接受/拒绝** - 最终决策
6. **实施** - 被接受提案的实施

## 技术栈

- Gatsby - 静态网站生成器
- React - 用户界面库
- Tailwind CSS - 样式框架
- Markdown - 内容格式
- GitHub Actions - 持续集成

## 网站功能

- 提案浏览和搜索
- 提案状态跟踪
- 提案历史查看
- 分类筛选
- 移动端兼容

## 与生态系统集成

- 与 synthetix-v3 集成实现已批准的提案
- 与 TriplexDoc 集成提供文档参考
- 与社区治理机制联动
- 与开发路线图对齐

## 参与指南

### 提交新提案

1. Fork 仓库
2. 基于适当模板创建新提案
3. 填写所有必要信息
4. 提交 Pull Request
5. 参与讨论和修改

### 本地运行网站

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run start
```

## 提案状态说明

- **Draft** - 初始草案阶段
- **Feasibility** - 可行性评估阶段
- **SC Review** - 智能合约审核阶段
- **Vote Pending** - 等待投票
- **Approved** - 已批准
- **Rejected** - 已拒绝
- **Implemented** - 已实施 