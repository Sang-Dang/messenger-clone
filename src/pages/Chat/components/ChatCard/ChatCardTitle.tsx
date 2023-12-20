import { cn } from '@/lib/utils'
import { memo } from 'react'

type ChatCardTitleProps = {
    chatName: string
    className?: string
}
const ChatCardTitle = memo(({ chatName, className }: ChatCardTitleProps) => {
    return (
        <h5 className={cn('w-52 overflow-hidden text-ellipsis whitespace-nowrap', className)}>
            {chatName}
        </h5>
    )
})

export default ChatCardTitle
