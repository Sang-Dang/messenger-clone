import { MessageConverter } from '@/classes/Message'
import { selectUserInIdList } from '@/features/Users/UsersSelectors'
import { db } from '@/firebase'
import useAppSelector from '@/lib/hooks/useAppSelector'
import { cn } from '@/lib/utils'
import MessageBubble from '@/pages/Chat/components/common/MessageBubble'
import { collection, orderBy, query } from 'firebase/firestore'
import { MessageSquare } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'

type MessagesViewContainerProps = {
    className?: string
    chatId: string
    userIds: string[]
}

export default function MessagesViewContainer({ className, chatId, userIds }: MessagesViewContainerProps) {
    // get conversation messages
    const [messages, loadingMessages, errorMessages] = useCollectionData(
        query(collection(db, 'chats', chatId, 'messages'), orderBy('createdOn', 'asc')).withConverter(MessageConverter)
    )

    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current?.scrollHeight
        })
    }, [messages])

    // get all users in current conversation

    const users = useAppSelector(selectUserInIdList(userIds))

    if (errorMessages) {
        return <div>Error: {errorMessages.message}</div>
    }

    return (
        <div className={cn('flex h-[calc(var(--full-height-no-header)-var(--header-height)*2)] flex-col justify-end', className)}>
            {loadingMessages ? (
                <div className="flex h-full w-full flex-col items-center justify-center">Loading...</div>
            ) : messages!.length === 0 ? (
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <MessageSquare size={100} />
                    <h5 className="mt-3 text-2xl font-bold">No messages yet.</h5>
                    <p className="mt-1 font-light">Type your first message in the input box below.</p>
                </div>
            ) : (
                <div className="overflow-y-auto px-3" ref={scrollRef}>
                    {messages!.map((data, index, array) => (
                        <MessageBubble
                            data={data}
                            showAvatar={array[index + 1] === undefined || array[index + 1].userId !== data.userId}
                            key={data.id}
                            sender={users.filter((user) => user.id === data.userId)[0]}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
