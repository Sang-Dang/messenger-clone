import { DeleteMessage, SeenMessage } from '@/api/messages'
import {
    SelectConversationChatId,
    SelectConversationMessageById
} from '@/features/Conversation.ts/ConversationSelectors'
import useAppSelector from '@/lib/hooks/useAppSelector'
import useAuth from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'
import DeletedMessage from '@/pages/Chat/components/MessageBubble/DeletedMessage'
import ImageMessage from '@/pages/Chat/components/MessageBubble/ImageMessage'
import MessageAvatar from '@/pages/Chat/components/MessageBubble/MessageAvatar'
import MessageOptions from '@/pages/Chat/components/MessageBubble/MessageOptions'
import MessageSeperator from '@/pages/Chat/components/MessageBubble/MessageSeperator'
import ReplyMessage from '@/pages/Chat/components/MessageBubble/ReplyMessage'
import TextMessage from '@/pages/Chat/components/MessageBubble/TextMessage'
import { ReactionsTag } from '@/pages/Chat/components/MessageBubble/ReactionsTag'
import differenceInMinutes from 'date-fns/differenceInMinutes'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import SeenContainer from '@/pages/Chat/components/MessageBubble/SeenContainer'
import { useInView } from 'framer-motion'

type MessageBubbleProps = {
    messageId: string
    lastMessageId: string
    nextMessageId: string
}
const MessageBubble = memo(({ messageId, lastMessageId, nextMessageId }: MessageBubbleProps) => {
    const message = useAppSelector(SelectConversationMessageById(messageId))!
    const lastMessage = useAppSelector(SelectConversationMessageById(lastMessageId)) ?? null
    const nextMessage = useAppSelector(SelectConversationMessageById(nextMessageId)) ?? null
    const chatId = useAppSelector(SelectConversationChatId)!
    const [isHovered, setIsHovered] = useState(false)
    const { user } = useAuth()
    const messageRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(messageRef, {
        once: false
    })

    const isSelf = message.userId === user.uid

    // TODO change seenBy from array to key value object
    useEffect(() => {
        if (isInView && !message.seenBy.includes(user.uid)) {
            SeenMessage(message.id, user.uid, chatId)
        }
    }, [chatId, isInView, message, message.id, message.seenBy, user.uid])

    function handleDeleteMessage() {
        try {
            if (message.userId !== user.uid) {
                throw new Error('You can only delete your own messages')
            }
            DeleteMessage(messageId, chatId!)
        } catch (error) {
            console.error(error)
        }
    }

    const differenceToNextMessage = useMemo(
        () =>
            !nextMessage
                ? 0
                : differenceInMinutes(nextMessage.createdOn.toDate(), message.createdOn.toDate()),
        [message.createdOn, nextMessage]
    )

    const differenceToLastMessage = useMemo(
        () =>
            !lastMessage
                ? 0
                : differenceInMinutes(message.createdOn.toDate(), lastMessage.createdOn.toDate()),
        [lastMessage, message.createdOn]
    )

    const isLastMessage = useMemo(
        () => !nextMessage || nextMessage.userId !== message.userId || differenceToNextMessage > 10,
        [differenceToNextMessage, message.userId, nextMessage]
    )

    const isAvatarShown = useMemo(() => isLastMessage && !isSelf, [isLastMessage, isSelf])
    const roundedCorners = useMemo(
        () =>
            cn(
                lastMessage &&
                    message.userId === lastMessage.userId &&
                    lastMessage.type !== 'image' &&
                    differenceToLastMessage < 10 &&
                    (isSelf ? 'rounded-tr-md' : 'rounded-tl-md'),
                nextMessage &&
                    message.userId === nextMessage.userId &&
                    nextMessage.type !== 'image' &&
                    differenceToNextMessage < 10 &&
                    (isSelf ? 'rounded-br-md' : 'rounded-bl-md')
            ),
        [
            differenceToLastMessage,
            differenceToNextMessage,
            isSelf,
            lastMessage,
            message.userId,
            nextMessage
        ]
    )
    const lastSeenMessageList = useMemo(
        () =>
            nextMessage
                ? message.seenBy.filter((userId) => !nextMessage.seenBy.includes(userId))
                : message.seenBy,
        [message.seenBy, nextMessage]
    )

    return (
        <>
            {lastMessage &&
                differenceInMinutes(message.createdOn.toDate(), lastMessage.createdOn.toDate()) >
                    10 && <MessageSeperator createdOn={message.createdOn.toDate()} />}
            <div ref={messageRef}>
                <div
                    className={cn(
                        'relative mb-1 flex gap-3',
                        isSelf && 'flex-row-reverse',
                        isLastMessage && 'mb-2'
                    )}
                    onMouseOver={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div
                        id="messagebubble_metadata"
                        className={cn('flex w-10 flex-col justify-end', isSelf && 'w-0')}
                    >
                        {isAvatarShown && (
                            <MessageAvatar userId={message.userId} className="aspect-square w-10" />
                        )}
                    </div>
                    <div id="messagebubble_content">
                        {message.repliedTo && (
                            <ReplyMessage
                                repliedTo={message.repliedTo}
                                className={cn(
                                    'relative z-10 flex flex-col items-start',
                                    isSelf && 'items-end text-right'
                                )}
                            />
                        )}
                        <div className={cn('relative z-20 flex', isSelf && 'justify-end')}>
                            {message.type === 'text' && (
                                <TextMessage
                                    message={message.message}
                                    isSelf={isSelf}
                                    className={roundedCorners}
                                />
                            )}
                            {message.type === 'image' && (
                                <ImageMessage
                                    imageUrls={message.message.split(';')}
                                    isSelf={isSelf}
                                    className="my-1"
                                />
                            )}
                            {message.type === 'deleted' && (
                                <DeletedMessage className={roundedCorners} />
                            )}
                        </div>
                    </div>
                    <MessageOptions
                        data={message}
                        handleDeleteMessage={handleDeleteMessage}
                        isHovered={isHovered}
                        isSelf={isSelf}
                    />
                </div>
                {message.reactions && Object.keys(message.reactions.data).length > 0 && (
                    <div
                        className={cn(
                            'relative z-30 ml-[3.2rem] flex h-5 -translate-y-4 justify-start',
                            isSelf && 'mr-3 justify-end'
                        )}
                    >
                        <ReactionsTag reactions={message.reactions} />
                    </div>
                )}
                {lastSeenMessageList.length !== 0 && (
                    <SeenContainer key={message.id} userIds={lastSeenMessageList} isSelf={isSelf} />
                )}
            </div>
        </>
    )
})

export default MessageBubble
