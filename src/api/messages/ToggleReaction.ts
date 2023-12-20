import { MessageConverter } from '@/classes/Message'
import { db } from '@/firebase'
import { deleteField, doc, runTransaction } from 'firebase/firestore'

export async function ToggleReaction(
    chatId: string,
    messageId: string,
    userId: string,
    reaction: string
) {
    await runTransaction(db, async (transaction) => {
        const messageRef = doc(db, 'chats', chatId, 'messages', messageId).withConverter(
            MessageConverter
        )
        const message = await transaction.get(messageRef)
        if (!message.exists()) {
            throw new Error('Message does not exist')
        }

        const currentReaction = message.data().reactions.data[userId]
        // if (!message.data().reactions) {
        //     transaction.update(messageRef, {
        //         reactions: {
        //             data: {
        //                 [userId]: reaction
        //             }
        //         }
        //     })
        //     return
        // }

        if (currentReaction === reaction) {
            transaction.update(messageRef, {
                [`reactions.data.${userId}`]: deleteField()
            })
        } else {
            transaction.update(messageRef, {
                [`reactions.data.${userId}`]: reaction
            })
        }
    })
}
