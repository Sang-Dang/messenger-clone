import { Message } from '@/classes/Message'
import ReplyBasic from '@/classes/ReplyBasic'
import { User } from '@/classes/User'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'
import useAppSelector from '@/lib/hooks/useAppSelector'
import useAuth from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'
import useReply from '@/pages/Chat/hooks/useResponse'
import { Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { AnimatePresence, motion } from 'framer-motion'
import { MoreVertical, Reply, ReplyIcon, Smile } from 'lucide-react'
import { useState } from 'react'

type Props = {
    data: Message
    showAvatar?: boolean
    sender: User
}
export default function MessageBubble({ data, sender, showAvatar = true }: Props) {
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
                        className={cn('relative z-10 mt-3 flex translate-y-1 flex-col items-start', isMe && 'items-end text-right')}
                    />
                )}
                <div
                    className={cn(
                        'relative z-20 inline-flex w-max max-w-[500px] items-center rounded-2xl p-3 font-[400]',
                        !hasOnlyEmojis && 'bg-blue-500',
                        hasOnlyEmojis && 'p-0 pb-2 text-5xl'
                    )}
                >
                    <pre className="relative z-20 w-full hyphens-auto whitespace-pre-wrap break-words font-sans text-white">{data.message}</pre>
                    <MessageOptions isHovered={isHovered} isMe={isMe} data={data} sender={sender} />
                </div>
            </div>
        </div>
    )
}

type MessageOptionsProps = {
    isHovered: boolean
    isMe: boolean
    data: Message
    sender: User
}
function MessageOptions({ isHovered, isMe, data, sender }: MessageOptionsProps) {
    const { setReply } = useReply()

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
                    className={cn('absolute flex gap-1', isMe ? 'right-full mr-3 flex-row-reverse' : 'left-full ml-3')}
                >
                    <Button
                        variant="solid"
                        isIconOnly
                        color="secondary"
                        className="grid aspect-square h-8 w-8 min-w-0 place-items-center p-0"
                        disableRipple
                    >
                        <Smile size={16} />
                    </Button>
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
                            <Button type="button" variant="ghost" color="danger">
                                Remove
                            </Button>
                        </PopoverContent>
                    </Popover>
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
        <div className={cn(className)}>
            <div className="text-xs font-light text-blur">
                <ReplyIcon className="mr-2 inline" size={12} />
                You replied to <strong className="">{username}</strong>
            </div>
            <div className="w-max rounded-full bg-neutral-200/50 px-3 py-1 text-[13px] text-blur">{repliedTo.message}</div>
        </div>
    )
}
