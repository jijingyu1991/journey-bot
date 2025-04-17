/*
 * @Date: 2025-04-16
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-16
 */
import { NextRequest, NextResponse } from 'next/server'
import { getUserById, updateUser, deleteUser, UserSchema } from '@/lib/db/users'
import { auth } from '@/auth'

// 获取单个用户信息
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    // 验证用户是否已登录
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const userId = parseInt(params.id, 10)
    const user = await getUserById(userId)

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return NextResponse.json({ error: '获取用户信息失败' }, { status: 500 })
  }
}

// 更新用户信息
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    // 验证用户是否已登录
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const userId = parseInt(params.id, 10)
    const body = await request.json()

    // 验证请求数据
    const validationResult = UserSchema.partial().safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: '无效的用户数据', details: validationResult.error.format() }, { status: 400 })
    }

    const userData = validationResult.data
    const result = await updateUser(userId, userData)

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('更新用户信息失败:', error)
    return NextResponse.json({ error: '更新用户信息失败' }, { status: 500 })
  }
}

// 删除用户
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    // 验证用户是否已登录
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const userId = parseInt(params.id, 10)
    const result = await deleteUser(userId)

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除用户失败:', error)
    return NextResponse.json({ error: '删除用户失败' }, { status: 500 })
  }
}
