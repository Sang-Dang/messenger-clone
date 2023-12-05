import { Message } from '@/classes/Message'
import { RootState } from '@/store'
import { createSelector } from '@reduxjs/toolkit'

export const SelectChatId = (state: RootState) => state.messages.metadata.chatId
export const SelectMessages = (state: RootState) => state.messages.value.messages
export const SelectLastMessage = (state: RootState) => state.messages.metadata.oldestMessageId
export const SelectStatus = (state: RootState) => state.messages.status

type selectSortedMessagesReturn = (state: RootState) => Message[]
export const SelectSortedMessages = (): selectSortedMessagesReturn =>
    createSelector([(state: RootState) => state.messages.value.messages], (messages: Message[]) => {
        return messages.slice().sort((a, b) => a.createdOn.localeCompare(b.createdOn))
    })
