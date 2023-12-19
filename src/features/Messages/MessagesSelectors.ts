import { RootState } from '@/store'
import { createSelector } from '@reduxjs/toolkit'

export const SelectChatId = (state: RootState) => state.messages.metadata.chatId
export const SelectMessages = (state: RootState) => state.messages.value.messages
export const SelectLastMessage = (state: RootState) => state.messages.metadata.oldestMessageId
export const SelectStatus = (state: RootState) => state.messages.status
export const SelectMessageById = (id: string) =>
    createSelector([(state: RootState) => state.messages.value.messages], (messages) => {
        return messages.find((message) => message.id === id)
    })
