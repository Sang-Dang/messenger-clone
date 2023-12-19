import ReplyBasic from '@/classes/ReplyBasic'
import { selectChatById } from '@/features/Chat/ChatSelectors'
import { SelectChatId } from '@/features/Messages/MessagesSelectors'
import useAppSelector from '@/lib/hooks/useAppSelector'
import ChatHeader from '@/pages/Chat/components/common/ChatHeader'
import MessageInputBox from '@/pages/Chat/components/common/MessageInputBox'
import MessagesViewContainer from '@/pages/Chat/components/common/MessagesViewContainer'
import { MessagesSquare } from 'lucide-react'
import { createContext, useState } from 'react'

export default function ConversationView() {
    const chatId = useAppSelector(SelectChatId)

    if (!chatId) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="rounded-lg bg-neutral-100 p-20 text-center shadow-sm transition-all hover:shadow-lg">
                    <MessagesSquare size={100} className="mx-auto" />
                    <h5 className="mt-5 text-2xl font-bold">No chats selected</h5>
                    <p className="mt-2 text-sm font-normal">
                        Please select a chat to start the conversation!
                    </p>
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

// divide it out because you can't render hooks conditionally like wtf
type ConversationViewDataType = {
    chatId: string
}
function ConversationViewData({ chatId }: ConversationViewDataType) {
    const [reply, setReply] = useState<ReplyBasic | null>(null) // ? maybe move to global state instead if there are any problems
    const chat = useAppSelector(selectChatById(chatId))

    return (
        <ReplyContext.Provider
            value={{
                reply,
                setReply,
                resetReply: () => setReply(null)
            }}
        >
            <div className="flex h-full w-full flex-col">
                <ChatHeader chat={chat} className="" />
                <MessagesViewContainer chatId={chatId} className="h-1 flex-1" />
                <MessageInputBox chatId={chatId} className="" />
            </div>
        </ReplyContext.Provider>
    )
}
