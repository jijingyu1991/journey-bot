import { NextResponse } from 'next/server'
import { LanguageModelV1, streamText } from 'ai'
import aiModel from '@/ai/aiModel'
import { auth } from '@/auth'
import { travelGeneratePrompt } from '@/ai/travelPrompt'
import { addMessageToChatSession } from '@/lib/services/chatService'
import { nanoid } from 'nanoid'
import { generateChatTitle } from '@/lib/services/aiService'
import { createAmapClient } from '@/ai/amapMcp'
import { mcpClient } from '@/ai/amapMcp'
import { withTimeout } from '@/lib/utils'
import { createChat } from '@/lib/db/chats'
import { drawImage } from '@/ai/generateImage'

/*
 * @Date: 2025-04-18 10:27:00
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-21 14:06:13
 */
export async function POST(request: Request) {
  let amapClient: mcpClient | null = null
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }
    const { messages, chatId: initialChatId, respondType } = await request.json()
    const userId = session.user.id
    let chatId = initialChatId
    if (!chatId) {
      const { id } = await createChat(Number(userId))
      chatId = id
    }
    // 保存用户消息到数据库
    const userMessage = messages[messages.length - 1]
    const revisionId = nanoid()
    addMessageToChatSession(chatId, userMessage.content, 'user', revisionId)

    // 生成聊天标题
    generateChatTitle(chatId, messages)

    if (respondType === 'image') {
      const image = await drawImage(userMessage.content)
      if (image) {
        // 保存模型响应到数据库
        addMessageToChatSession(chatId, `![AI生成图片](data:image/png;base64,${image})`, 'assistant', nanoid())
        return NextResponse.json(
          { image },
          {
            status: 200,
            headers: {
              'Content-Type': 'image/webp',
            },
          }
        )
      }
    } else {
      // 创建MCP客户端并获取工具
      amapClient = await createAmapClient()
      const mcpTools = await withTimeout(
        amapClient.tools(),
        5000, // 5秒获取工具超时
        '获取MCP工具列表超时'
      )
      // 调用模型获取流式响应
      const result = streamText({
        model: aiModel as LanguageModelV1,
        system: travelGeneratePrompt,
        messages,
        maxSteps: 5,
        // 这里我们必须使用as any，因为类型系统无法正确处理MCP工具的类型
        // 但我们知道高德地图的MCP返回的工具是符合ToolSet格式的
        // @ts-expect-error MCP工具类型与ToolSet不完全兼容
        tools: mcpTools,
        toolChoice: 'auto',
        // 添加错误处理和修复工具调用逻辑
        experimental_repairToolCall: async ({ toolCall, error }) => {
          console.warn(`尝试修复工具调用: ${toolCall.toolName}`, error)
          return null
        },
        // 在所有步骤完成后触发
        onFinish: async () => {
          console.log('所有步骤已完成，开始关闭MCP客户端')
          // 在所有步骤完成后延迟关闭客户端，避免在工具调用期间关闭
          await Promise.all([amapClient?.close()])
        },
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
          addMessageToChatSession(chatId, assistantResponse, 'assistant', nanoid())
        },
      })
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    }
  } catch (error) {
    console.error('DeepSeek API 错误:', error)
    return NextResponse.json({ error: '消息处理失败' }, { status: 500 })
  }
}
