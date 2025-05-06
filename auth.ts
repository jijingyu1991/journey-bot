/*
 * @Date: 2025-04-16 11:27:31
 * @LastEditors: guantingting
 * @LastEditTime: 2025-05-06 11:46:44
 */
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'
import { Profile, DefaultSession } from 'next-auth'

// GitHub profile类型扩展
interface GitHubProfile extends Profile {
  login?: string
  bio?: string
}

// 扩展Session.User类型
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username?: string
      bio?: string
    } & DefaultSession['user']
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  callbacks: {
    /**
     * @description: 登录回调函数，用于检查并保存用户数据
     */
    async signIn({ user, profile, account }) {
      console.log('signIn', user, profile, account)
      try {
        // 确保用户信息完整
        if (!user?.email) return false

        const client = await clientPromise
        const db = client.db()

        // 获取GitHub用户信息
        const githubId = profile?.id || account?.providerAccountId
        const githubProfile = profile as GitHubProfile
        const githubLogin = githubProfile?.login
        const githubBio = githubProfile?.bio

        // 根据用户ID或email查找用户
        const existingUser = await db.collection('users').findOne({
          $or: [{ email: user.email }, { githubId: githubId }],
        })

        console.log('existingUser', existingUser)
        if (!existingUser) {
          // 用户不存在，保存新用户信息
          await db.collection('users').insertOne({
            email: user.email,
            name: user.name,
            image: user.image,
            githubId: githubId,
            username: githubLogin || user.name,
            bio: githubBio || '',
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          console.log(`新用户 ${user.name} 已添加到数据库`)
        } else {
          // 用户存在，更新用户信息
          await db.collection('users').updateOne(
            { _id: existingUser._id },
            {
              $set: {
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
                username: githubLogin || existingUser.username,
                bio: githubBio || existingUser.bio,
                updatedAt: new Date(),
              },
            }
          )
          console.log(`用户 ${user.name} 信息已更新`)
        }

        return true
      } catch (error) {
        console.error('处理用户数据时发生错误:', error)
        // 即使发生错误也允许用户登录，不影响体验
        return true
      }
    },
    /**
     * @description: 会话回调函数，用于自定义会话数据
     */
    async session({ session, user }) {
      if (session.user) {
        // 将数据库中的用户ID添加到session中
        session.user.id = user.id
      }
      return session
    },
  },
})
