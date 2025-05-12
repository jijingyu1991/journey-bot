/*
 * @Date: 2025-04-17
 * @LastEditors: guantingting
 * @LastEditTime: 2025-05-12 16:00:26
 */
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getChatsByUserId } from '@/lib/db/chats'

// 获取聊天列表
export async function GET() {
  try {
    const session = await auth()

    console.log('session', session)
    // 验证用户是否已登录
    if (!session || !session.user) {
      return NextResponse.json([])
    }

    const userId = session.user.id

    // 从数据库获取该用户的聊天列表
    const chats = await getChatsByUserId(userId)

    return NextResponse.json(chats)
  } catch (error) {
    console.error('获取聊天列表失败:', error)
    return NextResponse.json({ error: '获取聊天列表失败' }, { status: 500 })
  }
}
