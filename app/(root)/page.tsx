/*
 * @Date: 2025-04-10 13:31:58
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-14 18:05:12
 */
'use client'
import { useChat } from '@ai-sdk/react'
import ChatInput from '@/components/ChatInput'
import Welcome from '@/components/Welcome'
import UserMessage from '@/components/UserMessage'
import AssistantMessage from '@/components/AssistantMessage'

const Home = () => {
  const { messages, input, status, setInput, handleSubmit } = useChat({
    api: '/api/ai/chat',
    onResponse: (response) => {
      console.log('response', response)
    },
  })
  console.log('messages', messages)
  return (
    <>
      <Welcome />
      <div className="mt-10 mb-40">
        {messages.map((message, index) => {
          if (message.role === 'user') {
            return <UserMessage key={message.id} message={message} />
          } else if (message.role === 'assistant') {
            return <AssistantMessage key={message.id} message={message} status={status} />
          }
          return null
        })}
      </div>
      <ChatInput handleSubmit={handleSubmit} inputValue={input} setInput={setInput} status={status} />
    </>
  )
}

export default Home
