import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui'
import Picker from '@emoji-mart/react'
import { ReactNode } from 'react'

type EmojiSelectorProps = {
    children: ReactNode
    onSelect?: (emoji: string) => void
}

export default function EmojiSelector({ children, onSelect = () => {} }: EmojiSelectorProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent className="border-none bg-transparent p-0">
                <Picker
                    data={async () => {
                        const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data')

                        return response.json()
                    }}
                    onEmojiSelect={(e: any) => onSelect(e.native)}
                    noCountryFlags={false}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
