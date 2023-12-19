import { Chat } from '@/classes/Chat'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type ChatStateType = {
    value: {
        list: { [key: string]: Chat }
        ids: string[]
    }
    status: 'idle' | 'loading' | 'failed'
    error: string | null
}

const initialState: ChatStateType = {
    value: {
        list: {},
        ids: []
    },
    status: 'idle',
    error: null
}

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        chatAdded: (state, action: PayloadAction<Chat>) => {
            const chat = action.payload
            if (!state.value.list[chat.id]) {
                state.value.ids.push(chat.id)
                state.value.list[chat.id] = chat
            }
        },
        chatUpdated: (state, action: PayloadAction<Chat>) => {
            const chat = action.payload
            if (state.value.list[chat.id]) state.value.list[chat.id] = chat
        },
        chatRemoved: (state, action: PayloadAction<{ id: string }>) => {
            const chat = action.payload
            if (state.value.list[chat.id]) {
                state.value.ids = state.value.ids.filter((current) => current !== chat.id)
                delete state.value.list[chat.id]
            }
        },
        loadingToggled: (state, action: PayloadAction<boolean>) => {
            state.status = action.payload ? 'loading' : 'idle'
        },
        errorOccurred: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
        loadedSuccessfully: (state) => {
            state.status = 'idle'
            state.error = null
        }
    }
})

const chatReducer = chatSlice.reducer
export const {
    chatAdded,
    chatUpdated,
    chatRemoved,
    loadingToggled,
    errorOccurred,
    loadedSuccessfully
} = chatSlice.actions
export const selectAllChats = (state: ChatStateType) => state.value

export default chatReducer
