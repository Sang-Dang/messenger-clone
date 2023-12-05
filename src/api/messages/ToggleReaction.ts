import { MessageConverter } from '@/classes/Message'
import { db } from '@/firebase'
import { deleteField, doc, runTransaction } from 'firebase/firestore'

export async function ToggleReaction(chatId: string, messageId: string, userId: string, reaction: string) {
    await runTransaction(db, async (transaction) => {
        const messageRef = doc(db, 'chats', chatId, 'messages', messageId).withConverter(MessageConverter)
        const message = await transaction.get(messageRef)
        if (!message.exists()) {
            throw new Error('Message does not exist')
        }

        const currentReaction = message.data().reactions.data[userId]
        const currentReactionCount = message.data().reactions.count[reaction]

        if (currentReaction === reaction) {
            transaction.update(messageRef, {
                [`reactions.data.${userId}`]: deleteField(),
                [`reactions.count.${reaction}`]: currentReactionCount - 1 > 0 ? currentReactionCount - 1 : deleteField()
            })
        } else {
            transaction.update(messageRef, {
                [`reactions.data.${userId}`]: reaction,
                [`reactions.count.${currentReaction}`]: currentReactionCount - 1 > 0 ? currentReactionCount - 1 : deleteField(),
                [`reactions.count.${reaction}`]: currentReactionCount ? currentReactionCount + 1 : 1
            })
        }
    })
}
