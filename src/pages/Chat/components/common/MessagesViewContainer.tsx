import { DeleteMessage } from '@/api/messages'
import { MessageConverter } from '@/classes/Message'
import { Separator } from '@/components/ui'
import { selectUserInIdList } from '@/features/Users/UsersSelectors'
import { db } from '@/firebase'
import useAppSelector from '@/lib/hooks/useAppSelector'
import useAuth from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'
import MessageBubble from '@/pages/Chat/components/common/MessageBubble'
import differenceInMinutes from 'date-fns/differenceInMinutes'
import format from 'date-fns/format'
import { collection, orderBy, query, startAfter } from 'firebase/firestore'
import { MessageSquare } from 'lucide-react'
import { Fragment, useCallback, useEffect, useRef } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'

type MessagesViewContainerProps = {
    className?: string
    chatId: string
    userIds: string[]
}

export default function MessagesViewContainer({ className, chatId, userIds }: MessagesViewContainerProps) {
    // get conversation messages
    const [messages, loadingMessages, errorMessages] = useCollectionData(
        query(collection(db, 'chats', chatId, 'messages'), orderBy('createdOn', 'asc'), startAfter('')).withConverter(MessageConverter)
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
        function handleLoadMoreMessages(e: Event) {
            if ((e.target as HTMLDivElement).scrollTop === 0) {
                console.log('fetching more messages')
            }
        }

        const currentRef = scrollRef.current
        currentRef && currentRef.addEventListener('scroll', handleLoadMoreMessages)

        return () => {
            currentRef && currentRef.removeEventListener('scroll', handleLoadMoreMessages)
        }
    }, [])

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
        <div className={cn('flex flex-col justify-end', className)}>
            {loadingMessages ? (
                <div className="flex h-full w-full flex-col items-center justify-center">{/* <LoadingSpinner type="dark" /> */}</div>
            ) : messages!.length === 0 ? (
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <MessageSquare size={100} />
                    <h5 className="mt-3 text-2xl font-bold">No messages yet.</h5>
                    <p className="mt-1 font-light">Type your first message in the input box below.</p>
                </div>
            ) : (
                <div className="w-full overflow-y-auto px-3 pt-5" ref={scrollRef}>
                    {messages!.map((data, index, array) => (
                        <Fragment key={data.id}>
                            {differenceInMinutes(new Date(data.createdOn), new Date(array[index - 1]?.createdOn)) > 10 && (
                                <div className="relative mx-auto my-10">
                                    <Separator className="w-full bg-primary/20" />
                                    <p className="absolute left-1/2 w-max -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm font-light text-primary/70">
                                        {format(new Date(data.createdOn), 'dd/MM/yyyy - HH:mm')}
                                    </p>
                                </div>
                            )}
                            <MessageBubble
                                data={data}
                                showAvatar={array[index + 1] === undefined || array[index + 1].userId !== data.userId}
                                key={data.id}
                                sender={users.filter((user) => user.id === data.userId)[0]}
                                handleDeleteMessage={handleDeleteMessage}
                            />
                        </Fragment>
                    ))}
                </div>
            )}
        </div>
    )
}
