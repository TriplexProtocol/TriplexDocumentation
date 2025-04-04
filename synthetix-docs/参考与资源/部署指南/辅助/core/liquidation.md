# Liquidation Mechanism in Synthetix V3

## Overview

The liquidation mechanism in Synthetix V3 is a critical component for maintaining system solvency by ensuring that all positions remain adequately collateralized. It provides two distinct liquidation paths: account-level liquidation and vault-level liquidation, each designed to address different risk scenarios.

## Key Functions

### Account-Level Liquidation

The `LiquidationModule.liquidate()` function allows for the liquidation of individual under-collateralized positions:

```solidity
function liquidate(
    uint128 accountId,
    uint128 poolId,
    address collateralType,
    uint128 liquidateAsAccountId
) external returns (LiquidationData memory liquidationData)
```

This function:
- Verifies that the position is eligible for liquidation
- Distributes the account's collateral among other vault participants
- Removes the account's debt and distributes it to other accounts
- Rewards the liquidator with a predefined reward amount

### Vault-Level Liquidation

The `LiquidationModule.liquidateVault()` function enables the liquidation of an entire vault when systemic risk is detected:

```solidity
function liquidateVault(
    uint128 poolId,
    address collateralType,
    uint128 liquidateAsAccountId,
    uint256 maxUsd
) external returns (LiquidationData memory liquidationData)
```

This function:
- Allows for full or partial vault liquidations
- Burns stablecoins provided by the liquidator
- Transfers corresponding collateral to the liquidator's account
- Resets the vault data by incrementing the epoch counter

### Liquidation Eligibility

A position or vault becomes eligible for liquidation when:

1. Its collateralization ratio falls below the liquidation ratio defined for that collateral type
2. It has a positive debt value
3. For account liquidation, there must be other accounts in the vault to socialize the debt

```solidity
function isPositionLiquidatable(
    uint128 accountId,
    uint128 poolId,
    address collateralType
) external returns (bool)
```

## Technical Implementation

### Liquidation Checks

The `_isLiquidatable()` function determines if a position can be liquidated:

```solidity
function _isLiquidatable(
    address collateralType,
    int256 debt,
    uint256 collateralValue
) internal view returns (bool) {
    // Position must have debt to be liquidated
    if (debt <= 0) {
        return false;
    }

    // Get the liquidation ratio for this collateral type
    CollateralConfiguration.Data storage collateralConfig = CollateralConfiguration.load(
        collateralType
    );
    uint256 liquidationRatio = collateralConfig.liquidationRatioD18;

    // Calculate the current c-ratio
    uint256 currentRatio = collateralValue.divDecimal(debt.toUint());

    // Position is liquidatable if c-ratio < liquidation ratio
    return currentRatio < liquidationRatio;
}
```

### Debt Socialization

During account liquidation, the debt of the liquidated account is distributed (socialized) among other accounts in the vault:

1. The liquidated account's debt is removed: `epoch.assignDebtToAccount(accountId, -liquidationData.debtLiquidated.toInt())`
2. The debt is distributed to other accounts: `epoch.distributeDebtToAccounts(liquidationData.debtLiquidated.toInt())`

### Collateral Distribution

Similarly, the collateral (minus the liquidation reward) is distributed to other vault participants:

```solidity
epoch.collateralAmounts.scale(
    liquidationData.collateralLiquidated.toInt() - liquidationData.amountRewarded.toInt()
);
```

### Liquidation Rewards

Liquidators receive rewards for their service:

- For account liquidation: A fixed reward determined by `collateralConfig.liquidationRewardD18`
- For vault liquidation: A favorable rate on the collateral received

### Vault Epoch System

Vault liquidations use an epoch system to create clean accounting after liquidation:

- Each epoch maintains its own debt and collateral distribution
- When a vault is fully liquidated, the epoch counter increments
- New deposits and delegations occur in the new epoch
- This prevents complex recalculations and state transitions

## Integration with Other Components

### Pool Integration

The liquidation mechanism interacts with pools to:
- Access vault data for liquidation checks
- Update pool-level debt calculations after liquidations
- Recalculate credit capacity available to markets

### Collateral Configuration

Liquidation parameters are defined at the collateral configuration level:
- Liquidation ratio (minimum c-ratio before liquidation)
- Liquidation reward (incentive for liquidators)
- Issuance fee (fee charged during debt issuance)

### Market Impact

Liquidations affect markets by:
- Potentially reducing available credit capacity
- Socializing debt across remaining participants
- Creating price impact if large liquidations occur frequently

## Risk Considerations

1. **Liquidation Ratio**: Set high enough to provide a buffer before insolvency
2. **Liquidation Rewards**: Balanced to incentivize liquidators without penalizing users excessively
3. **Partial Liquidations**: Vault-level liquidations support partial liquidations to minimize market impact
4. **Debt Socialization**: Distributes risk across all participants in proportion to their stake

## Technical Challenges and Solutions

1. **Gas Costs**: The implementation balances completeness with gas efficiency
2. **Atomic Liquidations**: Ensures liquidations are atomic to prevent partial states
3. **Oracle Reliance**: Depends on oracle data for price determination
4. **Reward Calibration**: Requires careful calibration of liquidation rewards

## Example Scenarios

1. **Individual Account Liquidation**: When a single trader's position falls below the required collateralization ratio
2. **Partial Vault Liquidation**: When a vault needs partial recapitalization during market stress
3. **Full Vault Liquidation**: In extreme scenarios where an entire vault becomes severely under-collateralized
4. **Preventative Liquidation**: Users can self-liquidate to avoid forced liquidation penalties
