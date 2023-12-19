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

type selectUserInIdListObjectReturn = (state: RootState) => {
    [id: string]: User
}
export const selectUserInIdListObject = (idList: string[]): selectUserInIdListObjectReturn =>
    createSelector([(state: RootState) => state.users.users], (users: { [key: string]: User }) => {
        return Object.entries(users)
            .filter(([key]) => idList.includes(key))
            .map(([id, currUser]) => ({ [id]: currUser }))
            .reduce((arr, curr) => ({ ...arr, ...curr }), {})
    })

export const selectUserStatus = (state: RootState) => state.users.status
export const selectUsersList = (state: RootState) => state.users.users
export const selectUserIds = (state: RootState) => state.users.userIds
export const selectUserFieldById = (id: string, field: keyof User) =>
    createSelector([(state: RootState) => state.users.users], (users: { [key: string]: User }) => {
        return users[id][field]
    })
