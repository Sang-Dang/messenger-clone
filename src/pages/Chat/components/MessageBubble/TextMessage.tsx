import { cn, onlyEmojis } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

type TextMessageProps = {
    message: string
    isSelf: boolean
    className?: string
}

export default function TextMessage({ message, isSelf, className }: TextMessageProps) {
    const hasOnlyEmojis = onlyEmojis(message)
    const messageRef = useRef<HTMLDivElement>(null)
    const [isMultiline, setIsMultiline] = useState<boolean>(false)

    useEffect(() => {
        const currentRef = messageRef.current
        if (currentRef) {
            console.log(currentRef.clientHeight, currentRef.clientWidth)
            if (currentRef.clientHeight < 50 && currentRef.clientWidth < 630) {
                setIsMultiline(false)
            } else {
                setIsMultiline(true)
            }
        }
    }, [])

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
                'max-w-message whitespace-pre-wrap break-words rounded-full bg-slate-500 p-3 text-left text-medium text-white',
                isSelf && 'bg-blue-500',
                isMultiline && 'rounded-2xl',
                className
            )}
        >
            {message}
        </div>
    )
}
