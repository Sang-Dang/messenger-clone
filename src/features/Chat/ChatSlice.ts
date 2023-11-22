import { Chat } from '@/classes/Chat'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type ChatStateType = {
    value: {
        [key: string]: Chat
    }
    ids: string[]
    status: 'idle' | 'loading' | 'failed'
    error: string | null
}

const initialState: ChatStateType = {
    value: {},
    ids: [],
    status: 'idle',
    error: null
}

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addChat: (state, action: PayloadAction<Chat>) => {
            if (!state.ids.includes(action.payload.id)) {
                state.value[action.payload.id] = action.payload
                state.ids.push(action.payload.id)
            }
        },
        addMany: (state, action: PayloadAction<Chat[]>) => {
            action.payload.forEach((chat) => {
                if (!state.ids.includes(chat.id)) {
                    state.value[chat.id] = chat
                    state.ids.push(chat.id)
                }
            })
        },
        removeChat: (state, action: PayloadAction<{ id: string }>) => {
            state.ids.filter((current) => current !== action.payload.id)
            delete state.value[action.payload.id]
        },
        updateChat: (state, action: PayloadAction<Chat>) => {
            state.value[action.payload.id] = action.payload
        },
        clearChats: (state) => {
            state.value = {}
            state.ids = []
        }
    }
})

const chatReducer = chatSlice.reducer
export const { addChat, removeChat, updateChat, addMany, clearChats } = chatSlice.actions
export const selectAllChats = (state: ChatStateType) => state.value

export default chatReducer
