/*
 * @Date: 2025-04-16 16:14:07
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-17 13:58:51
 */
import React from 'react'
import { auth, signIn, signOut } from '@/auth'
import { Button } from '@/components/ui/button'
const LoginBtn = async () => {
  const session = await auth()
  return (
    <>
      {session ? (
        <form
          action={async () => {
            'use server'
            await signOut({ redirectTo: '/' })
          }}
        >
          <Button className="fixed top-0 right-0 z-50" variant="ghost">
            {session?.user?.username},登出
          </Button>
        </form>
      ) : (
        <form
          action={async () => {
            'use server'
            await signIn('github')
          }}
        >
          <Button className="fixed top-0 right-0 z-50" variant="ghost">
            登录
          </Button>
        </form>
      )}
    </>
  )
}

export default LoginBtn
