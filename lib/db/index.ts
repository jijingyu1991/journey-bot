/*
 * @Date: 2025-04-17
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-18 16:11:26
 */

import { getMongoClient } from '../mongodb'
import { ChatSchema } from './chats'
import { UserSchema } from './users'

// 创建db对象，包含所有模型
export const db = {
  chat: {
    findMany: async ({ where, orderBy, select }: any) => {
      const client = await getMongoClient()
      const collection = client.db().collection('chats')

      const query = where || {}
      const sort = orderBy ? { [orderBy.field]: orderBy.direction === 'desc' ? -1 : 1 } : {}

      const chats = await collection.find(query).sort(sort).toArray()

      // 如果有select，只返回选定的字段
      if (select) {
        return chats.map((chat) => {
          const result: any = {}
          Object.keys(select).forEach((key) => {
            if (select[key]) {
              result[key] = chat[key]
            }
          })
          return result
        })
      }

      return chats
    },

    findUnique: async ({ where, include }: any) => {
      const client = await getMongoClient()
      const db = client.db()
      const chatsCollection = db.collection('chats')

      const chat = await chatsCollection.findOne(where)

      if (!chat) return null

      // 如果需要包含消息
      if (include && include.messages) {
        const messagesCollection = db.collection('messages')
        const orderBy = include.messages.orderBy || {}
        const sort = { [orderBy.field || 'createdAt']: orderBy.direction === 'desc' ? -1 : 1 }

        const messages = await messagesCollection.find({ chatId: chat._id.toString() }).sort(sort).toArray()

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
