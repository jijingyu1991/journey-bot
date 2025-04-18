import { NextResponse } from 'next/server'
import { LanguageModelV1, streamText } from 'ai'
import aiModel from '@/ai/aiModel'
import { auth } from '@/auth'
import { travelGeneratePrompt } from '@/ai/travelGenerate'
import { addMessageToChatSession } from '@/lib/services/chatService'
import { nanoid } from 'nanoid'

/*
 * @Date: 2025-04-18 10:27:00
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-18 16:15:26
 */
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }
    const { messages, chatId } = await request.json()
    if (!chatId) {
      return NextResponse.json({ error: '聊天ID不存在' }, { status: 400 })
    }

    // 保存用户消息到数据库
    const userMessage = messages[messages.length - 1]
    const revisionId = nanoid()
    await addMessageToChatSession(chatId, userMessage.content, 'user', revisionId)

    // 调用模型获取流式响应
    const result = streamText({
      model: aiModel as LanguageModelV1,
      system: travelGeneratePrompt,
      messages,
    })

    // 构建响应
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        // 处理流式响应
        let assistantResponse = ''
        for await (const chunk of result.textStream) {
          assistantResponse += chunk
          controller.enqueue(encoder.encode(chunk))
        }
        controller.close()

        // 保存模型响应到数据库
        await addMessageToChatSession(chatId, assistantResponse, 'assistant', nanoid())
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('DeepSeek API 错误:', error)
    return NextResponse.json({ error: '消息处理失败' }, { status: 500 })
  }
}
