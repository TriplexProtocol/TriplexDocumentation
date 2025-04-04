# Election System in Synthetix V3

## Overview

The Election System in Synthetix V3 manages the process of selecting council members who represent stakeholders in protocol governance. It implements a sophisticated voting mechanism with distinct periods for nominations, voting, and evaluation, all coordinated across multiple chains when necessary. This system ensures fair representation and smooth transitions between governance epochs.

## Key Components

### ElectionModule

The `ElectionModule` is the primary contract that manages the election process:

```solidity
function initOrUpdateElectionSettings(
    address[] memory initialCouncil,
    IWormhole wormholeCore,
    IWormholeRelayer wormholeRelayer,
    uint8 minimumActiveMembers,
    uint64 initialNominationPeriodStartDate,
    uint64 administrationPeriodDuration,
    uint64 nominationPeriodDuration,
    uint64 votingPeriodDuration
) external
```

This module:
- Initializes and updates election settings
- Manages epoch transitions
- Handles nomination and voting periods
- Tallies votes and determines winners
- Coordinates cross-chain election operations

### ElectionModuleSatellite

The `ElectionModuleSatellite` extends the election functionality to multiple chains:

```solidity
function _recvNominate(uint256 electionId, address candidate, uint256 sourceChainId) external
function _recvCastVote(uint256 electionId, address voter, address[] memory candidates, uint256 sourceChainId) external
```

This module:
- Synchronizes election data across chains
- Processes cross-chain nominations and votes
- Ensures consistent election results regardless of chain

### SnapshotVotePowerModule

The `SnapshotVotePowerModule` determines voting power based on token holdings:

```solidity
function getVotePower(address account, uint256 electionId) external view returns (uint256)
```

This module:
- Calculates voting power for each account
- Takes snapshots of token balances at specific timestamps
- Ensures voting power is proportional to stake in the protocol

## Election Cycle

The election process follows a defined cycle with distinct periods:

### 1. Administration Period

- Elected council members govern the protocol
- Duration: Configurable (e.g., 30 days)
- Activities: Parameter adjustments, protocol management, upgrade decisions

### 2. Nomination Period

- Community members can nominate candidates for the next council
- Duration: Configurable (e.g., 7 days)
- Requirements: Candidates must meet minimum criteria for nomination

```solidity
function nominate(address candidate) external payable
```

### 3. Voting Period

- Token holders cast votes for their preferred candidates
- Duration: Configurable (e.g., 7 days)
- Mechanism: Voting power is based on token holdings at snapshot time

```solidity
function cast(address[] memory candidates) external payable
```

### 4. Evaluation Period

- Votes are tallied and winners determined
- Duration: Brief period after voting ends
- Process: Uses sophisticated counting algorithm to ensure fair representation

```solidity
function evaluate(uint256 numBallots) external payable
```

### 5. Transition

- New council takes over from the previous one
- Process: Automatic transition at the end of epoch
- Notification: Events emitted to inform ecosystem of new council

## Vote Tallying

The Election System uses a sophisticated tallying mechanism:

1. **Ballot Collection**: All valid ballots are collected
2. **Vote Power Weighting**: Each ballot is weighted by the voter's stake
3. **Winner Determination**: Candidates with highest weighted votes are elected
4. **Threshold Enforcement**: Minimum vote thresholds may be required

## Cross-Chain Operations

The system supports cross-chain voting through:

1. **Message Passing**: Uses Wormhole for secure cross-chain communication
2. **Synchronized Periods**: Aligned election periods across all chains
3. **Consolidated Counting**: Votes from all chains are consolidated for tallying
4. **Consistent Results**: Same council members elected on all chains

```solidity
function broadcast(
    WormholeCrossChain.Data storage wh,
    uint16[] memory chains,
    bytes memory payload,
    uint256 additionalGas
) internal
```

## Technical Implementation Details

### Epoch Management

The system uses an epoch structure to track election cycles:

```solidity
struct Data {
    uint64 startDate;
    uint64 nominationPeriodStartDate;
    uint64 votingPeriodStartDate;
    uint64 endDate;
}
```

### Period Determination

The current election period is determined by comparing the current timestamp with epoch dates:

```solidity
function currentPeriod() internal view returns (ElectionPeriod) {
    uint64 timestamp = block.timestamp.to64();
    
    if (timestamp < nominationPeriodStartDate) {
        return ElectionPeriod.Administration;
    } else if (timestamp < votingPeriodStartDate) {
        return ElectionPeriod.Nomination;
    } else if (timestamp < endDate) {
        return ElectionPeriod.Vote;
    } else {
        return ElectionPeriod.Evaluation;
    }
}
```

### Vote Storage

Votes are stored in ballot structures:

```solidity
struct Data {
    uint256 votingPower;
    address[] votedCandidates;
}
```

## Security and Integrity Measures

The Election System implements several security features:

1. **Voting Period Enforcement**: Votes can only be cast during the voting period
2. **One Ballot Per Voter**: Each voter can only submit one ballot per election
3. **Minimum Active Members**: Ensures a minimum number of council members
4. **Cross-Chain Verification**: Validates cross-chain messages for authenticity
5. **Schedule Tweaking**: Limited ability to adjust period timing if necessary

## User Experience

From a stakeholder's perspective, the Election System provides:

1. **Candidate Nomination**: Ability to nominate qualified candidates
2. **Weighted Voting**: Voting power proportional to stake in the protocol
3. **Transparent Results**: Clear and verifiable election outcomes
4. **Cross-Chain Participation**: Voting regardless of which chain holds tokens
5. **Regular Renewal**: Periodic opportunity to elect new representatives

## Technical Challenges and Solutions

1. **Cross-Chain Coordination**: Solved with Wormhole integration
2. **Vote Counting Complexity**: Optimized with efficient tallying algorithms
3. **Gas Optimization**: Implemented batch processing for vote evaluation
4. **Timing Sensitivity**: Handled with adjustable period durations
5. **Fork Handling**: Mechanisms to maintain governance during network forks

## Example Workflows

### Nominating a Candidate

1. User calls `nominate()` with candidate address during nomination period
2. System verifies candidate eligibility
3. Nomination is recorded and broadcast across chains
4. Event is emitted for UI notification

### Casting a Vote

1. User calls `cast()` with array of preferred candidates during voting period
2. System calculates user's voting power based on token holdings
3. Vote is recorded and broadcast across chains
4. Previous vote (if any) is overwritten

### Evaluating Results

1. After voting period ends, anyone can trigger evaluation
2. `evaluate()` processes ballots in batches to determine winners
3. New council members are recorded for the next epoch
4. Events are emitted to notify the ecosystem
