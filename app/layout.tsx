import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Ops Dashboard",
  description: "AI 编码 Agent 统一管控面板 — Monitor Cursor, Copilot, Claude Code, and Codebuff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
