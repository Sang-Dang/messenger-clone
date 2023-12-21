/**
 * Remember to deserialize chat
 */

import { Chat, ChatSerializable } from '@/classes/Chat'
import { RootState } from '@/store'
import { createSelector } from '@reduxjs/toolkit'

export const selectChatById = (id: string) =>
    createSelector([(state: RootState) => state.chat.value.list[id]], (chat) =>
        Chat.deserialize(chat)
    )
export const selectChatsSearch = (search: string) =>
    createSelector(
        [(state: RootState) => state.chat.value.list],
        (chats: { [key: string]: ChatSerializable }) =>
            Object.values(chats)
                .filter((chat) => chat.chatName.toLowerCase().includes(search))
                .map((chat) => Chat.deserialize(chat))
    )

export const selectChatByIdToField = (
    id: string,
    field: keyof Omit<ChatSerializable, 'createdOn' | 'deletedOn'>
) =>
    createSelector(
        [
            (state: RootState) => {
                if (!state.chat.value.list[id]) return null
                return state.chat.value.list[id][field]
            }
        ],
        (value) => value
    )
