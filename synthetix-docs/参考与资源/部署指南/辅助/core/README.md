# Core Protocol Components

## Overview

The core protocol of Synthetix V3 forms the foundation of the entire system. It handles collateral management, staking, debt accounting, and liquidity allocation across various markets. This section explains the essential components and their interactions within the Synthetix V3 protocol.

## Key Components

### 1. Vaults

[Vaults](./vaults.md) are collateral containers where stakers deposit various supported collateral types, such as SNX, ETH, or stablecoins. Each vault is associated with a specific collateral type within a pool.

Vaults are responsible for:
- Tracking collateral deposits from users
- Managing debt distribution among participants
- Handling liquidation events via a structured epoch system
- Distributing rewards to stakers

### 2. Pools

[Pools](./pools.md) are liquidity aggregators that collect collateral from multiple vaults and allocate it to different derivative markets based on market configurations.

Pools enable:
- Collateral aggregation from multiple sources
- Programmable liquidity allocation to markets
- Risk management across multiple collateral types
- Governance of market parameters

### 3. Collateral and Debt Management

The [Collateral and Debt Management](./collateral-debt.md) system handles the accounting of user positions, debt issuance, and collateralization ratios.

Key functionalities include:
- Collateral delegation to pools
- Debt issuance against collateral
- Position management and monitoring
- Rewards distribution to stakers

### 4. Liquidation Mechanism

The [Liquidation Mechanism](./liquidation.md) ensures the solvency of the protocol by liquidating under-collateralized positions and vaults.

It provides:
- Position-level liquidation for individual accounts
- Vault-level liquidation for systemic risk mitigation
- Liquidation rewards for liquidators
- Protection against market volatility

## Interaction Flow

1. Users deposit collateral into vaults associated with specific pools
2. Pools allocate collateral to markets based on configured weights
3. Markets use the allocated collateral to back synthetic assets or derivative products
4. Debt is tracked and distributed among participants in proportion to their collateral
5. Liquidations occur when positions or vaults fall below required collateralization ratios

## Technical Implementation

The core protocol is implemented through a set of modular contracts using the Router Proxy architecture. This design allows for:
- Clean separation of concerns
- Granular component upgrades
- Efficient gas usage
- Flexible integration with new markets and features

The primary modules include:
- `VaultModule`: Manages collateral delegation and vault operations
- `PoolModule`: Handles pool creation and management
- `CollateralModule`: Manages collateral deposits and withdrawals
- `IssueUSDModule`: Controls the issuance of stablecoins against collateral
- `LiquidationModule`: Executes liquidations of under-collateralized positions
- `AssociateDebtModule`: Associates debt with specific collateral types

For detailed explanations of each component, refer to the respective documentation pages.
