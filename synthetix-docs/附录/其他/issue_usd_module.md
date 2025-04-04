# USD发行模块 (IssueUSDModule)

## 模块概述

USD发行模块负责管理合成美元(snxUSD)的铸造和销毁过程。它允许用户通过质押抵押品来铸造合成USD，同时维护用户头寸、债务比率和系统稳定性。这是Synthetix协议的核心组件，使得合成资产的创建成为可能。

## 主要功能

1. **合成USD铸造**
   - 铸造合成USD
   - 计算最大可铸造额度
   - 管理铸造限额

2. **合成USD销毁**
   - 销毁合成USD
   - 减少用户债务
   - 释放抵押品

3. **头寸管理**
   - 查询用户头寸
   - 计算头寸健康度
   - 监控抵押比率

## 接口定义

```solidity
interface IIssueUSDModule {
    // USD铸造和销毁函数
    function mintUsd(uint128 accountId, uint128 poolId, address collateralType, uint256 amount) external;
    function burnUsd(uint128 accountId, uint128 poolId, address collateralType, uint256 amount) external;
    
    // 头寸查询函数
    function getPosition(uint128 accountId, uint128 poolId, address collateralType) external view returns (Position.Data memory position);
    function getPositionDebt(uint128 accountId, uint128 poolId, address collateralType) external returns (int256 debtD18);
    function getPositionCollateral(uint128 accountId, uint128 poolId, address collateralType) external view returns (uint256 collateralD18);
    function getPositionHealthRatio(uint128 accountId, uint128 poolId, address collateralType) external returns (uint256 healthRatioD18);
    
    // 最大铸造额度
    function getMaximumIssueUsd(uint128 accountId, uint128 poolId, address collateralType) external view returns (uint256 maxIssueableD18);
    
    // 抵押品和债务比率
    function getCollaterizationRatio(uint128 accountId, uint128 poolId, address collateralType) external returns (uint256 cRatioD18);
}
```

## 数据结构

```solidity
// 头寸数据结构
struct Position {
    uint128 accountId;
    uint128 poolId;
    address collateralType;
    uint256 collateralAmount;
    int256 debt;
}
```

## 事件

```solidity
// 铸造和销毁事件
event IssuedUsd(
    uint128 indexed accountId,
    uint128 indexed poolId,
    address indexed collateralType,
    uint256 amount,
    uint256 collateralAmount,
    int256 debt
);

event BurnedUsd(
    uint128 indexed accountId,
    uint128 indexed poolId,
    address indexed collateralType,
    uint256 amount,
    uint256 collateralAmount,
    int256 debt
);

// 头寸操作事件
event CollateralDelegated(
    uint128 indexed accountId,
    uint128 indexed poolId,
    address indexed collateralType,
    uint256 amount
);

event CollateralUndelegated(
    uint128 indexed accountId,
    uint128 indexed poolId,
    address indexed collateralType,
    uint256 amount
);
```

## Move语言实现考虑

### 资源定义

```move
struct Position has key {
    account_id: u128,
    pool_id: u128,
    collateral_type: String,
    collateral_amount: u256,
    debt: I256, // 使用有符号整数
}

struct PositionStore has key {
    positions: Table<(u128, u128, String), Position>, // (accountId, poolId, collateralType) => Position
}
```

### 主要函数

```move
public fun mint_usd(
    account_id: u128,
    pool_id: u128,
    collateral_type: String,
    amount: u256,
    account_cap: &AccountCapability
);

public fun burn_usd(
    account_id: u128,
    pool_id: u128,
    collateral_type: String,
    amount: u256,
    account_cap: &AccountCapability
);

public fun get_position(
    account_id: u128,
    pool_id: u128,
    collateral_type: String
): Position;

public fun get_position_debt(
    account_id: u128,
    pool_id: u128,
    collateral_type: String
): I256; // 使用有符号整数

public fun get_position_health_ratio(
    account_id: u128,
    pool_id: u128,
    collateral_type: String
): u256;

public fun get_maximum_issue_usd(
    account_id: u128,
    pool_id: u128,
    collateral_type: String
): u256;
```

### 计算系统

在Move中，需要实现复杂的计算逻辑来处理铸造限额和健康度：

```move
// 计算最大铸造额度
fun calculate_max_issue_usd(
    collateral_value: u256,
    issuance_ratio: u256,
    existing_debt: I256
): u256 {
    // 实现铸造限额计算逻辑
    let max_total_debt = decimal_mul(collateral_value, issuance_ratio);
    let existing_debt_abs = abs(existing_debt);
    
    if (existing_debt_abs >= max_total_debt) {
        return 0
    } else {
        return max_total_debt - existing_debt_abs
    }
}

// 计算头寸健康度
fun calculate_health_ratio(
    collateral_value: u256,
    debt: I256,
    issuance_ratio: u256
): u256 {
    // 实现健康度计算逻辑
    if (is_zero(debt)) {
        return MAX_U256 // 表示无限大
    } else {
        let debt_abs = abs(debt);
        let max_allowed_debt = decimal_mul(collateral_value, issuance_ratio);
        return decimal_div(max_allowed_debt, debt_abs)
    }
}
```

### 事件实现

```move
struct IssuedUsdEvent has drop, store {
    account_id: u128,
    pool_id: u128,
    collateral_type: String,
    amount: u256,
    collateral_amount: u256,
    debt: I256,
}

struct BurnedUsdEvent has drop, store {
    account_id: u128,
    pool_id: u128,
    collateral_type: String,
    amount: u256,
    collateral_amount: u256,
    debt: I256,
}

struct CollateralDelegatedEvent has drop, store {
    account_id: u128,
    pool_id: u128,
    collateral_type: String,
    amount: u256,
}
``` 