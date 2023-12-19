import { Message } from '@/classes/Message'
import useAuth from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'
import DeletedMessage from '@/pages/Chat/components/MessageBubble/DeletedMessage'
import ImageMessage from '@/pages/Chat/components/MessageBubble/ImageMessage'
import MessageAvatar from '@/pages/Chat/components/MessageBubble/MessageAvatar'
import MessageOptions from '@/pages/Chat/components/MessageBubble/MessageOptions'
import MessageSeperator from '@/pages/Chat/components/MessageBubble/MessageSeperator'
import ReplyMessage from '@/pages/Chat/components/MessageBubble/ReplyMessage'
import TextMessage from '@/pages/Chat/components/MessageBubble/TextMessage'
import { ReactionsTag } from '@/pages/Chat/components/common/ReactionsTag'
import differenceInMinutes from 'date-fns/differenceInMinutes'
import { memo, useMemo, useState } from 'react'

type MessageBubbleProps = {
    message: Message
    lastMessage: Message | null
    nextMessage: Message | null
    handleDeleteMessage: (messageId: string) => void
}
const MessageBubble = memo(
    ({ message, lastMessage, nextMessage, handleDeleteMessage }: MessageBubbleProps) => {
        console.log('RENDER')
        const { user } = useAuth()
        const isSelf = message.userId === user.uid
        const [isHovered, setIsHovered] = useState(false)

        const differenceToNextMessage = useMemo(
            () =>
                nextMessage === null
                    ? 0
                    : differenceInMinutes(
                          new Date(nextMessage.createdOn),
                          new Date(message.createdOn)
                      ),
            [message.createdOn, nextMessage]
        )

        const differenceToLastMessage = useMemo(
            () =>
                lastMessage === null
                    ? 0
                    : differenceInMinutes(
                          new Date(message.createdOn),
                          new Date(lastMessage.createdOn)
                      ),
            [lastMessage, message.createdOn]
        )

        const isLastMessage = useMemo(
            () =>
                nextMessage === null ||
                nextMessage.userId !== message.userId ||
                differenceToNextMessage > 10,
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

        return (
            <>
                {lastMessage &&
                    differenceInMinutes(
                        new Date(message.createdOn),
                        new Date(lastMessage?.createdOn)
                    ) > 10 && <MessageSeperator createdOn={message.createdOn} />}
                <div className="">
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
                                <MessageAvatar
                                    userId={message.userId}
                                    className="aspect-square w-10"
                                />
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
                    {message.reactions && Object.entries(message.reactions.count).length > 0 && (
                        <div
                            className={cn(
                                'relative z-30 ml-[3.2rem] flex h-min -translate-y-5 justify-start',
                                isSelf && 'mr-3 justify-end'
                            )}
                        >
                            <ReactionsTag reactions={message.reactions} />
                        </div>
                    )}
                </div>
            </>
        )
    }
)

export default MessageBubble
