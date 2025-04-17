/*
 * @Date: 2025-04-10 13:31:58
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-16 16:45:00
 */
import React from 'react'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import '@/app/globals.css'
import LoginBtn from '@/components/LoginBtn'

const RootLayout = async ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <LoginBtn />
      <AntdRegistry>{children}</AntdRegistry>
    </>
  )
}
export default RootLayout
