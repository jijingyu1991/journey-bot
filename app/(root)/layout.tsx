/*
 * @Date: 2025-04-10 13:31:58
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-10 14:50:07
 */
import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@/app/globals.css";

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="en">
    <body>
      <AntdRegistry>{children}</AntdRegistry>
    </body>
  </html>
);

export default RootLayout;
