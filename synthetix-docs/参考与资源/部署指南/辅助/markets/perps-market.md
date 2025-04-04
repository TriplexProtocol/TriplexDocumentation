# Perpetual Futures Market in Synthetix V3

## Overview

The Perpetual Futures Market (Perps Market) is one of the flagship market implementations in Synthetix V3. It allows traders to take leveraged long or short positions on various assets without an expiration date. This market is designed to provide capital-efficient trading while managing risk effectively through a sophisticated system of funding rates, position limits, and liquidation mechanisms.

## Key Components

### PerpsMarketModule

The `PerpsMarketModule` serves as the core interaction point for traders and integrators:

```solidity
function metadata(uint128 marketId) external view returns (string memory name, string memory symbol);
function skew(uint128 marketId) external view returns (int256 marketSkew);
function size(uint128 marketId) external view returns (uint256 marketSize);
function fillPrice(uint128 marketId, int256 sizeDelta) external view returns (uint256 price);
```

This module provides essential information about markets:
- Market metadata (name, symbol)
- Current market skew (imbalance between long and short positions)
- Total market size (sum of all position sizes)
- Price for a specific order size

### OrderModule

The `OrderModule` processes order execution and management:

```solidity
function commitOrder(
    uint128 marketId,
    int128 sizeDelta,
    uint128 settlementStrategyId,
    uint256 acceptablePrice,
    bytes32 trackingCode
) external returns (uint128 commitmentId);

function settleOrder(uint128 commitmentId) external;
```

This module:
- Handles order commitment with price protection
- Manages settlement strategies (async or atomic)
- Tracks order execution and settlement
- Enforces position limits and risk parameters

### LiquidationModule

The `LiquidationModule` manages the liquidation of underwater positions:

```solidity
function liquidatePosition(
    uint128 marketId,
    address account,
    uint128 maxPriceImpact
) external;
```

This module:
- Identifies positions eligible for liquidation
- Executes liquidation orders
- Applies liquidation fees and penalties
- Updates market state after liquidations

### FundingModule

The `FundingModule` handles funding rate calculations and applications:

```solidity
function updateFundingRate(uint128 marketId) external;
function currentFundingRate(uint128 marketId) external view returns (int256 fundingRate);
```

This module:
- Calculates funding rates based on market skew
- Applies funding payments to positions
- Enforces funding velocity limits
- Tracks historical funding rates

## Technical Implementation

### Position Management

Positions in the Perps Market are tracked through a sophisticated accounting system:

```solidity
struct PerpsPosition {
    int256 sizeDelta;           // Size of the position in market's native units
    uint256 entryPrice;         // Entry price of the position
    int256 accumulatedFunding;  // Accumulated funding since position opening
    uint256 liquidationPrice;   // Price at which position becomes liquidatable
    uint256 leverage;           // Current position leverage
}
```

The system maintains:
- Position size and direction (positive for long, negative for short)
- Entry price and liquidation thresholds
- Funding payments and fee accumulation
- Profit and loss calculations

### Order Execution

Order execution follows a commitment-settlement pattern:

1. **Commitment Phase**:
   - Trader commits to a trade with size and acceptable price
   - System verifies position limits and margin requirements
   - Commitment is recorded with timestamp and parameters

2. **Settlement Phase**:
   - After commitment delay (if any), the order can be settled
   - System fetches current market price from the oracle
   - Order executes if price is within acceptable bounds
   - Position is updated with new size and entry price

### Liquidation Process

The liquidation process protects the system from insolvent positions:

1. **Liquidation Check**:
   - Positions are monitored for liquidation eligibility
   - A position becomes liquidatable when its margin ratio falls below threshold

2. **Liquidation Execution**:
   - Liquidator calls the liquidation function
   - System closes the position at current market price
   - Liquidation fee is deducted from remaining margin
   - Liquidator receives a reward for the liquidation

### Funding Rate Mechanism

Funding rates encourage price convergence to the underlying asset:

1. **Funding Rate Calculation**:
   - Based on market skew (imbalance between longs and shorts)
   - Higher skew leads to higher funding rate
   - Rate is proportional to skew and market configuration

2. **Funding Application**:
   - Applied periodically (e.g., hourly)
   - Long positions pay funding to short positions when rate is positive
   - Short positions pay funding to long positions when rate is negative
   - Funding is accumulated in user positions

## Integration with Core Protocol

The Perps Market integrates with the core protocol through:

1. **Pool Credit**:
   - Requests credit capacity from pools
   - Reports total debt to the core system
   - Ensures sufficient backing for all positions

2. **Oracle Integration**:
   - Uses price feeds for settlement and liquidation
   - Applies safe pricing mechanisms to prevent manipulation
   - Integrates with the Oracle Manager module

3. **Risk Management**:
   - Reports position sizes and risk to the core protocol
   - Adheres to debt and position limits set by pools
   - Participates in liquidation processes

## Risk Parameters

The Perps Market implements various risk parameters:

1. **Maximum Market Value**: Limits the total value of positions in a market
2. **Maximum Market Skew**: Restricts one-sided exposure in a market
3. **Liquidation Buffer**: Sets the margin buffer before liquidation
4. **Minimum Initial Margin**: Required initial margin for opening positions
5. **Funding Parameters**: Controls funding rate calculation and velocity

## User Experience

From a trader's perspective, the Perps Market offers:

1. **Leveraged Positions**: Up to the maximum leverage allowed by the market
2. **Continuous Trading**: No expiration dates on positions
3. **Dynamic Fees**: Based on market conditions and risk
4. **Funding Payments**: Regular funding transfers based on market skew
5. **Position Management**: Tools for adjusting, closing, and monitoring positions

## Technical Challenges and Solutions

1. **Price Impact**: Mitigated through dynamic pricing based on order size
2. **Front-running**: Addressed with commitment-settlement model
3. **Oracle Reliability**: Enhanced with multiple price verification mechanisms
4. **Gas Efficiency**: Optimized through efficient position management
5. **Cross-market Risk**: Managed through pool-level risk assessment

## Example Scenarios

1. **Opening a Long Position**: 
   - Trader commits to a 10 ETH long position with 5x leverage
   - After commitment delay, position settles at current market price
   - Trader's margin is locked and position is monitored for liquidation

2. **Liquidation Event**:
   - ETH price drops, pushing a position below liquidation threshold
   - Liquidator identifies and liquidates the position
   - Position is closed, liquidation fee applied, and rewards distributed

3. **Funding Rate Impact**:
   - Market becomes heavily skewed toward long positions
   - Positive funding rate is applied, causing longs to pay shorts
   - Skew gradually balances as funding incentivizes position adjustments
