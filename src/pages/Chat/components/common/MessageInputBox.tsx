import { CreateMessage } from '@/api/messages'
import EmojiSelector from '@/components/EmojiSelector'
import { Button } from '@/components/ui'
import { auth } from '@/firebase'
import { cn } from '@/lib/utils'
import { Textarea } from '@nextui-org/react'
import { Image, PlusIcon, Send, Smile } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

type MessageInputBoxType = {
    chatId: string
    className?: string
}
export default function MessageInputBox({ chatId, className }: MessageInputBoxType) {
    const [user] = useAuthState(auth)
    const [messageInput, setMessageInput] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    const handleSubmit = useCallback(() => {
        if (user && messageInput.trim()) {
            CreateMessage(user.uid, messageInput.trim(), chatId, 'text')
        }
        setMessageInput('')
    }, [chatId, messageInput, user])

    function handleChange(value: string) {
        if (value !== '\n') setMessageInput(value)
    }

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Enter' && isFocused && !e.shiftKey) {
                handleSubmit()
            }
        }

        const input = inputRef.current

        input?.addEventListener('keydown', handleKeyDown)

        return () => {
            input?.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleSubmit, isFocused])

    return (
        <div className={cn('flex items-center gap-1 p-3', className)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}>
            <Button variant="default" className="mr-1 aspect-square h-4/6 rounded-full p-1">
                <PlusIcon size={16} />
            </Button>
            <Button variant="ghost" className="mr-1 aspect-square h-4/6 rounded-full p-1">
                <Image size={16} />
            </Button>
            <div className="relative flex-grow">
                <Textarea
                    ref={inputRef}
                    classNames={{
                        inputWrapper: 'rounded-3xl relative z-0 h-auto min-h-full bg-neutral-200/70  pr-10 leading-loose focus-visible:ring-0'
                    }}
                    onClear={() => setMessageInput('')}
                    placeholder="Aa"
                    value={messageInput}
                    onValueChange={handleChange}
                    variant="bordered"
                    minRows={1}
                    maxRows={3}
                />
                <div className="absolute right-1 top-1/2 z-20 -translate-y-1/2">
                    <EmojiSelector onSelect={(e) => setMessageInput((prev) => prev + e)}>
                        <Button variant="outline" className="rounded-full bg-transparent p-3">
                            <Smile size={20} />
                        </Button>
                    </EmojiSelector>
                </div>
            </div>
            <Button className="ml-3 grid aspect-square h-full place-items-center rounded-full p-3" variant="default" onClick={handleSubmit}>
                <Send size={16} />
            </Button>
        </div>
    )
}
