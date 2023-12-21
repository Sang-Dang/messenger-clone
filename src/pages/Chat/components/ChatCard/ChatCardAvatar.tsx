import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'
import { cn } from '@/lib/utils'
import { memo } from 'react'

type ChatCardAvatarProps = {
    className?: string
    avatar: string
    fallback: string
}
const ChatCardAvatar = memo(({ className, avatar, fallback }: ChatCardAvatarProps) => {
    return (
        <Avatar className={cn(className)}>
            <AvatarImage src={avatar} alt="avatar" className="size-[50px]" />
            <AvatarFallback className="h-[50px] w-[50px] text-neutral-900 ">
                {fallback}
            </AvatarFallback>
        </Avatar>
    )
})

export default ChatCardAvatar
