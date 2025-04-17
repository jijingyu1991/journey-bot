/*
 * @Date: 2025-04-17
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-17 15:17:27
 */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getUserChats } from '@/lib/services/chatService'

// 获取聊天列表
export async function GET() {
  try {
    const session = await auth()

    // 验证用户是否已登录
    if (!session || !session.user) {
      return NextResponse.json([])
    }

    const userId = session.user.id
    console.log('查询', userId)

    // 从数据库获取该用户的聊天列表
    const chats = await getUserChats(Number(userId))

    return NextResponse.json(chats)
  } catch (error) {
    console.error('获取聊天列表失败:', error)
    return NextResponse.json({ error: '获取聊天列表失败' }, { status: 500 })
  }
}
