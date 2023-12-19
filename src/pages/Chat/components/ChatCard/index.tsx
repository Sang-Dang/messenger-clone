import { Chat } from '@/classes/Chat'
import { Message } from '@/classes/Message'
import { SelectChatId } from '@/features/Messages/MessagesSelectors'
import { selectChatId } from '@/features/Messages/MessagesSlice'
import { selectUserById } from '@/features/Users/UsersSelectors'
import useAppDispatch from '@/lib/hooks/useAppDispatch'
import useAppSelector from '@/lib/hooks/useAppSelector'
import useAuth from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'
import ChatCardAvatar from '@/pages/Chat/components/ChatCard/ChatCardAvatar'
import ChatCardLastMessage from '@/pages/Chat/components/ChatCard/ChatCardLastMessage'
import ChatCardOptions from '@/pages/Chat/components/ChatCard/ChatCardOptions'
import ChatCardTitle from '@/pages/Chat/components/ChatCard/ChatCardTitle'
import { useMemo } from 'react'

type ChatCardProps = {
    chat: Chat
}

const ChatCard = ({ chat }: ChatCardProps) => {
    console.log('RENDER')
    const { user } = useAuth()
    const dispatch = useAppDispatch()
    const selectedChatCard = useAppSelector(SelectChatId)
    function handleChangeChat() {
        dispatch(selectChatId(chat.id))
    }
    const recipientId = chat.users.filter((cur) => cur !== user.uid)[0]
    const recipient = useAppSelector(selectUserById(recipientId))
    if (chat.users.length === 2 && recipient) {
        chat.chatName = recipient.name
        chat.avatar = recipient.avatar
    }

    const lastMessage = useMemo(() => {
        return {
            ...chat.lastMessage,
            id: chat.lastMessage?.id ?? ''
        } as Message
    }, [chat.lastMessage])

    return (
        <div className="group relative w-full">
            <ChatCardOptions className="peer pointer-events-none invisible absolute right-5 top-1/2 -translate-y-1/2 opacity-0 transition-all group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100" />
            <div
                id="chatcard"
                className={cn(
                    'group flex h-[80px] w-full cursor-pointer select-none items-center gap-5 rounded-2xl p-[10px] transition-all hover:bg-neutral-200 peer-hover:bg-neutral-200',
                    selectedChatCard === chat.id && 'bg-neutral-200'
                )}
                onClick={handleChangeChat}
            >
                <ChatCardAvatar
                    avatar={chat.avatar}
                    fallback={chat.chatName.slice(0, 2)}
                    className="h-[50px] w-[50px] rounded-full"
                />
                <div className="flex flex-col items-start justify-center">
                    <ChatCardTitle chatName={chat.chatName} className="text-h6 font-semibold" />
                    <p className="w-48 overflow-hidden overflow-ellipsis whitespace-nowrap text-small font-normal tracking-wide">
                        {lastMessage !== null ? (
                            <ChatCardLastMessage lastMessage={lastMessage} />
                        ) : (
                            'There are no messages'
                        )}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ChatCard
