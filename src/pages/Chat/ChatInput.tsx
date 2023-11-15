import { Input } from '@/components/ui'
import React, { useEffect, useRef, useState } from 'react'

type Props = {}

export default function ChatInput({}: Props) {
    const [inputData, setInputData] = useState('')
    const [isFocused, setIsFocused] = useState(true)
    const inputRef = useRef<HTMLInputElement>(null)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputData(e.target.value)
    }

    function handleSubmit() {}

    useEffect(() => {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && isFocused) {
                handleSubmit()
            }
        })

        return () => {
            window.removeEventListener('keydown', () => {})
        }
    })

    return (
        <div>
            <Input
                placeholder="Type a message"
                value={inputData}
                ref={inputRef}
                autoFocus
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={handleChange}
            />
        </div>
    )
}
