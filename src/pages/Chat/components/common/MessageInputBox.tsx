import { CreateMessage } from '@/api/messages'
import EmojiSelector from '@/components/EmojiSelector'
import { Button, Textarea } from '@/components/ui'
import { auth } from '@/firebase'
import { cn } from '@/lib/utils'
import { Send, Smile } from 'lucide-react'
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
        if (user && messageInput) {
            CreateMessage(user.uid, messageInput, chatId)
        }
        setMessageInput('')
    }, [chatId, messageInput, user])

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Enter' && isFocused && !e.shiftKey) {
                handleSubmit()
            }
        }

        function handleInput() {
            if (inputRef.current?.scrollHeight && inputRef.current?.offsetHeight) {
                if (inputRef.current.scrollHeight > inputRef.current.offsetHeight) {
                    inputRef.current.rows += 1
                }

                if (inputRef.current.scrollHeight < inputRef.current.offsetHeight) {
                    inputRef.current.rows -= 1
                }

                if (inputRef.current.rows > 3) {
                    inputRef.current.rows = 3
                }

                if (inputRef.current.rows < 1) {
                    inputRef.current.rows = 1
                }
            }
        }

        // TODO FINISH THIS SHIT

        function handleNewLine(e: KeyboardEvent) {
            if (!inputRef.current) return

            if (e.key === 'Enter' && e.shiftKey) {
                inputRef.current.rows += 1
            } else if (e.keyCode === 8 && e.shiftKey) {
                inputRef.current.rows -= 1
            }
        }

        window.addEventListener('keydown', handleNewLine)
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keydown', handleNewLine)
        }
    }, [handleSubmit, isFocused])

    return (
        <div className={cn('flex gap-3 p-3', className)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}>
            <div className="relative w-full">
                <Textarea
                    ref={inputRef}
                    className={cn('relative z-0 h-auto min-h-full resize-none rounded-full bg-red-200 pr-10 leading-loose focus-visible:ring-0')}
                    placeholder="Aa"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    rows={1}
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
