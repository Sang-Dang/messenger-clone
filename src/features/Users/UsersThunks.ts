import { User, UserConverter } from '@/classes/User'
import { manyUsersAdded } from '@/features/Users/UsersSlice'
import { db, storage } from '@/firebase'
import { RootState } from '@/store'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { collection, documentId, getDocs, query, where } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (userIds: string[], api) => {
    if (userIds.length === 0) {
        return
    }

    const store = api.getState() as RootState
    userIds.filter((id) => !!store.users.users[id])

    const q = query(
        collection(db, 'users').withConverter(UserConverter),
        where(documentId(), 'in', userIds)
    )
    const documents = await getDocs(q)

    const result = await Promise.all(
        documents.docs.map(async (doc) => {
            const avatar = await getDownloadURL(ref(storage, doc.data().avatar))

            return {
                ...doc.data(),
                avatar
            } as User
        })
    )

    api.dispatch(manyUsersAdded(result))
})
