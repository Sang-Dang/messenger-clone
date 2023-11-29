import { ChatConverter } from '@/classes/Chat'
import { Message, MessageConverter } from '@/classes/Message'
import { db } from '@/firebase'
import { Timestamp, addDoc, collection, doc, updateDoc } from 'firebase/firestore'

export async function CreateMessage(userId: string, message: string, chatId: string) {
    if (!userId || !message) {
        throw new Error('Not enough data to create message')
    }

    const messageCreationDate = new Date().toString()
    const messageObj = new Message('', userId, message, messageCreationDate)

    await addDoc(collection(db, 'chats', chatId, 'messages').withConverter(MessageConverter), messageObj)
    const chatRef = doc(db, 'chats', chatId).withConverter(ChatConverter)
    await updateDoc(chatRef, {
        lastMessage: {
            ...MessageConverter.toFirestore(messageObj)
        },
        lastUpdatedOn: Timestamp.fromDate(new Date(messageCreationDate)) // converters don't run on updates idiot
    })
}
