import { Button, Separator } from '@/components/ui'
import ChatList from '@/pages/Chat/components/ChatList'
import ConversationView from '@/pages/Chat/components/ConversationView'
import CreateConversationDialog from '@/pages/Chat/components/dialogs/CreateConversationDialog'
import { Helmet } from 'react-helmet'

export default function ChatPage() {
    return (
        <>
            <Helmet>
                <title>Chat | Chunt</title>
            </Helmet>
            <div className="flex h-fullNoHeader items-center overflow-x-hidden">
                <aside className="h-full w-3/12 rounded-r-lg border-r-2 border-r-neutral-200 bg-secondary shadow-2xl">
                    <div className="p-8">
                        <CreateConversationDialog>
                            <Button className="w-full">Create Conversation</Button>
                        </CreateConversationDialog>
                        <Separator className="my-5 bg-neutral-500" />
                        <ChatList />
                    </div>
                </aside>
                <main className="h-full w-9/12 ">
                    <ConversationView />
                </main>
            </div>
        </>
    )
}
