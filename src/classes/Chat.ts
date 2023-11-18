import { QueryDocumentSnapshot, SnapshotOptions, Timestamp } from 'firebase/firestore'

export class LastMessage {
    message: string
    userId: string

    constructor(message: string, userId: string) {
        this.message = message
        this.userId = userId
    }
}

export class Chat {
    id: string
    chatName: string
    createdOn: Timestamp
    lastMessage: LastMessage
    lastUpdatedOn: Timestamp
    users: string[]

    constructor(id: string, chatName: string, createdOn: Timestamp, lastMessage: LastMessage, lastUpdatedOn: Timestamp, users: string[]) {
        this.id = id
        this.chatName = chatName
        this.createdOn = createdOn
        this.lastMessage = lastMessage
        this.lastUpdatedOn = lastUpdatedOn
        this.users = users
    }
}

export const ChatConverter = {
    toFirestore: (chat: Chat) => {
        return {
            chatName: chat.chatName,
            createdOn: chat.createdOn,
            lastMessage: chat.lastMessage,
            lastUpdatedOn: chat.lastUpdatedOn,
            users: chat.users
        }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options)
        const id = snapshot.id
        return new Chat(id, data.chatName, data.createdOn, data.lastMessage, data.lastUpdatedOn, data.users)
    }
}
