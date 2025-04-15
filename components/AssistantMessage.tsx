/*
 * @Date: 2025-04-11 14:20:19
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-14 17:58:51
 */
import React, { memo } from 'react'
import { MessageProps } from '@/interface/message'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Bubble } from '@ant-design/x'
import type { BubbleProps } from '@ant-design/x'
import MarkdownIt from 'markdown-it'
const md = MarkdownIt({ html: true, breaks: true })

interface AssistantMessageProps extends MessageProps {
  message: MessageProps
  status: string
}

const AssistantMessage: React.FC<AssistantMessageProps> = memo(({ message, status }) => {
  const { content, reasoning } = message
  const renderMarkdown: BubbleProps['messageRender'] = (content) => (
    /* biome-ignore lint/security/noDangerouslySetInnerHtml: used in demo */
    <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
  )
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
            <AvatarImage src="https://github.com/shadcn.png" />
          </Avatar>
        ),
      }}
    />
  )
})
AssistantMessage.displayName = 'AssistantMessage'

export default AssistantMessage
