import { Chat } from '@/classes/Chat'
import { RootState } from '@/store'
import { createSelector } from '@reduxjs/toolkit'

export const selectAllChats = (state: RootState) => state.chat.value
export const selectAllChatsToField = (field: keyof Chat) =>
    createSelector([(state: RootState) => state.chat.value.list], (chat) =>
        Object.values(chat).map((chat) => chat[field])
    )
export const selectChatById = (id: string) =>
    createSelector([(state: RootState) => state.chat.value.list[id]], (chat) => chat)
export const selectChatByIdToField = (id: string, field: keyof Chat) =>
    createSelector([(state: RootState) => state.chat.value.list[id][field]], (chat) => chat)
export const selectChatsSearch = (search: string) =>
    createSelector(
        [(state: RootState) => state.chat.value.list],
        (chats: { [key: string]: Chat }) =>
            Object.values(chats).filter((chat) => chat.chatName.toLowerCase().includes(search))
    )
