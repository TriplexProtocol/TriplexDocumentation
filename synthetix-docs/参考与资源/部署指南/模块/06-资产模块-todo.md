# 资产模块实现待办事项

## 数据结构实现

### AssetInfo 结构体
- [ ] 定义 AssetInfo 结构体，包含以下字段：
  - [ ] asset_id: u64（资产唯一标识符）
  - [ ] symbol: String（资产符号）
  - [ ] name: String（资产名称）
  - [ ] decimals: u8（小数位数）
  - [ ] is_synthetic: bool（是否为合成资产）
  - [ ] asset_type: u8（资产类型，1=原生,2=合成,3=LP,...）
  - [ ] admin: address（管理员地址）
  - [ ] paused: bool（是否暂停）
  - [ ] metadata_uri: String（元数据URI）
  - [ ] created_at: u64（创建时间戳）
- [ ] 实现相关访问器函数
- [ ] 实现相关修改器函数

### SyntheticAssetConfig 结构体
- [ ] 定义 SyntheticAssetConfig 结构体，包含以下字段：
  - [ ] asset_id: u64（对应的资产ID）
  - [ ] max_supply: u128（最大供应量）
  - [ ] current_supply: u128（当前供应量）
  - [ ] mint_fee_rate: u64（铸造费率，基点）
  - [ ] burn_fee_rate: u64（销毁费率，基点）
  - [ ] oracle_mapping_id: u64（预言机映射ID）
  - [ ] associated_pool_ids: vector<u64>（关联的流动性池IDs）
- [ ] 实现相关访问器函数
- [ ] 实现相关修改器函数

### AssetRegistry 结构体
- [ ] 定义 AssetRegistry 结构体，包含以下字段：
  - [ ] assets: Table<u64, AssetInfo>（asset_id -> AssetInfo）
  - [ ] symbol_to_id: Table<String, u64>（symbol -> asset_id）
  - [ ] synthetic_configs: Table<u64, SyntheticAssetConfig>（asset_id -> SyntheticAssetConfig）
  - [ ] next_asset_id: u64（下一个可用的资产ID）
- [ ] 实现初始化函数
- [ ] 实现资产注册函数
- [ ] 实现资产查询函数

### AssetBalance 结构体
- [ ] 定义 AssetBalance<phantom AssetType> 结构体，包含以下字段：
  - [ ] asset_id: u64（资产ID）
  - [ ] amount: u128（持有金额）
- [ ] 实现相关访问器函数
- [ ] 实现相关修改器函数

### AssetCap 结构体
- [ ] 定义 MintCap 结构体，包含以下字段：
  - [ ] asset_id: u64（资产ID）
- [ ] 定义 BurnCap 结构体，包含以下字段：
  - [ ] asset_id: u64（资产ID）
- [ ] 实现能力创建和验证函数

## 核心功能实现

### 资产注册功能
- [ ] 实现 register_asset 函数：
  ```move
  public fun register_asset(
      admin: &signer,
      symbol: String,
      name: String, 
      decimals: u8,
      is_synthetic: bool,
      asset_type: u8,
      metadata_uri: String,
  ): u64
  ```
  - [ ] 验证管理员权限
  - [ ] 验证参数合法性
  - [ ] 检查资产符号唯一性
  - [ ] 创建资产信息
  - [ ] 更新资产注册表
  - [ ] 发出资产注册事件
  - [ ] 返回资产ID

### 合成资产配置功能
- [ ] 实现 configure_synthetic_asset 函数：
  ```move
  public fun configure_synthetic_asset(
      admin: &signer,
      asset_id: u64,
      max_supply: u128,
      mint_fee_rate: u64,
      burn_fee_rate: u64,
      oracle_mapping_id: u64,
  )
  ```
  - [ ] 验证管理员权限
  - [ ] 验证参数合法性
  - [ ] 检查资产存在性
  - [ ] 创建或更新合成资产配置
  - [ ] 发出配置更新事件

### 铸造与销毁功能
- [ ] 实现 mint 函数：
  ```move
  public fun mint<AssetType>(
      mint_cap: &MintCap,
      amount: u128,
      recipient: address,
  )
  ```
  - [ ] 验证铸造能力
  - [ ] 验证参数合法性
  - [ ] 检查供应量上限
  - [ ] 计算铸造费用
  - [ ] 创建或更新接收者余额
  - [ ] 更新当前供应量
  - [ ] 发出铸造事件

- [ ] 实现 burn 函数：
  ```move
  public fun burn<AssetType>(
      burn_cap: &BurnCap,
      from: address,
      amount: u128,
  )
  ```
  - [ ] 验证销毁能力
  - [ ] 验证参数合法性
  - [ ] 检查用户余额充足
  - [ ] 计算销毁费用
  - [ ] 更新用户余额
  - [ ] 更新当前供应量
  - [ ] 发出销毁事件

### 资产转移功能
- [ ] 实现 transfer 函数：
  ```move
  public fun transfer<AssetType>(
      from: &signer,
      to: address,
      asset_id: u64,
      amount: u128,
  )
  ```
  - [ ] 验证发送者身份
  - [ ] 验证参数合法性
  - [ ] 检查发送者余额充足
  - [ ] 更新发送者余额
  - [ ] 更新接收者余额
  - [ ] 发出转移事件

## 事件实现
- [ ] 定义 AssetRegisteredEvent 结构体：
  ```move
  struct AssetRegisteredEvent has drop, store {
      asset_id: u64,
      symbol: String,
      name: String,
      is_synthetic: bool,
      asset_type: u8,
      timestamp: u64,
  }
  ```

- [ ] 定义 SyntheticAssetMintedEvent 结构体：
  ```move
  struct SyntheticAssetMintedEvent has drop, store {
      asset_id: u64,
      amount: u128,
      recipient: address,
      fee_amount: u128,
      timestamp: u64,
  }
  ```

- [ ] 定义 SyntheticAssetBurnedEvent 结构体：
  ```move
  struct SyntheticAssetBurnedEvent has drop, store {
      asset_id: u64,
      amount: u128,
      from: address,
      fee_amount: u128,
      timestamp: u64,
  }
  ```

- [ ] 实现事件触发函数

## 查询功能
- [ ] 实现资产信息查询函数
  ```move
  public fun get_asset_info(asset_id: u64): AssetInfo
  ```

- [ ] 实现合成资产配置查询函数
  ```move
  public fun get_synthetic_asset_config(asset_id: u64): SyntheticAssetConfig
  ```

- [ ] 实现资产余额查询函数
  ```move
  public fun get_balance<AssetType>(owner: address, asset_id: u64): u128
  ```

- [ ] 实现资产符号查询函数
  ```move
  public fun get_asset_id_by_symbol(symbol: String): u64
  ```

## 批量操作功能
- [ ] 实现批量铸造函数
  ```move
  public fun batch_mint<AssetType>(
      mint_cap: &MintCap,
      amounts: vector<u128>,
      recipients: vector<address>,
  )
  ```

- [ ] 实现批量销毁函数
  ```move
  public fun batch_burn<AssetType>(
      burn_cap: &BurnCap,
      froms: vector<address>,
      amounts: vector<u128>,
  )
  ```

## 管理功能
- [ ] 实现暂停/恢复资产函数
  ```move
  public fun pause_asset(admin: &signer, asset_id: u64)
  public fun unpause_asset(admin: &signer, asset_id: u64)
  ```

- [ ] 实现更新资产管理员函数
  ```move
  public fun update_asset_admin(admin: &signer, asset_id: u64, new_admin: address)
  ```

- [ ] 实现更新资产元数据函数
  ```move
  public fun update_asset_metadata(admin: &signer, asset_id: u64, new_metadata_uri: String)
  ```

## 与其他模块集成
- [ ] 实现与Oracle模块的集成
  - [ ] 价格查询接口
  - [ ] 价格更新通知

- [ ] 实现与Market模块的集成
  - [ ] 交易接口
  - [ ] 市场操作授权

- [ ] 实现与Pool模块的集成
  - [ ] 流动性池关联
  - [ ] 流动性分配接口

- [ ] 实现与Vault模块的集成
  - [ ] 抵押品管理接口
  - [ ] 清算接口

## 测试计划
- [ ] 编写单元测试
  - [ ] 资产注册测试
  - [ ] 合成资产配置测试
  - [ ] 铸造与销毁测试
  - [ ] 资产转移测试
  - [ ] 查询功能测试
  - [ ] 批量操作测试
  - [ ] 管理功能测试

- [ ] 编写集成测试
  - [ ] 与Oracle模块集成测试
  - [ ] 与Market模块集成测试
  - [ ] 与Vault模块集成测试
  - [ ] 与Pool模块集成测试

## 性能优化
- [ ] 优化数据结构
- [ ] 优化资产查询性能
- [ ] 优化批量操作性能
- [ ] 减少跨模块调用开销

## 安全审核
- [ ] 审核权限控制
- [ ] 审核资产安全性
- [ ] 审核数值计算安全性
- [ ] 审核边界条件处理 