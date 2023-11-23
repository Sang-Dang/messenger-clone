import { Chat, ChatConverter } from '@/classes/Chat'
import { db } from '@/firebase'
import { Timestamp, addDoc, collection } from 'firebase/firestore'

export function CreateChat(users: string[], chatName?: string, chatAvatar?: string) {
    if (users.length < 1) {
        throw new Error('Not enough users to create chat')
    }
    const chat = new Chat('', chatName ?? '', Timestamp.now().toDate().toString(), '', Timestamp.now().toDate().toString(), users, chatAvatar ?? '')
    addDoc(collection(db, 'chats').withConverter(ChatConverter), chat)
}
