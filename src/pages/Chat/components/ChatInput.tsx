/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui'
import { auth } from '@/firebase'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

type Props = {
    onSubmit: (message: string, userId: string) => void
}

export default function ChatInput({ onSubmit }: Props) {
    const [user] = useAuthState(auth)
    const [inputData, setInputData] = useState('')
    const [isFocused, setIsFocused] = useState(true)
    const inputRef = useRef<HTMLInputElement>(null)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputData(e.target.value)
    }

    const handleKeydown = useCallback(
        (e: any) => {
            if (e.key === 'Enter' && isFocused && inputData !== '') {
                onSubmit(inputData, user?.uid!)
                setInputData('')
            }
        },
        [inputData, isFocused, onSubmit, user?.uid!]
    )

    useEffect(() => {
        window.addEventListener('keydown', handleKeydown, false)

        return () => {
            window.removeEventListener('keydown', handleKeydown)
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
