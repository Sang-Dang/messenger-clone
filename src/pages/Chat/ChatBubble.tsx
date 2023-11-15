import { Avatar, AvatarImage } from '@/components/ui'
import { cn } from '@/lib/utils'
import { AvatarFallback } from '@radix-ui/react-avatar'
import React from 'react'

type Props = {
    variant: 'sender' | 'receiver'
    content: string
    avatar: string
}

export default function ChatBubble({ variant, avatar, content }: Props) {
    return (
        <div className="flex w-full items-center gap-3">
            {variant === 'receiver' && (
                <Avatar>
                    <AvatarImage src={avatar} alt="avatar" />
                    <AvatarFallback>AV</AvatarFallback>
                </Avatar>
            )}
            <div className={cn('w-max max-w-[500px] break-words rounded-lg bg-blue-500 p-3 px-6 text-white', variant == 'sender' && 'ml-auto')}>
                {content}
            </div>
            {variant === 'sender' && (
                <Avatar>
                    <AvatarImage src={avatar} alt="avatar" />
                    <AvatarFallback>AV</AvatarFallback>
                </Avatar>
            )}
        </div>
    )
}
