# 奖励模块实现待办事项

## 数据结构实现

### RewardPool 结构体
- [ ] 定义 RewardPool 结构体，包含以下字段：
  - [ ] pool_id: u64（奖励池ID）
  - [ ] name: String（奖励池名称）
  - [ ] reward_type: u8（奖励类型，1=质押,2=流动性,3=交易）
  - [ ] reward_asset_id: u64（奖励资产ID）
  - [ ] total_rewards: u128（总奖励数量）
  - [ ] remaining_rewards: u128（剩余奖励数量）
  - [ ] start_time: u64（开始时间戳）
  - [ ] end_time: u64（结束时间戳）
  - [ ] last_update_time: u64（最后更新时间戳）
  - [ ] distribution_rate: u128（每秒分配率）
  - [ ] target_id: u64（关联目标ID，如池ID、市场ID等）
  - [ ] admin: address（管理员地址）
- [ ] 实现相关访问器函数
- [ ] 实现相关修改器函数

### UserRewardState 结构体
- [ ] 定义 UserRewardState 结构体，包含以下字段：
  - [ ] user: address（用户地址）
  - [ ] pool_id: u64（奖励池ID）
  - [ ] reward_per_token_paid: u128（已支付的每单位代币奖励）
  - [ ] rewards: u128（已累积的奖励）
  - [ ] stake_amount: u128（质押/参与数量）
  - [ ] last_action_time: u64（最后操作时间）
- [ ] 实现相关访问器函数
- [ ] 实现相关修改器函数

### RewardPoolRegistry 结构体
- [ ] 定义 RewardPoolRegistry 结构体，包含以下字段：
  - [ ] pools: Table<u64, RewardPool>（pool_id -> RewardPool）
  - [ ] user_states: Table<UserStateKey, UserRewardState>（(user, pool_id) -> UserRewardState）
  - [ ] next_pool_id: u64（下一个可用的奖励池ID）
- [ ] 定义 UserStateKey 结构体，包含以下字段：
  - [ ] user: address（用户地址）
  - [ ] pool_id: u64（奖励池ID）
- [ ] 实现初始化函数
- [ ] 实现奖励池注册函数
- [ ] 实现用户状态注册函数

### RewardsModule 结构体
- [ ] 定义 RewardsModule 结构体，包含以下字段：
  - [ ] registry: RewardPoolRegistry
  - [ ] admin_cap: AdminCapability
- [ ] 定义 AdminCapability 结构体（管理员权限能力）
- [ ] 实现模块初始化函数
- [ ] 实现管理员能力转移函数

## 核心功能实现

### 奖励池管理功能
- [ ] 实现 create_reward_pool 函数：
  ```move
  public fun create_reward_pool(
      admin: &signer,
      name: String,
      reward_type: u8,
      reward_asset_id: u64,
      total_rewards: u128,
      start_time: u64,
      end_time: u64,
      distribution_rate: u128,
      target_id: u64,
  ): u64
  ```
  - [ ] 验证管理员权限
  - [ ] 验证参数合法性
  - [ ] 创建奖励池
  - [ ] 存储奖励池信息
  - [ ] 发出奖励池创建事件
  - [ ] 返回奖励池ID

- [ ] 实现 fund_reward_pool 函数：
  ```move
  public fun fund_reward_pool(
      admin: &signer,
      pool_id: u64,
      amount: u128,
  )
  ```
  - [ ] 验证管理员权限
  - [ ] 验证参数合法性
  - [ ] 验证奖励池存在性
  - [ ] 转移奖励资产到奖励池
  - [ ] 更新奖励池信息
  - [ ] 发出奖励池资金添加事件

- [ ] 实现 update_reward_pool 函数：
  ```move
  public fun update_reward_pool(
      admin: &signer,
      pool_id: u64,
      new_end_time: u64,
      new_distribution_rate: u128,
  )
  ```
  - [ ] 验证管理员权限
  - [ ] 验证参数合法性
  - [ ] 验证奖励池存在性
  - [ ] 更新奖励池参数
  - [ ] 发出奖励池更新事件

### 奖励计算与分发功能
- [ ] 实现 update_reward 函数：
  ```move
  public fun update_reward(
      pool_id: u64,
      user: address,
  )
  ```
  - [ ] 验证奖励池存在性
  - [ ] 计算新的奖励金额
  - [ ] 更新用户奖励状态
  - [ ] 更新奖励池状态

- [ ] 实现 get_earned_rewards 函数：
  ```move
  public fun get_earned_rewards(
      pool_id: u64,
      user: address,
  ): u128
  ```
  - [ ] 验证奖励池存在性
  - [ ] 验证用户状态存在性
  - [ ] 计算用户应得奖励
  - [ ] 返回奖励金额

- [ ] 实现 claim_rewards 函数：
  ```move
  public fun claim_rewards(
      user: &signer,
      pool_id: u64,
  )
  ```
  - [ ] 验证用户身份
  - [ ] 验证奖励池存在性
  - [ ] 更新用户奖励（调用update_reward）
  - [ ] 计算可领取奖励
  - [ ] 转移奖励代币到用户账户
  - [ ] 更新用户奖励状态
  - [ ] 发出奖励领取事件

### 质押相关功能
- [ ] 实现 stake 函数：
  ```move
  public fun stake(
      user: &signer,
      pool_id: u64,
      amount: u128,
  )
  ```
  - [ ] 验证用户身份
  - [ ] 验证参数合法性
  - [ ] 验证奖励池存在性
  - [ ] 更新用户奖励（调用update_reward）
  - [ ] 转移质押代币到奖励池
  - [ ] 更新用户质押信息
  - [ ] 发出质押事件

- [ ] 实现 withdraw 函数：
  ```move
  public fun withdraw(
      user: &signer,
      pool_id: u64,
      amount: u128,
  )
  ```
  - [ ] 验证用户身份
  - [ ] 验证参数合法性
  - [ ] 验证奖励池存在性
  - [ ] 验证用户质押充足
  - [ ] 更新用户奖励（调用update_reward）
  - [ ] 转移质押代币回用户账户
  - [ ] 更新用户质押信息
  - [ ] 发出提取事件

## 事件实现
- [ ] 定义 RewardPoolCreatedEvent 结构体：
  ```move
  struct RewardPoolCreatedEvent has drop, store {
      pool_id: u64,
      name: String,
      reward_type: u8,
      reward_asset_id: u64,
      total_rewards: u128,
      start_time: u64,
      end_time: u64,
      distribution_rate: u128,
      target_id: u64,
      timestamp: u64,
  }
  ```

- [ ] 定义 RewardPoolFundedEvent 结构体：
  ```move
  struct RewardPoolFundedEvent has drop, store {
      pool_id: u64,
      amount: u128,
      timestamp: u64,
  }
  ```

- [ ] 定义 RewardsClaimedEvent 结构体：
  ```move
  struct RewardsClaimedEvent has drop, store {
      pool_id: u64,
      user: address,
      amount: u128,
      timestamp: u64,
  }
  ```

- [ ] 定义 StakeEvent 结构体：
  ```move
  struct StakeEvent has drop, store {
      pool_id: u64,
      user: address,
      amount: u128,
      timestamp: u64,
  }
  ```

- [ ] 定义 WithdrawEvent 结构体：
  ```move
  struct WithdrawEvent has drop, store {
      pool_id: u64,
      user: address,
      amount: u128,
      timestamp: u64,
  }
  ```

- [ ] 实现事件触发函数

## 高级功能实现

### 质押奖励系统
- [ ] 实现自动复投功能：
  ```move
  public fun auto_compound(
      user: &signer,
      pool_id: u64,
  )
  ```
  - [ ] 验证用户身份
  - [ ] 验证奖励池存在性
  - [ ] 计算可领取奖励
  - [ ] 自动将奖励转换为质押
  - [ ] 更新用户质押和奖励状态
  - [ ] 发出复投事件

### 流动性奖励系统
- [ ] 实现流动性提供奖励计算函数：
  ```move
  public fun calculate_liquidity_rewards(
      pool_id: u64,
      lp_address: address,
      liquidity_amount: u128,
  ): u128
  ```
  - [ ] 验证奖励池存在性
  - [ ] 验证流动性池存在性
  - [ ] 计算基于提供流动性的奖励
  - [ ] 返回奖励金额

### 交易奖励系统
- [ ] 实现交易奖励记录函数：
  ```move
  public fun record_trading_activity(
      market_id: u64,
      trader: address,
      volume: u128,
  )
  ```
  - [ ] 验证市场存在性
  - [ ] 记录交易量
  - [ ] 更新相关奖励池状态
  - [ ] 更新用户交易状态

## 查询功能
- [ ] 实现奖励池信息查询函数：
  ```move
  public fun get_reward_pool_info(pool_id: u64): RewardPool
  ```

- [ ] 实现用户奖励状态查询函数：
  ```move
  public fun get_user_reward_state(user: address, pool_id: u64): UserRewardState
  ```

- [ ] 实现用户质押信息查询函数：
  ```move
  public fun get_user_stake_amount(user: address, pool_id: u64): u128
  ```

- [ ] 实现奖励分配率查询函数：
  ```move
  public fun get_current_reward_rate(pool_id: u64): u128
  ```

## 统计和分析功能
- [ ] 实现奖励分配统计函数：
  ```move
  public fun get_total_distributed_rewards(pool_id: u64): u128
  ```

- [ ] 实现用户参与度分析函数：
  ```move
  public fun get_user_participation_metrics(
      user: address,
      pool_ids: vector<u64>,
  ): vector<(u64, u128, u128)> // (pool_id, stake_amount, total_claimed)
  ```

## 管理功能
- [ ] 实现暂停/恢复奖励池函数：
  ```move
  public fun pause_reward_pool(admin: &signer, pool_id: u64)
  public fun unpause_reward_pool(admin: &signer, pool_id: u64)
  ```

- [ ] 实现批量更新奖励池函数：
  ```move
  public fun batch_update_reward_pools(
      admin: &signer,
      pool_ids: vector<u64>,
      new_end_times: vector<u64>,
      new_distribution_rates: vector<u128>,
  )
  ```

## 与其他模块集成
- [ ] 实现与资产模块的集成：
  - [ ] 奖励代币转移接口
  - [ ] 质押代币转移接口

- [ ] 实现与质押模块的集成：
  - [ ] 质押状态通知接口
  - [ ] 质押奖励计算接口

- [ ] 实现与池模块的集成：
  - [ ] 流动性提供通知接口
  - [ ] 流动性奖励计算接口

- [ ] 实现与市场模块的集成：
  - [ ] 交易活动通知接口
  - [ ] 交易奖励计算接口

## 测试计划
- [ ] 编写单元测试：
  - [ ] 奖励池管理测试
  - [ ] 奖励计算测试
  - [ ] 质押功能测试
  - [ ] 奖励领取测试
  - [ ] 查询功能测试
  - [ ] 统计功能测试

- [ ] 编写集成测试：
  - [ ] 与资产模块集成测试
  - [ ] 与质押模块集成测试
  - [ ] 与池模块集成测试
  - [ ] 与市场模块集成测试

- [ ] 编写系统负载测试：
  - [ ] 大量用户同时参与测试
  - [ ] 高频奖励更新测试
  - [ ] 大规模奖励分发测试

## 性能优化
- [ ] 优化奖励计算算法
- [ ] 优化批量操作性能
- [ ] 减少存储访问次数
- [ ] 优化gas消耗

## 安全审核
- [ ] 审核精度处理
- [ ] 审核溢出保护
- [ ] 审核重入防护
- [ ] 审核分配公平性
- [ ] 审核时间戳操纵防护
- [ ] 审核资源管理安全性 