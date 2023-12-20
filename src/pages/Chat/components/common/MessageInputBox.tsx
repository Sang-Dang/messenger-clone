import { CreateMessage } from '@/api/messages'
import EmojiSelector from '@/components/EmojiSelector'
import ImageUploadButton from '@/components/ImageUploadButton'
import { Button } from '@/components/ui'
import useAuth from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'
import useReply from '@/pages/Chat/hooks/useResponse'
import { Textarea } from '@nextui-org/react'
import { PlusIcon, Send, Smile, X } from 'lucide-react'
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
    const [inputImages, setInputImages] = useState<FileList | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = useCallback(async () => {
        setIsSubmitting(true)
        if ((user && messageInput.trim()) || inputImages) {
            try {
                CreateMessage(
                    user.uid,
                    messageInput.trim(),
                    chatId,
                    'text',
                    reply ?? undefined,
                    inputImages ?? undefined
                )
            } catch (error) {
                console.log(error)
            }
        }

        setMessageInput('')
        setInputImages(null)
        resetReply()

        setTimeout(() => {
            setIsSubmitting(false)
        }, 100)
    }, [chatId, inputImages, messageInput, reply, resetReply, user])

    useEffect(() => {
        inputRef.current?.focus()
    }, [isSubmitting])

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
        <div
            className={cn('flex items-end gap-1 p-3', className)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
        >
            <Button variant="default" className="mr-1 aspect-square h-10 rounded-full p-1">
                <PlusIcon size={16} />
            </Button>
            <ImageUploadButton
                onChange={(files) => {
                    setInputImages(files)
                }}
            />
            <div className="relative flex-grow">
                <Textarea
                    ref={inputRef}
                    classNames={{
                        inputWrapper:
                            'rounded-3xl relative z-0 h-auto min-h-full bg-neutral-200/70 pr-10 leading-loose focus-visible:ring-0',
                        label: 'w-full cursor-default'
                    }}
                    onClear={() => setMessageInput('')}
                    disabled={isSubmitting}
                    placeholder="Aa"
                    label={
                        <div className="flex h-full flex-col gap-3">
                            {reply && ( // has response
                                <div className="inline-flex w-min flex-col gap-0 rounded-3xl bg-neutral-300/50 p-3">
                                    <div className="flex w-full min-w-max items-center justify-between gap-1">
                                        <span className="">
                                            Responding to{' '}
                                            <strong className="font-bold">
                                                {reply.userId === user.uid
                                                    ? 'Yourself'
                                                    : reply.username}
                                            </strong>
                                        </span>
                                        <Button
                                            variant="ghost"
                                            className="ml-5 h-min cursor-pointer p-0 leading-[0] tracking-[0]"
                                            onClick={() => setReply(null)}
                                        >
                                            <X size={16} className="scale-100" />
                                        </Button>
                                    </div>
                                    <div className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap text-xs tracking-wider opacity-90">
                                        {reply.type === 'text' && reply.message}
                                        {reply.type === 'image' && 'Image'}
                                    </div>
                                </div>
                            )}
                            {inputImages && inputImages.length >= 1 && (
                                <div className="mt-2 inline-flex h-full gap-2">
                                    {Array.from(inputImages).map((img) => (
                                        <img
                                            src={URL.createObjectURL(img)}
                                            alt=""
                                            key={img.name}
                                            className="aspect-square h-16 rounded-2xl object-cover"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
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
            <Button
                className="ml-3 grid aspect-square h-10 place-items-center rounded-full p-3"
                variant="default"
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
                <Send size={16} />
            </Button>
        </div>
    )
}
