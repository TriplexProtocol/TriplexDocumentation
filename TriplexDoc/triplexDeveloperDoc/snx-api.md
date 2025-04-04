# snx-api 项目索引

snx-api 是 TriplexPro 生态系统中的 API 服务项目，提供关于 Synthetix 协议的数据和功能接口，使前端应用能够获取链上数据。

## 项目结构

### 核心目录

- **src/** - 源代码目录
  - **routes/** - API 路由定义
  - `server.js` (175行) - 主服务器代码
  - `swagger.js` (36行) - API 文档配置
  - `utils.js` (182行) - 工具函数

- **scripts/** - 辅助脚本

- **public/** - 静态资源文件

- **nginx/** - Nginx 配置

### 配置文件

- `package.json` (42行) - 项目依赖和脚本
- `docker-compose.yml` (67行) - Docker 主配置
- `docker-compose.dev.yml` (66行) - 开发环境 Docker 配置
- `api.envexample` (44行) - API 环境变量示例
- `Dockerfile` (17行) - 生产环境 Docker 构建配置
- `Dockerfile.dev` (18行) - 开发环境 Docker 构建配置

## 主要功能

1. **数据查询** - 提供 Synthetix 协议的链上数据
2. **状态查询** - 获取系统当前状态和配置
3. **用户数据** - 查询用户在系统中的仓位和余额
4. **市场数据** - 获取市场价格和交易量
5. **API 文档** - 提供 Swagger 格式的 API 文档

## 技术栈

- Node.js - 运行时环境
- Express - Web 服务器框架
- Docker - 容器化部署
- Redis - 缓存层
- Nginx - 反向代理和负载均衡

## API 端点

主要的 API 端点包括：

- **/v1/markets** - 市场相关数据
- **/v1/users** - 用户相关数据
- **/v1/stats** - 系统统计数据
- **/v1/prices** - 价格数据
- **/health** - 服务健康检查
- **/docs** - API 文档 (Swagger UI)

## 集成点

- 与以太坊区块链交互获取数据
- 与 Synthetix V3 合约集成
- 为 TriplexFrontend 提供数据接口
- 为 liquidity-ui 提供流动性数据

## 部署和运行

### 本地开发

1. 安装依赖
   ```bash
   pnpm install
   ```

2. 配置环境变量
   ```bash
   cp api.envexample .env
   # 编辑.env文件添加必要的配置
   ```

3. 启动开发服务器
   ```bash
   pnpm dev
   ```

### Docker 部署

1. 构建镜像
   ```bash
   docker-compose build
   ```

2. 启动服务
   ```bash
   docker-compose up -d
   ```

## 性能优化

- 使用 Redis 缓存频繁请求的数据
- 优化区块链调用减少 RPC 请求
- 实现数据分页避免大型响应
- 压缩 API 响应减少带宽使用

## 安全措施

- 请求速率限制防止滥用
- API 密钥认证
- 数据验证和消毒
- 错误处理和监控

## 监控和日志

- 详细的请求日志记录
- 性能指标收集
- 健康检查端点
- 错误追踪和报警 