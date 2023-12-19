import { Message, MessageConverter } from '@/classes/Message'
import { db } from '@/firebase'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'

type initialStateType = {
    value: {
        messages: Message[]
        messageIds: {
            [id: string]: number // id to index
        }
    }
    metadata: {
        chatId: string | null
        oldestMessageId: string
    }
    status: 'idle' | 'loading' | 'failed'
    error: string | null
}
const initialState: initialStateType = {
    value: {
        messages: [], // sorted array. add to end to add to bottom of chat,
        messageIds: {} // map of message id to index in messages array
    },
    metadata: {
        oldestMessageId: '',
        chatId: null
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
            state.metadata.chatId = action.payload
        },
        setOldestMessage: (state, action: PayloadAction<string>) => {
            state.metadata.oldestMessageId = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadMessagesStart.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(loadMessagesStart.fulfilled, (state) => {
                state.status = 'idle'
            })
            .addCase(loadMessagesStart.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? null
            })
            .addCase(getDocumentByOrder.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getDocumentByOrder.fulfilled, (state) => {
                state.status = 'idle'
            })
            .addCase(getDocumentByOrder.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? null
            })
    }
})

/**
 * Load messages
 *
 * Used for loading messages on CHAT START only. After chat start,
 */
export const loadMessagesStart = createAsyncThunk(
    'messages/loadMessagesStart',
    async ({ chatId, limitNo }: { chatId: string; limitNo: number }, thunkAPI) => {
        const q = query(
            collection(db, 'chats', chatId, 'messages').withConverter(MessageConverter),
            orderBy('createdOn', 'asc'),
            limit(limitNo)
        )
        const querySnapshot = await getDocs(q)
        const messages = querySnapshot.docs.map((doc) => doc.data() as Message)
        thunkAPI.dispatch(MessagesSlice.actions.conversationLoaded(messages))
    }
)

export const getDocumentByOrder = createAsyncThunk(
    'messages/getDocumentByOrder',
    async ({ chatId, index }: { chatId: string; index: number }, thunkAPI) => {
        const q = query(
            collection(db, 'chats', chatId, 'messages').withConverter(MessageConverter),
            orderBy('createdOn', 'desc'),
            limit(index)
        )
        const querySnapshot = await getDocs(q)
        const messages = querySnapshot.docs.map((doc) => doc.data() as Message)
        thunkAPI.dispatch(MessagesSlice.actions.setOldestMessage(messages[index].id))
    }
)

export const {
    messageAddedNew,
    messageUpdated,
    conversationLoaded,
    messagesAddedOld,
    selectChatId,
    setOldestMessage
} = MessagesSlice.actions
const MessagesReducer = MessagesSlice.reducer
export default MessagesReducer
