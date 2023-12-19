import { Message } from '@/classes/Message'
import { selectUserById } from '@/features/Users/UsersSelectors'
import useAppSelector from '@/lib/hooks/useAppSelector'
import useAuth from '@/lib/hooks/useAuth'
import { memo } from 'react'

type ChatCardLastMessageProps = {
    lastMessage: Message
}
const ChatCardLastMessage = memo(({ lastMessage }: ChatCardLastMessageProps) => {
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

export default ChatCardLastMessage
