/*
 * @Date: 2025-04-17
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-17
 */
'use client'

import React, { useState, useEffect } from 'react'
import ChatList from '@/components/ChatList'

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
    <div className="flex h-screen">
      {/* 左侧聊天列表 */}
      <div className="w-1/4 border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">聊天列表</h2>
        </div>
        <ChatList onSelectChat={handleSelectChat} />
      </div>

      {/* 右侧消息区域 */}
      <div className="flex-1 flex flex-col">
        {selectedChatId ? (
          <>
            {/* 聊天标题 */}
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">{currentChat?.title || '加载中...'}</h2>
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex justify-center items-center h-full">加载消息中...</div>
              ) : error ? (
                <div className="text-red-500 p-4">{error}</div>
              ) : (
                <div className="space-y-4">
                  {currentChat?.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg max-w-[70%] ${
                        message.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
                      }`}
                    >
                      {message.content}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500">请选择一个聊天或开始新的对话</div>
        )}
      </div>
    </div>
  )
}
