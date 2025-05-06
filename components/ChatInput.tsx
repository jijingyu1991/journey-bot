/*
 * @Date: 2025-04-10 14:45:12
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-28 16:46:45
 */
'use client'

import React from 'react'
import { Sender } from '@ant-design/x'
interface ChatInputProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  inputValue?: string
  setInput: (value: string) => void
  status?: string
}

const ChatInput: React.FC<ChatInputProps> = ({ inputValue, status, setInput, handleSubmit }) => {
  const handleSend = async () => {
    handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>)
  }

  return (
    <div className="fixed bottom-8 w-[90%] left-1/2 transform -translate-x-1/2 flex justify-center bg-white z-10">
      <Sender
        loading={status === 'submitted' || status === 'streaming'}
        value={inputValue}
        onChange={(v) => {
          setInput(v)
        }}
        onSubmit={handleSend}
      />
    </div>
  )
}

export default ChatInput
