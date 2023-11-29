import { Chat } from '@/classes/Chat'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'
import useAppSelector from '@/lib/hooks/useAppSelector'
import useAuth from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'
import { formatDistance } from 'date-fns'
import { memo, useMemo } from 'react'
import { Helmet } from 'react-helmet'

type ChatHeaderProps = {
    chat: Chat
    className?: string
}
export default function ChatHeader({ chat, className }: ChatHeaderProps) {
    const { user } = useAuth()
    const usersCache = useAppSelector((state) => state.users.users)

    const recipient = usersCache[chat.users.filter((cur) => cur !== user.uid)[0]]
    if (chat.users.length <= 2 && recipient) {
        chat.avatar = recipient.avatar
        chat.chatName = recipient.name
    }

    // TODO - fix activity
    const recipientActivity = formatDistance(new Date(), new Date(recipient.lastLogin), {
        addSuffix: false,
        includeSeconds: false
    }).split(' ')

    return <ChatHeaderMemo chat={chat} recipientActivity={recipientActivity} className={className} lastLogin={recipient.lastLogin} />
}

type ChatHeaderMemoProps = {
    chat: Chat
    className?: string
    recipientActivity: string[]
    lastLogin: string
}
function ChatHeaderMemo({ chat, className, recipientActivity, lastLogin }: ChatHeaderMemoProps) {
    const avatarMemo = useMemo(() => {
        return chat.avatar
    }, [chat.avatar])
    const chatNameMemo = useMemo(() => {
        return chat.chatName
    }, [chat.chatName])
    const recipientActivityMemo = useMemo(() => {
        return recipientActivity
        // if last login changes, update the memo
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastLogin])

    return <ChatHeaderView avatar={avatarMemo} chatName={chatNameMemo} recipientActivity={recipientActivityMemo} className={className} />
}

type ChatHeaderViewProps = {
    avatar: string
    chatName: string
    recipientActivity: string[]
    className?: string
}
const ChatHeaderView = memo(({ avatar, chatName, recipientActivity, className }: ChatHeaderViewProps) => {
    return (
        <>
            <Helmet>
                <title>{chatName} | Chunt</title>
            </Helmet>
            <header className={cn('flex w-full items-center gap-5 bg-neutral-200/70 px-[30px] py-[10px]', className)}>
                <Avatar className="h-[45px] w-[45px]">
                    <AvatarImage src={avatar} alt="avatar" />
                    <AvatarFallback>{chatName.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-xl font-semibold">{chatName}</h1>
                    <p className="text-xs font-light">
                        {Number(recipientActivity[0]) < 2 && recipientActivity[1] === 'minutes'
                            ? 'Active'
                            : 'Active ' + recipientActivity.join(' ') + ' ago'}
                    </p>
                </div>
            </header>
        </>
    )
})
