/*
 * @Date: 2025-04-15 13:21:26
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-15 13:48:19
 */
import { experimental_createMCPClient } from 'ai'
import { withTimeout } from '@/lib/utils'
// 设置最大超时时间
const MAX_TIMEOUT = 3000 // 3秒\

// 定义MCP客户端类型
export type mcpClient = {
  tools: () => Promise<Record<string, unknown>>
  close: () => Promise<void>
}

// 创建MCP客户端函数
export async function createAmapClient(): Promise<mcpClient> {
  return await withTimeout(
    experimental_createMCPClient({
      transport: {
        type: 'sse',
        url: `https://mcp.amap.com/sse?key=${process.env.AMAP_MCP_KEY}`,
      },
    }) as Promise<mcpClient>,
    MAX_TIMEOUT,
    '连接高德地图MCP服务超时'
  )
}
