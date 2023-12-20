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
        (message) => message
    )

export const SelectConversationMessageByIdToField = (messageId: string, field: keyof Message) => {
    return createSelector(
        [(state: RootState) => state.conversation.value.messages[messageId]],
        (message) => {
            if (message) {
                return message[field]
            } else {
                return null
            }
        }
    )
}
