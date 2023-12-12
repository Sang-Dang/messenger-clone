import { MessageConverter } from '@/classes/Message'
import { db } from '@/firebase'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'

export async function SeenMessage(messageId: string, userId: string, chatId: string) {
    const messageRef = doc(db, 'chats', chatId, 'messages', messageId).withConverter(MessageConverter)

    await updateDoc(messageRef, {
        seenBy: arrayUnion(userId)
    })
}
