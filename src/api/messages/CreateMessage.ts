import { Message, MessageConverter } from '@/classes/Message'
import { db } from '@/firebase'
import { addDoc, collection } from 'firebase/firestore'

export function CreateMessage(userId: string, message: string, chatId: string) {
    if (!userId || !message) {
        throw new Error('Not enough data to create message')
    }

    const messageObj = new Message('', userId, message, new Date().toString())
    addDoc(collection(db, 'chats', chatId, 'messages').withConverter(MessageConverter), messageObj)
}
