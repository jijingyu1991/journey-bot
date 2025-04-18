/*
 * @Date: 2025-04-17
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-18 16:16:41
 */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getChatById } from '@/lib/db/chats'

// 获取特定聊天及其消息
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    // 验证用户是否已登录
    if (!session || !session.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { id: chatId } = await params

    // 直接获取聊天信息
    const chat = await getChatById(chatId)

    if (!chat) {
      return NextResponse.json({ error: '聊天不存在或无权访问' }, { status: 404 })
    }

    // 将消息转换为前端需要的格式
    const messages = chat.messages
      ? chat.messages.map((msg) => ({
          id: msg.id,
          chatId: chatId,
          content: msg.content,
          role: msg.role,
          revisionId: msg.revisionId || msg.id,
          createdAt: msg.createdAt,
          reasoning: msg.reasoning,
        }))
      : []

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('获取聊天消息失败:', error)
    return NextResponse.json({ error: '获取聊天消息失败' }, { status: 500 })
  }
}
