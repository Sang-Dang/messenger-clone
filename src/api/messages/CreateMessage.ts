import { ChatConverter } from '@/classes/Chat'
import { Message, MessageConverter } from '@/classes/Message'
import ReplyBasic from '@/classes/ReplyBasic'
import { db } from '@/firebase'
import { Timestamp, arrayUnion, collection, doc, writeBatch } from 'firebase/firestore'

export async function CreateMessage(userId: string, message: string, chatId: string, type: ChatMessageTypes, reply?: ReplyBasic) {
    if (!userId || !message) {
        throw new Error('Not enough data to create message')
    }

    const messageCreationDate = new Date().toString()
    const messageObj = new Message('', userId, message, messageCreationDate, type, null, [], reply)

    const batch = writeBatch(db)
    const messageRef = doc(collection(db, 'chats', chatId, 'messages')).withConverter(MessageConverter)
    const chatRef = doc(db, 'chats', chatId).withConverter(ChatConverter)
    batch.set(messageRef, messageObj)
    batch.update(chatRef, {
        lastMessage: {
            ...MessageConverter.toFirestore(messageObj)
        },
        lastUpdatedOn: Timestamp.fromDate(new Date(messageCreationDate)) // converters don't run on updates idiot
    })
    if (reply) {
        const originalRef = doc(db, 'chats', chatId, 'messages', reply.id).withConverter(MessageConverter)
        batch.update(originalRef, {
            replyIds: arrayUnion(messageRef.id)
        })
    }
    await batch.commit()
}
