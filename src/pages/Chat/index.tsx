import { chatSelected } from '@/features/Conversation.ts/ConversationSlice'
import ChatInfoBar from '@/pages/Chat/components/ChatInfobar'
import ChatSidebar from '@/pages/Chat/components/ChatSidebar'
import ConversationView from '@/pages/Chat/components/ConversationView'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

export default function ChatPage() {
    const params = useParams()
    const dispatch = useDispatch()

    if (params.id) {
        dispatch(
            chatSelected({
                chatId: params.id
            })
        )
    }

    return (
        <>
            <Helmet>
                <title>Chat | Chunt</title>
            </Helmet>
            <div className="flex h-fullNoHeader w-full items-center overflow-hidden">
                <ChatSidebar />
                <main className="h-full w-full">
                    <ConversationView />
                </main>
                <ChatInfoBar />
            </div>
        </>
    )
}
