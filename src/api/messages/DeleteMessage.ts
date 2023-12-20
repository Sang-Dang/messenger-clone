import { Message, MessageConverter } from '@/classes/Message'
import { db } from '@/firebase'
import { Timestamp, doc, runTransaction } from 'firebase/firestore'

export async function DeleteMessage(messageId: string, chatId: string) {
    await runTransaction(db, async (transaction) => {
        const messageRef = doc(db, 'chats', chatId, 'messages', messageId).withConverter(
            MessageConverter
        )
        const messageSnap = await transaction.get(messageRef)

        // Delete all replies
        const messageData = messageSnap.data()
        if (messageData && messageData.replyIds) {
            messageData.replyIds.forEach((reply) => {
                const replyRef = doc(db, 'chats', chatId, 'messages', reply)
                transaction.update(replyRef, {
                    'repliedTo.message': '',
                    'repliedTo.type': 'deleted',
                    reactions: {
                        data: {},
                        count: {}
                    }
                    // TODO FIX
                })
            })
        }

        // Delete message
        transaction.update(messageRef, {
            message: '',
            type: 'deleted',
            deletedOn: Timestamp.fromDate(new Date())
        })

        // Update chat last message
        const chatRef = doc(db, 'chats', chatId)

        transaction.update(chatRef, {
            lastMessage: {
                ...messageData,
                message: 'Deleted a message',
                createdOn: new Date().toString()
            } as Message
        })
    })
}
