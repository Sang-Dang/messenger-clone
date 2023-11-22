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
        setChatId: (state, action: PayloadAction<{ chatId: string }>) => {
            state.value.chatId = action.payload.chatId
        },
        resetState: () => {
            return initialState
        }
    }
})

const conversationReducer = conversationSlice.reducer
export const { resetState, setChatId } = conversationSlice.actions

export default conversationReducer
