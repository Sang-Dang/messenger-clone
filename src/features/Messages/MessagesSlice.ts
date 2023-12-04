import { Message } from '@/classes/Message'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type initialStateType = {
    value: {
        messages: Message[]
        messageIds: {
            [id: string]: number
        }
        chatId: string | null
    }
    status: 'idle' | 'loading' | 'failed'
    error: string | null
}
const initialState: initialStateType = {
    value: {
        chatId: null,
        messages: [], // sorted array. add to end to add to bottom of chat,
        messageIds: {} // map of message id to index in messages array
    },
    status: 'idle',
    error: null
}
const MessagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        messagesAddedOld: (state, action: PayloadAction<Message>) => {
            state.value.messages.unshift(action.payload)
            state.value.messageIds[action.payload.id] = 0
        },
        messageAddedNew: (state, action: PayloadAction<Message>) => {
            state.value.messages.push(action.payload)
            state.value.messageIds[action.payload.id] = state.value.messages.length - 1
        },
        messageUpdated: (state, action: PayloadAction<Message>) => {
            const index = state.value.messageIds[action.payload.id]
            state.value.messages[index] = action.payload
        },
        conversationLoaded: (state, action: PayloadAction<Message[]>) => {
            state.value.messages = action.payload
            state.value.messageIds = {}
            action.payload.forEach((message, index) => {
                state.value.messageIds[message.id] = index
            })
        },
        selectChatId: (state, action: PayloadAction<string>) => {
            state.value.chatId = action.payload
        }
    }
})

export const { messageAddedNew, messageUpdated, conversationLoaded, messagesAddedOld, selectChatId } = MessagesSlice.actions
const MessagesReducer = MessagesSlice.reducer
export default MessagesReducer
