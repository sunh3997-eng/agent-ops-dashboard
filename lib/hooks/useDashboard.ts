"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DashboardState,
  Agent,
  ActivityEntry,
  TokenDataPoint,
} from "../types";
import {
  AGENTS,
  DAILY_TOKEN_DATA,
  COST_BREAKDOWN,
  QUALITY_METRICS,
  INITIAL_ACTIVITIES,
  ACTIVITY_TEMPLATES,
} from "../mock-data";
import { format } from "date-fns";

let activityCounter = 100;

function getAgentById(agents: Agent[], id: string): Agent | undefined {
  return agents.find((a) => a.id === id);
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateNewActivity(agents: Agent[]): ActivityEntry | null {
  const template =
    ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];
  const agent = getAgentById(agents, template.agentId);
  if (!agent) return null;

  const msg = template.messages[Math.floor(Math.random() * template.messages.length)];
  activityCounter++;

  return {
    id: `gen-${activityCounter}`,
    agentId: agent.id,
    agentName: agent.name,
    agentColor: agent.color,
    agentIcon: agent.icon,
    timestamp: new Date(),
    type: template.type,
    message: msg,
  };
}

function tickAgents(agents: Agent[]): Agent[] {
  return agents.map((agent) => {
    if (agent.status !== "active") return agent;

    // Random token consumption per tick
    const inputDelta = randomBetween(80, 420);
    const outputDelta = randomBetween(30, 150);
    const newTokensUsed = Math.min(
      agent.tokensUsed + inputDelta + outputDelta,
      agent.tokensLimit
    );
    const newCostToday =
      agent.costToday + (inputDelta + outputDelta) * 0.000015;

    // Occasionally update diff lines
    const diffDelta = Math.random() > 0.7 ? randomBetween(1, 8) : 0;

    return {
      ...agent,
      tokensUsed: newTokensUsed,
      tokensInput: agent.tokensInput + inputDelta,
      tokensOutput: agent.tokensOutput + outputDelta,
      costToday: parseFloat(newCostToday.toFixed(2)),
      diffLines: agent.diffLines + diffDelta,
      lastActivity: new Date(),
    };
  });
}

function appendTokenDataPoint(
  history: TokenDataPoint[],
  agents: Agent[]
): TokenDataPoint[] {
  const now = new Date();
  const cursor = getAgentById(agents, "cursor");
  const copilot = getAgentById(agents, "copilot");
  const claudeCode = getAgentById(agents, "claude-code");
  const codebuff = getAgentById(agents, "codebuff");

  const newPoint: TokenDataPoint = {
    time: format(now, "HH:mm"),
    cursor: cursor?.status === "active" ? randomBetween(3500, 7500) : 0,
    copilot: copilot?.status === "active" ? randomBetween(1200, 3200) : randomBetween(200, 600),
    claudeCode: claudeCode?.status === "active" ? randomBetween(2800, 6200) : 0,
    codebuff: codebuff?.status === "active" ? randomBetween(800, 2000) : 0,
  };

  // Keep last 24 data points
  const updated = [...history.slice(-23), newPoint];
  return updated;
}

const INITIAL_STATE: DashboardState = {
  agents: AGENTS,
  activities: INITIAL_ACTIVITIES,
  tokenData: DAILY_TOKEN_DATA,
  costBreakdown: COST_BREAKDOWN,
  qualityMetrics: QUALITY_METRICS,
  connected: false,
  lastUpdated: new Date(),
};

export function useDashboard() {
  const [state, setState] = useState<DashboardState>(INITIAL_STATE);

  // Simulate WebSocket connection
  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setState((prev) => ({ ...prev, connected: true }));
    }, 600);

    return () => clearTimeout(connectTimer);
  }, []);

  // Tick: update agent metrics every 2.5s
  useEffect(() => {
    const agentTick = setInterval(() => {
      setState((prev) => ({
        ...prev,
        agents: tickAgents(prev.agents),
        lastUpdated: new Date(),
      }));
    }, 2500);

    return () => clearInterval(agentTick);
  }, []);

  // Activity feed: new event every 4-7s
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      const delay = randomBetween(4000, 7000);
      timeout = setTimeout(() => {
        setState((prev) => {
          const newActivity = generateNewActivity(prev.agents);
          if (!newActivity) return prev;
          return {
            ...prev,
            activities: [newActivity, ...prev.activities.slice(0, 49)],
          };
        });
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeout);
  }, []);

  // Token history: new data point every 60s
  useEffect(() => {
    const chartTick = setInterval(() => {
      setState((prev) => ({
        ...prev,
        tokenData: appendTokenDataPoint(prev.tokenData, prev.agents),
      }));
    }, 60_000);

    return () => clearInterval(chartTick);
  }, []);

  const pauseAgent = useCallback((agentId: string) => {
    setState((prev) => ({
      ...prev,
      agents: prev.agents.map((a) =>
        a.id === agentId
          ? { ...a, status: a.status === "paused" ? "idle" : "paused" }
          : a
      ),
    }));
  }, []);

  return { state, pauseAgent };
}
