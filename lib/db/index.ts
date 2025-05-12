/*
 * @Date: 2025-04-17
 * @LastEditors: guantingting
 * @LastEditTime: 2025-05-12 16:53:24
 */

import getMongoClient from '../mongodb'
import { Chat, ChatSchema } from './chats/schema'
import { UserSchema } from './users/schema'
import { Document, WithId } from 'mongodb'

// 明确 Message 类型
export type Message = {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  createdAt: Date
  revisionId?: string
  reasoning?: string
}

// 创建db对象，包含所有模型
export const db = {
  chat: {
    findMany: async ({
      where,
      orderBy,
      select,
    }: {
      where?: Record<string, unknown>
      orderBy?: { field: string; direction: 'asc' | 'desc' }
      select?: Partial<Record<keyof Chat, boolean>>
    }): Promise<Partial<Chat>[]> => {
      const client = await getMongoClient
      const collection = client.db().collection('chats')

      const query = where || {}
      const sort = orderBy ? ({ [orderBy.field]: orderBy.direction === 'desc' ? -1 : 1 } as Record<string, 1 | -1>) : {}

      const chats = await collection.find(query).sort(sort).toArray()
      const mappedChats = chats.map(mapChatFromDb)

      if (select) {
        return mappedChats.map((chat) => {
          const result = {} as Partial<Chat>
          ;(Object.keys(select) as (keyof Chat)[]).forEach((key) => {
            if (select[key]) {
              // @ts-expect-error 类型断言
              result[key] = chat[key as keyof Chat]
            }
          })
          return result
        })
      }

      return mappedChats
    },

    findUnique: async ({
      where,
      include,
    }: {
      where: Record<string, unknown>
      include?: { messages?: { orderBy?: { field?: string; direction?: 'asc' | 'desc' } } }
    }): Promise<(Chat & { messages?: Message[] }) | null> => {
      const client = await getMongoClient
      const db = client.db()
      const chatsCollection = db.collection('chats')

      const chatDoc = await chatsCollection.findOne(where)
      if (!chatDoc) return null

      const chat = mapChatFromDb(chatDoc)

      // 如果需要包含消息
      if (include && include.messages) {
        const messagesCollection = db.collection('messages')
        const orderBy = include.messages.orderBy || {}
        const sort = { [orderBy.field || 'createdAt']: orderBy.direction === 'desc' ? -1 : 1 } as Record<string, 1 | -1>

        const messagesDocs = await messagesCollection.find({ chatId: chat.id }).sort(sort).toArray()
        const messages = messagesDocs.map(mapMessageFromDb)
        return {
          ...chat,
          messages,
        }
      }

      return chat
    },
  },
}

// 导出其他模型
export { ChatSchema, UserSchema }

// 数据库对象转 Chat
function mapChatFromDb(doc: WithId<Document>): Chat {
  return {
    id: typeof doc.id === 'string' ? doc.id : doc._id?.toString?.() ?? '',
    userId: doc.userId as string,
    title: doc.title as string,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
    isArchived: typeof doc.isArchived === 'boolean' ? doc.isArchived : false,
  }
}

// 数据库对象转 Message
function mapMessageFromDb(doc: WithId<Document>): Message {
  return {
    id: typeof doc.id === 'string' ? doc.id : doc._id?.toString?.() ?? '',
    content: doc.content as string,
    role: doc.role as 'user' | 'assistant' | 'system',
    createdAt: new Date(doc.createdAt),
    revisionId: doc.revisionId as string | undefined,
    reasoning: doc.reasoning as string | undefined,
  }
}
