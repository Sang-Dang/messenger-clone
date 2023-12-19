import { Chat, ChatConverter } from '@/classes/Chat'
import { Message } from '@/classes/Message'
import {
    chatAdded,
    chatRemoved,
    chatUpdated,
    errorOccurred,
    loadedSuccessfully,
    loadingToggled
} from '@/features/Chat/ChatSlice'
import { fetchUsers } from '@/features/Users/UsersThunks'
import { db } from '@/firebase'
import useAppDispatch from '@/lib/hooks/useAppDispatch'
import useAuth from '@/lib/hooks/useAuth'
import { collection, doc, orderBy, query, where } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'

export default function useChats() {
    const { user } = useAuth()
    const dispatch = useAppDispatch()
    const [, loading, error, snapshot] = useCollectionData(
        query(
            collection(db, 'chats').withConverter(ChatConverter),
            where('users', 'array-contains', doc(db, 'users', user.uid)),
            orderBy('lastUpdatedOn', 'desc')
        )
    )

    if (loading) {
        dispatch(loadingToggled(true))
    }

    if (error) {
        dispatch(errorOccurred(error.message))
    }

    snapshot?.docChanges().forEach((change) => {
        if (change.type === 'added') {
            // avoid serializing the lastMessage object
            dispatch(
                chatAdded({
                    ...change.doc.data(),
                    lastMessage: {
                        ...change.doc.data().lastMessage
                    } as Message
                } as Chat)
            )
            dispatch(fetchUsers(change.doc.data().users))
        }
        if (change.type === 'modified') {
            // avoid serializing the lastMessage object
            dispatch(
                chatUpdated({
                    ...change.doc.data(),
                    lastMessage: {
                        ...change.doc.data().lastMessage
                    } as Message
                } as Chat)
            )
            dispatch(fetchUsers(change.doc.data().users))
        }
        if (change.type === 'removed') {
            dispatch(
                chatRemoved({
                    id: change.doc.id
                })
            )
        }
    })

    dispatch(loadedSuccessfully())
}
