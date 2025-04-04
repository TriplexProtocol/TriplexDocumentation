# 流动性池模块 (PoolModule)

## 模块概述

流动性池模块管理系统中的流动性池，处理池的创建、配置和管理。流动性池聚合多个用户的抵押品，并将其分配给不同的市场，从而实现风险分散和流动性共享。

## 主要功能

1. **池创建和所有权**
   - 创建新池
   - 管理池所有权
   - 设置池名称

2. **池配置**
   - 设置池的市场分配
   - 配置池的抵押品参数
   - 查询池配置

3. **池债务管理**
   - 获取池总债务
   - 计算池的债务分配
   - 监控池健康状态

## 接口定义

```solidity
interface IPoolModule {
    // 池创建和管理函数
    function createPool(uint128 requestedPoolId, address owner) external;
    function setPoolName(uint128 poolId, string memory name) external;
    
    // 池所有权管理
    function nominatePoolOwner(address nominatedOwner, uint128 poolId) external;
    function acceptPoolOwnership(uint128 poolId) external;
    function renouncePoolOwnership(uint128 poolId) external;
    function getPoolOwner(uint128 poolId) external view returns (address owner);
    
    // 池配置函数
    function setPoolConfiguration(uint128 poolId, MarketConfiguration.Data[] memory marketDistribution) external;
    function getPoolConfiguration(uint128 poolId) external view returns (MarketConfiguration.Data[] memory markets);
    function setPoolCollateralConfiguration(uint128 poolId, address collateralType, PoolCollateralConfiguration.Data memory newConfig) external;
    function getPoolCollateralConfiguration(uint128 poolId, address collateralType) external view returns (PoolCollateralConfiguration.Data memory config);
    
    // 池债务函数
    function getPoolTotalDebt(uint128 poolId) external returns (int256 totalDebtD18);
    function getPoolDebtPerShare(uint128 poolId) external returns (int256 debtPerShareD18);
    
    // 池流动性比率函数
    function setMinLiquidityRatio(uint256 minLiquidityRatio) external;
    function getPoolCollateralIssuanceRatio(uint128 poolId, address collateral) external view returns (uint256 issuanceRatioD18);
}
```

## 数据结构

```solidity
// 池数据结构
struct Pool {
    uint128 id;
    string name;
    address owner;
    address nominatedOwner;
    uint256 totalWeights;
    mapping(uint128 => MarketConfiguration.Data) markets;
    SetUtil.UintSet marketSet;
}

// 市场配置数据结构
struct MarketConfiguration {
    uint128 marketId;
    uint256 weight;
    uint256 maxDebtShareValue;
}

// 池抵押品配置数据结构
struct PoolCollateralConfiguration {
    bool disabled;
    uint256 collateralLimitD18;
    uint256 issuanceRatioD18;
}
```

## 事件

```solidity
// 池创建和管理事件
event PoolCreated(uint128 indexed poolId, address indexed owner, address indexed sender);
event PoolNameUpdated(uint128 indexed poolId, string name, address indexed sender);

// 池所有权事件
event PoolOwnerNominated(uint128 indexed poolId, address indexed nominatedOwner, address indexed owner);
event PoolOwnershipAccepted(uint128 indexed poolId, address indexed owner);
event PoolOwnershipRenounced(uint128 indexed poolId, address indexed owner);

// 池配置事件
event PoolConfigurationSet(uint128 indexed poolId, MarketConfiguration.Data[] markets, address indexed sender);
event PoolCollateralConfigurationUpdated(uint128 indexed poolId, address collateralType, PoolCollateralConfiguration.Data config);
```

## Move语言实现考虑

### 资源定义

```move
struct Pool has key {
    id: u128,
    name: String,
    owner: address,
    nominated_owner: Option<address>,
    total_weights: u256,
    markets: Table<u128, MarketConfiguration>,
}

struct MarketConfiguration has store, drop {
    market_id: u128,
    weight: u256,
    max_debt_share_value: u256,
}

struct PoolCollateralConfiguration has store, drop {
    disabled: bool,
    collateral_limit: u256,
    issuance_ratio: u256,
}

struct PoolOwnerCapability has key, store {
    pool_id: u128,
}
```

### 主要函数

```move
public fun create_pool(
    requested_pool_id: u128,
    owner: address,
    ctx: &mut TxContext
): (PoolId, PoolOwnerCapability);

public fun set_pool_name(
    pool_id: u128,
    name: String,
    cap: &PoolOwnerCapability
);

public fun set_pool_configuration(
    pool_id: u128,
    market_distribution: vector<MarketConfiguration>,
    cap: &PoolOwnerCapability
);

public fun get_pool_configuration(
    pool_id: u128
): vector<MarketConfiguration>;

public fun get_pool_total_debt(
    pool_id: u128
): I256; // 有符号整数表示债务
```

### 所有权管理

在Move中，可以通过能力对象实现池所有权的安全转移：

```move
public fun nominate_pool_owner(
    new_owner: address,
    pool_id: u128,
    cap: &PoolOwnerCapability
);

public fun accept_pool_ownership(
    pool_id: u128,
    ctx: &mut TxContext
): PoolOwnerCapability;
```

### 事件实现

```move
struct PoolCreatedEvent has drop, store {
    pool_id: u128,
    owner: address,
    sender: address,
}

struct PoolConfigurationSetEvent has drop, store {
    pool_id: u128,
    markets: vector<MarketConfiguration>,
    sender: address,
}

struct PoolCollateralConfigurationUpdatedEvent has drop, store {
    pool_id: u128,
    collateral_type: String,
    disabled: bool,
    collateral_limit: u256,
    issuance_ratio: u256,
}
``` 