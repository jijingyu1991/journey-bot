/*
 * @Date: 2025-04-27 13:34:06
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-30 18:02:00
 */
import React, { memo } from 'react'
import { MessageProps } from '@/interface/message'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Bubble } from '@ant-design/x'
import type { BubbleProps } from '@ant-design/x'
import MarkdownIt from 'markdown-it'
import { extractSvgFromResponse, isSvgFromResponse } from '@/ai/svgHelper'
import { Brush, Palette, Loader2, Image } from 'lucide-react'

const md = MarkdownIt({
  html: true,
  breaks: true,
  // 激活图片渲染
  linkify: true,
})

interface AssistantMessageProps extends MessageProps {
  message: MessageProps
  status: string
  messageType: string
}

const AssistantMessage: React.FC<AssistantMessageProps> = memo(({ message, status, messageType }) => {
  const { content, reasoning } = message

  const renderMarkdown: BubbleProps['messageRender'] = (content) => {
    // if (!content) return null

    // // 检查是否为图片Markdown格式
    // if (content.startsWith('![') && content.includes('](data:image/')) {
    //   // 提取base64图片
    //   const base64Match = content.match(/\]\((data:image\/[^)]+)\)/)
    //   if (base64Match && base64Match[1]) {
    //     return (
    //       <div className="my-2">
    //         <div className="rounded-lg overflow-hidden shadow-md">
    //           <img src={base64Match[1]} alt="AI生成图片" className="max-w-full h-auto" />
    //         </div>
    //         <div className="mt-2 text-xs text-teal-600 flex items-center">
    //           <Image size={12} className="mr-1" /> AI生成图片
    //         </div>
    //       </div>
    //     )
    //   }
    // }

    // if (isSvgFromResponse(content)) {
    //   // 使用svgHelper提取SVG
    //   const svgContent = extractSvgFromResponse(content)

    //   if (svgContent) {
    //     // 分离XML代码和其他文本内容
    //     const textContent = content.replace(/<svg[\s\S]*?<\/svg>/, '').trim()

    //     return (
    //       <div>
    //         {textContent && <div dangerouslySetInnerHTML={{ __html: md.render(textContent) }} />}
    //         <div className="svg-container" dangerouslySetInnerHTML={{ __html: svgContent }} />
    //       </div>
    //     )
    //   } else {
    //     // 优化后的绘制中加载状态
    //     return (
    //       <div className="flex flex-col items-center p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border border-teal-100 shadow-sm">
    //         <div className="flex items-center gap-3 mb-2">
    //           <Palette className="text-teal-500 animate-pulse" size={24} />
    //           <Loader2 className="text-blue-500 animate-spin" size={20} />
    //           <Brush className="text-teal-600 animate-bounce" size={22} />
    //         </div>
    //         <div className="text-teal-700 font-medium">正在绘制图形中...</div>
    //         <div className="text-xs text-teal-500 mt-1">请稍候，我们正在为您创建精美的图形</div>
    //       </div>
    //     )
    //   }
    // }
    if (messageType == 'image' && (status === 'streaming' || status === 'submitted')) {
      return (
        <div className="flex flex-col items-center p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border border-teal-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Palette className="text-teal-500 animate-pulse" size={24} />
            <Loader2 className="text-blue-500 animate-spin" size={20} />
            <Brush className="text-teal-600 animate-bounce" size={22} />
          </div>
          <div className="text-teal-700 font-medium">正在绘制图形中...</div>
          <div className="text-xs text-teal-500 mt-1">请稍候，我们正在为您创建精美的图形</div>
        </div>
      )
    } else {
      // 普通Markdown内容
      return <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
    }
  }

  return (
    <Bubble
      className="mb-4 max-w-[90%]"
      placement="start"
      loading={!content && (status === 'streaming' || status === 'submitted')}
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
