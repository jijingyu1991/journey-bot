/*
 * @Date: 2025-04-10 14:45:12
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-24 10:35:12
 */
'use client'

import React, { useState, memo } from 'react'
import { Sender } from '@ant-design/x'

interface ChatInputProps {
  onSubmit: (value: string) => void
  status?: string
}

const ChatInput: React.FC<ChatInputProps> = memo(({ onSubmit, status }) => {
  const [inputValue, setInputValue] = useState('')
  const loading = status === 'submitted' || status === 'streaming'
  const handleSubmit = () => {
    if (!inputValue.trim()) return
    onSubmit(inputValue)
    setInputValue('') // 发送后清空输入框
  }

  return (
    <div className="absolute bottom-8 w-[90%] left-1/2 transform -translate-x-1/2 flex justify-center z-10">
      <style jsx global>{`
        /* 修改发送按钮的样式 */
        .ant-sender .ant-btn-primary {
          background-color: #38b2ac !important; /* teal-500 */
        }

        /* 修改鼠标悬停时的样式 */
        .ant-sender .ant-btn-primary:hover {
          background-color: #2c7a7b !important; /* teal-600 */
        }

        /* 修改加载按钮的样式 */
        .ant-sender-actions-btn-loading-button {
          background-color: #38b2ac !important; /* teal-500 */
          color: white !important;
        }

        /* 修改加载按钮悬停样式 */
        .ant-sender-actions-btn-loading-button:hover {
          background-color: #2c7a7b !important; /* teal-600 */
        }

        /* 修改加载动画颜色 */
        .ant-sender-actions-btn-loading-button .ant-spin-dot-item {
          background-color: white !important;
        }
      `}</style>
      <Sender
        loading={loading}
        value={inputValue}
        onChange={(value) => setInputValue(value)}
        onSubmit={handleSubmit}
        className="w-full rounded-lg shadow-md border border-teal-100"
        style={{
          background: 'linear-gradient(to right, #e6fffa, #ebf8ff)',
          borderColor: '#b2f5ea',
        }}
      />
    </div>
  )
})

ChatInput.displayName = 'ChatInput'

export default ChatInput
