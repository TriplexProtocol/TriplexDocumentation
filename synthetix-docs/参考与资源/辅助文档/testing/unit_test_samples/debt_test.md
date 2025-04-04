# 债务报告系统模块单元测试样例

## 测试用例：TC-DR-001

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-DR-001 |
| 测试名称 | 验证债务报告系统初始化 |
| 测试类型 | 单元测试 |
| 所属模块 | 债务报告系统 |
| 优先级 | 高 |
| 编写人员 | 张工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证债务报告系统能够正确初始化，并设置适当的初始状态和参数。

### 前置条件

1. 系统尚未初始化
2. 管理员账户已创建

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 管理员账户地址 | 0xADMIN... | 具有管理员权限的账户 |

### 测试步骤

1. 使用管理员账户初始化债务报告系统
2. 检查系统初始状态
3. 验证系统参数设置

### 预期结果

1. 债务报告系统初始化成功
2. 系统状态为"激活"
3. 初始债务报告ID计数器为0
4. 系统表已正确创建
5. 初始化事件已正确生成

### 测试脚本

```move
#[test]
public fun test_debt_system_initialize() {
    // 设置测试环境
    let scenario = test_scenario::begin(@admin);
    
    // 初始化债务报告系统
    {
        let admin = test_scenario::ctx(&mut scenario);
        debt_system::initialize(admin);
    };
    
    // 验证初始化状态
    test_scenario::next_tx(&mut scenario, @admin);
    {
        // 验证系统已初始化
        assert!(debt_system::is_initialized(), 0);
        
        // 验证系统状态为激活
        assert!(!debt_system::is_paused(), 1);
        
        // 验证初始化事件
        let init_event = test_scenario::take_event<debt_system::SystemInitializedEvent>(&mut scenario);
        assert!(init_event.admin == @admin, 2);
        
        // 验证系统是空的
        assert!(debt_system::get_debt_report_count() == 0, 3);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-DR-101

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-DR-101 |
| 测试名称 | 验证创建新债务报告 |
| 测试类型 | 单元测试 |
| 所属模块 | 债务报告系统 |
| 优先级 | 高 |
| 编写人员 | 张工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证用户能够成功创建新的债务报告，并正确记录债务信息。

### 前置条件

1. 债务报告系统已初始化
2. 用户账户已创建
3. 系统状态为"激活"

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 用户账户地址 | 0xUSER1... | 创建债务报告的用户账户 |
| 债务类型 | 1 | 债务类型（1表示借款） |
| 资产类型 | "BTC" | 借入的资产类型 |
| 债务金额 | 10000 | 借入的金额（最小单位） |
| 抵押资产 | "ETH" | 抵押的资产类型 |
| 抵押金额 | 50000 | 抵押的金额（最小单位） |
| 利率 | 500 | 年化利率（基点，500表示5%） |
| 到期日 | 1685577600 | 债务到期时间戳 |

### 测试步骤

1. 使用用户账户创建新债务报告
2. 设置债务报告参数
3. 检查债务报告是否创建成功
4. 验证债务报告参数设置

### 预期结果

1. 债务报告创建成功
2. 返回新债务报告ID（应为0，因为是首个债务报告）
3. 债务报告状态为"活跃"
4. 债务报告参数符合设置值
5. 系统记录中的债务报告数量增加
6. 创建事件已正确生成

### 测试脚本

```move
#[test]
public fun test_create_debt_report() {
    // 设置测试环境
    let scenario = test_scenario::begin(@admin);
    
    // 初始化债务报告系统
    {
        let admin = test_scenario::ctx(&mut scenario);
        debt_system::initialize(admin);
    };
    
    // 用户创建新债务报告
    test_scenario::next_tx(&mut scenario, @user1);
    {
        let user = test_scenario::ctx(&mut scenario);
        
        // 创建债务报告
        let debt_id = debt_system::create_debt_report(
            1,                  // 债务类型（借款）
            b"BTC",            // 资产类型
            10000,             // 债务金额
            b"ETH",            // 抵押资产
            50000,             // 抵押金额
            500,               // 年化利率（5%）
            1685577600,        // 到期日
            user
        );
        
        // 验证返回的ID
        assert!(debt_id == 0, 0); // 应该是第一个债务报告，ID为0
    };
    
    // 验证债务报告创建成功
    test_scenario::next_tx(&mut scenario, @user1);
    {
        // 验证债务报告数量
        assert!(debt_system::get_debt_report_count() == 1, 1);
        
        // 验证债务报告存在
        assert!(debt_system::debt_report_exists(0), 2);
        
        // 验证债务报告信息
        let report_info = debt_system::get_debt_report(0);
        assert!(report_info.debt_type == 1, 3);
        assert!(report_info.asset_type == b"BTC", 4);
        assert!(report_info.debt_amount == 10000, 5);
        assert!(report_info.collateral_type == b"ETH", 6);
        assert!(report_info.collateral_amount == 50000, 7);
        assert!(report_info.interest_rate == 500, 8);
        assert!(report_info.maturity_date == 1685577600, 9);
        assert!(report_info.status == debt_system::DEBT_STATUS_ACTIVE, 10);
        assert!(report_info.owner == @user1, 11);
        
        // 验证创建事件
        let create_event = test_scenario::take_event<debt_system::DebtReportCreatedEvent>(&mut scenario);
        assert!(create_event.debt_id == 0, 12);
        assert!(create_event.owner == @user1, 13);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-DR-201

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-DR-201 |
| 测试名称 | 验证更新债务金额 |
| 测试类型 | 单元测试 |
| 所属模块 | 债务报告系统 |
| 优先级 | 高 |
| 编写人员 | 张工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证用户能够正确更新自己的债务报告中的债务金额（如部分还款）。

### 前置条件

1. 债务报告系统已初始化
2. 用户已创建债务报告（ID为0）
3. 债务报告状态为"活跃"

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 债务报告ID | 0 | 已创建的债务报告ID |
| 初始债务金额 | 10000 | 初始设置的债务金额 |
| 还款金额 | 3000 | 用户还款金额 |
| 更新后债务金额 | 7000 | 更新后的债务金额 |
| 用户账户 | 0xUSER1... | 债务报告所有者账户 |

### 测试步骤

1. 创建初始债务报告
2. 用户更新债务金额（减少3000，模拟部分还款）
3. 检查债务报告是否更新成功
4. 验证债务金额更新

### 预期结果

1. 债务金额更新成功
2. 债务报告中的债务金额减少至7000
3. 债务报告其他参数保持不变
4. 更新事件已正确生成

### 测试脚本

```move
#[test]
public fun test_update_debt_amount() {
    // 设置测试环境和初始债务报告
    let scenario = test_scenario::begin(@admin);
    
    // 初始化债务报告系统
    {
        let admin = test_scenario::ctx(&mut scenario);
        debt_system::initialize(admin);
    };
    
    // 用户创建初始债务报告
    test_scenario::next_tx(&mut scenario, @user1);
    {
        let user = test_scenario::ctx(&mut scenario);
        debt_system::create_debt_report(
            1, b"BTC", 10000, b"ETH", 50000, 500, 1685577600, user
        );
    };
    
    // 更新债务金额（部分还款）
    test_scenario::next_tx(&mut scenario, @user1);
    {
        let user = test_scenario::ctx(&mut scenario);
        
        // 更新债务金额（还款3000）
        debt_system::update_debt_amount(
            0,       // 债务报告ID
            7000,    // 新的债务金额
            user
        );
    };
    
    // 验证债务金额更新
    test_scenario::next_tx(&mut scenario, @user1);
    {
        // 验证债务报告信息
        let report_info = debt_system::get_debt_report(0);
        assert!(report_info.debt_amount == 7000, 0);   // 债务金额已更新
        assert!(report_info.asset_type == b"BTC", 1);  // 其他字段不变
        assert!(report_info.collateral_amount == 50000, 2);
        
        // 验证更新事件
        let update_event = test_scenario::take_event<debt_system::DebtAmountUpdatedEvent>(&mut scenario);
        assert!(update_event.debt_id == 0, 3);
        assert!(update_event.previous_amount == 10000, 4);
        assert!(update_event.new_amount == 7000, 5);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-DR-301

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-DR-301 |
| 测试名称 | 验证更新抵押品金额 |
| 测试类型 | 单元测试 |
| 所属模块 | 债务报告系统 |
| 优先级 | 高 |
| 编写人员 | 张工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证用户能够正确更新自己的债务报告中的抵押品金额（增加或减少抵押品）。

### 前置条件

1. 债务报告系统已初始化
2. 用户已创建债务报告（ID为0）
3. 债务报告状态为"活跃"

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 债务报告ID | 0 | 已创建的债务报告ID |
| 初始抵押品金额 | 50000 | 初始设置的抵押品金额 |
| 抵押品增加金额 | 20000 | 用户增加的抵押品金额 |
| 更新后抵押品金额 | 70000 | 更新后的抵押品总金额 |
| 用户账户 | 0xUSER1... | 债务报告所有者账户 |

### 测试步骤

1. 创建初始债务报告
2. 用户更新抵押品金额（增加20000）
3. 检查债务报告是否更新成功
4. 验证抵押品金额更新

### 预期结果

1. 抵押品金额更新成功
2. 债务报告中的抵押品金额增加至70000
3. 债务报告其他参数保持不变
4. 更新事件已正确生成

### 测试脚本

```move
#[test]
public fun test_update_collateral_amount() {
    // 设置测试环境和初始债务报告
    let scenario = test_scenario::begin(@admin);
    
    // 初始化债务报告系统
    {
        let admin = test_scenario::ctx(&mut scenario);
        debt_system::initialize(admin);
    };
    
    // 用户创建初始债务报告
    test_scenario::next_tx(&mut scenario, @user1);
    {
        let user = test_scenario::ctx(&mut scenario);
        debt_system::create_debt_report(
            1, b"BTC", 10000, b"ETH", 50000, 500, 1685577600, user
        );
    };
    
    // 更新抵押品金额（增加抵押品）
    test_scenario::next_tx(&mut scenario, @user1);
    {
        let user = test_scenario::ctx(&mut scenario);
        
        // 更新抵押品金额（增加20000）
        debt_system::update_collateral_amount(
            0,       // 债务报告ID
            70000,   // 新的抵押品金额
            user
        );
    };
    
    // 验证抵押品金额更新
    test_scenario::next_tx(&mut scenario, @user1);
    {
        // 验证债务报告信息
        let report_info = debt_system::get_debt_report(0);
        assert!(report_info.collateral_amount == 70000, 0);   // 抵押品金额已更新
        assert!(report_info.debt_amount == 10000, 1);         // 其他字段不变
        assert!(report_info.interest_rate == 500, 2);
        
        // 验证更新事件
        let update_event = test_scenario::take_event<debt_system::CollateralAmountUpdatedEvent>(&mut scenario);
        assert!(update_event.debt_id == 0, 3);
        assert!(update_event.previous_amount == 50000, 4);
        assert!(update_event.new_amount == 70000, 5);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-DR-401

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-DR-401 |
| 测试名称 | 验证关闭债务报告 |
| 测试类型 | 单元测试 |
| 所属模块 | 债务报告系统 |
| 优先级 | 高 |
| 编写人员 | 张工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证用户能够正确关闭（全额偿还）自己的债务报告，并更新状态为"已关闭"。

### 前置条件

1. 债务报告系统已初始化
2. 用户已创建债务报告（ID为0）
3. 债务报告状态为"活跃"

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 债务报告ID | 0 | 已创建的债务报告ID |
| 关闭原因 | 1 | 关闭原因代码（1表示全额偿还） |
| 用户账户 | 0xUSER1... | 债务报告所有者账户 |

### 测试步骤

1. 创建初始债务报告
2. 用户关闭债务报告
3. 检查债务报告状态是否更新
4. 验证关闭操作是否成功记录

### 预期结果

1. 债务报告关闭成功
2. 债务报告状态更改为"已关闭"
3. 关闭原因和关闭时间被正确记录
4. 关闭事件已正确生成

### 测试脚本

```move
#[test]
public fun test_close_debt_report() {
    // 设置测试环境和初始债务报告
    let scenario = test_scenario::begin(@admin);
    
    // 初始化债务报告系统
    {
        let admin = test_scenario::ctx(&mut scenario);
        debt_system::initialize(admin);
    };
    
    // 用户创建初始债务报告
    test_scenario::next_tx(&mut scenario, @user1);
    {
        let user = test_scenario::ctx(&mut scenario);
        debt_system::create_debt_report(
            1, b"BTC", 10000, b"ETH", 50000, 500, 1685577600, user
        );
    };
    
    // 关闭债务报告
    test_scenario::next_tx(&mut scenario, @user1);
    {
        let user = test_scenario::ctx(&mut scenario);
        
        // 关闭债务报告（全额偿还）
        debt_system::close_debt_report(
            0,    // 债务报告ID
            1,    // 关闭原因（全额偿还）
            user
        );
    };
    
    // 验证债务报告关闭
    test_scenario::next_tx(&mut scenario, @user1);
    {
        // 验证债务报告信息
        let report_info = debt_system::get_debt_report(0);
        assert!(report_info.status == debt_system::DEBT_STATUS_CLOSED, 0);   // 状态已更新为关闭
        assert!(report_info.close_reason == 1, 1);                          // 关闭原因记录
        
        // 验证关闭时间合理
        let current_time = test_scenario::ctx(&scenario).tx_context.epoch;
        assert!(report_info.close_time <= current_time, 2);
        assert!(report_info.close_time > 0, 3);
        
        // 验证关闭事件
        let close_event = test_scenario::take_event<debt_system::DebtReportClosedEvent>(&mut scenario);
        assert!(close_event.debt_id == 0, 4);
        assert!(close_event.reason == 1, 5);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-DR-501

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-DR-501 |
| 测试名称 | 验证非所有者操作权限控制 |
| 测试类型 | 单元测试 |
| 所属模块 | 债务报告系统 |
| 优先级 | 高 |
| 编写人员 | 张工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证系统能够正确实施权限控制，只允许债务报告的所有者或管理员执行特定操作。

### 前置条件

1. 债务报告系统已初始化
2. 用户1已创建债务报告（ID为0）
3. 用户2未持有任何债务报告的所有权

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 债务报告ID | 0 | 用户1创建的债务报告ID |
| 用户1账户 | 0xUSER1... | 债务报告所有者账户 |
| 用户2账户 | 0xUSER2... | 非所有者账户 |

### 测试步骤

1. 用户1创建债务报告
2. 用户2尝试更新用户1的债务报告
3. 检查更新操作是否被拒绝
4. 验证债务报告保持不变

### 预期结果

1. 用户2的更新操作被拒绝
2. 系统返回权限错误
3. 债务报告状态保持不变
4. 系统日志记录了未授权操作尝试

### 测试脚本

```move
#[test]
#[expected_failure(abort_code = debt_system::ERROR_NOT_AUTHORIZED)]
public fun test_authorization_control() {
    // 设置测试环境和初始债务报告
    let scenario = test_scenario::begin(@admin);
    
    // 初始化债务报告系统
    {
        let admin = test_scenario::ctx(&mut scenario);
        debt_system::initialize(admin);
    };
    
    // 用户1创建债务报告
    test_scenario::next_tx(&mut scenario, @user1);
    {
        let user1 = test_scenario::ctx(&mut scenario);
        debt_system::create_debt_report(
            1, b"BTC", 10000, b"ETH", 50000, 500, 1685577600, user1
        );
    };
    
    // 用户2尝试更新用户1的债务报告（应失败）
    test_scenario::next_tx(&mut scenario, @user2);
    {
        let user2 = test_scenario::ctx(&mut scenario);
        
        // 尝试更新债务金额（应引发权限错误）
        debt_system::update_debt_amount(0, 8000, user2);
    };
    
    test_scenario::end(scenario);
}
``` 