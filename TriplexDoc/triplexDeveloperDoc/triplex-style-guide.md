# Triplex协议设计风格指南

本文档定义了Triplex协议用户界面的设计风格标准，确保所有页面保持一致的视觉语言和用户体验。

## 颜色系统

### 主色调

```css
--primary-color: #1a73e8;        /* 主要操作、按钮、链接 */
--secondary-color: #4285f4;      /* 次要元素、悬停状态 */
```

### 背景色

```css
--background-color: #111827;     /* 页面背景 */
--card-color: #1f2937;           /* 卡片、面板背景 */
```

### 文本色

```css
--text-color: #e5e7eb;           /* 主要文本 */
--text-secondary: #9ca3af;       /* 次要文本、说明 */
```

### 边框色

```css
--border-color: #374151;         /* 分隔线、边框 */
```

### 状态色

```css
--success-color: #10b981;        /* 成功、积极 */
--warning-color: #f59e0b;        /* 警告、需注意 */
--danger-color: #ef4444;         /* 危险、错误 */
```

## 排版

### 字体家族

```css
font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
```

### 文本大小

- 大标题: `2em - 3em`
- 中标题: `1.5em - 2em`
- 小标题: `1.2em - 1.5em`
- 正文: `1em`
- 说明文本: `0.9em`
- 小文本: `0.8em`

### 行高

```css
line-height: 1.6;
```

## 间距系统

- 极小间距: `5px`
- 小间距: `10px`
- 中间距: `20px`
- 大间距: `30px`
- 特大间距: `60px`

## 布局组件

### 容器

```css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}
```

### 卡片

```css
.card {
    background-color: var(--card-color);
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 30px;
}
```

### 网格系统

```css
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}
```

### 弹性布局

```css
.flex {
    display: flex;
    gap: 20px;
}

.flex.column {
    flex-direction: column;
}

.flex.center {
    align-items: center;
    justify-content: center;
}

.flex.between {
    justify-content: space-between;
}
```

## 交互元素

### 按钮

#### 主要按钮

```css
.action-button.primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.action-button.primary:hover {
    background-color: var(--secondary-color);
}
```

#### 次要按钮

```css
.action-button.secondary {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--text-color);
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.action-button.secondary:hover {
    background-color: rgba(255, 255, 255, 0.15);
}
```

#### 危险按钮

```css
.action-button.danger {
    background-color: rgba(239, 68, 68, 0.15);
    color: var(--danger-color);
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.action-button.danger:hover {
    background-color: rgba(239, 68, 68, 0.25);
}
```

### 输入框

```css
.form-input {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background-color: rgba(255, 255, 255, 0.05);
    color: var(--text-color);
    font-size: 16px;
}

.form-input:focus {
    outline: none;
    border-color: var(--primary-color);
}
```

### 选择器

```css
.form-select {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background-color: rgba(255, 255, 255, 0.05);
    color: var(--text-color);
    font-size: 16px;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%239ca3af' viewBox='0 0 16 16'%3E%3Cpath d='M2 5l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
}

.form-select:focus {
    outline: none;
    border-color: var(--primary-color);
}
```

### 开关按钮

```css
.toggle-switch {
    position: relative;
    display: inline-block;
    width: 46px;
    height: 24px;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.1);
    transition: .4s;
    border-radius: 24px;
}

.toggle-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .toggle-slider {
    background-color: var(--primary-color);
}

input:checked + .toggle-slider:before {
    transform: translateX(22px);
}
```

### 标签

```css
.status-tag {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.8em;
    font-weight: 500;
}

.tag-success {
    background-color: rgba(16, 185, 129, 0.1);
    color: var(--success-color);
}

.tag-warning {
    background-color: rgba(245, 158, 11, 0.1);
    color: var(--warning-color);
}

.tag-danger {
    background-color: rgba(239, 68, 68, 0.1);
    color: var(--danger-color);
}

.tag-info {
    background-color: rgba(59, 130, 246, 0.1);
    color: var(--primary-color);
}
```

## 表格样式

```css
.table-container {
    overflow-x: auto;
    margin-top: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th {
    text-align: left;
    padding: 12px;
    color: var(--text-secondary);
    font-weight: 500;
    border-bottom: 1px solid var(--border-color);
}

td {
    padding: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

tr:hover {
    background-color: rgba(255, 255, 255, 0.03);
}
```

## 导航组件

### 主导航

```css
.nav-links {
    display: flex;
    gap: 30px;
}

.nav-links a {
    color: var(--text-color);
    text-decoration: none;
    font-weight: 500;
}

.nav-links a:hover {
    color: var(--primary-color);
}
```

### 侧边导航

```css
.sidebar {
    width: 250px;
    background-color: var(--card-color);
    border-radius: 12px;
    padding: 20px;
    height: fit-content;
}

.menu-item {
    padding: 12px 15px;
    border-radius: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.menu-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.menu-item.active {
    background-color: rgba(26, 115, 232, 0.2);
    color: var(--primary-color);
    font-weight: 600;
}
```

### 标签页

```css
.tabs {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 25px;
}

.tab {
    padding: 12px 20px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    font-weight: 500;
    transition: all 0.2s ease;
}

.tab.active {
    border-bottom-color: var(--primary-color);
    color: var(--primary-color);
}

.tab:hover {
    background-color: rgba(255, 255, 255, 0.03);
}
```

## 图标系统

我们使用Feather Icons作为主要图标库，保持简洁一致的风格。

```html
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- 图标内容 -->
</svg>
```

## 响应式设计

### 断点

- 移动设备: `< 640px`
- 平板设备: `640px - 768px`
- 小桌面: `768px - 1024px`
- 大桌面: `> 1024px`

### 媒体查询

```css
@media (max-width: 768px) {
    .main-content {
        flex-direction: column;
    }
    
    .sidebar {
        width: 100%;
    }
}
```

## 动画与过渡

### 标准过渡

```css
transition: all 0.3s ease;
```

### 悬停效果

```css
.card:hover {
    transform: translateY(-5px);
}
```

## 阴影

```css
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
```

## 无障碍设计

- 所有交互元素必须有足够的对比度
- 确保焦点状态清晰可见
- 所有表单元素应有标签
- 图标应配有文本说明或aria-label
- 避免单纯依靠颜色传递信息

## 品牌元素

### Logo

- 主色: `#1a73e8`
- 最小尺寸: `24px x 24px`
- 保护空间: Logo周围至少保留其高度的1/2

### 图形元素

- 圆角半径: `8px`
- 图标线条粗细: `2px`

## 示例代码使用

```html
<div class="card">
    <h2>资产组合</h2>
    <div class="portfolio-grid">
        <div class="portfolio-card">
            <div class="portfolio-header">
                <div class="portfolio-asset">
                    <div class="asset-icon">A</div>
                    <div>APT</div>
                </div>
                <div>$48,250</div>
            </div>
            <div class="portfolio-detail">
                <!-- 内容 -->
            </div>
            <div class="portfolio-actions">
                <button class="action-button primary">管理</button>
                <button class="action-button secondary">借更多</button>
            </div>
        </div>
    </div>
</div>
``` 