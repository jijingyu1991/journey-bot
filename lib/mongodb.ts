/*
 * @Date: 2025-04-16
 * @LastEditors: guantingting
 * @LastEditTime: 2025-05-09 15:20:00
 */
import { MongoClient, ServerApiVersion, CommandStartedEvent, CommandSucceededEvent, CommandFailedEvent } from 'mongodb'

// 添加全局类型声明
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (!process.env.MONGODB_URI) {
  throw new Error('请在环境变量中添加 MONGODB_URI')
}

// 是否开启调试模式
const isDebugMode = process.env.MONGODB_DEBUG === 'true'

const uri = process.env.MONGODB_URI as string
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // 添加调试选项
  ...(isDebugMode ? { monitorCommands: true } : {}),
}

// 创建命令监听器以输出详细日志
function commandStartedLogger(event: CommandStartedEvent) {
  console.log(`MongoDB 命令开始: ${event.commandName}`)
  if (event.command && Object.keys(event.command).length > 0) {
    console.log(`MongoDB 命令参数: ${JSON.stringify(event.command, null, 2)}`)
  }
}

function commandSucceededLogger(event: CommandSucceededEvent) {
  console.log(`MongoDB 命令成功: ${event.commandName} (${event.duration}ms)`)
  if (event.reply && Object.keys(event.reply).length > 0) {
    console.log(`MongoDB 命令结果: ${JSON.stringify(event.reply, null, 2)}`)
  }
}

function commandFailedLogger(event: CommandFailedEvent) {
  console.error(`MongoDB 命令失败: ${event.commandName}`)
  console.error(`错误信息: ${event.failure}`)
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // 在开发环境中使用全局变量以防止连接池耗尽
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)

    // 添加调试事件监听
    if (isDebugMode) {
      client.on('commandStarted', commandStartedLogger)
      client.on('commandSucceeded', commandSucceededLogger)
      client.on('commandFailed', commandFailedLogger)
      console.log('MongoDB 调试模式已启用')
    }
    globalWithMongo._mongoClientPromise = client
      .connect()
      .then((client) => {
        console.log('MongoDB 连接成功!')
        return client
      })
      .catch((err) => {
        console.error('MongoDB 连接失败:', err)
        throw err
      })
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // 在生产环境中创建新客户端
  client = new MongoClient(uri, options)

  // 添加调试事件监听
  if (isDebugMode) {
    client.on('commandStarted', commandStartedLogger)
    client.on('commandSucceeded', commandSucceededLogger)
    client.on('commandFailed', commandFailedLogger)
    console.log('MongoDB 调试模式已启用')
  }
  clientPromise = client
    .connect()
    .then((client) => {
      console.log('MongoDB 连接成功!')
      return client
    })
    .catch((err) => {
      console.error('MongoDB 连接失败:', err)
      throw err
    })
}

// 导出clientPromise以在其他地方使用
export default clientPromise
