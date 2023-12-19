import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui'
import { cn } from '@/lib/utils'
import { Ban, Blocks, MoreHorizontal, User } from 'lucide-react'
import { memo } from 'react'

type ChatCardOptionsProps = {
    className?: string
}
const ChatCardOptions = memo(({ className }: ChatCardOptionsProps) => {
    return (
        <div className={cn(className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="rounded-full bg-white p-2 shadow-lg" id="chatcard_more_btn">
                        <MoreHorizontal size={25} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <User /> View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Ban /> Block
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Blocks /> Report
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
})

export default ChatCardOptions
