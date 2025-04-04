# 账户模块 (AccountModule)

## 模块概述

账户模块负责管理系统中的账户创建、权限管理和所有权控制。它允许用户创建账户、授予和撤销权限，以及转让账户所有权。

## 主要功能

1. **账户创建和管理**
   - 创建新账户
   - 查询账户所有者
   - 转让账户所有权

2. **权限系统**
   - 基于角色的访问控制
   - 权限授予和撤销
   - 委托权限管理

3. **账户Token管理**
   - 账户Token生成(用于识别)
   - Token关联

## 接口定义

```solidity
interface IAccountModule {
    // 账户创建函数
    function createAccount(uint128 requestedAccountId) external returns (uint128 accountId);
    function createAccount() external returns (uint128 accountId);
    
    // 账户所有权管理
    function getAccountOwner(uint128 accountId) external view returns (address owner);
    function nominateAccountOwner(uint128 accountId, address nominatedOwner) external;
    function acceptAccountOwnership(uint128 accountId) external;
    function renounceAccountOwnership(uint128 accountId) external;
    
    // 权限管理
    function getAccountPermissions(uint128 accountId) external view returns (AccountRBAC.Permission[] memory permissions);
    function hasPermission(uint128 accountId, address user, bytes32 permission) external view returns (bool hasPermission);
    function grantPermission(uint128 accountId, address user, bytes32 permission) external;
    function revokePermission(uint128 accountId, address user, bytes32 permission) external;
    function renouncePermission(uint128 accountId, bytes32 permission) external;
}
```

## 数据结构

```solidity
// 账户数据结构
struct Account {
    uint128 id;
    address owner;
    AccountRBAC.Data permissions;
    SetUtil.Bytes32Set permissionAddresses;
}

// 权限结构
struct Permission {
    address user;
    bytes32 permission;
}
```

## 事件

```solidity
// 账户创建事件
event AccountCreated(uint128 indexed accountId, address indexed owner);

// 账户所有权变更事件
event AccountOwnerNominated(uint128 indexed accountId, address indexed nominatedOwner, address indexed owner);
event AccountOwnershipAccepted(uint128 indexed accountId, address indexed owner);
event AccountOwnershipRenounced(uint128 indexed accountId, address indexed owner);

// 权限变更事件
event PermissionGranted(uint128 indexed accountId, address indexed user, bytes32 indexed permission, address sender);
event PermissionRevoked(uint128 indexed accountId, address indexed user, bytes32 indexed permission, address sender);
event PermissionRenounced(uint128 indexed accountId, address indexed user, bytes32 indexed permission);
```

## Move语言实现考虑

### 资源定义

```move
struct Account has key {
    id: u128,
    owner: address,
    permissions: vector<Permission>,
}

struct Permission has store, drop {
    user: address,
    permission_type: vector<u8>, // Bytes32转为向量
}

struct AccountCapability has key, store {
    account_id: u128,
}
```

### 主要函数

```move
public fun create_account(ctx: &mut TxContext): (AccountId, AccountCapability);
public fun get_account_owner(account_id: u128): address;
public fun grant_permission(account: &mut Account, user: address, permission: vector<u8>, cap: &AccountCapability);
public fun has_permission(account: &Account, user: address, permission: vector<u8>): bool;
```

### 访问控制

在Move中，权限控制可以通过能力模式实现：

1. 为每个账户创建唯一的能力对象
2. 将关键操作函数设计为需要相应能力作为参数
3. 使用Move的类型系统确保只有合法所有者才能获取能力对象

### 事件实现

```move
struct AccountCreatedEvent has drop, store {
    account_id: u128,
    owner: address,
}

public fun emit_account_created_event(account_id: u128, owner: address) {
    event::emit(AccountCreatedEvent {
        account_id,
        owner,
    });
}
``` 