# 市场管理模块 (MarketManagerModule)

## 模块概述

市场管理模块负责系统与外部市场之间的交互。它允许外部市场注册到系统中，并提供市场存取USD的功能。市场可以通过此模块发行和回收合成资产，同时系统跟踪市场的信用状态和债务情况。

## 主要功能

1. **市场注册**
   - 注册外部市场
   - 获取市场信息
   - 查询市场地址

2. **市场USD操作**
   - 市场存入USD
   - 市场提取USD
   - 获取可提取USD额度

3. **市场债务管理**
   - 获取市场净发行量
   - 获取市场报告债务
   - 分配债务到流动性池

## 接口定义

```solidity
interface IMarketManagerModule {
    // 市场注册函数
    function registerMarket(address market) external returns (uint128 newMarketId);
    
    // 市场USD操作函数
    function depositMarketUsd(uint128 marketId, address target, uint256 amount) external returns (uint256 feeAmount);
    function withdrawMarketUsd(uint128 marketId, address target, uint256 amount) external returns (uint256 feeAmount);
    function getWithdrawableMarketUsd(uint128 marketId) external view returns (uint256 withdrawableD18);
    function getMarketFees(uint128 marketId, uint256 amount) external view returns (uint256 depositFeeAmount, uint256 withdrawFeeAmount);
    
    // 市场查询函数
    function getMarketAddress(uint128 marketId) external view returns (address marketAddress);
    function getMarketNetIssuance(uint128 marketId) external view returns (int128 issuanceD18);
    function getMarketReportedDebt(uint128 marketId) external view returns (uint256 reportedDebtD18);
    function getMarketTotalDebt(uint128 marketId) external view returns (int256 totalDebtD18);
    function getMarketDebtPerShare(uint128 marketId) external returns (int256 debtPerShareD18);
    function getMarketCollateral(uint128 marketId) external view returns (uint256 valueD18);
    
    // 市场债务分配函数
    function distributeDebtToPools(uint128 marketId, uint256 maxIter) external returns (bool finishedDistributing);
    
    // 市场配置函数
    function setMarketMinDelegateTime(uint128 marketId, uint32 minDelegateTime) external;
    function getMarketMinDelegateTime(uint128 marketId) external view returns (uint32);
    function setMinLiquidityRatio(uint128 marketId, uint256 minLiquidityRatio) external;
    function getMinLiquidityRatio(uint128 marketId) external view returns (uint256 minRatioD18);
}
```

## 数据结构

```solidity
// 市场数据结构
struct Market {
    uint128 id;
    address marketAddress;
    int128 netIssuance;
    uint256 reportedDebt;
    int256 totalDebtPerShare;
    uint256 lastDebtDistribution;
    uint32 minDelegateTime;
    uint32 lastConfigurationTime;
    uint256 liquidityRatio;
}
```

## 事件

```solidity
// 市场注册事件
event MarketRegistered(address indexed market, uint128 indexed marketId, address indexed sender);

// 市场USD操作事件
event MarketUsdDeposited(
    uint128 indexed marketId,
    address indexed target,
    uint256 amount,
    address indexed market,
    int128 creditCapacity,
    int128 netIssuance,
    uint256 depositedCollateralValue
);

event MarketUsdWithdrawn(
    uint128 indexed marketId,
    address indexed target,
    uint256 amount,
    address indexed market,
    int128 creditCapacity,
    int128 netIssuance,
    uint256 depositedCollateralValue
);

// 市场配置事件
event SetMinDelegateTime(uint128 indexed marketId, uint32 minDelegateTime);
event SetMarketMinLiquidityRatio(uint128 indexed marketId, uint256 minLiquidityRatio);
```

## Move语言实现考虑

### 资源定义

```move
struct Market has key {
    id: u128,
    market_address: address,
    net_issuance: I128, // 使用有符号整数
    reported_debt: u256,
    total_debt_per_share: I256, // 使用有符号整数
    last_debt_distribution: u256,
    min_delegate_time: u32,
    last_configuration_time: u32,
    liquidity_ratio: u256,
}

struct MarketStore has key {
    markets: Table<u128, Market>,
    market_addresses: Table<address, u128>,
    next_market_id: u128,
}
```

### 主要函数

```move
public fun register_market(
    market: address,
    ctx: &mut TxContext
): u128; // 返回新市场ID

public fun deposit_market_usd(
    market_id: u128,
    target: address,
    amount: u256
): u256; // 返回费用金额

public fun withdraw_market_usd(
    market_id: u128,
    target: address,
    amount: u256
): u256; // 返回费用金额

public fun get_withdrawable_market_usd(
    market_id: u128
): u256;

public fun get_market_net_issuance(
    market_id: u128
): I128; // 使用有符号整数

public fun get_market_reported_debt(
    market_id: u128
): u256;

public fun distribute_debt_to_pools(
    market_id: u128,
    max_iter: u256
): bool; // 返回是否完成分配
```

### 市场交互控制

在Move中，需要实现适当的验证逻辑来确保只有合法市场才能执行特定操作：

```move
// 验证市场调用者
fun validate_market_caller(market_id: u128) {
    let caller = tx_context::sender(ctx);
    let market_address = get_market_address(market_id);
    assert!(caller == market_address, ERROR_UNAUTHORIZED_MARKET);
}
```

### 事件实现

```move
struct MarketRegisteredEvent has drop, store {
    market: address,
    market_id: u128,
    sender: address,
}

struct MarketUsdDepositedEvent has drop, store {
    market_id: u128,
    target: address,
    amount: u256,
    market: address,
    credit_capacity: I128,
    net_issuance: I128,
    deposited_collateral_value: u256,
}

struct MarketUsdWithdrawnEvent has drop, store {
    market_id: u128,
    target: address,
    amount: u256,
    market: address,
    credit_capacity: I128,
    net_issuance: I128,
    deposited_collateral_value: u256,
}
``` 