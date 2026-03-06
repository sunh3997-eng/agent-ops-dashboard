# Agent Ops Dashboard

> AI 编码 Agent 统一管控面板 — 像 k9s 管理 K8s 一样管理你的所有 AI coding agent

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

## 功能特性

- **多 Agent 实时面板** — 同时监控 Cursor、GitHub Copilot、Claude Code、Codebuff 状态
- **Token 消耗追踪** — 实时区域图表，支持 24h / 7d 视图
- **成本统计** — 按 Agent 和模型细分，Today / Week / Total
- **代码产出质量评分** — Diff 行数、测试通过率、Commit 数量、雷达图对比
- **实时活动流** — 模拟 WebSocket 事件，每 3-7s 推送新事件

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000) 即可看到完整 Dashboard。

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 14 App Router |
| 语言 | TypeScript 5 |
| 样式 | Tailwind CSS 3 (深色主题) |
| 图表 | Recharts (Area Chart + Radar Chart) |
| 图标 | Lucide React |
| 日期 | date-fns |

## 项目结构

```
├── app/
│   ├── dashboard/page.tsx   # 主 Dashboard 页面（client component）
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── AgentCard.tsx        # 单个 Agent 状态卡片
│   ├── ActivityFeed.tsx     # 实时活动流
│   ├── ConnectionBadge.tsx  # WebSocket 连接状态
│   ├── CostTable.tsx        # 成本明细表格
│   ├── QualityWidget.tsx    # 代码质量评分 + 雷达图
│   ├── StatsBar.tsx         # 顶部统计数字
│   └── TokenChart.tsx       # Token 消耗折线图
├── hooks/
│   └── useAgentStatus.ts    # 实时数据 Hook（模拟 WebSocket）
└── lib/
    ├── types.ts             # TypeScript 类型定义
    ├── mock-data.ts         # 模拟数据
    └── utils.ts             # 工具函数
```

## 架构说明

### 实时数据模拟

`useAgentStatus` Hook 模拟 WebSocket 实时通信：
- 每 **3s** 更新一次 Agent 指标（Token 消耗、状态、当前任务）
- 每 **3.5~7.5s** 随机生成一条活动事件推送到 Activity Feed
- 支持传入真实 `wsUrl` 无缝切换到真实 WebSocket 服务

### 扩展为真实实现

若要对接真实 Agent 数据：
1. 启动一个 WebSocket 服务端（Node.js / Python）
2. 将 `useAgentStatus(wsUrl)` 的 `wsUrl` 参数设为服务端地址
3. 服务端推送 `{ type: "agent_update", agents: Agent[] }` 格式消息

## 截图布局

```
┌─────────────────────────────────────────────────────┐
│  Agent Ops Dashboard          ● Live  [Refresh All]  │
├──────────┬──────────┬──────────┬────────────────────┤
│ 2/4 Active│ $14.35  │  408k    │     89.5%          │
│  Agents  │  Today  │  Tokens  │   Avg Pass Rate    │
├──────────┴──────────┴──────────┴────────────────────┤
│ [Cursor ●]  [Copilot ○]  [Claude Code ●]  [CB ✕]   │
├──────────────────────────┬──────────────────────────┤
│  Token Consumption (24h) │  Activity Feed            │
│  [Area Chart]            │  [Live event stream]      │
├──────────────────────────┴──────────────────────────┤
│  Cost Breakdown Table    │  Quality Scores + Radar   │
└──────────────────────────┴──────────────────────────┘
```
