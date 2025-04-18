/*
 * @Date: 2025-04-17
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-18 16:26:39
 */
'use client'

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import ChatList from '@/components/ChatList'
import { MessageCircle } from 'lucide-react'
import ChatInput from '@/components/UserChatInput'
import { useActiveChat } from '@/store/chat'
import type { MessageProps } from '@/interface/message.d.ts'
import UserMessage from '@/components/UserMessage'
import AssistantMessage from '@/components/AssistantMessage'

// 定义消息

export default function ChatPage() {
  const { activeChat } = useActiveChat()
  const [messages, setMessages] = useState<MessageProps[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // 添加滚动到底部的函数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 当消息更新时滚动到底部
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 使用 useMemo 优化传递给 ChatInput 的 status 属性
  const chatInputStatus = useMemo(() => {
    return status === 'loading' ? 'streaming' : 'ready'
  }, [status])

  // 获取聊天消息的函数
  const fetchChatMessages = useCallback(async () => {
    if (!activeChat || !activeChat.id) return

    try {
      const response = await fetch(`/api/chat/${activeChat.id}`)
      if (!response.ok) {
        throw new Error('获取聊天记录失败')
      }

      const data = await response.json()
      if (data.messages && Array.isArray(data.messages)) {
        setMessages(data.messages)
      } else {
        setMessages([])
      }
    } catch (error) {
      console.error('获取聊天记录错误:', error)
      setMessages([])
    }
  }, [activeChat])

  // 当活动聊天变化时，获取聊天历史记录
  useEffect(() => {
    fetchChatMessages()
  }, [fetchChatMessages])

  // 处理发送消息
  const handleSend = useCallback(
    async (inputValue: string) => {
      if (!inputValue.trim()) return
      if (!activeChat || !activeChat.id) {
        console.error('没有选择聊天')
        return
      }

      try {
        // 更新状态
        setStatus('loading')

        // 生成唯一ID
        const messageId = Date.now().toString()
        const timestamp = new Date()

        // 添加用户消息到列表
        const userMessage: MessageProps = {
          id: messageId,
          chatId: activeChat.id,
          role: 'user',
          content: inputValue,
          revisionId: messageId,
          createdAt: timestamp,
        }

        setMessages((prev) => [...prev, userMessage])

        // 创建一个空的助手消息占位，稍后会用流式内容更新它
        const assistantMessage: MessageProps = {
          id: `assistant-${messageId}`,
          chatId: activeChat.id,
          role: 'assistant',
          content: '',
          revisionId: `rev-${messageId}`,
          createdAt: timestamp,
        }

        setMessages((prev) => [...prev, assistantMessage])

        // 准备发送到API的消息历史
        const messageHistory = messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }))

        // 添加当前用户消息
        messageHistory.push({ role: 'user', content: inputValue })

        // 发送消息到API
        const response = await fetch('/api/message/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId: activeChat.id,
            messages: messageHistory,
          }),
        })

        if (!response.ok) {
          throw new Error('发送消息失败')
        }

        // 处理流式响应
        const reader = response.body?.getReader()
        if (reader) {
          const decoder = new TextDecoder()
          let responseText = ''

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            // 解码新的文本块
            const chunk = decoder.decode(value, { stream: true })
            responseText += chunk

            // 更新助手消息
            updateAssistantMessage(responseText)
          }
        }
      } catch (error) {
        console.error('消息处理错误:', error)
        setStatus('error')
      } finally {
        console.log('find')
        setStatus('idle')

        // 消息处理完成后刷新消息列表，确保显示最新的数据库记录
        setTimeout(() => {
          fetchChatMessages()
        }, 500) // 添加少量延迟，确保数据库操作完成
      }
    },
    [activeChat, messages, fetchChatMessages]
  )

  // 更新助手消息内容（用于流式内容）
  const updateAssistantMessage = (content: string) => {
    // 更新最后一条助手消息
    setMessages((prev) => {
      const newMessages = [...prev]
      for (let i = newMessages.length - 1; i >= 0; i--) {
        if (newMessages[i].role === 'assistant') {
          newMessages[i].content = content
          break
        }
      }
      return newMessages
    })
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      {/* 左侧聊天列表 */}
      <div className="w-1/4 border-r min-h-full border-teal-100 overflow-y-auto bg-gradient-to-br from-teal-50 to-blue-50 relative">
        <div className="p-4 border-b border-teal-100 bg-gradient-to-r from-teal-50 to-blue-50">
          <h2 className="text-xl font-medium text-teal-700 flex items-center">
            <MessageCircle className="mr-2 text-teal-500" size={20} /> JBot
          </h2>
        </div>
        <ChatList />
      </div>

      {/* 右侧消息区域 */}
      <div className="flex-1 flex flex-col relative">
        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-4 mb-20">
          {messages.map((message) =>
            message.role === 'user' ? (
              <UserMessage key={message.id} {...message} message={message} />
            ) : (
              <AssistantMessage key={message.id} {...message} message={message} status={chatInputStatus} />
            )
          )}
          {/* 添加一个空白的div作为滚动目标 */}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入框 */}
        <ChatInput onSubmit={handleSend} status={chatInputStatus} />
      </div>
    </div>
  )
}
