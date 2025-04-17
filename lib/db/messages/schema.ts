/*
 * @Date: 2025-04-16
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-16 14:15:00
 */
import { z } from 'zod'

// 定义消息数据表结构
export const MessageSchema = z.object({
  id: z.string(), // 消息的唯一ID
  chatId: z.string(), // 关联的聊天ID
  content: z.string(), // 消息内容
  role: z.enum(['user', 'assistant', 'system']), // 消息角色
  createdAt: z.date(), // 创建时间
  revisionId: z.string().optional(), // 修订ID
  reasoning: z.string().optional(), // 推理过程
})

export type Message = z.infer<typeof MessageSchema>
