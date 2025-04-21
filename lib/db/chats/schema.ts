/*
 * @Date: 2025-04-16
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-21 11:37:13
 */
import { z } from 'zod'

// 定义消息数据结构
export const MessageSchema = z.object({
  id: z.string(), // 消息的唯一ID
  content: z.string(), // 消息内容
  role: z.enum(['user', 'assistant', 'system']), // 消息角色
  createdAt: z.date(), // 创建时间
  revisionId: z.string().optional(), // 修订ID
  reasoning: z.string().optional(), // 推理过程
})

export type Message = z.infer<typeof MessageSchema>

// 定义聊天数据表结构
export const ChatSchema = z.object({
  id: z.string(), // 聊天的唯一ID
  userId: z.number(), // 关联的用户ID
  title: z.string(), // 聊天标题，可选
  createdAt: z.date(), // 创建时间
  updatedAt: z.date(), // 更新时间
  isArchived: z.boolean().default(false), // 是否归档
  messages: z.array(MessageSchema).optional(), // 聊天消息数组
})

export type Chat = z.infer<typeof ChatSchema>
