import { MessageConverter } from '@/classes/Message'
import { db } from '@/firebase'
import { Timestamp, doc, runTransaction } from 'firebase/firestore'

export async function DeleteMessage(messageId: string, chatId: string) {
    await runTransaction(db, async (transaction) => {
        const messageRef = doc(db, 'chats', chatId, 'messages', messageId).withConverter(MessageConverter)
        const messageSnap = await transaction.get(messageRef)

        // Delete all replies
        const messageData = messageSnap.data()
        if (messageData && messageData.replyIds) {
            messageData.replyIds.forEach((reply) => {
                const replyRef = doc(db, 'chats', chatId, 'messages', reply)
                transaction.update(replyRef, {
                    'repliedTo.message': '',
                    'repliedTo.type': 'deleted'
                })
            })
        }

        // Delete message
        transaction.update(messageRef, {
            message: '',
            type: 'deleted',
            deletedOn: Timestamp.fromDate(new Date())
        })
    })
}
