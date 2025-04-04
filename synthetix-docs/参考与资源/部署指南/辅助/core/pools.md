# Pools in Synthetix V3

## Overview

Pools are a central component of the Synthetix V3 architecture, serving as aggregators of collateral from multiple vaults and distributors of liquidity to various derivative markets. Each pool can support multiple collateral types and allocate liquidity to different markets based on configurable distribution parameters.

## Key Functions

### Pool Creation and Management

The `PoolModule` enables:

- Pool creation with unique IDs
- Owner management for pools
- Collateral type configuration
- Market registration and integration

```solidity
function createPool(uint128 requestedPoolId, address owner) external
```

### Collateral Aggregation

Pools aggregate collateral from multiple sources:

- Collateral from different vaults
- Multiple collateral types (SNX, ETH, stablecoins, etc.)
- Collateral delegated with different leverage values

### Market Liquidity Allocation

Pools control:

- Which markets are supported
- How much liquidity is allocated to each market
- Debt distribution among markets
- Risk parameters for market operations

```solidity
function setPoolConfiguration(
    uint128 poolId,
    uint128 marketId,
    address collateralType,
    uint256 weight,
    uint256 maxDebtShareValue
) external
```

### Debt Management

Pools coordinate debt across vaults and markets:

- Tracking total debt for the pool
- Distributing debt to vaults based on collateral type
- Managing debt limits for markets
- Ensuring system solvency through debt ceilings

## Technical Implementation

### Storage Structure

The Pool library defines a sophisticated data structure:

```solidity
struct Data {
    address owner;
    SetUtil.AddressSet preferredCollateral;
    mapping(address => Vault.Data) vaults;
    mapping(uint128 => MarketConfiguration.Data) marketConfigurations;
    SetUtil.UintSet registeredMarkets;
    mapping(uint128 => PoolDebtShare.Data) marketDebtShare;
}
```

### Pool Configuration

Pool parameters that can be configured include:

1. **Market Weights**: Determine how much capacity each market receives
2. **Maximum Debt Share Values**: Limit debt each market can issue
3. **Preferred Collateral Types**: Define collateral preferences for the pool
4. **Owner Controls**: Determine who can modify pool parameters

### Market Integration

Pools integrate with markets through:

1. **Market Registration**: Markets must be registered with a pool before receiving liquidity
2. **Liquidity Distribution**: Pools distribute available liquidity based on weights
3. **Debt Tracking**: Pools track debt issued by each market
4. **Credit Capacity**: Pools calculate available credit capacity for markets based on collateral value

## Interaction with Other Components

### Vault Integration

Pools interact with vaults by:

- Maintaining a mapping of vaults for each collateral type
- Accessing collateral information from vaults
- Directing debt distribution among vaults
- Triggering liquidations when necessary

### Market Integration

Pools support markets by:

- Providing credit capacity information
- Receiving debt issuance notifications
- Enforcing market debt limits
- Managing collateral allocation

### Governance Integration

Pool parameters are configurable through governance:

- Pool creation requires appropriate permissions
- Parameter updates are controlled by pool owners
- Market registrations must be approved
- Collateral type configurations follow governance standards

## Risk Considerations

1. **Market Isolation**: Issues in one market don't automatically affect others
2. **Collateral Diversification**: Pools can support multiple collateral types to distribute risk
3. **Debt Ceilings**: Markets have caps on how much debt they can issue
4. **Preferential Markets**: Critical markets can be given priority for collateral allocation

## Technical Challenges and Solutions

1. **Liquidity Fragmentation**: Solved with a pool-based model that aggregates liquidity
2. **Market Specialization**: Addressed by allowing different pools to serve different markets
3. **Debt Management**: Managed through sophisticated debt tracking and distribution
4. **Capital Efficiency**: Improved through configurable weights and leverage

## Example Use Cases

1. **SNX-Only Pool**: A pool accepting only SNX as collateral, serving specific markets
2. **Multi-Collateral Pool**: A pool accepting various collateral types, distributing liquidity across markets
3. **Specialized Market Pool**: A pool focused on providing liquidity to a specific market type
4. **Community-Managed Pool**: A pool with governance-elected managers determining parameters
