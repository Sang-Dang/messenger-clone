import { Chat } from '@/classes/Chat'
import { UserConverter } from '@/classes/User'
import { chatAdded } from '@/features/Chat/ChatSlice'
import { db, storage } from '@/firebase'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { doc, getDoc } from 'firebase/firestore'
import { getDownloadURL, ref as storageRef } from 'firebase/storage'

export const chatLoadedWithImages = createAsyncThunk(
    'chat/chatLoadedWithImages',
    async ({ chat, userId }: { chat: Chat; userId: string }, api) => {
        let url = chat.avatar
        let chatName = chat.chatName
        if (chat.users.length !== 2) {
            if (url.startsWith('chatAvatars/')) {
                const avatarRef = storageRef(storage, chat.avatar)
                url = await getDownloadURL(avatarRef)
            } else {
                url = '/img/user-default.jpg'
            }
        } else {
            const recipientId = chat.users.filter((id) => id !== userId)[0]
            const recipientRef = storageRef(storage, `userAvatars/${recipientId}`)
            url = await getDownloadURL(recipientRef)
            const recipient = await getDoc(
                doc(db, 'users', recipientId).withConverter(UserConverter)
            )
            if (recipient.exists()) chatName = recipient.data().name
        }
        api.dispatch(
            chatAdded({
                ...chat,
                avatar: url,
                chatName: chatName
            })
        )
    }
)
