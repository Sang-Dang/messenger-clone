import { Message } from '@/classes/Message'
import useAuth from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'
import ImageMessage from '@/pages/Chat/components/MessageBubble/ImageMessage'
import MessageAvatar from '@/pages/Chat/components/MessageBubble/MessageAvatar'
import TextMessage from '@/pages/Chat/components/MessageBubble/TextMessage'
import { useMemo, useRef } from 'react'

type MessageBubbleProps = {
    message: Message
    isLastMessage: boolean // shown if message is the latest only for a sender
    lastMessageType: ChatMessageTypes | null
    nextMessageType: ChatMessageTypes | null
    handleDeleteMessage: (messageId: string) => void
}
export default function MessageBubble({
    message,
    isLastMessage,
    lastMessageType,
    nextMessageType,
    handleDeleteMessage
}: MessageBubbleProps) {
    const { user } = useAuth()
    const isSelf = message.userId === user.uid
    const messageRef = useRef<HTMLDivElement>(null)

    const isAvatarShown = useMemo(() => isLastMessage && !isSelf, [isLastMessage, isSelf])

    return (
        <div
            className={cn('mb-1 flex gap-3', isSelf && 'flex-row-reverse', isLastMessage && 'mb-2')}
        >
            <div
                id="messagebubble_metadata"
                className={cn('flex w-10 flex-col justify-end', isSelf && 'w-0')}
            >
                {isAvatarShown && (
                    <MessageAvatar userId={message.userId} className="aspect-square w-10" />
                )}
            </div>
            <div id="messagebubble_content" className="min-h-[2.5rem]">
                {message.type === 'text' && (
                    <TextMessage message={message.message} isSelf={isSelf} className="" />
                )}
                {message.type === 'image' && (
                    <ImageMessage
                        imageUrls={message.message.split(';')}
                        isSelf={isSelf}
                        className="my-1"
                    />
                )}
                {message.type === 'deleted' && <div>DELETED</div>}
            </div>
        </div>
    )
}
