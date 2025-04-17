/*
 * @Date: 2025-04-16
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-16 13:43:18
 */
import { z } from 'zod'

// 定义用户数据表结构
export const UserSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  username: z.string(),
  image: z.string().url().optional(),
  email: z.string().email().optional(),
  bio: z.string().optional(),
})

export type User = z.infer<typeof UserSchema>
