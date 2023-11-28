import { Chat } from '@/classes/Chat'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'
import useAppSelector from '@/lib/hooks/useAppSelector'
import useAuth from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'

type Props = {
    chat: Chat
    className?: string
}

export default function ChatHeader({ chat, className }: Props) {
    const { user } = useAuth()
    const usersCache = useAppSelector((state) => state.users)
    if (usersCache.status === 'loading') {
        return null
    }
    const recipient = usersCache.users[chat?.users.filter((cur) => cur !== user.uid)[0]]
    if (chat.users.length <= 2 && recipient) {
        chat.avatar = recipient.avatar
        chat.chatName = recipient.name
    }

    return (
        <header className={cn('flex w-full items-center gap-5 bg-neutral-200/70 px-[30px] py-[10px]', className)}>
            <Avatar className="h-[50px] w-[50px]">
                <AvatarImage src={chat.avatar} alt="avatar" />
                <AvatarFallback>{chat.chatName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-semibold">{chat.chatName}</h1>
        </header>
    )
}
