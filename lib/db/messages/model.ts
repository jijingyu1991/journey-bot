/*
 * @Date: 2025-04-16
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-16 14:20:00
 */
import { Collection, Db } from 'mongodb'
import clientPromise from '../../mongodb'
import { Message } from './schema'
import { nanoid } from 'nanoid'

// 获取Message集合
export async function getMessagesCollection(): Promise<Collection<Message>> {
  const client = await clientPromise
  const db: Db = client.db(process.env.MONGODB_DB as string)
  return db.collection<Message>('messages')
}

// 创建新消息
export async function createMessage(
  chatId: string,
  content: string,
  role: 'user' | 'assistant' | 'system',
  revisionId?: string,
  reasoning?: string
): Promise<Message> {
  const messagesCollection = await getMessagesCollection()

  const message: Message = {
    id: nanoid(),
    chatId,
    content,
    role,
    createdAt: new Date(),
    revisionId,
    reasoning,
  }

  await messagesCollection.insertOne(message)
  return message
}

// 获取聊天的所有消息
export async function getMessagesByChatId(chatId: string): Promise<Message[]> {
  const messagesCollection = await getMessagesCollection()
  const messages = await messagesCollection.find({ chatId }).sort({ createdAt: 1 }).toArray()
  return messages
}

// 获取单个消息
export async function getMessageById(messageId: string): Promise<Message | null> {
  const messagesCollection = await getMessagesCollection()
  return await messagesCollection.findOne({ id: messageId })
}

// 更新消息内容
export async function updateMessage(
  messageId: string,
  updates: Partial<Omit<Message, 'id' | 'chatId' | 'role' | 'createdAt'>>
): Promise<boolean> {
  const messagesCollection = await getMessagesCollection()
  const result = await messagesCollection.updateOne({ id: messageId }, { $set: updates })
  return result.modifiedCount > 0
}

// 删除消息
export async function deleteMessage(messageId: string): Promise<boolean> {
  const messagesCollection = await getMessagesCollection()
  const result = await messagesCollection.deleteOne({ id: messageId })
  return result.deletedCount > 0
}
