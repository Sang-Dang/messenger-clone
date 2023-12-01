import { ResponseContext } from '@/pages/Chat/components/ConversationView'
import { useContext } from 'react'

export default function useResponse() {
    const context = useContext(ResponseContext)

    if (!context) {
        throw new Error('useResponse must be used within a ResponseProvider')
    }

    return context
}
