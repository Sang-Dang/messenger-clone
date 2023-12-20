import LastMessage from '@/classes/LastMessage'
import { db } from '@/firebase'
import { QueryDocumentSnapshot, SnapshotOptions, Timestamp, doc } from 'firebase/firestore'

export class Chat {
    id: string
    chatName: string
    createdOn: Timestamp
    lastUpdatedOn: Timestamp
    lastMessage: LastMessage | null
    users: string[]
    avatar: string

    constructor(
        id: string,
        chatName: string,
        createdOn: Timestamp,
        lastMessage: LastMessage | null,
        lastUpdatedOn: Timestamp,
        users: string[],
        avatar?: string
    ) {
        this.id = id
        this.chatName = chatName
        this.createdOn = createdOn
        this.lastUpdatedOn = lastUpdatedOn
        this.lastMessage = lastMessage ?? null
        this.users = users
        this.avatar = avatar || '/img/user-default.jpg'
    }

    static serialize(chat: Chat): ChatSerializable {
        return {
            ...chat,
            createdOn: chat.createdOn.toMillis(),
            lastUpdatedOn: chat.lastUpdatedOn.toMillis()
        } satisfies ChatSerializable
    }

    static deserialize(data: ChatSerializable): Chat {
        return new Chat(
            data.id,
            data.chatName,
            Timestamp.fromMillis(data.createdOn),
            data.lastMessage,
            Timestamp.fromMillis(data.lastUpdatedOn),
            data.users,
            data.avatar
        )
    }
}

export type ChatSerializable = Omit<Chat, 'createdOn' | 'lastUpdatedOn'> & {
    createdOn: number
    lastUpdatedOn: number
}

export const ChatConverter = {
    // no async code here.
    toFirestore: (chat: Chat) => {
        return {
            chatName: chat.chatName,
            createdOn: chat.createdOn,
            lastMessage: chat.lastMessage,
            lastUpdatedOn: chat.lastUpdatedOn,
            users: chat.users.map((user) => doc(db, 'users', user)),
            avatar: chat.avatar
        }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options) as Chat

        return new Chat(
            snapshot.id, // id
            data.chatName, // chatName
            data.createdOn, // createdOn
            data.lastMessage
                ? new LastMessage(
                      data.lastMessage.id,
                      data.lastMessage.userId,
                      data.lastMessage.message
                  )
                : null, // lastMessage
            data.lastUpdatedOn, // lastUpdatedOn
            data.users.map((user: any) => user.id), // users
            data.avatar // avatar
        )
    }
}
