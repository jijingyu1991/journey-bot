/*
 * @Date: 2025-04-14 11:27:51
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-15 05:30:41
 */
import { deepseek } from '@ai-sdk/deepseek'
import { createOpenAI } from '@ai-sdk/openai'

const AI_MODEL = process.env.AI_MODEL
let aiModel: unknown
if (AI_MODEL === 'deepseek') {
  aiModel = deepseek('deepseek-chat')
} else if (AI_MODEL === 'openai') {
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_URL,
  })
  aiModel = openai(process.env.MODEL)
}

export default aiModel
