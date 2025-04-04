# Triplex协议测试执行计划

## 测试环境配置

### 开发环境
- **操作系统**：Ubuntu 20.04 LTS / macOS 12.0以上
- **Move编译器**：v1.5.0
- **Aptos框架**：v1.2.0
- **测试工具**：Move单元测试框架

### 测试环境准备步骤
1. 克隆最新代码库至本地
   ```bash
   git clone https://github.com/triplex-protocol/triplex-contract.git
   cd triplex-contract
   ```

2. 安装测试依赖
   ```bash
   ./scripts/install_dependencies.sh
   ```

3. 编译合约代码
   ```bash
   aptos move compile
   ```

## 测试执行流程

### 单元测试执行
我们将分模块执行单元测试，确保每个模块的功能符合预期。

1. **预言机集成模块**
   ```bash
   aptos move test --package-dir . --filter oracle_tests
   ```

2. **债务报告系统模块**
   ```bash
   aptos move test --package-dir . --filter debt_report_tests
   ```

3. **流动性池管理模块**
   ```bash
   aptos move test --package-dir . --filter liquidity_pool_tests
   ```

4. **资金费率模块**
   ```bash
   aptos move test --package-dir . --filter funding_rate_tests
   ```

5. **清算机制模块**
   ```bash
   aptos move test --package-dir . --filter liquidation_tests
   ```

6. **执行所有测试**
   ```bash
   aptos move test --package-dir .
   ```

### 测试覆盖率分析
执行以下命令收集测试覆盖率数据：
   ```bash
   aptos move test --package-dir . --coverage
   aptos move coverage summary
   ```

### 测试结果记录
每次测试执行后，将结果记录到相应的测试结果文件中：
- `test_results_oracle.md`
- `test_results_debt.md`
- `test_results_liquidity.md`
- `test_results_funding.md`
- `test_results_liquidation.md`

## 测试步骤详解

### 1. 预言机集成模块测试

| 测试用例ID | 测试名称 | 测试命令 | 预期结果 |
|-----------|---------|---------|---------|
| TC-OC-001 | 验证预言机系统初始化 | `aptos move test --package-dir . --filter test_oracle_system_initialize` | 测试通过，无错误 |
| TC-OC-101 | 验证注册新预言机 | `aptos move test --package-dir . --filter test_register_oracle` | 测试通过，无错误 |
| TC-OC-201 | 验证更新资产价格 | `aptos move test --package-dir . --filter test_update_asset_price` | 测试通过，无错误 |
| TC-OC-301 | 验证价格偏差检测 | `aptos move test --package-dir . --filter test_price_deviation_detection` | 测试通过，无错误 |
| TC-OC-401 | 验证获取资产价格优先级机制 | `aptos move test --package-dir . --filter test_price_priority_mechanism` | 测试通过，无错误 |
| TC-OC-501 | 验证价格过期检测 | `aptos move test --package-dir . --filter test_price_expiration_detection` | 测试通过，无错误 |

### 2. 债务报告系统模块测试

| 测试用例ID | 测试名称 | 测试命令 | 预期结果 |
|-----------|---------|---------|---------|
| TC-DR-001 | 验证债务报告系统初始化 | `aptos move test --package-dir . --filter test_debt_report_system_initialize` | 测试通过，无错误 |
| TC-DR-101 | 验证创建新债务报告 | `aptos move test --package-dir . --filter test_create_debt_report` | 测试通过，无错误 |
| TC-DR-201 | 验证更新债务金额 | `aptos move test --package-dir . --filter test_update_debt_amount` | 测试通过，无错误 |
| TC-DR-301 | 验证更新抵押品金额 | `aptos move test --package-dir . --filter test_update_collateral_amount` | 测试通过，无错误 |
| TC-DR-401 | 验证关闭债务报告 | `aptos move test --package-dir . --filter test_close_debt_report` | 测试通过，无错误 |
| TC-DR-501 | 验证非所有者操作权限控制 | `aptos move test --package-dir . --filter test_non_owner_permission_control` | 测试通过，无错误 |

### 3. 流动性池管理模块测试

| 测试用例ID | 测试名称 | 测试命令 | 预期结果 |
|-----------|---------|---------|---------|
| TC-LP-001 | 验证普通用户无法创建流动性池 | `aptos move test --package-dir . --filter test_normal_user_cannot_create_pool` | 测试通过，无错误 |
| TC-LP-002 | 验证管理员成功创建流动性池 | `aptos move test --package-dir . --filter test_admin_create_pool` | 测试通过，无错误 |
| TC-LP-101 | 验证正常添加流动性 | `aptos move test --package-dir . --filter test_add_liquidity` | 测试通过，无错误 |
| TC-LP-201 | 验证正常移除流动性 | `aptos move test --package-dir . --filter test_remove_liquidity` | 测试通过，无错误 |
| TC-LP-301 | 验证暂停池功能 | `aptos move test --package-dir . --filter test_pause_pool` | 测试通过，无错误 |

### 4. 资金费率模块测试

| 测试用例ID | 测试名称 | 测试命令 | 预期结果 |
|-----------|---------|---------|---------|
| TC-FR-001 | 验证资金费率系统初始化 | `aptos move test --package-dir . --filter test_funding_rate_system_initialize` | 测试通过，无错误 |
| TC-FR-101 | 验证设置资金费率周期 | `aptos move test --package-dir . --filter test_set_funding_rate_interval` | 测试通过，无错误 |
| TC-FR-201 | 验证资金费率计算 | `aptos move test --package-dir . --filter test_funding_rate_calculation` | 测试通过，无错误 |
| TC-FR-301 | 验证资金费率结算 | `aptos move test --package-dir . --filter test_funding_rate_settlement` | 测试通过，无错误 |
| TC-FR-401 | 验证资金费率历史记录 | `aptos move test --package-dir . --filter test_funding_rate_history` | 测试通过，无错误 |

### 5. 清算机制模块测试

| 测试用例ID | 测试名称 | 测试命令 | 预期结果 |
|-----------|---------|---------|---------|
| TC-LQ-001 | 验证清算系统初始化 | `aptos move test --package-dir . --filter test_liquidation_system_initialize` | 测试通过，无错误 |
| TC-LQ-101 | 验证清算阈值设置 | `aptos move test --package-dir . --filter test_set_liquidation_threshold` | 测试通过，无错误 |
| TC-LQ-201 | 验证触发清算条件 | `aptos move test --package-dir . --filter test_liquidation_condition` | 测试通过，无错误 |
| TC-LQ-301 | 验证清算执行过程 | `aptos move test --package-dir . --filter test_liquidation_execution` | 测试通过，无错误 |
| TC-LQ-401 | 验证清算奖励分配 | `aptos move test --package-dir . --filter test_liquidation_reward` | 测试通过，无错误 |
| TC-LQ-501 | 验证紧急清算功能 | `aptos move test --package-dir . --filter test_emergency_liquidation` | 测试通过，无错误 |

## 问题跟踪与修复流程

1. **问题发现**
   - 记录失败的测试用例
   - 描述预期与实际结果的差异
   - 记录错误堆栈和日志

2. **问题分析**
   - 复现问题
   - 定位问题根源
   - 确定修复方案

3. **修复实施**
   - 实施代码修复
   - 更新单元测试
   - 编写回归测试

4. **验证修复**
   - 重新运行失败的测试
   - 执行回归测试
   - 确认修复有效性

## 测试时间表

| 阶段 | 开始日期 | 结束日期 | 负责人 |
|-----|---------|---------|-------|
| 环境准备 | 2023-07-05 | 2023-07-06 | 测试团队 |
| 预言机模块测试 | 2023-07-07 | 2023-07-08 | 王工 |
| 债务报告模块测试 | 2023-07-09 | 2023-07-10 | 李工 |
| 流动性池模块测试 | 2023-07-11 | 2023-07-12 | 张工 |
| 资金费率模块测试 | 2023-07-13 | 2023-07-14 | 赵工 |
| 清算机制模块测试 | 2023-07-15 | 2023-07-16 | 刘工 |
| 问题修复与回归测试 | 2023-07-17 | 2023-07-20 | 所有人 |
| 测试报告生成 | 2023-07-21 | 2023-07-22 | 测试负责人 |

## 测试输出物

1. 测试执行结果报告
2. 测试覆盖率报告
3. 问题跟踪清单
4. 修复验证报告

---

*计划编制日期：2023-07-05*
*计划版本：v1.0* 