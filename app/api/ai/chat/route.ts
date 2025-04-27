/*
 * @Date: 2025-04-10 17:51:08
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-27 16:23:54
 */
import aiModel from '@/ai/aiModel'
import { LanguageModelV1, streamText } from 'ai'
import { travelGeneratePrompt } from '@/ai/travelPrompt'
import { NextResponse } from 'next/server'
import { createAmapClient, mcpClient } from '@/ai/amapMcp'
import { withTimeout } from '@/lib/utils'

export async function POST(request: Request) {
  let amapClient: mcpClient | null = null

  try {
    const { messages } = await request.json()

    // 创建MCP客户端并获取工具
    amapClient = await createAmapClient()
    const mcpTools = await withTimeout(
      amapClient.tools(),
      5000, // 5秒获取工具超时
      '获取MCP工具列表超时'
    )

    // 自定义工具错误处理
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
    const response = result.toDataStreamResponse({
      sendReasoning: true,
      getErrorMessage: (error) => {
        console.error('工具调用出错:', error)
        // 根据错误类型返回不同的错误消息
        if (error instanceof Error) {
          if (error.message.includes('ToolInvocation must have a result')) {
            return '工具调用失败，请稍后再试。'
          }
          if (error.message.includes('closed client')) {
            return '连接已关闭，请重新开始对话。'
          }
          if (error.message.includes('timeout') || error.message.includes('超时')) {
            return '请求超时，请稍后再试。'
          }
        }
        return '处理请求时出错，请稍后重试。'
      },
    })
    return response
  } catch (error) {
    console.error('聊天API错误:', error)

    // 确保在错误情况下也关闭客户端
    if (amapClient) {
      try {
        console.log('在错误处理中关闭MCP客户端')
        await amapClient.close()
        amapClient = null
      } catch (closeError) {
        console.error('关闭MCP客户端时出错:', closeError)
      }
    }

    // 处理工具调用错误
    if (error instanceof Error && error.message.includes('ToolInvocation must have a result')) {
      console.error('工具调用缺少结果:', error)
      return NextResponse.json(
        {
          error: '工具调用失败',
          details: '服务暂时不可用，请稍后再试',
          message: error.message,
        },
        { status: 502 }
      )
    }

    // 处理客户端已关闭错误
    if (error instanceof Error && error.message.includes('closed client')) {
      console.error('客户端已关闭:', error)
      return NextResponse.json(
        {
          error: '连接已断开',
          details: '请重新开始对话',
          message: error.message,
        },
        { status: 503 }
      )
    }

    // 根据错误类型返回不同的错误响应
    if (error instanceof Error) {
      if (error.message?.includes('timeout') || error.message?.includes('超时')) {
        return NextResponse.json({ error: '请求超时，请稍后再试', details: error.message }, { status: 504 })
      }
    }

    // 处理一般错误
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    return NextResponse.json({ error: '处理聊天请求时出错', details: errorMessage }, { status: 500 })
  }
}
