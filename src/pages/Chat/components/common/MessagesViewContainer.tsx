import { DeleteMessage } from '@/api/messages'
import { MessageConverter } from '@/classes/Message'
import { db } from '@/firebase'
import useAuth from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'
import MessageBubble from '@/pages/Chat/components/MessageBubble'
import { collection, orderBy, query } from 'firebase/firestore'
import { MessageSquare } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'

type MessagesViewContainerProps = {
    className?: string
    chatId: string
}

export default function MessagesViewContainer({ className, chatId }: MessagesViewContainerProps) {
    // get conversation messages
    const [messages, loadingMessages, errorMessages] = useCollectionData(
        query(
            collection(db, 'chats', chatId, 'messages'),
            orderBy('createdOn', 'asc')
        ).withConverter(MessageConverter)
    )
    const { user } = useAuth()
    const scrollRef = useRef<HTMLDivElement>(null)

    const handleDeleteMessage = useCallback(
        (messageId: string) => {
            try {
                if (messages?.find((m) => m.id === messageId)?.userId !== user.uid) {
                    throw new Error('You are not allowed to delete this message.')
                }
                DeleteMessage(messageId, chatId)
            } catch (error) {
                console.error(error)
            }
        },
        [chatId, messages, user.uid]
    )

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current?.scrollHeight
        })
    }, [messages])

    if (errorMessages) {
        return <div>Error: {errorMessages.message}</div>
    }

    return (
        <div className={cn('flex flex-col justify-end', className)}>
            {loadingMessages ? (
                <div className="flex h-full w-full flex-col items-center justify-center">
                    {/* <LoadingSpinner type="dark" /> */}
                </div>
            ) : messages!.length === 0 ? (
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <MessageSquare size={100} />
                    <h5 className="mt-3 text-2xl font-bold">No messages yet.</h5>
                    <p className="mt-1 font-light">
                        Type your first message in the input box below.
                    </p>
                </div>
            ) : (
                <div className="w-full overflow-y-auto px-3 pt-5" ref={scrollRef}>
                    {messages!.map((data, index, array) => (
                        <MessageBubble
                            key={data.id}
                            message={data}
                            lastMessage={array[index - 1] ?? null}
                            nextMessage={array[index + 1] ?? null}
                            handleDeleteMessage={handleDeleteMessage}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
