# Triplex Protocol 开发指南

本指南为开发者提供在 Triplex Protocol 生态系统中进行开发的全面指导，涵盖环境设置、核心概念、关键模块和最佳实践。

## 开发环境设置

### 基本要求

- **操作系统**: 兼容 Windows 10/11, macOS 10.15+, Linux (Ubuntu 20.04+ 推荐)
- **内存**: 至少 8GB RAM
- **存储**: 至少 50GB 可用空间
- **Git**: 版本控制
- **Node.js**: v18+
- **PNPM**: v8+

### Aptos 开发环境

1. **安装 Aptos CLI**

   ```bash
   # MacOS / Linux
   curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
   
   # 验证安装
   aptos --version
   ```

2. **设置 Aptos SDK**

   ```bash
   # 使用 pnpm
   pnpm add @aptos-labs/ts-sdk
   ```

3. **安装 Move CLI 工具**

   ```bash
   # 克隆 Move 仓库
   git clone https://github.com/move-language/move.git
   cd move
   
   # 安装 Move CLI
   cargo install --path language/tools/move-cli
   
   # 验证安装
   move --version
   ```

### Triplex 开发环境

1. **克隆核心仓库**

   ```bash
   git clone https://github.com/triplex-protocol/triplex.git
   cd triplex
   ```

2. **安装依赖**

   ```bash
   cd triplex
   # 安装 pnpm (如果尚未安装)
   npm install -g pnpm
   
   # 安装项目依赖
   pnpm install
   ```

3. **配置本地开发网络**

   ```bash
   # 启动本地 Aptos 节点
   aptos node run-local-testnet --with-faucet
   ```

## Move 语言核心概念

### 资源模型

Move 语言的核心特性是其资源模型，该模型确保资产的完整性和安全性：

- **资源不可复制**：所有资源只能转移，不能复制
- **资源不可隐式丢弃**：资源必须显式转移或销毁
- **强类型系统**：编译时检测类型错误

在 Triplex 协议中，所有金融资产都建模为资源：

```move
struct TPX has key, store {
    value: u64
}
```

### 账户模型

Aptos 使用基于账户的存储模型，与以太坊的全局存储模型不同：

- **账户中心存储**：资产直接存储在用户账户中
- **账户能力**：账户拥有特定能力和权限
- **模块发布**：代码以模块形式发布到特定账户

示例：账户存储访问
```move
public fun deposit(account: &signer, amount: u64) {
    let account_addr = Signer::address_of(account);
    let tpx = TPX { value: amount };
    move_to(account, tpx);
}
```

### 模块结构

Triplex 协议中的每个模块通常包括：

- **结构定义**：定义数据结构
- **能力声明**：声明资源能力
- **公共接口**：供其他模块调用的函数
- **内部函数**：模块内部使用的函数
- **事件**：记录重要状态变化

## Triplex 协议核心模块

### 1. 合成资产系统

合成资产系统是 Triplex 协议的核心，它跟踪外部资产价格并创建合成代币。主要文件：

- `triplex/sources/asset/assets.move`
- `triplex/sources/asset/tpx_*.move`

关键接口：

```move
// 铸造合成资产
public fun mint_synthetic(
    account: &signer,
    asset_type: AssetType,
    amount: u64,
    collateral: Collateral
): SyntheticAsset;

// 销毁合成资产
public fun burn_synthetic(
    synthetic: SyntheticAsset
): (AssetType, u64, Collateral);
```

### 2. 金库系统

金库系统管理用户抵押品和奖励分配。主要文件：

- `triplex/sources/vaults/vault.move`

关键接口：

```move
// 创建新金库
public fun create_vault(
    account: &signer,
    vault_type: u8
): VaultID;

// 存入资产
public fun deposit(
    account: &signer,
    vault_id: VaultID,
    asset: Asset
);

// 提取资产
public fun withdraw(
    account: &signer,
    vault_id: VaultID,
    amount: u64
): Asset;
```

### 3. 价格预言机

价格预言机集成 Pyth Network 提供链外资产价格。主要文件：

- `triplex/sources/oracle/price_oracle.move`

关键接口：

```move
// 获取最新价格
public fun get_price(
    asset_type: AssetType
): (u64, u64, u64); // 价格, 置信区间, 时间戳
```

### 4. 流动性池

420 流动性池模块提供去中心化交易功能。主要文件：

- `420/sources/pool/amm_pool.move`
- `420/sources/swap/swap_router.move`

关键接口：

```move
// 创建新的流动性池
public fun create_pool(
    account: &signer,
    token_x_type: AssetType,
    token_y_type: AssetType,
    fee_tier: u8
): PoolID;

// 执行交易
public fun swap(
    account: &signer,
    token_in_type: AssetType,
    token_in_amount: u64,
    token_out_type: AssetType,
    min_out_amount: u64
): u64;
```

## 开发最佳实践

### 代码风格

Triplex 协议遵循以下 Move 代码风格指南：

- **命名约定**：
  - 模块名称：小写下划线（如 `price_oracle`）
  - 类型名称：大写驼峰式（如 `SyntheticAsset`）
  - 函数名称：小写下划线（如 `create_vault`）
  - 常量：大写下划线（如 `MAX_FEE_RATE`）

- **注释**：所有公共函数和结构都应有详细文档注释

- **测试**：每个模块都应有对应的测试模块

### 安全最佳实践

1. **资源管理**
   - 严格跟踪所有资源的生命周期
   - 避免资源泄露或丢失

2. **权限控制**
   - 使用 `Signer` 进行身份验证
   - 实施精细的能力控制

3. **错误处理**
   - 使用明确的错误代码
   - 在错误发生前进行验证

4. **数值处理**
   - 防止数值溢出
   - 使用安全的数学库

### 性能考量

1. **存储优化**
   - 最小化存储访问
   - 合理使用 `struct` 和 `vector`

2. **Gas优化**
   - 避免不必要的循环
   - 尽量减少交易大小

## 测试和部署

### 单元测试

Triplex 协议使用 Move 的内置测试框架进行单元测试：

```move
#[test]
fun test_deposit_withdraw() {
    // 测试代码
}

#[test_only]
module triplex::vault_tests {
    // 测试模块
}
```

运行测试：

```bash
cd triplex
aptos move test
```

### 测试网部署

1. **测试网账户设置**

   ```bash
   aptos init --network testnet
   ```

2. **编译和部署合约**

   ```bash
   cd triplex
   aptos move compile
   aptos move publish --named-addresses triplex=<your-address>
   ```

3. **验证部署**

   ```bash
   aptos account list --query resources
   ```

### 主网部署流程

主网部署需要通过多重签名和治理过程，一般步骤为：

1. 创建部署提案
2. 社区审查
3. 多重签名审批
4. 执行部署

## 贡献指南

### 提交 PR

1. Fork 官方仓库
2. 创建功能分支
3. 编写代码并测试
4. 提交 PR，包含详细描述

### 代码审查标准

- 代码必须通过所有自动化测试
- 遵循代码风格指南
- 包含适当的文档
- 通过安全审查

### 文档贡献

为项目贡献文档：

1. 改进现有文档
2. 添加教程和示例
3. 更新 API 文档

## 常见问题解答

### 资源模型相关

**Q: 如何处理 Move 中的资源转移？**

A: 使用 `move_to`, `move_from` 和 `borrow_global_mut` 函数处理资源转移：

```move
public fun transfer(from: &signer, to: address, amount: u64) {
    let from_addr = Signer::address_of(from);
    let balance = borrow_global_mut<Balance>(from_addr);
    
    // 减少发送方余额
    balance.value = balance.value - amount;
    
    // 增加接收方余额
    if (exists<Balance>(to)) {
        let to_balance = borrow_global_mut<Balance>(to);
        to_balance.value = to_balance.value + amount;
    } else {
        move_to(&account::create_signer_for_test(to), Balance { value: amount });
    }
}
```

### 预言机集成

**Q: 如何获取和验证 Pyth 价格数据？**

A: 使用 `price_oracle` 模块的接口获取价格，并验证时间戳和置信度：

```move
let (price, conf, timestamp) = price_oracle::get_price(asset_type);
assert!(timestamp > now() - MAX_PRICE_DELAY, ERROR_PRICE_STALE);
assert!(conf < price * MAX_CONF_PERCENT / 100, ERROR_PRICE_UNCERTAIN);
```

### 系统升级

**Q: Triplex 协议如何处理升级？**

A: Aptos 允许直接模块升级，而不需要复杂的代理模式：

```bash
# 升级模块
aptos move publish --named-addresses triplex=<your-address> --upgrade-policy compatible
```

## 联系和支持

- **开发者社区**: [社区链接]
- **技术支持**: [支持邮箱]
- **错误报告**: 使用 GitHub Issues 报告问题
- **贡献**: 参见仓库中的 CONTRIBUTING.md

---

本指南将持续更新，以反映 Triplex Protocol 的最新开发实践和标准。如有建议或问题，请联系开发团队。 