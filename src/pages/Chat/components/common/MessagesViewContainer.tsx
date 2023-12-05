import { Message, MessageConverter } from '@/classes/Message'
import { Separator } from '@/components/ui'
import { SelectSortedMessages } from '@/features/Messages/MessagesSelectors'
import { messageUpdated, messagesAddedOld } from '@/features/Messages/MessagesSlice'
import { selectUserInIdList } from '@/features/Users/UsersSelectors'
import { db } from '@/firebase'
import useAppDispatch from '@/lib/hooks/useAppDispatch'
import useAppSelector from '@/lib/hooks/useAppSelector'
import { cn } from '@/lib/utils'
import MessageBubble from '@/pages/Chat/components/common/MessageBubble'
import differenceInMinutes from 'date-fns/differenceInMinutes'
import format from 'date-fns/format'
import { Timestamp, collection, limit, orderBy, query, where } from 'firebase/firestore'
import { MessageSquare } from 'lucide-react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useCollectionData, useCollectionDataOnce } from 'react-firebase-hooks/firestore'

type MessagesViewContainerProps = {
    className?: string
    chatId: string
    userIds: string[]
}

const MESSAGE_LIMIT = 10

export default function MessagesViewContainer({ className, chatId, userIds }: MessagesViewContainerProps) {
    const [messages, loadingMessages] = useCollectionDataOnce(
        query(collection(db, 'chats', chatId, 'messages').withConverter(MessageConverter), orderBy('createdOn', 'desc'), limit(MESSAGE_LIMIT))
    )
    const [, loadingSize, , snapshot] = useCollectionDataOnce(
        query(collection(db, 'chats', chatId, 'messages').withConverter(MessageConverter), orderBy('createdOn', 'desc'))
    )

    if (loadingMessages || !messages || loadingSize || !snapshot) {
        return <div className="h-full"></div>
    }

    const message_divider = messages[messages.length - 1]?.createdOn ?? '1900-01-01T00:00:00'

    return <ViewMessages className={className} chatId={chatId} userIds={userIds} message_divider={message_divider} no_documents={snapshot.size} />
}

type MessagesViewProps = {
    chatId: string
    className?: string
    userIds: string[]
    message_divider: string
    no_documents: number
}
function ViewMessages({ chatId, className, userIds, message_divider, no_documents }: MessagesViewProps) {
    const [currentLimit, setCurrentLimit] = useState(MESSAGE_LIMIT)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleLoadMoreMessages(e: Event) {
            if ((e.target as HTMLDivElement).scrollTop === 0 && currentLimit + MESSAGE_LIMIT <= no_documents) {
                setCurrentLimit((prev) => prev + MESSAGE_LIMIT)
            }
        }

        const currentRef = scrollRef.current
        currentRef && currentRef.addEventListener('scroll', handleLoadMoreMessages)

        return () => {
            currentRef && currentRef.removeEventListener('scroll', handleLoadMoreMessages)
        }
    }, [currentLimit, no_documents])

    // useEffect(() => {
    //     scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
    // }, [])

    return (
        <div className={cn('flex flex-col justify-end', className)}>
            <div className="w-full overflow-y-auto px-3 pt-5" ref={scrollRef}>
                <LoadPrevMessages chatId={chatId} message_divider={message_divider} userIds={userIds} currentLimit={currentLimit} />
                <LoadNewMessages chatId={chatId} message_divider={message_divider} userIds={userIds} />
            </div>
        </div>
    )
}

type LoadNewMessagesProps = {
    chatId: string
    message_divider: string
    userIds: string[]
}
function LoadNewMessages({ chatId, message_divider, userIds }: LoadNewMessagesProps) {
    const [newMessages, loadingNewMessages] = useCollectionData(
        query(
            collection(db, 'chats', chatId, 'messages').withConverter(MessageConverter),
            orderBy('createdOn', 'asc'),
            where('createdOn', '>=', Timestamp.fromDate(new Date(message_divider)))
        )
    )

    if (loadingNewMessages || newMessages === undefined) {
        return
    }

    if (newMessages.length === 0) {
        return (
            <div className="mb-60 flex w-full flex-col items-center justify-center">
                <MessageSquare size={100} />
                <h5 className="mt-3 text-2xl font-bold">No messages yet.</h5>
                <p className="mt-1 font-light">Type your first message in the input box below.</p>
            </div>
        )
    }

    return <MessageView messageList={newMessages} userIds={userIds} key={'newMessages'} />
}

type LoadPrevMessagesProps = {
    message_divider: string
    chatId: string
    currentLimit: number
    userIds: string[]
}
function LoadPrevMessages({ message_divider, chatId, currentLimit, userIds }: LoadPrevMessagesProps) {
    const [oldMessages, loadingOldMessages, , snapshot] = useCollectionData(
        query(
            collection(db, 'chats', chatId, 'messages').withConverter(MessageConverter),
            where('createdOn', '<=', Timestamp.fromDate(new Date(message_divider))),
            orderBy('createdOn', 'desc'),
            limit(currentLimit)
        )
    )
    const dispatch = useAppDispatch()

    if (loadingOldMessages || oldMessages === undefined || oldMessages.length === 0) {
        return
    }

    snapshot?.docChanges().forEach((change) => {
        if (change.type === 'added') {
            dispatch(messagesAddedOld(change.doc.data() as Message))
        }

        if (change.type === 'modified') {
            dispatch(messageUpdated(change.doc.data() as Message))
        }
    })

    return <MiddleOld userIds={userIds} />
}

type MiddleOldProps = {
    userIds: string[]
}
function MiddleOld({ userIds }: MiddleOldProps) {
    const messages = useAppSelector(SelectSortedMessages())
    return <MessageView messageList={messages} userIds={userIds} key={'oldMessages'} />
}

type MessageViewProps = {
    messageList: Message[]
    userIds: string[]
}
function MessageView({ messageList, userIds }: MessageViewProps) {
    console.log(messageList)
    const users = useAppSelector(selectUserInIdList(userIds))

    function handleDeleteMessage() {}

    return messageList.map((data, index, array) => (
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
