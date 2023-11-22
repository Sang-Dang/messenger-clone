import { Button, Separator } from '@/components/ui'
import ChatList from '@/pages/Chat/components/ChatList'
import ConversationView from '@/pages/Chat/components/ConversationView'
import CreateConversationDialog from '@/pages/Chat/components/dialogs/CreateConversationDialog'

export default function ChatPage() {
    return (
        <div className="flex h-fullNoHeader items-center">
            <aside className="h-full w-3/12 bg-secondary shadow-2xl">
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
    )
}
