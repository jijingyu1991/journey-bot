/*
 * @Date: 2025-04-11 15:07:04
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-30 17:50:29
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// 创建带有超时的Promise
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage = '操作超时'): Promise<T> {
  let timeoutId: NodeJS.Timeout
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(errorMessage))
    }, timeoutMs)
  })

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId)
  })
}

/**
 * 判断用户输入是否为绘图请求
 * @param input 用户输入
 * @returns 是否为绘图请求
 */
export const isDrawingRequest = (input: string): boolean => {
  const drawingKeywords = [
    '画一个',
    '绘制',
    '生成图形',
    '绘图',
    '画出',
    '创建图片',
    '生成图片',
    '图解',
    '示意图',
    '流程图',
    '画图',
    '手绘图',
  ]

  return drawingKeywords.some((keyword) => input.includes(keyword))
}
