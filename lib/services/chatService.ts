/*
 * @Date: 2025-04-16
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-21 11:33:48
 */
import { createChat, getChatById, addMessageToChat } from '../db/chats'
import { MessageProps } from '@/interface/message'
import { nanoid } from 'nanoid'
import { Message } from '../db/chats/schema'

// 向聊天添加新消息
export async function addMessageToChatSession(
  chatId: string,
  content: string,
  role: 'user' | 'assistant' | 'system',
  revisionId?: string,
  reasoning?: string
): Promise<MessageProps> {
  // 创建新消息
  const message: Message = {
    id: nanoid(),
    content,
    role,
    createdAt: new Date(),
    revisionId,
    reasoning,
  }

  // 将消息添加到聊天会话的messages数组
  await addMessageToChat(chatId, message)

  return {
    id: message.id,
    chatId,
    content: message.content,
    role: message.role,
    createdAt: message.createdAt,
    revisionId: message.revisionId || '',
    reasoning: message.reasoning,
  }
}

// 获取聊天会话的所有消息
export async function getChatMessages(chatId: string): Promise<MessageProps[]> {
  // 获取聊天对象
  const chat = await getChatById(chatId)

  if (chat && chat.messages && chat.messages.length > 0) {
    // 如果聊天对象中有messages数组，则直接使用
    return chat.messages.map((message: Message) => ({
      id: message.id,
      chatId, // 使用传入的chatId
      content: message.content,
      role: message.role,
      createdAt: message.createdAt,
      revisionId: message.revisionId || '',
      reasoning: message.reasoning,
    }))
  }

  // 如果没有消息，返回空数组
  return []
}
