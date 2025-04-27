/*
 * @Date: 2025-04-27 16:30:55
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-27 16:50:47
 */
import { NextResponse } from 'next/server'
import { drawModel } from '@/ai/aiModel'
import { experimental_generateImage as generateImage, ImageModel } from 'ai'
import imagePrompt from '@/ai/imagePrompt'

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()
    let prompt = ''

    if (messages && messages.length > 0) {
      prompt = imagePrompt + messages[messages.length - 1].content
    } else {
      return NextResponse.json({ error: '缺少消息内容' }, { status: 400 })
    }

    if (!prompt) {
      return NextResponse.json({ error: '缺少提示词参数' }, { status: 400 })
    }

    console.log('开始生成图片，提示词长度:', prompt.length)

    const result = await generateImage({
      model: drawModel as ImageModel,
      prompt: prompt,
      size: '124x124',
    })

    if (!result || !result.image) {
      return NextResponse.json({ error: '图片生成失败' }, { status: 500 })
    }

    console.log('图片生成成功', result.image.base64)

    // 返回Base64格式的图片数据
    return NextResponse.json({
      success: true,
      imageData: result.image.base64,
      contentType: 'image/webp', // 默认格式，根据实际情况可能需要调整
    })
  } catch (error: unknown) {
    console.error('图片生成错误:', error)
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    return NextResponse.json({ error: '生成图片时出错', details: errorMessage }, { status: 500 })
  }
}
