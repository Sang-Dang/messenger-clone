import { Chat, ChatSerializable } from '@/classes/Chat'
import { chatLoadedWithImages } from '@/features/Chat/ChatThunks'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type ChatStateType = {
    value: {
        list: { [key: string]: ChatSerializable }
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
        chatAdded: {
            prepare: (chat: Chat) => {
                return {
                    payload: {
                        ...Chat.serialize(chat)
                    }
                }
            },
            reducer: (state, action: PayloadAction<ChatSerializable>) => {
                const chat = action.payload
                if (!state.value.list[chat.id]) {
                    state.value.ids.push(chat.id)
                    state.value.list[chat.id] = chat
                }
            }
        },
        chatUpdated: {
            prepare(chat: Chat) {
                return {
                    payload: {
                        ...Chat.serialize(chat)
                    }
                }
            },
            reducer: (state, action: PayloadAction<ChatSerializable>) => {
                const chat = action.payload
                if (state.value.list[chat.id])
                    state.value.list[chat.id] = {
                        ...chat,
                        avatar: state.value.list[chat.id].avatar,
                        chatName: state.value.list[chat.id].chatName
                    }
            }
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

export default chatReducer
