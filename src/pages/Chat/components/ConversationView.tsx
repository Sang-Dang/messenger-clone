import { resetState } from '@/features/Conversation/ConversationSlice'
import { db } from '@/firebase'
import useAppDispatch from '@/lib/hooks/useAppDispatch'
import useAppSelector from '@/lib/hooks/useAppSelector'
import { collection, onSnapshot } from 'firebase/firestore'
import { useEffect } from 'react'

export default function ConversationView() {
    const id = useAppSelector((state) => state.conversation.value.chatId)
    const dispatch = useAppDispatch()

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'chats', id, 'messages'), (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    console.log('added')
                }
                if (change.type === 'removed') {
                    console.log('removed')
                }
                if (change.type === 'modified') {
                    console.log('modified')
                }
            })
        })

        return () => {
            unsubscribe()
            dispatch(resetState())
        }
    })

    if (!id) {
        return <div>Please select a chat.</div>
    }

    return <div>ConversationView</div>
}
