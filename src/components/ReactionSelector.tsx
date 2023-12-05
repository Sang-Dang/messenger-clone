import { Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { ReactNode, useState } from 'react'

type ReactionSelectorProps = {
    children: ReactNode
    handleSelectReaction: (reaction: string) => void
}

export default function ReactionSelector({ children, handleSelectReaction }: ReactionSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)

    function handleSelectReactionWrapper(reaction: string) {
        handleSelectReaction(reaction)
        setIsOpen(false)
    }

    return (
        <Popover placement="top" isOpen={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger>{children}</PopoverTrigger>
            <PopoverContent className="flex flex-row gap-1 p-2">
                <Button
                    isIconOnly
                    onClick={() => handleSelectReactionWrapper('👍')}
                    className="border-none bg-transparent text-3xl hover:bg-transparent"
                    variant="ghost"
                >
                    👍
                </Button>
                <Button
                    isIconOnly
                    onClick={() => handleSelectReactionWrapper('❤️')}
                    className="border-none bg-transparent text-3xl hover:bg-transparent"
                    variant="ghost"
                >
                    ❤️
                </Button>
                <Button
                    isIconOnly
                    onClick={() => handleSelectReactionWrapper('😂')}
                    className="border-none bg-transparent text-3xl hover:bg-transparent"
                    variant="ghost"
                >
                    😂
                </Button>
                <Button
                    isIconOnly
                    onClick={() => handleSelectReactionWrapper('😡')}
                    className="border-none bg-transparent text-3xl hover:bg-transparent"
                    variant="ghost"
                >
                    😡
                </Button>
                <Button
                    isIconOnly
                    onClick={() => handleSelectReactionWrapper('😮')}
                    className="border-none bg-transparent text-3xl hover:bg-transparent"
                    variant="ghost"
                >
                    😮
                </Button>
                <Button
                    isIconOnly
                    onClick={() => handleSelectReactionWrapper('😭')}
                    className="border-none bg-transparent text-3xl hover:bg-transparent"
                    variant="ghost"
                >
                    😭
                </Button>
            </PopoverContent>
        </Popover>
    )
}
