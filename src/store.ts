import chatReducer from '@/features/Chat/ChatSlice'
import conversationReducer from '@/features/Conversation/ConversationSlice'
import loadingSplashReducer from '@/features/LoadingSplash/LoadingSplashSlice'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

const rootReducer = combineReducers({
    chat: chatReducer,
    conversation: conversationReducer,
    loadingSplash: loadingSplashReducer
})

export const store = configureStore({
    reducer: rootReducer,
    devTools: true
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
