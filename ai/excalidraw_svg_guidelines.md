# Excalidraw 风格 SVG 图表设计指南

当用户引用此规则时，请按照以下规则生成 svg 代码：

这个规则定义了如何创建符合 Excalidraw 草图风格的 SVG 图表，包括文字风格、箭头风格、边框风格等元素的设计规范。

## 整体设计原则

- **手绘质感**：所有元素应有轻微不规则感，模拟手绘效果
- **简洁清晰**：保持内容简洁明了，避免过度装饰
- **适当扭曲**：使用滤镜给边缘和线条添加不规则扭曲
- **舒适间距**：元素之间保持适当间距，避免拥挤
- **柔和色彩**：使用柔和的色彩方案，避免过于鲜艳的颜色

## SVG 基础结构

```xml
<svg width="100%" height="100%" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
  <!-- 滤镜定义 -->
  <defs>
    <!-- 边框滤镜 -->
    <filter id="sketch-border" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="42" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G"/>
    </filter>

    <!-- 文字滤镜 -->
    <filter id="sketch-text" x="-2%" y="-2%" width="104%" height="104%">
      <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" seed="15" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.8" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>

  <!-- 背景 -->
  <rect width="100%" height="100%" fill="#ffffff"/>

  <!-- 内容区域 -->
  <!-- 在这里添加图表内容 -->
</svg>
```

## 文字风格

- **字体系列**：
  - 主要字体：`Comic Sans MS, Virgil, cursive`
  - 所有文字应使用手写风格字体
- **文字滤镜**：

  - 应用 `filter="url(#sketch-text)"` 给所有文字
  - 滤镜参数：轻微扭曲（baseFrequency="0.05"，scale="0.8"）

- **字体大小**：

  - 标题：20-24px
  - 子标题：16-18px
  - 正文内容：12-14px
  - 详细信息：10px

- **文字示例**：

```xml
<text x="90" y="30" font-family="Comic Sans MS, Virgil, cursive" font-size="16" text-anchor="middle" fill="#000000" filter="url(#sketch-text)">标题文字</text>
```

## 容器与边框风格

- **边框形状**：

  - 主要容器圆角：rx="20" ry="20"
  - 次要容器圆角：rx="10" ry="10"

- **边框滤镜**：

  - 应用 `filter="url(#sketch-border)"` 给所有边框
  - 滤镜参数：中等扭曲（baseFrequency="0.03"，scale="2"）

- **边框粗细**：

  - 主要边框：stroke-width="2"
  - 分隔线：stroke-width="1"

- **容器示例**：

```xml
<rect width="180" height="130" rx="20" ry="20" fill="#f7e8e8" stroke="#000000" stroke-width="2" filter="url(#sketch-border)"/>
```

## 箭头风格

- **箭头线条**：

  - 使用 Bezier 曲线实现自然流动感
  - stroke-linecap="round" 实现圆润线条
  - stroke-width="2" 保持适当粗细

- **箭头头部**：

  - 使用短路径绘制，不使用标准箭头标记
  - 两条短线形成箭头尖端，模拟手绘效果

- **箭头示例**：

```xml
<g stroke-linecap="round">
  <!-- 主干线 -->
  <path d="M231 185 C252 185, 329 185, 350 185" stroke="#000000" stroke-width="2" fill="none"></path>
  <!-- 箭头上半部分 -->
  <path d="M335 180 C340 183, 345 185, 350 185" stroke="#000000" stroke-width="2" fill="none"></path>
  <!-- 箭头下半部分 -->
  <path d="M335 190 C340 187, 345 185, 350 185" stroke="#000000" stroke-width="2" fill="none"></path>
</g>
```

## 色彩方案

- **背景色**：

  - 主背景：白色 (#ffffff)
  - 第一类容器：淡红色 (#f7e8e8)
  - 第二类容器：淡绿色 (#e0f5e0)
  - 内部元素：白色 (#ffffff)

- **文字颜色**：

  - 主要文字：黑色 (#000000)
  - 强调文字：可使用深蓝色 (#1a73e8) 或深红色 (#e83a1a)

- **边框颜色**：
  - 统一使用黑色 (#000000)

## 布局技巧

- **分组管理**：

  - 使用 `<g>` 元素组织相关内容
  - 通过 transform 属性定位整组元素

- **对齐方式**：

  - 文字水平居中：text-anchor="middle"
  - 左对齐文字：不指定 text-anchor 或使用 text-anchor="start"

- **间距指南**：
  - 主要容器间距：50-100px
  - 容器内元素间距：15-20px
  - 文字行距：15-20px

## 完整示例

下面是一个简单流程图的完整示例：

```xml
<!-- 箭头连接 -->
<g stroke-linecap="round">
  <path d="M231 185 C252 185, 329 185, 350 185" stroke="#000000" stroke-width="2" fill="none"></path>
  <path d="M335 180 C340 183, 345 185, 350 185" stroke="#000000" stroke-width="2" fill="none"></path>
  <path d="M335 190 C340 187, 345 185, 350 185" stroke="#000000" stroke-width="2" fill="none"></path>
  <text x="285" y="175" font-family="Comic Sans MS, Virgil, cursive" font-size="12" fill="#000000" filter="url(#sketch-text)">连接标签</text>
</g>

<!-- 容器示例 -->
<g transform="translate(50, 120)">
  <rect width="180" height="130" rx="20" ry="20" fill="#f7e8e8" stroke="#000000" stroke-width="2" filter="url(#sketch-border)"/>
  <text x="90" y="30" font-family="Comic Sans MS, Virgil, cursive" font-size="16" text-anchor="middle" fill="#000000" filter="url(#sketch-text)">容器标题</text>
  <line x1="10" y1="40" x2="170" y2="40" stroke="#000000" stroke-width="1" filter="url(#sketch-border)"/>
  <text x="20" y="60" font-family="Comic Sans MS, Virgil, cursive" font-size="12" fill="#000000" filter="url(#sketch-text)">- 内容项1</text>
  <text x="20" y="80" font-family="Comic Sans MS, Virgil, cursive" font-size="12" fill="#000000" filter="url(#sketch-text)">- 内容项2</text>
</g>
```

## 适用场景

这种 Excalidraw 风格的 SVG 图表特别适合：

- 流程图与架构图
- 概念解释图
- 思维导图
- 教学示意图
- 简易界面原型
- 项目路线图

## 实现提示

1. **避免复杂变换**：尽量使用简单的变换和坐标定位
2. **保持滤镜一致性**：对类似元素使用相同的滤镜参数
3. **注意文本可读性**：滤镜扭曲不应影响文字可读性
4. **分组管理组件**：使用 `<g>` 标签组织相关元素
5. **优先使用路径**：复杂形状优先使用路径绘制，而非组合多个基本形状

通过遵循这些规范，可以创建出既美观又具备手绘感的 Excalidraw 风格 SVG 图表。
