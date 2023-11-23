import { ChatConverter } from '@/classes/Chat'
import { Skeleton } from '@/components/ui'
import { addChat, clearChats, removeChat, updateChat } from '@/features/Chat/ChatSlice'
import { auth, db } from '@/firebase'
import useAppDispatch from '@/lib/hooks/useAppDispatch'
import useAppSelector from '@/lib/hooks/useAppSelector'
import ChatCard from '@/pages/Chat/components/common/ChatCard'
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore'
import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

export default function ChatList() {
    const [user] = useAuthState(auth)
    const dispatch = useAppDispatch()
    const allChats = useAppSelector((state) => state.chat)

    useEffect(() => {
        let unsubscribe = () => {}
        if (user)
            unsubscribe = onSnapshot(
                query(collection(db, 'chats'), where('users', 'array-contains', doc(db, 'users', user?.uid))).withConverter(ChatConverter),
                (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            dispatch(
                                addChat({
                                    ...change.doc.data()
                                })
                            )
                        }
                        if (change.type === 'removed') {
                            dispatch(
                                removeChat({
                                    id: change.doc.data().id
                                })
                            )
                        }
                        if (change.type === 'modified') {
                            dispatch(
                                updateChat({
                                    ...change.doc.data()
                                })
                            )
                        }
                    })
                }
            )

        return () => {
            unsubscribe()
            dispatch(clearChats)
        }
    }, [dispatch, user])

    if (!allChats) {
        return null
    }

    return (
        <div className="flex flex-col gap-3">
            {!allChats ? <Skeleton className="h-10 w-full" /> : Object.entries(allChats.value).map(([id, chat]) => <ChatCard key={id} chat={chat} />)}
        </div>
    )
}
