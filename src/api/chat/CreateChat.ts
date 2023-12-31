import { Chat, ChatConverter } from '@/classes/Chat'
import { db, storage } from '@/firebase'
import { Timestamp, addDoc, collection, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes } from 'firebase/storage'

export async function CreateChat(users: string[], chatName?: string, chatAvatar?: File) {
    if (users.length < 1) {
        throw new Error('Not enough users to create chat')
    }

    const chat = {
        id: '',
        avatar: '',
        chatName: chatName ?? '',
        createdOn: Timestamp.now(),
        lastMessage: null,
        lastUpdatedOn: Timestamp.now(),
        users: users
    } satisfies Chat

    const docRef = await addDoc(collection(db, 'chats').withConverter(ChatConverter), chat)
    if (chatAvatar) {
        const avatarRef = ref(storage, `chatAvatars/${docRef.id}`)
        const avatar = await uploadBytes(avatarRef, chatAvatar)

        await updateDoc(docRef, {
            avatar: avatar.metadata.fullPath
        })
    }
}
