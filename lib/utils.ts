/*
 * @Date: 2025-04-11 15:07:04
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-15 13:21:57
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
