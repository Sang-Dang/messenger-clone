import { cn, onlyEmojis } from '@/lib/utils'
import { useRef } from 'react'

type TextMessageProps = {
    message: string
    isSelf: boolean
    className?: string
}

export default function TextMessage({ message, isSelf, className }: TextMessageProps) {
    const hasOnlyEmojis = onlyEmojis(message)
    const messageRef = useRef<HTMLDivElement>(null)

    if (hasOnlyEmojis) {
        return (
            <div className={cn('-translate-x-2 text-5xl', isSelf && 'translate-x-2', className)}>
                {message}
            </div>
        )
    }

    return (
        <div
            ref={messageRef}
            className={cn(
                'w-max max-w-message whitespace-pre-wrap break-words rounded-2xl bg-slate-500 p-3 text-left text-medium text-white',
                // isMultiline && 'rounded-2xl',
                isSelf && 'bg-blue-500',
                className
            )}
        >
            {message}
        </div>
    )
}
