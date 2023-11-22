import { MessageConverter } from '@/classes/Message'
import { addMessage, resetState } from '@/features/Conversation/ConversationSlice'
import { db } from '@/firebase'
import useAppDispatch from '@/lib/hooks/useAppDispatch'
import useAppSelector from '@/lib/hooks/useAppSelector'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { useEffect } from 'react'

export default function ConversationView() {
    const id = useAppSelector((state) => state.conversation.value.chatId)
    const messages = useAppSelector((state) => state.conversation.value.messages)
    const dispatch = useAppDispatch()

    useEffect(() => {
        let unsubscribe = () => {}
        if (id) {
            unsubscribe = onSnapshot(query(collection(db, 'chats', id, 'messages')).withConverter(MessageConverter), (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        dispatch(
                            addMessage({
                                ...change.doc.data()
                            })
                        )
                    }
                    if (change.type === 'removed') {
                        console.log('removed')
                    }
                    if (change.type === 'modified') {
                        console.log('modified')
                    }
                })
            })
        }

        return () => {
            unsubscribe()
            dispatch(resetState())
        }
    }, [dispatch, id])

    if (!id) {
        return <div>Please select a chat.</div>
    }

    return (
        <div>
            {Object.entries(messages).map(([id, message]) => (
                <div key={id}>{message.message}</div>
            ))}
        </div>
    )
}
