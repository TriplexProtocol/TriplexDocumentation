# 基础模块实现待办事项

## 数据结构实现

### 基础配置结构体
- [ ] 定义 CoreConfig 结构体，包含以下字段：
  - [ ] protocol_version: String（协议版本）
  - [ ] protocol_owner: address（协议所有者地址）
  - [ ] emergency_mode: bool（是否处于紧急模式）
  - [ ] protocol_fee_percentage: u64（协议费率，基点单位）
  - [ ] treasury_address: address（国库地址）
  - [ ] module_registry: vector<String>（已注册模块列表）
  - [ ] maintenance_mode: bool（是否处于维护模式）
  - [ ] supported_currencies: vector<String>（支持的货币代码列表）
  - [ ] max_transaction_timeout: u64（最大交易超时时间，秒）
- [ ] 实现配置访问器函数
- [ ] 实现配置修改器函数（仅限协议所有者）

### 系统状态结构体
- [ ] 定义 SystemStatus 结构体，包含以下字段：
  - [ ] is_active: bool（系统是否处于活跃状态）
  - [ ] last_heartbeat: u64（最后心跳时间戳）
  - [ ] total_transaction_count: u128（总交易数）
  - [ ] daily_transaction_count: u64（每日交易数）
  - [ ] current_tps: u64（当前每秒交易数）
  - [ ] peak_tps: u64（峰值每秒交易数）
  - [ ] active_users_count: u64（活跃用户数）
  - [ ] system_uptime: u64（系统运行时间，秒）
  - [ ] active_modules: vector<String>（当前活跃模块列表）
  - [ ] emergency_events: u64（紧急事件计数）
- [ ] 实现状态访问器函数
- [ ] 实现状态更新函数（仅限系统）

### 地址解析器结构体
- [ ] 定义 AddressResolver 结构体，包含以下字段：
  - [ ] name_to_address: Table<String, address>（名称到地址映射）
  - [ ] address_to_name: Table<address, String>（地址到名称映射）
  - [ ] role_to_addresses: Table<String, vector<address>>（角色到地址列表映射）
  - [ ] address_to_roles: Table<address, vector<String>>（地址到角色列表映射）
- [ ] 实现地址解析器访问器函数
- [ ] 实现地址解析器修改器函数

### 基础账户结构体
- [ ] 定义 CoreAccount 结构体，包含以下字段：
  - [ ] account_address: address（账户地址）
  - [ ] account_type: u8（账户类型：0=普通,1=合约,2=系统）
  - [ ] registration_time: u64（注册时间戳）
  - [ ] last_activity_time: u64（最后活动时间）
  - [ ] total_transaction_count: u64（总交易数）
  - [ ] is_whitelisted: bool（是否在白名单中）
  - [ ] is_blacklisted: bool（是否在黑名单中）
  - [ ] metadata: Table<String, vector<u8>>（元数据映射）
- [ ] 实现账户访问器函数
- [ ] 实现账户修改器函数（带权限控制）

### 版本控制结构体
- [ ] 定义 VersionControl 结构体，包含以下字段：
  - [ ] current_version: String（当前版本号）
  - [ ] version_history: vector<String>（版本历史记录）
  - [ ] upgrade_events: vector<UpgradeEvent>（升级事件记录）
  - [ ] pending_upgrades: vector<PendingUpgrade>（待处理升级）
  - [ ] compatibility_matrix: Table<String, vector<String>>（兼容性矩阵）
- [ ] 实现版本控制访问器函数
- [ ] 实现版本控制修改器函数（仅限系统）

### 系统常量结构体
- [ ] 定义 SystemConstants 结构体，包含以下字段：
  - [ ] MAX_NAME_LENGTH: u64（最大名称长度）
  - [ ] MAX_METADATA_SIZE: u64（最大元数据大小）
  - [ ] MIN_REQUIRED_STAKE: u64（最小要求质押量）
  - [ ] HEARTBEAT_INTERVAL: u64（心跳间隔）
  - [ ] SYSTEM_PRECISION: u8（系统精度）
  - [ ] MAX_BATCH_SIZE: u64（最大批处理大小）
  - [ ] DEFAULT_GAS_LIMIT: u64（默认燃气限制）
  - [ ] ACCOUNT_INACTIVE_THRESHOLD: u64（账户不活跃阈值）
  - [ ] PERCENTAGE_BASE: u64（百分比基准，通常为10000）
- [ ] 实现常量访问器函数

## 核心功能实现

### 系统初始化
- [ ] 实现 initialize_protocol 函数：
  ```move
  public fun initialize_protocol(
      owner: &signer, 
      protocol_version: String,
      treasury_address: address,
      initial_fee_percentage: u64,
      supported_currencies: vector<String>
  )
  ```
  - [ ] 验证初始化参数合法性
  - [ ] 创建并初始化 CoreConfig
  - [ ] 创建并初始化 SystemStatus
  - [ ] 创建并初始化 AddressResolver
  - [ ] 创建并初始化 VersionControl
  - [ ] 注册 protocol_owner 地址
  - [ ] 发出系统初始化事件

### 账户管理
- [ ] 实现 register_account 函数：
  ```move
  public fun register_account(
      account: &signer,
      account_type: u8,
      metadata: Table<String, vector<u8>>,
  )
  ```
  - [ ] 验证账户是否已注册
  - [ ] 验证账户类型和元数据合法性
  - [ ] 创建并存储 CoreAccount
  - [ ] 更新系统统计信息
  - [ ] 发出账户注册事件

- [ ] 实现 update_account_metadata 函数：
  ```move
  public fun update_account_metadata(
      account: &signer,
      key: String,
      value: vector<u8>,
  )
  ```
  - [ ] 验证账户已注册
  - [ ] 验证元数据键值合法性
  - [ ] 更新账户元数据
  - [ ] 发出元数据更新事件

- [ ] 实现 whitelist_account 函数：
  ```move
  public fun whitelist_account(
      admin: &signer,
      account_address: address,
  )
  ```
  - [ ] 验证管理员权限
  - [ ] 验证账户已注册
  - [ ] 更新账户白名单状态
  - [ ] 发出白名单更新事件

- [ ] 实现 blacklist_account 函数：
  ```move
  public fun blacklist_account(
      admin: &signer,
      account_address: address,
      reason: String,
  )
  ```
  - [ ] 验证管理员权限
  - [ ] 验证账户已注册
  - [ ] 更新账户黑名单状态
  - [ ] 发出黑名单更新事件和原因

### 地址解析
- [ ] 实现 register_name 函数：
  ```move
  public fun register_name(
      account: &signer,
      name: String,
  )
  ```
  - [ ] 验证账户已注册
  - [ ] 验证名称可用性和合法性
  - [ ] 注册名称到地址映射
  - [ ] 发出名称注册事件

- [ ] 实现 resolve_name 函数：
  ```move
  public fun resolve_name(
      name: String,
  ): address
  ```
  - [ ] 查找名称对应的地址
  - [ ] 如未找到则返回零地址或错误

- [ ] 实现 resolve_address 函数：
  ```move
  public fun resolve_address(
      addr: address,
  ): String
  ```
  - [ ] 查找地址对应的名称
  - [ ] 如未找到则返回空字符串

- [ ] 实现 assign_role 函数：
  ```move
  public fun assign_role(
      admin: &signer,
      account_address: address,
      role: String,
  )
  ```
  - [ ] 验证管理员权限
  - [ ] 验证账户已注册
  - [ ] 验证角色名称合法性
  - [ ] 分配角色给地址
  - [ ] 发出角色分配事件

### 系统管理
- [ ] 实现 update_protocol_config 函数：
  ```move
  public fun update_protocol_config(
      owner: &signer,
      new_fee_percentage: u64,
      new_treasury_address: address,
      new_max_transaction_timeout: u64,
  )
  ```
  - [ ] 验证所有者权限
  - [ ] 验证参数合法性
  - [ ] 更新协议配置
  - [ ] 发出配置更新事件

- [ ] 实现 toggle_maintenance_mode 函数：
  ```move
  public fun toggle_maintenance_mode(
      owner: &signer,
      maintenance_enabled: bool,
  )
  ```
  - [ ] 验证所有者权限
  - [ ] 更新维护模式状态
  - [ ] 发出维护模式事件

- [ ] 实现 toggle_emergency_mode 函数：
  ```move
  public fun toggle_emergency_mode(
      owner: &signer,
      emergency_enabled: bool,
      reason: String,
  )
  ```
  - [ ] 验证所有者权限
  - [ ] 更新紧急模式状态
  - [ ] 发出紧急模式事件和原因

- [ ] 实现 register_module 函数：
  ```move
  public fun register_module(
      owner: &signer,
      module_name: String,
  )
  ```
  - [ ] 验证所有者权限
  - [ ] 验证模块名称未被注册
  - [ ] 添加模块到注册表
  - [ ] 发出模块注册事件

### 系统心跳
- [ ] 实现 system_heartbeat 函数：
  ```move
  public fun system_heartbeat()
  ```
  - [ ] 更新最后心跳时间
  - [ ] 更新系统运行时间
  - [ ] 处理需要定期处理的任务
  - [ ] 重置每日统计数据（如需要）

- [ ] 实现 calculate_system_metrics 函数：
  ```move
  fun calculate_system_metrics()
  ```
  - [ ] 计算当前TPS
  - [ ] 更新峰值TPS（如需要）
  - [ ] 计算活跃用户数
  - [ ] 更新系统状态

### 版本管理
- [ ] 实现 register_upgrade 函数：
  ```move
  public fun register_upgrade(
      owner: &signer,
      new_version: String,
      changes_description: String,
      upgrade_time: u64,
  ): u64
  ```
  - [ ] 验证所有者权限
  - [ ] 验证版本格式合法性
  - [ ] 创建待处理升级
  - [ ] 发出升级注册事件
  - [ ] 返回升级ID

- [ ] 实现 execute_upgrade 函数：
  ```move
  public fun execute_upgrade(
      owner: &signer,
      upgrade_id: u64,
  )
  ```
  - [ ] 验证所有者权限
  - [ ] 验证升级ID存在性
  - [ ] 验证升级时间已到
  - [ ] 执行版本升级
  - [ ] 更新版本历史
  - [ ] 发出升级执行事件

- [ ] 实现 check_compatibility 函数：
  ```move
  public fun check_compatibility(
      version_a: String,
      version_b: String,
  ): bool
  ```
  - [ ] 检查两个版本是否兼容
  - [ ] 参考兼容性矩阵
  - [ ] 返回兼容性结果

### 事务费用
- [ ] 实现 calculate_protocol_fee 函数：
  ```move
  public fun calculate_protocol_fee(
      transaction_amount: u64,
  ): u64
  ```
  - [ ] 基于协议费率计算费用
  - [ ] 应用最小和最大费用限制
  - [ ] 返回计算结果

- [ ] 实现 collect_protocol_fee 函数：
  ```move
  public fun collect_protocol_fee(
      fee_amount: u64,
      currency_code: String,
  )
  ```
  - [ ] 验证货币代码合法性
  - [ ] 将费用转入国库
  - [ ] 更新费用统计信息
  - [ ] 发出费用收集事件

## 事件实现
- [ ] 定义 SystemInitializedEvent 结构体：
  ```move
  struct SystemInitializedEvent has drop, store {
      protocol_version: String,
      owner_address: address,
      timestamp: u64,
  }
  ```

- [ ] 定义 AccountRegisteredEvent 结构体：
  ```move
  struct AccountRegisteredEvent has drop, store {
      account_address: address,
      account_type: u8,
      registration_time: u64,
  }
  ```

- [ ] 定义 ConfigUpdatedEvent 结构体：
  ```move
  struct ConfigUpdatedEvent has drop, store {
      updated_by: address,
      old_fee_percentage: u64,
      new_fee_percentage: u64,
      old_treasury_address: address,
      new_treasury_address: address,
      timestamp: u64,
  }
  ```

- [ ] 定义 MaintenanceModeEvent 结构体：
  ```move
  struct MaintenanceModeEvent has drop, store {
      enabled: bool,
      triggered_by: address,
      timestamp: u64,
  }
  ```

- [ ] 定义 EmergencyModeEvent 结构体：
  ```move
  struct EmergencyModeEvent has drop, store {
      enabled: bool,
      triggered_by: address,
      reason: String,
      timestamp: u64,
  }
  ```

- [ ] 定义 UpgradeRegisteredEvent 结构体：
  ```move
  struct UpgradeRegisteredEvent has drop, store {
      upgrade_id: u64,
      new_version: String,
      registered_by: address,
      upgrade_time: u64,
      timestamp: u64,
  }
  ```

- [ ] 定义 UpgradeExecutedEvent 结构体：
  ```move
  struct UpgradeExecutedEvent has drop, store {
      upgrade_id: u64,
      old_version: String,
      new_version: String,
      executed_by: address,
      timestamp: u64,
  }
  ```

- [ ] 定义 ProtocolFeeCollectedEvent 结构体：
  ```move
  struct ProtocolFeeCollectedEvent has drop, store {
      fee_amount: u64,
      currency_code: String,
      collector_address: address,
      timestamp: u64,
  }
  ```

- [ ] 定义 RoleAssignedEvent 结构体：
  ```move
  struct RoleAssignedEvent has drop, store {
      account_address: address,
      role: String,
      assigned_by: address,
      timestamp: u64,
  }
  ```

- [ ] 实现事件触发函数

## 高级功能实现

### 多货币支持
- [ ] 实现 add_supported_currency 函数：
  ```move
  public fun add_supported_currency(
      owner: &signer,
      currency_code: String,
  )
  ```
  - [ ] 验证所有者权限
  - [ ] 验证货币代码合法性和唯一性
  - [ ] 添加到支持货币列表
  - [ ] 发出货币支持事件

- [ ] 实现 remove_supported_currency 函数：
  ```move
  public fun remove_supported_currency(
      owner: &signer,
      currency_code: String,
  )
  ```
  - [ ] 验证所有者权限
  - [ ] 验证货币代码存在于支持列表
  - [ ] 验证货币没有活跃使用
  - [ ] 从支持列表中移除
  - [ ] 发出货币移除事件

- [ ] 实现 is_currency_supported 函数：
  ```move
  public fun is_currency_supported(
      currency_code: String,
  ): bool
  ```
  - [ ] 检查货币是否在支持列表中
  - [ ] 返回支持状态

### 系统恢复
- [ ] 实现 system_recovery 函数：
  ```move
  public fun system_recovery(
      owner: &signer,
      recovery_mode: u8,
  )
  ```
  - [ ] 验证所有者权限
  - [ ] 验证恢复模式合法性
  - [ ] 执行恢复操作
  - [ ] 恢复系统状态
  - [ ] 发出系统恢复事件

### 权限管理
- [ ] 实现 is_protocol_owner 函数：
  ```move
  public fun is_protocol_owner(
      account_address: address,
  ): bool
  ```
  - [ ] 检查账户是否为协议所有者
  - [ ] 返回检查结果

- [ ] 实现 has_role 函数：
  ```move
  public fun has_role(
      account_address: address,
      role: String,
  ): bool
  ```
  - [ ] 检查账户是否拥有指定角色
  - [ ] 返回检查结果

- [ ] 实现 require_role 函数：
  ```move
  public fun require_role(
      account: &signer,
      role: String,
  )
  ```
  - [ ] 获取账户地址
  - [ ] 检查账户是否拥有指定角色
  - [ ] 如无角色则终止执行

### 系统状态检查
- [ ] 实现 is_system_normal 函数：
  ```move
  public fun is_system_normal(): bool
  ```
  - [ ] 检查系统是否处于正常状态
  - [ ] 检查非维护模式
  - [ ] 检查非紧急模式
  - [ ] 检查心跳正常
  - [ ] 返回状态结果

- [ ] 实现 require_system_normal 函数：
  ```move
  public fun require_system_normal()
  ```
  - [ ] 调用 is_system_normal 检查系统状态
  - [ ] 如非正常则终止执行

## 与其他模块集成
- [ ] 实现与资产模块的集成：
  - [ ] 提供地址解析服务
  - [ ] 协议费用收取支持
  - [ ] 系统状态通知

- [ ] 实现与治理模块的集成：
  - [ ] 提供版本控制服务
  - [ ] 提供角色管理支持
  - [ ] 系统参数更新接口

- [ ] 实现与安全模块的集成：
  - [ ] 提供紧急模式接口
  - [ ] 提供黑白名单服务
  - [ ] 系统恢复支持

- [ ] 实现与市场模块的集成：
  - [ ] 提供费率配置接口
  - [ ] 提供多货币支持
  - [ ] 系统状态检查

## 测试计划
- [ ] 编写单元测试：
  - [ ] 初始化测试
  - [ ] 账户管理测试
  - [ ] 地址解析测试
  - [ ] 系统管理测试
  - [ ] 版本管理测试
  - [ ] 费用计算测试

- [ ] 编写集成测试：
  - [ ] 与资产模块集成测试
  - [ ] 与治理模块集成测试
  - [ ] 与安全模块集成测试
  - [ ] 系统启动和关闭测试
  - [ ] 恢复流程测试

- [ ] 编写性能测试：
  - [ ] 地址解析性能测试
  - [ ] 权限检查性能测试
  - [ ] 系统心跳性能测试
  - [ ] 高负载下的系统表现测试

## 性能和可扩展性优化
- [ ] 优化地址解析性能
- [ ] 优化权限检查性能
- [ ] 优化心跳机制
- [ ] 实现缓存机制
- [ ] 减少存储访问次数

## 安全审核
- [ ] 审核初始化逻辑
- [ ] 审核权限控制
- [ ] 审核版本管理逻辑
- [ ] 审核紧急模式和恢复机制
- [ ] 审核系统配置逻辑
- [ ] 审核费用计算和收集逻辑 