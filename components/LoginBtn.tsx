/*
 * @Date: 2025-04-16 16:14:07
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-18 11:27:43
 */
import React from 'react'
import { auth, signIn, signOut } from '@/auth'
import { Button } from '@/components/ui/button'
import { LogOut, LogIn } from 'lucide-react'

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
          <Button
            className="fixed top-4 right-4 z-50 bg-teal-500/90 text-white hover:bg-teal-600 shadow-md hover:shadow-lg transition-all px-4 rounded-full border border-teal-400 backdrop-blur-sm"
            variant="default"
          >
            <div className="flex items-center gap-2">
              <span>{session?.user?.username}</span>
              <LogOut size={16} />
            </div>
          </Button>
        </form>
      ) : (
        <form
          action={async () => {
            'use server'
            await signIn('github', { redirectTo: '/chat' })
          }}
        >
          <Button
            className="fixed top-4 right-4 z-50 bg-teal-500/90 text-white hover:bg-teal-600 shadow-md hover:shadow-lg transition-all px-4 rounded-full border border-teal-400 backdrop-blur-sm"
            variant="default"
          >
            <div className="flex items-center gap-2">
              <LogIn size={16} />
              <span>开始旅程</span>
            </div>
          </Button>
        </form>
      )}
    </>
  )
}

export default LoginBtn
