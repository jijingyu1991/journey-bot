/*
 * @Date: 2025-04-16
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-16 13:36:06
 */
import clientPromise from '@/lib/mongodb'
import { User } from './schema'

// 获取用户集合
export async function getUserCollection() {
  const client = await clientPromise
  const db = client.db()
  return db.collection<User>('users')
}

// 获取用户列表
export async function getUsers() {
  const collection = await getUserCollection()
  return collection.find({}).toArray()
}

// 通过ID获取用户
export async function getUserById(id: number) {
  const collection = await getUserCollection()
  return collection.findOne({ id })
}

// 通过邮箱获取用户
export async function getUserByEmail(email: string) {
  const collection = await getUserCollection()
  return collection.findOne({ email })
}

// 创建用户
export async function createUser(userData: User) {
  const collection = await getUserCollection()
  return collection.insertOne(userData)
}

// 更新用户
export async function updateUser(id: number, userData: Partial<User>) {
  const collection = await getUserCollection()
  return collection.updateOne({ id }, { $set: userData })
}

// 删除用户
export async function deleteUser(id: number) {
  const collection = await getUserCollection()
  return collection.deleteOne({ id })
}
