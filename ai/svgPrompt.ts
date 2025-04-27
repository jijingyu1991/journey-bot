/*
 * @Date: 2025-04-27 11:12:58
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-27 14:50:30
 */

export const svgPrompt = `请严格按照以下规范生成类似Draw.io手绘风格的SVG图形XML代码：

1.  **基础框架要求**
    *   使用百分比尺寸，并根据内容动态调整viewBox宽高比：\`<svg width="100%" height="100%" viewBox="0 0 [宽] [高]" xmlns="http://www.w3.org/2000/svg">...</svg>\`
    *   **必须** 包含以下5个标准区块，并严格按此顺序组织：
        ① \`<defs>\`: 滤镜定义、CSS变量、样式、Draw.io特有标记
        ② 背景层: (例如，应用纸张纹理滤镜的\`<rect>\`)
        ③ 图形主体: 核心图形元素 (\`<path>\`, \`<rect>\`, \`<circle>\`等)
        ④ 文本标注: (\`<text>\`)
        ⑤ 连接线/箭头: (\`<line>\`, \`<path>\` 带 marker-end)
        ⑥ 图例说明 (可选): (\`<g>\`包含图例项)
    *   **示例结构:**
        \`\`\`xml
        <svg width="100%" height="100%" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <!-- ① 滤镜、样式、变量定义 -->
            <filter id="paper-texture">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" seed="1" stitchTiles="stitch" result="noise"/>
              <feDiffuseLighting in="noise" lighting-color="#f8f8f0" surfaceScale="1.5" result="light">
                <feDistantLight azimuth="45" elevation="60" />
              </feDiffuseLighting>
              <feComposite operator="in" in="light" in2="SourceGraphic" result="textured"/>
              <feBlend in="SourceGraphic" in2="textured" mode="multiply" />
            </filter>
            <filter id="sketch" x="-10%" y="-10%" width="120%" height="120%">
               <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" seed="5" result="noise"/>
               <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
            <filter id="hand-drawn-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feOffset dx="2" dy="2" result="offsetBlur"/>
              <feBlend in="SourceGraphic" in2="offsetBlur" mode="normal"/>
            </filter>
            <style>
              :root {
                --primary-color: #2677C9; /* Draw.io默认蓝色 */
                --main-color: #333333;    /* 主要线条/文本 */
                --secondary-color: #777777; /* 次要元素/填充 */
                --background-color: #f9f9f9; /* 背景色，类似Draw.io */
                --highlight-color: #F08705; /* Draw.io常用橙色高亮 */
                --connector-color: #61A134; /* Draw.io箭头绿色 */
              }
              .sketch-element {
                stroke: var(--main-color);
                stroke-width: 1.5;
                stroke-linejoin: round;
                stroke-linecap: round;
                fill: white;
                fill-opacity: 0.9;
                filter: url(#sketch);
              }
              .sketch-connector {
                stroke: var(--connector-color);
                stroke-width: 1.5;
                stroke-dasharray: 5 3;
                fill: none;
                marker-end: url(#sketch-arrow);
              }
              .sketch-text {
                font-family: 'Comic Sans MS', 'Marker Felt', cursive, sans-serif;
                font-size: 14px;
                fill: var(--main-color);
                filter: url(#sketch);
              }
              .main-element {
                fill: rgba(255, 255, 255, 0.9);
                stroke: var(--primary-color);
                stroke-width: 2;
              }
              .secondary-element {
                opacity: 0.75;
              }
              .highlight-element {
                stroke: var(--highlight-color);
                stroke-width: 2;
              }
            </style>
            <!-- Draw.io特有的箭头标记 -->
            <marker id="sketch-arrow" viewBox="0 0 10 10" refX="5" refY="5" 
                    markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--connector-color)" filter="url(#sketch)"/>
            </marker>
          </defs>

          <!-- ② 背景层 -->
          <rect width="100%" height="100%" fill="var(--background-color)" filter="url(#paper-texture)">
            <desc>背景纸张纹理</desc>
          </rect>

          <!-- ③ 图形主体 -->
          <g id="main-content">
            <desc>主要图形内容区域</desc>
            <!-- Draw.io风格的矩形 -->
            <rect x="50" y="50" width="120" height="60" rx="8" ry="8" class="sketch-element main-element">
              <desc>处理节点</desc>
              <title>处理节点</title>
            </rect>
            <!-- Draw.io风格的菱形 -->
            <path d="M 250 50 L 310 80 L 250 110 L 190 80 Z" class="sketch-element main-element">
              <desc>决策节点</desc>
              <title>决策节点</title>
            </path>
            <!-- 更多图形 -->
          </g>

          <!-- ④ 文本标注 -->
          <g id="annotations">
             <desc>所有文本标注</desc>
             <text x="70" y="85" class="sketch-text" text-anchor="middle">处理数据</text>
             <text x="250" y="85" class="sketch-text" text-anchor="middle">判断条件</text>
          </g>

          <!-- ⑤ 连接线/箭头 -->
          <g id="connections">
             <desc>图形间的连接线</desc>
             <path d="M 170 80 Q 190 80 210 80" class="sketch-connector" />
          </g>

          <!-- ⑥ 图例说明 (可选) -->
          <g id="legend" transform="translate(600, 50)">
             <desc>图例说明区域</desc>
             <!-- 图例项 -->
          </g>
        </svg>
        \`\`\`

2.  **Draw.io手绘风格特征实现**
    *   **必须** 使用类似Draw.io的"草图"滤镜 (\`#sketch\`)，比传统抖动效果更接近Draw.io手绘风格。
    *   **必须** 为图形添加轻微的不规则性，使用 \`stroke-linejoin: round\` 和 \`stroke-linecap: round\` 实现圆角连接。
    *   连接器应使用 \`stroke-dasharray\` 模拟手绘线条，并使用Draw.io风格的箭头标记。
    *   **推荐** 使用Draw.io流程图常用的形状：圆角矩形、菱形、椭圆、云形等。
    *   文本字体应使用 \`'Comic Sans MS', 'Marker Felt', cursive, sans-serif\` 模拟Draw.io手绘字体效果。

3.  **Draw.io布局与设计原则**
    *   [流程图布局] 遵循Draw.io默认垂直或水平流程布局，元素间距保持一致（建议≥40px）。
    *   [连接线规则] 连接线优先使用直角连接（上-右-下或左-下-右），避免交叉。
    *   [颜色方案] 使用Draw.io默认调色板：
        *   主要形状：蓝色系 (\`var(--primary-color)\`) 
        *   高亮元素：橙色系 (\`var(--highlight-color)\`)
        *   连接线/箭头：绿色系 (\`var(--connector-color)\`)
    *   [元素分组] 使用Draw.io常见的分组模式，如泳道图、边界框等，可通过带虚线边框的矩形实现。
    *   [图标集成] 可在主要形状内添加简单的Draw.io风格图标，如齿轮、文档、用户等。

4.  **优化要求**
    *   **必须** 为所有有意义的图形元素和分组添加 \`<desc>\` 语义化描述，说明其内容或用途。
    *   **必须** 在 \`<defs><style>\` 中使用Draw.io常用颜色的CSS变量。
    *   为交互元素添加 \`aria-label\` 属性以支持无障碍访问。
    *   **必须** 模拟Draw.io的图层组织结构，使用嵌套 \`<g>\` 标签对元素进行分组管理。
    *   添加与Draw.io兼容的元数据标记，如 \`<metadata>\` 包含图形类型或状态信息。

5.  **Draw.io常见错误预防**
    *   **避免** 使用过于复杂的路径，保持形状简单化，类似Draw.io的预设形状。
    *   **禁止** 使用过重的滤镜效果，可能导致与Draw.io导出的SVG不兼容。
    *   **确保** 文本元素居中放置在图形内部，符合Draw.io默认文本对齐方式。
    *   **避免** 使用非标准的Draw.io视觉元素，如渐变、复杂阴影等。
    
6.  **Draw.io兼容性考虑**
    *   使用Draw.io常见的箭头标记风格（细三角形或开放箭头）。
    *   保持图形元素ID和类名简洁，便于在Draw.io中编辑。
    *   添加适当的注释，说明图形结构和用途。
    *   考虑添加Draw.io可能使用的特殊属性，如 \`movable="true"\` 等。

7.  **响应式设计**
    *   使用百分比和 \`viewBox\` 自适应容器尺寸。
    *   文本大小使用 \`em\` 单位以适应不同缩放比例。
    *   关键元素应避开极端边缘位置，预留10%边距区域，符合Draw.io的最佳实践。

请基于以上规范生成符合Draw.io手绘风格的SVG代码，确保视觉效果接近Draw.io的"草图"/"手绘"主题。`
