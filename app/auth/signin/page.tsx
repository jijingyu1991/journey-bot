/*
 * @Date: 2025-04-16 16:48:00
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-16 16:48:00
 */
import React from 'react'
import { Button } from '@/components/ui/button'
import { GithubIcon } from 'lucide-react'
import { signIn } from '@/auth'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">登录账号</h2>
          <p className="mt-2 text-sm text-gray-600">登录后体验更多功能</p>
        </div>
        <div className="mt-8 space-y-6">
          <form
            action={async () => {
              'use server'
              await signIn('github', { redirectTo: '/' })
            }}
          >
            <Button type="submit" className="w-full flex items-center justify-center gap-2">
              <GithubIcon size={20} />
              <span>使用 GitHub 登录</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
