# Price Feeds in Synthetix V3

## Overview

Price Feeds in Synthetix V3 represent the various data sources and mechanisms used to obtain real-time asset prices for the protocol. These feeds are integrated with the Oracle Manager through a node-based architecture, providing flexibility in data sourcing and processing. The price feed system is designed to be reliable, accurate, and resistant to manipulation, as it forms the foundation for critical protocol operations.

## External Price Feed Integrations

### Chainlink Integration

Chainlink is a primary source of price data for Synthetix V3:

```solidity
// Example node registration for Chainlink ETH/USD feed
bytes32 ethUsdNode = registerNode(
    NodeDefinition.NodeType.CHAINLINK,
    abi.encode(chainlinkEthUsdAggregator, 3600), // 1 hour staleness threshold
    new bytes32[](0)
);
```

The integration features:
- Direct connection to Chainlink price aggregators
- Configurable staleness thresholds
- Access to historical price data
- High reliability for major asset pairs

### Pyth Network Integration

Pyth Network provides an alternative price source:

```solidity
// Example node registration for Pyth BTC/USD feed
bytes32 btcUsdNode = registerNode(
    NodeDefinition.NodeType.PYTH,
    abi.encode(pythBtcUsdFeed, 1800), // 30 minute staleness threshold
    new bytes32[](0)
);
```

Key features include:
- High-frequency price updates
- Confidence intervals for price uncertainty
- Multiple contributor sources
- Cross-chain price availability

### API3 Integration

API3 serves as another decentralized oracle option:

```solidity
// Example node registration for API3 EUR/USD feed
bytes32 eurUsdNode = registerNode(
    NodeDefinition.NodeType.API3,
    abi.encode(api3EurUsdFeed, 7200), // 2 hour staleness threshold
    new bytes32[](0)
);
```

This provides:
- First-party data sources
- Self-sovereign oracle networks
- Transparent data provider attribution
- Additional redundancy for critical pairs

## Internal Price Mechanisms

### Time-Weighted Average Price (TWAP)

TWAP nodes calculate average prices over time periods:

```solidity
// Example TWAP node registration
bytes32 ethUsdTwapNode = registerNode(
    NodeDefinition.NodeType.TWAP,
    abi.encode(86400), // 24-hour period
    [ethUsdNode]
);
```

TWAP offers:
- Resistance to short-term price manipulation
- Smoothing of price volatility
- Configurable time windows
- Historical price averaging

### Volume-Weighted Average Price (VWAP)

VWAP nodes factor in trading volume for more accurate price averages:

```solidity
// Example VWAP node registration
bytes32 btcUsdVwapNode = registerNode(
    NodeDefinition.NodeType.VWAP,
    abi.encode(volumeSourceAddress),
    [btcUsdNode]
);
```

VWAP provides:
- Volume-sensitive price averages
- Better representation of traded prices
- Reduced impact of low-volume price movements
- Enhanced market representation

### Multi-Source Aggregation

Aggregation nodes combine multiple price sources:

```solidity
// Example median node registration
bytes32 ethUsdMedianNode = registerNode(
    NodeDefinition.NodeType.MEDIAN,
    abi.encode(),
    [chainlinkEthUsdNode, pythEthUsdNode, api3EthUsdNode]
);
```

This enables:
- Increased reliability through redundancy
- Outlier rejection via median calculation
- Reduced dependency on any single source
- Consensus-based price determination

## Specialized Price Feeds

### Synthetic Asset Price Feeds

For synthetic assets without direct external price feeds:

```solidity
// Example synthetic price calculation node
bytes32 syntheticIndexNode = registerNode(
    NodeDefinition.NodeType.WEIGHTED_AVERAGE,
    abi.encode([weight1, weight2, weight3]),
    [component1Node, component2Node, component3Node]
);
```

These feeds:
- Calculate prices for synthetic indices
- Combine multiple asset prices with weights
- Update automatically with component prices
- Support complex synthetic assets

### Base Fee Price Feeds

For Ethereum base fee tracking:

```solidity
// Example base fee tracking node
bytes32 baseFeeNode = registerNode(
    NodeDefinition.NodeType.BASE_FEE,
    abi.encode(averagingPeriod),
    new bytes32[](0)
);
```

This specialized feed:
- Tracks Ethereum base fee data
- Calculates averages over configurable periods
- Provides data for gas cost derivatives
- Enables hedging against gas price volatility

### Custom Price Calculators

For complex or bespoke price calculations:

```solidity
// Example custom price calculator node
bytes32 customFormulaNode = registerNode(
    NodeDefinition.NodeType.CUSTOM_FORMULA,
    abi.encode(formulaParams),
    [input1Node, input2Node]
);
```

These calculators:
- Implement specialized pricing formulas
- Process multiple input parameters
- Support protocol-specific price requirements
- Enable innovative financial products

## Technical Implementation

### Price Update Mechanisms

Price feeds can update through various mechanisms:

1. **Push Updates**: External oracles push new prices
2. **Pull Updates**: Protocol fetches prices when needed
3. **Hybrid Approaches**: Combination of push and pull
4. **Threshold Updates**: Updates triggered by significant price changes

### Staleness Management

The system handles stale data through:

```solidity
// Example staleness circuit breaker
bytes32 stalenessNode = registerNode(
    NodeDefinition.NodeType.STALENESS_CIRCUIT_BREAKER,
    abi.encode(3600), // 1 hour max staleness
    [priceNode]
);
```

This ensures:
- Data freshness verification
- Configurable staleness thresholds
- Circuit breaking for outdated prices
- Fallback mechanisms for stale data

### Deviation Protection

Protection against abnormal price movements:

```solidity
// Example price deviation circuit breaker
bytes32 deviationNode = registerNode(
    NodeDefinition.NodeType.CIRCUIT_BREAKER,
    abi.encode(0.1e18, 0.1e18), // 10% deviation bounds
    [priceNode, referenceNode]
);
```

This provides:
- Protection against flash crashes or spikes
- Configurable deviation thresholds
- Comparison against reference prices
- Governance override capabilities

## Price Feed Configuration

### Registration Process

Price feeds are registered through a governance process:

1. Proposal for new price feed
2. Technical implementation and testing
3. Security review and validation
4. Governance approval
5. Node registration and integration

### Configuration Parameters

Each price feed has configurable parameters:

- **Staleness Threshold**: Maximum acceptable age of data
- **Update Frequency**: How often prices should update
- **Deviation Bounds**: Acceptable price movement limits
- **Fallback Configuration**: Alternative sources if primary fails

## Security Considerations

### Oracle Manipulation Protection

The system protects against manipulation through:

1. **Multiple Data Sources**: Reduces impact of single source manipulation
2. **Time-Weighted Mechanisms**: Requires sustained manipulation
3. **Volume-Weighted Mechanisms**: Makes manipulation more costly
4. **Circuit Breakers**: Catches extreme manipulation attempts

### Governance Oversight

Governance provides security through:

1. **Feed Approval**: Only approved feeds are used
2. **Parameter Adjustments**: Configuration can be updated
3. **Emergency Intervention**: Override capability in extreme cases
4. **Monitoring Systems**: Alerts for abnormal behavior

## Integration Examples

### Collateral Valuation

```solidity
// Example of collateral using a price feed
collateralConfig.oracleNodeId = ethUsdMedianNode;
```

This enables:
- Real-time collateral valuation
- Liquidation threshold monitoring
- Collateralization ratio calculation
- Debt issuance limits

### Market Settlement

```solidity
// Example of market using price for settlement
market.settlementPriceNodeId = btcUsdTwapNode;
```

This ensures:
- Fair settlement prices
- Manipulation-resistant PnL calculation
- Consistent price references
- Reliable market operation

## Performance Considerations

### Gas Optimization

The price feed system optimizes for gas through:

1. **Cached Results**: Storing recent prices to reduce calls
2. **Batched Updates**: Updating multiple feeds in one transaction
3. **Efficient Data Storage**: Minimizing on-chain storage
4. **Read-heavy Design**: Optimizing for read operations

### Latency Management

The system balances latency concerns:

1. **Critical Path Optimization**: Fast access for liquidation paths
2. **Tiered Freshness**: Different freshness requirements for different operations
3. **Parallel Processing**: Independent price feed updates
4. **Asynchronous Updates**: Non-blocking price updates

## Example Price Feed Networks

### ETH/USD with Safety Measures

```
┌───────────┐     ┌───────────┐     ┌───────────┐
│ Chainlink │     │   Pyth    │     │   API3    │
│  ETH/USD  │     │  ETH/USD  │     │  ETH/USD  │
└─────┬─────┘     └─────┬─────┘     └─────┬─────┘
      │                 │                 │
      └────────┬────────┼────────────────┘
               │        │
         ┌─────┴────┐   │
         │  Median  │   │
         │   Node   │   │
         └─────┬────┘   │
               │        │
         ┌─────┴────┐   │
         │Staleness │   │
         │ Checker  │   │
         └─────┬────┘   │
               │        │
               │    ┌───┴───┐
               │    │ TWAP  │
               │    │ Node  │
               │    └───┬───┘
               │        │
         ┌─────┴────┐   │
         │ Primary  │   │
         │  Path    │   │
         └─────┬────┘   │
               │        │
               │    ┌───┴───┐
               └────┤Fallback│
                    │ Path  │
                    └───┬───┘
                        │
                  ┌─────┴─────┐
                  │Final Price│
                  │   Node    │
                  └───────────┘
```

This network provides:
- Multiple independent price sources
- Median calculation for outlier rejection
- Staleness verification for data freshness
- TWAP fallback for extreme conditions
- Final aggregation with safety checks
