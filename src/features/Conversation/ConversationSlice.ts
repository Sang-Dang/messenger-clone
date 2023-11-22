import { Message } from '@/classes/Message'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type ConversationStateType = {
    value: {
        messages: {
            [id: string]: Message
        }
        messageIds: string[]
        chatId: string
    }
    status: 'idle' | 'loading' | 'failed'
    error: string | null
}

const initialState: ConversationStateType = {
    value: {
        messages: {},
        messageIds: [],
        chatId: ''
    },
    status: 'idle',
    error: null
}

export const conversationSlice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<Message>) => {
            state.value.messages[action.payload.id] = action.payload
            state.value.messageIds.push(action.payload.id)
        },
        setChatId: (state, action: PayloadAction<{ chatId: string }>) => {
            state.value = {
                ...state.value,
                chatId: action.payload.chatId
            }
        },
        resetState: (state) => {
            state.value = {
                ...state.value,
                messages: {},
                messageIds: []
            }
        }
    }
})

const conversationReducer = conversationSlice.reducer
export const { resetState, setChatId, addMessage } = conversationSlice.actions

export default conversationReducer
