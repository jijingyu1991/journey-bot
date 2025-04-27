/*
 * @Date: 2025-04-10 13:31:58
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-27 16:35:07
 */
'use client'
import { useChat } from '@ai-sdk/react'
import ChatInput from '@/components/ChatInput'
import Welcome from '@/components/Welcome'
import UserMessage from '@/components/UserMessage'
import AssistantMessage from '@/components/AssistantMessage'
import { useEffect, useRef } from 'react'

const Home = () => {
  const { messages, input, status, setInput, handleSubmit } = useChat({
    api: '/api/ai/image',
    onResponse: (response) => {
      console.log('response', response)
    },
  })

  // 添加消息容器的引用
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 添加滚动到底部的函数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 当消息更新时滚动到底部
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  console.log('messages', messages)
  return (
    <>
      <Welcome />
      <div className="mt-10 mb-40">
        {messages.map((message) => {
          if (message.role === 'user') {
            return <UserMessage key={message.id} message={message} />
          } else if (message.role === 'assistant') {
            return <AssistantMessage key={message.id} message={message} status={status} />
          }
          return null
        })}
        {/* 添加一个空白的div作为滚动目标 */}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput handleSubmit={handleSubmit} inputValue={input} setInput={setInput} status={status} />
    </>
  )
}

export default Home
