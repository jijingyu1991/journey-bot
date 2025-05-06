/*
 * @Date: 2025-04-30 16:52:52
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-30 17:26:48
 */
import { experimental_generateImage as generateImage, ImageModel } from 'ai'
import { drawModel } from './aiModel'

export const drawImage = async (prompt: string): Promise<string | null> => {
  try {
    const result = await generateImage({
      model: drawModel as ImageModel,
      prompt: prompt,
      size: '1024x1024',
    })
    if (result && result.image) {
      return result.image.base64
    }
  } catch (error) {
    console.error('图片生成错误:', JSON.stringify(error))
    // const errorMessage = error instanceof Error ? error.message : '未知错误'
    // return errorMessage
  }
  return null
}
