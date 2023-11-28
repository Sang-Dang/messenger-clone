import { Chat } from '@/classes/Chat'
import { Avatar, AvatarFallback, AvatarImage, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui'
import { setChatId } from '@/features/Conversation/ConversationSlice'
import useAppDispatch from '@/lib/hooks/useAppDispatch'
import useAppSelector from '@/lib/hooks/useAppSelector'
import useAuth from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'
import { MoreHorizontal } from 'lucide-react'

type Props = {
    chat: Chat
}

export default function ChatCard({ chat }: Props) {
    const { user } = useAuth()
    const status = useAppSelector((state) => state.users.status)
    const recipient = useAppSelector((state) => state.users.users[chat.users.filter((cur) => cur !== user.uid)[0]]) // select first person besides self

    if (status === 'loading') {
        return <div>Loading...</div>
    }

    if (chat.users.length <= 2 && recipient) {
        chat.avatar = recipient.avatar
        chat.chatName = recipient.name
    }

    return <ChatCardView chat={chat} />
}

type ChatCardViewProps = {
    chat: Chat
}
function ChatCardView({ chat }: ChatCardViewProps) {
    const dispatch = useAppDispatch()
    const selectedChatCard = useAppSelector((state) => state.conversation.value.chatId)
    function handleChangeChat() {
        dispatch(
            setChatId({
                chatId: chat.id
            })
        )
    }
    return (
        <div className="group relative">
            <div className="peer pointer-events-none invisible absolute right-5 top-1/2 -translate-y-1/2 opacity-0 transition-all group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="rounded-full bg-white p-2 shadow-lg" id="chatcard_more_btn">
                            <MoreHorizontal size={25} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Hi</DropdownMenuItem>
                        <DropdownMenuItem>Hi</DropdownMenuItem>
                        <DropdownMenuItem>Hi</DropdownMenuItem>
                        <DropdownMenuItem>Hi</DropdownMenuItem>
                        <DropdownMenuItem>Hi</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div
                id="chatcard"
                className={cn(
                    'group flex h-[80px] cursor-pointer select-none gap-5 rounded-lg p-[10px] transition-all hover:bg-neutral-200 peer-hover:bg-neutral-200',
                    selectedChatCard === chat.id && 'bg-neutral-200'
                )}
                onClick={handleChangeChat}
            >
                <Avatar className="h-[60px] w-[60px] rounded-full">
                    <AvatarImage src={chat.avatar} alt="avatar" className="h-[60px] w-[60px]" />
                    <AvatarFallback className="h-[60px] w-[60px] text-neutral-900 ">{chat.chatName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-center">
                    <h5 className="text-lg font-semibold">{chat.chatName}</h5>
                    <p>{chat.lastMessage ? chat.lastMessage : 'There are no messages.'}</p>
                </div>
            </div>
        </div>
    )
}
