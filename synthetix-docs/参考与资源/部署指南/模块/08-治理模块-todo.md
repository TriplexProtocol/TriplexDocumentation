# 治理模块实现待办事项

## 数据结构实现

### Proposal 结构体
- [ ] 定义 Proposal 结构体，包含以下字段：
  - [ ] proposal_id: u64（提案ID）
  - [ ] title: String（提案标题）
  - [ ] description: String（提案描述）
  - [ ] proposer: address（提案者地址）
  - [ ] for_votes: u128（赞成票数）
  - [ ] against_votes: u128（反对票数）
  - [ ] abstain_votes: u128（弃权票数）
  - [ ] created_at: u64（创建时间）
  - [ ] voting_starts_at: u64（投票开始时间）
  - [ ] voting_ends_at: u64（投票结束时间）
  - [ ] executed_at: u64（执行时间，0表示未执行）
  - [ ] status: u8（状态，1=活跃,2=通过,3=失败,4=已执行,5=取消）
  - [ ] execution_hash: vector<u8>（执行哈希）
  - [ ] execution_data: vector<u8>（执行数据，编码的操作）
  - [ ] metadata_uri: String（提案元数据URI）
- [ ] 实现相关访问器函数
- [ ] 实现相关修改器函数

### Vote 结构体
- [ ] 定义 Vote 结构体，包含以下字段：
  - [ ] voter: address（投票者地址）
  - [ ] proposal_id: u64（提案ID）
  - [ ] vote_type: u8（投票类型，1=赞成,2=反对,3=弃权）
  - [ ] vote_weight: u128（投票权重）
  - [ ] timestamp: u64（投票时间）
- [ ] 实现相关访问器函数
- [ ] 实现相关修改器函数

### GovernanceConfig 结构体
- [ ] 定义 GovernanceConfig 结构体，包含以下字段：
  - [ ] voting_delay: u64（提案创建到投票开始的延迟，秒）
  - [ ] voting_period: u64（投票持续时间，秒）
  - [ ] proposal_threshold: u128（创建提案所需最低代币数量）
  - [ ] quorum_votes: u128（提案通过所需最低投票数）
  - [ ] timelock_delay: u64（提案通过到执行的延迟，秒）
  - [ ] min_proposal_description_length: u64（提案描述最小长度）
  - [ ] max_proposal_description_length: u64（提案描述最大长度）
  - [ ] admin: address（管理员地址）
- [ ] 实现相关访问器函数
- [ ] 实现相关修改器函数

### GovernanceRegistry 结构体
- [ ] 定义 GovernanceRegistry 结构体，包含以下字段：
  - [ ] proposals: Table<u64, Proposal>（proposal_id -> Proposal）
  - [ ] votes: Table<VoteKey, Vote>（(voter, proposal_id) -> Vote）
  - [ ] voter_stakes: Table<address, u128>（voter -> staked_amount）
  - [ ] next_proposal_id: u64（下一个可用的提案ID）
  - [ ] config: GovernanceConfig（治理配置）
- [ ] 定义 VoteKey 结构体，包含以下字段：
  - [ ] voter: address（投票者地址）
  - [ ] proposal_id: u64（提案ID）
- [ ] 实现初始化函数
- [ ] 实现提案注册函数
- [ ] 实现投票注册函数

### ExecutionCap 结构体
- [ ] 定义 ExecutionCap 结构体，包含以下字段：
  - [ ] module_name: String（目标模块名称）
  - [ ] function_name: String（目标函数名称）
- [ ] 实现能力创建和验证函数

## 核心功能实现

### 提案管理功能
- [ ] 实现 create_proposal 函数：
  ```move
  public fun create_proposal(
      proposer: &signer,
      title: String,
      description: String,
      execution_hash: vector<u8>,
      execution_data: vector<u8>,
      metadata_uri: String,
  ): u64
  ```
  - [ ] 验证提案者权限（检查代币持有量）
  - [ ] 验证提案参数合法性
  - [ ] 创建提案
  - [ ] 计算投票开始和结束时间
  - [ ] 存储提案信息
  - [ ] 发出提案创建事件
  - [ ] 返回提案ID

- [ ] 实现 cancel_proposal 函数：
  ```move
  public fun cancel_proposal(
      proposer: &signer,
      proposal_id: u64,
  )
  ```
  - [ ] 验证提案者身份
  - [ ] 验证提案状态（只能取消活跃状态的提案）
  - [ ] 更新提案状态为已取消
  - [ ] 发出提案取消事件

- [ ] 实现 queue_proposal 函数：
  ```move
  public fun queue_proposal(
      proposal_id: u64,
  )
  ```
  - [ ] 验证提案存在性
  - [ ] 验证提案已通过且未执行
  - [ ] 将提案加入执行队列
  - [ ] 更新提案状态
  - [ ] 发出提案队列事件

- [ ] 实现 execute_proposal 函数：
  ```move
  public fun execute_proposal(
      executor: &signer,
      proposal_id: u64,
  )
  ```
  - [ ] 验证提案存在性
  - [ ] 验证提案已通过队列且可执行
  - [ ] 验证时间锁已过期
  - [ ] 执行提案中的操作
  - [ ] 更新提案状态为已执行
  - [ ] 发出提案执行事件

### 投票系统功能
- [ ] 实现 cast_vote 函数：
  ```move
  public fun cast_vote(
      voter: &signer,
      proposal_id: u64,
      vote_type: u8,
  )
  ```
  - [ ] 验证投票者身份
  - [ ] 验证提案处于投票期
  - [ ] 验证投票类型合法
  - [ ] 计算投票权重
  - [ ] 存储投票信息
  - [ ] 更新提案投票计数
  - [ ] 发出投票事件

- [ ] 实现 delegate_votes 函数：
  ```move
  public fun delegate_votes(
      delegator: &signer,
      delegate: address,
      amount: u128,
  )
  ```
  - [ ] 验证委托者身份
  - [ ] 验证委托数量合法
  - [ ] 更新委托关系
  - [ ] 更新委托者和被委托者的投票权重
  - [ ] 发出委托事件

### 代币质押功能
- [ ] 实现 stake_tokens 函数：
  ```move
  public fun stake_tokens(
      staker: &signer,
      amount: u128,
  )
  ```
  - [ ] 验证质押者身份
  - [ ] 验证质押数量合法
  - [ ] 转移代币到质押合约
  - [ ] 更新质押者的投票权重
  - [ ] 发出质押事件

- [ ] 实现 unstake_tokens 函数：
  ```move
  public fun unstake_tokens(
      staker: &signer,
      amount: u128,
  )
  ```
  - [ ] 验证质押者身份
  - [ ] 验证赎回数量合法
  - [ ] 检查赎回限制条件
  - [ ] 转移代币回质押者
  - [ ] 更新质押者的投票权重
  - [ ] 发出赎回事件

### 配置管理功能
- [ ] 实现 update_governance_config 函数：
  ```move
  public fun update_governance_config(
      admin: &signer,
      new_voting_delay: u64,
      new_voting_period: u64,
      new_proposal_threshold: u128,
      new_quorum_votes: u128,
      new_timelock_delay: u64,
  )
  ```
  - [ ] 验证管理员权限
  - [ ] 验证参数合法性
  - [ ] 更新治理配置
  - [ ] 发出配置更新事件

## 事件实现
- [ ] 定义 ProposalCreatedEvent 结构体：
  ```move
  struct ProposalCreatedEvent has drop, store {
      proposal_id: u64,
      proposer: address,
      title: String,
      description: String,
      voting_starts_at: u64,
      voting_ends_at: u64,
      timestamp: u64,
  }
  ```

- [ ] 定义 VoteCastEvent 结构体：
  ```move
  struct VoteCastEvent has drop, store {
      proposal_id: u64,
      voter: address,
      vote_type: u8,
      vote_weight: u128,
      timestamp: u64,
  }
  ```

- [ ] 定义 ProposalExecutedEvent 结构体：
  ```move
  struct ProposalExecutedEvent has drop, store {
      proposal_id: u64,
      executor: address,
      execution_hash: vector<u8>,
      timestamp: u64,
  }
  ```

- [ ] 定义 TokensStakedEvent 结构体：
  ```move
  struct TokensStakedEvent has drop, store {
      staker: address,
      amount: u128,
      total_stake: u128,
      timestamp: u64,
  }
  ```

- [ ] 实现事件触发函数

## 高级功能实现

### 提案执行机制
- [ ] 实现提案执行解析功能：
  ```move
  public fun parse_execution_data(execution_data: vector<u8>): (String, String, vector<u8>)
  ```
  - [ ] 解析执行数据，提取模块名、函数名和参数
  - [ ] 验证执行数据格式
  - [ ] 返回解析结果

- [ ] 实现动态调用功能：
  ```move
  public fun dynamic_call(
      module_name: String,
      function_name: String,
      args: vector<u8>,
      execution_cap: &ExecutionCap,
  )
  ```
  - [ ] 验证执行能力
  - [ ] 执行动态调用
  - [ ] 处理调用结果

### 投票委托系统
- [ ] 实现投票委托关系管理：
  ```move
  public fun get_delegated_vote_weight(voter: address): u128
  ```
  - [ ] 计算直接质押的投票权
  - [ ] 计算委托获得的投票权
  - [ ] 返回总投票权重

- [ ] 实现批量委托查询：
  ```move
  public fun get_delegators(delegate: address): vector<address>
  ```
  - [ ] 查询委托给指定账户的所有委托者
  - [ ] 返回委托者列表

### 时间加权投票
- [ ] 实现时间加权投票计算：
  ```move
  public fun calculate_time_weighted_vote(
      stake_amount: u128,
      stake_duration: u64,
  ): u128
  ```
  - [ ] 基于质押时间计算投票权重加成
  - [ ] 计算最终加权投票权重
  - [ ] 返回加权结果

## 查询功能
- [ ] 实现提案查询函数：
  ```move
  public fun get_proposal(proposal_id: u64): Proposal
  ```

- [ ] 实现投票查询函数：
  ```move
  public fun get_vote(voter: address, proposal_id: u64): Vote
  ```

- [ ] 实现提案状态查询函数：
  ```move
  public fun get_proposal_state(proposal_id: u64): u8
  ```

- [ ] 实现用户投票权重查询函数：
  ```move
  public fun get_voting_power(voter: address): u128
  ```

- [ ] 实现提案列表查询函数：
  ```move
  public fun get_active_proposals(): vector<u64>
  ```

## 治理分析功能
- [ ] 实现投票统计函数：
  ```move
  public fun get_voting_statistics(proposal_id: u64): (u128, u128, u128, u128) // (for, against, abstain, total)
  ```

- [ ] 实现参与度分析函数：
  ```move
  public fun get_participation_rate(proposal_id: u64): u128 // 基点表示
  ```

- [ ] 实现治理健康度评估函数：
  ```move
  public fun get_governance_health_metrics(): (u128, u128, u128) // (活跃度, 通过率, 参与率)
  ```

## 管理功能
- [ ] 实现紧急取消提案功能：
  ```move
  public fun emergency_cancel_proposal(
      admin: &signer,
      proposal_id: u64,
      reason: String,
  )
  ```
  - [ ] 验证管理员权限
  - [ ] 取消提案，无论状态如何
  - [ ] 记录取消原因
  - [ ] 发出紧急取消事件

- [ ] 实现治理参数批量更新：
  ```move
  public fun batch_update_governance_params(
      admin: &signer,
      param_keys: vector<String>,
      param_values: vector<vector<u8>>,
  )
  ```
  - [ ] 验证管理员权限
  - [ ] 批量更新指定参数
  - [ ] 发出参数更新事件

## 与其他模块集成
- [ ] 实现与资产模块的集成：
  - [ ] 质押代币接口
  - [ ] 查询代币余额接口

- [ ] 实现与奖励模块的集成：
  - [ ] 治理参与奖励机制
  - [ ] 质押奖励分配接口

- [ ] 实现与系统各模块的参数管理集成：
  - [ ] 通用参数更新接口
  - [ ] 模块配置查询接口

## 测试计划
- [ ] 编写单元测试：
  - [ ] 提案功能测试
  - [ ] 投票功能测试
  - [ ] 执行功能测试
  - [ ] 配置管理测试
  - [ ] 查询功能测试
  - [ ] 委托功能测试

- [ ] 编写集成测试：
  - [ ] 与代币模块集成测试
  - [ ] 与系统模块集成测试
  - [ ] 全流程测试
  - [ ] 边界条件测试

- [ ] 编写治理模拟测试：
  - [ ] 模拟复杂投票场景
  - [ ] 模拟参数调整提案
  - [ ] 模拟代码升级提案

## UI和API支持
- [ ] 优化事件设计以支持前端展示：
  - [ ] 完善事件字段
  - [ ] 设计事件间关联

- [ ] 实现丰富的查询接口：
  - [ ] 分页查询支持
  - [ ] 过滤器支持
  - [ ] 排序支持

- [ ] 设计用户友好的治理交互：
  - [ ] 提案创建向导
  - [ ] 投票分析工具
  - [ ] 治理仪表盘

## 性能优化
- [ ] 优化投票存储结构
- [ ] 优化提案状态计算
- [ ] 优化执行逻辑
- [ ] 减少存储访问次数

## 安全审核
- [ ] 审核提案验证逻辑
- [ ] 审核投票权重计算
- [ ] 审核执行权限控制
- [ ] 审核时间锁机制
- [ ] 审核攻击防护措施
- [ ] 审核奥妙攻击向量 