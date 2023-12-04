import { Message, MessageConverter } from '@/classes/Message'
import { Separator } from '@/components/ui'
import { selectUserInIdList } from '@/features/Users/UsersSelectors'
import { db } from '@/firebase'
import useAppDispatch from '@/lib/hooks/useAppDispatch'
import useAppSelector from '@/lib/hooks/useAppSelector'
import { cn } from '@/lib/utils'
import MessageBubble from '@/pages/Chat/components/common/MessageBubble'
import differenceInMinutes from 'date-fns/differenceInMinutes'
import format from 'date-fns/format'
import { Timestamp, collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { MessageSquare } from 'lucide-react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'

type MessagesViewContainerProps = {
    className?: string
    chatId: string
    userIds: string[]
}

const MESSAGE_LIMIT = 10

export default function MessagesViewContainer({ className, chatId, userIds }: MessagesViewContainerProps) {
    const dispatch = useAppDispatch()
    const [oldest, setOldest] = useState<string | undefined>(undefined) // KEEP UNDEFINED

    // load latest message
    useEffect(() => {
        async function loadOldest() {
            const q = query(
                collection(db, 'chats', chatId, 'messages').withConverter(MessageConverter),
                orderBy('createdOn', 'desc'),
                limit(MESSAGE_LIMIT)
            )
            const querySnapshot = await getDocs(q)
            const messages = querySnapshot.docs.map((doc) => doc.data() as Message)

            setOldest(messages[messages.length - 1]?.createdOn ?? '1900-01-01T00:00:00')
        }

        loadOldest()
    }, [chatId, dispatch])

    if (oldest === undefined) {
        return <div className="h-full"></div>
    }

    return <ViewMessages className={className} chatId={chatId} userIds={userIds} lastMessage={oldest} />
}

type MessagesViewProps = {
    chatId: string
    className?: string
    userIds: string[]
    lastMessage: string
}
function ViewMessages({ chatId, className, userIds, lastMessage }: MessagesViewProps) {
    const users = useAppSelector(selectUserInIdList(userIds))
    const [currentLimit, setCurrentLimit] = useState(MESSAGE_LIMIT)
    const [showLoading, setShowLoading] = useState(false)
    const [newMessages, loadingNewMessages] = useCollectionData(
        query(
            collection(db, 'chats', chatId, 'messages').withConverter(MessageConverter),
            orderBy('createdOn', 'asc'),
            where('createdOn', '>=', Timestamp.fromDate(new Date(lastMessage)))
        )
    )
    const [oldMessages, loadingOldMessages] = useCollectionData(
        query(
            collection(db, 'chats', chatId, 'messages').withConverter(MessageConverter),
            orderBy('createdOn', 'desc'),
            where('createdOn', '<', Timestamp.fromDate(new Date(lastMessage))),
            limit(currentLimit)
        )
    )

    const scrollRef = useRef<HTMLDivElement>(null)

    function handleDeleteMessage() {}

    useEffect(() => {
        function handleLoadMoreMessages(e: Event) {
            if ((e.target as HTMLDivElement).scrollTop === 0) {
                console.log('first')
                setCurrentLimit((prev) => prev + MESSAGE_LIMIT)
            }
        }

        const currentRef = scrollRef.current
        currentRef && currentRef.addEventListener('scroll', handleLoadMoreMessages)

        return () => {
            currentRef && currentRef.removeEventListener('scroll', handleLoadMoreMessages)
        }
    }, [])

    return (
        <div className={cn('flex flex-col justify-end', className)}>
            {loadingNewMessages ? (
                <div className="flex h-full w-full flex-col items-center justify-center">{/* <LoadingSpinner type="dark" /> */}</div>
            ) : newMessages!.length === 0 ? (
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <MessageSquare size={100} />
                    <h5 className="mt-3 text-2xl font-bold">No messages yet.</h5>
                    <p className="mt-1 font-light">Type your first message in the input box below.</p>
                </div>
            ) : (
                <div className="w-full overflow-y-auto px-3 pt-5" ref={scrollRef}>
                    {showLoading && <div>Loading...</div>}
                    {loadingOldMessages ? (
                        <div>Loading...</div>
                    ) : (
                        oldMessages!.map((data, index, array) => (
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
                        ))
                    )}
                    {newMessages!.map((data, index, array) => (
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

function LoadPrevData() {}

function LoadCurrData() {}

type ViewDataTemplateProps = {
    messages: Message[]
    userIds: string[]
}
function ViewDataTemplate({ messages, userIds }: ViewDataTemplateProps) {
    function handleDeleteMessage() {
        // TODO
    }
    const users = useAppSelector(selectUserInIdList(userIds))

    return messages.map((data, index, array) => (
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
    ))
}
