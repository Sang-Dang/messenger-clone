import { Message } from '@/classes/Message'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type ConversationStateType = {
    value: {
        messages: {
            [key: string]: Message
        }
        messageIds: string[] // sorted
        chatId: string | null
    }
    status: 'loading' | 'idle' | 'error'
    error: string | null
}

const initialState: ConversationStateType = {
    value: {
        messages: {},
        messageIds: [],
        chatId: null
    },
    status: 'idle',
    error: null
}

export const ConversationSlice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {
        chatSelected: (state, action: PayloadAction<{ chatId: string }>) => {
            state.value.chatId = action.payload.chatId
        },
        messageAdded: (state, action: PayloadAction<{ message: Message }>) => {
            const { message } = action.payload
            if (!state.value.messages[message.id]) {
                state.value.messages[message.id] = message
                state.value.messageIds.push(message.id)
            }
        },
        messageUpdated: (state, action: PayloadAction<{ message: Message }>) => {
            const { message } = action.payload
            if (state.value.messages[message.id]) {
                state.value.messages[message.id] = message
            }
        }
    }
})

export const { chatSelected, messageAdded, messageUpdated } = ConversationSlice.actions
const conversationReducer = ConversationSlice.reducer
export default conversationReducer
