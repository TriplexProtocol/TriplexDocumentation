# Move资源设计模式

## 常见资源设计模式

Move语言中的资源模型使得智能合约开发更加安全，尤其在处理数字资产时。本文档总结了常见的Move资源设计模式，帮助开发者构建更安全、更可维护的智能合约。

## 1. Capability（能力）模式

Capability模式是Move中最常用的设计模式之一，它将权限表示为一种资源，持有该资源的账户可以执行特定操作。

### 基本Capability模式

```move
module examples::capability_pattern {
    use std::signer;
    
    /// 定义一个管理员能力资源
    struct AdminCapability has key, store { }
    
    /// 定义一个需要保护的资源
    struct ProtectedResource has key {
        value: u64,
    }
    
    /// 初始化函数，只有初始调用者能获得管理员能力
    public fun initialize(admin: &signer) {
        // 创建并移动AdminCapability到调用者账户
        move_to(admin, AdminCapability {});
        
        // 创建受保护资源
        move_to(admin, ProtectedResource { value: 0 });
    }
    
    /// 只有拥有AdminCapability的账户可以修改资源
    public fun update_value(
        admin: &signer, 
        new_value: u64
    ) acquires AdminCapability, ProtectedResource {
        let admin_addr = signer::address_of(admin);
        
        // 验证调用者拥有AdminCapability
        assert!(exists<AdminCapability>(admin_addr), 1);
        
        // 获取并更新资源
        let resource = borrow_global_mut<ProtectedResource>(admin_addr);
        resource.value = new_value;
    }
    
    /// 转移AdminCapability给新的管理员
    public fun transfer_admin(
        current_admin: &signer,
        new_admin: &signer
    ) acquires AdminCapability {
        let current_addr = signer::address_of(current_admin);
        
        // 确认当前管理员有能力
        assert!(exists<AdminCapability>(current_addr), 1);
        
        // 从当前管理员账户移除能力
        let cap = move_from<AdminCapability>(current_addr);
        
        // 移动到新管理员账户
        move_to(new_admin, cap);
    }
}
```

### 分层Capability模式

更复杂的系统可能需要多层权限管理：

```move
module examples::tiered_capability {
    use std::signer;
    
    /// 超级管理员能力
    struct SuperAdminCap has key { }
    
    /// 普通管理员能力
    struct AdminCap has key, store { }
    
    /// 操作员能力
    struct OperatorCap has key, store { }
    
    /// 初始化系统
    public fun initialize(super_admin: &signer) {
        move_to(super_admin, SuperAdminCap {});
    }
    
    /// 超级管理员可以创建普通管理员
    public fun create_admin(
        super_admin: &signer,
        new_admin: &signer
    ) acquires SuperAdminCap {
        // 验证超级管理员权限
        assert!(exists<SuperAdminCap>(signer::address_of(super_admin)), 1);
        
        // 创建并分配管理员能力
        move_to(new_admin, AdminCap {});
    }
    
    /// 管理员可以创建操作员
    public fun create_operator(
        admin: &signer,
        new_operator: &signer
    ) acquires AdminCap {
        // 验证管理员权限
        assert!(exists<AdminCap>(signer::address_of(admin)), 2);
        
        // 创建并分配操作员能力
        move_to(new_operator, OperatorCap {});
    }
}
```

## 2. 资源账户（Resource Account）模式

资源账户是Aptos特有的概念，允许创建无私钥控制的账户来管理资源。

```move
module examples::resource_account_pattern {
    use aptos_framework::account;
    use aptos_framework::resource_account;
    use std::signer;
    use std::vector;
    
    struct ModuleData has key {
        resource_signer_cap: account::SignerCapability,
    }
    
    /// 初始化资源账户
    public fun initialize(deployer: &signer, seed: vector<u8>) {
        // 创建资源账户
        let (resource_signer, resource_signer_cap) = 
            resource_account::create_resource_account(deployer, seed);
            
        // 存储资源账户的SignerCapability
        move_to(deployer, ModuleData { resource_signer_cap });
    }
    
    /// 使用资源账户执行操作
    public fun perform_action(deployer: &signer) acquires ModuleData {
        // 获取模块数据
        let module_data = borrow_global<ModuleData>(signer::address_of(deployer));
        
        // 通过SignerCapability获取资源账户的signer
        let resource_signer = account::create_signer_with_capability(&module_data.resource_signer_cap);
        
        // 现在可以使用resource_signer执行需要signer的操作
        // ...
    }
}
```

## 3. 访问控制（Access Control）模式

### 基于角色的访问控制

```move
module examples::role_based_access {
    use std::signer;
    use std::vector;
    
    /// 定义角色类型
    struct Role has drop {
        role_id: u8,
    }
    
    /// 用户角色存储
    struct UserRoles has key {
        roles: vector<Role>,
    }
    
    /// 受保护的资源
    struct ProtectedResource has key {
        data: u64,
    }
    
    /// 常量：角色定义
    const ROLE_ADMIN: u8 = 1;
    const ROLE_OPERATOR: u8 = 2;
    const ROLE_USER: u8 = 3;
    
    /// 初始化用户角色
    public fun initialize_user(user: &signer, initial_role: u8) {
        let roles = vector::empty<Role>();
        vector::push_back(&mut roles, Role { role_id: initial_role });
        move_to(user, UserRoles { roles });
    }
    
    /// 检查用户是否拥有特定角色
    public fun has_role(user_addr: address, role_id: u8): bool acquires UserRoles {
        if (!exists<UserRoles>(user_addr)) return false;
        
        let user_roles = borrow_global<UserRoles>(user_addr);
        let i = 0;
        let len = vector::length(&user_roles.roles);
        
        while (i < len) {
            let role = vector::borrow(&user_roles.roles, i);
            if (role.role_id == role_id) return true;
            i = i + 1;
        };
        
        false
    }
    
    /// 只有管理员可以添加角色
    public fun add_role(
        admin: &signer,
        user_addr: address,
        new_role: u8
    ) acquires UserRoles {
        // 验证管理员权限
        assert!(has_role(signer::address_of(admin), ROLE_ADMIN), 1);
        
        // 添加新角色
        if (exists<UserRoles>(user_addr)) {
            let user_roles = borrow_global_mut<UserRoles>(user_addr);
            // 验证角色不存在
            assert!(!has_role(user_addr, new_role), 2);
            vector::push_back(&mut user_roles.roles, Role { role_id: new_role });
        }
    }
    
    /// 特定操作需要特定角色
    public fun update_resource(
        operator: &signer,
        new_value: u64
    ) acquires UserRoles, ProtectedResource {
        let addr = signer::address_of(operator);
        
        // 验证操作员权限
        assert!(has_role(addr, ROLE_OPERATOR), 3);
        
        // 更新资源
        if (exists<ProtectedResource>(addr)) {
            let resource = borrow_global_mut<ProtectedResource>(addr);
            resource.data = new_value;
        } else {
            move_to(operator, ProtectedResource { data: new_value });
        }
    }
}
```

## 4. 资源转发（Forwarding）模式

有时我们需要一个模块代表用户执行操作，转发模式允许一个模块安全地代表用户执行操作。

```move
module examples::forwarding_pattern {
    use std::signer;
    
    /// 一个模块定义的资源
    struct ModuleResource has key {
        value: u64,
    }
    
    /// 授权转发的凭证
    struct ForwardingCapability has key, store {
        account: address,
    }
    
    /// 用户授权特定地址代表自己操作
    public fun authorize_forwarder(
        user: &signer,
        forwarder: address
    ) {
        move_to(user, ForwardingCapability { account: forwarder });
    }
    
    /// 检查是否有转发授权
    public fun is_authorized(
        forwarder_addr: address,
        user_addr: address
    ): bool acquires ForwardingCapability {
        if (!exists<ForwardingCapability>(user_addr)) return false;
        
        let cap = borrow_global<ForwardingCapability>(user_addr);
        cap.account == forwarder_addr
    }
    
    /// 代表用户执行操作
    public fun act_on_behalf(
        forwarder: &signer,
        user_addr: address,
        new_value: u64
    ) acquires ForwardingCapability, ModuleResource {
        let forwarder_addr = signer::address_of(forwarder);
        
        // 验证转发授权
        assert!(is_authorized(forwarder_addr, user_addr), 1);
        
        // 代表用户执行操作
        if (exists<ModuleResource>(user_addr)) {
            let resource = borrow_global_mut<ModuleResource>(user_addr);
            resource.value = new_value;
        }
    }
}
```

## 5. 事件发射（Event Emission）模式

在Move中，事件是一种重要的机制，允许链下观察链上状态变化。

```move
module examples::event_pattern {
    use std::signer;
    use aptos_framework::event;
    
    /// 定义事件结构
    struct TransferEvent has drop, store {
        from: address,
        to: address,
        amount: u64,
    }
    
    /// 事件句柄存储
    struct EventStore has key {
        transfer_events: event::EventHandle<TransferEvent>,
    }
    
    /// 初始化事件存储
    public fun initialize_events(account: &signer) {
        move_to(account, EventStore {
            transfer_events: event::new_event_handle<TransferEvent>(account),
        });
    }
    
    /// 执行转账并发射事件
    public fun transfer(
        from: &signer,
        to: address,
        amount: u64
    ) acquires EventStore {
        let from_addr = signer::address_of(from);
        
        // 执行转账逻辑...
        
        // 发射事件
        if (exists<EventStore>(from_addr)) {
            let event_store = borrow_global_mut<EventStore>(from_addr);
            event::emit_event(
                &mut event_store.transfer_events,
                TransferEvent {
                    from: from_addr,
                    to,
                    amount,
                }
            );
        }
    }
}
```

## 6. 延迟初始化（Lazy Initialization）模式

有时资源不需要在模块部署时立即创建，可以等到首次使用时再初始化。

```move
module examples::lazy_init {
    use std::signer;
    
    /// 可延迟初始化的资源
    struct LazyResource has key {
        initialized: bool,
        value: u64,
    }
    
    /// 确保资源存在（如不存在则初始化）
    public fun ensure_initialized(account: &signer): &mut LazyResource acquires LazyResource {
        let addr = signer::address_of(account);
        
        if (!exists<LazyResource>(addr)) {
            // 首次访问时初始化
            move_to(account, LazyResource {
                initialized: false,
                value: 0,
            });
        };
        
        let resource = borrow_global_mut<LazyResource>(addr);
        if (!resource.initialized) {
            // 完成初始化
            resource.initialized = true;
        };
        
        resource
    }
    
    /// 使用资源
    public fun use_resource(account: &signer, new_value: u64) acquires LazyResource {
        let resource = ensure_initialized(account);
        resource.value = new_value;
    }
}
```

## 7. 复合资源（Composite Resource）模式

当资源具有复杂的内部结构时，可以使用复合模式将其拆分为多个子资源。

```move
module examples::composite_pattern {
    use std::signer;
    
    /// 主资源
    struct MainResource has key {
        id: u64,
    }
    
    /// 配置资源
    struct ConfigResource has key {
        setting1: u64,
        setting2: bool,
    }
    
    /// 状态资源
    struct StateResource has key {
        active: bool,
        last_update: u64,
    }
    
    /// 初始化复合资源
    public fun initialize(account: &signer, id: u64) {
        // 创建主资源
        move_to(account, MainResource { id });
        
        // 创建配置资源
        move_to(account, ConfigResource {
            setting1: 100,
            setting2: false,
        });
        
        // 创建状态资源
        move_to(account, StateResource {
            active: false,
            last_update: 0,
        });
    }
    
    /// 更新配置
    public fun update_config(
        account: &signer,
        setting1: u64,
        setting2: bool
    ) acquires ConfigResource {
        let addr = signer::address_of(account);
        assert!(exists<ConfigResource>(addr), 1);
        
        let config = borrow_global_mut<ConfigResource>(addr);
        config.setting1 = setting1;
        config.setting2 = setting2;
    }
    
    /// 更新状态
    public fun update_state(
        account: &signer,
        active: bool,
        timestamp: u64
    ) acquires StateResource {
        let addr = signer::address_of(account);
        assert!(exists<StateResource>(addr), 2);
        
        let state = borrow_global_mut<StateResource>(addr);
        state.active = active;
        state.last_update = timestamp;
    }
}
```

## 8. 工厂（Factory）模式

工厂模式用于标准化资源的创建过程。

```move
module examples::factory_pattern {
    use std::signer;
    use std::string::{Self, String};
    
    /// 基本令牌资源
    struct Token has key, store {
        name: String,
        symbol: String,
        decimals: u8,
        supply: u64,
    }
    
    /// 令牌工厂能力
    struct TokenFactoryCap has key {
        tokens_created: u64,
    }
    
    /// 初始化工厂
    public fun initialize_factory(admin: &signer) {
        move_to(admin, TokenFactoryCap { tokens_created: 0 });
    }
    
    /// 创建新令牌
    public fun create_token(
        factory: &signer,
        recipient: &signer,
        name: String,
        symbol: String,
        decimals: u8,
        initial_supply: u64
    ) acquires TokenFactoryCap {
        let factory_addr = signer::address_of(factory);
        
        // 验证工厂权限
        assert!(exists<TokenFactoryCap>(factory_addr), 1);
        
        // 创建令牌
        let token = Token {
            name,
            symbol,
            decimals,
            supply: initial_supply,
        };
        
        // 将令牌移动到接收者
        move_to(recipient, token);
        
        // 更新创建计数
        let cap = borrow_global_mut<TokenFactoryCap>(factory_addr);
        cap.tokens_created = cap.tokens_created + 1;
    }
}
```

## 最佳实践

1. **权限控制**：始终使用Capability模式或适当的访问控制来保护关键功能。
2. **资源验证**：在访问资源前，使用`exists`函数检查资源是否存在。
3. **错误处理**：使用有意义的错误代码，并提供清晰的错误消息。
4. **模块化设计**：将不同的功能拆分到逻辑相关的模块中。
5. **资源生命周期管理**：计划资源的创建、更新和销毁过程。
6. **测试**：使用Move测试框架对所有模式进行单元测试。

通过理解和应用这些设计模式，Move开发者可以创建更加安全、高效和可维护的智能合约。 