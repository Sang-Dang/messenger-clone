/**
 * Rememeber to deserialize message
 */

import { Message } from '@/classes/Message'
import { RootState } from '@/store'
import { createSelector } from '@reduxjs/toolkit'

export const SelectConversationChatId = createSelector(
    [(state: RootState) => state.conversation.value.chatId],
    (chatId) => chatId
)

export const SelectConversationMessageIds = createSelector(
    [(state: RootState) => state.conversation.value.messageIds],
    (messageIds) => messageIds
)

export const SelectConversationMessageById = (messageId: string) =>
    createSelector(
        [(state: RootState) => state.conversation.value.messages[messageId]],
        (message) => Message.deserialize(message)
    )

export const SelectChatInfobarOpenState = createSelector(
    [(state: RootState) => state.conversation.metadata.isChatInfobarOpen],
    (isChatSidebarOpen) => isChatSidebarOpen
)
