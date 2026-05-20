<!-- 文件位置: plans/layered-governance-p0-inventory.md -->

# Layered Governance P0 Inventory

## 状态

P0 已完成，日期：2026-05-21。

本文件记录旧项目与新项目 `/var/www/backend_next` 的分层治理差异、文档动作矩阵、验证基线和
P0 决策。它是 P1/P2/P3a 的输入，不是稳定规则；稳定规则仍应落入 `docs/`。

## P0 输入

- 新项目 agent context：`/var/www/backend_next/AGENTS.md`
- 新项目 docs index：`/var/www/backend_next/docs/README.md`
- 新项目 framework extraction plan：
  `/var/www/backend_next/plans/aigc-ddd-framework-extraction-plan.md`
- 旧项目 agent context：`AGENTS.md`
- 旧项目 docs index：`docs/README.md`
- 当前主计划：[layered-governance-alignment-plan.md](./layered-governance-alignment-plan.md)

## 核心结论

- 旧项目已有基础分层文档和 `boundaries/dependencies` ESLint 规则，但还没有完全达到新项目治理体系。
- 旧项目缺少 `docs/common/aggregate.rules.md` 与 `docs/common/entity.rules.md`。
- 旧项目 `docs/README.md` 缺少 aggregate/entity 路由、plans 路由、current API contract 路由说明。
- 新项目中教育、班级、教务、upstream-access 等 current API 文档不复制到旧项目。
- 新项目 ESLint 配置包含一组 `local-architecture/*` 自定义规则；旧项目当前没有，需要 P2 对齐或记录替代扫描。
- 旧项目代码中仍有 EntityManager transaction alias 和 module-owned `runTransaction` 旧形态，这是 P3a inventory 和
  P3b 修复项，不在 P0 修。
- `npm run typecheck` 与 no-fix ESLint 当前通过。

## AGENTS.md 差异

执行命令：

- `diff -u /var/www/backend_next/AGENTS.md AGENTS.md`

差异摘要：

- transaction 口径不同：
  - 新项目写明 `TransactionRunner` 是当前 usecase-owned transaction boundary contract。
  - 旧项目仍说明当前存在基于 TypeORM `EntityManager` 的 legacy aliases，且禁止新增同类 alias。
- routing 口径不同：
  - 新项目在 context routing 中包含 “Current API behavior: matching docs/api/*-current.md”。
  - 旧项目当前未加入 current API behavior 路由。

动作：

- `AGENTS.md` 需要 `adapt`。
- P1 应把最终目标对齐到新项目 `TransactionRunner` 口径，同时保留旧代码迁移状态只在 plan / inventory 中记录。
- P1 应加入通用 current API contract 路由，但不得引入教育 current API 文档。

## Docs Index 差异

执行命令：

- `diff -u /var/www/backend_next/docs/README.md docs/README.md`

差异摘要：

- 旧项目缺少 `docs/frontend/`、`docs/deprecated/`、`plans/` 的 folders 说明。
- 旧项目 GraphQL error/auth/session 路由缺少 `docs/api/auth-session-current.md`。
- 旧项目 layer boundaries 路由缺少 `aggregate.rules.md` 与 `entity.rules.md`。
- 旧项目缺少 aggregate/entity 专用 task route。
- 旧项目缺少 current API contract 路由。
- 旧项目 one-line meanings 缺少 aggregate/entity/current API/plans 等条目。

动作：

- `docs/README.md` 需要 `adapt`。
- 必须补 aggregate/entity 路由。
- 必须补 `plans/README.md` 路由。
- current API route 只补通用能力；教育 current API route 不复制。
- `docs/frontend/` / `docs/deprecated/` 是否创建目录由 P1 决定；即使创建，也只能作为非实现指导或历史背景。

## 文档动作矩阵

| 新项目文档 | 旧项目状态 | 动作 | 原因 |
| --- | --- | --- | --- |
| `AGENTS.md` | 已存在但内容不同 | adapt | 分层原则基本一致，但 transaction/current API 路由需收敛 |
| `docs/README.md` | 已存在但内容不同 | adapt | 需要补 aggregate/entity/plans/current API 路由 |
| `docs/common/aggregate.rules.md` | 缺失 | copy/adapt | 新项目核心治理规则，旧项目必须补齐 |
| `docs/common/entity.rules.md` | 缺失 | copy/adapt | ORM Entity 纯度和 adapter decorator 禁止规则必须补齐 |
| `docs/common/ai-task-lifecycle-audit.rules.md` | 相同 | keep | 已对齐 |
| `docs/common/queue-identifiers.rules.md` | 相同 | keep | 已对齐 |
| `docs/common/skills.rules.md` | 相同 | keep | 已对齐 |
| `docs/common/boundary-contract.rules.md` | 已存在但内容不同 | adapt | 需核对 `*.contract.ts` 与 TransactionRunner 口径 |
| `docs/common/core.rules.md` | 已存在但内容不同 | adapt | 需对齐 core 纯度和 stable type 例外 |
| `docs/common/eslint-architecture-rules.md` | 已存在但内容不同 | adapt | 旧项目缺少新项目 local architecture lint 描述 |
| `docs/common/infrastructure.rules.md` | 已存在但内容不同 | adapt | 需对齐 infrastructure 依赖与 boundary contract 例外 |
| `docs/common/modules.rules.md` | 已存在但内容不同 | adapt | 需对齐 modules/common 与业务模块依赖口径 |
| `docs/common/modules.extra.rules.md` | 已存在但内容不同 | adapt | 需对齐 QueryService、repository、module assembly 细节 |
| `docs/common/queryservice.rules.md` | 已存在但内容不同 | adapt | 需对齐 QueryService 只由 usecase 调用 |
| `docs/common/rule-precedence.rules.md` | 已存在但内容不同 | adapt | 需保证冲突优先级和新项目一致 |
| `docs/common/type.rules.md` | 已存在但内容不同 | adapt | 需对齐 `src/types` 和 bounded-context `.types.ts` |
| `docs/common/usecase.rules.md` | 已存在但内容不同 | adapt | 需对齐 usecase 编排和事务所有权 |
| `docs/common/usecase-write-flow-boundaries.rules.md` | 已存在但内容不同 | adapt | 需对齐 write-flow split 与 transaction-root boundaries |
| `docs/api/adapters.rules.md` | 已存在但内容不同 | adapt | 需对齐 adapter 只做 protocol entry |
| `docs/api/graphql-error-contract-current.md` | 相同 | keep | 已对齐 |
| `docs/api/auth-session-current.md` | 缺失 | adapt | 属于通用 auth/session current contract，应补旧项目版本 |
| `docs/api/account-write-current.md` | 缺失 | adapt | 属于通用 account/userInfo write contract，应补旧项目版本 |
| `docs/api/admin-user-list-current.md` | 缺失 | defer | 需先确认旧项目是否保留等价 admin user list API |
| `docs/api/verification-confirm-flow-current.md` | 缺失 | defer/adapt | 需先确认旧项目通用 verification flow 当前 contract |
| `docs/api/invite-register-current.md` | 缺失 | exclude/defer | 旧项目已停用培训邀请；除非未来有通用 invite，否则不补 |
| `docs/api/welcome-profile-completion-current.md` | 缺失 | exclude/defer | 旧项目无教育 welcome completion；通用资料补全需另行确认 |
| `docs/api/department-current.md` 等教育 current docs | 缺失 | exclude | 教育业务文档，不进入旧项目 |
| `docs/api/upstream-access-current.md` | 缺失 | exclude | upstream-access 属教育/外部教务业务语义 |
| `docs/worker/*.rules.md` | 已存在，部分不同 | adapt/keep | worker-adapter/usecase 已对齐；email/qm 需核对差异 |
| `docs/project-convention/account-slot-group.rules.md` | 缺失 | exclude | slotGroup/staff slot 属新项目教育岗位语义，不进入旧项目 |
| `docs/project-convention/upstream-access-boundary.md` | 缺失 | exclude | upstream-access 不进入旧项目 |
| `docs/project-convention/e2e-test-groups.md` | 已存在但内容不同 | adapt | 需对齐 core/worker/smoke/file-scoped 验证口径 |
| `docs/project-convention/database-baseline-delivery.rules.md` | 已存在但内容不同 | adapt | 需保持旧项目空库 baseline 口径 |
| `docs/project-convention/input-*` / `time-*` | 相同 | keep | 已对齐 |
| `docs/frontend/*` | 缺失 | exclude/defer | 不作为后端实现 source of truth |
| `docs/deprecated/*` | 缺失 | exclude/defer | 历史背景，不作为实现指导 |
| `docs/human/*` | 已存在 | keep | 保留人类说明，但不作为 agent 实现指导 |

## ESLint 与验证差异

执行命令：

- `diff -u /var/www/backend_next/docs/common/eslint-architecture-rules.md docs/common/eslint-architecture-rules.md`
- `diff -u /var/www/backend_next/eslint.config.mjs eslint.config.mjs`
- `npm run typecheck`
- `npx eslint "{src,apps,libs,test}/**/*.ts" --cache --cache-location .eslintcache`

当前旧项目已有：

- `boundaries/dependencies`
- `no-restricted-imports`
- `@typescript-eslint/no-explicit-any`
- type-aware strictness rules
- complexity / size warnings
- `scripts/check-usecase-normalize-guard.js`

新项目额外具备但旧项目当前缺失：

- `local-architecture/no-infrastructure-to-modules-imports`
- `local-architecture/no-cross-domain-usecases-imports`
- `local-architecture/no-cross-domain-modules-imports`
- `local-architecture/no-types-to-core-imports`
- `local-architecture/no-boundary-port-naming-drift`
- `local-architecture/no-transaction-manager-alias`
- `local-architecture/no-usecase-transaction-manager-orm-api`
- `modules-contracts` / `modules-types` / `modules-internal` 更细的 boundaries modeling

P2 结论输入：

- 旧项目必须更新 `docs/common/eslint-architecture-rules.md`，明确哪些规则由 ESLint 自动覆盖。
- 是否直接移植新项目 local architecture rules 在 P2 决定。
- 在移植 lint 前，P3a 需要用 `rg` 辅助扫描 transaction alias、port naming、cross-domain imports 等问题。

## 当前代码初扫信号

执行命令：

- `rg -n "TransactionRunner|TransactionPort|UnitOfWork|TransactionManager|type .*Transaction.*= EntityManager|runTransaction<|EntityManager" src -g '*.ts'`

初扫结果：

- 未发现 `TransactionRunner`。
- 存在 legacy transaction alias：
  - `AccountTransactionManager`
  - `VerificationRecordTransactionManager`
  - `AsyncTaskRecordTransactionManager`
- 存在 module-owned `runTransaction`：
  - `AccountService.runTransaction`
  - `VerificationRecordService.runTransaction`
  - `AsyncTaskRecordService.runTransaction`
- usecases 仍接收或传递 `*TransactionManager` alias。

处理口径：

- P0 不修代码。
- P1 文档对齐时以新项目 `TransactionRunner` 为目标口径。
- P3a 将 transaction alias 和 usecase 直接事务上下文使用列为 inventory。
- P3b 再按风险分批迁移。

## P0 决策

- D0：旧项目采用新项目 `TransactionRunner` 口径作为目标；当前 EntityManager transaction alias 只作为待迁移项，
  不再新增。
- D1：旧项目只补通用 current API 文档；教育业务 current API 文档排除。
- D2：先补齐 aggregate/entity rule 文档与人工扫描命令；是否新增 lint 规则放到 P2 决策。
- D3：账号收口计划保留为完成计划，当前主线切换为分层治理对齐计划。

## P0 验证

- `npm run typecheck` 通过。
- `npx eslint "{src,apps,libs,test}/**/*.ts" --cache --cache-location .eslintcache` 通过。

## 下一步

- P1：按动作矩阵更新 docs/agent 入口与核心 rule 文档。
- P2：对齐 ESLint architecture rule map 和扫描命令。
- P3a：在 P1/P2 之后产出真实代码分层违规 inventory。
