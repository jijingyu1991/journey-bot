/*
 * @Date: 2025-04-16
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-16
 */
import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUsers, UserSchema } from '@/lib/db/users'
import { auth } from '@/auth'

// 获取用户列表
export async function GET() {
  try {
    const session = await auth()

    // 验证用户是否已登录
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const users = await getUsers()
    return NextResponse.json(users)
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return NextResponse.json({ error: '获取用户列表失败' }, { status: 500 })
  }
}

// 创建新用户
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    // 验证用户是否已登录
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const body = await request.json()

    // 验证请求数据
    const validationResult = UserSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: '无效的用户数据', details: validationResult.error.format() }, { status: 400 })
    }

    const userData = validationResult.data
    const result = await createUser(userData)

    return NextResponse.json({ success: true, userId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('创建用户失败:', error)
    return NextResponse.json({ error: '创建用户失败' }, { status: 500 })
  }
}
