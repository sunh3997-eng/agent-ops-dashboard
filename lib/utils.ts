import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AgentStatus, ActivityType } from "./types";
import { formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function formatCost(n: number): string {
  return `$${n.toFixed(2)}`;
}

export function formatDuration(start: Date): string {
  const ms = Date.now() - start.getTime();
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

export const STATUS_CONFIG: Record<
  AgentStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  active: {
    label: "RUNNING",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    dot: "bg-emerald-400",
  },
  idle: {
    label: "IDLE",
    color: "text-gray-400",
    bg: "bg-gray-400/10",
    dot: "bg-gray-400",
  },
  error: {
    label: "ERROR",
    color: "text-red-400",
    bg: "bg-red-400/10",
    dot: "bg-red-400",
  },
  paused: {
    label: "PAUSED",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    dot: "bg-amber-400",
  },
};

export const ACTIVITY_CONFIG: Record<
  ActivityType,
  { icon: string; color: string }
> = {
  task_start: { icon: "▶", color: "text-blue-400" },
  task_complete: { icon: "✓", color: "text-emerald-400" },
  error: { icon: "✕", color: "text-red-400" },
  file_edit: { icon: "✎", color: "text-violet-400" },
  test_run: { icon: "◉", color: "text-cyan-400" },
  commit: { icon: "⎇", color: "text-amber-400" },
  token_spike: { icon: "↑", color: "text-orange-400" },
};

export function getQualityColor(score: number): string {
  if (score >= 90) return "#10b981";
  if (score >= 75) return "#3b82f6";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

export function getTokenUsageColor(pct: number): string {
  if (pct >= 90) return "#ef4444";
  if (pct >= 75) return "#f59e0b";
  return "#10b981";
}
