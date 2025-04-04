# pyth-examples 项目索引

pyth-examples 是 TriplexPro 生态系统中的预言机示例项目，提供了如何在不同区块链平台上集成和使用 Pyth 预言机的示例代码。

## 项目结构

### 核心目录

- **price_feeds/** - 价格数据源示例
  - **aptos/** - Aptos 区块链集成示例
  - **evm/** - 以太坊虚拟机集成示例
  - **fuel/** - Fuel 区块链集成示例
  - **solana/** - Solana 区块链集成示例
  - **starknet/** - StarkNet 集成示例
  - **ton/** - TON 区块链集成示例

- **entropy/** - 熵源和随机数生成示例

- **lazer/** - Lazer 协议集成示例

### 配置文件

- `.gitmodules` (13行) - Git 子模块配置
- `package-lock.json` (7行) - NPM 包依赖锁定文件

## 主要功能

1. **价格数据获取** - 演示如何获取和使用实时价格数据
2. **跨链集成** - 在多个区块链平台上使用 Pyth 
3. **预言机验证** - 验证预言机数据的完整性和来源
4. **数据解析** - 解析和处理预言机提供的数据
5. **错误处理** - 处理预言机数据异常情况

## 技术栈

- 多种区块链平台 SDK
- JavaScript/TypeScript
- Solidity (EVM)
- Move (Aptos)
- Rust (Solana)

## 主要示例

### Aptos 集成

示例展示如何在 Aptos 智能合约中:
- 读取 Pyth 价格数据
- 验证价格更新
- 处理价格数据更新触发的合约逻辑

### EVM 集成

以太坊和兼容 EVM 的区块链集成示例:
- 接收链下价格数据
- 验证价格数据的签名
- 在合约中使用价格数据进行计算

### Solana 集成

Solana 区块链上的示例:
- 直接从 Solana 链上的 Pyth 程序读取价格
- 处理账户数据结构
- 订阅价格更新事件

## 使用指南

### 获取项目

```bash
git clone --recurse-submodules https://github.com/pyth-network/pyth-examples.git
cd pyth-examples
```

### 运行示例

每个子目录包含特定平台的示例，带有自己的说明:

```bash
cd price_feeds/evm
npm install
npm run test
```

## 在 TriplexPro 中的应用

1. **triplex 项目** - 在 Aptos 平台上使用 Pyth 价格数据
2. **TriplexContract** - 在以太坊上集成 Pyth 价格源
3. **synthetix-v3** - 使用 Pyth 作为合成资产价格源
4. **keepers** - 自动更新系统中的价格数据

## 支持的资产

Pyth 预言机支持多种资产类型的价格数据:

- 加密货币 (BTC, ETH, SOL 等)
- 法定货币 (USD, EUR, JPY 等)
- 商品 (黄金, 白银, 原油等)
- 股票和指数
- 外汇汇率

## 数据来源

价格数据来自多个高质量的交易所和做市商，包括:

- Binance
- Coinbase
- FTX
- Jump Trading
- Cumberland
- 其他主要市场参与者

## 数据更新频率

- 链上数据更新频率: 约每 1-2 秒
- 一级价格数据更新: 亚秒级 