/*
 * @Date: 2025-04-30 16:52:52
 * @LastEditors: guantingting
 * @LastEditTime: 2025-05-09 16:09:04
 */
import { experimental_generateImage as generateImage, ImageModel } from 'ai'
import { drawModel } from '../../ai/aiModel'
import { MessageProps } from '@/interface/message'
import { extractTravelInfo } from '@/lib/services/textService'
import imagePrompt from '@/ai/imagePrompt'
// @ts-expect-error 类型断言
export const drawImage = async (messages: Array<MessageProps>): Promise<{ type: string; content: string } | null> => {
  const travelInfo = await extractTravelInfo(messages)
  console.log('travelInfo', travelInfo)
  if (travelInfo && travelInfo !== 'null') {
    try {
      const result = await generateImage({
        model: drawModel as ImageModel,
        prompt: `Based on the itinerary information in ${travelInfo}, draw a travel plan image. If drawing requirements are included, please follow those requirements. Clearly display time and location related information, ${imagePrompt}`,
        size: '1024x1024',
      })
      if (result && result.image) {
        return {
          type: 'image',
          content: result.image.base64,
        }
      }
    } catch (error) {
      console.error('图片生成错误:', JSON.stringify(error))
      // const errorMessage = error instanceof Error ? error.message : '未知错误'
      // return errorMessage
    }
  } else {
    return {
      type: 'text',
      content: `## 需要更多行程信息 
> **当前对话中没有包含具体行程信息**，无法生成行程图。
### 请提供以下关键信息：
* 📍 **目的地**：如北京、巴黎、东京等
* 📅 **旅行日期**：如5月10日-5月15日
* 🎯 **重点需求**：如亲子游、美食探索、徒步旅行、摄影等
提供以上信息后，我将为您生成**可视化行程图**（含时间轴、地图标记、天气提示等）！🌍🧳`,
    }
  }
}
