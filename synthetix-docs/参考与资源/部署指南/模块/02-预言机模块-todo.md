# 预言机模块实现待办事项

## 数据结构实现

### OracleSource 结构体
- [ ] 定义 OracleSource 结构体，包含以下字段：
  - [ ] source_id: u64（数据源ID）
  - [ ] source_name: String（数据源名称）
  - [ ] source_url: String（数据源URL）
  - [ ] source_type: u8（数据源类型：1=中心化,2=去中心化,3=混合）
  - [ ] is_active: bool（是否处于活跃状态）
  - [ ] added_at: u64（添加时间戳）
  - [ ] last_updated: u64（最后更新时间）
  - [ ] reliability_score: u64（可靠性分数，满分10000）
  - [ ] owner: address（所有者地址）
- [ ] 实现相关访问器函数
- [ ] 实现相关修改器函数

### OracleFeed 结构体
- [ ] 定义 OracleFeed 结构体，包含以下字段：
  - [ ] feed_id: u64（数据流ID）
  - [ ] feed_name: String（数据流名称）
  - [ ] description: String（描述）
  - [ ] category: u8（分类：1=加密货币价格,2=外汇汇率,3=商品价格,4=利率,5=其他）
  - [ ] data_type: u8（数据类型：1=数值型,2=布尔型,3=字符串型）
  - [ ] decimals: u8（小数位数，针对数值型）
  - [ ] is_active: bool（是否处于活跃状态）
  - [ ] update_frequency: u64（更新频率，秒）
  - [ ] sources: vector<u64>（数据源ID列表）
  - [ ] created_at: u64（创建时间戳）
  - [ ] last_updated: u64（最后更新时间）
  - [ ] aggregation_strategy: u8（聚合策略：1=中位数,2=平均值,3=加权平均,4=最新值）
- [ ] 实现相关访问器函数
- [ ] 实现相关修改器函数

### DataPoint 结构体
- [ ] 定义 DataPoint 结构体，包含以下字段：
  - [ ] feed_id: u64（关联的数据流ID）
  - [ ] source_id: u64（数据源ID）
  - [ ] timestamp: u64（时间戳）
  - [ ] numeric_value: u128（数值型数据，缩放后的整数）
  - [ ] boolean_value: bool（布尔型数据）
  - [ ] string_value: String（字符串型数据）
  - [ ] status: u8（状态：1=有效,2=过期,3=异常）
  - [ ] reporter: address（报告者地址）
  - [ ] signature: vector<u8>（签名数据，可选）
- [ ] 实现相关访问器函数
- [ ] 实现相关修改器函数

### OracleValue 结构体
- [ ] 定义 OracleValue 结构体，包含以下字段：
  - [ ] feed_id: u64（关联的数据流ID）
  - [ ] value_type: u8（值类型：1=数值型,2=布尔型,3=字符串型）
  - [ ] numeric_value: u128（数值型数据，缩放后的整数）
  - [ ] boolean_value: bool（布尔型数据）
  - [ ] string_value: String（字符串型数据）
  - [ ] timestamp: u64（更新时间戳）
  - [ ] source_count: u8（数据源计数）
  - [ ] confidence_score: u64（置信度分数，满分10000）
  - [ ] deviation: u64（偏差值，满分10000）
- [ ] 实现相关访问器函数
- [ ] 实现相关修改器函数

### OracleRegistry 结构体
- [ ] 定义 OracleRegistry 结构体，包含以下字段：
  - [ ] sources: Table<u64, OracleSource>（数据源映射表）
  - [ ] feeds: Table<u64, OracleFeed>（数据流映射表）
  - [ ] data_points: Table<vector<u8>, DataPoint>（数据点映射表，键为feed_id+source_id+timestamp）
  - [ ] latest_values: Table<u64, OracleValue>（最新值映射表，键为feed_id）
  - [ ] historical_values: Table<vector<u8>, OracleValue>（历史值映射表，键为feed_id+timestamp）
  - [ ] next_source_id: u64（下一个可用数据源ID）
  - [ ] next_feed_id: u64（下一个可用数据流ID）
  - [ ] admin_addresses: vector<address>（管理员地址列表）
  - [ ] heartbeat_timestamps: Table<u64, u64>（心跳时间戳，键为source_id）
- [ ] 实现相关访问器函数
- [ ] 实现相关修改器函数

### OracleConfig 结构体
- [ ] 定义 OracleConfig 结构体，包含以下字段：
  - [ ] max_delay_threshold: u64（最大延迟阈值，秒）
  - [ ] deviation_threshold: u64（偏差阈值，满分10000）
  - [ ] minimum_source_count: u8（最小数据源数量）
  - [ ] heartbeat_interval: u64（心跳间隔，秒）
  - [ ] historical_data_retention_period: u64（历史数据保留期，秒）
  - [ ] max_decimals: u8（最大小数位数）
  - [ ] is_permissionless: bool（是否为无权限模式）
  - [ ] max_sources_per_feed: u8（每个数据流最大数据源数量）
  - [ ] max_feeds: u64（最大数据流数量）
- [ ] 实现相关访问器函数
- [ ] 实现相关修改器函数

## 核心功能实现

### 数据源管理
- [ ] 实现 register_source 函数：
  ```move
  public fun register_source(
      account: &signer,
      source_name: String,
      source_url: String,
      source_type: u8,
  ): u64
  ```
  - [ ] 验证账户权限
  - [ ] 验证数据源名称唯一性
  - [ ] 验证数据源参数合法性
  - [ ] 创建并存储 OracleSource
  - [ ] 发出数据源注册事件
  - [ ] 返回数据源ID

- [ ] 实现 update_source 函数：
  ```move
  public fun update_source(
      account: &signer,
      source_id: u64,
      source_url: String,
      is_active: bool,
  )
  ```
  - [ ] 验证账户权限
  - [ ] 验证数据源存在性
  - [ ] 验证更新参数合法性
  - [ ] 更新数据源信息
  - [ ] 发出数据源更新事件

- [ ] 实现 deactivate_source 函数：
  ```move
  public fun deactivate_source(
      account: &signer,
      source_id: u64,
  )
  ```
  - [ ] 验证账户权限
  - [ ] 验证数据源存在性
  - [ ] 设置数据源为非活跃
  - [ ] 从相关数据流中移除数据源
  - [ ] 发出数据源停用事件

### 数据流管理
- [ ] 实现 create_feed 函数：
  ```move
  public fun create_feed(
      account: &signer,
      feed_name: String,
      description: String,
      category: u8,
      data_type: u8,
      decimals: u8,
      update_frequency: u64,
      sources: vector<u64>,
      aggregation_strategy: u8,
  ): u64
  ```
  - [ ] 验证账户权限
  - [ ] 验证数据流名称唯一性
  - [ ] 验证数据流参数合法性
  - [ ] 验证数据源存在性和活跃状态
  - [ ] 创建并存储 OracleFeed
  - [ ] 发出数据流创建事件
  - [ ] 返回数据流ID

- [ ] 实现 update_feed 函数：
  ```move
  public fun update_feed(
      account: &signer,
      feed_id: u64,
      description: String,
      is_active: bool,
      update_frequency: u64,
      aggregation_strategy: u8,
  )
  ```
  - [ ] 验证账户权限
  - [ ] 验证数据流存在性
  - [ ] 验证更新参数合法性
  - [ ] 更新数据流信息
  - [ ] 发出数据流更新事件

- [ ] 实现 add_source_to_feed 函数：
  ```move
  public fun add_source_to_feed(
      account: &signer,
      feed_id: u64,
      source_id: u64,
  )
  ```
  - [ ] 验证账户权限
  - [ ] 验证数据流和数据源存在性
  - [ ] 验证数据源未在数据流中
  - [ ] 添加数据源到数据流
  - [ ] 发出数据源添加事件

- [ ] 实现 remove_source_from_feed 函数：
  ```move
  public fun remove_source_from_feed(
      account: &signer,
      feed_id: u64,
      source_id: u64,
  )
  ```
  - [ ] 验证账户权限
  - [ ] 验证数据流和数据源存在性
  - [ ] 验证数据源当前在数据流中
  - [ ] 从数据流中移除数据源
  - [ ] 发出数据源移除事件

### 数据提交和聚合
- [ ] 实现 submit_data_point 函数：
  ```move
  public fun submit_data_point(
      reporter: &signer,
      feed_id: u64,
      source_id: u64,
      numeric_value: Option<u128>,
      boolean_value: Option<bool>,
      string_value: Option<String>,
      signature: Option<vector<u8>>,
  )
  ```
  - [ ] 验证报告者权限
  - [ ] 验证数据流和数据源存在性和活跃状态
  - [ ] 验证数据类型匹配
  - [ ] 验证数据有效性
  - [ ] 创建并存储 DataPoint
  - [ ] 触发数据聚合
  - [ ] 发出数据点提交事件

- [ ] 实现 aggregate_data 函数：
  ```move
  fun aggregate_data(
      feed_id: u64,
  ): OracleValue
  ```
  - [ ] 获取数据流信息
  - [ ] 根据数据流获取所有活跃数据源的最新数据点
  - [ ] 根据聚合策略计算聚合值
  - [ ] 计算置信度分数
  - [ ] 计算偏差值
  - [ ] 创建 OracleValue
  - [ ] 存储最新值和历史值
  - [ ] 发出数据聚合事件
  - [ ] 返回聚合后的 OracleValue

- [ ] 实现 heartbeat 函数：
  ```move
  public fun heartbeat(
      reporter: &signer,
      source_id: u64,
  )
  ```
  - [ ] 验证报告者权限
  - [ ] 验证数据源存在性
  - [ ] 更新数据源心跳时间戳
  - [ ] 发出心跳事件

### 数据查询
- [ ] 实现 get_latest_value 函数：
  ```move
  public fun get_latest_value(
      feed_id: u64,
  ): (OracleValue, bool)
  ```
  - [ ] 验证数据流存在性
  - [ ] 获取最新聚合值
  - [ ] 验证数据是否过期
  - [ ] 返回聚合值和有效性标志

- [ ] 实现 get_value_with_timestamp 函数：
  ```move
  public fun get_value_with_timestamp(
      feed_id: u64,
      timestamp: u64,
  ): (OracleValue, bool)
  ```
  - [ ] 验证数据流存在性
  - [ ] 获取指定时间戳的历史值
  - [ ] 验证数据是否存在
  - [ ] 返回历史值和存在性标志

- [ ] 实现 get_numeric_price 函数：
  ```move
  public fun get_numeric_price(
      feed_id: u64,
  ): (u128, u8, u64, bool)
  ```
  - [ ] 验证数据流存在性和为数值型
  - [ ] 获取最新聚合值
  - [ ] 验证数据是否过期
  - [ ] 返回价格、小数位数、时间戳和有效性标志

### 配置和管理
- [ ] 实现 update_oracle_config 函数：
  ```move
  public fun update_oracle_config(
      admin: &signer,
      max_delay_threshold: u64,
      deviation_threshold: u64,
      minimum_source_count: u8,
      heartbeat_interval: u64,
  )
  ```
  - [ ] 验证管理员权限
  - [ ] 验证配置参数合法性
  - [ ] 更新预言机配置
  - [ ] 发出配置更新事件

- [ ] 实现 add_admin 函数：
  ```move
  public fun add_admin(
      current_admin: &signer,
      new_admin_address: address,
  )
  ```
  - [ ] 验证当前管理员权限
  - [ ] 验证新管理员不在列表中
  - [ ] 添加管理员到列表
  - [ ] 发出管理员添加事件

- [ ] 实现 remove_admin 函数：
  ```move
  public fun remove_admin(
      current_admin: &signer,
      admin_address: address,
  )
  ```
  - [ ] 验证当前管理员权限
  - [ ] 验证待移除管理员在列表中
  - [ ] 验证不是最后一个管理员
  - [ ] 从列表中移除管理员
  - [ ] 发出管理员移除事件

## 事件实现
- [ ] 定义 SourceRegisteredEvent 结构体：
  ```move
  struct SourceRegisteredEvent has drop, store {
      source_id: u64,
      source_name: String,
      source_type: u8,
      owner: address,
      timestamp: u64,
  }
  ```

- [ ] 定义 SourceUpdatedEvent 结构体：
  ```move
  struct SourceUpdatedEvent has drop, store {
      source_id: u64,
      new_url: String,
      is_active: bool,
      updated_by: address,
      timestamp: u64,
  }
  ```

- [ ] 定义 FeedCreatedEvent 结构体：
  ```move
  struct FeedCreatedEvent has drop, store {
      feed_id: u64,
      feed_name: String,
      data_type: u8,
      source_count: u8,
      created_by: address,
      timestamp: u64,
  }
  ```

- [ ] 定义 FeedUpdatedEvent 结构体：
  ```move
  struct FeedUpdatedEvent has drop, store {
      feed_id: u64,
      is_active: bool,
      update_frequency: u64,
      updated_by: address,
      timestamp: u64,
  }
  ```

- [ ] 定义 DataPointSubmittedEvent 结构体：
  ```move
  struct DataPointSubmittedEvent has drop, store {
      feed_id: u64,
      source_id: u64,
      reporter: address,
      timestamp: u64,
  }
  ```

- [ ] 定义 DataAggregatedEvent 结构体：
  ```move
  struct DataAggregatedEvent has drop, store {
      feed_id: u64,
      source_count: u8,
      confidence_score: u64,
      timestamp: u64,
  }
  ```

- [ ] 定义 HeartbeatEvent 结构体：
  ```move
  struct HeartbeatEvent has drop, store {
      source_id: u64,
      reporter: address,
      timestamp: u64,
  }
  ```

- [ ] 定义 ConfigUpdatedEvent 结构体：
  ```move
  struct ConfigUpdatedEvent has drop, store {
      admin: address,
      max_delay_threshold: u64,
      deviation_threshold: u64,
      timestamp: u64,
  }
  ```

- [ ] 实现事件触发函数

## 高级功能实现

### 数据质量监控
- [ ] 实现 calculate_source_reliability 函数：
  ```move
  fun calculate_source_reliability(
      source_id: u64,
  ): u64
  ```
  - [ ] 获取数据源历史数据
  - [ ] 与聚合值比较计算偏差
  - [ ] 考虑数据提交及时性
  - [ ] 更新数据源可靠性分数
  - [ ] 返回可靠性分数

- [ ] 实现 detect_anomalies 函数：
  ```move
  fun detect_anomalies(
      feed_id: u64,
      new_data_point: DataPoint,
  ): bool
  ```
  - [ ] 获取历史数据
  - [ ] 计算统计指标（均值、标准差等）
  - [ ] 检测新数据点是否异常
  - [ ] 如异常则标记并发出事件
  - [ ] 返回是否异常

- [ ] 实现 purge_stale_data 函数：
  ```move
  public fun purge_stale_data()
  ```
  - [ ] 获取当前时间
  - [ ] 计算保留期限
  - [ ] 删除超过保留期的历史数据
  - [ ] 更新统计信息

### 扩展数据类型支持
- [ ] 实现 submit_complex_data 函数：
  ```move
  public fun submit_complex_data(
      reporter: &signer,
      feed_id: u64,
      source_id: u64,
      data: vector<u8>,
      data_schema: String,
  )
  ```
  - [ ] 验证报告者权限
  - [ ] 验证数据流和数据源存在性
  - [ ] 验证复杂数据格式
  - [ ] 存储复杂数据
  - [ ] 发出复杂数据提交事件

- [ ] 实现 parse_complex_data 函数：
  ```move
  public fun parse_complex_data(
      feed_id: u64,
      query_path: String,
  ): vector<u8>
  ```
  - [ ] 获取复杂数据
  - [ ] 根据查询路径解析数据
  - [ ] 返回查询结果

### 预言机权限控制
- [ ] 实现 register_reporter 函数：
  ```move
  public fun register_reporter(
      admin: &signer,
      reporter_address: address,
      source_id: u64,
  )
  ```
  - [ ] 验证管理员权限
  - [ ] 验证数据源存在性
  - [ ] 注册报告者与数据源关系
  - [ ] 发出报告者注册事件

- [ ] 实现 set_permissionless_mode 函数：
  ```move
  public fun set_permissionless_mode(
      admin: &signer,
      is_permissionless: bool,
  )
  ```
  - [ ] 验证管理员权限
  - [ ] 更新无权限模式设置
  - [ ] 发出模式更新事件

- [ ] 实现 can_report_for_source 函数：
  ```move
  public fun can_report_for_source(
      reporter: address,
      source_id: u64,
  ): bool
  ```
  - [ ] 检查是否为无权限模式
  - [ ] 检查报告者是否已注册为数据源报告者
  - [ ] 返回权限检查结果

### 价格提要服务
- [ ] 实现 get_currency_pair_price 函数：
  ```move
  public fun get_currency_pair_price(
      base_currency: String,
      quote_currency: String,
  ): (u128, u8, u64, bool)
  ```
  - [ ] 查找对应的价格数据流
  - [ ] 获取最新价格
  - [ ] 验证价格有效性
  - [ ] 返回价格、小数位数、时间戳和有效性标志

- [ ] 实现 get_twap 函数：
  ```move
  public fun get_twap(
      feed_id: u64,
      period: u64,
  ): (u128, u64, bool)
  ```
  - [ ] 验证数据流存在性
  - [ ] 获取指定时间段内的历史数据
  - [ ] 计算时间加权平均价格
  - [ ] 返回TWAP、计算时间和有效性标志

## 与其他模块集成
- [ ] 实现与资产模块的集成：
  - [ ] 提供价格提要服务
  - [ ] 资产估值支持

- [ ] 实现与市场模块的集成：
  - [ ] 提供价格参考
  - [ ] 触发价格波动事件处理

- [ ] 实现与池模块的集成：
  - [ ] 提供资产价格信息
  - [ ] 支持池资产重平衡决策

- [ ] 实现与治理模块的集成：
  - [ ] 预言机参数治理提案支持
  - [ ] 数据源和数据流管理权限控制

## 测试计划
- [ ] 编写单元测试：
  - [ ] 数据源注册和管理测试
  - [ ] 数据流创建和更新测试
  - [ ] 数据提交和聚合测试
  - [ ] 数据查询功能测试
  - [ ] 配置和管理功能测试

- [ ] 编写集成测试：
  - [ ] 多数据源场景测试
  - [ ] 异常数据处理测试
  - [ ] 数据过期和心跳测试
  - [ ] 与其他模块交互测试

- [ ] 编写性能测试：
  - [ ] 数据提交性能测试
  - [ ] 聚合计算性能测试
  - [ ] 查询性能测试
  - [ ] 高频更新场景测试

## 性能和可扩展性优化
- [ ] 优化数据聚合算法
- [ ] 优化数据存储结构
- [ ] 实现数据点批量提交
- [ ] 优化历史数据管理
- [ ] 优化查询性能

## 安全审核
- [ ] 审核数据提交权限控制
- [ ] 审核数据验证逻辑
- [ ] 审核聚合算法安全性
- [ ] 审核异常数据处理
- [ ] 审核资源管理和限制 