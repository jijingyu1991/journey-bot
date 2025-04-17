/*
 * @Date: 2025-04-17
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-17 15:52:22
 */
'use client'

import React, { useState, useEffect } from 'react'
import ChatList from '@/components/ChatList'
import { Compass, MapPin, MessageCircle } from 'lucide-react'

// 定义消息类型
interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  createdAt: string
}

// 定义聊天类型
interface Chat {
  id: string
  title: string
  messages: Message[]
}

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 当选择聊天时，获取该聊天的消息
  useEffect(() => {
    if (!selectedChatId) return

    const fetchChatMessages = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`/api/chat/${selectedChatId}`)

        if (!response.ok) {
          throw new Error('获取聊天消息失败')
        }

        const data = await response.json()
        setCurrentChat(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取聊天消息失败')
        console.error('获取聊天消息错误:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchChatMessages()
  }, [selectedChatId])

  // 处理聊天选择
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      {/* 左侧聊天列表 */}
      <div className="w-1/4 border-r  min-h-full border-teal-100 overflow-y-auto bg-gradient-to-br from-teal-50 to-blue-50 relative">
        <div className="p-4 border-b border-teal-100 bg-gradient-to-r from-teal-50 to-blue-50">
          <h2 className="text-xl font-medium text-teal-700 flex items-center">
            <MessageCircle className="mr-2 text-teal-500" size={20} /> JBot
          </h2>
        </div>
        <ChatList onSelectChat={handleSelectChat} />
      </div>

      {/* 右侧消息区域 */}
      <div className="flex-1 flex flex-col">
        {selectedChatId ? (
          <>
            {/* 聊天标题 */}
            <div className="p-4 border-b border-teal-100 bg-white/70 backdrop-blur-sm">
              <h2 className="text-xl font-medium text-teal-700 flex items-center">
                {currentChat?.title || '加载中...'}
              </h2>
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-teal-50/50 to-blue-50/50">
              {loading ? (
                <div className="flex justify-center items-center h-full text-teal-500">
                  <Compass className="animate-spin mr-2" size={24} /> 信息正在途中...
                </div>
              ) : error ? (
                <div className="text-red-400 p-4 rounded-lg border border-red-200 bg-red-50/70">{error}</div>
              ) : (
                <div className="space-y-4">
                  {currentChat?.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg max-w-[70%] shadow-sm ${
                        message.role === 'user'
                          ? 'bg-teal-100/80 border border-teal-200/50 ml-auto text-teal-800'
                          : 'bg-white/80 border border-blue-100/50 text-blue-800'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.role === 'user' ? (
                          <MapPin size={16} className="text-teal-500 mt-1" />
                        ) : (
                          <Compass size={16} className="text-blue-500 mt-1" />
                        )}
                        <div>{message.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-full text-teal-600 bg-gradient-to-br from-teal-50/50 to-blue-50/50">
            <Compass size={48} className="text-teal-400 mb-4" />
            <p>请选择一个聊天或开始新的旅程</p>
          </div>
        )}
      </div>
    </div>
  )
}
