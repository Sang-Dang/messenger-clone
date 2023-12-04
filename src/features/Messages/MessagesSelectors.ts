import { RootState } from '@/store'

export const SelectChatId = (state: RootState) => state.messages.value.chatId
export const SelectMessages = (state: RootState) => state.messages.value.messages
