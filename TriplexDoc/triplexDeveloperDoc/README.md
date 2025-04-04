# Triplex协议开发者文档与界面指南

本仓库包含Triplex去中心化合成资产协议的开发者文档和用户界面示例。

## 项目结构

项目分为多个HTML页面，每个页面对应协议的一个功能模块：

### 核心功能页面

1. **首页** (`index.html`)
   - 协议概述
   - 主要功能展示
   - 快速入门指南
   - 生态系统合作伙伴

2. **合成资产相关**
   - 合成资产市场 (`triplex-synthetic-assets.html`)
   - 合成资产市场 (`triplex-synthetic-market.html`)
   - 资产详情页 (`triplex-asset-detail.html`)
   - 资产赎回页 (`triplex-asset-redemption.html`)

3. **抵押品管理** (`triplex-collateral-management.html`)
   - 抵押品存入
   - 抵押品提取
   - 抵押率调整
   - 健康因子监控

4. **流动性挖矿** (`triplex-liquidity-mining.html`)
   - 流动性池概览
   - 质押管理
   - 奖励领取
   - 收益计算

5. **风险管理** (`triplex-liquidation-risk.html`)
   - 清算风险监控
   - 清算历史
   - 风险参数
   - 安全指南

6. **预言机数据** (`triplex-oracle-data.html`)
   - 价格数据展示
   - 数据源信息
   - 历史价格走势
   - 更新频率

7. **头寸管理** (`triplex-position-management.html`)
   - 合成资产头寸
   - 借贷头寸
   - 头寸历史
   - 盈亏计算

### 辅助功能页面

1. **治理页面** (`triplex-governance.html`)
   - 提案列表
   - 投票功能
   - 治理统计
   - 提案创建

2. **数据分析仪表板** (`triplex-analytics.html`)
   - 协议概览
   - 资产分析
   - 用户统计
   - 风险指标

3. **帮助中心** (`triplex-help-center.html`)
   - 使用指南
   - 常见问题
   - 联系支持
   - 教程资源

4. **用户个人中心** (`triplex-user-profile.html`)
   - 用户资产概览
   - 交易历史
   - 借贷头寸
   - 收益统计

5. **通知中心** (`triplex-notifications.html`)
   - 系统公告
   - 安全提醒
   - 活动推广
   - 通知设置

6. **设置页面** (`triplex-settings.html`)
   - 个人偏好
   - 安全设置
   - 设备管理
   - 高级设置

## 技术说明

- 界面使用纯HTML、CSS构建，便于理解和扩展
- 响应式设计，适配不同设备尺寸
- 暗色主题，减少眼睛疲劳
- 统一的设计语言，确保用户体验一致性

## 设计原则

1. **简洁明了**：界面简洁，信息层次清晰
2. **功能完备**：包含协议所有核心功能
3. **用户友好**：操作流程直观，降低学习成本
4. **风险突出**：风险信息明显展示，防止用户误操作
5. **数据透明**：所有关键数据公开透明

## 如何使用

直接在浏览器中打开HTML文件即可查看界面设计。这些界面可以作为前端开发的参考或原型，集成到实际的Web3应用中。

## 后续开发计划

- 添加JavaScript交互逻辑
- 集成Web3钱包连接功能
- 对接智能合约API
- 实现实时数据更新
- 添加多语言支持

## 贡献指南

欢迎提交PR或Issue来完善文档和界面。在贡献前，请先阅读本文档了解项目结构。

## 许可证

MIT 