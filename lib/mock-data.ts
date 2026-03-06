import {
  Agent,
  TokenDataPoint,
  CostBreakdown,
  QualityMetric,
  ActivityEntry,
} from "./types";
import { subDays, subHours, subMinutes, subSeconds, format } from "date-fns";

export const AGENTS: Agent[] = [
  {
    id: "cursor",
    name: "Cursor",
    icon: "⌶",
    color: "#3b82f6",
    status: "active",
    currentTask: "Refactoring auth middleware, adding JWT refresh logic",
    model: "claude-sonnet-4-6",
    sessionStart: subHours(new Date(), 2),
    tokensUsed: 184320,
    tokensLimit: 200000,
    tokensInput: 142000,
    tokensOutput: 42320,
    costToday: 4.82,
    costTotal: 67.4,
    diffLines: 342,
    testPassRate: 94,
    filesChanged: 12,
    lastActivity: subSeconds(new Date(), 8),
    project: "backend-api",
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    icon: "◎",
    color: "#10b981",
    status: "idle",
    currentTask: "Waiting for next prompt…",
    model: "gpt-4o",
    sessionStart: subHours(new Date(), 5),
    tokensUsed: 92400,
    tokensLimit: 128000,
    tokensInput: 78000,
    tokensOutput: 14400,
    costToday: 2.31,
    costTotal: 42.1,
    diffLines: 187,
    testPassRate: 88,
    filesChanged: 7,
    lastActivity: subMinutes(new Date(), 18),
    project: "data-service",
  },
  {
    id: "claude-code",
    name: "Claude Code",
    icon: "◆",
    color: "#8b5cf6",
    status: "active",
    currentTask: "Writing unit tests for payment service, 3/8 complete",
    model: "claude-opus-4-6",
    sessionStart: subHours(new Date(), 1),
    tokensUsed: 76800,
    tokensLimit: 200000,
    tokensInput: 58000,
    tokensOutput: 18800,
    costToday: 6.14,
    costTotal: 28.9,
    diffLines: 218,
    testPassRate: 97,
    filesChanged: 9,
    lastActivity: subSeconds(new Date(), 2),
    project: "auth-service",
  },
  {
    id: "codebuff",
    name: "Codebuff",
    icon: "⬡",
    color: "#f59e0b",
    status: "error",
    currentTask: "Error: API rate limit exceeded — retrying in 42s",
    model: "gpt-4-turbo",
    sessionStart: subHours(new Date(), 3),
    tokensUsed: 54200,
    tokensLimit: 128000,
    tokensInput: 44000,
    tokensOutput: 10200,
    costToday: 1.08,
    costTotal: 19.6,
    diffLines: 95,
    testPassRate: 79,
    filesChanged: 4,
    lastActivity: subMinutes(new Date(), 3),
    project: "ml-pipeline",
  },
];

function generateDailyData(): TokenDataPoint[] {
  const now = new Date();
  return Array.from({ length: 24 }, (_, i) => {
    const hour = subHours(now, 23 - i);
    const base = i * 4;
    return {
      time: format(hour, "HH:mm"),
      cursor: Math.round(3000 + base * 420 + Math.random() * 2000),
      copilot: Math.round(1800 + base * 180 + Math.random() * 1200),
      claudeCode: Math.round(800 + base * 310 + Math.random() * 1500),
      codebuff: Math.round(600 + base * 120 + Math.random() * 800),
    };
  });
}

function generateWeeklyData(): TokenDataPoint[] {
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const day = subDays(now, 6 - i);
    return {
      time: format(day, "EEE"),
      cursor: Math.round(80000 + Math.random() * 60000),
      copilot: Math.round(50000 + Math.random() * 40000),
      claudeCode: Math.round(30000 + Math.random() * 50000),
      codebuff: Math.round(20000 + Math.random() * 35000),
    };
  });
}

export const DAILY_TOKEN_DATA = generateDailyData();
export const WEEKLY_TOKEN_DATA = generateWeeklyData();

export const COST_BREAKDOWN: CostBreakdown[] = [
  {
    agent: "Cursor",
    model: "claude-sonnet-4-6",
    inputTokens: 142000,
    outputTokens: 42320,
    costToday: 4.82,
    costWeek: 28.4,
    costTotal: 67.4,
    color: "#3b82f6",
  },
  {
    agent: "Claude Code",
    model: "claude-opus-4-6",
    inputTokens: 58000,
    outputTokens: 18800,
    costToday: 6.14,
    costWeek: 18.9,
    costTotal: 28.9,
    color: "#8b5cf6",
  },
  {
    agent: "GitHub Copilot",
    model: "gpt-4o",
    inputTokens: 78000,
    outputTokens: 14400,
    costToday: 2.31,
    costWeek: 14.2,
    costTotal: 42.1,
    color: "#10b981",
  },
  {
    agent: "Codebuff",
    model: "gpt-4-turbo",
    inputTokens: 44000,
    outputTokens: 10200,
    costToday: 1.08,
    costWeek: 7.6,
    costTotal: 19.6,
    color: "#f59e0b",
  },
];

export const QUALITY_METRICS: QualityMetric[] = [
  {
    agentId: "cursor",
    agentName: "Cursor",
    color: "#3b82f6",
    diffLines: 342,
    testPassRate: 94,
    filesChanged: 12,
    commitCount: 6,
    codeScore: 91,
  },
  {
    agentId: "claude-code",
    agentName: "Claude Code",
    color: "#8b5cf6",
    diffLines: 218,
    testPassRate: 97,
    filesChanged: 9,
    commitCount: 4,
    codeScore: 95,
  },
  {
    agentId: "copilot",
    agentName: "GitHub Copilot",
    color: "#10b981",
    diffLines: 187,
    testPassRate: 88,
    filesChanged: 7,
    commitCount: 5,
    codeScore: 83,
  },
  {
    agentId: "codebuff",
    agentName: "Codebuff",
    color: "#f59e0b",
    diffLines: 95,
    testPassRate: 79,
    filesChanged: 4,
    commitCount: 2,
    codeScore: 71,
  },
];

export const INITIAL_ACTIVITIES: ActivityEntry[] = [
  {
    id: "a1",
    agentId: "cursor",
    agentName: "Cursor",
    agentColor: "#3b82f6",
    agentIcon: "⌶",
    timestamp: subSeconds(new Date(), 8),
    type: "file_edit",
    message: "Modified src/auth/middleware.ts — +47 lines, -23 lines",
  },
  {
    id: "a2",
    agentId: "claude-code",
    agentName: "Claude Code",
    agentColor: "#8b5cf6",
    agentIcon: "◆",
    timestamp: subSeconds(new Date(), 2),
    type: "test_run",
    message: "Test run: 24/25 passed in payment.test.ts — 1 failing",
  },
  {
    id: "a3",
    agentId: "copilot",
    agentName: "GitHub Copilot",
    agentColor: "#10b981",
    agentIcon: "◎",
    timestamp: subMinutes(new Date(), 2),
    type: "task_complete",
    message: 'Completed: "Optimize SQL queries in UserRepository" (3 files)',
  },
  {
    id: "a4",
    agentId: "codebuff",
    agentName: "Codebuff",
    agentColor: "#f59e0b",
    agentIcon: "⬡",
    timestamp: subMinutes(new Date(), 3),
    type: "error",
    message: "Error: API rate limit exceeded — queuing retry",
  },
  {
    id: "a5",
    agentId: "cursor",
    agentName: "Cursor",
    agentColor: "#3b82f6",
    agentIcon: "⌶",
    timestamp: subMinutes(new Date(), 7),
    type: "commit",
    message: 'Committed: "feat: add token refresh endpoint" (4 files)',
  },
  {
    id: "a6",
    agentId: "claude-code",
    agentName: "Claude Code",
    agentColor: "#8b5cf6",
    agentIcon: "◆",
    timestamp: subMinutes(new Date(), 12),
    type: "task_start",
    message: "Started: Writing unit tests for payment service",
  },
  {
    id: "a7",
    agentId: "copilot",
    agentName: "GitHub Copilot",
    agentColor: "#10b981",
    agentIcon: "◎",
    timestamp: subMinutes(new Date(), 18),
    type: "file_edit",
    message: "Modified db/queries/users.sql — +12 lines, -31 lines",
  },
  {
    id: "a8",
    agentId: "cursor",
    agentName: "Cursor",
    agentColor: "#3b82f6",
    agentIcon: "⌶",
    timestamp: subMinutes(new Date(), 24),
    type: "token_spike",
    message: "Token spike detected — 12k tokens in 60s (large context load)",
  },
  {
    id: "a9",
    agentId: "codebuff",
    agentName: "Codebuff",
    agentColor: "#f59e0b",
    agentIcon: "⬡",
    timestamp: subMinutes(new Date(), 31),
    type: "commit",
    message: 'Committed: "chore: update ML pipeline config"',
  },
  {
    id: "a10",
    agentId: "claude-code",
    agentName: "Claude Code",
    agentColor: "#8b5cf6",
    agentIcon: "◆",
    timestamp: subMinutes(new Date(), 45),
    type: "commit",
    message: 'Committed: "refactor: extract auth service layer" (5 files)',
  },
];

export const TOTAL_STATS = {
  totalAgents: 4,
  activeAgents: 2,
  totalCostToday: 14.35,
  totalCostWeek: 69.1,
  totalTokensToday: 407720,
  totalDiffLines: 842,
  avgTestPassRate: 89.5,
};

// Templates for random activity generation
export const ACTIVITY_TEMPLATES = [
  {
    agentId: "cursor",
    type: "file_edit" as const,
    messages: [
      "Modified src/routes/auth.ts — +28 lines, -15 lines",
      "Modified src/middleware/validate.ts — +19 lines, -7 lines",
      "Modified tests/auth.test.ts — +44 lines, -0 lines",
    ],
  },
  {
    agentId: "claude-code",
    type: "test_run" as const,
    messages: [
      "Test run: 18/20 passed in services.test.ts",
      "Test run: 31/31 passed in auth.test.ts ✓",
      "Test run: 7/10 passed in payment.test.ts — 3 failing",
    ],
  },
  {
    agentId: "copilot",
    type: "task_complete" as const,
    messages: [
      'Completed: "Add caching layer to API endpoints"',
      'Completed: "Fix N+1 query in product listings"',
      'Completed: "Update TypeScript types for v3 API"',
    ],
  },
  {
    agentId: "cursor",
    type: "commit" as const,
    messages: [
      'Committed: "fix: handle edge case in token validation"',
      'Committed: "feat: add request rate limiting"',
      'Committed: "test: add coverage for edge cases"',
    ],
  },
  {
    agentId: "claude-code",
    type: "file_edit" as const,
    messages: [
      "Modified src/services/payment.ts — +67 lines, -12 lines",
      "Modified src/types/index.ts — +23 lines, -5 lines",
    ],
  },
];
