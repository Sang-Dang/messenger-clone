import { ChatConverter } from '@/classes/Chat'
import { auth, db } from '@/firebase'
import useAppSelector from '@/lib/hooks/useAppSelector'
import ChatHeader from '@/pages/Chat/components/common/ChatHeader'
import MessageInputBox from '@/pages/Chat/components/common/MessageInputBox'
import MessagesViewContainer from '@/pages/Chat/components/common/MessagesViewContainer'
import { doc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDocumentOnce } from 'react-firebase-hooks/firestore'

export default function ConversationView() {
    const chatId = useAppSelector((state) => state.conversation.value.chatId)

    if (!chatId) {
        return <div>Please select a chat.</div>
    }

    return <ConversationViewData key={chatId} chatId={chatId} />
}

type ConversationViewDataType = {
    chatId: string
}
function ConversationViewData({ chatId }: ConversationViewDataType) {
    const [user] = useAuthState(auth)
    const [chat, loadingChat, errorChat] = useDocumentOnce(doc(db, 'chats', chatId).withConverter(ChatConverter))

    if (loadingChat) {
        return <div>Loading...</div>
    }

    if (errorChat) {
        return <div>Error: {errorChat.message}</div>
    }

    return (
        <div className="flex h-full flex-col">
            <ChatHeader chat={chat?.data()} loading={loadingChat} error={errorChat} userId={user?.uid} />
            <MessagesViewContainer className="flex-grow" chatId={chatId} userIds={chat!.data()?.users} />
            <MessageInputBox chatId={chatId} />
        </div>
    )
}
