# synthetix-deployments 项目索引

synthetix-deployments 是 TriplexPro 生态系统中的部署配置项目，管理 Synthetix 协议在各个网络上的部署配置和参数。

## 项目结构

### 核心目录

- **tomls/** - TOML 配置文件目录
  - **omnibus-arbitrum-mainnet/** - Arbitrum 主网配置
  - **omnibus-arbitrum-sepolia/** - Arbitrum Sepolia 测试网配置
  - **omnibus-base-mainnet-andromeda/** - Base 主网 Andromeda 配置
  - **omnibus-base-sepolia-andromeda/** - Base Sepolia Andromeda 配置
  - **omnibus-mainnet/** - 以太坊主网配置
  - **omnibus-optimism-mainnet/** - Optimism 主网配置
  - **omnibus-sepolia/** - Sepolia 测试网配置
  - **omnibus-snaxchain-mainnet/** - Snaxchain 主网配置
  - **omnibus-snaxchain-testnet/** - Snaxchain 测试网配置
  - **pools/** - 池配置
  - **markets/** - 市场配置
  - **oracles/** - 预言机配置
  - **collaterals/** - 抵押品配置

- **e2e/** - 端到端测试

- **sandboxes/** - 沙箱环境配置

### 配置文件

- `omnibus-*.toml` - 各网络的主配置文件
- `core.toml` (20行) - 核心系统配置
- `settings.toml` (20行) - 全局设置
- `permissions.toml` (8行) - 权限设置
- `package.json` (86行) - 项目依赖和脚本

## 主要功能

1. **部署配置管理** - 管理不同网络的部署配置
2. **参数定义** - 定义系统参数和设置
3. **权限控制** - 配置系统权限和访问控制
4. **市场设置** - 配置交易市场参数
5. **跨链集成** - 配置跨链通信设置

## 部署网络

### 主网

- **以太坊主网** - 以太坊区块链主网
- **Arbitrum Mainnet** - Arbitrum L2 主网
- **Optimism Mainnet** - Optimism L2 主网
- **Base Mainnet** - Base L2 主网
- **Snaxchain Mainnet** - Snaxchain 主网

### 测试网

- **Sepolia** - 以太坊 Sepolia 测试网
- **Arbitrum Sepolia** - Arbitrum Sepolia 测试网
- **Base Sepolia** - Base Sepolia 测试网
- **Snaxchain Testnet** - Snaxchain 测试网

## 配置类型

### 系统配置

- 核心合约地址
- 系统参数
- 全局常量
- 系统角色

### 池配置

- 池参数
- 抵押率
- 费率设置
- 流动性限制

### 市场配置

- 市场参数
- 价格影响曲线
- 交易费率
- 风险参数

### 预言机配置

- 价格源配置
- 更新频率
- 门限值
- 失效设置

### 权限配置

- 访问控制
- 权限模型
- 管理员设置
- 授权策略

## 部署工具

项目提供多种部署和管理工具：

- 部署脚本
- 配置验证工具
- 参数更新工具
- 状态检查工具

## 与生态系统集成

- 为 synthetix-v3 提供部署配置
- 与 keepers 集成实现自动化操作
- 支持 TriplexContract 的部署需求
- 配合 snx-api 提供网络信息

## 使用指南

### 部署新网络

1. 创建新的网络配置文件
2. 设置适当的参数
3. 运行部署脚本
4. 验证部署结果

### 更新现有配置

1. 修改相应的配置文件
2. 验证变更的兼容性
3. 部署更新
4. 监控更新结果

## 配置开发流程

1. **开发环境** - 本地沙箱测试
2. **测试网部署** - 在测试网上验证配置
3. **审核** - 配置审核和参数验证
4. **主网部署** - 部署到生产环境

## 维护和监控

- 定期检查部署状态
- 监控链上参数
- 配置版本控制
- 部署历史记录

## 安全措施

- 多重签名要求
- 参数范围验证
- 部署前模拟测试
- 渐进式部署策略 