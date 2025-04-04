# Synthetix V3 Protocol Analysis

## Overview

Synthetix V3 is a decentralized liquidity provisioning protocol built on Ethereum and other EVM-compatible chains. It introduces a modular architecture and a flexible liquidity provisioning system, addressing the challenges faced by traditional onchain derivative platforms, such as liquidity sourcing and infrastructure scaling.

This documentation is a comprehensive analysis of the Synthetix V3 codebase, explaining the core components, architecture, and key features of the protocol.

## Table of Contents

1. [Core Protocol Components](./core/README.md)
   - [Vaults](./core/vaults.md)
   - [Pools](./core/pools.md)
   - [Collateral and Debt Management](./core/collateral-debt.md)
   - [Liquidation Mechanism](./core/liquidation.md)

2. [Markets](./markets/README.md)
   - [Perps Market](./markets/perps-market.md)
   - [Spot Market](./markets/spot-market.md)
   - [BFP Market](./markets/bfp-market.md)

3. [Governance](./governance/README.md)
   - [Election System](./governance/election.md)
   - [Council Management](./governance/council.md)

4. [Oracle System](./oracle/README.md)
   - [Oracle Manager](./oracle/oracle-manager.md)
   - [Price Feeds](./oracle/price-feeds.md)

## System Architecture

Synthetix V3 follows a modular architecture that separates concerns into distinct components:

- **Core Protocol**: Provides the fundamental infrastructure for collateral management, staking, and debt accounting.
- **Markets**: Specialized modules that build on top of the core protocol to create different derivative markets.
- **Governance**: Manages the protocol parameters and upgrades through a decentralized council system.
- **Oracle System**: Provides reliable and secure price data for various assets used in the protocol.

## Key Innovations

1. **Modular Architecture**: Synthetix V3 uses a router proxy architecture that allows for modular components and easier upgrades.
2. **Flexible Liquidity Provisioning**: The protocol allows for various collateral types and custom allocation to different derivative markets.
3. **Cross-Chain Compatibility**: Designed to operate across multiple EVM-compatible chains.
4. **Advanced Risk Management**: Implements sophisticated liquidation and risk mitigation mechanisms.

## Getting Started

To understand the protocol in depth, start with the [Core Protocol Components](./core/README.md) section, which explains the fundamental building blocks of Synthetix V3.
