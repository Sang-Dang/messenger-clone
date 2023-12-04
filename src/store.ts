import chatReducer from '@/features/Chat/ChatSlice'
import MessagesReducer from '@/features/Messages/MessagesSlice'
import usersReducer from '@/features/Users/UsersSlice'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

const rootReducer = combineReducers({
    chat: chatReducer,
    users: usersReducer,
    messages: MessagesReducer
})

export const store = configureStore({
    reducer: rootReducer,
    devTools: true
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
