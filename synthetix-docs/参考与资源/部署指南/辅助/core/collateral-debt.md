# Collateral and Debt Management in Synthetix V3

## Overview

The collateral and debt management system is a foundational component of Synthetix V3, responsible for tracking user positions, handling debt issuance, maintaining collateralization ratios, and facilitating the core economic mechanisms of the protocol. This system ensures that all synthetic assets are adequately backed by collateral.

## Key Components

### Collateral Configuration

Each supported collateral type has a configuration that defines its parameters:

```solidity
struct Data {
    uint256 oracleNodeId;
    uint256 collateralLimitD18;
    uint256 issuanceRatioD18;
    uint256 liquidationRatioD18;
    uint256 liquidationRewardD18;
    // Additional parameters...
}
```

These parameters include:
- Oracle node for price data
- Maximum collateral limit for the system
- Issuance ratio (minimum c-ratio for minting)
- Liquidation ratio (threshold for liquidation)
- Liquidation reward for liquidators

### Account Management

The `Account` system tracks user collateral and positions:

```solidity
struct Data {
    mapping(address => Collateral.Data) collaterals;
    mapping(bytes32 => Lock.Data) locks;
    SetUtil.Bytes32Set lockIds;
    // Additional fields...
}
```

This structure allows for:
- Tracking multiple collateral types per account
- Managing available and locked collateral
- Associating accounts with vaults and pools
- Tracking debt positions across different markets

### Debt Issuance

The process of issuing debt against collateral is handled by the `IssueUSDModule`:

```solidity
function issueUsd(
    uint128 accountId,
    uint128 poolId,
    address collateralType,
    uint256 amount
) external
```

This function:
- Verifies the account has sufficient collateral
- Calculates the maximum issuable debt
- Mints the requested amount of USD
- Updates debt records in the associated vault

### Collateral Delegation

Users delegate collateral to pools through the `VaultModule`:

```solidity
function delegateCollateral(
    uint128 accountId,
    uint128 poolId,
    address collateralType,
    uint256 newCollateralAmountD18,
    uint256 leverage
) external
```

This allows users to:
- Specify how much collateral to delegate
- Choose which pool to delegate to
- Set leverage parameters (currently limited to 1.0)
- Participate in specific markets through the pool

## Technical Implementation

### Debt Distribution

Debt is tracked and distributed using a proportional system:

1. **Debt Shares**: Each account has debt shares in proportion to their collateral
2. **Distribution Updates**: When system debt changes, it's distributed proportionally
3. **Consolidated Debt**: The actual debt amount is calculated by multiplying shares by the debt per share

```solidity
// Distribute debt to accounts
function distributeDebtToAccounts(int256 debtD18) internal {
    // Implementation details...
}

// Get actor debt
function getActorDebt(bytes32 actorId) internal view returns (uint256) {
    return getActorShares(actorId).mulDecimal(debtPerShareD18);
}
```

### Collateral Value Calculation

The system determines collateral value using oracle price data:

```solidity
function getCollateralValue(
    address collateralType,
    uint256 amount
) internal view returns (uint256) {
    // Fetch price from oracle
    uint256 price = oracle.getPrice(collateralConfig.oracleNodeId);
    
    // Calculate value
    return amount.mulDecimal(price);
}
```

### Collateral Locks

The protocol implements a locking mechanism to ensure collateral can't be withdrawn when needed for backing:

```solidity
function lockCollateral(
    uint128 accountId,
    address collateralType,
    uint256 amount,
    bytes32 lockId
) external
```

This is used for:
- Securing collateral for open positions
- Preventing withdrawal during critical operations
- Ensuring market solvency

## System Interactions

### Market Integration

Markets interact with the collateral/debt system by:
- Requesting credit capacity from pools
- Issuing and burning debt as positions change
- Locking collateral to secure positions
- Reporting market debt to the core system

### Liquidation Process

The collateral/debt system integrates with liquidations by:
- Providing position data for liquidation checks
- Updating collateral and debt records after liquidations
- Socializing debt from liquidated positions
- Distributing liquidation rewards

### Oracle Dependency

The system relies on oracles for:
- Determining collateral value
- Calculating collateralization ratios
- Triggering liquidations when ratios fall below thresholds
- Determining maximum debt issuance

## Risk Management

### Collateralization Ratios

The system manages risk through tiered ratios:
- **Target Ratio**: Recommended minimum ratio for users
- **Issuance Ratio**: Minimum ratio for minting new debt
- **Liquidation Ratio**: Threshold for triggering liquidations

### Debt Limits

Multiple limits ensure system stability:
- **Account Debt Limits**: Maximum debt per account based on collateral
- **Market Debt Limits**: Maximum debt per market based on pool configuration
- **System Debt Limits**: Maximum total debt based on governance parameters

### Position Monitoring

The system continually monitors positions:
- **Regular Updates**: Debt positions are updated as oracle prices change
- **Liquidation Checks**: Positions are checked against liquidation thresholds
- **Debt Ceiling Enforcement**: Prevents exceeding configured debt limits

## Technical Challenges and Solutions

1. **Debt Socialization**: Uses a sophisticated distribution system to handle debt changes
2. **Oracle Reliability**: Implements safeguards against oracle failures or manipulations
3. **Gas Optimization**: Balances comprehensive accounting with gas efficiency
4. **Position Complexity**: Manages complex position data with efficient data structures

## User Flows

### Staking Flow

1. User deposits collateral to their account
2. User delegates collateral to a pool
3. User begins earning staking rewards
4. User can issue debt against their collateral

### Debt Management Flow

1. User issues debt up to their maximum based on collateralization ratio
2. System tracks debt in the associated vault
3. User can repay debt by burning stablecoins
4. User can withdraw collateral if not needed for securing debt

### Position Adjustment Flow

1. User can increase collateral to improve their position
2. User can decrease debt to improve their position
3. User can withdraw excess collateral if sufficiently collateralized
4. User can self-liquidate to avoid forced liquidation penalties
