/*
 * @Date: 2025-04-21 11:40:42
 * @LastEditors: guantingting
 * @LastEditTime: 2025-05-06 16:00:59
 */
import { getChatById, updateChat } from '@/lib/db/chats'
import type { MessageProps } from '@/interface/message.d.ts'
import aiModel from '@/ai/aiModel'
import { generateText, LanguageModelV1 } from 'ai'
export async function generateChatTitle(chatId: string, messages: MessageProps[]) {
  const chat = await getChatById(chatId)
  const chatTitle = chat?.title || '新对话'
  if (!chatTitle || chatTitle === '新对话') {
    // 更新聊天标题
    const { text } = await generateText({
      model: aiModel as LanguageModelV1,
      system:
        '请根据以下对话生成一个标题, 标题需要简洁明了, 不要超过10个字,主要包含目的地和出行天数，如果有出发日期的话，标题需要包含出发日期，当没有目的地和出行天数时，标题为空',
      messages,
    })
    if (text) {
      await updateChat(chatId, { title: text })
    }
  }
}

export async function extractTravelInfo(messages: MessageProps[]) {
  const { text } = await generateText({
    model: aiModel as LanguageModelV1,
    system:
      '请根据对话信息，判断是否包含行程规划，如果包含，请提取出简单的时间、地点，及重要的天气或注意事项，以及用户对行程图的绘制需求，输出内容全英文。如果没有，请返回null',
    messages,
  })
  return text
}
