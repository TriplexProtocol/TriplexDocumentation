# 流动性池管理模块单元测试样例

## 测试用例：TC-LP-001

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-LP-001 |
| 测试名称 | 验证普通用户无法创建流动性池 |
| 测试类型 | 单元测试 |
| 所属模块 | 流动性池管理 |
| 优先级 | 高 |
| 编写人员 | 张工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证系统正确实现了权限控制，确保只有管理员账户能够创建流动性池，普通用户的创建请求会被拒绝。

### 前置条件

1. 系统已初始化并正常运行
2. 测试账户已创建（包括普通用户账户和管理员账户）
3. 测试账户中已有足够的代币用于创建流动性池

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 普通用户账户地址 | 0x12345... | 没有管理员权限的用户账户 |
| 池名称 | "Test Pool" | 待创建的流动性池名称 |
| 初始流动性 | 1000 USDC | 创建池时提供的初始流动性 |
| 手续费率 | 0.3% | 池的交易手续费率设置 |

### 测试步骤

1. 使用普通用户账户登录系统
2. 尝试创建名为"Test Pool"的新流动性池
3. 设置初始流动性为1000 USDC
4. 设置手续费率为0.3%
5. 提交创建请求
6. 检查系统响应和错误信息

### 预期结果

1. 系统拒绝普通用户的池创建请求
2. 返回权限错误，错误代码为"NOT_AUTHORIZED"
3. 系统日志中记录了尝试操作及其被拒绝的信息
4. 流动性池列表中不会出现新创建的池
5. 用户账户中的代币余额保持不变

### 测试脚本

```move
#[test]
public fun test_create_pool_unauthorized() {
    // 设置测试环境
    let scenario = test_scenario::begin(@user);
    
    // 初始化普通用户账户
    let user = test_scenario::ctx(&mut scenario);
    let user_coin = coin::mint_for_testing<USDC>(1000, user);
    
    // 尝试使用普通用户创建池
    test_scenario::next_tx(&mut scenario, @user);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        // 预期此调用会失败，使用 #[expected_failure] 标注
        liquidity_pool::create_pool(
            b"Test Pool",
            user_coin,
            3000, // 0.3%
            ctx
        );
    };
    
    // 验证错误类型和代码
    test_scenario::next_tx(&mut scenario, @user);
    {
        // 验证错误代码是否为 NOT_AUTHORIZED
        let error_event = test_scenario::take_event<ErrorEvent>(&mut scenario);
        assert!(error_event.code == liquidity_pool::ERROR_NOT_AUTHORIZED, 0);
        
        // 验证用户余额未变
        let balance = coin::balance<USDC>(@user);
        assert!(balance == 1000, 1);
        
        // 验证池未被创建
        assert!(!liquidity_pool::pool_exists(b"Test Pool"), 2);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-LP-002

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-LP-002 |
| 测试名称 | 验证管理员成功创建流动性池 |
| 测试类型 | 单元测试 |
| 所属模块 | 流动性池管理 |
| 优先级 | 高 |
| 编写人员 | 张工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证管理员账户可以成功创建流动性池，并确认池的初始状态是否符合预期。

### 前置条件

1. 系统已初始化并正常运行
2. 管理员账户已创建
3. 管理员账户中已有足够的代币用于创建流动性池

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 管理员账户地址 | 0xADMIN... | 具有管理员权限的账户 |
| 池名称 | "Test Pool" | 待创建的流动性池名称 |
| 初始流动性 | 1000 USDC | 创建池时提供的初始流动性 |
| 手续费率 | 0.3% | 池的交易手续费率设置 |

### 测试步骤

1. 使用管理员账户登录系统
2. 创建名为"Test Pool"的新流动性池
3. 设置初始流动性为1000 USDC
4. 设置手续费率为0.3%
5. 提交创建请求
6. 检查池是否创建成功
7. 验证池的初始状态和参数

### 预期结果

1. 池创建成功
2. 系统返回成功创建的确认
3. 流动性池列表中出现新创建的池
4. 池的初始状态为"激活"
5. 池的参数符合设置值（名称、手续费率等）
6. 管理员账户中的代币余额减少相应数量
7. 系统日志中记录了创建操作信息

### 测试脚本

```move
#[test]
public fun test_create_pool_admin() {
    // 设置测试环境
    let scenario = test_scenario::begin(@admin);
    
    // 初始化管理员账户
    let admin = test_scenario::ctx(&mut scenario);
    let admin_coin = coin::mint_for_testing<USDC>(1000, admin);
    
    // 使用管理员创建池
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        liquidity_pool::create_pool(
            b"Test Pool",
            admin_coin,
            3000, // 0.3%
            ctx
        );
    };
    
    // 验证池创建成功和状态
    test_scenario::next_tx(&mut scenario, @admin);
    {
        // 验证池存在
        assert!(liquidity_pool::pool_exists(b"Test Pool"), 0);
        
        // 验证池状态
        let pool_info = liquidity_pool::get_pool_info(b"Test Pool");
        assert!(pool_info.status == liquidity_pool::POOL_STATUS_ACTIVE, 1);
        assert!(pool_info.fee_rate == 3000, 2);
        assert!(pool_info.total_liquidity == 1000, 3);
        
        // 验证管理员余额减少
        let balance = coin::balance<USDC>(@admin);
        assert!(balance == 0, 4);
        
        // 验证事件
        let create_event = test_scenario::take_event<PoolCreatedEvent>(&mut scenario);
        assert!(create_event.pool_name == b"Test Pool", 5);
        assert!(create_event.creator == @admin, 6);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-LP-101

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-LP-101 |
| 测试名称 | 验证正常添加流动性 |
| 测试类型 | 单元测试 |
| 所属模块 | 流动性池管理 |
| 优先级 | 高 |
| 编写人员 | 张工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证用户能够成功向已存在的流动性池中添加流动性，并获得相应的流动性份额。

### 前置条件

1. 系统已初始化并正常运行
2. 流动性池"Test Pool"已创建且状态为激活
3. 测试用户账户已创建
4. 测试用户账户中已有足够的代币

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 用户账户地址 | 0x67890... | 普通用户账户 |
| 池名称 | "Test Pool" | 已存在的流动性池 |
| 添加流动性 | 500 USDC | 用户添加的流动性金额 |

### 测试步骤

1. 使用测试用户账户登录系统
2. 查询池"Test Pool"的当前总流动性
3. 向池中添加500 USDC流动性
4. 提交添加请求
5. 查询用户在池中的份额
6. 查询池的总流动性

### 预期结果

1. 流动性添加成功
2. 用户获得相应的流动性份额
3. 池的总流动性增加500 USDC
4. 用户账户中的代币余额减少500 USDC
5. 系统日志记录了添加流动性的操作信息

### 测试脚本

```move
#[test]
public fun test_add_liquidity() {
    // 设置测试环境
    let scenario = test_scenario::begin(@admin);
    
    // 初始化池
    {
        let admin = test_scenario::ctx(&mut scenario);
        let admin_coin = coin::mint_for_testing<USDC>(1000, admin);
        liquidity_pool::create_pool(b"Test Pool", admin_coin, 3000, admin);
    };
    
    // 用户添加流动性
    test_scenario::next_tx(&mut scenario, @user);
    {
        let user = test_scenario::ctx(&mut scenario);
        let user_coin = coin::mint_for_testing<USDC>(500, user);
        
        // 池初始流动性
        let pool_info_before = liquidity_pool::get_pool_info(b"Test Pool");
        let initial_liquidity = pool_info_before.total_liquidity;
        
        // 添加流动性
        liquidity_pool::add_liquidity(b"Test Pool", user_coin, user);
        
        // 验证用户份额
        let user_share = liquidity_pool::get_user_share(b"Test Pool", @user);
        assert!(user_share == 500, 0);
        
        // 验证池总流动性
        let pool_info_after = liquidity_pool::get_pool_info(b"Test Pool");
        assert!(pool_info_after.total_liquidity == initial_liquidity + 500, 1);
        
        // 验证用户余额
        let balance = coin::balance<USDC>(@user);
        assert!(balance == 0, 2);
        
        // 验证事件
        let add_event = test_scenario::take_event<LiquidityAddedEvent>(&mut scenario);
        assert!(add_event.pool_name == b"Test Pool", 3);
        assert!(add_event.provider == @user, 4);
        assert!(add_event.amount == 500, 5);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-LP-201

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-LP-201 |
| 测试名称 | 验证正常移除流动性 |
| 测试类型 | 单元测试 |
| 所属模块 | 流动性池管理 |
| 优先级 | 高 |
| 编写人员 | 张工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证用户能够成功从流动性池中移除部分或全部流动性。

### 前置条件

1. 系统已初始化并正常运行
2. 流动性池"Test Pool"已创建且状态为激活
3. 测试用户已向池中添加了流动性
4. 用户在池中有500 USDC的流动性份额

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 用户账户地址 | 0x67890... | 普通用户账户 |
| 池名称 | "Test Pool" | 已存在的流动性池 |
| 移除流动性 | 200 USDC | 用户移除的流动性金额 |

### 测试步骤

1. 使用测试用户账户登录系统
2. 查询用户在池"Test Pool"中的当前份额
3. 查询池的当前总流动性
4. 移除200 USDC的流动性
5. 提交移除请求
6. 查询用户在池中的剩余份额
7. 查询池的总流动性
8. 检查用户账户中的代币余额变化

### 预期结果

1. 流动性移除成功
2. 用户在池中的份额减少200 USDC
3. 池的总流动性减少200 USDC
4. 用户账户中的代币余额增加200 USDC
5. 系统日志记录了移除流动性的操作信息

### 测试脚本

```move
#[test]
public fun test_remove_liquidity() {
    // 设置测试环境和初始状态
    let scenario = test_scenario::begin(@admin);
    
    // 初始化池和用户流动性
    {
        let admin = test_scenario::ctx(&mut scenario);
        let admin_coin = coin::mint_for_testing<USDC>(1000, admin);
        liquidity_pool::create_pool(b"Test Pool", admin_coin, 3000, admin);
    };
    
    test_scenario::next_tx(&mut scenario, @user);
    {
        let user = test_scenario::ctx(&mut scenario);
        let user_coin = coin::mint_for_testing<USDC>(500, user);
        liquidity_pool::add_liquidity(b"Test Pool", user_coin, user);
    };
    
    // 用户移除部分流动性
    test_scenario::next_tx(&mut scenario, @user);
    {
        let user = test_scenario::ctx(&mut scenario);
        
        // 获取移除前状态
        let initial_pool_info = liquidity_pool::get_pool_info(b"Test Pool");
        let initial_total = initial_pool_info.total_liquidity;
        let initial_user_share = liquidity_pool::get_user_share(b"Test Pool", @user);
        let initial_balance = coin::balance<USDC>(@user);
        
        // 移除流动性
        liquidity_pool::remove_liquidity(b"Test Pool", 200, user);
        
        // 验证用户份额变化
        let new_user_share = liquidity_pool::get_user_share(b"Test Pool", @user);
        assert!(new_user_share == initial_user_share - 200, 0);
        
        // 验证池总流动性变化
        let new_pool_info = liquidity_pool::get_pool_info(b"Test Pool");
        assert!(new_pool_info.total_liquidity == initial_total - 200, 1);
        
        // 验证用户余额变化
        let new_balance = coin::balance<USDC>(@user);
        assert!(new_balance == initial_balance + 200, 2);
        
        // 验证事件
        let remove_event = test_scenario::take_event<LiquidityRemovedEvent>(&mut scenario);
        assert!(remove_event.pool_name == b"Test Pool", 3);
        assert!(remove_event.provider == @user, 4);
        assert!(remove_event.amount == 200, 5);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-LP-301

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-LP-301 |
| 测试名称 | 验证暂停池功能 |
| 测试类型 | 单元测试 |
| 所属模块 | 流动性池管理 |
| 优先级 | 高 |
| 编写人员 | 张工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证管理员可以成功暂停流动性池，并且暂停后用户无法添加或移除流动性。

### 前置条件

1. 系统已初始化并正常运行
2. 流动性池"Test Pool"已创建且状态为激活
3. 管理员账户和测试用户账户已创建
4. 测试用户已向池中添加了流动性

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 管理员账户地址 | 0xADMIN... | 具有管理员权限的账户 |
| 用户账户地址 | 0x67890... | 普通用户账户 |
| 池名称 | "Test Pool" | 已存在的流动性池 |

### 测试步骤

1. 使用管理员账户登录系统
2. 暂停流动性池"Test Pool"
3. 检查池的状态
4. 使用测试用户账户尝试向池中添加新的流动性
5. 使用测试用户账户尝试从池中移除流动性
6. 检查操作是否被拒绝

### 预期结果

1. 管理员成功暂停池
2. 池状态变为"暂停"
3. 用户尝试添加流动性被拒绝，返回池状态错误
4. 用户尝试移除流动性被拒绝，返回池状态错误
5. 系统日志记录了池状态变更和操作拒绝信息

### 测试脚本

```move
#[test]
public fun test_pause_pool() {
    // 设置测试环境和初始状态
    let scenario = test_scenario::begin(@admin);
    
    // 初始化池和用户流动性
    {
        let admin = test_scenario::ctx(&mut scenario);
        let admin_coin = coin::mint_for_testing<USDC>(1000, admin);
        liquidity_pool::create_pool(b"Test Pool", admin_coin, 3000, admin);
    };
    
    test_scenario::next_tx(&mut scenario, @user);
    {
        let user = test_scenario::ctx(&mut scenario);
        let user_coin = coin::mint_for_testing<USDC>(500, user);
        liquidity_pool::add_liquidity(b"Test Pool", user_coin, user);
    };
    
    // 管理员暂停池
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        liquidity_pool::pause_pool(b"Test Pool", admin);
        
        // 验证池状态
        let pool_info = liquidity_pool::get_pool_info(b"Test Pool");
        assert!(pool_info.status == liquidity_pool::POOL_STATUS_PAUSED, 0);
        
        // 验证事件
        let pause_event = test_scenario::take_event<PoolStatusChangedEvent>(&mut scenario);
        assert!(pause_event.pool_name == b"Test Pool", 1);
        assert!(pause_event.new_status == liquidity_pool::POOL_STATUS_PAUSED, 2);
    };
    
    // 用户尝试添加流动性（应失败）
    test_scenario::next_tx(&mut scenario, @user);
    {
        let user = test_scenario::ctx(&mut scenario);
        let user_coin = coin::mint_for_testing<USDC>(200, user);
        
        // 预期此调用会失败，使用 #[expected_failure] 标注
        liquidity_pool::add_liquidity(b"Test Pool", user_coin, user);
    };
    
    // 验证错误
    test_scenario::next_tx(&mut scenario, @user);
    {
        let error_event = test_scenario::take_event<ErrorEvent>(&mut scenario);
        assert!(error_event.code == liquidity_pool::ERROR_POOL_PAUSED, 3);
    };
    
    // 用户尝试移除流动性（应失败）
    test_scenario::next_tx(&mut scenario, @user);
    {
        let user = test_scenario::ctx(&mut scenario);
        
        // 预期此调用会失败，使用 #[expected_failure] 标注
        liquidity_pool::remove_liquidity(b"Test Pool", 100, user);
    };
    
    // 验证错误
    test_scenario::next_tx(&mut scenario, @user);
    {
        let error_event = test_scenario::take_event<ErrorEvent>(&mut scenario);
        assert!(error_event.code == liquidity_pool::ERROR_POOL_PAUSED, 4);
    };
    
    test_scenario::end(scenario);
}
``` 