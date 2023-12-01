import { ReplyContext } from '@/pages/Chat/components/ConversationView'
import { useContext } from 'react'

export default function useReply() {
    const context = useContext(ReplyContext)

    if (!context) {
        throw new Error('useResponse must be used within a ResponseProvider')
    }

    return context
}
