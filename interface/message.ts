/*
 * @Date: 2025-04-11 14:36:49
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-11 14:42:30
 */
export interface MessageProps {
  content: string;
  id: string;
  revisionId: string;
  role: "user" | "assistant" | "system";
  createdAt: unknown;
  reasoning?: string;
}
