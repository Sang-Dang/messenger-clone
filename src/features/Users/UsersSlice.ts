import { User } from '@/classes/User'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type UsersSliceType = {
    users: {
        [key: string]: User
    }
    userIds: string[]
}

const initialState: UsersSliceType = {
    users: {},
    userIds: []
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
    }
})

const usersReducer = UsersSlice.reducer

export const { userAdded, userRemoved, userUpdated, manyUsersAdded } = UsersSlice.actions
export default usersReducer
