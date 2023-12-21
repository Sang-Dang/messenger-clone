import { Chat } from '@/classes/Chat'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'
import { SelectChatInfobarOpenState } from '@/features/Conversation.ts/ConversationSelectors'
import { toggleChatInfobar } from '@/features/Conversation.ts/ConversationSlice'
import { rtdb } from '@/firebase'
import useAppSelector from '@/lib/hooks/useAppSelector'
import useAuth from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Button, Tooltip } from '@nextui-org/react'
import formatDistance from 'date-fns/formatDistance'
import { ref } from 'firebase/database'
import { LucideMoreVertical, MoreHorizontal } from 'lucide-react'
import { useListVals } from 'react-firebase-hooks/database'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'

type ChatHeaderProps = {
    chat: Chat
    className?: string
}
export default function ChatHeader({ chat, className }: ChatHeaderProps) {
    const { user } = useAuth()
    const usersCache = useAppSelector((state) => state.users.users)
    const recipientsId = chat.users.filter((cur) => cur !== user.uid)
    const recipients = Object.entries(usersCache)
        .filter(([key]) => recipientsId.includes(key))
        .map(([, value]) => value)
    const dispatch = useDispatch()
    const chatInfobarOpen = useAppSelector(SelectChatInfobarOpenState)

    const [values] = useListVals(
        recipients.length === 1 ? ref(rtdb, `users/${recipients[0].id}`) : undefined,
        {}
    )
    const isNew =
        values && new Date(values[1] as unknown as string) > new Date(Date.now() - 5 * 60 * 1000)

    function handleToggleChatSidebar() {
        dispatch(toggleChatInfobar())
    }

    return (
        <>
            <Helmet>
                <title>{chat.chatName} | Chunt</title>
            </Helmet>
            <header
                className={cn(
                    'flex w-full items-center gap-5 border-b-1 border-b-neutral-300 bg-white px-[30px] py-[10px]',
                    className
                )}
            >
                <div className="relative">
                    <Avatar className="h-[45px] w-[45px]">
                        <AvatarImage src={chat.avatar} alt="avatar" />
                        <AvatarFallback>{chat.chatName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    {isNew && (
                        <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
                    )}
                </div>
                <div className="flex-grow">
                    <h1 className="text-xl font-semibold">{chat.chatName}</h1>
                    {recipients.length !== 1 ? (
                        <p className="text-sm text-neutral-400">
                            {recipients.slice(0, 3).map((cur, index) => (
                                <span key={cur.id}>
                                    {cur.name}
                                    {index !== recipients.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </p>
                    ) : (
                        values && (
                            <p className="text-light text-sm">
                                {isNew
                                    ? 'Active now'
                                    : values && values[1]
                                      ? `Active ${formatDistance(
                                            new Date(),
                                            new Date(values[1] as unknown as string)
                                        )} ago`
                                      : 'Offline'}
                            </p>
                        )
                    )}
                </div>
                <Tooltip content="Conversation Details" placement="bottom">
                    <Button
                        isIconOnly
                        variant="flat"
                        className="bg-transparent"
                        onClick={handleToggleChatSidebar}
                    >
                        {chatInfobarOpen ? <MoreHorizontal /> : <LucideMoreVertical />}
                    </Button>
                </Tooltip>
            </header>
        </>
    )
}
