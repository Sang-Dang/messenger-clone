import { selectChatById } from '@/features/Chat/ChatSelectors'
import useAppSelector from '@/lib/hooks/useAppSelector'
import { Avatar } from '@nextui-org/react'
import format from 'date-fns/format'

type Props = {
    chatId: string
}

export default function ChatInfobarHeader({ chatId }: Props) {
    const currentChat = useAppSelector(selectChatById(chatId))

    return (
        <div className="text-center">
            <Avatar src={currentChat.avatar} isBordered className="mx-auto mb-3 h-20 w-20" />
            <h1 className="text-xl font-semibold">{currentChat.chatName}</h1>
            <p className="mt-1 text-sm">
                Since {format(currentChat.createdOn.toDate(), 'dd/MM/yyyy')}
            </p>
        </div>
    )
}
