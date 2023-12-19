import { Chat } from '@/classes/Chat'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const addNewChat = createAsyncThunk('chat/addNewChat', async (chat: Chat, thunkAPI) => {
    // code here
})
