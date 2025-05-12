/*
 * @Date: 2025-04-27 13:34:06
 * @LastEditors: guantingting
 * @LastEditTime: 2025-05-12 17:16:44
 */
import React, { memo } from 'react'
import { MessageProps } from '@/interface/message'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Bubble } from '@ant-design/x'
import type { BubbleProps } from '@ant-design/x'
import MarkdownIt from 'markdown-it'
// import { extractSvgFromResponse, isSvgFromResponse } from '@/ai/svgHelper'
import { Brush, Palette, Loader2 } from 'lucide-react' // Image

const md = MarkdownIt({
  html: true,
  breaks: true,
  // 激活图片渲染
  linkify: true,
})

interface AssistantMessageProps extends MessageProps {
  message: MessageProps
  status: string
  messageType?: string
}

const isAmapUri = (text: string) => text.startsWith('amapuri://') || text.startsWith('https://surl.amap.com/')

const amapUriRegex = /(amapuri:\/\/[^\s\)\]\}，。；,;]*)/g
const amapWebRegex = /(https:\/\/surl\.amap\.com\/[^\s\)\]\}，。；,;]*)/g

const AssistantMessage: React.FC<AssistantMessageProps> = memo(({ message, status, messageType }) => {
  const { content, reasoning } = message

  const renderMarkdown: BubbleProps['messageRender'] = (content) => {
    if (!content) return null

    // 提取所有高德地图专属链接
    const amapUris = [...content.matchAll(amapUriRegex)].map((m) => m[0])
    const amapWebs = [...content.matchAll(amapWebRegex)].map((m) => m[0])

    // 去重
    const amapLinks = Array.from(new Set([...amapUris, ...amapWebs]))

    // 替换链接为占位符，避免 markdown 渲染时自动转为 a 标签
    let pureContent = content
    amapLinks.forEach((link, idx) => {
      pureContent = pureContent.replace(link, `[[AMAP_LINK_${idx}]]`)
    })

    // 渲染主内容
    const rendered = <div dangerouslySetInnerHTML={{ __html: md.render(pureContent) }} />

    // 渲染所有专属地图卡片
    const amapCards = amapLinks.map((link, idx) => {
      if (link.startsWith('amapuri://')) {
        return (
          <div
            key={link}
            className="my-4 p-5 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl shadow-md border border-teal-100"
          >
            <div className="text-teal-700 font-semibold text-base mb-2">专属高德地图</div>
            <div className="text-sm text-teal-500 mb-3">请在手机端高德地图App中打开：</div>
            <a
              href={link}
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg px-4 py-2 transition"
            >
              打开高德地图App
            </a>
          </div>
        )
      } else if (link.startsWith('https://surl.amap.com/')) {
        return (
          <div
            key={link}
            className="my-4 p-5 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl shadow-md border border-teal-100"
          >
            <div className="text-teal-700 font-semibold text-base mb-2">专属高德地图</div>
            <iframe
              src={link}
              className="w-full h-80 rounded-lg border border-teal-100"
              title="高德专属地图"
              allowFullScreen
            />
            <div className="mt-3">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg px-4 py-2 transition"
              >
                在新窗口中打开
              </a>
            </div>
          </div>
        )
      }
      return null
    })

    return (
      <div>
        {rendered}
        {amapCards}
      </div>
    )
  }

  return (
    <Bubble
      className="mb-4 max-w-[90%]"
      placement="start"
      loading={!content && (status === 'streaming' || status === 'submitted') && messageType != 'image'}
      content={content}
      messageRender={renderMarkdown}
      header={reasoning}
      avatar={{
        icon: (
          <Avatar>
            <AvatarImage
              src="https://file.302.ai/gpt/imgs/20250429/ecb0501b62714664a23adf8a5e2997fe.png"
              className="bg-white"
            />
          </Avatar>
        ),
      }}
    />
  )
})

AssistantMessage.displayName = 'AssistantMessage'

export default AssistantMessage
