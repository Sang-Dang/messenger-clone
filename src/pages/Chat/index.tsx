import ChatSidebar from '@/pages/Chat/components/ChatSidebar'
import ConversationView from '@/pages/Chat/components/ConversationView'
import { Helmet } from 'react-helmet'

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
