/*
 * @Date: 2025-04-17
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-17
 */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

// 获取特定聊天及其消息
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    // 验证用户是否已登录
    if (!session || !session.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const userId = session.user.id
    const chatId = params.id

    // 检查聊天是否属于当前用户
    const chat = await db.chat.findUnique({
      where: {
        id: chatId,
        userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!chat) {
      return NextResponse.json({ error: '聊天不存在或无权访问' }, { status: 404 })
    }

    return NextResponse.json(chat)
  } catch (error) {
    console.error('获取聊天消息失败:', error)
    return NextResponse.json({ error: '获取聊天消息失败' }, { status: 500 })
  }
}
