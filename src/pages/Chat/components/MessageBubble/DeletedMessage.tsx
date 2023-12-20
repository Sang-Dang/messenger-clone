import { cn } from '@/lib/utils'
import { memo } from 'react'

type DeletedMessageProps = {
    className?: string
}

const DeletedMessage = memo(({ className }: DeletedMessageProps) => {
    return (
        <div
            className={cn(
                'relative z-20 inline-flex w-max max-w-[500px] items-center rounded-2xl border-2 border-neutral-300 bg-transparent p-3 font-[400]',
                className
            )}
        >
            <pre className="relative z-20 w-full hyphens-auto whitespace-pre-wrap break-words font-sans text-neutral-500">
                This message was deleted.
            </pre>
        </div>
    )
})

export default DeletedMessage
