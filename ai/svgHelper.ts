/*
 * @Date: 2025-04-28
 * @LastEditors: guantingting
 * @LastEditTime: 2025-05-09 15:36:49
 */

import { svgPrompt } from './svgPrompt'

/**
 * 从AI响应中提取SVG代码
 * @param response AI响应文本
 * @returns 提取的SVG代码或null
 */
export const isSvgFromResponse = (response: string): boolean => {
  // 查找以<svg开头并以</svg>结尾的内容
  return response.match(/<svg[\s\S]/) !== null
}
/**
 * 从AI响应中提取SVG代码
 * @param response AI响应文本
 * @returns 提取的SVG代码或null
 */
export const extractSvgFromResponse = (response: string): string | null => {
  // 查找以<svg开头并以</svg>结尾的内容
  const svgMatch = response.match(/<svg[\s\S]*?<\/svg>/)
  if (svgMatch) {
    return svgMatch[0]
  }
  return null
}

/**
 * 准备发送SVG生成请求的提示词
 * @param 要绘制的内容描述
 * @returns 组合后的提示词
 */
export const prepareSvgPrompt = (content: string): string => {
  return `${svgPrompt}\n\n请根据以下内容生成手绘风格的SVG图：\n${content}`
}

/**
 * 格式化AI响应，将SVG包装在消息中
 * @param response 包含SVG的AI响应
 * @returns 格式化后的消息文本
 */
export const formatSvgResponse = (response: string): string => {
  const svg = extractSvgFromResponse(response)

  if (!svg) {
    return response
  }

  // 保留原始响应文本，但将SVG部分单独放置
  // 去除原始响应中的SVG
  const textWithoutSvg = response.replace(/<svg[\s\S]*?<\/svg>/, '').trim()

  return `${textWithoutSvg}\n\n${svg}`
}

/**
 * 判断用户输入是否为绘图请求
 * @param input 用户输入
 * @returns 是否为绘图请求
 */
export const isSvgDrawingRequest = (input: string): boolean => {
  const drawingKeywords = [
    '画一个',
    '绘制',
    '生成图形',
    '绘图',
    '画出',
    '创建svg',
    '生成svg',
    '图解',
    '示意图',
    '流程图',
    '画图',
  ]

  return drawingKeywords.some((keyword) => input.includes(keyword))
}
