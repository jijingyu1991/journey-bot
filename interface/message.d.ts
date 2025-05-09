/*
 * @Date: 2025-04-11 14:36:49
 * @LastEditors: guantingting
 * @LastEditTime: 2025-05-09 16:01:15
 */
export interface MessageProps {
  content: string
  id: string
  chatId?: string
  revisionId?: string
  role: 'system' | 'user' | 'assistant'
  createdAt: unknown
  reasoning?: string
}
