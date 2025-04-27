/*
 * @Date: 2025-04-14 11:27:51
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-27 16:48:29
 */
import { deepseek } from '@ai-sdk/deepseek'
import { createOpenAI } from '@ai-sdk/openai'

// 聊天模型 调用工具生成行程
const AI_MODEL = process.env.AI_MODEL
let aiModel: unknown
if (AI_MODEL === 'deepseek') {
  aiModel = deepseek('deepseek-chat')
} else if (AI_MODEL === 'deepseekR1') {
  aiModel = deepseek('deepseek-reasoner')
} else if (AI_MODEL === 'openai') {
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_URL,
  })
  aiModel = openai(process.env.MODEL)
}
export default aiModel

// 绘图模型 生成svg行程图
const DRAW_MODEL = process.env.AI_DRAW_MODEL
let drawModel: unknown
if (DRAW_MODEL === 'deepseek') {
  drawModel = deepseek('deepseek-chat')
} else if (DRAW_MODEL === 'deepseekR1') {
  drawModel = deepseek('deepseek-reasoner')
} else {
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_URL,
  })
  // 确保使用正确的图像模型
  drawModel = openai.image('dall-e-3')
}
export { drawModel }
