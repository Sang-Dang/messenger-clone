import { Message, MessageConverter } from '@/classes/Message'
import { db } from '@/firebase'
import { QueryDocumentSnapshot, SnapshotOptions, Timestamp, doc } from 'firebase/firestore'

export class Chat {
    id: string
    chatName: string
    createdOn: string
    lastMessage: Message | null
    lastUpdatedOn: string
    users: string[]
    avatar: string

    constructor(
        id: string,
        chatName: string,
        createdOn: string,
        lastMessage: Message | null,
        lastUpdatedOn: string,
        users: string[],
        avatar?: string
    ) {
        this.id = id
        this.chatName = chatName
        this.createdOn = createdOn
        this.lastMessage = lastMessage ?? null
        this.lastUpdatedOn = lastUpdatedOn
        this.users = users
        this.avatar = avatar || '/img/user-default.jpg'
    }
}

export const ChatConverter = {
    // no async code here.
    toFirestore: (chat: Chat) => {
        return {
            chatName: chat.chatName,
            createdOn: Timestamp.fromDate(new Date(chat.createdOn)),
            lastMessage:
                chat.lastMessage !== null ? MessageConverter.toFirestore(chat.lastMessage) : null,
            lastUpdatedOn: Timestamp.fromDate(new Date(chat.lastUpdatedOn)),
            users: chat.users.map((user) => doc(db, 'users', user)),
            avatar: chat.avatar
        }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options)
        const id = snapshot.id
        const lastMessage = data.lastMessage

        return new Chat(
            id,
            data.chatName,
            (data.createdOn as Timestamp).toDate().toString(),
            lastMessage
                ? // TODO OPTIMIZE THIS SHITTY ASS CODE
                  new Message(
                      lastMessage.id,
                      lastMessage.userId,
                      lastMessage.message,
                      (lastMessage.createdOn as Timestamp).toDate().toString(),
                      lastMessage.type,
                      lastMessage.deletedOn,
                      lastMessage.replyIds,
                      lastMessage.repliedTo
                  )
                : null,
            (data.lastUpdatedOn as Timestamp).toDate().toString(),
            data.users.map((user: any) => user.id),
            data.avatar
        )
    }
}
