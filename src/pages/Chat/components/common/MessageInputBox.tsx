import { CreateMessage } from '@/api/messages'
import EmojiSelector from '@/components/EmojiSelector'
import { Button, Input } from '@/components/ui'
import { auth } from '@/firebase'
import { cn } from '@/lib/utils'
import { Send, Smile } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

type MessageInputBoxType = {
    chatId: string
    className?: string
}
export default function MessageInputBox({ chatId, className }: MessageInputBoxType) {
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
        <div className={cn('flex gap-3 p-3', className)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}>
            <div className="relative w-full">
                <Input
                    className={cn('relative z-0 rounded-full bg-neutral-200/70 focus-visible:ring-0')}
                    placeholder="Aa"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                />
                <div className="absolute right-0 top-1/2 z-20 -translate-y-1/2">
                    <EmojiSelector onSelect={(e) => setMessageInput((prev) => prev + e)}>
                        <Button variant="ghost" className="rounded-full p-3">
                            <Smile size={20} />
                        </Button>
                    </EmojiSelector>
                </div>
            </div>
            <Button className="grid place-items-center rounded-full p-3" variant="default" onClick={handleSubmit}>
                <Send size={16} />
            </Button>
        </div>
    )
}
