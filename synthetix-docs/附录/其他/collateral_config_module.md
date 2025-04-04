# 抵押品配置模块 (CollateralConfigurationModule)

## 模块概述

抵押品配置模块负责管理系统中可接受的抵押品类型及其参数。它允许系统管理者配置各种抵押品的接受条件、清算参数和价格数据源，并提供对这些配置的查询功能。

## 主要功能

1. **抵押品类型配置**
   - 添加新的抵押品类型
   - 配置抵押品参数
   - 查询抵押品配置

2. **抵押品价格管理**
   - 设置抵押品价格数据源
   - 获取抵押品当前价格
   - 计算抵押品价值

3. **抵押品清算参数**
   - 配置最小抵押率
   - 设置清算阈值
   - 配置清算惩罚

## 接口定义

```solidity
interface ICollateralConfigurationModule {
    // 抵押品配置函数
    function configureCollateral(CollateralConfiguration.Data memory collateralConfiguration) external;
    
    // 抵押品查询函数
    function getCollateralConfiguration(address collateralType) external view returns (CollateralConfiguration.Data memory config);
    function getCollateralConfigurations() external view returns (CollateralConfiguration.Data[] memory collateralConfigurations);
    function isCollateralConfigured(address collateralType) external view returns (bool);
    
    // 抵押品价格函数
    function getCollateralPrice(address collateralType) external view returns (uint256 priceD18);
    function getCollateralValue(address collateralType, uint256 amount) external view returns (uint256 valueD18);
    
    // 抵押品参数查询
    function getCollateralMinDelegation(address collateralType) external view returns (uint256 amountD18);
    function getCollateralLiquidationRatio(address collateralType) external view returns (uint256 ratioD18);
    function getCollateralIssuanceRatio(address collateralType) external view returns (uint256 ratioD18);
}
```

## 数据结构

```solidity
// 抵押品配置数据结构
struct CollateralConfiguration {
    // 抵押品基本信息
    address tokenAddress;
    bytes32 oracleNodeId;
    uint256 issuanceRatioD18;
    uint256 liquidationRatioD18;
    uint256 liquidationRewardD18;
    
    // 最小和最大值限制
    uint256 minDelegationD18;
    uint256 depositingEnabled;
    
    // Token信息
    uint8 tokenDecimals;
}
```

## 事件

```solidity
// 抵押品配置事件
event CollateralConfigured(
    address indexed collateralType,
    bytes32 oracleNodeId,
    uint256 issuanceRatioD18,
    uint256 liquidationRatioD18,
    uint256 liquidationRewardD18,
    uint256 minDelegationD18,
    bool depositingEnabled,
    address indexed sender
);
```

## Move语言实现考虑

### 资源定义

```move
struct CollateralConfig has key, store {
    token_address: address,
    oracle_node_id: vector<u8>, // bytes32
    issuance_ratio: u256,
    liquidation_ratio: u256,
    liquidation_reward: u256,
    min_delegation: u256,
    depositing_enabled: bool,
    token_decimals: u8,
}

struct CollateralConfigStore has key {
    configs: Table<String, CollateralConfig>,
}
```

### 主要函数

```move
public fun configure_collateral(
    collateral_type: String,
    config: CollateralConfig,
    admin_cap: &AdminCapability
);

public fun get_collateral_configuration(
    collateral_type: String
): CollateralConfig;

public fun get_collateral_price(
    collateral_type: String
): u256;

public fun get_collateral_value(
    collateral_type: String,
    amount: u256
): u256;

public fun is_collateral_configured(
    collateral_type: String
): bool;
```

### 验证机制

在Move中，可以实现验证函数来确保配置的有效性：

```move
fun validate_collateral_config(config: &CollateralConfig) {
    // 验证参数在有效范围内
    assert!(config.issuance_ratio > 0, ERROR_INVALID_ISSUANCE_RATIO);
    assert!(config.liquidation_ratio > config.issuance_ratio, ERROR_INVALID_LIQUIDATION_RATIO);
    // 其他验证...
}
```

### 事件实现

```move
struct CollateralConfiguredEvent has drop, store {
    collateral_type: String,
    oracle_node_id: vector<u8>,
    issuance_ratio: u256,
    liquidation_ratio: u256,
    liquidation_reward: u256,
    min_delegation: u256,
    depositing_enabled: bool,
    sender: address,
}

public fun emit_collateral_configured_event(
    collateral_type: String,
    config: &CollateralConfig,
    sender: address
) {
    event::emit(CollateralConfiguredEvent {
        collateral_type,
        oracle_node_id: config.oracle_node_id,
        issuance_ratio: config.issuance_ratio,
        liquidation_ratio: config.liquidation_ratio,
        liquidation_reward: config.liquidation_reward,
        min_delegation: config.min_delegation,
        depositing_enabled: config.depositing_enabled,
        sender,
    });
}
``` 