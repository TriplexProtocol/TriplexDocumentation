# Markets in Synthetix V3

## Overview

Markets in Synthetix V3 are specialized modules that utilize the collateral managed by the core protocol to create various derivative products. These markets are built on top of the core infrastructure and provide different financial instruments to users, such as perpetual futures, spot trading, and binary options.

The market system in Synthetix V3 is designed to be modular and extensible, allowing for the creation of diverse financial instruments while sharing the same core infrastructure for collateral management and risk assessment.

## Key Market Types

### 1. Perps Market

The [Perpetual Futures Market](./perps-market.md) enables traders to take leveraged long or short positions on various assets without an expiration date. This market:

- Allows for high leverage trading
- Manages funding rates to encourage price convergence
- Tracks open interest and skew for risk management
- Processes order execution and settlement

### 2. Spot Market

The [Spot Market](./spot-market.md) facilitates the direct exchange of synthetic assets (synths) using the Atomic Order Module. This market:

- Enables instant synth trading
- Provides price discovery for synthetic assets
- Manages liquidity for synth trading pairs
- Processes fee collection and distribution

### 3. Base Fee Pool Market

The [Base Fee Pool Market](./bfp-market.md) is a specialized market that allows users to hedge against Ethereum base fee volatility. This innovative market:

- Tracks Ethereum base fee data
- Enables trading of base fee derivatives
- Provides risk management for gas costs
- Uses specialized oracles for base fee data

## Market Architecture

All markets in Synthetix V3 share a common architectural framework:

1. **Market Manager**: Registers and manages markets within the core protocol
2. **Market Modules**: Implement market-specific functionality through specialized modules
3. **Price Feed Integration**: Connect to the oracle system for reliable price data
4. **Pool Integration**: Utilize collateral from pools to back market positions

## Integration with Core Protocol

Markets integrate with the core protocol through:

1. **Credit Capacity**: Markets request credit capacity from pools to back their operations
2. **Position Management**: Markets track and report positions to the core protocol
3. **Debt Reporting**: Markets report their total debt to the core system
4. **Liquidation Hooks**: Markets provide liquidation capabilities for under-collateralized positions

## Risk Management

Each market implements specialized risk management mechanisms:

1. **Position Limits**: Maximum open interest per market
2. **Skew Management**: Monitoring and adjusting for one-sided exposure
3. **Liquidation Procedures**: Market-specific liquidation rules
4. **Fee Models**: Dynamic fee models based on market conditions

## Technical Implementation

Markets are implemented as independent modules that interact with the core protocol through defined interfaces:

```solidity
interface IMarketModule {
    function registerMarket(uint128 requestedMarketId) external;
    function reportLiquidation(uint128 marketId, int256 debtChange) external;
    function updatePrices() external;
    // Additional market-specific functions...
}
```

Each market type extends this interface with specialized functionality for its specific use case.

## Governance and Parameters

Markets are governed through:

1. **Market Creation**: Markets are created and registered through governance
2. **Parameter Adjustment**: Market parameters can be adjusted through governance
3. **Fee Distribution**: Market fees can be distributed according to governance decisions
4. **Market Retirement**: Markets can be retired through governed processes

## User Interactions

Users interact with markets through:

1. **Trading Interfaces**: Front-end applications for market interactions
2. **Order Execution**: Submitting and executing orders
3. **Position Management**: Managing existing positions
4. **Settlement**: Settling completed trades and collecting profits/losses

For detailed explanations of each market type, refer to their specific documentation pages.
