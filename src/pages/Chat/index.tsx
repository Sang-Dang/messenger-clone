import { lazy } from 'react'
import { Helmet } from 'react-helmet'

const ChatSidebar = lazy(() => import('@/pages/Chat/components/ChatSidebar'))
const ConversationView = lazy(() => import('@/pages/Chat/components/ConversationView'))

export default function ChatPage() {
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
            </div>
        </>
    )
}
