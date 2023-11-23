import { Button, Input } from '@/components/ui'
import { Send } from 'lucide-react'
import { useState } from 'react'

export default function MessageInputBox() {
    const [messageInput, setMessageInput] = useState('')

    function handleSubmit() {}

    return (
        <div className="flex gap-3 p-3">
            <Input
                className="flex-grow rounded-full bg-neutral-200/70 focus-visible:ring-0"
                placeholder="Aa"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
            />
            <Button className="grid place-items-center rounded-full p-3" variant="default" onClick={handleSubmit}>
                <Send size={16} />
            </Button>
        </div>
    )
}
