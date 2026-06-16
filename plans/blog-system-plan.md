# 博客系统开发计划

> 基于 aigc-friendly-backend (NestJS + GraphQL + MySQL + Redis)
> 执行账户: yiqingzhu081
> GitHub: https://github.com/yiqingzhu081

## 批次总览

| 批次 | 模块 | 核心功能 | 预计天数 |
|------|------|----------|----------|
| Day 1-2 | 数据库与基础架构 | 表结构设计、实体创建、基础 CRUD | 2天 |
| Day 3-4 | 文章管理 | 发布/编辑/删除/软删除/上下架 | 2天 |
| Day 5-6 | 分类与标签 | 分类树形结构、标签管理 | 2天 |
| Day 7-8 | 评论系统 | 多级评论、审核、回复 | 2天 |
| Day 9-10 | 搜索与归档 | 关键词搜索、时间归档、分类筛选 | 2天 |
| Day 11-12 | 认证与权限 | 管理员登录、JWT 鉴权 | 2天 |
| Day 13-14 | 文件管理 | 图片上传、图片库 | 2天 |
| Day 15-16 | 数据统计 | 仪表盘、各类统计数据 | 2天 |
| Day 17-18 | 前台展示 | C 端页面、Markdown 渲染、TOC | 2天 |
| Day 19-20 | 后台管理 | B 端管理界面 | 2天 |
| Day 21-22 | 完善优化 | SEO、缓存、性能优化 | 2天 |

---

## Day 1: 数据库架构设计

### 任务描述
设计博客系统数据库表结构，包括：
- 文章表 (posts)
- 分类表 (categories)
- 标签表 (tags)
- 评论表 (comments)
- 友情链接表 (links)
- 博主信息表 (blogger)
- 文件表 (files)

### 执行提示词

```
执行 Day 1 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 设计博客系统的数据库表结构
2. 在 src/modules 下创建 blog 模块
3. 创建以下实体（Entity）：
   - Post（文章）: id, title, slug, content, summary, cover_image, view_count, like_count, is_top, status, published_at, created_at, updated_at, deleted_at
   - Category（分类）: id, name, slug, description, parent_id, sort_order, created_at, updated_at
   - Tag（标签）: id, name, slug, created_at, updated_at
   - Comment（评论）: id, post_id, parent_id, author_name, author_email, author_avatar, content, status, created_at, updated_at
   - Link（友情链接）: id, name, url, logo, description, sort_order, status, created_at, updated_at
   - Blogger（博主信息）: id, nickname, avatar, bio, created_at, updated_at
   - File（文件）: id, filename, original_name, mime_type, size, url, created_at

4. 实体命名遵守 docs/common/entity.rules.md
5. 使用 TypeORM 装饰器
6. 不要在实体上添加 GraphQL 装饰器
7. 运行 npm run typecheck 确保无错误

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 1 我实现的代码，给出意见。

重点检查：
1. 实体命名是否符合规范
2. 字段类型是否合理
3. 是否有必要的索引
4. 是否遵守 docs/common/entity.rules.md
5. 是否有任何引入 any 的情况

执行账户: sudo -u yiqingzhu081
```

---

## Day 2: 文章基础 CRUD

### 任务描述
实现文章的基础增删改查功能，包括 GraphQL Resolver、Usecase、Module

### 执行提示词

```
执行 Day 2 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 为 Post 实体创建完整的 GraphQL CRUD 接口
2. 创建 blog.usecases.ts 实现业务逻辑
3. 创建 blog.module.ts 组装模块
4. 创建 QueryService 用于文章列表查询
5. 实现分页查询接口

关键接口：
- posts(query: PostQueryInput!): PostConnection
- post(id: ID!): Post
- createPost(input: CreatePostInput!): Post
- updatePost(id: ID!, input: UpdatePostInput!): Post
- deletePost(id: ID!): Boolean

注意：
1. 遵守 docs/api/adapters.rules.md
2. 遵守 docs/common/usecase.rules.md
3. 使用 TransactionRunner 管理事务
4. 输入验证遵守 docs/project-convention/input-field-design.md
5. 运行 npm run typecheck 确保无错误
6. 运行 npm run lint 确保无架构违规

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 2 我实现的代码，给出意见。

重点检查：
1. 分层是否正确（adapters -> usecases -> modules）
2. 是否有直接返回 ORM 实体的情况
3. 事务管理是否正确
4. 输入验证是否完善
5. GraphQL 类型定义是否正确

执行账户: sudo -u yiqingzhu081
```

---

## Day 3: 文章高级功能

### 任务描述
实现文章置顶、软删除、上下架、阅读量统计等功能

### 执行提示词

```
执行 Day 3 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 实现文章置顶功能（isTop 字段切换）
2. 实现软删除（deletedAt 字段）
3. 实现文章状态切换（草稿/已发布/已下线）
4. 实现阅读量统计（使用 Redis 缓存）
5. 创建回收站接口（查询已删除文章）

新增接口：
- togglePostTop(id: ID!): Post
- publishPost(id: ID!): Post
- unpublishPost(id: ID!): Post
- restorePost(id: ID!): Post
- incrementPostView(id: ID!): Int

注意：
1. 阅读量使用 Redis incr，避免数据库压力
2. 软删除需要级联处理相关数据
3. 遵守 docs/common/usecase-write-flow-boundaries.rules.md
4. 运行 npm run typecheck 确保无错误

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 3 我实现的代码，给出意见。

重点检查：
1. Redis 使用是否正确
2. 软删除逻辑是否完整
3. 是否有遗漏的边界情况
4. 性能考虑是否充分

执行账户: sudo -u yiqingzhu081
```

---

## Day 4: 分类管理

### 任务描述
实现分类的树形结构管理

### 执行提示词

```
执行 Day 4 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 创建 Category 实体关系（自引用 parent_id）
2. 实现分类的树形结构查询
3. 实现分类的增删改查
4. 实现获取分类树接口

接口：
- categories: [Category!]!  # 返回扁平列表
- categoryTree: [CategoryTreeNode!]!  # 返回树形结构
- createCategory(input: CreateCategoryInput!): Category
- updateCategory(id: ID!, input: UpdateCategoryInput!): Category
- deleteCategory(id: ID!): Boolean

注意：
1. 树形结构使用递归或闭包表实现
2. 删除分类时处理子分类
3. 遵守 docs/common/modules.rules.md
4. 运行 npm run typecheck 确保无错误

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 4 我实现的代码，给出意见。

重点检查：
1. 树形结构查询性能
2. 递归是否有深度限制
3. 分类删除时子分类处理是否正确

执行账户: sudo -u yiqingzhu081
```

---

## Day 5: 标签管理

### 任务描述
实现标签的增删改查

### 执行提示词

```
执行 Day 5 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 创建 Tag 实体
2. 实现标签的增删改查
3. 实现文章与标签的多对多关系
4. 实现热门标签统计

接口：
- tags: [Tag!]!
- tag(id: ID!): Tag
- createTag(input: CreateTagInput!): Tag
- updateTag(id: ID!, input: UpdateTagInput!): Tag
- deleteTag(id: ID!): Boolean
- popularTags(limit: Int): [TagWithCount!]!
- addTagsToPost(postId: ID!, tagIds: [ID!]!): Post
- removeTagsFromPost(postId: ID!, tagIds: [ID!]!): Post

注意：
1. 文章-标签使用 ManyToMany 关系
2. 热门标签统计使用 Redis 缓存
3. 运行 npm run typecheck 确保无错误

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 5 我实现的代码，给出意见。

重点检查：
1. 多对多关系实现是否正确
2. 缓存策略是否合理

执行账户: sudo -u yiqingzhu081
```

---

## Day 6: 评论系统基础

### 任务描述
实现评论的基础功能，包括发布、查看

### 执行提示词

```
执行 Day 6 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 创建 Comment 实体（支持多级嵌套）
2. 实现评论的增删改查
3. 实现评论列表查询（支持嵌套）
4. 实现评论回复功能

接口：
- comments(postId: ID!): [Comment!]!  # 获取文章的顶级评论
- comment(id: ID!): Comment
- createComment(input: CreateCommentInput!): Comment
- updateComment(id: ID!, input: UpdateCommentInput!): Comment
- deleteComment(id: ID!): Boolean
- replyToComment(id: ID!, input: CreateCommentInput!): Comment

注意：
1. 评论状态：pending（待审核）、approved（已通过）、rejected（已驳回）、hidden（已隐藏）
2. 支持楼中楼嵌套（限制3层）
3. 匿名用户只需要昵称和邮箱，头像自动生成（基于邮箱 hash）
4. 运行 npm run typecheck 确保无错误

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 6 我实现的代码，给出意见。

重点检查：
1. 嵌套评论查询性能
2. 头像生成算法
3. 评论状态机是否完整

执行账户: sudo -u yiqingzhu081
```

---

## Day 7: 评论审核

### 任务描述
实现评论审核功能

### 执行提示词

```
执行 Day 7 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 实现评论审核接口
2. 实现评论驳回功能
3. 实现评论隐藏/显示功能
4. 实现待审核评论列表

接口：
- approveComment(id: ID!): Comment
- rejectComment(id: ID!, reason: String): Comment
- hideComment(id: ID!): Comment
- showComment(id: ID!): Comment
- pendingComments(page: Int, pageSize: Int): CommentConnection

注意：
1. 审核操作需要管理员权限（后续 Day 11 实现认证后可补充权限校验）
2. 审核记录需要记录到操作日志
3. 运行 npm run typecheck 确保无错误

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 7 我实现的代码，给出意见。

重点检查：
1. 审核状态机是否完整
2. 是否有操作审计

执行账户: sudo -u yiqingzhu081
```

---

## Day 8: 搜索功能

### 任务描述
实现文章搜索功能

### 执行提示词

```
执行 Day 8 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 实现关键词搜索（标题+内容）
2. 实现按分类筛选
3. 实现按标签筛选
4. 实现时间归档统计

接口：
- searchPosts(keyword: String!, page: Int, pageSize: Int): PostConnection
- postsByCategory(categoryId: ID!, page: Int, pageSize: Int): PostConnection
- postsByTag(tagId: ID!, page: Int, pageSize: Int): PostConnection
- archive: [ArchiveMonth!]!  # 返回 {year, month, count} 列表
- postsByArchive(year: Int!, month: Int!, page: Int, pageSize: Int): PostConnection

注意：
1. 搜索使用 MySQL LIKE 或全文索引
2. 分页参数默认：page=1, pageSize=10
3. 归档按年月统计已发布文章数量
4. 运行 npm run typecheck 确保无错误

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 8 我实现的代码，给出意见。

重点检查：
1. 搜索性能优化
2. SQL 注入防护
3. 索引使用情况

执行账户: sudo -u yiqingzhu081
```

---

## Day 9: 点赞功能

### 任务描述
实现文章点赞功能

### 执行提示词

```
执行 Day 9 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 实现文章点赞功能
2. 实现点赞数统计（Redis 缓存）
3. 实现用户点赞记录（防重复点赞）

接口：
- likePost(postId: ID!): Post  # 点赞
- unlikePost(postId: ID!): Post  # 取消点赞
- hasLikedPost(postId: ID!): Boolean!  # 检查是否已点赞

注意：
1. 使用 Redis Set 存储用户点赞记录（userId:postId）
2. 点赞数使用 Redis incr/decr
3. 定期将点赞数同步到数据库
4. 运行 npm run typecheck 确保无错误

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 9 我实现的代码，给出意见。

重点检查：
1. Redis 数据结构选择是否合理
2. 防重复点赞逻辑
3. 数据一致性保障

执行账户: sudo -u yiqingzhu081
```

---

## Day 10: 博主信息与友链

### 任务描述
实现博主信息和友情链接管理

### 执行提示词

```
执行 Day 10 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 创建 Blogger 实体
2. 实现博主信息查询和更新
3. 创建 Link 实体
4. 实现友链的增删改查

接口（博主信息 - 公开查询）：
- blogger: Blogger

接口（博主信息 - 管理）：
- updateBlogger(input: UpdateBloggerInput!): Blogger

接口（友链 - 公开查询）：
- links: [Link!]!  # 获取所有已通过的友链

接口（友链 - 管理）：
- links(page: Int, pageSize: Int): LinkConnection
- createLink(input: CreateLinkInput!): Link
- updateLink(id: ID!, input: UpdateLinkInput!): Link
- deleteLink(id: ID!): Boolean
- approveLink(id: ID!): Link
- rejectLink(id: ID!): Link

注意：
1. 博主信息只有一条记录
2. 友链有审核状态
3. 运行 npm run typecheck 确保无错误

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 10 我实现的代码，给出意见。

重点检查：
1. 单条记录的特殊处理
2. 友链审核状态机

执行账户: sudo -u yiqingzhu081
```

---

## Day 11: 管理员认证

### 任务描述
实现管理员登录和 JWT 鉴权

### 执行提示词

```
执行 Day 11 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 创建 Admin 实体（用户名、密码hash）
2. 实现管理员登录接口
3. 实现 JWT token 生成和验证
4. 实现 GraphQL Guard 进行鉴权

接口：
- login(username: String!, password: String!): AuthPayload
- me: Admin  # 获取当前登录管理员信息
- changePassword(oldPassword: String!, newPassword: String!): Boolean

注意：
1. 密码使用 bcrypt 加密
2. JWT token 存入 Redis 进行管理
3. 遵守 docs/api/auth-session-current.md
4. 遵守 docs/api/graphql-error-contract-current.md
5. 运行 npm run typecheck 确保无错误

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 11 我实现的代码，给出意见。

重点检查：
1. 密码加密是否安全
2. JWT token 安全配置
3. GraphQL Guard 实现是否正确
4. 错误码是否遵守规范

执行账户: sudo -u yiqingzhu081
```

---

## Day 12: 权限控制

### 任务描述
完善权限控制和角色管理

### 执行提示词

```
执行 Day 12 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 创建 Role 实体（admin, editor, viewer）
2. 实现权限装饰器
3. 为所有管理端接口添加权限校验
4. 实现管理员列表和增删改查

接口：
- admins: [Admin!]!
- admin(id: ID!): Admin
- createAdmin(input: CreateAdminInput!): Admin
- updateAdmin(id: ID!, input: UpdateAdminInput!): Admin
- deleteAdmin(id: ID!): Boolean
- assignRole(adminId: ID!, roleId: ID!): Admin

注意：
1. 超级管理员拥有所有权限
2. 使用 @Roles() 装饰器进行权限控制
3. 运行 npm run typecheck 确保无错误

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 12 我实现的代码，给出意见。

重点检查：
1. 权限装饰器实现
2. 权限校验逻辑完整性
3. 是否有越权风险

执行账户: sudo -u yiqingzhu081
```

---

## Day 13: 文件上传基础

### 任务描述
实现图片上传功能

### 执行提示词

```
执行 Day 13 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 创建 File 实体
2. 实现文件上传接口（使用 GraphQL Upload scalar）
3. 实现文件删除接口
4. 配置上传限制（类型、大小）

接口（使用 REST 端点）：
- POST /upload - 上传文件
- DELETE /files/:id - 删除文件

注意：
1. 使用 GraphQL Upload scalar 实现文件上传
2. 支持 jpg, png, gif, webp 格式
3. 单文件大小限制 5MB
4. 生成唯一文件名避免冲突
5. 运行 npm run typecheck 确保无错误

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 13 我实现的代码，给出意见。

重点检查：
1. 文件类型验证
2. 大小限制
3. 文件名安全性
4. 存储路径配置

执行账户: sudo -u yiqingzhu081
```

---

## Day 14: 文件管理

### 任务描述
完善文件管理功能

### 执行提示词

```
执行 Day 14 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 实现文件库列表查询
2. 实现图片预览
3. 实现批量删除
4. 实现存储空间统计

接口：
- files(page: Int, pageSize: Int, type: String): FileConnection
- file(id: ID!): File
- deleteFiles(ids: [ID!]!): Int  # 返回删除数量
- storageStats: StorageStats  # {used, total, count}

注意：
1. 支持按文件类型筛选
2. 批量删除需要二次确认
3. 运行 npm run typecheck 确保无错误

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 14 我实现的代码，给出意见。

重点检查：
1. 批量操作是否正确
2. 存储统计准确性

执行账户: sudo -u yiqingzhu081
```

---

## Day 15: 数据统计

### 任务描述
实现仪表盘数据统计

### 执行提示词

```
执行 Day 15 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 实现基础统计数据查询
2. 实现文章趋势统计
3. 实现评论趋势统计
4. 实现热门文章排行

接口：
- dashboard: DashboardStats

DashboardStats:
- postCount: Int
- commentCount: Int
- totalViews: Int
- totalLikes: Int
- pendingComments: Int
- recentPosts: [Post!]!
- topPosts: [PostWithStats!]!
- viewStats(lastDays: Int): [DailyStats!]!
- commentStats(lastDays: Int): [DailyStats!]!

注意：
1. 统计数据使用 Redis 缓存，定时更新
2. 趋势数据按天统计
3. 运行 npm run typecheck 确保无错误

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 15 我实现的代码，给出意见。

重点检查：
1. 缓存策略
2. 统计准确性
3. 查询性能

执行账户: sudo -u yiqingzhu081
```

---

## Day 16: 阅读量同步

### 任务描述
实现 Redis 阅读量与数据库同步

### 执行提示词

```
执行 Day 16 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 创建定时任务同步阅读量
2. 实现 Worker Queue 处理同步任务
3. 实现阅读量重置功能
4. 实现阅读量异常检测

Worker 接口：
- 队列名: blog:view-sync
- 定时任务: 每小时同步一次

注意：
1. 使用 BullMQ 创建定时任务
2. 遵守 docs/worker/*.rules.md
3. 运行 npm run typecheck 确保无错误

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 16 我实现的代码，给出意见。

重点检查：
1. Worker 实现是否正确
2. 定时任务配置
3. 数据一致性保障

执行账户: sudo -u yiqingzhu081
```

---

## Day 17: Markdown 渲染

### 任务描述
实现文章 Markdown 内容处理

### 执行提示词

```
执行 Day 17 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 实现 Markdown 内容解析
2. 实现目录（TOC）提取
3. 实现代码高亮配置
4. 实现文章摘要提取

辅助接口：
- renderMarkdown(content: String!): String!  # 返回 HTML
- extractTOC(content: String!): [TOCItem!]!  # 返回目录结构
- generateExcerpt(content: String!, length: Int): String!  # 生成摘要

注意：
1. TOC 使用 heading 的层级关系构建
2. 代码高亮使用 highlight.js 或 prism
3. 摘要自动提取前200字符
4. 运行 npm run typecheck 确保无错误

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 17 我实现的代码，给出意见。

重点检查：
1. Markdown 解析安全性（XSS 防护）
2. TOC 提取准确性
3. 性能考虑

执行账户: sudo -u yiqingzhu081
```

---

## Day 18: 文章详情接口

### 任务描述
完善文章详情相关接口

### 执行提示词

```
执行 Day 18 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 实现文章详情查询（包含标签、分类）
2. 实现上一篇/下一篇
3. 实现相关文章推荐
4. 实现文章 SEO 信息

扩展 Post 类型：
- category: Category
- tags: [Tag!]!
- relatedPosts: [Post!]!
- prevPost: Post
- nextPost: Post
- seo: PostSEO

接口：
- postDetail(id: ID!): PostDetail

注意：
1. 上一篇/下一篇按发布日期排序
2. 相关文章基于相同标签推荐
3. 运行 npm run typecheck 确保无错误

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 18 我实现的代码，给出意见。

重点检查：
1. 查询性能（N+1 问题）
2. 推荐算法合理性

执行账户: sudo -u yiqingzhu081
```

---

## Day 19: 前台 GraphQL API

### 任务描述
整合前台 C 端所有接口

### 执行提示词

```
执行 Day 19 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 整合前台首页接口
2. 实现首页数据聚合查询
3. 实现 "关于我" 页面接口
4. 实现前台通用查询优化

首页接口：
- homePage: HomePageData!

HomePageData:
- featuredPosts: [Post!]!  # 置顶文章
- recentPosts: [Post!]!  # 最新文章
- categories: [CategoryWithCount!]!  # 分类及文章数
- popularTags: [Tag!]!  # 热门标签
- blogger: Blogger
- announcements: [Announcement!]  # 公告

关于我接口：
- aboutPage: AboutPageData!

注意：
1. 使用 DataLoader 优化 N+1 问题
2. 首页数据可使用 Redis 缓存
3. 运行 npm run typecheck 确保无错误

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 19 我实现的代码，给出意见。

重点检查：
1. DataLoader 使用
2. 缓存策略
3. 性能优化

执行账户: sudo -u yiqingzhu081
```

---

## Day 20: 后台管理接口

### 任务描述
完善后台 B 端管理接口

### 执行提示词

```
执行 Day 20 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 整合后台管理所有接口
2. 实现文章管理完整功能
3. 实现评论管理完整功能
4. 实现数据统计接口

管理接口分组：
- 文章管理: PostAdminQueries, PostAdminMutations
- 评论管理: CommentAdminQueries, CommentAdminMutations
- 分类管理: CategoryAdminQueries, CategoryAdminMutations
- 标签管理: TagAdminQueries, TagAdminMutations
- 文件管理: FileAdminQueries, FileAdminMutations
- 友链管理: LinkAdminQueries, LinkAdminMutations
- 博主设置: BloggerAdminMutations
- 管理员: AdminQueries, AdminMutations
- 仪表盘: DashboardQueries

注意：
1. 所有管理接口需要管理员权限
2. 使用 @Roles() 装饰器
3. 运行 npm run typecheck 确保无错误

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 20 我实现的代码，给出意见。

重点检查：
1. 权限控制完整性
2. 接口分组合理性

执行账户: sudo -u yiqingzhu081
```

---

## Day 21: SEO 优化

### 任务描述
实现 SEO 相关功能

### 执行提示词

```
执行 Day 21 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 为文章添加 SEO 字段
2. 实现 Open Graph 标签数据
3. 实现 RSS Feed
4. 实现站点地图

扩展 Post 实体：
- seoTitle: String
- seoDescription: String
- canonicalUrl: String

接口：
- generateSitemap: String!  # 返回 XML
- generateRSS: String!  # 返回 XML
- openGraph(postId: ID!): OpenGraphData

注意：
1. SEO 字段可选，未设置时使用默认值
2. RSS Feed 包含最新10篇已发布文章
3. 运行 npm run typecheck 确保无错误

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 21 我实现的代码，给出意见。

重点检查：
1. SEO 数据完整性
2. XML 格式正确性

执行账户: sudo -u yiqingzhu081
```

---

## Day 22: 缓存优化

### 任务描述
实现全面缓存策略

### 执行提示词

```
执行 Day 22 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

根据 docs/README.md 路由到最小的相关规则集。

本次任务目标：
1. 实现首页数据缓存
2. 实现文章详情缓存
3. 实现分类/标签列表缓存
4. 实现缓存自动刷新

缓存策略：
- 首页数据: 5分钟
- 文章详情: 10分钟
- 分类列表: 30分钟
- 标签列表: 30分钟
- 博主信息: 1小时
- 统计数据: 1小时

注意：
1. 使用 Redis 作为缓存
2. 实现主动失效机制（数据变更时清除缓存）
3. 运行 npm run typecheck 确保无错误

执行完之后不要 commit，并且提醒我补充 unit / e2e test。
```

### Review 提示词

```
请 严格按照 docs 下的规则 review Day 22 我实现的代码，给出意见。

重点检查：
1. 缓存一致性
2. 缓存穿透/雪崩防护
3. 性能影响

执行账户: sudo -u yiqingzhu081
```

---

## Day 23: 全局 Review

### 任务描述
对整个博客系统进行架构 review

### 执行提示词

```
请 严格按照 docs 下的规则 review 整个博客系统（Day 1-22）我实现的代码，给出意见。

这是周期性的全局架构 review，重点检查：
1. 分层规范和依赖方向
2. 是否存在同样功能的二次实现
3. 分层漂移情况
4. 抽象失控情况
5. 是否有任何引入 any 的情况
6. 错误处理是否统一
7. 缓存策略是否一致
8. 类型定义是否完整

执行账户: sudo -u yiqingzhu081
```

---

## Day 24: 提交前准备

### 任务描述
最终测试和提交

### 执行提示词

```
执行 Day 24 的任务，注意遵守项目 rules、分层规范和依赖方向，不要绕开既有结构，不要重复实现已有功能。

这是提交前的最后阶段。

任务目标：
1. 运行 npm run build 确保构建成功
2. 运行 npm run lint 确保无违规
3. 运行 npm run typecheck 确保无类型错误
4. 运行 npm run test:unit 确保单元测试通过
5. 运行 npm run test:e2e:smoke 确保核心流程通过

确认无误后 commit，然后使用 sudo -u yiqingzhu081 git push 推送到 GitHub。

注意：
1. git commit 信息要清晰描述本次提交内容
2. 如果有遗留问题，先修复再提交
3. 推送到 yiqingzhu081 账户
```

---

## 执行摘要

### 快速启动命令

每天开始时，在新对话中使用对应的 Day 执行提示词即可开始任务。

### 常用命令

```bash
# 构建
npm run build

# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 单元测试
npm run test:unit

# E2E 测试
npm run test:e2e:smoke

# Git 操作
sudo -u yiqingzhu081 git add .
sudo -u yiqingzhu081 git commit -m "描述"
sudo -u yiqingzhu081 git push
```

### GitHub 地址
https://github.com/yiqingzhu081/aigc-friendly-backend
