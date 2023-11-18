import { ReactNode, createContext } from 'react'

export const ChatContext = createContext({})

type ChatContextProviderTypes = {
    children: ReactNode
}
export default function ChatContextProvider({ children }: ChatContextProviderTypes) {
    return <ChatContext.Provider value={{}}>{children}</ChatContext.Provider>
}
