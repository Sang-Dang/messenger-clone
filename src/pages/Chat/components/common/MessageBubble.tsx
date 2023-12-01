import { Message } from '@/classes/Message'
import { User } from '@/classes/User'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'
import useAuth from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'

type Props = {
    data: Message
    showAvatar?: boolean
    sender: User
}
export default function MessageBubble({ data, sender, showAvatar = true }: Props) {
    const { user } = useAuth()
    const isMe = sender.id === user.uid
    const isAvatarShown = showAvatar && !isMe
    const hasOnlyEmojis = onlyEmojis(data.message)

    function onlyEmojis(string: string) {
        return [...string].every((char) => /[\p{Emoji}]/u.test(char))
    }

    return (
        <div className={cn('flex items-end gap-3', isMe && 'flex-row-reverse', !isAvatarShown && 'mb-[2px]', isAvatarShown && 'mb-3')}>
            {isAvatarShown && (
                <Avatar className="aspect-square h-full w-[40px]">
                    <AvatarImage src={sender.avatar} alt="avatar" className="h-full w-full" />
                    <AvatarFallback>{sender.name}</AvatarFallback>
                </Avatar>
            )}
            <div
                className={cn(
                    'inline-flex w-max max-w-[500px] items-center rounded-2xl p-3 font-[400]',
                    !isAvatarShown && 'ml-[52px]',
                    isMe && 'mr-[10px]',
                    !hasOnlyEmojis && 'bg-blue-500',
                    hasOnlyEmojis && 'p-0 py-6 text-5xl'
                )}
            >
                <pre className="w-full hyphens-auto whitespace-pre-wrap break-words font-sans text-white">{data.message}</pre>
            </div>
        </div>
    )
}
