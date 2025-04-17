/*
 * @Date: 2025-04-17 15:09:10
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-17 15:18:27
 */
import { NextResponse } from 'next/server'
import { startNewChat } from '@/lib/services/chatService'
import { auth } from '@/auth'

export async function POST() {
  try {
    // 获取用户会话信息
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    // 从会话中获取用户ID
    const userId = session.user.id
    console.log('新建', userId)
    if (!userId) {
      return NextResponse.json({ error: '用户ID不存在' }, { status: 400 })
    }

    // 创建新的聊天会话
    const chatId = await startNewChat(Number(userId))

    return NextResponse.json({ chatId }, { status: 201 })
  } catch (error) {
    console.error('创建聊天会话失败:', error)
    return NextResponse.json({ error: '创建聊天会话失败' }, { status: 500 })
  }
}
