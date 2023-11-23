import { ChatConverter } from '@/classes/Chat'
import { MessageConverter } from '@/classes/Message'
import { db } from '@/firebase'
import useAppSelector from '@/lib/hooks/useAppSelector'
import ChatHeader from '@/pages/Chat/components/common/ChatHeader'
import MessageInputBox from '@/pages/Chat/components/common/MessageInputBox'
import MessagesViewContainer from '@/pages/Chat/components/common/MessagesViewContainer'
import { collection, doc, query } from 'firebase/firestore'
import { useCollection, useDocumentOnce } from 'react-firebase-hooks/firestore'

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
    const [messages, loadingMessages, errorMessages] = useCollection(
        query(collection(db, 'chats', chatId, 'messages')).withConverter(MessageConverter)
    )
    const [chat, loadingChat, errorChat] = useDocumentOnce(doc(db, 'chats', chatId).withConverter(ChatConverter))

    if (loadingMessages) {
        return <div>Loading...</div>
    }

    if (errorMessages) {
        return <div>Error: {errorMessages.message}</div>
    }

    return (
        <div className="flex h-full flex-col">
            <ChatHeader chat={chat?.data()} loading={loadingChat} error={errorChat} />
            <MessagesViewContainer className="flex-grow" messages={messages!.docs.map((doc) => doc.data())} />
            <MessageInputBox />
        </div>
    )
}
