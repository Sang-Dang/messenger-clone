import { cn } from '@/lib/utils'
import { Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { ReactNode, useEffect, useState } from 'react'

type ReactionSelectorProps = {
    children: ReactNode
    handleSelectReaction: (reaction: string) => void
    currentReaction?: string
}

export default function ReactionSelector({
    children,
    handleSelectReaction,
    currentReaction
}: ReactionSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)

    function handleSelectReactionWrapper(reaction: string) {
        handleSelectReaction(reaction)
        setIsOpen(false)
    }

    useEffect(() => {}, [currentReaction])

    return (
        <Popover placement="top" isOpen={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger>{children}</PopoverTrigger>
            <PopoverContent className="flex flex-row gap-1 p-2">
                <Button
                    isIconOnly
                    onClick={() => handleSelectReactionWrapper('👍')}
                    className={cn(
                        'border-none bg-transparent text-2xl transition-all hover:bg-transparent hover:text-3xl',
                        currentReaction === '👍' && 'bg-neutral-200 text-3xl'
                    )}
                    variant={currentReaction === '👍' ? 'solid' : 'ghost'}
                >
                    👍
                </Button>
                <Button
                    isIconOnly
                    onClick={() => handleSelectReactionWrapper('❤️')}
                    className={cn(
                        'border-none bg-transparent text-2xl transition-all hover:bg-transparent hover:text-3xl',
                        currentReaction === '❤️' && 'bg-neutral-200 text-3xl'
                    )}
                    variant={currentReaction === '❤️' ? 'solid' : 'ghost'}
                >
                    ❤️
                </Button>
                <Button
                    isIconOnly
                    onClick={() => handleSelectReactionWrapper('😂')}
                    className={cn(
                        'border-none bg-transparent text-2xl transition-all hover:bg-transparent hover:text-3xl',
                        currentReaction === '😂' && 'bg-neutral-200 text-3xl'
                    )}
                    variant={currentReaction === '😂' ? 'solid' : 'ghost'}
                >
                    😂
                </Button>
                <Button
                    isIconOnly
                    onClick={() => handleSelectReactionWrapper('😡')}
                    className={cn(
                        'border-none bg-transparent text-2xl transition-all hover:bg-transparent hover:text-3xl',
                        currentReaction === '😡' && 'bg-neutral-200 text-3xl'
                    )}
                    variant={currentReaction === '😡' ? 'solid' : 'ghost'}
                >
                    😡
                </Button>
                <Button
                    isIconOnly
                    onClick={() => handleSelectReactionWrapper('😮')}
                    className={cn(
                        'border-none bg-transparent text-2xl transition-all hover:bg-transparent hover:text-3xl',
                        currentReaction === '😮' && 'bg-neutral-200 text-3xl'
                    )}
                    variant={currentReaction === '😮' ? 'solid' : 'ghost'}
                >
                    😮
                </Button>
                <Button
                    isIconOnly
                    onClick={() => handleSelectReactionWrapper('😭')}
                    className={cn(
                        'border-none bg-transparent text-2xl transition-all hover:bg-transparent hover:text-3xl',
                        currentReaction === '😭' && 'bg-neutral-200 text-3xl'
                    )}
                    variant={currentReaction === '😭' ? 'solid' : 'ghost'}
                >
                    😭
                </Button>
            </PopoverContent>
        </Popover>
    )
}
