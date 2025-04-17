/*
 * @Date: 2025-04-16
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-16
 */
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}
