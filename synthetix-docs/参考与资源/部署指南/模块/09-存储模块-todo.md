# 存储模块实现待办事项

## 数据结构实现

### StorageSchema 结构体
- [ ] 定义 StorageSchema 结构体，包含以下字段：
  - [ ] schema_id: u64（模式ID）
  - [ ] name: String（模式名称）
  - [ ] version: u64（模式版本）
  - [ ] field_names: vector<String>（字段名列表）
  - [ ] field_types: vector<u8>（字段类型列表，使用类型代码）
  - [ ] indices: vector<u64>（索引字段ID列表）
  - [ ] creator: address（创建者地址）
  - [ ] created_at: u64（创建时间戳）
- [ ] 实现相关访问器函数
- [ ] 实现相关修改器函数

### StorageRecord 结构体
- [ ] 定义 StorageRecord 结构体，包含以下字段：
  - [ ] record_id: u128（记录ID）
  - [ ] schema_id: u64（模式ID）
  - [ ] owner: address（所有者地址）
  - [ ] data: vector<vector<u8>>（序列化的数据列表）
  - [ ] created_at: u64（创建时间）
  - [ ] updated_at: u64（最后更新时间）
  - [ ] is_deleted: bool（是否已删除标记）
- [ ] 实现相关访问器函数
- [ ] 实现相关修改器函数

### StorageIndex 结构体
- [ ] 定义 StorageIndex 结构体，包含以下字段：
  - [ ] schema_id: u64（模式ID）
  - [ ] field_index: u64（字段索引）
  - [ ] value_hash: vector<u8>（值哈希）
  - [ ] record_ids: vector<u128>（记录ID列表）
- [ ] 实现相关访问器函数
- [ ] 实现相关修改器函数

### StorageRegistry 结构体
- [ ] 定义 StorageRegistry 结构体，包含以下字段：
  - [ ] schemas: Table<u64, StorageSchema>（模式ID -> StorageSchema）
  - [ ] records: Table<u128, StorageRecord>（记录ID -> StorageRecord）
  - [ ] indices: Table<vector<u8>, StorageIndex>（索引键 -> StorageIndex）
  - [ ] schema_names: Table<String, u64>（模式名称 -> 模式ID）
  - [ ] next_schema_id: u64（下一个可用模式ID）
  - [ ] next_record_id: u128（下一个可用记录ID）
- [ ] 定义 IndexKey 实用函数，生成索引键
- [ ] 实现初始化函数
- [ ] 实现模式注册函数
- [ ] 实现记录注册函数

### StorageConfig 结构体
- [ ] 定义 StorageConfig 结构体，包含以下字段：
  - [ ] max_schema_name_length: u64（模式名称最大长度）
  - [ ] max_field_name_length: u64（字段名称最大长度）
  - [ ] max_field_count: u64（单个模式的最大字段数）
  - [ ] max_index_count: u64（单个模式的最大索引数）
  - [ ] max_record_data_size: u64（单条记录的最大数据大小）
  - [ ] admin: address（管理员地址）
- [ ] 实现相关访问器函数
- [ ] 实现相关修改器函数

### StorageQuery 结构体
- [ ] 定义 StorageQuery 结构体，包含以下字段：
  - [ ] schema_id: u64（查询目标模式ID）
  - [ ] conditions: vector<QueryCondition>（查询条件列表）
  - [ ] limit: u64（结果限制数量）
  - [ ] offset: u64（结果偏移量）
- [ ] 定义 QueryCondition 结构体，包含以下字段：
  - [ ] field_index: u64（字段索引）
  - [ ] operator: u8（操作符，如等于、大于等）
  - [ ] value: vector<u8>（比较值）
- [ ] 实现查询解析函数
- [ ] 实现条件匹配函数

## 核心功能实现

### 模式管理功能
- [ ] 实现 create_schema 函数：
  ```move
  public fun create_schema(
      creator: &signer,
      name: String,
      field_names: vector<String>,
      field_types: vector<u8>,
      indices: vector<u64>,
  ): u64
  ```
  - [ ] 验证模式名称唯一性
  - [ ] 验证字段名称和类型合法性
  - [ ] 验证索引字段合法性
  - [ ] 创建模式结构
  - [ ] 存储模式信息
  - [ ] 发出模式创建事件
  - [ ] 返回模式ID

- [ ] 实现 update_schema 函数：
  ```move
  public fun update_schema(
      owner: &signer,
      schema_id: u64,
      new_field_names: vector<String>,
      new_field_types: vector<u8>,
      new_indices: vector<u64>,
  ): u64
  ```
  - [ ] 验证更新权限
  - [ ] 验证模式存在性
  - [ ] 验证新字段的合法性
  - [ ] 验证更新的兼容性（不允许不兼容更改）
  - [ ] 创建新版本的模式
  - [ ] 更新模式信息
  - [ ] 发出模式更新事件
  - [ ] 返回新版本号

- [ ] 实现 deprecate_schema 函数：
  ```move
  public fun deprecate_schema(
      owner: &signer,
      schema_id: u64,
  )
  ```
  - [ ] 验证废弃权限
  - [ ] 验证模式存在性
  - [ ] 标记模式为废弃状态
  - [ ] 发出模式废弃事件

### 记录管理功能
- [ ] 实现 create_record 函数：
  ```move
  public fun create_record(
      creator: &signer,
      schema_id: u64,
      data: vector<vector<u8>>,
  ): u128
  ```
  - [ ] 验证模式存在性
  - [ ] 验证数据与模式匹配
  - [ ] 创建记录结构
  - [ ] 存储记录信息
  - [ ] 更新索引
  - [ ] 发出记录创建事件
  - [ ] 返回记录ID

- [ ] 实现 update_record 函数：
  ```move
  public fun update_record(
      owner: &signer,
      record_id: u128,
      new_data: vector<vector<u8>>,
  )
  ```
  - [ ] 验证更新权限
  - [ ] 验证记录存在性
  - [ ] 验证数据与模式匹配
  - [ ] 更新记录信息
  - [ ] 更新索引
  - [ ] 发出记录更新事件

- [ ] 实现 delete_record 函数：
  ```move
  public fun delete_record(
      owner: &signer,
      record_id: u128,
  )
  ```
  - [ ] 验证删除权限
  - [ ] 验证记录存在性
  - [ ] 标记记录为删除状态
  - [ ] 更新索引
  - [ ] 发出记录删除事件

- [ ] 实现 transfer_record 函数：
  ```move
  public fun transfer_record(
      owner: &signer,
      record_id: u128,
      new_owner: address,
  )
  ```
  - [ ] 验证转移权限
  - [ ] 验证记录存在性
  - [ ] 更新记录所有者
  - [ ] 发出记录转移事件

### 索引管理功能
- [ ] 实现 create_index 函数：
  ```move
  public fun create_index(
      admin: &signer,
      schema_id: u64,
      field_index: u64,
  )
  ```
  - [ ] 验证管理员权限
  - [ ] 验证模式存在性
  - [ ] 验证字段索引合法性
  - [ ] 创建索引结构
  - [ ] 初始化索引数据（对现有记录）
  - [ ] 更新模式索引信息
  - [ ] 发出索引创建事件

- [ ] 实现 update_index 内部函数：
  ```move
  fun update_index(
      schema_id: u64,
      field_index: u64,
      old_value: Option<vector<u8>>,
      new_value: Option<vector<u8>>,
      record_id: u128,
  )
  ```
  - [ ] 验证索引存在性
  - [ ] 从旧值索引中移除记录ID
  - [ ] 向新值索引中添加记录ID
  - [ ] 更新索引存储

- [ ] 实现 rebuild_index 函数：
  ```move
  public fun rebuild_index(
      admin: &signer,
      schema_id: u64,
      field_index: u64,
  )
  ```
  - [ ] 验证管理员权限
  - [ ] 验证索引存在性
  - [ ] 清空现有索引
  - [ ] 重建索引数据（遍历所有记录）
  - [ ] 发出索引重建事件

### 查询功能
- [ ] 实现 query_records 函数：
  ```move
  public fun query_records(
      query: StorageQuery,
  ): vector<u128>
  ```
  - [ ] 解析查询条件
  - [ ] 执行索引查询（对索引字段）
  - [ ] 执行全表扫描（对非索引字段）
  - [ ] 结果排序和分页
  - [ ] 返回符合条件的记录ID列表

- [ ] 实现 query_records_with_data 函数：
  ```move
  public fun query_records_with_data(
      query: StorageQuery,
  ): (vector<u128>, vector<vector<vector<u8>>>)
  ```
  - [ ] 调用 query_records 获取记录ID
  - [ ] 加载记录数据
  - [ ] 返回记录ID和数据对

- [ ] 实现 get_record_by_id 函数：
  ```move
  public fun get_record_by_id(
      record_id: u128,
  ): Option<StorageRecord>
  ```
  - [ ] 验证记录存在性
  - [ ] 返回记录信息

### 批量操作功能
- [ ] 实现 batch_create_records 函数：
  ```move
  public fun batch_create_records(
      creator: &signer,
      schema_id: u64,
      data_batch: vector<vector<vector<u8>>>,
  ): vector<u128>
  ```
  - [ ] 验证模式存在性
  - [ ] 批量验证数据
  - [ ] 批量创建记录
  - [ ] 批量更新索引
  - [ ] 发出批量创建事件
  - [ ] 返回记录ID列表

- [ ] 实现 batch_update_records 函数：
  ```move
  public fun batch_update_records(
      owner: &signer,
      record_ids: vector<u128>,
      data_batch: vector<vector<vector<u8>>>,
  )
  ```
  - [ ] 验证更新权限
  - [ ] 批量验证记录
  - [ ] 批量更新记录
  - [ ] 批量更新索引
  - [ ] 发出批量更新事件

- [ ] 实现 batch_delete_records 函数：
  ```move
  public fun batch_delete_records(
      owner: &signer,
      record_ids: vector<u128>,
  )
  ```
  - [ ] 验证删除权限
  - [ ] 批量验证记录
  - [ ] 批量标记记录为删除状态
  - [ ] 批量更新索引
  - [ ] 发出批量删除事件

## 事件实现
- [ ] 定义 SchemaCreatedEvent 结构体：
  ```move
  struct SchemaCreatedEvent has drop, store {
      schema_id: u64,
      name: String,
      creator: address,
      field_count: u64,
      index_count: u64,
      timestamp: u64,
  }
  ```

- [ ] 定义 SchemaUpdatedEvent 结构体：
  ```move
  struct SchemaUpdatedEvent has drop, store {
      schema_id: u64,
      new_version: u64,
      updater: address,
      new_field_count: u64,
      new_index_count: u64,
      timestamp: u64,
  }
  ```

- [ ] 定义 RecordCreatedEvent 结构体：
  ```move
  struct RecordCreatedEvent has drop, store {
      record_id: u128,
      schema_id: u64,
      creator: address,
      timestamp: u64,
  }
  ```

- [ ] 定义 RecordUpdatedEvent 结构体：
  ```move
  struct RecordUpdatedEvent has drop, store {
      record_id: u128,
      schema_id: u64,
      updater: address,
      timestamp: u64,
  }
  ```

- [ ] 定义 RecordDeletedEvent 结构体：
  ```move
  struct RecordDeletedEvent has drop, store {
      record_id: u128,
      schema_id: u64,
      deleter: address,
      timestamp: u64,
  }
  ```

- [ ] 实现事件触发函数

## 高级功能实现

### 模式版本控制
- [ ] 实现模式版本兼容性检查：
  ```move
  fun check_schema_compatibility(
      old_schema: &StorageSchema,
      new_field_names: &vector<String>,
      new_field_types: &vector<u8>,
  ): bool
  ```
  - [ ] 检查字段数量变化
  - [ ] 检查字段类型兼容性
  - [ ] 检查索引字段兼容性
  - [ ] 返回兼容性结果

- [ ] 实现记录迁移功能：
  ```move
  public fun migrate_record(
      owner: &signer,
      record_id: u128,
      target_schema_version: u64,
      migration_data: vector<vector<u8>>,
  )
  ```
  - [ ] 验证迁移权限
  - [ ] 验证目标模式版本
  - [ ] 验证迁移数据
  - [ ] 执行记录迁移
  - [ ] 更新索引
  - [ ] 发出记录迁移事件

### 访问控制
- [ ] 实现权限检查功能：
  ```move
  fun check_permission(
      actor: address,
      record_id: u128,
      permission_type: u8,
  ): bool
  ```
  - [ ] 检查所有者权限
  - [ ] 检查委托权限
  - [ ] 检查公共权限
  - [ ] 返回权限检查结果

- [ ] 实现权限授予功能：
  ```move
  public fun grant_permission(
      owner: &signer,
      record_id: u128,
      grantee: address,
      permission_type: u8,
  )
  ```
  - [ ] 验证所有者权限
  - [ ] 验证记录存在性
  - [ ] 授予指定权限
  - [ ] 发出权限授予事件

- [ ] 实现权限撤销功能：
  ```move
  public fun revoke_permission(
      owner: &signer,
      record_id: u128,
      grantee: address,
      permission_type: u8,
  )
  ```
  - [ ] 验证所有者权限
  - [ ] 验证记录存在性
  - [ ] 撤销指定权限
  - [ ] 发出权限撤销事件

### 数据验证
- [ ] 实现类型验证功能：
  ```move
  fun validate_data_types(
      schema: &StorageSchema,
      data: &vector<vector<u8>>,
  ): bool
  ```
  - [ ] 验证数据项数量
  - [ ] 验证数据类型匹配
  - [ ] 验证数据格式合法
  - [ ] 返回验证结果

- [ ] 实现高级验证规则功能：
  ```move
  public fun add_validation_rule(
      admin: &signer,
      schema_id: u64,
      rule_type: u8,
      rule_params: vector<u8>,
  ): u64
  ```
  - [ ] 验证管理员权限
  - [ ] 验证模式存在性
  - [ ] 添加验证规则
  - [ ] 发出规则添加事件
  - [ ] 返回规则ID

## 查询功能优化
- [ ] 实现复合索引查询：
  ```move
  public fun query_by_composite_index(
      schema_id: u64,
      field_indices: vector<u64>,
      values: vector<vector<u8>>,
  ): vector<u128>
  ```
  - [ ] 验证复合索引存在性
  - [ ] 构建复合索引键
  - [ ] 执行索引查询
  - [ ] 返回记录ID列表

- [ ] 实现范围查询功能：
  ```move
  public fun query_by_range(
      schema_id: u64,
      field_index: u64,
      start_value: Option<vector<u8>>,
      end_value: Option<vector<u8>>,
      include_start: bool,
      include_end: bool,
  ): vector<u128>
  ```
  - [ ] 验证字段索引存在性
  - [ ] 验证值类型合法性
  - [ ] 执行范围查询
  - [ ] 返回记录ID列表

- [ ] 实现全文搜索功能：
  ```move
  public fun full_text_search(
      schema_id: u64,
      field_index: u64,
      search_text: String,
  ): vector<u128>
  ```
  - [ ] 验证字段索引存在性
  - [ ] 验证字段类型为文本
  - [ ] 执行文本搜索
  - [ ] 返回记录ID列表

## 统计功能
- [ ] 实现模式统计功能：
  ```move
  public fun get_schema_statistics(
      schema_id: u64,
  ): (u64, u64, u64) // 记录总数, 活跃记录数, 已删除记录数
  ```
  - [ ] 验证模式存在性
  - [ ] 统计记录数量
  - [ ] 返回统计结果

- [ ] 实现存储统计功能：
  ```move
  public fun get_storage_statistics(): (u64, u64, u128, u128) // 模式数, 索引数, 记录数, 总存储大小
  ```
  - [ ] 统计模式数量
  - [ ] 统计索引数量
  - [ ] 统计记录数量
  - [ ] 估算存储大小
  - [ ] 返回统计结果

- [ ] 实现用户统计功能：
  ```move
  public fun get_user_statistics(
      user: address,
  ): (u64, u64, u64) // 创建的模式数, 拥有的记录数, 已删除的记录数
  ```
  - [ ] 统计用户创建的模式
  - [ ] 统计用户拥有的记录
  - [ ] 返回统计结果

## 与其他模块集成
- [ ] 实现与资产模块的集成：
  - [ ] 资产元数据存储接口
  - [ ] 资产交易记录接口

- [ ] 实现与奖励模块的集成：
  - [ ] 奖励计算数据存储接口
  - [ ] 用户奖励记录接口

- [ ] 实现与治理模块的集成：
  - [ ] 提案存储接口
  - [ ] 投票记录存储接口

## 测试计划
- [ ] 编写单元测试：
  - [ ] 模式管理功能测试
  - [ ] 记录管理功能测试
  - [ ] 索引管理功能测试
  - [ ] 查询功能测试
  - [ ] 权限控制测试
  - [ ] 数据验证测试

- [ ] 编写集成测试：
  - [ ] 批量操作测试
  - [ ] 性能测试
  - [ ] 容错测试
  - [ ] 与其他模块集成测试

- [ ] 编写压力测试：
  - [ ] 大数据量测试
  - [ ] 并发访问测试
  - [ ] 资源限制测试

## 性能优化
- [ ] 优化索引存储结构
- [ ] 优化查询算法
- [ ] 实现查询缓存机制
- [ ] 优化批量操作性能
- [ ] 减少存储访问次数

## 安全审核
- [ ] 审核权限控制逻辑
- [ ] 审核数据验证逻辑
- [ ] 审核资源管理
- [ ] 审核错误处理
- [ ] 审核边界条件
- [ ] 审核潜在攻击向量 