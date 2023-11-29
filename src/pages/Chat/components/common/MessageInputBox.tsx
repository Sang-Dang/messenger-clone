import { CreateMessage } from '@/api/messages'
import { Button, Input } from '@/components/ui'
import { auth } from '@/firebase'
import { cn } from '@/lib/utils'
import { Send } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

type MessageInputBoxType = {
    chatId: string
    className?: string
}
export default function MessageInputBox({ chatId, className }: MessageInputBoxType) {
    console.log('RENDER')
    const [user] = useAuthState(auth)
    const [messageInput, setMessageInput] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    const handleSubmit = useCallback(() => {
        if (user && messageInput) {
            CreateMessage(user.uid, messageInput, chatId)
        }
        setMessageInput('')
    }, [chatId, messageInput, user])

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Enter' && isFocused) {
                handleSubmit()
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleSubmit, isFocused])

    return (
        <div className={cn('flex gap-3 p-3', className)}>
            <Input
                className="flex-grow rounded-full bg-neutral-200/70 focus-visible:ring-0"
                placeholder="Aa"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            <Button className="grid place-items-center rounded-full p-3" variant="default" onClick={handleSubmit}>
                <Send size={16} />
            </Button>
        </div>
    )
}
