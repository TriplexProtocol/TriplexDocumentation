# triplex 协议核心索引

triplex 是 Triplex Protocol 生态系统的核心协议合约，基于 Aptos 区块链使用 Move 语言开发，实现了 Synthetix 协议的核心功能，提供合成资产和衍生品交易基础设施。

## 项目结构

### 核心模块

- **sources/** - 主要源代码目录
  - **accounts/** - 用户账户相关模块
    - `account.move` (217行) - 用户账户管理，包含账户创建、身份验证和资产持有功能
  - **asset/** - 资产管理相关模块
    - `assets.move` (56行) - 资产基础功能，定义了资产标准接口和通用操作
    - `tpx.move` (42行) - TPX 协议原生代币，平台治理和抵押通证
    - `tpx_apt.move` (41行) - Aptos 原生代币包装，允许与 APT 交互
    - `tpx_btc.move` (40行) - Bitcoin 价格合成资产
    - `tpx_eth.move` (40行) - Ethereum 价格合成资产
    - `tpx_gold.move` (40行) - 黄金价格合成资产
    - `tpx_sol.move` (40行) - Solana 价格合成资产
    - `tpx_usd.move` (64行) - USD 稳定币实现，与美元挂钩
  - **oracle/** - 价格预言机集成
    - `price_oracle.move` (22行) - 价格数据获取接口，与 Pyth 预言机集成
  - **treasury/** - 协议金库管理
    - `treasury_pool.move` (237行) - 资金池管理，处理协议资产存储和分配
  - **utils/** - 工具函数
    - `uitil.move` (7行) - 通用工具函数，提供辅助功能
  - **vaults/** - 金库合约
    - `vault.move` (687行) - 金库核心逻辑，实现资产锁定、收益分配和风险管理

### 部署脚本

- `deploy_testnet_mac.sh` (35行) - MacOS 测试网部署脚本
- `deploy_testnet_linux.sh` (54行) - Linux 测试网部署脚本
- `deploy_testnet_windows.ps1` (85行) - Windows 测试网部署脚本

### 配置文件

- `Move.toml` (25行) - 项目依赖和配置，定义了项目的依赖关系和地址映射

## 协议核心功能

1. **合成资产系统** - 提供多种合成资产的创建、铸造、销毁和转账功能
2. **用户账户管理** - 处理用户身份和资产持有
3. **金库机制** - 提供资产锁定和收益分配系统
4. **价格预言机集成** - 通过 Pyth 获取实时价格数据
5. **资金池管理** - 协议流动性和资金分配

## 技术优势

Triplex 协议利用 Aptos 区块链和 Move 语言的特性，提供了以下技术优势：

1. **资源模型安全性** - Move 资源不可复制或随意创建，确保资产完整性
2. **静态类型和验证** - 减少运行时错误和漏洞
3. **账户中心存储** - 资产直接存储在用户账户中而非合约中
4. **直接模块升级** - 无需复杂代理模式即可升级协议
5. **并行交易处理** - 更灵活的存储设计支持更好的并行性

## 依赖项

- AptosFramework - Aptos区块链的基础框架
- AptosStdlib - Aptos标准库
- AptosToken - Aptos代币标准
- Pyth - 价格预言机，用于获取链下资产价格

## 地址配置

- triplex - 协议核心地址
- pyth - Pyth预言机地址
- deployer - 部署者地址
- wormhole - Wormhole跨链地址

## 协议开发和部署流程

1. 本地开发和测试
2. 使用部署脚本部署到测试网
3. 验证功能正常
4. 部署到主网

## 核心模块交互

triplex 协议的核心功能通过以下模块间的交互实现：

1. 用户通过 `account.move` 创建账户并管理资产
2. 资产通过 `assets.move` 和各个具体资产实现进行管理
3. 价格数据通过 `price_oracle.move` 从 Pyth 获取
4. 用户可以将资产存入 `vault.move` 定义的金库获取收益
5. 系统流动性由 `treasury_pool.move` 管理
6. 各类合成资产（如`tpx_btc.move`、`tpx_usd.move`等）追踪对应的外部资产价格

## 与以太坊版本对比

相比以太坊上的 Synthetix 实现，triplex 协议利用 Aptos 和 Move 的特性有以下改进：

1. **资源型资产** - 使用 Move 的资源模型替代 ERC-20 映射存储
2. **账户存储** - 资产直接存储在用户账户中而非合约存储
3. **原生安全** - 防止重入等常见攻击
4. **存储灵活性** - 更灵活的数据存储方式
5. **直接升级** - 简化的模块升级机制 