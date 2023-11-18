import { Button, Separator } from '@/components/ui'
import CreateConversationDialog from '@/pages/Chat/components/dialogs/CreateConversationDialog'
import ChatContextProvider from '@/pages/Chat/context/ChatContext'

export default function ChatPage() {
    return (
        <ChatContextProvider>
            <div className="flex h-fullNoHeader items-center">
                <aside className="h-full w-2/12 bg-secondary shadow-2xl">
                    <div className="p-8">
                        <CreateConversationDialog>
                            <Button className="w-full">Create Conversation</Button>
                        </CreateConversationDialog>
                        <Separator className="my-5 bg-neutral-500" />
                        {/* Chat list goes here */}
                        {/* Chat list stored in state */}
                    </div>
                </aside>
                <main className="h-full w-10/12 ">fdsfds</main>
            </div>
        </ChatContextProvider>
    )
}
