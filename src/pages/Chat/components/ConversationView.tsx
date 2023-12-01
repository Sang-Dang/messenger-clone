import { ChatConverter } from '@/classes/Chat'
import ReplyBasic from '@/classes/ReplyBasic'
import { db } from '@/firebase'
import useAppSelector from '@/lib/hooks/useAppSelector'
import ChatHeader from '@/pages/Chat/components/common/ChatHeader'
import MessageInputBox from '@/pages/Chat/components/common/MessageInputBox'
import MessagesViewContainer from '@/pages/Chat/components/common/MessagesViewContainer'
import { doc } from 'firebase/firestore'
import { MessagesSquare } from 'lucide-react'
import { createContext, useCallback, useState } from 'react'
import { useDocumentOnce } from 'react-firebase-hooks/firestore'

export default function ConversationView() {
    const chatId = useAppSelector((state) => state.conversation.value.chatId)

    if (!chatId) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="rounded-lg bg-neutral-100 p-20 text-center shadow-sm transition-all hover:shadow-lg">
                    <MessagesSquare size={100} className="mx-auto" />
                    <h5 className="mt-5 text-2xl font-bold">No chats selected</h5>
                    <p className="mt-2 text-sm font-normal">Please select a chat to start the conversation!</p>
                </div>
            </div>
        )
    }

    return <ConversationViewData key={chatId} chatId={chatId} />
}

export type ReplyContextType = {
    reply: ReplyBasic | null
    setReply: (response: ReplyBasic | null) => void
    resetReply: () => void
}
export const ReplyContext = createContext<ReplyContextType>({
    reply: null,
    setReply: () => {},
    resetReply: () => {}
})

type ConversationViewDataType = {
    chatId: string
}
function ConversationViewData({ chatId }: ConversationViewDataType) {
    const [chat, loadingChat, errorChat] = useDocumentOnce(doc(db, 'chats', chatId).withConverter(ChatConverter))
    const [reply, setReply] = useState<ReplyBasic | null>(null) // ? maybe move to global state instead if there are any problems

    const resetReply = useCallback(() => {
        setReply(null)
    }, [])

    if (loadingChat || !chat) {
        return
    }

    if (errorChat) {
        return <div>Error: {errorChat.message}</div>
    }

    const chatData = chat.data()!

    return (
        <ReplyContext.Provider
            value={{
                reply,
                setReply,
                resetReply
            }}
        >
            <div className="flex h-full w-full flex-col">
                <ChatHeader chat={chatData} className="" />
                <MessagesViewContainer chatId={chatId} userIds={chat.data()?.users ?? []} className="h-1 flex-1" />
                <MessageInputBox chatId={chatId} className="" />
            </div>
        </ReplyContext.Provider>
    )
}
