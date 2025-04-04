# 抵押品模块 (CollateralModule)

## 模块概述

抵押品模块负责管理用户抵押品的存取、锁定和价值计算。它允许用户向系统存入和提取各种类型的抵押品，并提供抵押品锁定机制以支持系统的各种功能。

## 主要功能

1. **抵押品存取**
   - 存入抵押品到账户
   - 从账户提取抵押品
   - 查询账户抵押品余额

2. **抵押品锁定**
   - 创建抵押品锁定
   - 清理过期锁定
   - 查询锁定状态

3. **抵押品价值计算**
   - 获取抵押品当前价值
   - 计算可用抵押品数量

## 接口定义

```solidity
interface ICollateralModule {
    // 抵押品存取函数
    function deposit(uint128 accountId, address collateralType, uint256 tokenAmount) external;
    function withdraw(uint128 accountId, address collateralType, uint256 tokenAmount) external;
    
    // 抵押品查询函数
    function getAccountCollateral(uint128 accountId, address collateralType) 
        external view returns (uint256 totalDeposited, uint256 totalAssigned, uint256 totalLocked);
    function getAccountAvailableCollateral(uint128 accountId, address collateralType) 
        external view returns (uint256 amountD18);
    
    // 抵押品锁定函数
    function createLock(uint128 accountId, address collateralType, uint256 amount, uint64 expireTimestamp) external;
    function cleanExpiredLocks(uint128 accountId, address collateralType, uint256 offset, uint256 count) 
        external returns (uint256 cleared, uint256 remainingLockAmountD18);
    function getLocks(uint128 accountId, address collateralType, uint256 offset, uint256 count) 
        external view returns (CollateralLock.Data[] memory locks);
}
```

## 数据结构

```solidity
// 抵押品数据结构
struct Collateral {
    address collateralType;
    uint256 totalDeposited;
    uint256 totalAssigned;
    mapping(uint128 => uint256) assigned; // poolId => amount
    CollateralLock.Data[] locks;
}

// 锁定数据结构
struct CollateralLock {
    uint256 amount;
    uint64 expireTimestamp;
}
```

## 事件

```solidity
// 抵押品存取事件
event Deposited(
    uint128 indexed accountId,
    address indexed collateralType,
    uint256 tokenAmount,
    address indexed sender
);

event Withdrawn(
    uint128 indexed accountId,
    address indexed collateralType,
    uint256 tokenAmount,
    address indexed sender
);

// 抵押品锁定事件
event CollateralLockCreated(
    uint128 indexed accountId,
    address indexed collateralType,
    uint256 tokenAmount,
    uint64 expireTimestamp
);

event CollateralLockExpired(
    uint256 tokenAmount, 
    uint64 expireTimestamp
);
```

## Move语言实现考虑

### 资源定义

```move
struct Collateral has key {
    collateral_type: String,
    total_deposited: u256,
    total_assigned: u256,
    assigned: Table<u128, u256>, // poolId => amount
    locks: vector<CollateralLock>,
}

struct CollateralLock has store, drop {
    amount: u256,
    expire_timestamp: u64,
}

struct CollateralStore has key {
    collaterals: Table<address, Table<String, Collateral>>,
}
```

### 主要函数

```move
public fun deposit_collateral(
    account_id: u128, 
    collateral_type: String, 
    amount: u256,
    account_cap: &AccountCapability
);

public fun withdraw_collateral(
    account_id: u128, 
    collateral_type: String, 
    amount: u256,
    account_cap: &AccountCapability
);

public fun get_account_collateral(
    account_id: u128, 
    collateral_type: String
): (u256, u256, u256); // (totalDeposited, totalAssigned, totalLocked)

public fun create_lock(
    account_id: u128, 
    collateral_type: String, 
    amount: u256, 
    expire_timestamp: u64,
    admin_cap: &AdminCapability
);
```

### 锁定清理机制

在Move中，可以实现一个清理功能来移除过期的锁定：

```move
public fun clean_expired_locks(
    account_id: u128,
    collateral_type: String,
    offset: u64,
    count: u64
): (u64, u256) // (cleared, remainingLockAmount)
```

### 事件实现

```move
struct DepositedEvent has drop, store {
    account_id: u128,
    collateral_type: String,
    amount: u256,
    sender: address,
}

struct WithdrawnEvent has drop, store {
    account_id: u128,
    collateral_type: String,
    amount: u256,
    sender: address,
}

struct CollateralLockCreatedEvent has drop, store {
    account_id: u128,
    collateral_type: String,
    amount: u256,
    expire_timestamp: u64,
}