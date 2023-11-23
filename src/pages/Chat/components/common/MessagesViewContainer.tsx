import { MessageConverter } from '@/classes/Message'
import { UserConverter } from '@/classes/User'
import { ScrollArea } from '@/components/ui'
import { db } from '@/firebase'
import { cn } from '@/lib/utils'
import MessageBubble from '@/pages/Chat/components/common/MessageBubble'
import { collection, documentId, orderBy, query, where } from 'firebase/firestore'
import { MessageSquare } from 'lucide-react'
import { useRef } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'

type MessagesViewContainerProps = {
    className?: string
    chatId: string
    userIds: string[] | undefined
}

export default function MessagesViewContainer({ className, chatId, userIds }: MessagesViewContainerProps) {
    const [messages, loadingMessages, errorMessages] = useCollectionData(
        query(collection(db, 'chats', chatId, 'messages'), orderBy('createdOn', 'asc')).withConverter(MessageConverter)
    )

    const boxRef = useRef<HTMLDivElement>(null)

    const [users, loadingUsers, errorUsers] = useCollectionData(
        userIds && query(collection(db, 'users').withConverter(UserConverter), where(documentId(), 'in', userIds))
    )

    if (loadingMessages || loadingUsers) {
        return <div>Loading...</div>
    }

    if (errorMessages) {
        return <div>Error: {errorMessages.message}</div>
    }

    if (errorUsers) {
        return <div>Error: {errorUsers.message}</div>
    }

    return (
        <ScrollArea className={cn('p-3 py-0', className)} ref={boxRef} type="hover">
            <div className="flex h-full flex-col justify-end">
                {messages!.length === 0 ? (
                    <div className="flex h-full w-full flex-col items-center justify-center">
                        <MessageSquare size={100} />
                        <h5 className="mt-3 text-2xl font-bold">No messages yet.</h5>
                        <p className="mt-1 font-light">Type your first message in the input box below.</p>
                    </div>
                ) : (
                    messages!.map((data) => <MessageBubble data={data} key={data.id} user={users?.find((user) => user.id === data.userId)} />)
                )}
            </div>
        </ScrollArea>
    )
}
