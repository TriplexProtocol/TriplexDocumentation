# 预言机集成模块单元测试样例

## 测试用例：TC-OC-001

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-OC-001 |
| 测试名称 | 验证预言机系统初始化 |
| 测试类型 | 单元测试 |
| 所属模块 | 预言机集成 |
| 优先级 | 高 |
| 编写人员 | 李工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证预言机系统能够正确初始化，并设置适当的初始状态和参数。

### 前置条件

1. 系统尚未初始化
2. 管理员账户已创建

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 管理员账户地址 | 0xADMIN... | 具有管理员权限的账户 |

### 测试步骤

1. 使用管理员账户初始化预言机系统
2. 检查系统初始状态
3. 验证系统参数设置

### 预期结果

1. 预言机系统初始化成功
2. 系统状态为"激活"
3. 初始Oracle ID计数器为0
4. 系统表已正确创建
5. 初始化事件已正确生成

### 测试脚本

```move
#[test]
public fun test_oracle_system_initialize() {
    // 设置测试环境
    let scenario = test_scenario::begin(@admin);
    
    // 初始化预言机系统
    {
        let admin = test_scenario::ctx(&mut scenario);
        oracle::initialize(admin);
    };
    
    // 验证初始化状态
    test_scenario::next_tx(&mut scenario, @admin);
    {
        // 验证系统已初始化
        assert!(oracle::is_initialized(), 0);
        
        // 验证系统状态为激活
        assert!(!oracle::is_paused(), 1);
        
        // 验证初始化事件
        let init_event = test_scenario::take_event<oracle::SystemInitializedEvent>(&mut scenario);
        assert!(init_event.admin == @admin, 2);
        
        // 验证系统是空的
        assert!(oracle::get_oracle_count() == 0, 3);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-OC-101

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-OC-101 |
| 测试名称 | 验证注册新预言机 |
| 测试类型 | 单元测试 |
| 所属模块 | 预言机集成 |
| 优先级 | 高 |
| 编写人员 | 李工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证管理员能够成功注册新的预言机，并正确设置预言机参数。

### 前置条件

1. 预言机系统已初始化
2. 管理员账户已创建
3. 系统状态为"激活"

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 管理员账户地址 | 0xADMIN... | 具有管理员权限的账户 |
| 预言机名称 | "Chainlink BTC/USD" | 预言机名称 |
| 预言机类型 | 1 | 预言机类型（1表示外部预言机） |
| 最大价格年龄 | 300 | 价格有效期（秒） |
| 最小信任度 | 80 | 最小可信度百分比 |
| 最大价格偏差 | 5 | 最大允许价格偏差百分比 |

### 测试步骤

1. 使用管理员账户注册新预言机
2. 设置预言机参数
3. 检查预言机是否注册成功
4. 验证预言机参数设置

### 预期结果

1. 预言机注册成功
2. 返回新预言机ID（应为0，因为是首个预言机）
3. 预言机状态为"激活"
4. 预言机参数符合设置值
5. 系统记录中的预言机数量增加
6. 注册事件已正确生成

### 测试脚本

```move
#[test]
public fun test_register_oracle() {
    // 设置测试环境
    let scenario = test_scenario::begin(@admin);
    
    // 初始化预言机系统
    {
        let admin = test_scenario::ctx(&mut scenario);
        oracle::initialize(admin);
    };
    
    // 注册新预言机
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        
        // 注册预言机
        let oracle_id = oracle::register_oracle(
            b"Chainlink BTC/USD",   // 名称
            1,                     // 类型（外部预言机）
            300,                   // 最大价格年龄（秒）
            80,                    // 最小信任度
            5,                     // 最大价格偏差
            true,                  // 是否优先
            admin
        );
        
        // 验证返回的ID
        assert!(oracle_id == 0, 0); // 应该是第一个预言机，ID为0
    };
    
    // 验证预言机注册成功
    test_scenario::next_tx(&mut scenario, @admin);
    {
        // 验证预言机数量
        assert!(oracle::get_oracle_count() == 1, 1);
        
        // 验证预言机存在
        assert!(oracle::oracle_exists(0), 2);
        
        // 验证预言机信息
        let oracle_info = oracle::get_oracle_info(0);
        assert!(oracle_info.name == b"Chainlink BTC/USD", 3);
        assert!(oracle_info.oracle_type == 1, 4);
        assert!(oracle_info.status == oracle::ORACLE_STATUS_ACTIVE, 5);
        assert!(oracle_info.max_price_age == 300, 6);
        assert!(oracle_info.min_confidence == 80, 7);
        assert!(oracle_info.max_price_deviation == 5, 8);
        assert!(oracle_info.is_priority == true, 9);
        
        // 验证注册事件
        let register_event = test_scenario::take_event<oracle::OracleRegisteredEvent>(&mut scenario);
        assert!(register_event.oracle_id == 0, 10);
        assert!(register_event.admin == @admin, 11);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-OC-201

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-OC-201 |
| 测试名称 | 验证更新资产价格 |
| 测试类型 | 单元测试 |
| 所属模块 | 预言机集成 |
| 优先级 | 高 |
| 编写人员 | 李工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证预言机能够正确更新资产价格，并满足所有价格安全检查。

### 前置条件

1. 预言机系统已初始化
2. ID为0的预言机已注册并处于激活状态
3. 预言机管理员账户已创建

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 预言机ID | 0 | 已注册的预言机ID |
| 资产符号 | "BTC/USD" | 更新价格的资产符号 |
| 资产价格 | 30000 | 资产当前价格（以最小单位计） |
| 信任度 | 90 | 价格的信任度百分比 |
| 预言机管理员 | 0xORACLE_ADMIN... | 预言机管理员账户 |

### 测试步骤

1. 使用预言机管理员账户更新资产价格
2. 设置价格、信任度和来源信息
3. 检查价格是否更新成功
4. 再次更新价格（模拟价格变化）
5. 验证价格更新和历史价格记录

### 预期结果

1. 第一次价格更新成功
2. 返回更新成功确认
3. 资产价格记录存在且符合更新值
4. 第二次价格更新成功
5. 当前价格已更新为新值
6. 前一个价格记录为第一次更新的值
7. 价格更新事件已正确生成

### 测试脚本

```move
#[test]
public fun test_update_asset_price() {
    // 设置测试环境
    let scenario = test_scenario::begin(@admin);
    
    // 初始化预言机系统和注册预言机
    {
        let admin = test_scenario::ctx(&mut scenario);
        oracle::initialize(admin);
    };
    
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        oracle::register_oracle(
            b"Chainlink BTC/USD", 
            1, 
            300, 
            80, 
            5, 
            true, 
            admin
        );
    };
    
    // 设置预言机管理员
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        oracle::update_oracle_admin(0, @oracle_admin, admin);
    };
    
    // 第一次更新资产价格
    test_scenario::next_tx(&mut scenario, @oracle_admin);
    {
        let oracle_admin = test_scenario::ctx(&mut scenario);
        
        // 更新价格
        oracle::update_asset_price(
            0,                // 预言机ID
            b"BTC/USD",      // 资产符号
            30000,           // 价格
            90,              // 信任度
            b"external",     // 来源
            oracle_admin
        );
    };
    
    // 验证第一次价格更新
    test_scenario::next_tx(&mut scenario, @oracle_admin);
    {
        // 验证价格存在
        assert!(oracle::asset_price_exists(0, b"BTC/USD"), 0);
        
        // 验证价格信息
        let price_info = oracle::get_asset_price(0, b"BTC/USD");
        assert!(price_info.price == 30000, 1);
        assert!(price_info.confidence == 90, 2);
        assert!(price_info.source == b"external", 3);
        
        // 验证价格更新事件
        let price_event = test_scenario::take_event<oracle::PriceUpdatedEvent>(&mut scenario);
        assert!(price_event.oracle_id == 0, 4);
        assert!(price_event.symbol == b"BTC/USD", 5);
        assert!(price_event.price == 30000, 6);
    };
    
    // 第二次更新价格（价格变化）
    test_scenario::next_tx(&mut scenario, @oracle_admin);
    {
        let oracle_admin = test_scenario::ctx(&mut scenario);
        
        // 休眠1秒
        std::thread::sleep(std::time::Duration::from_secs(1));
        
        // 更新价格
        oracle::update_asset_price(
            0,                // 预言机ID
            b"BTC/USD",      // 资产符号
            31000,           // 新价格
            95,              // 信任度
            b"external",     // 来源
            oracle_admin
        );
    };
    
    // 验证第二次价格更新
    test_scenario::next_tx(&mut scenario, @oracle_admin);
    {
        // 验证价格信息
        let price_info = oracle::get_asset_price(0, b"BTC/USD");
        assert!(price_info.price == 31000, 7);         // 当前价格
        assert!(price_info.prev_price == 30000, 8);    // 前一个价格
        assert!(price_info.confidence == 95, 9);
        
        // 验证价格更新事件
        let price_event = test_scenario::take_event<oracle::PriceUpdatedEvent>(&mut scenario);
        assert!(price_event.price == 31000, 10);
        assert!(price_event.prev_price == 30000, 11);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-OC-301

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-OC-301 |
| 测试名称 | 验证价格偏差检测 |
| 测试类型 | 单元测试 |
| 所属模块 | 预言机集成 |
| 优先级 | 高 |
| 编写人员 | 李工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证预言机系统能够正确检测异常的价格偏差，并拒绝超过配置阈值的价格更新。

### 前置条件

1. 预言机系统已初始化
2. ID为0的预言机已注册并处于激活状态
3. 预言机配置了最大价格偏差为5%
4. 资产"BTC/USD"已有初始价格30000

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 预言机ID | 0 | 已注册的预言机ID |
| 资产符号 | "BTC/USD" | 更新价格的资产符号 |
| 初始价格 | 30000 | 初始设置的资产价格 |
| 有效新价格 | 31400 | 在允许偏差范围内的新价格(+4.67%) |
| 无效新价格 | 31800 | 超出允许偏差范围的新价格(+6%) |
| 预言机管理员 | 0xORACLE_ADMIN... | 预言机管理员账户 |

### 测试步骤

1. 使用预言机管理员更新价格至有效范围内的新价格
2. 检查价格是否更新成功
3. 尝试更新价格至超出偏差范围的无效价格
4. 检查无效价格更新是否被拒绝

### 预期结果

1. 有效价格范围内的更新成功
2. 资产价格记录更新为新价格31400
3. 超出偏差范围的价格更新被拒绝
4. 系统返回价格偏差错误
5. 价格记录保持为之前的有效价格31400
6. 系统日志记录了拒绝更新的信息

### 测试脚本

```move
#[test]
public fun test_price_deviation_check() {
    // 设置测试环境和初始状态
    let scenario = test_scenario::begin(@admin);
    
    // 初始化预言机系统和注册预言机（最大偏差5%）
    {
        let admin = test_scenario::ctx(&mut scenario);
        oracle::initialize(admin);
    };
    
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        oracle::register_oracle(
            b"Chainlink BTC/USD", 
            1, 
            300, 
            80, 
            5,    // 5%最大偏差
            true, 
            admin
        );
    };
    
    // 设置预言机管理员并更新初始价格
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        oracle::update_oracle_admin(0, @oracle_admin, admin);
    };
    
    test_scenario::next_tx(&mut scenario, @oracle_admin);
    {
        let oracle_admin = test_scenario::ctx(&mut scenario);
        oracle::update_asset_price(0, b"BTC/USD", 30000, 90, b"external", oracle_admin);
    };
    
    // 更新价格至有效范围（增加4.67%）
    test_scenario::next_tx(&mut scenario, @oracle_admin);
    {
        let oracle_admin = test_scenario::ctx(&mut scenario);
        oracle::update_asset_price(0, b"BTC/USD", 31400, 90, b"external", oracle_admin);
    };
    
    // 验证有效价格更新
    test_scenario::next_tx(&mut scenario, @oracle_admin);
    {
        let price_info = oracle::get_asset_price(0, b"BTC/USD");
        assert!(price_info.price == 31400, 0);
        assert!(price_info.prev_price == 30000, 1);
    };
    
    // 尝试更新至无效范围（增加6%，超过5%限制）
    test_scenario::next_tx(&mut scenario, @oracle_admin);
    {
        let oracle_admin = test_scenario::ctx(&mut scenario);
        
        // 预期此调用会失败，使用 #[expected_failure] 标注
        oracle::update_asset_price(0, b"BTC/USD", 33300, 90, b"external", oracle_admin);
    };
    
    // 验证价格未被更新
    test_scenario::next_tx(&mut scenario, @oracle_admin);
    {
        // 验证价格保持不变
        let price_info = oracle::get_asset_price(0, b"BTC/USD");
        assert!(price_info.price == 31400, 2); // 价格仍为上次有效更新的值
        
        // 验证错误事件
        let error_event = test_scenario::take_event<oracle::PriceDeviationErrorEvent>(&mut scenario);
        assert!(error_event.oracle_id == 0, 3);
        assert!(error_event.symbol == b"BTC/USD", 4);
        assert!(error_event.current_price == 31400, 5);
        assert!(error_event.new_price == 33300, 6);
        assert!(error_event.max_deviation == 5, 7);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-OC-401

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-OC-401 |
| 测试名称 | 验证获取资产价格优先级机制 |
| 测试类型 | 单元测试 |
| 所属模块 | 预言机集成 |
| 优先级 | 高 |
| 编写人员 | 李工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证系统能够根据预言机优先级正确选择价格源，在多个预言机提供相同资产价格时，选择具有较高优先级的预言机。

### 前置条件

1. 预言机系统已初始化
2. 两个预言机已注册：
   - ID为0的优先级预言机（is_priority = true）
   - ID为1的非优先级预言机（is_priority = false）
3. 两个预言机均已更新"BTC/USD"价格

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 优先预言机ID | 0 | 具有优先级的预言机 |
| 非优先预言机ID | 1 | 不具有优先级的预言机 |
| 资产符号 | "BTC/USD" | 测试资产 |
| 优先预言机价格 | 30000 | 优先预言机提供的价格 |
| 非优先预言机价格 | 30100 | 非优先预言机提供的价格 |

### 测试步骤

1. 使用管理员账户初始化系统并注册两个预言机
2. 分别为两个预言机设置不同的价格
3. 调用获取价格的API，不指定预言机ID
4. 检查返回的价格是否来自优先级预言机

### 预期结果

1. 系统返回优先级预言机的价格(30000)而非非优先级预言机的价格
2. 当明确指定预言机ID时，返回对应预言机的价格
3. 当查询不存在的资产时，系统返回适当的错误

### 测试脚本

```move
#[test]
public fun test_price_priority_mechanism() {
    // 设置测试环境
    let scenario = test_scenario::begin(@admin);
    
    // 初始化预言机系统
    {
        let admin = test_scenario::ctx(&mut scenario);
        oracle::initialize(admin);
    };
    
    // 注册两个预言机
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        
        // 注册优先级预言机
        oracle::register_oracle(
            b"Priority Oracle", 
            1, 
            300, 
            80, 
            5, 
            true,   // 优先级设置为true
            admin
        );
        
        // 注册非优先级预言机
        oracle::register_oracle(
            b"Secondary Oracle", 
            1, 
            300, 
            80, 
            5, 
            false,  // 优先级设置为false
            admin
        );
    };
    
    // 设置预言机管理员
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        oracle::update_oracle_admin(0, @oracle_admin, admin);
        oracle::update_oracle_admin(1, @oracle_admin, admin);
    };
    
    // 为两个预言机设置不同价格
    test_scenario::next_tx(&mut scenario, @oracle_admin);
    {
        let oracle_admin = test_scenario::ctx(&mut scenario);
        
        // 优先级预言机价格
        oracle::update_asset_price(0, b"BTC/USD", 30000, 90, b"priority", oracle_admin);
        
        // 非优先级预言机价格
        oracle::update_asset_price(1, b"BTC/USD", 30100, 95, b"secondary", oracle_admin);
    };
    
    // 验证优先级机制
    test_scenario::next_tx(&mut scenario, @user);
    {
        // 不指定预言机ID，应返回优先级预言机价格
        let price_info = oracle::get_asset_price_by_symbol(b"BTC/USD");
        assert!(price_info.price == 30000, 0);     // 优先级预言机价格
        assert!(price_info.source == b"priority", 1);
        
        // 明确指定非优先级预言机ID，应返回其价格
        let price_info_2 = oracle::get_asset_price(1, b"BTC/USD");
        assert!(price_info_2.price == 30100, 2);   // 非优先级预言机价格
        assert!(price_info_2.source == b"secondary", 3);
    };
    
    test_scenario::end(scenario);
}
```

## 测试用例：TC-OC-501

### 基本信息

| 字段 | 描述 |
|-----|-----|
| 测试用例ID | TC-OC-501 |
| 测试名称 | 验证价格过期检测 |
| 测试类型 | 单元测试 |
| 所属模块 | 预言机集成 |
| 优先级 | 中 |
| 编写人员 | 李工 |
| 编写日期 | 2023-06-08 |
| 测试环境 | 开发环境 |
| 自动化状态 | 已自动化 |

### 测试目标

验证系统能够正确检测过期的价格数据，并在获取价格时返回适当的错误。

### 前置条件

1. 预言机系统已初始化
2. 预言机已注册并设置最大价格年龄为5秒
3. 资产"BTC/USD"已有价格数据

### 测试数据

| 数据项 | 值 | 说明 |
|-------|-----|-----|
| 预言机ID | 0 | 已注册的预言机ID |
| 资产符号 | "BTC/USD" | 测试资产 |
| 价格 | 30000 | 设定的资产价格 |
| 最大价格年龄 | 5 | 价格有效期（秒） |

### 测试步骤

1. 更新资产价格
2. 立即获取价格，验证可以正常获取
3. 等待超过最大价格年龄的时间（6秒）
4. 再次尝试获取价格
5. 检查系统是否返回价格过期错误

### 预期结果

1. 首次获取价格成功，返回设定的价格值
2. 等待时间后再次获取价格，系统返回价格过期错误
3. 系统日志记录了价格过期的信息

### 测试脚本

```move
#[test]
public fun test_price_expiration() {
    // 设置测试环境
    let scenario = test_scenario::begin(@admin);
    
    // 初始化预言机系统和注册预言机
    {
        let admin = test_scenario::ctx(&mut scenario);
        oracle::initialize(admin);
    };
    
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        oracle::register_oracle(
            b"Test Oracle", 
            1, 
            5,     // 5秒最大价格年龄
            80, 
            5, 
            true, 
            admin
        );
    };
    
    // 设置预言机管理员并更新价格
    test_scenario::next_tx(&mut scenario, @admin);
    {
        let admin = test_scenario::ctx(&mut scenario);
        oracle::update_oracle_admin(0, @oracle_admin, admin);
    };
    
    // 更新价格并立即检验
    test_scenario::next_tx(&mut scenario, @oracle_admin);
    {
        let oracle_admin = test_scenario::ctx(&mut scenario);
        oracle::update_asset_price(0, b"BTC/USD", 30000, 90, b"test", oracle_admin);
    };
    
    test_scenario::next_tx(&mut scenario, @user);
    {
        // 立即获取价格应成功
        let price_result = oracle::try_get_asset_price(0, b"BTC/USD");
        assert!(price_result.is_valid, 0);
        assert!(price_result.price == 30000, 1);
    };
    
    // 等待6秒（超过5秒的最大价格年龄）
    std::thread::sleep(std::time::Duration::from_secs(6));
    
    // 再次尝试获取价格
    test_scenario::next_tx(&mut scenario, @user);
    {
        // 此时获取价格应失败，价格已过期
        let price_result = oracle::try_get_asset_price(0, b"BTC/USD");
        assert!(!price_result.is_valid, 2);
        assert!(price_result.error_code == oracle::ERROR_PRICE_EXPIRED, 3);
        
        // 验证错误事件
        let error_event = test_scenario::take_event<oracle::PriceExpiredEvent>(&mut scenario);
        assert!(error_event.oracle_id == 0, 4);
        assert!(error_event.symbol == b"BTC/USD", 5);
    };
    
    test_scenario::end(scenario);
} 