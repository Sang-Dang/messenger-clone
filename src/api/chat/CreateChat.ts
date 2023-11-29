import { Chat, ChatConverter } from '@/classes/Chat'
import { db } from '@/firebase'
import { Timestamp, addDoc, collection } from 'firebase/firestore'

export function CreateChat(users: string[], chatName?: string, chatAvatar?: string) {
    if (users.length < 1) {
        throw new Error('Not enough users to create chat')
    }

    // if(users.length === 2) {
    //     chatName =
    // }

    const chat = new Chat('', chatName ?? '', Timestamp.now().toDate().toString(), null, Timestamp.now().toDate().toString(), users, chatAvatar ?? '')
    addDoc(collection(db, 'chats').withConverter(ChatConverter), chat)
}
