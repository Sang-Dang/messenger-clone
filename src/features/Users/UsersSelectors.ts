import { User } from '@/classes/User'
import { RootState } from '@/store'
import { createSelector } from '@reduxjs/toolkit'

type selectUserByIdReturn = (state: RootState) => User | undefined
export const selectUserById = (id: string): selectUserByIdReturn =>
    createSelector([(state: RootState) => state.users.users], (users: { [key: string]: User }) => {
        return users[id]
    })

type selectUserInIdListReturn = (state: RootState) => User[]
export const selectUserInIdList = (idList: string[]): selectUserInIdListReturn =>
    createSelector([(state: RootState) => state.users.users], (users: { [key: string]: User }) => {
        return Object.entries(users)
            .filter(([key]) => idList.includes(key))
            .map(([, value]) => value)
    })

export const selectUserStatus = (state: RootState) => state.users.status
