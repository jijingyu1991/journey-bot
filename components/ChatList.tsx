/*
 * @Date: 2025-04-17 14:09:33
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-17 15:21:17
 */
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
// 定义聊天项的类型
interface Chat {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

// 定义组件的props
interface ChatListProps {
  onSelectChat: (chatId: string) => void
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取聊天列表失败')
      console.error('获取聊天列表错误:', err)
    } finally {
      setLoading(false)
    }
  }

  // 处理点击聊天项
  const handleChatClick = (chatId: string) => {
    onSelectChat(chatId)
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
    return <div className="flex justify-center p-4">加载中...</div>
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  return (
    <div className="flex flex-col space-y-2 p-2">
      {chats.length === 0 ? (
        <div className="text-center text-gray-500 p-4">暂无会话记录</div>
      ) : (
        chats.map((chat) => (
          <div
            key={chat.id}
            className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => handleChatClick(chat.id)}
          >
            <h3 className="font-medium">{chat.title}</h3>
            <p className="text-sm text-gray-500">{format(new Date(chat.updatedAt), 'yyyy-MM-dd HH:mm')}</p>
          </div>
        ))
      )}
      <Button className="absolute bottom-4" onClick={createNewChat}>
        <PlusIcon /> 新建会话
      </Button>
    </div>
  )
}

export default ChatList
