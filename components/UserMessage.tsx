/*
 * @Date: 2025-04-11 14:25:18
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-11 16:39:08
 */
import React, { memo } from "react";
import { MessageProps } from "@/interface/message";
import { Bubble } from "@ant-design/x";
import { UserRound } from "lucide-react";

interface userMessageProps extends MessageProps {
  message: MessageProps;
}
const fooAvatar: React.CSSProperties = {
  color: "#fff",
  backgroundColor: "#87d068",
};
const UserMessage: React.FC<userMessageProps> = memo(({ message }) => {
  const { content } = message;
  return (
    <Bubble
      className="mb-4 max-w-0.7"
      placement="end"
      content={content}
      avatar={{
        icon: <UserRound />,
        style: fooAvatar,
      }}
    />
  );
});

UserMessage.displayName = "UserMessage";

export default UserMessage;
