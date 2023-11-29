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

    return (
        <div className={cn('flex items-center gap-3', isMe && 'flex-row-reverse', !isAvatarShown && 'mb-[2px]', isAvatarShown && 'mb-3')}>
            {isAvatarShown && (
                <Avatar className="aspect-square h-full w-[40px]">
                    <AvatarImage src={sender.avatar} alt="avatar" className="h-full w-full" />
                    <AvatarFallback>{sender.name}</AvatarFallback>
                </Avatar>
            )}
            <div
                className={cn(
                    'inline-flex w-max items-center rounded-lg bg-blue-500 p-3 font-[500] text-white',
                    !isAvatarShown && 'ml-[52px]',
                    isMe && 'mr-[10px]'
                )}
            >
                {data.message}
            </div>
        </div>
    )
}
