/*
 * @Date: 2025-04-16
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-17 15:10:51
 */
import { createChat, getChatById, getChatsByUserId } from '../db/chats'
import { createMessage, getMessagesByChatId } from '../db/messages'
import { MessageProps } from '@/interface/message'

// 为当前对话创建一个新的聊天会话
export async function startNewChat(userId: number): Promise<string> {
  const chat = await createChat(userId)
  return chat.id
}

// 添加消息到聊天会话
export async function addMessageToChat(chatId: string, messageProps: MessageProps): Promise<void> {
  // 确保聊天存在
  const chat = await getChatById(chatId)
  if (!chat) {
    throw new Error(`聊天会话不存在: ${chatId}`)
  }

  // 创建消息
  await createMessage(chatId, messageProps.content, messageProps.role, messageProps.revisionId, messageProps.reasoning)
}

// 获取聊天会话的所有消息
export async function getChatMessages(chatId: string): Promise<MessageProps[]> {
  const messages = await getMessagesByChatId(chatId)

  return messages.map((message) => ({
    id: message.id,
    chatId: message.chatId,
    content: message.content,
    role: message.role,
    createdAt: message.createdAt,
    revisionId: message.revisionId || '',
    reasoning: message.reasoning,
  }))
}

// 获取用户的所有聊天会话
export async function getUserChats(userId: number) {
  const chats = await getChatsByUserId(userId)
  return chats
}
