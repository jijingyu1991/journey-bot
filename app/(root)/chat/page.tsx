/*
 * @Date: 2025-04-17
 * @LastEditors: guantingting
 * @LastEditTime: 2025-05-12 17:27:12
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
import type { Chat } from '@/components/ChatList'
import { isDrawingRequest } from '@/lib/utils'

// 定义消息

export default function ChatPage() {
  const { activeChat, setActiveChat } = useActiveChat()
  const [messages, setMessages] = useState<MessageProps[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState('')
  const [respondType, setRespondType] = useState<'text' | 'image'>('text')

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

  const messageType = useMemo(() => {
    return respondType
  }, [respondType])

  const fetchChats = useCallback(async () => {
    try {
      setListLoading(true)
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
      setListError(err instanceof Error ? err.message : '获取聊天列表失败')
      console.error('获取聊天列表错误:', err)
    } finally {
      console.log('获取聊天列表完成')
      setListLoading(false)
    }
  }, [setActiveChat])

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

  useEffect(() => {
    fetchChats()
  }, [fetchChats])

  // 处理发送消息
  const handleSend = useCallback(
    async (inputValue: string) => {
      if (!inputValue.trim()) return

      try {
        // 更新状态
        setStatus('loading')

        // 根据输入词判断是否要生成图片
        const isDrawing = isDrawingRequest(inputValue)
        setRespondType(isDrawing ? 'image' : 'text')

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
            respondType: isDrawing ? 'image' : 'text',
          }),
        })

        if (!response.ok) {
          throw new Error('发送消息失败')
        }

        // 检查返回内容类型
        const contentType = response.headers.get('content-type')

        // 如果是JSON格式，可能包含图片数据
        if (contentType && contentType.includes('image/webp')) {
          const data = await response.json()

          // 如果返回了图片数据
          if (data.image) {
            // 更新助手消息为图片
            updateAssistantMessage(`![AI生成图片](data:image/png;base64,${data.image})`)
          }
        } else if (contentType && contentType.includes('text/plain')) {
          const data = await response.json()
          updateAssistantMessage(data.content)
        } else {
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
        }
      } catch (error) {
        console.error('消息处理错误:', error)
        setStatus('error')
        // 新增：接口失败时，助手消息显示网络繁忙
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-error-${Date.now()}`,
            chatId: activeChat?.id,
            role: 'assistant',
            content: '网络繁忙，请稍后再试',
            revisionId: `rev-error-${Date.now()}`,
            createdAt: new Date(),
          },
        ])
      } finally {
        console.log('find')
        setStatus('idle')

        // 消息处理完成后刷新消息列表，确保显示最新的数据库记录
        console.log('刷新消息列表')
        setTimeout(() => {
          fetchChatMessages()
          if (!activeChat.title || activeChat?.title === '新对话') {
            fetchChats()
          }
        }, 500) // 添加少量延迟，确保数据库操作完成
      }
    },
    [activeChat, messages, fetchChatMessages, fetchChats]
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
  console.log('messages', messages)

  return (
    <div className="flex h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      {/* 左侧聊天列表 */}
      <div className="w-1/4 border-r min-h-full border-teal-100 overflow-y-auto bg-gradient-to-br from-teal-50 to-blue-50 relative">
        <div className="p-4 border-b border-teal-100 bg-gradient-to-r from-teal-50 to-blue-50">
          <h2 className="text-xl font-medium text-teal-700 flex items-center">
            <MessageCircle className="mr-2 text-teal-500" size={20} /> JBot
          </h2>
        </div>
        <ChatList chats={chats} loading={listLoading} error={listError} fetchChats={fetchChats} />
      </div>

      {/* 右侧消息区域 */}
      <div className="flex-1 flex flex-col relative pt-10">
        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-4 mb-20">
          {messages.map((message) =>
            message.role === 'user' ? (
              <UserMessage key={message.id} {...message} message={message} />
            ) : (
              <AssistantMessage
                key={message.id}
                {...message}
                message={message}
                status={chatInputStatus}
                messageType={messageType}
              />
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
