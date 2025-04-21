/*
 * @Date: 2025-04-21 11:40:42
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-21 14:23:07
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
