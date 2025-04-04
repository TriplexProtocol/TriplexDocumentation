# 清算机制模块单元测试样例

## 测试用例：TC-LQ-001

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-LQ-001 |
| 测试名称 | 验证清算系统初始化 |
| 测试类型 | 单元测试 |
| 所属模块 | 清算机制 |
| 优先级 | 高 |
| 编写人员 | 赵工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证清算系统能够正确初始化，并设置适当的初始状态和参数。

### 前置条件

1. 系统尚未初始化
2. 管理员账户已创建

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 管理员账户地址 | 0xADMIN... | 具有管理员权限的账户 |

### 测试步骤

1. 使用管理员账户初始化清算系统
2. 检查系统初始状态
3. 验证系统参数设置

### 预期结果

1. 清算系统初始化成功
2. 系统状态为"激活"
3. 默认清算阈值设置正确
4. 清算奖励率设置正确
5. 系统表已正确创建
6. 初始化事件已正确生成

### 测试脚本

```move
#[test]
public fun test_liquidation_system_initialize() {
    // 设置测试环境
    let scenario = test_scenario::begin(@admin);
    
    // 初始化清算系统
    {
        let admin = test_scenario::ctx(&mut scenario);
        liquidation::initialize(admin);
    };
    
    // 验证初始化状态
    test_scenario::next_tx(&mut scenario, @admin);
    {
        // 验证系统已初始化
        assert!(liquidation::is_initialized(), 0);
        
        // 验证系统状态为激活
        assert!(!liquidation::is_paused(), 1);
        
        // 验证默认清算阈值（120%）
        assert!(liquidation::get_default_threshold() == 12000, 2); // 12000表示120.00%
        
        // 验证默认清算奖励率（5%）
        assert!(liquidation::get_default_reward_rate() == 500, 3); // 500表示5.00%
        
        // 验证初始化事件
        let init_event = test_scenario::take_event<liquidation::SystemInitializedEvent>(&mut scenario);
        assert!(init_event.admin == @admin, 4);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-LQ-101

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-LQ-101 |
| 测试名称 | 验证清算阈值设置 |
| 测试类型 | 单元测试 |
| 所属模块 | 清算机制 |
| 优先级 | 高 |
| 编写人员 | 赵工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证管理员能够成功修改清算阈值，并正确应用新设置。

### 前置条件

1. 清算系统已初始化
2. 管理员账户已创建

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 管理员账户地址 | 0xADMIN... | 具有管理员权限的账户 |
| 初始清算阈值 | 12000 | 默认阈值（120.00%） |
| 新清算阈值 | 11000 | 新阈值（110.00%） |

### 测试步骤

1. 使用管理员账户初始化清算系统
2. 检查默认清算阈值设置
3. 使用管理员账户修改清算阈值
4. 验证新阈值设置是否生效

### 预期结果

1. 系统初始默认阈值为12000（120.00%）
2. 阈值设置修改成功
3. 新阈值设置为11000（110.00%）
4. 设置更新事件已正确生成

### 测试脚本

```move
#[test]
public fun test_set_liquidation_threshold() {
    // 设置测试环境
    let scenario = test_scenario::begin(@admin);
    
    // 初始化清算系统
    {
        let admin = test_scenario::ctx(&mut scenario);
        liquidation::initialize(admin);
    };
    
    // 验证默认阈值
    test_scenario::next_tx(&mut scenario, @admin);
    {
        assert!(liquidation::get_default_threshold() == 12000, 0); // 默认120.00%
    };
    
    // 修改阈值设置
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        
        // 设置新的阈值（110.00%）
        liquidation::set_default_threshold(11000, admin);
    };
    
    // 验证新的阈值设置
    test_scenario::next_tx(&mut scenario, @admin);
    {
        // 验证新阈值生效
        assert!(liquidation::get_default_threshold() == 11000, 1);
        
        // 验证设置事件
        let threshold_event = test_scenario::take_event<liquidation::ThresholdUpdatedEvent>(&mut scenario);
        assert!(threshold_event.previous_threshold == 12000, 2);
        assert!(threshold_event.new_threshold == 11000, 3);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-LQ-201

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-LQ-201 |
| 测试名称 | 验证触发清算条件 |
| 测试类型 | 单元测试 |
| 所属模块 | 清算机制 |
| 优先级 | 高 |
| 编写人员 | 赵工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证系统能够正确判断账户是否满足清算条件，基于当前抵押率。

### 前置条件

1. 清算系统已初始化
2. 债务账户已创建并设置清算阈值
3. 预言机系统已初始化并提供价格数据

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 用户账户地址 | 0xUSER1... | 待检查清算条件的账户 |
| 清算阈值 | 11000 | 清算阈值（110.00%） |
| 债务金额 | 10000 USDC | 用户借入的资产 |
| 抵押品 | 1 ETH | 用户抵押的资产 |
| ETH价格（安全） | 12000 USDC | ETH价格足够覆盖债务和安全阈值 |
| ETH价格（不安全） | 10500 USDC | ETH价格低于安全阈值 |

### 测试步骤

1. 创建用户账户和债务报告
2. 设置清算阈值
3. 设置ETH价格为安全价格
4. 检查账户是否可清算
5. 设置ETH价格为不安全价格
6. 再次检查账户是否可清算

### 预期结果

1. ETH价格为12000时，抵押率为120%，高于清算阈值
2. 账户不应被标记为可清算
3. ETH价格降至10500时，抵押率约为105%，低于清算阈值
4. 账户应被标记为可清算
5. 检查状态变更事件已正确生成

### 测试脚本

```move
#[test]
public fun test_liquidation_condition() {
    // 设置测试环境
    let scenario = test_scenario::begin(@admin);
    
    // 初始化清算系统
    {
        let admin = test_scenario::ctx(&mut scenario);
        liquidation::initialize(admin);
        
        // 初始化预言机系统（简化版）
        oracle::initialize(admin);
    };
    
    // 设置清算阈值
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        liquidation::set_default_threshold(11000, admin); // 110.00%
        
        // 注册ETH/USDC预言机
        oracle::register_oracle(b"ETH/USDC", 1, 300, 80, 5, true, admin);
    };
    
    // 创建用户债务报告
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        
        // 创建债务报告（模拟）
        liquidation::create_debt_position(
            @user1,        // 用户
            b"USDC",       // 债务资产
            10000,         // 债务金额
            b"ETH",        // 抵押资产
            1,             // 抵押数量
            admin
        );
    };
    
    // 设置安全价格并检查清算条件
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        
        // 设置ETH价格为12000（安全价格）
        oracle::update_asset_price(0, b"ETH/USDC", 12000, 90, b"test", admin);
        
        // 检查账户是否可清算
        let is_liquidatable = liquidation::check_liquidation_condition(@user1);
        assert!(!is_liquidatable, 0); // 不应该可清算
    };
    
    // 设置不安全价格并检查清算条件
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        
        // 设置ETH价格为10500（不安全价格）
        oracle::update_asset_price(0, b"ETH/USDC", 10500, 90, b"test", admin);
        
        // 检查账户是否可清算
        let is_liquidatable = liquidation::check_liquidation_condition(@user1);
        assert!(is_liquidatable, 1); // 应该可清算
        
        // 验证状态变更事件
        let status_event = test_scenario::take_event<liquidation::AccountStatusChangedEvent>(&mut scenario);
        assert!(status_event.account == @user1, 2);
        assert!(status_event.is_liquidatable == true, 3);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-LQ-301

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-LQ-301 |
| 测试名称 | 验证清算执行过程 |
| 测试类型 | 单元测试 |
| 所属模块 | 清算机制 |
| 优先级 | 高 |
| 编写人员 | 赵工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证系统能够正确执行清算过程，清算用户的债务并分配抵押品。

### 前置条件

1. 清算系统已初始化
2. 账户状态为可清算
3. 清算人账户已创建

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 债务用户账户 | 0xUSER1... | 被清算的账户 |
| 清算人账户 | 0xLIQUIDATOR... | 执行清算的账户 |
| 债务金额 | 10000 USDC | 用户借入的资产 |
| 抵押品 | 1 ETH | 用户抵押的资产 |
| ETH价格 | 10500 USDC | 清算时的ETH价格 |
| 清算阈值 | 11000 | 清算阈值（110.00%） |
| 清算奖励率 | 500 | 清算奖励率（5.00%） |

### 测试步骤

1. 设置账户为可清算状态
2. 清算人发起清算
3. 执行清算过程
4. 验证债务账户状态
5. 验证清算人获得的抵押品

### 预期结果

1. 清算过程成功执行
2. 债务减少10000 USDC
3. 清算人支付10000 USDC
4. 清算人获得相应价值的ETH加上奖励
5. 计算方式：10000 / 10500 = 0.9524 ETH（基础获得）
6. 加上5%奖励：0.9524 * 1.05 = 1.0 ETH（全部抵押品）
7. 债务账户状态更新为已清算
8. 清算事件已正确生成

### 测试脚本

```move
#[test]
public fun test_liquidation_execution() {
    // 设置测试环境
    let scenario = test_scenario::begin(@admin);
    
    // 初始化系统
    {
        let admin = test_scenario::ctx(&mut scenario);
        liquidation::initialize(admin);
        oracle::initialize(admin);
    };
    
    // 设置参数和创建债务
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        
        // 设置清算参数
        liquidation::set_default_threshold(11000, admin); // 110.00%
        liquidation::set_default_reward_rate(500, admin); // 5.00%
        
        // 注册ETH/USDC预言机并设置价格
        oracle::register_oracle(b"ETH/USDC", 1, 300, 80, 5, true, admin);
        oracle::update_asset_price(0, b"ETH/USDC", 10500, 90, b"test", admin);
        
        // 创建债务报告
        liquidation::create_debt_position(
            @user1,        // 用户
            b"USDC",       // 债务资产
            10000,         // 债务金额
            b"ETH",        // 抵押资产
            1,             // 抵押数量
            admin
        );
    };
    
    // 将账户标记为可清算
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        liquidation::mark_account_liquidatable(@user1, admin);
    };
    
    // 给清算人账户添加USDC余额
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        
        // 模拟给清算人添加USDC余额
        liquidation::add_liquidator_balance(@liquidator, b"USDC", 10000, admin);
    };
    
    // 执行清算
    test_scenario::next_tx(&mut scenario, @liquidator);
    {
        let liquidator = test_scenario::ctx(&mut scenario);
        
        // 清算人清算债务账户
        liquidation::liquidate_account(@user1, @liquidator, liquidator);
    };
    
    // 验证清算结果
    test_scenario::next_tx(&mut scenario, @admin);
    {
        // 验证债务账户状态
        let debt_info = liquidation::get_debt_position(@user1);
        assert!(debt_info.debt_amount == 0, 0);            // 债务已清零
        assert!(debt_info.collateral_amount == 0, 1);      // 抵押品已转移
        assert!(debt_info.status == liquidation::STATUS_LIQUIDATED, 2); // 状态为已清算
        
        // 验证清算人获得的抵押品
        let liquidator_eth = liquidation::get_collateral_balance(@liquidator, b"ETH");
        assert!(liquidator_eth == 1, 3);                  // 应获得全部抵押品
        
        // 验证清算人支付的USDC
        let liquidator_usdc = liquidation::get_collateral_balance(@liquidator, b"USDC");
        assert!(liquidator_usdc == 0, 4);                 // 应支付全部USDC
        
        // 验证清算事件
        let liquidation_event = test_scenario::take_event<liquidation::AccountLiquidatedEvent>(&mut scenario);
        assert!(liquidation_event.debtor == @user1, 5);
        assert!(liquidation_event.liquidator == @liquidator, 6);
        assert!(liquidation_event.debt_asset == b"USDC", 7);
        assert!(liquidation_event.debt_amount == 10000, 8);
        assert!(liquidation_event.collateral_asset == b"ETH", 9);
        assert!(liquidation_event.collateral_amount == 1, 10);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-LQ-401

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-LQ-401 |
| 测试名称 | 验证清算奖励分配 |
| 测试类型 | 单元测试 |
| 所属模块 | 清算机制 |
| 优先级 | 中 |
| 编写人员 | 赵工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证系统能够正确计算和分配清算奖励，在不同的债务比例和奖励率下。

### 前置条件

1. 清算系统已初始化
2. 账户状态为可清算

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 债务用户账户 | 0xUSER1... | 被清算的账户 |
| 清算人账户 | 0xLIQUIDATOR... | 执行清算的账户 |
| 债务金额 | 10000 USDC | 用户借入的资产 |
| 抵押品 | 2 ETH | 用户抵押的资产 |
| ETH价格 | 10000 USDC | 清算时的ETH价格 |
| 清算阈值 | 12000 | 清算阈值（120.00%） |
| 清算奖励率 | 800 | 清算奖励率（8.00%） |
| 部分清算比例 | 50% | 清算的债务比例 |

### 测试步骤

1. 设置债务、抵押品和价格
2. 设置清算奖励率
3. 执行部分清算
4. 验证债务减少和抵押品转移
5. 验证奖励计算

### 预期结果

1. 部分清算成功执行
2. 债务减少50%：5000 USDC
3. 清算人支付5000 USDC
4. 基础抵押品转移计算：5000 / 10000 = 0.5 ETH
5. 加上8%奖励：0.5 * 1.08 = 0.54 ETH
6. 债务账户剩余债务5000 USDC和1.46 ETH抵押品
7. 奖励分配事件已正确生成

### 测试脚本

```move
#[test]
public fun test_liquidation_reward() {
    // 设置测试环境
    let scenario = test_scenario::begin(@admin);
    
    // 初始化系统
    {
        let admin = test_scenario::ctx(&mut scenario);
        liquidation::initialize(admin);
        oracle::initialize(admin);
    };
    
    // 设置参数和创建债务
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        
        // 设置清算参数
        liquidation::set_default_threshold(12000, admin); // 120.00%
        liquidation::set_default_reward_rate(800, admin); // 8.00%
        
        // 注册ETH/USDC预言机并设置价格
        oracle::register_oracle(b"ETH/USDC", 1, 300, 80, 5, true, admin);
        oracle::update_asset_price(0, b"ETH/USDC", 10000, 90, b"test", admin);
        
        // 创建债务报告（2 ETH = 20000 USDC，高于债务，但ETH价格下跌可能触发清算）
        liquidation::create_debt_position(
            @user1,        // 用户
            b"USDC",       // 债务资产
            10000,         // 债务金额
            b"ETH",        // 抵押资产
            2,             // 抵押数量
            admin
        );
    };
    
    // 将账户标记为可清算
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        liquidation::mark_account_liquidatable(@user1, admin);
    };
    
    // 给清算人账户添加USDC余额
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        liquidation::add_liquidator_balance(@liquidator, b"USDC", 10000, admin);
    };
    
    // 执行部分清算（50%）
    test_scenario::next_tx(&mut scenario, @liquidator);
    {
        let liquidator = test_scenario::ctx(&mut scenario);
        
        // 清算人部分清算债务账户
        liquidation::liquidate_account_partially(
            @user1,
            @liquidator,
            5000,   // 清算50%债务
            liquidator
        );
    };
    
    // 验证清算结果和奖励
    test_scenario::next_tx(&mut scenario, @admin);
    {
        // 验证债务账户状态
        let debt_info = liquidation::get_debt_position(@user1);
        assert!(debt_info.debt_amount == 5000, 0);        // 剩余50%债务
        
        // 使用精度容差验证抵押品数量（避免浮点误差）
        let remaining_eth = debt_info.collateral_amount;
        let expected_eth = 1460000; // 1.46 ETH，精度为10^-6
        
        let diff = if (remaining_eth > expected_eth) {
            remaining_eth - expected_eth
        } else {
            expected_eth - remaining_eth
        };
        
        assert!(diff <= 100, 1); // 允许0.0001的误差
        
        // 验证清算人获得的抵押品
        let liquidator_eth = liquidation::get_collateral_balance(@liquidator, b"ETH");
        let expected_liquidator_eth = 540000; // 0.54 ETH，精度为10^-6
        
        let liquidator_diff = if (liquidator_eth > expected_liquidator_eth) {
            liquidator_eth - expected_liquidator_eth
        } else {
            expected_liquidator_eth - liquidator_eth
        };
        
        assert!(liquidator_diff <= 100, 2); // 允许0.0001的误差
        
        // 验证清算人支付的USDC
        let liquidator_usdc = liquidation::get_collateral_balance(@liquidator, b"USDC");
        assert!(liquidator_usdc == 5000, 3);              // 应剩余5000 USDC
        
        // 验证清算事件
        let liquidation_event = test_scenario::take_event<liquidation::PartialLiquidationEvent>(&mut scenario);
        assert!(liquidation_event.debtor == @user1, 4);
        assert!(liquidation_event.liquidator == @liquidator, 5);
        assert!(liquidation_event.debt_amount == 5000, 6);
        assert!(liquidation_event.collateral_amount == liquidator_eth, 7);
        assert!(liquidation_event.reward_amount > 0, 8);   // 奖励应大于0
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-LQ-501

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-LQ-501 |
| 测试名称 | 验证紧急清算功能 |
| 测试类型 | 单元测试 |
| 所属模块 | 清算机制 |
| 优先级 | 高 |
| 编写人员 | 赵工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证系统在紧急情况下能够由管理员直接强制清算账户，无需满足标准清算条件。

### 前置条件

1. 清算系统已初始化
2. 债务账户已创建但尚未满足清算条件
3. 管理员账户具有紧急清算权限

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 债务用户账户 | 0xUSER1... | 被清算的账户 |
| 管理员账户 | 0xADMIN... | 执行紧急清算的账户 |
| 债务金额 | 10000 USDC | 用户借入的资产 |
| 抵押品 | 1.5 ETH | 用户抵押的资产 |
| ETH价格 | 12000 USDC | ETH价格（正常情况下不应触发清算） |

### 测试步骤

1. 创建债务账户（抵押率为180%，正常情况下安全）
2. 验证账户不满足正常清算条件
3. 管理员执行紧急清算
4. 验证清算结果

### 预期结果

1. 正常检查显示账户不可清算（抵押率180% > 清算阈值120%）
2. 管理员紧急清算成功执行
3. 债务账户状态更新为已清算
4. 债务和抵押品已转移至系统应急基金
5. 紧急清算事件已正确生成，包含清算原因

### 测试脚本

```move
#[test]
public fun test_emergency_liquidation() {
    // 设置测试环境
    let scenario = test_scenario::begin(@admin);
    
    // 初始化系统
    {
        let admin = test_scenario::ctx(&mut scenario);
        liquidation::initialize(admin);
        oracle::initialize(admin);
    };
    
    // 设置参数和创建债务
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        
        // 设置清算参数
        liquidation::set_default_threshold(12000, admin); // 120.00%
        
        // 注册ETH/USDC预言机并设置价格
        oracle::register_oracle(b"ETH/USDC", 1, 300, 80, 5, true, admin);
        oracle::update_asset_price(0, b"ETH/USDC", 12000, 90, b"test", admin);
        
        // 创建债务报告（1.5 ETH = 18000 USDC，抵押率为180%）
        liquidation::create_debt_position(
            @user1,        // 用户
            b"USDC",       // 债务资产
            10000,         // 债务金额
            b"ETH",        // 抵押资产
            1.5,           // 抵押数量
            admin
        );
    };
    
    // 验证账户不满足正常清算条件
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let is_liquidatable = liquidation::check_liquidation_condition(@user1);
        assert!(!is_liquidatable, 0); // 不应该可清算
        
        // 获取抵押率
        let collateral_ratio = liquidation::get_collateral_ratio(@user1);
        assert!(collateral_ratio == 18000, 1); // 180.00%
    };
    
    // 执行紧急清算
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        
        // 管理员执行紧急清算
        liquidation::emergency_liquidate(
            @user1,
            b"Market manipulation suspicion",  // 清算原因
            admin
        );
    };
    
    // 验证紧急清算结果
    test_scenario::next_tx(&mut scenario, @admin);
    {
        // 验证债务账户状态
        let debt_info = liquidation::get_debt_position(@user1);
        assert!(debt_info.debt_amount == 0, 2);            // 债务已清零
        assert!(debt_info.collateral_amount == 0, 3);      // 抵押品已转移
        assert!(debt_info.status == liquidation::STATUS_EMERGENCY_LIQUIDATED, 4); // 状态为紧急清算
        
        // 验证应急基金状态
        let emergency_fund = liquidation::get_emergency_fund();
        assert!(emergency_fund.usdc_balance >= 10000, 5);  // 基金接收了债务金额
        assert!(emergency_fund.eth_balance >= 1.5, 6);     // 基金接收了抵押品
        
        // 验证紧急清算事件
        let emergency_event = test_scenario::take_event<liquidation::EmergencyLiquidationEvent>(&mut scenario);
        assert!(emergency_event.account == @user1, 7);
        assert!(emergency_event.reason == b"Market manipulation suspicion", 8);
        assert!(emergency_event.debt_asset == b"USDC", 9);
        assert!(emergency_event.debt_amount == 10000, 10);
        assert!(emergency_event.collateral_asset == b"ETH", 11);
        assert!(emergency_event.collateral_amount == 1.5, 12);
    };
    
    test_scenario::end(scenario);
}
``` 