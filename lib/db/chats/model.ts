/*
 * @Date: 2025-04-16
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-18 15:43:33
 */
import { Collection, Db } from 'mongodb'
import clientPromise from '../../mongodb'
import { Chat, Message } from './schema'
import { nanoid } from 'nanoid'

// 获取Chat集合
export async function getChatsCollection(): Promise<Collection<Chat>> {
  const client = await clientPromise
  const db: Db = client.db(process.env.MONGODB_DB as string)
  return db.collection<Chat>('chats')
}

// 创建新的聊天会话
export async function createChat(userId: number, title?: string): Promise<Chat> {
  const chatsCollection = await getChatsCollection()

  const now = new Date()
  const chat: Chat = {
    id: nanoid(), // 生成唯一ID
    userId,
    title: title || '新对话',
    createdAt: now,
    updatedAt: now,
    isArchived: false,
    messages: [], // 初始化为空数组
  }

  await chatsCollection.insertOne(chat)
  return chat
}

// 获取用户的所有聊天
export async function getChatsByUserId(userId: number): Promise<Chat[]> {
  const chatsCollection = await getChatsCollection()
  const chats = await chatsCollection.find({ userId, isArchived: false }).sort({ updatedAt: -1 }).toArray()
  return chats
}

// 获取单个聊天信息
export async function getChatById(chatId: string): Promise<Chat | null> {
  const chatsCollection = await getChatsCollection()
  return await chatsCollection.findOne({ id: chatId })
}

// 更新聊天信息
export async function updateChat(
  chatId: string,
  updates: Partial<Omit<Chat, 'id' | 'userId' | 'createdAt'>>
): Promise<boolean> {
  const chatsCollection = await getChatsCollection()
  const result = await chatsCollection.updateOne(
    { id: chatId },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    }
  )
  return result.modifiedCount > 0
}

// 向聊天添加消息
export async function addMessageToChat(chatId: string, message: Message): Promise<boolean> {
  const chatsCollection = await getChatsCollection()
  const result = await chatsCollection.updateOne(
    { id: chatId },
    {
      $push: { messages: message },
      $set: { updatedAt: new Date() },
    }
  )
  return result.modifiedCount > 0
}

// 归档聊天
export async function archiveChat(chatId: string): Promise<boolean> {
  return await updateChat(chatId, { isArchived: true })
}
