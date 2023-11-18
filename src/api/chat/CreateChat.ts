import { Chat, ChatConverter } from '@/classes/Chat'
import { db } from '@/firebase'
import { Timestamp, addDoc, collection } from 'firebase/firestore'

export function CreateChat(users: string[]) {
    if (users.length < 1) {
        throw new Error('Not enough users to create chat')
    }
    const chat = new Chat('', '', Timestamp.now(), { message: 'Welcome!', userId: '' }, Timestamp.now(), users)
    addDoc(collection(db, 'chats').withConverter(ChatConverter), chat)
}
