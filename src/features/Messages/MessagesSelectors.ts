import { RootState } from '@/store'

export const SelectChatId = (state: RootState) => state.messages.metadata.chatId
export const SelectMessages = (state: RootState) => state.messages.value.messages
