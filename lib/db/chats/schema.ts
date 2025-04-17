/*
 * @Date: 2025-04-16
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-16 14:00:00
 */
import { z } from 'zod'

// 定义聊天数据表结构
export const ChatSchema = z.object({
  id: z.string(), // 聊天的唯一ID
  userId: z.number(), // 关联的用户ID
  title: z.string().optional(), // 聊天标题，可选
  createdAt: z.date(), // 创建时间
  updatedAt: z.date(), // 更新时间
  isArchived: z.boolean().default(false), // 是否归档
})

export type Chat = z.infer<typeof ChatSchema>
