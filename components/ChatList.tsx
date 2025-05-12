/*
 * @Date: 2025-04-17 14:09:33
 * @LastEditors: guantingting
 * @LastEditTime: 2025-05-12 16:18:54
 */
import React, { memo } from 'react'
import { format } from 'date-fns'
import { PlusIcon, Compass, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useActiveChat } from '@/store/chat'
// 定义聊天项的类型
export interface Chat {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}
interface ChatListProps {
  chats: Chat[]
  loading: boolean
  error: string
  fetchChats: () => void
}

const ChatList: React.FC<ChatListProps> = memo(({ chats, loading, error, fetchChats }) => {
  console.log('chats', chats)
  const { activeChat, setActiveChat } = useActiveChat()

  // 处理点击聊天项
  const handleChatClick = (chatId: string, title: string) => {
    setActiveChat(chatId, title)
  }

  // 创建会话
  const createNewChat = async () => {
    try {
      const response = await fetch('/api/chat/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const data = await response.json()
        console.log('创建的聊天会话ID:', data.chatId)
        fetchChats()
      } else {
        console.error('创建聊天会话失败')
      }
    } catch (error) {
      console.error('创建聊天会话失败:', error)
    }
  }
  console.log(loading)
  if (loading) {
    return (
      <div className="flex justify-center p-4 text-teal-500">
        <div className="flex items-center gap-2">
          <Compass className="animate-spin" size={20} />
          <span className="font-medium">正在探索中...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-400 p-4 bg-red-50 rounded-lg border border-red-200">{error}</div>
  }

  return (
    <div className="flex flex-col space-y-3 p-4 bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg">
      {chats.length === 0 ? (
        <div className="text-center text-teal-600 p-5 bg-white/70 rounded-lg shadow-sm border border-teal-100">
          <MapPin className="inline-block mb-1 text-teal-400" size={20} />
          <div>暂无会话记录</div>
        </div>
      ) : (
        chats.map((chat) => (
          <div
            key={chat.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all shadow-sm 
              ${
                chat.id === activeChat.id
                  ? 'bg-teal-100 border-teal-300 shadow-md'
                  : 'bg-white/80 border-teal-100 hover:bg-teal-50/80 hover:shadow-md'
              }`}
            onClick={() => handleChatClick(chat.id, chat.title)}
          >
            <h3 className={`font-medium ${chat.id === activeChat.id ? 'text-teal-800' : 'text-teal-700'}`}>
              {chat.title}
              {chat.id === activeChat.id && (
                <span className="ml-2 text-xs bg-teal-500 text-white px-2 py-0.5 rounded-full">当前</span>
              )}
            </h3>
            <p className="text-sm text-teal-500 mt-1 flex items-center">
              <MapPin size={14} className="mr-1" />
              {format(new Date(chat.updatedAt), 'yyyy-MM-dd HH:mm')}
            </p>
          </div>
        ))
      )}
      <Button
        className="fixed bottom-4 left-4 bg-teal-500 hover:bg-teal-600 text-white shadow-md hover:shadow-lg transition-all rounded-full px-4"
        onClick={createNewChat}
      >
        <PlusIcon className="mr-1" size={18} /> 新建会话
      </Button>
    </div>
  )
})

ChatList.displayName = 'ChatList'

export default ChatList
