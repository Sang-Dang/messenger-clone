import { CreateMessage } from '@/api/messages'
import EmojiSelector from '@/components/EmojiSelector'
import { Button } from '@/components/ui'
import useAuth from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'
import useReply from '@/pages/Chat/hooks/useResponse'
import { Textarea } from '@nextui-org/react'
import { Image, PlusIcon, Send, Smile, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

type MessageInputBoxType = {
    chatId: string
    className?: string
}
export default function MessageInputBox({ chatId, className }: MessageInputBoxType) {
    const { user } = useAuth()
    const [messageInput, setMessageInput] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const { reply, setReply, resetReply } = useReply()

    const handleSubmit = useCallback(() => {
        if (user && messageInput.trim()) {
            try {
                CreateMessage(user.uid, messageInput.trim(), chatId, 'text', reply ?? undefined)
            } catch (error) {
                console.log(error)
            }
        }
        setMessageInput('')
        resetReply()
    }, [chatId, messageInput, reply, resetReply, user])

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
        <div className={cn('flex items-end gap-1 p-3', className)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}>
            <Button variant="default" className="mr-1 aspect-square h-10 rounded-full p-1">
                <PlusIcon size={16} />
            </Button>
            <Button variant="ghost" className="mr-1 aspect-square h-10 rounded-full p-1">
                <Image size={16} />
            </Button>
            <div className="relative flex-grow">
                <Textarea
                    ref={inputRef}
                    classNames={{
                        inputWrapper: 'rounded-3xl relative z-0 h-auto min-h-full bg-neutral-200/70 pr-10 leading-loose focus-visible:ring-0'
                    }}
                    onClear={() => setMessageInput('')}
                    placeholder="Aa"
                    label={
                        reply && ( // has response
                            <div className="flex flex-col gap-0">
                                <div className="flex items-center gap-1 ">
                                    <span>
                                        Responding to <strong className="font-bold">{reply.userId === user.uid ? 'Yourself' : reply.username}</strong>
                                    </span>
                                    <Button variant="ghost" className="h-min p-0 leading-[0] tracking-[0]" onClick={() => setReply(null)}>
                                        <X size={14} />
                                    </Button>
                                </div>
                                <div className="w-96 overflow-hidden text-ellipsis whitespace-nowrap text-xs tracking-wider opacity-90">
                                    {reply.type === 'text' && reply.message}
                                    {reply.type === 'image' && 'Image'}
                                </div>
                            </div>
                        )
                    }
                    labelPlacement="inside"
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
            <Button className="ml-3 grid aspect-square h-10 place-items-center rounded-full p-3" variant="default" onClick={handleSubmit}>
                <Send size={16} />
            </Button>
        </div>
    )
}
