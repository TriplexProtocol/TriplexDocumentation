# Triplex协议网站导航地图

## 主要导航结构

```
首页 (index.html)
├── 抵押借贷
│   ├── 抵押品管理 (triplex-collateral-management.html)
│   ├── 借贷头寸 (triplex-position-management.html)
│   └── 风险管理 (triplex-liquidation-risk.html)
│
├── 合成资产
│   ├── 资产市场 (triplex-synthetic-assets.html)
│   ├── 市场概览 (triplex-synthetic-market.html)
│   ├── 资产详情 (triplex-asset-detail.html)
│   └── 资产赎回 (triplex-asset-redemption.html)
│
├── 流动性挖矿 (triplex-liquidity-mining.html)
│
├── 治理
│   ├── 治理主页 (triplex-governance.html)
│   └── 提案详情页 (未实现)
│
├── 数据分析 (triplex-analytics.html)
│   └── 预言机数据 (triplex-oracle-data.html)
│
└── 用户中心
    ├── 个人概览 (triplex-user-profile.html)
    ├── 通知中心 (triplex-notifications.html)
    ├── 帮助中心 (triplex-help-center.html)
    └── 设置 (triplex-settings.html)
```

## 用户流程图

### 1. 新用户入门流程

```
首页 (index.html)
↓
帮助中心 (triplex-help-center.html) - 了解基本概念
↓
连接钱包
↓
抵押品管理 (triplex-collateral-management.html) - 存入抵押品
↓
合成资产市场 (triplex-synthetic-assets.html) - 铸造合成资产
↓
个人概览 (triplex-user-profile.html) - 查看资产状态
```

### 2. 合成资产创建流程

```
抵押品管理 (triplex-collateral-management.html) - 确认抵押品充足
↓
合成资产市场 (triplex-synthetic-assets.html) - 选择要铸造的资产
↓
资产详情 (triplex-asset-detail.html) - 了解资产参数
↓
铸造合成资产
↓
个人概览 (triplex-user-profile.html) - 查看新铸造的资产
```

### 3. 流动性挖矿参与流程

```
流动性挖矿 (triplex-liquidity-mining.html) - 查看可用的流动性池
↓
选择流动性池
↓
存入资产
↓
领取收益
↓
个人概览 (triplex-user-profile.html) - 查看收益状态
```

### 4. 治理参与流程

```
治理 (triplex-governance.html) - 浏览活跃提案
↓
查看提案详情
↓
参与投票
↓
跟踪提案进展
```

### 5. 风险管理流程

```
个人概览 (triplex-user-profile.html) - 查看资产状况
↓
借贷头寸 (triplex-position-management.html) - 检查健康因子
↓
风险管理 (triplex-liquidation-risk.html) - 了解清算风险
↓
抵押品管理 (triplex-collateral-management.html) - 调整抵押率
```

## 主要用户场景

1. **合成资产交易者**：主要使用合成资产相关页面和市场数据页面
2. **流动性提供者**：主要使用流动性挖矿页面和收益分析
3. **治理参与者**：关注治理页面和提案投票
4. **抵押借贷用户**：侧重使用抵押品管理和风险监控页面
5. **被动投资者**：通过数据分析和市场概览做决策

## 主要功能入口分布

- **顶部导航栏**：主要功能模块入口
- **侧边菜单**：当前模块的子功能导航
- **用户菜单**：个人中心、设置、通知等用户相关功能
- **底部链接**：文档、社区和支持资源

## 响应式设计适配

- **桌面版**：完整功能展示，多列布局
- **平板版**：保留主要功能，简化部分复杂数据展示
- **移动版**：核心功能优先，采用单列布局和折叠菜单

## 未来扩展页面

1. **高级交易页面**：提供更丰富的交易工具和图表
2. **社区论坛集成**：直接访问和参与社区讨论
3. **多链桥接页面**：支持跨链资产转移
4. **协议健康仪表板**：更全面的协议状态监控
5. **开发者工具与API文档**：面向开发者的集成资源 