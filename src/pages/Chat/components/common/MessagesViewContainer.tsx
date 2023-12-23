import { MessageConverter } from '@/classes/Message'
import { SelectConversationMessageIds } from '@/features/Conversation.ts/ConversationSelectors'
import { messageAdded, messageUpdated } from '@/features/Conversation.ts/ConversationSlice'
import { db } from '@/firebase'
import useAppDispatch from '@/lib/hooks/useAppDispatch'
import useAppSelector from '@/lib/hooks/useAppSelector'
import { cn } from '@/lib/utils'
import MessageBubble from '@/pages/Chat/components/MessageBubble'
import { collection, orderBy, query } from 'firebase/firestore'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'

type MessagesViewContainerProps = {
    className?: string
    chatId: string
}

export default function MessagesViewContainer({ className, chatId }: MessagesViewContainerProps) {
    const dispatch = useAppDispatch()
    const [, loadingMessages, errorMessages, snapshot] = useCollectionData(
        query(
            collection(db, 'chats', chatId, 'messages'),
            orderBy('createdOn', 'asc')
        ).withConverter(MessageConverter)
    )

    // if (loadingMessages) {
    //     return (
    //         <div className="grid h-full w-full place-items-center">
    //             <AnimatePresence mode="popLayout">
    //                 <LoadingSpinner type="dark" className="h-20 w-20" />
    //             </AnimatePresence>
    //         </div>
    //     )
    // }

    // if (errorMessages) {
    //     return <div className="h-full">{errorMessages.message}</div>
    // }

    snapshot?.docChanges().forEach((change) => {
        if (change.type === 'added') {
            dispatch(
                messageAdded({
                    ...change.doc.data()
                })
            )
        }

        if (change.type === 'modified') {
            dispatch(
                messageUpdated({
                    ...change.doc.data()
                })
            )
        }
    })

    return (
        <AnimatePresence mode="sync" presenceAffectsLayout initial={false}>
            {loadingMessages ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid h-full w-full place-items-center"
                >
                    <img
                        src="/svg/dark-logo-only-transparent.svg"
                        alt="loader..."
                        className="h-32 w-32"
                    />
                </motion.div>
            ) : errorMessages ? (
                <div className="h-full">{errorMessages.message}</div>
            ) : (
                <MessagesView className={cn('h-full', className)} />
            )}
        </AnimatePresence>
    )
}

type MessagesViewProps = {
    className?: string
}
function MessagesView({ className }: MessagesViewProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const messageIds = useAppSelector(SelectConversationMessageIds)

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current?.scrollHeight
        })
    }, [messageIds.length])

    return (
        <div className={cn('flex flex-col justify-end', className)}>
            {messageIds.length === 0 ? (
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <MessageSquare size={100} />
                    <h5 className="mt-3 text-2xl font-bold">No messages yet.</h5>
                    <p className="mt-1 font-light">
                        Type your first message in the input box below.
                    </p>
                </div>
            ) : (
                <div className="w-full overflow-y-auto px-3 pt-5" ref={scrollRef}>
                    {messageIds.map((data, index, array) => (
                        <MessageBubble
                            key={data}
                            messageId={data}
                            lastMessageId={array[index - 1] ?? ''}
                            nextMessageId={array[index + 1] ?? ''}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
