# 清算模块 (LiquidationModule)

## 模块概述

清算模块负责处理不足额抵押的头寸和金库，确保系统的偿付能力和稳定性。它允许清算者通过清算不健康的头寸来获得奖励，同时保护系统免受抵押不足的风险。

## 主要功能

1. **头寸清算**
   - 清算单个账户头寸
   - 分配头寸债务和抵押品
   - 向清算者提供奖励

2. **金库清算**
   - 清算整个金库
   - 处理多个头寸清算
   - 维持系统偿付能力

3. **清算检查**
   - 检查头寸可清算性
   - 验证金库可清算性
   - 监控清算阈值

## 接口定义

```solidity
interface ILiquidationModule {
    // 清算函数
    function liquidate(uint128 accountId, uint128 poolId, address collateralType, uint128 liquidateAsAccountId) external returns (LiquidationData memory liquidationData);
    function liquidateVault(uint128 poolId, address collateralType, uint128 liquidateAsAccountId, uint256 maxUsd) external returns (LiquidationData memory liquidationData);
    
    // 清算检查函数
    function isPositionLiquidatable(uint128 accountId, uint128 poolId, address collateralType) external returns (bool canLiquidate);
    function isVaultLiquidatable(uint128 poolId, address collateralType) external returns (bool canVaultLiquidate);
    
    // 清算数据结构
    struct LiquidationData {
        uint256 debtLiquidated;
        uint256 collateralLiquidated;
        uint256 amountRewarded;
    }
}
```

## 数据结构

```solidity
// 清算数据结构
struct LiquidationData {
    uint256 debtLiquidated;
    uint256 collateralLiquidated;
    uint256 amountRewarded;
}
```

## 事件

```solidity
// 清算事件
event Liquidation(
    uint128 indexed accountId,
    uint128 indexed poolId,
    address indexed collateralType,
    LiquidationData liquidationData,
    uint128 liquidateAsAccountId,
    address sender
);

event VaultLiquidation(
    uint128 indexed poolId,
    address indexed collateralType,
    LiquidationData liquidationData,
    uint128 liquidateAsAccountId,
    address sender
);
```

## Move语言实现考虑

### 资源定义

```move
struct LiquidationData has copy, drop, store {
    debt_liquidated: u256,
    collateral_liquidated: u256,
    amount_rewarded: u256,
}
```

### 主要函数

```move
public fun liquidate(
    account_id: u128,
    pool_id: u128,
    collateral_type: String,
    liquidate_as_account_id: u128
): LiquidationData;

public fun liquidate_vault(
    pool_id: u128,
    collateral_type: String,
    liquidate_as_account_id: u128,
    max_usd: u256
): LiquidationData;

public fun is_position_liquidatable(
    account_id: u128,
    pool_id: u128,
    collateral_type: String
): bool;

public fun is_vault_liquidatable(
    pool_id: u128,
    collateral_type: String
): bool;
```

### 清算逻辑

在Move中，需要实现复杂的清算逻辑：

```move
// 头寸清算逻辑
fun perform_position_liquidation(
    account_id: u128,
    pool_id: u128,
    collateral_type: String,
    liquidate_as_account_id: u128
): LiquidationData {
    // 验证头寸可清算性
    assert!(is_position_liquidatable(account_id, pool_id, collateral_type), ERROR_NOT_LIQUIDATABLE);
    
    // 获取头寸信息
    let position = get_position(account_id, pool_id, collateral_type);
    
    // 计算清算债务和抵押品
    let (debt_to_liquidate, collateral_to_liquidate, reward) = calculate_liquidation_amounts(
        position.debt,
        position.collateral_amount,
        get_collateral_price(collateral_type)
    );
    
    // 执行清算
    transfer_liquidated_assets(
        account_id,
        liquidate_as_account_id,
        pool_id,
        collateral_type,
        debt_to_liquidate,
        collateral_to_liquidate,
        reward
    );
    
    // 更新头寸状态
    update_position_after_liquidation(
        account_id,
        pool_id,
        collateral_type,
        debt_to_liquidate,
        collateral_to_liquidate
    );
    
    // 返回清算数据
    LiquidationData {
        debt_liquidated: debt_to_liquidate,
        collateral_liquidated: collateral_to_liquidate,
        amount_rewarded: reward,
    }
}
```

### 事件实现

```move
struct LiquidationEvent has drop, store {
    account_id: u128,
    pool_id: u128,
    collateral_type: String,
    debt_liquidated: u256,
    collateral_liquidated: u256,
    amount_rewarded: u256,
    liquidate_as_account_id: u128,
    sender: address,
}

struct VaultLiquidationEvent has drop, store {
    pool_id: u128,
    collateral_type: String,
    debt_liquidated: u256,
    collateral_liquidated: u256,
    amount_rewarded: u256,
    liquidate_as_account_id: u128,
    sender: address,
}

public fun emit_liquidation_event(
    account_id: u128,
    pool_id: u128,
    collateral_type: String,
    liquidation_data: &LiquidationData,
    liquidate_as_account_id: u128,
    sender: address
) {
    event::emit(LiquidationEvent {
        account_id,
        pool_id,
        collateral_type,
        debt_liquidated: liquidation_data.debt_liquidated,
        collateral_liquidated: liquidation_data.collateral_liquidated,
        amount_rewarded: liquidation_data.amount_rewarded,
        liquidate_as_account_id,
        sender,
    });
}
```

### 清算参数计算

```move
fun calculate_liquidation_amounts(
    debt: I256,
    collateral_amount: u256,
    collateral_price: u256
): (u256, u256, u256) {
    // 计算清算债务、抵押品和奖励金额
    let debt_to_liquidate = abs(debt);
    
    // 获取清算比例和奖励比例
    let config = get_liquidation_config(collateral_type);
    let liquidation_ratio = config.liquidation_ratio;
    let reward_ratio = config.liquidation_reward;
    
    // 计算要清算的抵押品数量
    let collateral_value = decimal_mul(collateral_amount, collateral_price);
    let collateral_to_liquidate = decimal_div(debt_to_liquidate, collateral_price);
    
    // 计算奖励
    let reward = decimal_mul(collateral_to_liquidate, reward_ratio);
    
    (debt_to_liquidate, collateral_to_liquidate, reward)
}
``` 