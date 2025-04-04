# synthetix-vaults 项目索引

synthetix-vaults 是 TriplexPro 生态系统中负责资产金库管理的模块，基于以太坊区块链开发，使用 Solidity 语言实现。

## 项目结构

### 核心目录

- **contracts/** - 智能合约代码
  - **debt-repayer-base-andromeda/** - Andromeda 网络债务偿还基础合约
  - **position-manager-andromeda-statausdc/** - Andromeda 网络 STATAUSDC 头寸管理器
  - **position-manager-andromeda-usdc/** - Andromeda 网络 USDC 头寸管理器
  - **position-manager/** - 通用头寸管理器合约
  
- **liquidity/** - 流动性相关合约和逻辑

- **tools/** - 开发和测试工具

- **analysis-report/** - 分析报告和审计结果

### 配置文件

- `package.json` (97行) - 项目依赖和脚本配置
- `tsconfig.json` (39行) - TypeScript 编译配置
- `jest.config.js` (21行) - 测试框架配置
- `.eslintrc.js` (105行) - 代码规范检查配置
- `.prettierrc` (15行) - 代码格式化配置

## 主要功能

1. **金库管理** - 提供资产存储和管理功能
2. **头寸管理** - 跟踪和管理用户在系统中的头寸
3. **债务偿还** - 处理借贷和偿还逻辑
4. **流动性提供** - 管理系统流动性池
5. **风险管理** - 提供各种风险控制措施

## 技术栈

- Solidity - 智能合约开发语言
- TypeScript - 测试和脚本开发
- Hardhat - 以太坊开发环境
- Jest - 测试框架
- Ethers.js - 以太坊交互库

## 开发工具

- ESLint - 代码质量检查
- Prettier - 代码格式化
- CircleCI - 持续集成服务
- Codecov - 代码覆盖率分析

## 部署环境

- Andromeda 网络 - 项目主要部署的网络
- 以太坊测试网 - 用于测试和验证

## 合约交互

synthetix-vaults 系统的核心工作流程包括:

1. 用户通过头寸管理器创建头寸
2. 系统记录用户存入的资产和相应的债务
3. 头寸根据市场情况产生收益或损失
4. 用户可以增加抵押品、提取抵押品或关闭头寸
5. 在特定条件下，系统可以清算风险过高的头寸

## 集成和依赖

- Synthetix V3 核心协议
- 价格预言机服务
- 链下数据源
- 跨链桥接服务 