export type AgentStatus = "active" | "idle" | "error" | "paused";

export interface Agent {
  id: string;
  name: string;
  icon: string;
  color: string;
  status: AgentStatus;
  currentTask: string;
  model: string;
  sessionStart: Date;
  tokensUsed: number;
  tokensLimit: number;
  tokensInput: number;
  tokensOutput: number;
  costToday: number;
  costTotal: number;
  diffLines: number;
  testPassRate: number;
  filesChanged: number;
  lastActivity: Date;
  project: string;
}

export interface TokenDataPoint {
  time: string;
  cursor: number;
  copilot: number;
  claudeCode: number;
  codebuff: number;
}

export interface CostBreakdown {
  agent: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costToday: number;
  costWeek: number;
  costTotal: number;
  color: string;
}

export interface QualityMetric {
  agentId: string;
  agentName: string;
  color: string;
  diffLines: number;
  testPassRate: number;
  filesChanged: number;
  commitCount: number;
  codeScore: number;
}

export type TimeRange = "daily" | "weekly";

export type ActivityType =
  | "task_start"
  | "task_complete"
  | "error"
  | "file_edit"
  | "test_run"
  | "commit"
  | "token_spike";

export interface ActivityEntry {
  id: string;
  agentId: string;
  agentName: string;
  agentColor: string;
  agentIcon: string;
  timestamp: Date;
  type: ActivityType;
  message: string;
}

export interface DashboardState {
  agents: Agent[];
  activities: ActivityEntry[];
  tokenData: TokenDataPoint[];
  costBreakdown: CostBreakdown[];
  qualityMetrics: QualityMetric[];
  connected: boolean;
  lastUpdated: Date;
}
