import { Button } from '@/components/ui'
import ChatList from '@/pages/Chat/components/ChatList'
import CreateConversationDialog from '@/pages/Chat/components/dialogs/CreateConversationDialog'
import { PlusSquare } from 'lucide-react'

export default function ChatSidebar() {
    return (
        <aside className="p-std flex h-fullNoHeader w-[400px] resize-x flex-col rounded-r-lg border-r-2 border-r-neutral-200 bg-secondary shadow-2xl">
            <div className="mb-6 flex items-center gap-3">
                <h1 className="text-h3 flex-grow font-bold">Chats</h1>
                <CreateConversationDialog
                    tooltipContent={
                        <p>
                            <strong>Create</strong> a new conversation
                        </p>
                    }
                >
                    <Button variant="ghost" className="p-0">
                        <PlusSquare />
                    </Button>
                </CreateConversationDialog>
            </div>
            <ChatList />
        </aside>
    )
}
