# Oracle System in Synthetix V3

## Overview

The Oracle System in Synthetix V3 is a critical infrastructure component that provides reliable price data for various assets used throughout the protocol. It serves as the foundation for many core functions including collateral valuation, liquidation decisions, exchange rates, and funding rate calculations. The oracle system is designed to be flexible, extensible, and secure, supporting various data sources and processing mechanisms.

## Key Components

### 1. Oracle Manager

The [Oracle Manager](./oracle-manager.md) is the central coordination point for all price feeds in Synthetix V3:

- Manages the registration and configuration of price feed nodes
- Processes raw price data into usable format for the protocol
- Provides a unified interface for different types of price sources
- Implements security measures to ensure data integrity

### 2. Price Feeds

The [Price Feeds](./price-feeds.md) system interfaces with external data sources to obtain real-time asset prices:

- Supports various external oracles (Chainlink, Pyth, etc.)
- Implements custom price feed mechanisms
- Enables cross-chain price data transmission
- Provides fallback mechanisms for resilience

## Oracle Architecture

The oracle system follows a node-based architecture where:

1. **Nodes**: Represent different data sources or processing steps
2. **Node Types**: Define the behavior and processing logic for each node
3. **Node Parents**: Establish dependencies between nodes
4. **Node Networks**: Form processing pipelines for complex price calculations

## Node Types

The oracle system supports various node types for different purposes:

1. **External Feed Nodes**: Interface with off-chain oracles like Chainlink
2. **Constant Nodes**: Provide fixed values for testing or special cases
3. **Reducer Nodes**: Combine multiple inputs (e.g., TWAP, median)
4. **Transformation Nodes**: Apply mathematical operations to price data
5. **Staleness Circuit Breaker Nodes**: Protect against stale data
6. **Circuit Breaker Nodes**: Implement price deviation protection

## Technical Implementation

The oracle system is implemented as a set of modular contracts:

- `NodeModule`: Core module for node registration and management
- `PriceModule`: Processes and retrieves price information
- `NodeOutputModule`: Manages the cached outputs of nodes
- `NodeDefinition`: Defines the structure and types of nodes

## Integration with Protocol Components

The oracle system integrates with various protocol components:

1. **Collateral Management**: Provides asset prices for collateral valuation
2. **Liquidation Module**: Supplies price data for liquidation decisions
3. **Markets**: Offers exchange rates for trading and settlement
4. **Risk Management**: Provides data for risk calculations and adjustments

## Security Measures

The oracle system implements several security features:

1. **Staleness Checks**: Ensures price data is current and valid
2. **Circuit Breakers**: Prevents execution based on extreme price movements
3. **Multi-Source Validation**: Compares data from multiple sources
4. **Governance Oversight**: Allows for intervention in exceptional circumstances

## User Experience

From a protocol user's perspective, the oracle system:

1. **Functions Transparently**: Provides reliable price data without user intervention
2. **Ensures Fair Pricing**: Maintains accurate and manipulation-resistant prices
3. **Enables Market Operations**: Powers trading, liquidations, and other market functions
4. **Provides Consistency**: Ensures consistent pricing across all protocol functions

For detailed explanations of each oracle component, refer to their respective documentation pages.
