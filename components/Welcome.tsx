/*
 * @Date: 2025-04-10 14:59:01
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-29 10:39:51
 */
'use client'
import React from 'react'
import { Welcome } from '@ant-design/x'

const Welcom = () => {
  return (
    <>
      <Welcome
        className="w-full z-10"
        style={{
          backgroundImage: 'linear-gradient(97deg, #f2f9fe 0%, #f7f3ff 100%)',
          padding: '16px',
        }}
        icon="https://file.302.ai/gpt/imgs/20250429/ecb0501b62714664a23adf8a5e2997fe.png"
        title="Hi! I'm JourneyBot — your AI travel planner."
        description="Get custom trip plans, anywhere in the world. Just tell me what you love, and I’ll handle the rest."
      />
    </>
  )
}

export default Welcom
