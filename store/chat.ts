/*
 * @Date: 2025-04-17 17:44:58
 * @LastEditors: guantingting
 * @LastEditTime: 2025-04-17 17:56:38
 */
import { create } from 'zustand'

type activeChat = {
  id: string
  title: string
}
type ChatState = {
  activeChat: activeChat
  setActiveChat: (id: string, title: string) => void
}
export const useActiveChat = create<ChatState>((set) => ({
  activeChat: {
    id: '',
    title: '',
  },
  setActiveChat: (id: string, title: string) => set({ activeChat: { id, title } }),
}))
