# synthetix-assets 项目索引

synthetix-assets 是 TriplexPro 生态系统中的资产管理模块，提供合成资产和代币的图标和元数据，支持前端界面和文档。

## 项目结构

### 核心目录

- **synths/** - 合成资产图标目录
  - 包含大量的 `.svg` 文件，例如：
    - `sBTC.svg` - 合成比特币图标
    - `sETH.svg` - 合成以太坊图标
    - `sUSD.svg` - 合成美元图标
    - `sXAU.svg` - 合成黄金图标
    - 其他合成资产图标
  - **png/** - PNG格式的图标

- **collateral/** - 抵押品资产图标

- **markets/** - 市场相关资产图标

- **leveraged-tokens/** - 杠杆代币图标

- **snx/** - Synthetix 相关资产图标

- **synthetix/** - Synthetix 核心品牌资产

### 资产文件

- `all-assets.html` (479行) - 所有资产的预览页面
- `test-assets.html` (78行) - 测试资产的预览页面

### 配置文件

- `package.json` (21行) - 项目依赖和脚本
- `svgo.config.js` (29行) - SVG 优化配置
- `.yarnrc.yml` (23行) - Yarn 配置

## 主要功能

1. **资产可视化** - 提供各种合成资产的图形表示
2. **品牌支持** - 为 Synthetix 和 Triplex 提供品牌资产
3. **前端集成** - 为前端应用提供统一的资产图标库
4. **文档支持** - 为文档和营销材料提供资产

## 资产分类

### 合成资产 (synths/)

- **加密货币** - sBTC, sETH, sSOL, sBNB 等
- **法定货币** - sUSD, sEUR, sAUD, sKRW 等
- **商品** - sXAU (黄金), sXAG (白银), sOIL (石油) 等
- **股票** - sTSLA, sAAPL, sMSFT, sAMZN 等
- **指数** - sDEFI, sCEX 等

### 杠杆资产 (以 "i" 前缀)

- iETH, iBTC, iLINK 等 - 反向价格跟踪的资产

### 抵押品 (collateral/)

- 可用作系统抵押品的资产图标

## 技术规范

- SVG 和 PNG 格式图标
- 统一的设计语言和风格
- 优化的图像尺寸
- 支持浅色和深色模式

## 集成点

- 与 TriplexFrontend 集成 - 提供用户界面资产图标
- 与 TriplexDoc 集成 - 为文档提供资产图示
- 与 synthetix-v3 集成 - 匹配合约中定义的资产

## 使用方法

### 在前端项目中使用

```js
import { ReactComponent as EthIcon } from 'synthetix-assets/synths/sETH.svg';

function AssetIcon() {
  return <EthIcon width={24} height={24} />;
}
```

### 直接链接

资产可以通过路径直接引用：

```
https://assets.synthetix.io/synths/sETH.svg
```

## 贡献指南

添加新资产需要遵循以下步骤：

1. 准备符合标准的 SVG 文件
2. 使用 SVGO 进行优化
3. 添加到相应的目录
4. 更新资产预览页面 