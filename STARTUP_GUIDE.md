# 魔法道具工坊 - 启动指南

## 📋 前置要求

本项目需要以下外部服务：
- **MySQL 8.0+** (端口 3306)
- **Redis 7+** (端口 6379)

## 🚀 快速启动方案

### 方案 1：使用 Docker（推荐）

```bash
# 1. 启动依赖服务
docker run -d --name aigc-mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=aigc_friendly_dev \
  -p 3306:3306 \
  mysql:8.0

docker run -d --name aigc-redis \
  -p 6379:6379 \
  redis:7-alpine

# 2. 等待服务启动
sleep 10

# 3. 启动 API 服务
cd /home/yiqingzhu081/projts/zyqone/aigc-friendly-backend
npm run dev:api

# 4. 在另一个终端启动 Worker
npm run dev:worker
```

### 方案 2：使用 Docker Compose

```bash
cd /home/yiqingzhu081/projts/zyqone/aigc-friendly-backend
docker compose up -d

# 等待服务启动
sleep 15

# 启动应用
npm run dev:api  # 终端 1
npm run dev:worker  # 终端 2
```

### 方案 3：本地安装服务

#### Ubuntu/Debian

```bash
# 安装 MySQL
sudo apt-get update
sudo apt-get install -y mysql-server
sudo systemctl start mysql
sudo mysql -e "CREATE DATABASE aigc_friendly_dev;"

# 安装 Redis
sudo apt-get install -y redis-server
sudo systemctl start redis

# 启动应用
npm run dev:api
npm run dev:worker
```

#### macOS

```bash
# 使用 Homebrew
brew install mysql redis

# 启动 MySQL
brew services start mysql
mysql -e "CREATE DATABASE aigc_friendly_dev;"

# 启动 Redis
brew services start redis

# 启动应用
npm run dev:api
npm run dev:worker
```

## 🔧 手动启动服务（如果已安装）

```bash
# 启动 MySQL（如果已安装）
sudo systemctl start mysql
# 或
sudo service mysql start

# 启动 Redis（如果已安装）
sudo systemctl start redis
# 或
sudo service redis-server start
# 或直接启动
redis-server --daemonize yes
```

## ✅ 验证服务

### 检查 MySQL
```bash
mysql -uroot -ppassword -e "SHOW DATABASES;"
# 应该看到 aigc_friendly_dev 数据库
```

### 检查 Redis
```bash
redis-cli ping
# 应该返回 PONG
```

## 🎯 测试 GraphQL API

启动服务后，访问：
- **GraphQL Playground**: http://localhost:3000/graphql

### 测试查询

#### 1. 创建魔法道具制作任务
```graphql
mutation {
  createMagicItemCraftTask(input: {
    itemName: "火焰戒指"
    itemType: WEAPON
    materialLevel: 3
    requestNote: "请打造一枚火焰属性的戒指"
  }) {
    id
    status
    itemName
    createdAt
  }
}
```

#### 2. 查询任务状态
```graphql
query {
  magicItemCraftTask(input: { id: "任务 ID" }) {
    id
    itemName
    itemType
    status
    qualityLevel
    resultDescription
    craftLog
    createdAt
    updatedAt
  }
}
```

#### 3. 查询所有任务
```graphql
query {
  magicItemCraftTasks {
    items {
      id
      itemName
      status
      qualityLevel
    }
  }
}
```

##  常见问题

### 1. 无法连接 MySQL
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**解决**：确保 MySQL 服务已启动
```bash
sudo systemctl status mysql
sudo systemctl start mysql
```

### 2. 无法连接 Redis
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```
**解决**：确保 Redis 服务已启动
```bash
redis-cli ping
# 如果失败，启动 Redis
redis-server --daemonize yes
```

### 3. 数据库不存在
```
Error: Unknown database 'aigc_friendly_dev'
```
**解决**：创建数据库
```bash
mysql -uroot -ppassword -e "CREATE DATABASE aigc_friendly_dev;"
```

### 4. 权限问题（WSL）
```
sudo: The "no new privileges" flag is set
```
**解决**：在 WSL 中直接运行，不使用 sudo
```bash
service mysql start
service redis-server start
```

## 📝 环境变量配置

编辑 `env/.env.development` 文件，确保配置正确：

```env
# 数据库
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=aigc_friendly_dev

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# JWT
JWT_SECRET=your-secret-key-must-be-at-least-32-characters-long

# 加密
FIELD_ENCRYPTION_KEY=your-encryption-key-16-chars-min
FIELD_ENCRYPTION_IV=your-iv-key-16-chars-min
```

## 🧪 运行测试

```bash
# 单元测试
npm run test:unit

# 端到端测试（需要 MySQL 和 Redis）
npm run test:e2e:core

# 魔法工坊专项测试
npm run test:e2e:file -- test/09-magic-workshop/magic-workshop.e2e-spec.ts
```

## 📊 项目状态

✅ TypeScript 类型检查通过
✅ ESLint 代码检查通过
✅ 项目构建成功
✅ 单元测试全部通过（218 个）
✅ 魔法道具工坊功能完整实现

##  功能特性

- **异步任务处理**：使用 BullMQ 队列异步处理制作任务
- **品质等级系统**：COMMON/RARE/EPIC/LEGENDARY 四种品质
- **完整状态机**：PENDING → PROCESSING → SUCCEEDED/FAILED
- **制作日志**：详细记录每个制作阶段
- **输入验证**：材料等级 1-5 限制，道具类型验证

## 📞 需要帮助？

如果遇到问题，请检查：
1. MySQL 和 Redis 服务是否运行
2. 环境变量配置是否正确
3. 端口 3306、6379、3000 是否被占用
4. 查看日志输出了解详细错误信息