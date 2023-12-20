import { ChatConverter } from '@/classes/Chat'
import { Message, MessageConverter } from '@/classes/Message'
import Reply from '@/classes/Reply'
import { db, storage } from '@/firebase'
import { Timestamp, arrayUnion, collection, doc, writeBatch } from 'firebase/firestore'
import { ref, uploadBytes } from 'firebase/storage'

export async function CreateMessage(
    userId: string,
    message: string,
    chatId: string,
    type: ChatMessageTypes,
    reply?: Reply,
    images?: FileList
) {
    const messageCreationDate = Timestamp.now()
    const chatRef = doc(db, 'chats', chatId).withConverter(ChatConverter)
    const batch = writeBatch(db)

    if (!userId || !chatId) {
        throw new Error('Missing userId or chatId')
    }

    if (images) {
        const imagesRef = ref(storage, `chatImages/${chatId}`)
        const imageURLs: string[] = []
        await Promise.all(
            Array.from(images).map(async (image) => {
                const imageRef = ref(imagesRef, image.name)
                await uploadBytes(imageRef, image)
                imageURLs.push(imageRef.fullPath)
            })
        )
        // create image in db
        const messageImageRef = doc(collection(db, 'chats', chatId, 'messages')).withConverter(
            MessageConverter
        )
        const messageImageObj = new Message(
            '',
            userId,
            imageURLs.join(';'),
            messageCreationDate,
            'image',
            null,
            [],
            reply ?? null,
            undefined,
            [userId]
        )
        batch.set(messageImageRef, messageImageObj)
        batch.update(chatRef, {
            lastMessage: {
                ...MessageConverter.toFirestore(messageImageObj),
                message: 'Image'
            },
            lastUpdatedOn: messageCreationDate // converters don't run on updates idiot
        })
        if (reply) {
            const originalRef = doc(db, 'chats', chatId, 'messages', reply.id).withConverter(
                MessageConverter
            )
            batch.update(originalRef, {
                replyIds: arrayUnion(messageImageRef.id)
            })
        }
    }

    if (message) {
        const messageObj = new Message(
            '',
            userId,
            message,
            messageCreationDate,
            type,
            null,
            [],
            reply ?? null
        )
        const messageRef = doc(collection(db, 'chats', chatId, 'messages')).withConverter(
            MessageConverter
        )
        batch.set(messageRef, messageObj)
        batch.update(chatRef, {
            lastMessage: {
                ...MessageConverter.toFirestore(messageObj)
            },
            lastUpdatedOn: messageCreationDate // converters don't run on updates idiot
        })
        if (reply) {
            const originalRef = doc(db, 'chats', chatId, 'messages', reply.id).withConverter(
                MessageConverter
            )
            batch.update(originalRef, {
                replyIds: arrayUnion(messageRef.id)
            })
        }
    }
    await batch.commit()
}
