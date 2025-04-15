/*
 * @Date: 2025-04-10 14:59:01
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-11 14:57:16
 */
"use client";
import React from "react";
import { Welcome } from "@ant-design/x";

const Welcom = () => {
  return (
    <>
      <Welcome
        className="w-full z-10"
        style={{
          backgroundImage: "linear-gradient(97deg, #f2f9fe 0%, #f7f3ff 100%)",
          padding: "16px",
        }}
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="Hi! I'm JourneyBot — your AI travel planner."
        description="Get custom trip plans, anywhere in the world. Just tell me what you love, and I’ll handle the rest."
      />
    </>
  );
};

export default Welcom;
