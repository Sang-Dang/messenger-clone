import { User, UserConverter } from '@/classes/User'
import { db } from '@/firebase'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { collection, documentId, getDocs, query, where } from 'firebase/firestore'

export type usersObj = {
    [key: string]: User
}

type UsersSliceType = {
    users: usersObj
    userIds: string[]
    status: 'idle' | 'loading' | 'failed'
    error: string | null
}

const initialState: UsersSliceType = {
    users: {},
    userIds: [],
    status: 'idle',
    error: null
}

export const UsersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        userAdded: (state, action: PayloadAction<User>) => {
            if (!state.userIds.includes(action.payload.id)) {
                state.users[action.payload.id] = action.payload
                state.userIds.push(action.payload.id)
            }
        },
        userRemoved: (state, action: PayloadAction<{ id: string }>) => {
            state.userIds.filter((current) => current !== action.payload.id)
            delete state.users[action.payload.id]
        },
        userUpdated: (state, action: PayloadAction<User>) => {
            state.users[action.payload.id] = action.payload
        },
        manyUsersAdded: (state, action: PayloadAction<User[]>) => {
            state.userIds = []
            state.users = {}
            action.payload.forEach((user) => {
                if (!state.userIds.includes(user.id)) {
                    state.users[user.id] = user
                    state.userIds.push(user.id)
                }
            })
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'idle'
                action.payload
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? null
            })
    }
})

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (userIds: string[], api) => {
    if (userIds.length === 0) {
        return
    }

    const q = query(collection(db, 'users').withConverter(UserConverter), where(documentId(), 'in', userIds))
    const documents = await getDocs(q)
    api.dispatch(
        manyUsersAdded(
            documents.docs.map((doc) => ({
                ...doc.data()
            }))
        )
    )
})

const usersReducer = UsersSlice.reducer

export const { userAdded, userRemoved, userUpdated, manyUsersAdded } = UsersSlice.actions
export default usersReducer
