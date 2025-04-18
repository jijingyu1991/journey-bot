/*
 * @Date: 2025-04-17 14:09:33
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-18 16:46:37
 */
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { PlusIcon, Compass, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useActiveChat } from '@/store/chat'
// 定义聊天项的类型
interface Chat {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

const ChatList: React.FC = () => {
  const { activeChat, setActiveChat } = useActiveChat()
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchChats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/chat/list')

      if (!response.ok) {
        throw new Error('获取聊天列表失败')
      }

      const data = await response.json()
      setChats(data)
      if (data.length > 0) {
        setActiveChat(data[0].id, data[0].title)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取聊天列表失败')
      console.error('获取聊天列表错误:', err)
    } finally {
      setLoading(false)
    }
  }

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

  // 获取聊天列表
  useEffect(() => {
    fetchChats()
  }, [])

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
        className="absolute bottom-4 right-4 bg-teal-500 hover:bg-teal-600 text-white shadow-md hover:shadow-lg transition-all rounded-full px-4"
        onClick={createNewChat}
      >
        <PlusIcon className="mr-1" size={18} /> 新建会话
      </Button>
    </div>
  )
}

export default ChatList
