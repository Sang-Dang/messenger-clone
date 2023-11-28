import { UserConverter } from '@/classes/User'
import { manyUsersAdded } from '@/features/Users/UsersSlice'
import { db } from '@/firebase'
import useAppDispatch from '@/lib/hooks/useAppDispatch'
import { query, collection, where, documentId } from 'firebase/firestore'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'

export default function useUsersFromList(userList: string[]) {
    const [data, loading, error] = useCollectionDataOnce(
        userList ? query(collection(db, 'users').withConverter(UserConverter), where(documentId(), 'in', userList)) : undefined
    )
    const dispatch = useAppDispatch()

    if (loading) {
    }

    if (error) {
    }

    dispatch(
        manyUsersAdded(
            data!.map((cur) => ({
                ...cur
            }))
        )
    )
}
