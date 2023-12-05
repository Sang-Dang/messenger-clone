import { ToggleReaction } from '@/api/messages/ToggleReaction'
import { Message } from '@/classes/Message'
import ReplyBasic from '@/classes/ReplyBasic'
import { User } from '@/classes/User'
import ReactionSelector from '@/components/ReactionSelector'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'
import { SelectChatId } from '@/features/Messages/MessagesSelectors'
import { storage } from '@/firebase'
import useAppSelector from '@/lib/hooks/useAppSelector'
import useAuth from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'
import useReply from '@/pages/Chat/hooks/useResponse'
import { Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import format from 'date-fns/format'
import { ref } from 'firebase/storage'
import { AnimatePresence, motion } from 'framer-motion'
import { MoreVertical, Reply, ReplyIcon, Smile } from 'lucide-react'
import { useState } from 'react'
import { useDownloadURL } from 'react-firebase-hooks/storage'
import { ReactionsTag } from './ReactionsTag'

type Props = {
    data: Message
    showAvatar?: boolean
    sender: User
    handleDeleteMessage: (messageId: string) => void
}
export default function MessageBubble({ data, sender, showAvatar = true, handleDeleteMessage }: Props) {
    const { user } = useAuth()
    const [isHovered, setIsHovered] = useState(false)
    const isMe = sender.id === user.uid
    const isAvatarShown = showAvatar && !isMe
    const hasOnlyEmojis = onlyEmojis(data.message)

    function onlyEmojis(string: string) {
        return [...string].every((char) => /[\p{Emoji}]/u.test(char) && !/^\d$/.test(char))
    }

    return (
        <div
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn('flex items-end gap-3', isMe && 'flex-row-reverse', !isAvatarShown && 'mb-[2px]', isAvatarShown && 'mb-3')}
        >
            {isAvatarShown && (
                <Avatar className="aspect-square h-full w-[40px]">
                    <AvatarImage src={sender.avatar} alt="avatar" className="h-full w-full" />
                    <AvatarFallback>{sender.name}</AvatarFallback>
                </Avatar>
            )}
            <div className={cn('flex flex-col items-start', !isAvatarShown && 'ml-[52px]', isMe && 'ml-0 mr-[10px] items-end')}>
                {data.repliedTo && (
                    <ReplyCard
                        repliedTo={data.repliedTo!}
                        className={cn('relative z-10 mt-3 flex flex-col items-start', isMe && 'items-end text-right')}
                    />
                )}
                {data.type === 'deleted' && (
                    <div className="relative z-20 inline-flex w-max max-w-[500px] items-center rounded-2xl border-2 border-neutral-300 bg-transparent p-3 font-[400]">
                        <pre className="relative z-20 w-full hyphens-auto whitespace-pre-wrap break-words font-sans text-neutral-500">
                            This message was deleted.
                        </pre>
                    </div>
                )}
                {data.type === 'text' && (
                    <div
                        className={cn(
                            'relative z-20 inline-flex w-max max-w-[500px] items-center rounded-2xl p-3 font-[400]',
                            !hasOnlyEmojis && 'bg-blue-500',
                            hasOnlyEmojis && 'p-0 pb-2 text-5xl'
                        )}
                    >
                        <pre className="relative z-20 w-full hyphens-auto whitespace-pre-wrap break-words font-sans text-white">{data.message}</pre>

                        <MessageOptions isHovered={isHovered} isMe={isMe} data={data} sender={sender} handleDeleteMessage={handleDeleteMessage} />
                    </div>
                )}
                {data.type === 'image' && (
                    <ImageViewContainer isHovered={isHovered} isMe={isMe} data={data} sender={sender} handleDeleteMessage={handleDeleteMessage} />
                )}
                {data.reactions && Object.keys(data.reactions).length !== 0 && (
                    <ReactionsTag reactions={data.reactions} className={cn('relative z-30 -translate-y-1/4', isMe && 'text-right')} />
                )}
            </div>
        </div>
    )
}

type ImageViewContainerProps = {
    isHovered: boolean
    isMe: boolean
    data: Message
    sender: User
    handleDeleteMessage: (messageId: string) => void
}
function ImageViewContainer({ isHovered, isMe, data, sender, handleDeleteMessage }: ImageViewContainerProps) {
    const imageUrls = data.message.split(';')

    return (
        <div
            className={cn(
                'relative z-20',
                imageUrls.length === 1 && 'flex items-center',
                imageUrls.length === 2 && 'grid grid-cols-2 items-center gap-2',
                imageUrls.length > 2 && 'grid grid-cols-3 items-center gap-2'
            )}
        >
            {imageUrls.map((url) => (
                <ImageView key={url} src={url} />
            ))}
            <MessageOptions isHovered={isHovered} isMe={isMe} data={data} sender={sender} handleDeleteMessage={handleDeleteMessage} />
        </div>
    )
}

type ImageViewProps = {
    src: string
    className?: string
    loadingClassName?: string
}
function ImageView({ src, className, loadingClassName }: ImageViewProps) {
    const [downloadUrl, loading] = useDownloadURL(ref(storage, src))

    if (loading) return <div className={cn('aspect-square h-56 animate-pulse rounded-2xl bg-neutral-200/50 object-cover', loadingClassName)} />

    return <img src={downloadUrl} alt="" className={cn('aspect-square h-56 rounded-2xl object-cover', className)} />
}

type MessageOptionsProps = {
    isHovered: boolean
    isMe: boolean
    data: Message
    sender: User
    handleDeleteMessage: (messageId: string) => void
}
function MessageOptions({ isHovered, isMe, data, sender, handleDeleteMessage }: MessageOptionsProps) {
    const { setReply } = useReply()
    const { user } = useAuth()
    const chatId = useAppSelector(SelectChatId)

    function handleReaction(reaction: string) {
        if (chatId) {
            ToggleReaction(chatId, data.id, user.uid, reaction)
        }
    }

    return (
        <AnimatePresence>
            {isHovered && (
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.9
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.9
                    }}
                    className={cn('absolute flex items-center gap-1', isMe ? 'right-full mr-3 flex-row-reverse' : 'left-full ml-3')}
                >
                    <ReactionSelector handleSelectReaction={handleReaction}>
                        <Button
                            variant="solid"
                            isIconOnly
                            color="secondary"
                            className="grid aspect-square h-8 w-8 min-w-0 place-items-center p-0"
                            disableRipple
                        >
                            <Smile size={16} />
                        </Button>
                    </ReactionSelector>
                    <Button
                        variant="solid"
                        color="secondary"
                        isIconOnly
                        disableRipple
                        className="grid aspect-square h-8 w-8 min-w-0 place-items-center p-0"
                        onClick={() =>
                            setReply({
                                message: data.message,
                                username: sender.name,
                                userId: sender.id,
                                type: data.type,
                                id: data.id
                            })
                        }
                    >
                        <Reply size={16} />
                    </Button>
                    <Popover placement="top" showArrow>
                        <PopoverTrigger>
                            <Button
                                variant="solid"
                                isIconOnly
                                color="secondary"
                                className="grid aspect-square h-8 w-8 min-w-0 place-items-center p-0"
                                disableRipple
                            >
                                <MoreVertical size={16} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-2">
                            {isMe && (
                                <Button type="button" variant="ghost" color="danger" onClick={() => handleDeleteMessage(data.id)}>
                                    Remove
                                </Button>
                            )}
                        </PopoverContent>
                    </Popover>
                    <div className={cn('w-max text-xs font-light', isMe ? 'mr-3' : 'ml-3    ')}>
                        {format(new Date(data.createdOn), 'dd/MM/yyyy HH:mm:ss')}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

type ReplyCardProps = {
    className?: string
    repliedTo: ReplyBasic
}
function ReplyCard({ className, repliedTo }: ReplyCardProps) {
    const username = useAppSelector((state) => state.users.users[repliedTo.userId].name)
    return (
        <div className={cn('translate-y-1', className, repliedTo.type === 'image' && 'translate-y-1/4')}>
            <div className="text-xs font-light text-blur">
                <ReplyIcon className="mr-2 inline" size={12} />
                You replied to <strong className="">{username}</strong>
            </div>
            <div
                className={cn(
                    'w-max max-w-[500px] overflow-hidden text-ellipsis whitespace-nowrap rounded-3xl bg-neutral-200/50 px-3 py-1 text-[13px] text-blur',
                    repliedTo.type === 'image' && 'px-1 opacity-70'
                )}
            >
                {repliedTo.type === 'deleted' && 'This message was deleted.'}
                {repliedTo.type === 'image' && <ImageView src={repliedTo.message.split(';')[0]} className="h-20 w-20" />}
                {repliedTo.type === 'text' && repliedTo.message}
            </div>
        </div>
    )
}
