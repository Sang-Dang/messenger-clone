import { Chat } from '@/classes/Chat'
import { Message } from '@/classes/Message'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui'
import { SelectChatId } from '@/features/Messages/MessagesSelectors'
import { selectChatId } from '@/features/Messages/MessagesSlice'
import { selectUserById } from '@/features/Users/UsersSelectors'
import { storage } from '@/firebase'
import useAppDispatch from '@/lib/hooks/useAppDispatch'
import useAppSelector from '@/lib/hooks/useAppSelector'
import useAuth from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'
import { getDownloadURL, ref } from 'firebase/storage'
import { Ban, Blocks, MoreHorizontal, User } from 'lucide-react'
import { memo, useEffect, useMemo, useState } from 'react'

type Props = {
    chat: Chat
}

const ChatCard = ({ chat }: Props) => {
    const { user } = useAuth()
    const recipientId = useMemo(
        () => chat.users.filter((cur) => cur !== user.uid)[0],
        [chat.users, user.uid]
    )
    const recipient = useAppSelector(selectUserById(recipientId)) // select first person besides self

    if (chat.users.length <= 2 && recipient) {
        chat.avatar = recipient.avatar
        chat.chatName = recipient.name
    }

    const memoId = useMemo(() => chat.id, [chat.id])
    const memoChatName = useMemo(() => chat.chatName, [chat.chatName])
    const memoAvatar = useMemo(() => chat.avatar, [chat.avatar])
    const memoLastMessage = useMemo(() => chat.lastMessage, [chat.lastMessage])

    return (
        <ChatCardView
            id={memoId}
            chatName={memoChatName}
            avatar={memoAvatar}
            lastMessage={memoLastMessage}
        />
    )
}

type ChatCardViewProps = {
    id: string
    chatName: string
    avatar: string
    lastMessage: Message | null
}
const ChatCardView = memo(({ id, chatName, avatar, lastMessage }: ChatCardViewProps) => {
    const dispatch = useAppDispatch()
    const selectedChatCard = useAppSelector(SelectChatId)
    function handleChangeChat() {
        dispatch(selectChatId(id))
    }

    return (
        <div className="group relative w-full">
            <ChatOptionsView className="peer pointer-events-none invisible absolute right-5 top-1/2 -translate-y-1/2 opacity-0 transition-all group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100" />
            <div
                id="chatcard"
                className={cn(
                    'group flex h-[80px] w-full cursor-pointer select-none items-center gap-5 rounded-2xl p-[10px] transition-all hover:bg-neutral-200 peer-hover:bg-neutral-200',
                    selectedChatCard === id && 'bg-neutral-200'
                )}
                onClick={handleChangeChat}
            >
                <ChatAvatarView
                    avatar={avatar}
                    fallback={chatName.slice(0, 2)}
                    className="h-[50px] w-[50px] rounded-full"
                />
                <div className="flex flex-col items-start justify-center">
                    <TitleView chatName={chatName} className="text-h6 font-semibold" />
                    <p className="w-48 overflow-hidden overflow-ellipsis whitespace-nowrap text-small font-normal tracking-wide">
                        {lastMessage !== null ? (
                            <LastMessageView lastMessage={lastMessage} />
                        ) : (
                            'There are no messages'
                        )}
                    </p>
                </div>
            </div>
        </div>
    )
})

// ------------------------------
type TitleViewProps = {
    chatName: string
    className?: string
}
const TitleView = memo(({ chatName, className }: TitleViewProps) => {
    return (
        <h5 className={cn('w-52 overflow-hidden text-ellipsis whitespace-nowrap', className)}>
            {chatName}
        </h5>
    )
})

// ------------------------------
type LastMessageViewProps = {
    lastMessage: Message
}
const LastMessageView = memo(({ lastMessage }: LastMessageViewProps) => {
    const { user } = useAuth()
    const sender = useAppSelector(selectUserById(lastMessage.userId))
    return (
        sender &&
        (sender.id === user.uid ? 'You' : sender.name) +
            ': ' +
            (lastMessage.message.length > 30
                ? lastMessage.message.slice(0, 30) + '...'
                : lastMessage.message)
    )
})

// ------------------------------
type ChatAvatarViewProps = {
    className?: string
    avatar: string
    fallback: string
}
const ChatAvatarView = memo(({ className, avatar, fallback }: ChatAvatarViewProps) => {
    const [avatarObj, setAvatarObj] = useState<string | undefined>()

    useEffect(() => {
        if (avatar.startsWith('chatAvatars/')) {
            const storageRef = ref(storage, avatar)
            getDownloadURL(storageRef)
                .then((url) => {
                    setAvatarObj(url)
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            setAvatarObj(avatar)
        }
    }, [avatar])

    return (
        <Avatar className={cn(className)}>
            <AvatarImage src={avatarObj} alt="avatar" className="h-[50px] w-[50px]" />
            <AvatarFallback className="h-[50px] w-[50px] text-neutral-900 ">
                {fallback}
            </AvatarFallback>
        </Avatar>
    )
})

// ------------------------------
type ChatOptionsViewProps = {
    className?: string
}
const ChatOptionsView = memo(({ className }: ChatOptionsViewProps) => {
    return (
        <div className={cn(className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="rounded-full bg-white p-2 shadow-lg" id="chatcard_more_btn">
                        <MoreHorizontal size={25} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <User /> View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Ban /> Block
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Blocks /> Report
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
})

export default ChatCard
