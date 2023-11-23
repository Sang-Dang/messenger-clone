import { Message } from '@/classes/Message'
import { cn } from '@/lib/utils'
import MessageBubble from '@/pages/Chat/components/common/MessageBubble'
import { MessageSquare } from 'lucide-react'

type MessagesViewContainerProps = {
    messages: Message[]
    className?: string
}

export default function MessagesViewContainer({ messages, className }: MessagesViewContainerProps) {
    return (
        <div className={cn('flex flex-col justify-end', className)}>
            {messages.length === 0 ? (
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <MessageSquare size={100} />
                    <h5 className="mt-3 text-2xl font-bold">No messages yet.</h5>
                    <p className="mt-1 font-light">Type your first message in the input box below.</p>
                </div>
            ) : (
                messages.map((data) => <MessageBubble data={data} key={data.id} />)
            )}
        </div>
    )
}
