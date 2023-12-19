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
    reducers: {}
})

const chatReducer = chatSlice.reducer
export const {} = chatSlice.actions
export const selectAllChats = (state: ChatStateType) => state.value

export default chatReducer
