import { Message, MessageSerializable } from '@/classes/Message'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type ConversationStateType = {
    value: {
        messages: {
            [key: string]: MessageSerializable
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
            if (action.payload.chatId !== state.value.chatId)
                state.value = {
                    messages: {},
                    messageIds: [],
                    chatId: action.payload.chatId
                }
        },
        messageAdded: {
            prepare(message: Message) {
                return {
                    payload: {
                        ...Message.serialize(message)
                    }
                } as PayloadAction<MessageSerializable>
            },
            reducer: (state, action: PayloadAction<MessageSerializable>) => {
                const message = action.payload
                if (!state.value.messages[message.id]) {
                    state.value.messages[message.id] = message
                    state.value.messageIds.push(message.id)
                }
            }
        },
        messageUpdated: {
            prepare(message: Message) {
                return {
                    payload: {
                        ...Message.serialize(message)
                    }
                } as PayloadAction<MessageSerializable>
            },
            reducer: (state, action: PayloadAction<MessageSerializable>) => {
                const message = action.payload
                if (state.value.messages[message.id]) {
                    state.value.messages[message.id] = message
                }
            }
        }
    }
})

export const { chatSelected, messageAdded, messageUpdated } = ConversationSlice.actions
const conversationReducer = ConversationSlice.reducer
export default conversationReducer
