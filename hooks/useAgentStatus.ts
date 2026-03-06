"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Agent, AgentStatus, ActivityEntry, ActivityType } from "@/lib/types";
import { AGENTS, INITIAL_ACTIVITIES, ACTIVITY_TEMPLATES } from "@/lib/mock-data";

const TASKS: Record<string, string[]> = {
  cursor: [
    "Refactoring auth middleware, adding JWT refresh logic",
    "Implementing rate limiter for /api/upload endpoint",
    "Fixing TypeScript errors in payment module",
    "Adding Zod validation schemas for user routes",
    "Optimizing database queries in UserRepository",
  ],
  copilot: [
    "Waiting for next prompt…",
    "Completing autocomplete suggestions",
    "Generating test boilerplate",
    "Suggesting refactor for utils/format.ts",
    "Idle — no active tab",
  ],
  "claude-code": [
    "Writing unit tests for payment service, 3/8 complete",
    "Analyzing codebase structure",
    "Generating API documentation",
    "Reviewing PR diff for security issues",
    "Implementing error boundary components",
  ],
  codebuff: [
    "Error: API rate limit exceeded — retrying in 42s",
    "Analyzing project dependencies",
    "Scaffolding new feature module",
    "Applying lint fixes across 6 files",
    "Paused — awaiting user confirmation",
  ],
};

function randomStatus(): AgentStatus {
  const statuses: AgentStatus[] = ["active", "active", "active", "idle", "idle", "error"];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function mutateAgent(agent: Agent): Agent {
  const taskList = TASKS[agent.id] ?? [agent.currentTask];
  const shouldChangeTask = Math.random() < 0.3;
  const shouldChangeStatus = Math.random() < 0.15;
  const tokenDelta = Math.floor(Math.random() * 1200);

  return {
    ...agent,
    status: shouldChangeStatus ? randomStatus() : agent.status,
    currentTask: shouldChangeTask
      ? taskList[Math.floor(Math.random() * taskList.length)]
      : agent.currentTask,
    tokensUsed: Math.min(agent.tokensUsed + tokenDelta, agent.tokensLimit),
    tokensInput: agent.tokensInput + Math.floor(tokenDelta * 0.75),
    tokensOutput: agent.tokensOutput + Math.floor(tokenDelta * 0.25),
    costToday: agent.costToday + tokenDelta * 0.000015,
    lastActivity: shouldChangeTask ? new Date() : agent.lastActivity,
  };
}

let actCounter = 200;

function generateActivity(agents: Agent[]): ActivityEntry | null {
  const template = ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];
  const agent = agents.find((a) => a.id === template.agentId);
  if (!agent) return null;
  const msg = template.messages[Math.floor(Math.random() * template.messages.length)];
  actCounter++;
  return {
    id: `live-${actCounter}`,
    agentId: agent.id,
    agentName: agent.name,
    agentColor: agent.color,
    agentIcon: agent.icon,
    timestamp: new Date(),
    type: template.type as ActivityType,
    message: msg,
  };
}

export function useAgentStatus(wsUrl?: string) {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [activities, setActivities] = useState<ActivityEntry[]>(INITIAL_ACTIVITIES);
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activityRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleNextActivity = useCallback((currentAgents: Agent[]) => {
    const delay = 3500 + Math.random() * 4000;
    activityRef.current = setTimeout(() => {
      setAgents((latest) => {
        const entry = generateActivity(latest);
        if (entry) {
          setActivities((prev) => [entry, ...prev.slice(0, 49)]);
        }
        scheduleNextActivity(latest);
        return latest;
      });
    }, delay);
  }, []);

  const startMockUpdates = useCallback(() => {
    setConnected(true);
    intervalRef.current = setInterval(() => {
      setAgents((prev) => prev.map((agent) => mutateAgent(agent)));
      setLastUpdate(new Date());
    }, 3000);
    scheduleNextActivity(AGENTS);
  }, [scheduleNextActivity]);

  useEffect(() => {
    if (!wsUrl) {
      startMockUpdates();
      return;
    }

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data as string);
          if (data.type === "agent_update" && Array.isArray(data.agents)) {
            setAgents(data.agents);
            setLastUpdate(new Date());
          }
        } catch {
          // ignore parse errors
        }
      };

      ws.onerror = () => {
        setConnected(false);
        startMockUpdates();
      };

      ws.onclose = () => {
        setConnected(false);
        startMockUpdates();
      };
    } catch {
      startMockUpdates();
    }

    return () => {
      wsRef.current?.close();
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (activityRef.current) clearTimeout(activityRef.current);
    };
  }, [wsUrl, startMockUpdates]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (activityRef.current) clearTimeout(activityRef.current);
    };
  }, []);

  const refreshAgent = useCallback((agentId: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, status: "idle" as AgentStatus } : a))
    );
  }, []);

  return { agents, connected, lastUpdate, activities, refreshAgent };
}
