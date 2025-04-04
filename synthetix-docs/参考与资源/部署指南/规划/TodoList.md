# Triplex 项目迁移待办事项清单 (更新版)

## 优先级说明
- 🔴 **紧急**：阻塞其他任务，需要立即处理
- 🟠 **高**：重要且时间敏感，应尽快完成
- 🟡 **中**：重要但不紧急
- 🟢 **低**：可以在资源允许时处理

## 立即开始（1-2周）

### 代码分析与研究 🔴
- [ ] 分析Synthetix V3核心合约结构和互动机制
- [ ] 研究抵押品管理和债务系统
- [ ] 分析合成资产创建机制
- [ ] 研究价格预言机集成方式
- [ ] 理解交易和结算流程
- [ ] 完成Synthetix V3主要模块的功能映射

### 技术准备 🔴
- [ ] 设置完整的Aptos开发环境
- [ ] 安装最新的Move CLI和SDK
- [ ] 配置测试框架
- [ ] 设置CI/CD流程
- [ ] 准备本地测试网环境

### 架构设计 🟠
- [ ] 定义Move资源模型与Solidity合约的对应关系
- [ ] 设计模块间的依赖关系
- [ ] 创建系统架构图
- [ ] 设计数据流程图
- [ ] 定义模块接口规范

## 第一阶段：基础框架（2-4周）

### 核心模块（Core） 🔴
- [x] 实现`errors.move`：定义系统错误代码
- [x] 实现`events.move`：定义事件结构和发射机制
- [x] 实现`access.move`：基于Capability的访问控制
- [x] 实现`math.move`：定点数计算库
- [x] 实现`version.move`：版本控制机制
- [ ] 编写核心模块测试用例

### 工具库开发 🟠
- [x] 实现`decimal.move`：定点数表示和操作
- [x] 实现`table_extensions.move`：表操作扩展
- [x] 实现`safe_math.move`：安全数学运算
- [x] 实现`assertions.move`：断言和验证函数
- [ ] 编写工具库测试用例

### 预言机模块（Oracle） 🟠
- [x] 研究Aptos生态中可用的预言机服务
- [x] 设计价格提供者接口
- [x] 实现`price_feed.move`：价格数据结构和更新机制
- [x] 实现`aggregator.move`：价格聚合逻辑
- [x] 实现`oracle_registry.move`：预言机注册表
- [x] 实现`pyth_adapter.move`：Pyth预言机适配器
- [x] 编写预言机模块测试用例

### 资产标准定义 🟠
- [x] 研究Aptos Fungible Asset标准
- [x] 设计合成资产扩展接口
- [x] 实现`synthetic_asset.move`：合成资产基本定义
- [x] 实现与Fungible Asset标准的兼容层
- [x] 编写资产接口测试用例

## 第二阶段：核心功能（4-6周）

### 抵押品库模块（Vault） 🔴
- [x] 设计抵押品管理逻辑
- [x] 实现`vault_interface.move`
- [x] 实现`vault.move`
- [x] 实现`collateral.move`
- [x] 实现`debt.move`：债务跟踪和管理
- [x] 实现`liquidation.move`：清算机制
- [x] 实现`health_factor.move`：健康因子计算
- [x] 编写抵押品库测试用例和集成测试

### 流动性池模块（Pool） 🟠
- [ ] 实现`pool.move`：池数据结构和基本操作
- [ ] 实现`pool_manager.move`：池管理功能
- [ ] 实现`market_liquidity.move`：市场流动性分配
- [ ] 实现`liquidity_position.move`：流动性位置管理
- [ ] 编写池模块测试用例和集成测试

### 市场模块（Market） 🟡
- [ ] 实现`market.move`：市场数据结构和操作
- [ ] 实现`market_configuration.move`：市场配置
- [ ] 实现`spot_market.move`：现货市场功能
- [ ] 实现`market_registry.move`：市场注册表
- [ ] 编写市场模块测试用例和集成测试

### TypeScript SDK基础 🟡
- [ ] 设计SDK架构和接口
- [ ] 实现核心模块的TypeScript绑定
- [ ] 实现抵押品库和池的交互功能
- [ ] 添加必要的类型定义
- [ ] 创建基本示例和使用文档

## 第三阶段：高级功能（6-8周）

### 永续合约市场（Perps） 🟡
- [ ] 实现`position.move`：头寸数据结构
- [ ] 实现`order.move`：订单管理
- [ ] 实现`funding.move`：资金费率计算
- [ ] 实现`perp_market.move`：永续市场核心逻辑
- [ ] 实现`liquidation_perp.move`：永续合约清算
- [ ] 编写永续合约模块测试用例

### 奖励模块（Rewards） 🟢
- [ ] 实现`rewards.move`：奖励计算和分配
- [ ] 实现`staking.move`：质押机制
- [ ] 实现`fee_distribution.move`：交易费分配
- [ ] 实现`rewards_booster.move`：奖励提升机制
- [ ] 编写奖励模块测试用例

### 治理模块（Governance） 🟢
- [ ] 实现`proposal.move`：提案数据结构和流程
- [ ] 实现`voting.move`：投票机制
- [ ] 实现`parameter_control.move`：参数更新管理
- [ ] 实现`timelock.move`：时间锁定机制
- [ ] 编写治理模块测试用例

### TypeScript SDK增强 🟡
- [ ] 实现与永续合约的交互功能
- [ ] 添加治理和投票功能
- [ ] 添加进阶错误处理
- [ ] 实现事件订阅和监听
- [ ] 扩展示例和文档

## 第四阶段：部署和优化（4-6周）

### 安全和优化 🔴
- [ ] 进行全面代码审查
- [ ] 优化资源使用和存储布局
- [ ] 优化Gas消耗
- [ ] 进行形式化验证
- [ ] 实施安全最佳实践

### 测试网部署 🟠
- [ ] 准备测试网部署脚本
- [ ] 部署核心模块到测试网
- [ ] 部署高级功能到测试网
- [ ] 执行端到端集成测试
- [ ] 解决测试网发现的问题

### 用户界面开发 🟢
- [ ] 设计交易界面原型
- [ ] 实现核心功能界面
- [ ] 实现资产管理界面
- [ ] 实现治理界面
- [ ] 开发移动端适配

### 主网部署准备 🟡
- [ ] 制定主网部署策略
- [ ] 创建部署检查清单
- [ ] 准备回滚计划
- [ ] 设计监控方案
- [ ] 创建运维文档

## 技术挑战与解决方案

### 资产表示转换 🟠
- [x] 研究ERC20与Move资源模型的根本差异
- [x] 设计泛型资产模型（`Asset<T>`）
- [x] 实现资产注册表机制
- [ ] 解决资产元数据存储问题
- [ ] 制定资产升级策略

### 权限管理 🔴
- [x] 设计基于Capability的权限系统
- [x] 实现多级权限结构
- [ ] 设计模块间授权机制
- [ ] 实现时间锁和紧急暂停功能
- [ ] 测试权限边界和极限情况

### 预言机集成 🟠
- [x] 评估Pyth、Switchboard等预言机在Aptos上的表现
- [x] 设计价格数据校验机制
- [x] 实现价格更新频率控制
- [x] 解决价格滞后和操纵风险
- [ ] 设计失败恢复机制

### 跨链资产桥接 🟢
- [ ] 研究Aptos与以太坊的资产桥接方案
- [ ] 设计跨链消息验证机制
- [ ] 实现资产锁定和释放逻辑
- [ ] 设计跨链安全保障措施
- [ ] 测试跨链交互场景

## 长期发展规划

### 生态系统扩展 🟢
- [ ] 开发与其他Aptos DeFi协议的集成
- [ ] 实现跨链流动性合成
- [ ] 开发高级衍生品市场
- [ ] 研究Layer 2扩展方案
- [ ] 探索实物资产代币化

### 社区与治理 🟢
- [ ] 设计社区参与机制
- [ ] 实现提案讨论平台
- [ ] 开发治理仪表板
- [ ] 创建开发者激励计划
- [ ] 建立技术分享和教育渠道

## 项目进展（更新于 2023年4月20日）

- 已完成核心模块的基础文件：errors.move、events.move、access.move、math.move、version.move
- 已完成所有工具库模块：decimal.move、table_extensions.move、safe_math.move、assertions.move
- 已完成预言机模块的基础框架和测试：price_feed.move、aggregator.move、oracle_registry.move、pyth_adapter.move
- 已完成资产标准定义和合成资产基本实现：asset_interface.move、synthetic_asset.move
- 已完成抵押品库模块的基础框架和测试：vault_interface.move、vault.move、collateral.move
- 下一步计划：开始开发流动性池模块和市场模块

> 注：本清单将根据项目进展和新需求不断更新。每周进行一次进度审核和优先级调整。 