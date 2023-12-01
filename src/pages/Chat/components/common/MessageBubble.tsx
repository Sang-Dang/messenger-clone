import { Message } from '@/classes/Message'
import { User } from '@/classes/User'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'
import useAuth from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'
import useResponse from '@/pages/Chat/hooks/useResponse'
import { Button } from '@nextui-org/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Reply, Smile } from 'lucide-react'
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
    const { setResponse } = useResponse()

    function onlyEmojis(string: string) {
        return [...string].every((char) => /[\p{Emoji}]/u.test(char))
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
            <div
                className={cn(
                    'relative inline-flex w-max max-w-[500px] items-center rounded-2xl p-3 font-[400]',
                    !isAvatarShown && 'ml-[52px]',
                    isMe && 'mr-[10px]',
                    !hasOnlyEmojis && 'bg-blue-500',
                    hasOnlyEmojis && 'p-0 py-6 text-5xl'
                )}
            >
                <pre className="w-full hyphens-auto whitespace-pre-wrap break-words font-sans text-white">{data.message}</pre>
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
                            <Button variant="solid" isIconOnly color="secondary" className="w-max p-0" disableRipple>
                                <Smile size={16} />
                            </Button>
                            <Button
                                variant="solid"
                                color="secondary"
                                isIconOnly
                                disableRipple
                                className="w-max p-0"
                                onClick={() =>
                                    setResponse({
                                        message: data.message,
                                        name: sender.name,
                                        userId: sender.id,
                                        type: data.type
                                    })
                                }
                            >
                                <Reply size={16} />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
