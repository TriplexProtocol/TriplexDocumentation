# 资金费率模块单元测试样例

## 测试用例：TC-FR-001

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-FR-001 |
| 测试名称 | 验证资金费率系统初始化 |
| 测试类型 | 单元测试 |
| 所属模块 | 资金费率 |
| 优先级 | 高 |
| 编写人员 | 王工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证资金费率系统能够正确初始化，并设置适当的初始状态和参数。

### 前置条件

1. 系统尚未初始化
2. 管理员账户已创建

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 管理员账户地址 | 0xADMIN... | 具有管理员权限的账户 |

### 测试步骤

1. 使用管理员账户初始化资金费率系统
2. 检查系统初始状态
3. 验证系统参数设置

### 预期结果

1. 资金费率系统初始化成功
2. 系统状态为"激活"
3. 默认资金费率周期设置为8小时
4. 系统表已正确创建
5. 初始化事件已正确生成

### 测试脚本

```move
#[test]
public fun test_funding_rate_system_initialize() {
    // 设置测试环境
    let scenario = test_scenario::begin(@admin);
    
    // 初始化资金费率系统
    {
        let admin = test_scenario::ctx(&mut scenario);
        funding_rate::initialize(admin);
    };
    
    // 验证初始化状态
    test_scenario::next_tx(&mut scenario, @admin);
    {
        // 验证系统已初始化
        assert!(funding_rate::is_initialized(), 0);
        
        // 验证系统状态为激活
        assert!(!funding_rate::is_paused(), 1);
        
        // 验证默认周期设置
        assert!(funding_rate::get_default_interval() == 28800, 2); // 8小时 = 28800秒
        
        // 验证初始化事件
        let init_event = test_scenario::take_event<funding_rate::SystemInitializedEvent>(&mut scenario);
        assert!(init_event.admin == @admin, 3);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-FR-101

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-FR-101 |
| 测试名称 | 验证设置资金费率周期 |
| 测试类型 | 单元测试 |
| 所属模块 | 资金费率 |
| 优先级 | 高 |
| 编写人员 | 王工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证管理员能够成功修改资金费率结算周期，并正确应用新设置。

### 前置条件

1. 资金费率系统已初始化
2. 管理员账户已创建

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 管理员账户地址 | 0xADMIN... | 具有管理员权限的账户 |
| 初始周期 | 28800 | 默认周期（8小时，秒） |
| 新周期 | 14400 | 新周期（4小时，秒） |

### 测试步骤

1. 使用管理员账户初始化资金费率系统
2. 检查默认周期设置
3. 使用管理员账户修改周期设置
4. 验证新周期设置是否生效

### 预期结果

1. 系统初始默认周期为28800秒（8小时）
2. 周期设置修改成功
3. 新周期设置为14400秒（4小时）
4. 设置更新事件已正确生成

### 测试脚本

```move
#[test]
public fun test_set_funding_rate_interval() {
    // 设置测试环境
    let scenario = test_scenario::begin(@admin);
    
    // 初始化资金费率系统
    {
        let admin = test_scenario::ctx(&mut scenario);
        funding_rate::initialize(admin);
    };
    
    // 验证默认周期
    test_scenario::next_tx(&mut scenario, @admin);
    {
        assert!(funding_rate::get_default_interval() == 28800, 0); // 默认8小时
    };
    
    // 修改周期设置
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        
        // 设置新的周期（4小时）
        funding_rate::set_default_interval(14400, admin);
    };
    
    // 验证新的周期设置
    test_scenario::next_tx(&mut scenario, @admin);
    {
        // 验证新周期生效
        assert!(funding_rate::get_default_interval() == 14400, 1);
        
        // 验证设置事件
        let interval_event = test_scenario::take_event<funding_rate::IntervalUpdatedEvent>(&mut scenario);
        assert!(interval_event.previous_interval == 28800, 2);
        assert!(interval_event.new_interval == 14400, 3);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-FR-201

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-FR-201 |
| 测试名称 | 验证资金费率计算 |
| 测试类型 | 单元测试 |
| 所属模块 | 资金费率 |
| 优先级 | 高 |
| 编写人员 | 王工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证系统能够正确计算资金费率，根据市场价格和指数价格之间的差异。

### 前置条件

1. 资金费率系统已初始化
2. 预言机系统已初始化并提供价格数据
3. 市场已创建并有活跃交易

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 市场ID | 0 | 测试市场ID |
| 市场价格 | 30500 | 当前市场价格 |
| 指数价格 | 30000 | 当前指数价格（来自预言机） |
| 价格差异 | +1.67% | 市场价格与指数价格的百分比差异 |
| 资金费率乘数 | 0.01 | 资金费率计算乘数 |

### 测试步骤

1. 设置市场价格和指数价格
2. 计算资金费率
3. 验证计算结果

### 预期结果

1. 资金费率计算成功
2. 计算结果符合预期（约为+0.0167%）
3. 计算事件已正确生成
4. 资金费率记录已正确存储

### 测试脚本

```move
#[test]
public fun test_funding_rate_calculation() {
    // 设置测试环境
    let scenario = test_scenario::begin(@admin);
    
    // 初始化系统
    {
        let admin = test_scenario::ctx(&mut scenario);
        funding_rate::initialize(admin);
    };
    
    // 设置测试数据
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        
        // 创建测试市场
        funding_rate::create_market(
            0,              // 市场ID
            b"BTC-PERP",    // 市场名称
            0.01,           // 资金费率乘数
            admin
        );
        
        // 模拟设置市场价格
        funding_rate::set_market_price(0, 30500, admin);
        
        // 模拟设置指数价格
        funding_rate::set_index_price(0, 30000, admin);
    };
    
    // 计算资金费率
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        funding_rate::calculate_funding_rate(0, admin);
    };
    
    // 验证计算结果
    test_scenario::next_tx(&mut scenario, @admin);
    {
        // 获取最新资金费率
        let rate_info = funding_rate::get_latest_funding_rate(0);
        
        // 验证资金费率计算是否正确
        // 期望值: (30500 - 30000) / 30000 * 0.01 = 0.000167
        let expected_rate = 167; // 以10^-6为单位，167表示0.000167
        
        // 允许有小的浮点误差
        let rate_diff = if (rate_info.rate > expected_rate) {
            rate_info.rate - expected_rate
        } else {
            expected_rate - rate_info.rate
        };
        
        assert!(rate_diff <= 1, 0); // 允许最多1的误差
        
        // 验证市场价格和指数价格记录
        assert!(rate_info.market_price == 30500, 1);
        assert!(rate_info.index_price == 30000, 2);
        
        // 验证计算事件
        let calc_event = test_scenario::take_event<funding_rate::FundingRateCalculatedEvent>(&mut scenario);
        assert!(calc_event.market_id == 0, 3);
        assert!(calc_event.rate == rate_info.rate, 4);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-FR-301

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-FR-301 |
| 测试名称 | 验证资金费率结算 |
| 测试类型 | 单元测试 |
| 所属模块 | 资金费率 |
| 优先级 | 高 |
| 编写人员 | 王工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证系统能够正确执行资金费率结算，在不同头寸之间转移资金。

### 前置条件

1. 资金费率系统已初始化
2. 市场已创建并计算出资金费率
3. 有多个用户持有不同方向的头寸

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 市场ID | 0 | 测试市场ID |
| 资金费率 | +0.01% | 当前资金费率（正值表示多头向空头支付） |
| 用户A头寸 | +10 BTC | 多头头寸 |
| 用户B头寸 | -8 BTC | 空头头寸 |
| 用户C头寸 | -2 BTC | 空头头寸 |
| BTC价格 | 30000 | 结算时的BTC价格 |

### 测试步骤

1. 设置用户头寸
2. 设置资金费率
3. 执行资金费率结算
4. 验证用户余额变化

### 预期结果

1. 资金费率结算成功执行
2. 用户A（多头）支付：10 * 30000 * 0.0001 = 30 USDC
3. 用户B（空头）收到：8 * 30000 * 0.0001 = 24 USDC
4. 用户C（空头）收到：2 * 30000 * 0.0001 = 6 USDC
5. 结算事件已正确生成

### 测试脚本

```move
#[test]
public fun test_funding_rate_settlement() {
    // 设置测试环境
    let scenario = test_scenario::begin(@admin);
    
    // 初始化系统和用户账户
    {
        let admin = test_scenario::ctx(&mut scenario);
        funding_rate::initialize(admin);
    };
    
    // 创建测试市场和用户头寸
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        
        // 创建测试市场
        funding_rate::create_market(0, b"BTC-PERP", 0.01, admin);
        
        // 设置BTC价格
        funding_rate::set_index_price(0, 30000, admin);
        
        // 设置资金费率（0.01%）
        funding_rate::set_funding_rate(0, 10, admin); // 10 = 0.0001 (10^-4)
    };
    
    // 设置用户头寸
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        
        // 创建测试用户头寸
        funding_rate::create_position(0, @user_a, 10, admin);  // 用户A: +10 BTC
        funding_rate::create_position(0, @user_b, -8, admin);  // 用户B: -8 BTC
        funding_rate::create_position(0, @user_c, -2, admin);  // 用户C: -2 BTC
        
        // 给用户A添加足够的余额以支付资金费用
        funding_rate::add_balance(@user_a, 100, admin);
    };
    
    // 执行资金费率结算
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        funding_rate::settle_funding_rate(0, admin);
    };
    
    // 验证结算结果
    test_scenario::next_tx(&mut scenario, @admin);
    {
        // 验证用户A（多头）余额减少
        let user_a_balance = funding_rate::get_balance(@user_a);
        assert!(user_a_balance == 70, 0);  // 100 - 30 = 70
        
        // 验证用户B（空头）余额增加
        let user_b_balance = funding_rate::get_balance(@user_b);
        assert!(user_b_balance == 24, 1);  // 0 + 24 = 24
        
        // 验证用户C（空头）余额增加
        let user_c_balance = funding_rate::get_balance(@user_c);
        assert!(user_c_balance == 6, 2);   // 0 + 6 = 6
        
        // 验证结算事件
        let settle_event = test_scenario::take_event<funding_rate::FundingRateSettledEvent>(&mut scenario);
        assert!(settle_event.market_id == 0, 3);
        assert!(settle_event.rate == 10, 4);
        assert!(settle_event.timestamp > 0, 5);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-FR-401

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-FR-401 |
| 测试名称 | 验证资金费率历史记录 |
| 测试类型 | 单元测试 |
| 所属模块 | 资金费率 |
| 优先级 | 中 |
| 编写人员 | 王工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证系统能够正确记录资金费率历史，并提供查询功能。

### 前置条件

1. 资金费率系统已初始化
2. 市场已创建

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 市场ID | 0 | 测试市场ID |
| 第一次费率 | +0.01% | 第一次记录的资金费率 |
| 第二次费率 | -0.02% | 第二次记录的资金费率 |
| 第三次费率 | +0.015% | 第三次记录的资金费率 |

### 测试步骤

1. 创建市场
2. 按顺序记录三次不同的资金费率
3. 查询历史费率记录
4. 验证记录的完整性和准确性

### 预期结果

1. 三次资金费率都被正确记录
2. 查询历史记录返回准确的结果
3. 记录按时间戳正确排序
4. 历史记录包含完整的数据（费率、时间戳等）

### 测试脚本

```move
#[test]
public fun test_funding_rate_history() {
    // 设置测试环境
    let scenario = test_scenario::begin(@admin);
    
    // 初始化系统
    {
        let admin = test_scenario::ctx(&mut scenario);
        funding_rate::initialize(admin);
    };
    
    // 创建测试市场
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        funding_rate::create_market(0, b"BTC-PERP", 0.01, admin);
    };
    
    // 记录第一次资金费率
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        
        // 设置市场和指数价格
        funding_rate::set_market_price(0, 30300, admin);
        funding_rate::set_index_price(0, 30000, admin);
        
        // 计算并记录资金费率
        funding_rate::calculate_funding_rate(0, admin);
    };
    
    // 等待一段时间
    std::thread::sleep(std::time::Duration::from_secs(1));
    
    // 记录第二次资金费率（负值）
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        
        // 设置市场和指数价格（市场价格低于指数价格）
        funding_rate::set_market_price(0, 29400, admin);
        funding_rate::set_index_price(0, 30000, admin);
        
        // 计算并记录资金费率
        funding_rate::calculate_funding_rate(0, admin);
    };
    
    // 等待一段时间
    std::thread::sleep(std::time::Duration::from_secs(1));
    
    // 记录第三次资金费率
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        
        // 设置市场和指数价格
        funding_rate::set_market_price(0, 30450, admin);
        funding_rate::set_index_price(0, 30000, admin);
        
        // 计算并记录资金费率
        funding_rate::calculate_funding_rate(0, admin);
    };
    
    // 查询和验证历史记录
    test_scenario::next_tx(&mut scenario, @user);
    {
        // 获取资金费率历史记录
        let history = funding_rate::get_funding_rate_history(0);
        
        // 验证历史记录数量
        assert!(vector::length(&history) == 3, 0);
        
        // 验证最新记录（索引2）
        let latest_record = *vector::borrow(&history, 2);
        assert!(latest_record.market_price == 30450, 1);
        assert!(latest_record.index_price == 30000, 2);
        
        // 验证第二条记录（索引1，负费率）
        let second_record = *vector::borrow(&history, 1);
        assert!(second_record.market_price == 29400, 3);
        assert!(second_record.index_price == 30000, 4);
        assert!(second_record.rate < 0, 5);  // 负费率
        
        // 验证最早记录（索引0）
        let first_record = *vector::borrow(&history, 0);
        assert!(first_record.market_price == 30300, 6);
        assert!(first_record.index_price == 30000, 7);
        
        // 验证时间戳顺序
        assert!(first_record.timestamp < second_record.timestamp, 8);
        assert!(second_record.timestamp < latest_record.timestamp, 9);
    };
    
    test_scenario::end(scenario);
} 