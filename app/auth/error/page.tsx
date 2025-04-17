/*
 * @Date: 2025-04-16 16:50:00
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-16 16:50:00
 */
'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  let errorMessage = '发生未知错误，请稍后再试'

  if (error === 'OAuthSignin') errorMessage = '授权开始出错'
  else if (error === 'OAuthCallback') errorMessage = '授权回调出错'
  else if (error === 'OAuthCreateAccount') errorMessage = '创建OAuth账号出错'
  else if (error === 'EmailCreateAccount') errorMessage = '创建邮箱账号出错'
  else if (error === 'Callback') errorMessage = '回调处理出错'
  else if (error === 'OAuthAccountNotLinked') errorMessage = '此邮箱已经使用其他登录方式注册'
  else if (error === 'EmailSignin') errorMessage = '邮箱登录出错'
  else if (error === 'CredentialsSignin') errorMessage = '登录凭据无效'
  else if (error === 'SessionRequired') errorMessage = '请先登录后访问'
  else if (error === 'Default') errorMessage = '发生错误，请稍后再试'

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">登录错误</h2>
          <p className="mt-2 text-sm text-gray-600">{errorMessage}</p>
        </div>
        <div className="mt-8 flex justify-center">
          <Link href="/">
            <Button>返回首页</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
