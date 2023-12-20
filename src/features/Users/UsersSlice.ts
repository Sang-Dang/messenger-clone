import { User } from '@/classes/User'
import { fetchUsers } from '@/features/Users/UsersThunks'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

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
            action.payload.forEach((user) => {
                if (!state.users[user.id]) {
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
            .addCase(fetchUsers.fulfilled, (state) => {
                state.status = 'idle'
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? null
            })
    }
})

const usersReducer = UsersSlice.reducer

export const { userAdded, userRemoved, userUpdated, manyUsersAdded } = UsersSlice.actions
export default usersReducer
